import fs from 'fs';
import path from 'path';

// This script generates ABI files for the frontend from actual deployed contracts

// Path to the deployed contract
const deployedContractPath = path.join(process.cwd(), '..', 'fhevm-hardhat-template', 'deployments', 'localhost', 'AnonymousCheckIn.json');

// Read the deployed contract data
let contractData;
try {
  const contractFile = fs.readFileSync(deployedContractPath, 'utf8');
  contractData = JSON.parse(contractFile);
  console.log('✅ Loaded contract from:', deployedContractPath);
  console.log('Contract address:', contractData.address);
} catch (error) {
  console.error('❌ Error loading deployed contract:', error.message);
  console.log('Using fallback ABI...');
  
  // Fallback ABI in case the deployed contract file is not found
  contractData = {
    address: "0x5f923FB956d0E7550D3fE836988edC9d32D07e67", // From contract-info.json
    abi: [
      "constructor()",
      "event CheckInSessionCreated(uint256 indexed,address indexed,string,uint256,uint256)",
      "event SessionEnded(uint256 indexed,address indexed)",
      "event UserCheckedIn(uint256 indexed,address indexed,uint256)",
      "function batchCheckIn(uint256[],bytes32[],bytes[])",
      "function checkIn(uint256,bytes32,bytes)",
      "function compareUserScores(address,address) returns (bytes32)",
      "function createCheckInSession(string,string,uint256) returns (uint256)",
      "function emergencyPause()",
      "function emergencyUnpause()",
      "function endCheckInSession(uint256)",
      "function getActiveSessionsCount() view returns (uint256)",
      "function getEncryptedCheckInData(uint256,address) view returns (bytes32)",
      "function getEncryptedParticipantCount(uint256) view returns (bytes32)",
      "function getEncryptedUserScore(address) view returns (bytes32)",
      "function getSessionInfo(uint256) view returns ((address,string,string,uint256,uint256,bool,uint256))",
      "function getTotalSessions() view returns (uint256)",
      "function isParticipantCountAboveThreshold(uint256,bytes32,bytes) returns (bytes32)",
      "function isUserCheckedIn(uint256,address) view returns (bytes32)",
      "function nextSessionId() view returns (uint256)",
      "function protocolId() pure returns (uint256)",
      "function sessions(uint256) view returns (address,string,string,uint256,uint256,bool,uint256)"
    ]
  };
}

// Extract the ABI from the contract data
const contractABI = contractData.abi;

// Write ABI to file
const abiPath = path.join(process.cwd(), 'abi', 'AnonymousCheckIn.json');
const abiDir = path.dirname(abiPath);

if (!fs.existsSync(abiDir)) {
  fs.mkdirSync(abiDir, { recursive: true });
}

fs.writeFileSync(abiPath, JSON.stringify(contractABI, null, 2));
console.log('✅ ABI generated successfully at:', abiPath);
