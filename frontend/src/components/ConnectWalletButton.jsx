import { useWeb3Modal } from '@web3modal/react';
import { useAccount, useDisconnect } from 'wagmi';
import { formatAddress } from '../utils/web3';
import LoadingSpinner from './LoadingSpinner';

const ConnectWalletButton = () => {
  const { open } = useWeb3Modal();
  const { address, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnecting) {
    return (
      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center">
        <LoadingSpinner size="sm" color="gray" className="mr-2" />
        Connecting...
      </button>
    );
  }

  if (address) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
      >
        Disconnect {formatAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
    >
      Connect Wallet
    </button>
  );
};

export default ConnectWalletButton;