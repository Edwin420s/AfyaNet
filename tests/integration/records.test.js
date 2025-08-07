const { expect } = require('chai');
const request = require('supertest');
const app = require('../../backend/server');
const { redisClient } = require('../../backend/services/ipfsService');
const { ethers } = require('ethers');

describe('Records API', function() {
  this.timeout(10000);
  
  const testWallet = ethers.Wallet.createRandom();
  const testFileName = 'test-record.txt';
  const testFileData = 'Test medical record content';
  
  let testCid;

  before(async () => {
    // Store a test record
    const res = await request(app)
      .post('/api/records')
      .send({
        fileData: testFileData,
        fileName: testFileName,
        patientAddress: testWallet.address,
        signature: await testWallet.signMessage(`AfyaNet: Upload ${testFileName}`)
      });
    
    testCid = res.body.cid;
  });

  after(async () => {
    await redisClient.del(`record:${testCid}`);
    await redisClient.del(`metadata:${testCid}`);
  });

  it('should retrieve stored record with valid signature', async () => {
    const message = `AfyaNet: Access ${testCid}`;
    const signature = await testWallet.signMessage(message);
    
    const res = await request(app)
      .get(`/api/records/${testCid}`)
      .query({
        patientAddress: testWallet.address,
        requesterAddress: testWallet.address,
        signature
      });
    
    expect(res.status).to.equal(200);
    expect(res.body.data).to.equal(testFileData);
    expect(res.body.metadata.name).to.equal(testFileName);
  });

  it('should reject invalid signatures', async () => {
    const wrongWallet = ethers.Wallet.createRandom();
    const message = `AfyaNet: Access ${testCid}`;
    const signature = await wrongWallet.signMessage(message);
    
    const res = await request(app)
      .get(`/api/records/${testCid}`)
      .query({
        patientAddress: testWallet.address,
        requesterAddress: wrongWallet.address,
        signature
      });
    
    expect(res.status).to.equal(403);
    expect(res.body.error).to.equal('Access denied');
  });
});