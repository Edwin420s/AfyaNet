const { expect } = require('chai');
const request = require('supertest');
const app = require('../../backend/server');
const { redisClient } = require('../../backend/services/ipfsService');

describe('Auth Routes', function() {
  const testAddress = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  
  afterEach(async function() {
    await redisClient.del(`nonce:${testAddress}`);
  });

  it('should generate a nonce for an address', async function() {
    const res = await request(app)
      .post('/api/auth/nonce')
      .send({ address: testAddress });
    
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('nonce');
    expect(res.body.nonce).to.be.a('string');
    
    // Verify nonce was stored in Redis
    const storedNonce = await redisClient.get(`nonce:${testAddress}`);
    expect(storedNonce).to.equal(res.body.nonce);
  });

  it('should reject invalid signatures', async function() {
    // First get a nonce
    const nonceRes = await request(app)
      .post('/api/auth/nonce')
      .send({ address: testAddress });
    
    const res = await request(app)
      .post('/api/auth/verify')
      .send({
        address: testAddress,
        signature: '0xinvalid123',
        nonce: nonceRes.body.nonce
      });
    
    expect(res.status).to.equal(401);
    expect(res.body.error).to.equal('Invalid signature');
  });
});