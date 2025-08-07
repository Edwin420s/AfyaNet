import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import { Web3Storage } from 'web3.storage';
import dotenv from 'dotenv';
import morgan from 'morgan';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Redis client
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.on('error', err => console.log('Redis Client Error', err));
await redisClient.connect();

// Web3.Storage client
const web3Storage = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });

// Routes
app.get('/api/record/:cid', async (req, res) => {
  try {
    const cached = await redisClient.get(`record:${req.params.cid}`);
    if (cached) return res.json(JSON.parse(cached));
    
    const record = await web3Storage.get(req.params.cid);
    if (!record.ok) return res.status(404).json({ error: 'Record not found' });
    
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

app.post('/api/notify', async (req, res) => {
  try {
    const { patientAddress, hospitalAddress, recordId } = req.body;
    
    // In production: Verify signature and send notification
    console.log(`Access requested for record ${recordId} by ${hospitalAddress}`);
    
    res.json({ success: true, message: 'Notification queued' });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Notification failed' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});