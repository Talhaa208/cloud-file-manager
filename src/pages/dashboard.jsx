import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import './styles/globals.css';

const Dashboard = () => {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/files');
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleFileUpload = async () => {
    if (!fileToUpload) return;

    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setFiles((prevFiles) => [...prevFiles, data.file]);
        setFileToUpload(null);
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Welcome to Your Dashboard</h1>
      <div className="upload-section">
        <h3 className="section-title">Upload New File</h3>
        <input
          type="file"
          className="file-input"
          onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
        />
        <button className="btn upload-btn" onClick={handleFileUpload}>
          Upload
        </button>
      </div>

      <div className="files-section">
        <h3 className="section-title">Your Files</h3>
        <button className="btn logout-btn" onClick={handleLogout}>
          Log out
        </button>
        {files.length === 0 ? (
          <p className="no-files">No files uploaded.</p>
        ) : (
          <ul className="file-list">
            {files.map((file) => (
              <li key={file._id} className="file-item">
                <a href={`/api/files/${file.filename}`} target="_blank" className="file-link">
                  {file.filename}
                </a>
                {/* <button onClick={() => deleteFile(file._id)}>Delete</button> */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
