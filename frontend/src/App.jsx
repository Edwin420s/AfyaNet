import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { lineaTestnet } from 'wagmi/chains';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import HospitalPortal from './pages/HospitalPortal';
import UploadRecord from './pages/UploadRecord';
import ViewRecord from './pages/ViewRecord';
import AdminPanel from './pages/AdminPanel';

// Config
const chains = [lineaTestnet];
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hospital" element={<HospitalPortal />} />
            <Route path="/upload" element={<UploadRecord />} />
            <Route path="/record/:cid" element={<ViewRecord />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </BrowserRouter>
      </WagmiConfig>
      
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      <ToastContainer position="bottom-right" autoClose={5000} />
    </>
  );
}

export default App;