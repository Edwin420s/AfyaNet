const { ethers, upgrades } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Upgrading contracts with the account:', deployer.address);

  // Upgrade PatientRecords
  const PatientRecordsV2 = await ethers.getContractFactory('PatientRecordsV2');
  const patientRecords = await upgrades.upgradeProxy(
    process.env.PATIENT_RECORDS_ADDRESS,
    PatientRecordsV2
  );
  console.log('PatientRecords upgraded at:', patientRecords.address);

  // Save new ABI
  const configPath = path.join(__dirname, '../frontend/src/config/contracts.json');
  const config = JSON.parse(fs.readFileSync(configPath));
  config.patientRecordsAddress = patientRecords.address;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log('Contracts upgraded successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });