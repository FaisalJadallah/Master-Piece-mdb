import React, { useState } from 'react';
import axios from 'axios';
import { FaUpload, FaSpinner } from 'react-icons/fa';

const API_URL = 'http://localhost:5000';

const FileUploader = ({ onFileUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
      
      // Reset error state
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    
    // Create form data
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Call the callback with the uploaded file URL
      onFileUploaded(response.data.fileUrl);
      
      // Reset the component state
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-750 p-4 rounded-lg border border-gray-700">
      <div className="flex flex-col items-center space-y-4">
        {previewUrl && (
          <div className="w-full max-w-xs mb-2">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-auto rounded-md object-cover"
              style={{ maxHeight: '150px' }}
            />
          </div>
        )}
        
        <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
          <FaUpload className="text-2xl mb-2" />
          <span className="mt-2 text-base">Select an image</span>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </label>
        
        {selectedFile && (
          <div className="text-sm text-gray-300 truncate max-w-full">
            {selectedFile.name}
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
            !selectedFile || loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-[#8B5DFF] hover:bg-[#6A42C2]'
          }`}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            'Upload'
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUploader; 