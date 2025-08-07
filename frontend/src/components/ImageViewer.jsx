import { useState } from 'react';
import { FiZoomIn, FiZoomOut, FiRotateCw } from 'react-icons/fi';

const ImageViewer = ({ fileData, fileType }) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  useState(() => {
    const blob = new Blob([fileData], { type: fileType });
    const url = URL.createObjectURL(blob);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [fileData, fileType]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="bg-gray-100 dark:bg-gray-700 p-2 flex space-x-2">
        <button
          onClick={handleZoomIn}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title="Zoom In"
        >
          <FiZoomIn className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title="Zoom Out"
        >
          <FiZoomOut className="text-gray-700 dark:text-gray-300" />
        </button>
        <button
          onClick={handleRotate}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
          title="Rotate"
        >
          <FiRotateCw className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
      
      <div className="p-4 overflow-auto max-h-screen">
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Medical record"
            className="max-w-full"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease-in-out'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;