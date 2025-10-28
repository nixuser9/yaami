import React, { useEffect, useState } from 'react';
import { useStore, FileItem } from '../store/useStore';
import { FiFolder, FiFile, FiDownload, FiUpload, FiRefreshCw, FiCheckSquare, FiSquare } from 'react-icons/fi';

const FileBrowser: React.FC = () => {
  const activeConnection = useStore((state) => state.activeConnection);
  const currentPath = useStore((state) => state.currentPath);
  const files = useStore((state) => state.files);
  const loading = useStore((state) => state.loading);
  const setCurrentPath = useStore((state) => state.setCurrentPath);
  const setFiles = useStore((state) => state.setFiles);
  const setLoading = useStore((state) => state.setLoading);

  const [selectedBucket, setSelectedBucket] = useState<string>('');
  const [buckets, setBuckets] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (activeConnection?.type === 's3') {
      loadS3Buckets();
    } else {
      loadFiles('/');
    }
  }, [activeConnection]);

  const loadS3Buckets = async () => {
    if (!activeConnection) return;
    try {
      setLoading(true);
      const bucketList = await (window as any).electronAPI.s3.listBuckets(
        activeConnection.config
      );
      setBuckets(bucketList);
    } catch (error: any) {
      console.error('Error loading buckets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async (path: string = currentPath, bucket?: string) => {
    if (!activeConnection) return;
    
    try {
      setLoading(true);
      let fileList: FileItem[] = [];

      switch (activeConnection.type) {
        case 's3':
          if (!bucket && !selectedBucket) return;
          const s3Objects = await (window as any).electronAPI.s3.listObjects(
            activeConnection.config,
            bucket || selectedBucket,
            path === '/' ? '' : path
          );
          fileList = s3Objects.map((obj: any) => ({
            name: obj.key.split('/').filter(Boolean).pop() || obj.key,
            path: obj.key,
            size: obj.size,
            modifiedAt: obj.lastModified,
            isDirectory: obj.isDirectory,
          }));
          break;
        case 'ftp':
          const ftpFiles = await (window as any).electronAPI.ftp.listFiles(
            activeConnection.config,
            path
          );
          fileList = ftpFiles;
          break;
        case 'sftp':
        case 'ssh':
        case 'scp':
          const sftpFiles = await (window as any).electronAPI.sftp.listFiles(
            activeConnection.config,
            path
          );
          fileList = sftpFiles;
          break;
        case 'smb':
          const smbFiles = await (window as any).electronAPI.smb.listFiles(
            activeConnection.config,
            path
          );
          fileList = smbFiles;
          break;
      }

      setFiles(fileList);
      setCurrentPath(path);
    } catch (error: any) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBucketSelect = (bucket: string) => {
    setSelectedBucket(bucket);
    loadFiles('/', bucket);
  };

  const handleFileClick = (file: FileItem) => {
    if (file.isDirectory) {
      loadFiles(file.path);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date | number): string => {
    const d = typeof date === 'number' ? new Date(date) : date;
    return d.toLocaleString();
  };

  const toggleFileSelection = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedFiles(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === files.filter(f => !f.isDirectory).length) {
      setSelectedFiles(new Set());
    } else {
      const allFileIndices = new Set(
        files.map((f, i) => ({ f, i }))
          .filter(({ f }) => !f.isDirectory)
          .map(({ i }) => i)
      );
      setSelectedFiles(allFileIndices);
    }
  };

  const downloadMultipleFiles = async () => {
    if (selectedFiles.size === 0) return;

    const result = await (window as any).electronAPI.dialog.showOpenDialog({
      title: 'Select Download Folder',
      properties: ['openDirectory', 'createDirectory'],
      buttonLabel: 'Download Here',
    });

    if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return;
    }

    const downloadFolder = result.filePaths[0];
    let successCount = 0;
    let failCount = 0;

    for (const index of selectedFiles) {
      const file = files[index];
      if (file.isDirectory) continue;

      try {
        const downloadPath = `${downloadFolder}/${file.name}`;
        
        switch (activeConnection?.type) {
          case 's3':
            await (window as any).electronAPI.s3.downloadFile(
              activeConnection.config,
              selectedBucket,
              file.path,
              downloadPath
            );
            break;
          case 'ftp':
            await (window as any).electronAPI.ftp.downloadFile(
              activeConnection.config,
              file.path,
              downloadPath
            );
            break;
          case 'sftp':
          case 'ssh':
          case 'scp':
            await (window as any).electronAPI.sftp.downloadFile(
              activeConnection.config,
              file.path,
              downloadPath
            );
            break;
          case 'smb':
            await (window as any).electronAPI.smb.downloadFile(
              activeConnection.config,
              file.path,
              downloadPath
            );
            break;
        }
        successCount++;
      } catch (error) {
        console.error(`Error downloading ${file.name}:`, error);
        failCount++;
      }
    }

    setSelectedFiles(new Set());
    alert(`Downloaded ${successCount} file(s) successfully. ${failCount > 0 ? `${failCount} failed.` : ''}`);
  };

  const handleDownload = async (file: FileItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeConnection) return;

    try {
      // Show save dialog to choose download location
      const result = await (window as any).electronAPI.dialog.showSaveDialog({
        title: 'Save File',
        defaultPath: file.name,
        buttonLabel: 'Download',
      });

      if (result.canceled || !result.filePath) {
        return;
      }

      const downloadPath = result.filePath;
      
      switch (activeConnection.type) {
        case 's3':
          await (window as any).electronAPI.s3.downloadFile(
            activeConnection.config,
            selectedBucket,
            file.path,
            downloadPath
          );
          break;
        case 'ftp':
          await (window as any).electronAPI.ftp.downloadFile(
            activeConnection.config,
            file.path,
            downloadPath
          );
          break;
        case 'sftp':
        case 'ssh':
        case 'scp':
          await (window as any).electronAPI.sftp.downloadFile(
            activeConnection.config,
            file.path,
            downloadPath
          );
          break;
        case 'smb':
          await (window as any).electronAPI.smb.downloadFile(
            activeConnection.config,
            file.path,
            downloadPath
          );
          break;
      }
      
      alert(`File downloaded successfully to: ${downloadPath}`);
    } catch (error: any) {
      console.error('Error downloading file:', error);
      alert(`Failed to download file: ${error.message}`);
    }
  };

  if (!activeConnection) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {activeConnection.type === 's3' && buckets.length > 0 && (
              <select
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                value={selectedBucket}
                onChange={(e) => handleBucketSelect(e.target.value)}
              >
                <option value="">Select a bucket...</option>
                {buckets.map((bucket) => (
                  <option key={bucket} value={bucket}>
                    {bucket}
                  </option>
                ))}
              </select>
            )}
            <div className="text-gray-400">
              <span className="text-xs">{currentPath}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedFiles.size > 0 && (
              <button
                onClick={downloadMultipleFiles}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
              >
                <FiDownload size={16} />
                <span>Download {selectedFiles.size} file(s)</span>
              </button>
            )}
            <button
              onClick={() => loadFiles(currentPath)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              disabled={loading}
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : activeConnection.type === 's3' && !selectedBucket ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Select a bucket to view files</div>
          </div>
        ) : files.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">No files found</div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-800 sticky top-0">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-400 w-12">
                  <button
                    onClick={toggleSelectAll}
                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    {selectedFiles.size === files.filter(f => !f.isDirectory).length && files.filter(f => !f.isDirectory).length > 0 ? (
                      <FiCheckSquare size={18} />
                    ) : (
                      <FiSquare size={18} />
                    )}
                  </button>
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Name</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Size</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Modified</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer"
                  onClick={() => handleFileClick(file)}
                >
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {!file.isDirectory && (
                      <button
                        onClick={(e) => toggleFileSelection(index, e)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        {selectedFiles.has(index) ? (
                          <FiCheckSquare size={18} className="text-blue-500" />
                        ) : (
                          <FiSquare size={18} />
                        )}
                      </button>
                    )}
                  </td>
                  <td className="p-4 flex items-center space-x-3">
                    {file.isDirectory ? (
                      <FiFolder className="text-yellow-500" size={20} />
                    ) : (
                      <FiFile className="text-gray-400" size={20} />
                    )}
                    <span>{file.name}</span>
                  </td>
                  <td className="p-4 text-gray-400">{formatSize(file.size)}</td>
                  <td className="p-4 text-gray-400">{formatDate(file.modifiedAt)}</td>
                  <td className="p-4">
                    {!file.isDirectory && (
                      <button
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={(e) => handleDownload(file, e)}
                        title="Download file"
                      >
                        <FiDownload size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FileBrowser;
