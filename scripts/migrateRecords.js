const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');
const { Web3Storage } = require('web3.storage');

async function main() {
  // Initialize clients
  const oldClient = new Web3Storage({ token: process.env.OLD_WEB3_STORAGE_TOKEN });
  const newClient = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });
  
  // Get contract instance
  const PatientRecords = await ethers.getContractFactory('PatientRecords');
  const patientRecords = await PatientRecords.attach(process.env.CONTRACT_ADDRESS);
  
  // Get all patients
  const filter = patientRecords.filters.RecordAdded();
  const events = await patientRecords.queryFilter(filter);
  const patients = [...new Set(events.map(e => e.args.patient))];
  
  // Process each patient
  for (const patient of patients) {
    console.log(`Migrating records for ${patient}`);
    const records = await patientRecords.getRecords(patient);
    
    // Process each record
    for (const record of records) {
      try {
        console.log(`Migrating record ${record.ipfsCID}`);
        
        // Download from old storage
        const res = await oldClient.get(record.ipfsCID);
        if (!res.ok) throw new Error(`Failed to get ${record.ipfsCID}`);
        const files = await res.files();
        
        // Upload to new storage
        const newCid = await newClient.put(files);
        console.log(`Migrated to new CID: ${newCid}`);
        
        // Update contract reference
        if (newCid !== record.ipfsCID) {
          const tx = await patientRecords
            .connect(await ethers.getSigner())
            .updateRecordCID(patient, record.ipfsCID, newCid);
          await tx.wait();
          console.log(`Contract updated in tx ${tx.hash}`);
        }
      } catch (error) {
        console.error(`Failed to migrate ${record.ipfsCID}:`, error);
        // Log failures to file
        fs.appendFileSync(
          path.join(__dirname, 'migration_errors.log'),
          `${new Date().toISOString()} | ${patient} | ${record.ipfsCID} | ${error.message}\n`
        );
      }
    }
  }
  
  console.log('Migration complete');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });