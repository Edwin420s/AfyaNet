import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Take Control of Your <span className="text-blue-600">Medical Records</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
            AfyaNet gives you complete ownership of your health data using blockchain technology.
            Secure, private, and always accessible.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-lg transition-colors"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-lg text-lg border border-gray-200 dark:border-gray-700 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

        <div id="features" className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-blue-500 text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Secure Storage</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your medical records are encrypted and stored on decentralized IPFS network.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-blue-500 text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Instant Access</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Share your records with healthcare providers instantly when needed.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <div className="text-blue-500 text-4xl mb-4">🔑</div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">Full Control</h3>
            <p className="text-gray-600 dark:text-gray-300">
              You decide who can access your data and for how long.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;