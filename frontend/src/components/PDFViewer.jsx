import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ fileData }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const blob = new Blob([fileData], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfData(url);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();

    return () => {
      if (pdfData) {
        URL.revokeObjectURL(pdfData);
      }
    };
  }, [fileData]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-700 p-2 flex justify-between items-center">
        <div>
          <button
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-white dark:bg-gray-600 rounded mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-white dark:bg-gray-600 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Page {pageNumber} of {numPages}
        </p>
      </div>
      
      <div className="flex justify-center bg-white dark:bg-gray-800 p-4">
        {pdfData && (
          <Document
            file={pdfData}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="text-gray-500">Loading PDF...</div>}
            error={<div className="text-red-500">Failed to load PDF</div>}
          >
            <Page 
              pageNumber={pageNumber} 
              width={800}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={<div className="text-gray-500">Loading page...</div>}
            />
          </Document>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;