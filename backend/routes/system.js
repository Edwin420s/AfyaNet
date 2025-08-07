import express from 'express';
import { getContractStatus } from '../services/contractMonitor';
import { healthCheck as ipfsHealthCheck } from '../services/ipfsService';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const contractStatus = await getContractStatus();
    const ipfsStatus = await ipfsHealthCheck();
    
    res.json({
      ...contractStatus,
      ipfs: ipfsStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      status: 'unhealthy'
    });
  }
});

export default router;