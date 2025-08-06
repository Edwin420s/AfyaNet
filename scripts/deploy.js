const { ethers, upgrades } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  // Deploy PatientRecords
  const PatientRecords = await ethers.getContractFactory('PatientRecords');
  const patientRecords = await PatientRecords.deploy();
  await patientRecords.deployed();
  console.log('PatientRecords deployed to:', patientRecords.address);
  
  // Deploy HospitalRegistry
  const HospitalRegistry = await ethers.getContractFactory('HospitalRegistry');
  const hospitalRegistry = await HospitalRegistry.deploy();
  await hospitalRegistry.deployed();
  console.log('HospitalRegistry deployed to:', hospitalRegistry.address);
  
  // Save addresses to a config file
  const config = {
    patientRecordsAddress: patientRecords.address,
    hospitalRegistryAddress: hospitalRegistry.address,
    network: network.name
  };
  
  const configPath = path.join(__dirname, '../frontend/src/config/contracts.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });