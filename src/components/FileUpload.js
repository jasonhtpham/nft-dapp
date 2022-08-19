import React, { useState } from 'react';
import { Container, Box, Button, Grid, TextField, Link, CircularProgress } from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { EnhancedModal } from './common/Modal';
import { ipfs } from '../helpers/ipfs';
import algosdk, { waitForConfirmation } from 'algosdk';

const PUBLIC_GATEWAY_URL = 'https://gateway.pinata.cloud/ipfs/';
const ALGO_EXPLORER_ASSET_URL = 'https://testnet.algoexplorer.io/asset/';

// TODO1: create some constants for mint NFT

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

  // TODO3: create a function to take user inputs and mint the NFT
  const mintNft = async () => {

  }

  // TODO2: update handleUploadImage to use the ipfs hash to create the NFT
  const handleUploadImage = async (event) => {

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

        {tokenId && (
          <Link href={`${ALGO_EXPLORER_ASSET_URL}${tokenId}`} underline="none">
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
