import { useState, useEffect } from 'react';
import { useProvider } from 'wagmi';

const ENSName = ({ address }) => {
  const [ensName, setEnsName] = useState(null);
  const provider = useProvider();

  useEffect(() => {
    const resolveENS = async () => {
      if (address && provider) {
        try {
          // Reverse resolve ENS name
          const name = await provider.lookupAddress(address);
          if (name) {
            setEnsName(name);
          }
        } catch (error) {
          console.error('ENS resolution error:', error);
        }
      }
    };

    resolveENS();
  }, [address, provider]);

  if (ensName) {
    return (
      <span className="font-mono" title={address}>
        {ensName}
      </span>
    );
  }

  return (
    <span className="font-mono" title={address}>
      {address.substring(0, 6)}...{address.substring(address.length - 4)}
    </span>
  );
};

export default ENSName;