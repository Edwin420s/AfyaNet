import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { PatientRecordsABI } from '../contracts/PatientRecordsABI';
import { formatAddress } from '../utils/web3';
import { format } from 'date-fns';

const TreatmentRecords = () => {
  const { address } = useAccount();
  const [treatments, setTreatments] = useState([]);
  const [newTreatment, setNewTreatment] = useState({
    patientAddress: '',
    recordId: '',
    diagnosis: '',
    prescription: '',
    notes: ''
  });

  const { data: hospitalRecords } = useContractRead({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'getHospitalRecords',
    args: [address],
    enabled: !!address,
    watch: true
  });

  const { write: submitTreatment } = useContractWrite({
    address: import.meta.env.VITE_CONTRACT_ADDRESS,
    abi: PatientRecordsABI,
    functionName: 'submitTreatmentRecord',
    onSuccess: () => {
      setNewTreatment({
        patientAddress: '',
        recordId: '',
        diagnosis: '',
        prescription: '',
        notes: ''
      });
    }
  });

  useEffect(() => {
    if (hospitalRecords) {
      setTreatments(hospitalRecords);
    }
  }, [hospitalRecords]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitTreatment({
      args: [
        newTreatment.patientAddress,
        parseInt(newTreatment.recordId),
        newTreatment.diagnosis,
        newTreatment.prescription,
        newTreatment.notes
      ]
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 dark:text-white">Treatment Records</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-2 dark:text-white">Submit New Treatment</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Patient Address
              </label>
              <input
                type="text"
                value={newTreatment.patientAddress}
                onChange={(e) => setNewTreatment({...newTreatment, patientAddress: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Record ID
              </label>
              <input
                type="number"
                value={newTreatment.recordId}
                onChange={(e) => setNewTreatment({...newTreatment, recordId: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Diagnosis
              </label>
              <input
                type="text"
                value={newTreatment.diagnosis}
                onChange={(e) => setNewTreatment({...newTreatment, diagnosis: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prescription
              </label>
              <textarea
                value={newTreatment.prescription}
                onChange={(e) => setNewTreatment({...newTreatment, prescription: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={newTreatment.notes}
                onChange={(e) => setNewTreatment({...newTreatment, notes: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Submit Treatment Record
            </button>
          </form>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2 dark:text-white">Previous Treatments</h3>
          {treatments.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No treatment records found</p>
          ) : (
            <div className="space-y-4">
              {treatments.map((treatment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium dark:text-white">
                        Patient: {formatAddress(treatment.patient)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Record ID: {treatment.recordId.toString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(treatment.timestamp * 1000), 'MMM d, yyyy')}
                    </p>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium dark:text-white">Diagnosis:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{treatment.diagnosis}</p>
                  </div>
                  
                  {treatment.prescription && (
                    <div className="mt-2">
                      <p className="text-sm font-medium dark:text-white">Prescription:</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{treatment.prescription}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreatmentRecords;