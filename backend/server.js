import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import { Web3Storage } from 'web3.storage';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Redis client
const redisClient = createClient({
  url: process.env.REDIS_URL
});
redisClient.on('error', err => console.log('Redis Client Error', err));
await redisClient.connect();

// Web3.Storage client
const web3Storage = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });

// Routes
app.get('/api/record/:cid', async (req, res) => {
  try {
    // Check cache first
    const cachedData = await redisClient.get(`record:${req.params.cid}`);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    
    // Fetch from IPFS if not in cache
    const record = await web3Storage.get(req.params.cid);
    if (!record.ok) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    // Cache for future requests (24h TTL)
    const files = await record.files();
    const fileData = await files[0].text();
    
    await redisClient.setEx(
      `record:${req.params.cid}`,
      86400,
      JSON.stringify({ data: fileData })
    );
    
    res.json({ data: fileData });
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});