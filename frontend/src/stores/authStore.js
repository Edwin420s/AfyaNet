import { create } from 'zustand';
import { connectWallet } from '../utils/web3';

const useAuthStore = create((set) => ({
  user: null,
  contract: null,
  provider: null,
  isLoading: false,
  error: null,
  
  connect: async () => {
    set({ isLoading: true, error: null });
    try {
      const { provider, signer, address, contract } = await connectWallet();
      set({ 
        user: { address, signer },
        contract,
        provider,
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  disconnect: () => {
    set({ user: null, contract: null, provider: null });
  }
}));

export default useAuthStore;