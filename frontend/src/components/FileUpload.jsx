import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX } from 'react-icons/fi';

const FileUpload = ({ onUpload, isLoading }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);

    // Generate preview
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (file) {
      await onUpload(file);
      setFile(null);
      setPreview(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto text-2xl text-gray-400 mb-2" />
        <p className="text-gray-600">Drag & drop files here, or click to select</p>
        <p className="text-sm text-gray-500 mt-1">Supports PDF, JPG, PNG</p>
      </div>

      {file && (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium truncate">{file.name}</span>
            <button 
              onClick={removeFile}
              className="text-red-500 hover:text-red-700"
            >
              <FiX />
            </button>
          </div>
          
          {preview && (
            <div className="mt-2">
              <img 
                src={preview} 
                alt="Preview" 
                className="max-h-40 mx-auto rounded"
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={isLoading}
            className={`mt-4 w-full py-2 px-4 rounded-lg ${isLoading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
          >
            {isLoading ? 'Uploading...' : 'Upload Record'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;