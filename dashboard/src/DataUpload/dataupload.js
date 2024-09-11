import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import sampleData from './sampleData.json';
import contractABI from './abi.json';

// Replace with your contract address
const contractAddress = '0x450c6269f20e3163d5ed6eae428c33e7b7ab5495';

const FileUpload = () => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const interval = setInterval(async () => {
      setStatus('Uploading data...');
      try {
        // Check if MetaMask is installed
        if (window.ethereum) {
          // Initialize Web3
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          // Get the default account
          const accounts = await web3.eth.getAccounts();
          const account = accounts[0];

          // Initialize contract
          const contract = new web3.eth.Contract(contractABI, contractAddress);

          // Send sample data to the contract
          for (let item of sampleData) {
            await contract.methods.addData(
              item.plateNumber,
              item.deviceSerialNumber,
              item.speed,
              item.location,
              item.videoID,
              item.imageID,
              item.alcoholLevel,
              item.fuelConsumption
            ).send({ from: account });
          }

          setStatus('Data uploaded successfully!');
        } else {
          setStatus('MetaMask is not installed.');
        }
      } catch (error) {
        console.error(error);
        setStatus('Failed to upload data.');
      }
    }, 30000); // 30 seconds interval

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <p>{status}</p>
    </div>
  );
};

export default FileUpload;
