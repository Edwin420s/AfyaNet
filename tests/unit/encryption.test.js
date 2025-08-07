const { expect } = require('chai');
const { generateKey, encryptData, decryptData } = require('../../backend/utils/encryption');

describe('Encryption Utilities', () => {
  const testPassword = 'test-password-123';
  const testSalt = 'test-salt';
  const testData = 'Sensitive medical data';

  it('should generate a consistent key from password and salt', async () => {
    const key1 = await generateKey(testPassword, testSalt);
    const key2 = await generateKey(testPassword, testSalt);
    
    expect(key1).to.be.a('string');
    expect(key1).to.equal(key2);
  });

  it('should encrypt and decrypt data successfully', async () => {
    const key = await generateKey(testPassword, testSalt);
    const { iv, encryptedData } = await encryptData(testData, key);
    
    expect(iv).to.be.a('string');
    expect(encryptedData).to.be.a('string');
    
    const decrypted = await decryptData(encryptedData, key, iv);
    expect(decrypted).to.equal(testData);
  });

  it('should fail to decrypt with wrong key', async () => {
    const key = await generateKey(testPassword, testSalt);
    const wrongKey = await generateKey('wrong-password', testSalt);
    const { iv, encryptedData } = await encryptData(testData, key);
    
    try {
      await decryptData(encryptedData, wrongKey, iv);
      expect.fail('Should have thrown error');
    } catch (error) {
      expect(error).to.be.an('error');
    }
  });
});