import React, { useState } from 'react';
import { Container, Box, Button, Grid, TextField, Link, CircularProgress } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { EnhancedModal } from './common/Modal';
import { ipfs } from '../helpers/ipfs';
import algosdk, { waitForConfirmation } from 'algosdk';

// TODO1: Create a constant for the public gateway URL to retrieve uploaded images from IPFS
const PUBLIC_GATEWAY_URL = 'https://gateway.pinata.cloud/ipfs/';
const ALGO_EXPLORER_ASSET_URL = 'https://testnet.algoexplorer.io/asset/';

// TODO2: create some constants for mint NFT
const DEFAULT_FROZEN = false;
const MANAGER_ADDRESS = undefined;
const RESERVE_ADDRESS = undefined;
const FREEZE_ADDRESS = undefined;
const CLAWBACK_ADDRESS = undefined;

const style = {
  container: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 6,
  },
  headingContainer: {
    mb: 2,
  },
  containerPadding: {
    p: 2,
  },
};


const FileUpload = (props) => {
  const [image, setImage] = useState(null);
  const [imageHash, setImageHash] = useState(null);
  const [modalStatus, setModalStatus] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [unitName, setUnitName] = useState('');
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState(1);
  const [tokenDecimalPlace, setTokenDecimalPlace] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tokenId, setTokenId] = useState(null);

  // TODO4: create a function to take user inputs and mint the NFT
  const mintNft = async () => {
    try {
      setLoading(true)
      const suggestedParams = await props.algoClient.getTransactionParams().do();

      const tokenURL = PUBLIC_GATEWAY_URL + imageHash;

      const transaction = algosdk.makeAssetCreateTxnWithSuggestedParams(
        props.account,
        new Uint8Array(Buffer.from(note)),
        amount,
        tokenDecimalPlace,
        DEFAULT_FROZEN,
        MANAGER_ADDRESS,
        RESERVE_ADDRESS,
        FREEZE_ADDRESS,
        CLAWBACK_ADDRESS,
        unitName,
        tokenName,
        tokenURL,
        imageHash.path,
        suggestedParams
      )
      const transactionDetails = [{ txn: transaction, signers: [props.account] }];

      const signedTx = await props.wallet.signTransaction([transactionDetails]);
      console.log(signedTx);

      const { txId } = await props.algoClient.sendRawTransaction(signedTx).do();
      console.log(txId);

      const result = await waitForConfirmation(props.algoClient, txId, 5);

      alert(`An NFT is minted with assetID: ${result['asset-index']}`);
      setTokenId(result['asset-index']);
      setLoading(false);
      setModalStatus(false);

    } catch (e) {
      setLoading(false);
      setModalStatus(false);
      alert(e);
    }
  }

  // TODO3: create handleUploadImage to use the ipfs hash to create the NFT
  const handleUploadImage = async (event) => {
    const imgObject = event.target.files[0]
    imgObject.preview = URL.createObjectURL(event.target.files[0]);
    setImage(imgObject);
    setLoading(true);
    try {
      const ipfsImage = await ipfs.add(imgObject);
      setImageHash(ipfsImage.path)
      setLoading(false);
      setModalStatus(true);
    } catch (e) {
      setLoading(false);
      console.error(e);
    }

  };

  let modalContent = (
    <Box>
      <Grid container spacing={3} sx={style.containerPadding}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="token-name"
            name="token-name"
            label="Token Name (e.g. Awesome Token)"
            fullWidth
            variant="standard"
            onChange={(e) => setTokenName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="unit-name"
            name="unit-name"
            label="Unit Name (e.g. AWE)"
            fullWidth
            variant="standard"
            onChange={(e) => setUnitName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="quantity"
            name="quantity"
            label="Number of Tokens"
            fullWidth
            variant="standard"
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="decimal"
            name="decimal"
            label="Token Decimal Place"
            fullWidth
            variant="standard"
            onChange={(e) => setTokenDecimalPlace(parseInt(e.target.value))}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="note"
            name="note"
            label="Note"
            multiline
            fullWidth
            variant="standard"
            onChange={(e) => setNote(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="url"
            name="url"
            label="Token URL"
            fullWidth
            // Uncomment this to use the created constant
            defaultValue={`${PUBLIC_GATEWAY_URL}${imageHash}`}
            variant="standard"
            disabled
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{
      backgroundColor: 'background.default',
      display: 'flex', flexDirection: 'column',
      minHeight: 'calc(100% - 64px)'
    }}>
      <Container style={{
        margin: 'auto auto'
      }}
        maxWidth="md"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          px: {
            md: '130px !important'
          }
        }}>

        <EnhancedModal
          dialogTitle='Mint NFT'
          dialogContent={modalContent}
          isOpen={modalStatus}
          onSubmit={mintNft}
          onClose={() => { setModalStatus(false); }}
          options={{
            swapButtonColors: false,
            submitButtonName: 'Mint',
            closeButtonName: 'Cancel',
          }}
        />

        {image?.preview && (
          <div>
            <img className="preview my20" src={image?.preview} alt="" />
          </div>
        )}

        {/* Uncomment this to use provide link for user to check NFT */}
        {tokenId && (
          <Link href={`${ALGO_EXPLORER_ASSET_URL}${tokenId}`} underline="none" target="_blank" el="noopener noreferrer">
            Check Your NFT on Algo Explorer
          </Link>)}

        <input
          style={{ display: 'none' }}
          accept="image/*"
          id={`file-upload`}
          type="file"
          onChange={handleUploadImage}
        />
        <label htmlFor={`file-upload`}>
          <Button
            disabled={loading}
            component="span"
            size="small"
            startIcon={loading ? null : <FileUploadIcon />}
            sx={{
              backgroundColor: "#00554E",
              color: "white",
              width: 200,
              height: 50,
              borderRadius: 5,
              margin: 5,
              ':hover': {
                bgcolor: 'black',
              },
            }}
          >
            {loading ? <CircularProgress disableShrink sx={{ color: "white" }} />
              : "Upload Image"}
          </Button>
        </label>



      </Container>
    </Box>
  )
}

export default FileUpload;
