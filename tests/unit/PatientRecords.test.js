const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('PatientRecords', function () {
  let PatientRecords;
  let patientRecords;
  let owner;
  let patient;
  let hospital;

  beforeEach(async function () {
    [owner, patient, hospital] = await ethers.getSigners();
    
    PatientRecords = await ethers.getContractFactory('PatientRecords');
    patientRecords = await PatientRecords.deploy();
    await patientRecords.deployed();
    
    // Register a hospital
    await patientRecords.connect(owner).registerHospital(hospital.address);
  });

  it('Should allow patients to add records', async function () {
    await expect(
      patientRecords.connect(patient).addRecord('QmTestCID', 'test_type', false)
    ).to.emit(patientRecords, 'RecordAdded')
     .withArgs(patient.address, 'QmTestCID');
    
    const records = await patientRecords.getRecords(patient.address);
    expect(records.length).to.equal(1);
    expect(records[0].ipfsCID).to.equal('QmTestCID');
  });

  it('Should allow patients to grant access to hospitals', async function () {
    // Add a record first
    await patientRecords.connect(patient).addRecord('QmTestCID', 'test_type', false);
    
    await expect(
      patientRecords.connect(patient).grantAccess(hospital.address, 0, 3600)
    ).to.emit(patientRecords, 'AccessGranted')
     .withArgs(patient.address, hospital.address, 0);
    
    // Verify the hospital can access the record
    const record = await patientRecords.connect(hospital).getRecord(patient.address, 0);
    expect(record.ipfsCID).to.equal('QmTestCID');
  });

  it('Should prevent unauthorized access', async function () {
    await patientRecords.connect(patient).addRecord('QmPrivate', 'private', false);
    
    await expect(
      patientRecords.connect(hospital).getRecord(patient.address, 0)
    ).to.be.revertedWith('Access denied');
  });
});