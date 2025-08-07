import { useAccount, useContractRead } from 'wagmi';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HealthMetrics = () => {
  const { address } = useAccount();

  const { data: healthData = [] } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'getHealthMetrics',
    args: [address],
    enabled: !!address,
    watch: true
  });

  const processData = (rawData) => {
    return rawData.map(entry => ({
      date: new Date(entry.timestamp * 1000).toLocaleDateString(),
      value: parseInt(entry.value),
      metric: entry.metricType
    }));
  };

  const bloodPressureData = processData(
    healthData.filter(d => d.metricType === 'BP')
  );
  const heartRateData = processData(
    healthData.filter(d => d.metricType === 'HR')
  );
  const glucoseData = processData(
    healthData.filter(d => d.metricType === 'GL')
  );

  const renderChart = (data, title, unit) => {
    if (data.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-2 dark:text-white">{title}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: unit, angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3A86FF" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Health Metrics</h2>
      
      {healthData.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No health metrics recorded</p>
      ) : (
        <div>
          {renderChart(bloodPressureData, 'Blood Pressure', 'mmHg')}
          {renderChart(heartRateData, 'Heart Rate', 'bpm')}
          {renderChart(glucoseData, 'Blood Glucose', 'mg/dL')}
        </div>
      )}
    </div>
  );
};

export default HealthMetrics;