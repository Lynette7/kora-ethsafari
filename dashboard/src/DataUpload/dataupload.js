import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import sampleData from './sampleData.json';
import contractABI from './abi.json';

const contractAddress = '0x450c6269f20e3163d5ed6eae428c33e7b7ab5495';

const FileUpload = () => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const interval = setInterval(async () => {
      setStatus('Uploading data...');
      try {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: 'eth_requestAccounts' });

          const accounts = await web3.eth.getAccounts();
          const account = accounts[0];

          const contract = new web3.eth.Contract(contractABI, contractAddress);

          function transformData(data) {
            return data.map(item => ({
                deviceSerialNumber: item.deviceSerial,
                speed: parseInt(item.speed),
                location: item.location,
                videoID: item.videoID,
                imageID: item.imageID,
                alcoholLevel: parseInt(item.alcoholLevel)
            }));
          }
          const transformedData = transformData(sampleData);

          transformedData.forEach(item => {
            contract.methods.set_data(
                item.deviceSerialNumber,
                item.speed,
                item.location,
                item.videoID,
                item.imageID,
                item.alcoholLevel
            ).send({ from: account, gas: 200000 });
        });

          // Send sample data to the contract
          // for (let item of sampleData) {
          //   await contract.methods.set_data(
          //     item.id,
          //     item.deviceSerialNumber,
          //     item.speed,
          //     item.location,
          //     item.videoID,
          //     item.imageID,
          //     item.alcoholLevel
          //   ).send({ from: account });
          // }

          setStatus('Data uploaded successfully!');
        } else {
          setStatus('MetaMask is not installed.');
        }
      } catch (error) {
        console.error(error);
        setStatus('Failed to upload data.');
      }
    }, 100000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>{status}</p>
    </div>
  );
};

export default FileUpload;
