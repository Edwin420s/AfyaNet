const { expect } = require('chai');
const { storeRecord, retrieveRecord } = require('../../backend/services/ipfsService');
const fs = require('fs');

describe('IPFS Service', function() {
  this.timeout(10000); // IPFS operations can take time
  
  let testCid;
  const testFile = {
    name: 'test.txt',
    buffer: Buffer.from('This is a test file for AfyaNet IPFS service')
  };

  it('should store a file on IPFS', async function() {
    testCid = await storeRecord(testFile.buffer, testFile.name);
    expect(testCid).to.be.a('string');
    expect(testCid.length).to.be.greaterThan(0);
  });

  it('should retrieve a file from IPFS', async function() {
    const retrieved = await retrieveRecord(testCid);
    expect(retrieved).to.have.property('data');
    expect(retrieved.data).to.equal(testFile.buffer.toString());
  });

  it('should cache retrieved files', async function() {
    // First retrieval (not cached)
    const start = Date.now();
    await retrieveRecord(testCid);
    const firstDuration = Date.now() - start;

    // Second retrieval (cached)
    const cachedStart = Date.now();
    await retrieveRecord(testCid);
    const cachedDuration = Date.now() - cachedStart;

    expect(cachedDuration).to.be.lessThan(firstDuration / 10); // Should be much faster
  });
});