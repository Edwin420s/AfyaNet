export const detectFileType = (file) => {
  if (!file) return null;

  // Check file signature (magic numbers)
  const signature = new Uint8Array(file.slice(0, 4));
  const hexSignature = Array.from(signature)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();

  // PDF: %PDF
  if (hexSignature.startsWith('25504446')) return 'pdf';
  
  // PNG: \x89PNG
  if (hexSignature.startsWith('89504E47')) return 'png';
  
  // JPEG: \xFF\xD8\xFF
  if (hexSignature.startsWith('FFD8FF')) return 'jpeg';
  
  // Fallback to extension
  const extension = file.name?.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf': return 'pdf';
    case 'png': return 'png';
    case 'jpg':
    case 'jpeg': return 'jpeg';
    case 'gif': return 'gif';
    case 'txt': return 'text';
    default: return 'unknown';
  }
};

export const getFileIcon = (fileType) => {
  switch (fileType) {
    case 'pdf': return '📄';
    case 'png':
    case 'jpeg':
    case 'gif': return '🖼️';
    case 'text': return '📝';
    default: return '📁';
  }
};

export const getFileTypeName = (fileType) => {
  switch (fileType) {
    case 'pdf': return 'PDF Document';
    case 'png': return 'PNG Image';
    case 'jpeg': return 'JPEG Image';
    case 'gif': return 'GIF Image';
    case 'text': return 'Text File';
    default: return 'Unknown File';
  }
};