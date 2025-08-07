import express from 'express';
import { storeRecord, retrieveRecord, getRecordMetadata } from '../services/ipfsService';
import { verifyHospitalSignature } from '../utils/contractHelpers';
import { encryptData } from '../utils/encryption';

const router = express.Router();

// Store encrypted record
router.post('/', async (req, res) => {
  try {
    const { fileData, fileName, patientAddress, signature } = req.body;
    
    // Verify signature
    const message = `AfyaNet: Upload ${fileName}`;
    const isVerified = await verifyHospitalSignature(patientAddress, signature, message);
    if (!isVerified) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Encrypt data (in production, use patient's derived key)
    const encryptionKey = process.env.ENCRYPTION_KEY;
    const { iv, encryptedData } = await encryptData(fileData, encryptionKey);
    
    // Store on IPFS
    const cid = await storeRecord(Buffer.from(encryptedData, 'hex'), fileName);
    
    res.json({ 
      cid,
      iv,
      encrypted: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Record upload error:', error);
    res.status(500).json({ error: 'Failed to store record' });
  }
});

// Retrieve record with access verification
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { patientAddress, requesterAddress, signature } = req.query;
    
    // Verify access rights (simplified - in production, check blockchain)
    const message = `AfyaNet: Access ${cid}`;
    const isVerified = await verifyHospitalSignature(requesterAddress, signature, message);
    if (!isVerified) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get record
    const record = await retrieveRecord(cid);
    const metadata = await getRecordMetadata(cid);
    
    res.json({
      data: record.data,
      metadata: {
        ...metadata,
        accessedAt: new Date().toISOString(),
        accessedBy: requesterAddress
      }
    });
  } catch (error) {
    console.error('Record retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve record' });
  }
});

export default router;