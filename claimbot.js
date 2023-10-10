const Web3 = require('web3');

// Replace with your Ethereum wallet's private key and provider URL
const privateKey = 'YOUR_PRIVATE_KEY';
const providerUrl = 'YOUR_PROVIDER_URL';

const web3 = new Web3(providerUrl);

const senderAddress = 'YOUR_SENDER_ADDRESS';
const recipientAddress = 'RECIPIENT_ADDRESS'; // Replace with the recipient's address

const sendAmount = web3.utils.toWei('0.0005', 'ether'); // Convert 0.0005 Ether to Wei
const totalToSend = web3.utils.toWei('0.03', 'ether'); // Convert 0.03 Ether to Wei

const interval = 2000; // 2 seconds
const restartInterval = 10 * 60 * 1000; // 10 minutes in milliseconds

const sendTransaction = async () => {
  try {
    const nonce = await web3.eth.getTransactionCount(senderAddress);
    const gasPrice = await web3.eth.getGasPrice();

    const gasEstimate = await web3.eth.estimateGas({
      from: senderAddress,
      to: recipientAddress,
      value: sendAmount,
      nonce: nonce,
      gasPrice: gasPrice,
    });

    const tx = {
      from: senderAddress,
      to: recipientAddress,
      value: sendAmount,
      nonce: nonce,
      gasPrice: gasPrice,
      gas: gasEstimate, // Add the `gas` parameter here
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`Transaction hash: ${receipt.transactionHash}`);

    if (web3.utils.toBN(receipt.cumulativeGasUsed).lt(web3.utils.toBN(totalToSend))) {
      setTimeout(sendTransaction, interval);
    } else {
      console.log('Total amount sent.');
    }
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
};

// Initial call to start sending transactions
sendTransaction();

// Set up an interval to restart the transaction-sending process every 10 minutes
setInterval(() => {
  console.log('Restarting transaction sending...');
  sendTransaction();
}, restartInterval);
