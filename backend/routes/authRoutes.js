import express from 'express';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { createClient } from 'redis';

const router = express.Router();
const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

// Wallet signature verification
router.post('/verify', async (req, res) => {
  try {
    const { address, signature, nonce } = req.body;
    
    // Verify nonce
    const storedNonce = await redisClient.get(`nonce:${address}`);
    if (nonce !== storedNonce) {
      return res.status(401).json({ error: 'Invalid nonce' });
    }
    
    // Verify signature
    const recoveredAddress = ethers.utils.verifyMessage(
      `AfyaNet Auth: ${nonce}`,
      signature
    );
    
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { address },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Clear used nonce
    await redisClient.del(`nonce:${address}`);
    
    res.json({ token });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Generate nonce for signing
router.post('/nonce', async (req, res) => {
  const { address } = req.body;
  const nonce = Math.floor(Math.random() * 1000000).toString();
  
  await redisClient.setEx(
    `nonce:${address}`,
    300,
    nonce
  );
  
  res.json({ nonce });
});

export default router;