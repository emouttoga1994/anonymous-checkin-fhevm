import http from 'http';

const HARDHAT_NODE_URL = 'http://localhost:8545';

async function isHardhatNodeRunning() {
  return new Promise((resolve) => {
    const req = http.get(HARDHAT_NODE_URL, (res) => {
      resolve(true);
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  const isRunning = await isHardhatNodeRunning();
  
  if (!isRunning) {
    console.log('❌ Hardhat node is not running. Please start it with:');
    console.log('   cd ../fhevm-hardhat-template && npm run node');
    process.exit(1);
  }
  
  console.log('✅ Hardhat node is running');
}

main().catch(console.error);
