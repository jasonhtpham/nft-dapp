import React, { useCallback, useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Button, TextField } from '@mui/material';
import algosdk, { waitForConfirmation, encodeUint64 } from 'algosdk';

// The app ID on testnet
const appIndex = 103723509;

const SetNumber = (props) => {
  const [currentNumber, setCurrentNumber] = useState(null);

  const getCurrentNumber = useCallback(async () => {
    try {
      const app = await props.algoClient.getApplicationByID(appIndex).do();
      if (!!app.params['global-state'][0].value.uint) {
        setCurrentNumber(app.params['global-state'][0].value.uint);
      } else {
        setCurrentNumber(0);
      }
    } catch (e) {
      console.error('There was an error connecting to the algorand node: ', e)
    }
  }, [props.algoClient]);

  useEffect(() => {
    getCurrentNumber();
  }, [getCurrentNumber]);

  const setNumber = async () => {
    try {
      const numberToSet = parseInt(document.getElementById('number-to-set').value);

      const suggestedParams = await props.algoClient.getTransactionParams().do();
      const appArgs = [new Uint8Array(Buffer.from("set_number")), encodeUint64(numberToSet)];

      const transaction = algosdk.makeApplicationNoOpTxn(
        props.account,
        suggestedParams,
        appIndex,
        appArgs
      );

      const transactionDetails = [{ txn: transaction, signers: [props.account] }];

      const signedTx = await props.wallet.signTransaction([transactionDetails]);

      const { txId } = await props.algoClient.sendRawTransaction(signedTx).do();
      const result = await waitForConfirmation(props.algoClient, txId, 2);
      alert(`Result: ${JSON.stringify(result)}`);

      getCurrentNumber();

    } catch (e) {
      console.error(`There was an error calling the counter app: ${e}`);
    }
  }

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

        <Grid container direction="row" alignItems='center' justifyContent='center'>
          <Grid item>
            <Typography component="h6" variant='h6' sx={{ fontWeight: "bold", textAlign: 'center' }}>
              Current number
            </Typography>
            <Typography component="h6" variant='h6' sx={{ fontWeight: "bold", textAlign: 'center', color: "#16BCBC" }}>
              {currentNumber ?? "Loading..."}
            </Typography>
          </Grid>
        </Grid>

        <TextField
          id="number-to-set"
          label="Input a number"
          defaultValue="1"
          helperText="Your number will be sent to the smart contract"
        />

        <Button sx={{
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
          onClick={() => setNumber()}
        >
          Submit
        </Button>

      </Container>
    </Box>
  )
}

export default SetNumber;
