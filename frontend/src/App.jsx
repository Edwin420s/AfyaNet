import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Modal } from '@web3modal/react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { lineaTestnet } from 'wagmi/chains';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import HospitalPortal from './pages/HospitalPortal';
import UploadRecord from './pages/UploadRecord';
import RecordsViewer from './pages/RecordsViewer';

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
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hospital" element={<HospitalPortal />} />
            <Route path="/upload" element={<UploadRecord />} />
            <Route path="/records/:cid" element={<RecordsViewer />} />
          </Routes>
        </Router>
      </WagmiConfig>
      
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;