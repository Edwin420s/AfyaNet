const { ethers, upgrades } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  // Deploy HospitalRegistry
  const HospitalRegistry = await ethers.getContractFactory('HospitalRegistry');
  const hospitalRegistry = await HospitalRegistry.deploy();
  await hospitalRegistry.deployed();
  console.log('HospitalRegistry deployed to:', hospitalRegistry.address);

  // Deploy DataAudit
  const DataAudit = await ethers.getContractFactory('DataAudit');
  const dataAudit = await DataAudit.deploy();
  await dataAudit.deployed();
  console.log('DataAudit deployed to:', dataAudit.address);

  // Deploy EmergencyAccess
  const EmergencyAccess = await ethers.getContractFactory('EmergencyAccess');
  const emergencyAccess = await EmergencyAccess.deploy();
  await emergencyAccess.deployed();
  console.log('EmergencyAccess deployed to:', emergencyAccess.address);

  // Deploy PatientRecords
  const PatientRecords = await ethers.getContractFactory('PatientRecords');
  const patientRecords = await PatientRecords.deploy();
  await patientRecords.deployed();
  console.log('PatientRecords deployed to:', patientRecords.address);

  // Transfer ownership of supporting contracts to PatientRecords
  await dataAudit.transferOwnership(patientRecords.address);
  await emergencyAccess.transferOwnership(patientRecords.address);
  console.log('Ownership transferred for supporting contracts');

  // Save addresses to config file
  const config = {
    patientRecordsAddress: patientRecords.address,
    hospitalRegistryAddress: hospitalRegistry.address,
    emergencyAccessAddress: emergencyAccess.address,
    dataAuditAddress: dataAudit.address,
    network: network.name,
    deployerAddress: deployer.address,
    timestamp: new Date().toISOString()
  };

  const configPath = path.join(__dirname, '../frontend/src/config/contracts.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('Config saved to', configPath);

  // Verify contracts on Etherscan
  if (network.name !== 'hardhat') {
    console.log('Waiting for 30 seconds before verification...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    await run('verify:verify', {
      address: hospitalRegistry.address,
      constructorArguments: [],
    });

    await run('verify:verify', {
      address: dataAudit.address,
      constructorArguments: [],
    });

    await run('verify:verify', {
      address: emergencyAccess.address,
      constructorArguments: [],
    });

    await run('verify:verify', {
      address: patientRecords.address,
      constructorArguments: [],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });