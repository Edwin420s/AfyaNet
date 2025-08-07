const { expect } = require('chai');
const { ethers } = require('hardhat');
const { deployContracts } = require('../../scripts/deploy');

describe('Emergency Access', function() {
  let emergencyAccess;
  let owner, patient, doctor;

  before(async function() {
    [owner, patient, doctor] = await ethers.getSigners();
    const contracts = await deployContracts();
    emergencyAccess = await ethers.getContractAt(
      'EmergencyAccess',
      contracts.emergencyAccessAddress
    );
    
    // Add doctor as emergency responder
    await emergencyAccess.addEmergencyResponder(doctor.address);
  });

  it('should allow emergency access when approved', async function() {
    // Doctor requests access
    await emergencyAccess.connect(doctor).requestEmergencyAccess(patient.address, 3600);
    
    // Patient approves
    await emergencyAccess.connect(patient).approveEmergencyAccess(doctor.address);
    
    // Verify access
    const hasAccess = await emergencyAccess.hasEmergencyAccess(patient.address, doctor.address);
    expect(hasAccess).to.be.true;
  });

  it('should expire emergency access', async function() {
    // Doctor requests short-term access (1 second)
    await emergencyAccess.connect(doctor).requestEmergencyAccess(patient.address, 1);
    await emergencyAccess.connect(patient).approveEmergencyAccess(doctor.address);
    
    // Wait for expiry
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify access expired
    const hasAccess = await emergencyAccess.hasEmergencyAccess(patient.address, doctor.address);
    expect(hasAccess).to.be.false;
  });
});