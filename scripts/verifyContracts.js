const { run } = require('hardhat');

async function verify(contractAddress, args) {
  console.log(`Verifying contract at ${contractAddress}...`);
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log('Verification complete!');
  } catch (error) {
    if (error.message.toLowerCase().includes('already verified')) {
      console.log('Contract is already verified');
    } else {
      console.error('Verification failed:', error);
    }
  }
}

async function main() {
  const config = require('../frontend/src/config/contracts.json');
  
  // Verify PatientRecords
  await verify(config.patientRecordsAddress, []);

  // Verify HospitalRegistry
  await verify(config.hospitalRegistryAddress, []);

  // Verify EmergencyAccess
  await verify(config.emergencyAccessAddress, []);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });