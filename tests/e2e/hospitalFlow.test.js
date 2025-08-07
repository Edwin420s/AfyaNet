const { expect } = require('chai');
const { ethers } = require('hardhat');
const { deployContracts } = require('../../scripts/deploy');
const { PatientRecordsABI } = require('../../frontend/src/contracts');

describe('Hospital Workflow', function() {
  let patientRecords;
  let owner, patient, hospital;

  before(async function() {
    [owner, patient, hospital] = await ethers.getSigners();
    const contracts = await deployContracts();
    patientRecords = new ethers.Contract(
      contracts.patientRecordsAddress,
      PatientRecordsABI,
      owner
    );
    
    // Register hospital
    await patientRecords.registerHospital(hospital.address);
  });

  it('should allow hospital to view records with permission', async function() {
    // Patient adds record
    await patientRecords.connect(patient).addRecord('QmTest123', 'test/record', false);
    
    // Patient grants access
    await patientRecords.connect(patient).grantAccess(
      hospital.address,
      0, // First record
      3600, // 1 hour
      "Routine checkup"
    );
    
    // Hospital views record
    const record = await patientRecords.connect(hospital).getRecord(patient.address, 0);
    expect(record.ipfsCID).to.equal('QmTest123');
  });

  it('should prevent access after permission expiry', async function() {
    // Patient adds another record
    await patientRecords.connect(patient).addRecord('QmTest456', 'test/record2', false);
    
    // Patient grants temporary access (1 second)
    await patientRecords.connect(patient).grantAccess(
      hospital.address,
      1, // Second record
      1, // 1 second duration
      "Temporary access"
    );
    
    // Wait for permission to expire
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Hospital should not be able to access
    await expect(
      patientRecords.connect(hospital).getRecord(patient.address, 1)
    ).to.be.revertedWith('Access denied');
  });
});