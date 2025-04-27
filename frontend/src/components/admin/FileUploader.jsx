import React, { useState } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa';

const FileUploader = ({ onFileUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.match('image.*')) {
        setUploadError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
      setUploadError('');
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setUploadError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      console.log('Uploading file:', file.name);
      // Use the correct upload endpoint with query parameter
      const response = await axios.post('http://localhost:5000/upload?type=product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      
      console.log('Upload successful, response:', response.data);
      
      // Handle the response from the server
      if (response.data && (response.data.fileUrl || response.data.fullUrl)) {
        // Prefer the full URL if available, otherwise construct it
        const imageUrl = response.data.fullUrl || 
                         `http://localhost:5000${response.data.fileUrl}`;
        
        console.log('Image URL to use:', imageUrl);
        onFileUploaded(imageUrl);
        setUploadError('');
      } else {
        console.error('Unexpected response format:', response.data);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Upload error details:', error);
      
      if (error.response) {
        console.error('Server error response:', {
          status: error.response.status,
          data: error.response.data
        });
        setUploadError(`Failed to upload image: ${error.response.data?.message || error.response.statusText}`);
      } else {
        setUploadError(`Failed to upload image: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-750 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
      
      <div className="mb-4">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FaCloudUploadAlt className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileChange} 
            accept="image/*" 
          />
        </label>
      </div>
      
      {file && (
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-md overflow-hidden">
            <img 
              src={URL.createObjectURL(file)} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-sm">
            <p className="text-white">{file.name}</p>
            <p className="text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      )}
      
      {uploadError && (
        <div className="bg-red-900 bg-opacity-50 text-red-200 px-3 py-2 rounded-md mb-4">
          {uploadError}
        </div>
      )}
      
      {uploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-400">
            {uploadProgress}% Uploaded
          </p>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={uploadFile}
          disabled={!file || uploading}
          className={`px-4 py-2 rounded-md ${
            !file || uploading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>
    </div>
  );
};

export default FileUploader; 