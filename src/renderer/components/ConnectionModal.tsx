import React, { useState, useEffect } from 'react';
import { useStore, Connection } from '../store/useStore';
import { FiX } from 'react-icons/fi';

interface ConnectionModalProps {
  onClose: () => void;
  editConnection?: Connection;
}

const ConnectionModal: React.FC<ConnectionModalProps> = ({ onClose, editConnection }) => {
  const isEditing = !!editConnection;
  const [connectionType, setConnectionType] = useState<'s3' | 'ftp' | 'sftp' | 'smb' | 'ssh' | 'scp'>(
    editConnection?.type || 's3'
  );
  const [name, setName] = useState(editConnection?.name || '');
  const [config, setConfig] = useState<any>(editConnection?.config || {});
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testError, setTestError] = useState<string>('');
  const addConnection = useStore((state) => state.addConnection);
  const updateConnection = useStore((state) => state.updateConnection);

  // Update state when editConnection changes
  useEffect(() => {
    if (editConnection) {
      setConnectionType(editConnection.type);
      setName(editConnection.name);
      setConfig(editConnection.config);
    }
  }, [editConnection]);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestStatus('testing');
    setTestError('');
    
    try {
      let result;
      if (connectionType === 's3') {
        result = await (window as any).electronAPI.s3.connect(config);
      } else if (connectionType === 'ftp') {
        result = await (window as any).electronAPI.ftp.connect(config);
      } else if (connectionType === 'sftp' || connectionType === 'ssh' || connectionType === 'scp') {
        result = await (window as any).electronAPI.sftp.connect(config);
      } else if (connectionType === 'smb') {
        result = await (window as any).electronAPI.smb.connect(config);
      }

      if (result?.success !== false) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
        setTestError(result.error || 'Connection failed');
      }
    } catch (error: any) {
      setTestStatus('error');
      setTestError(error.message || 'Connection failed');
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only save if test was successful or skip test for editing
    if (testStatus !== 'success' && !isEditing) {
      setTestError('Please test the connection first');
      return;
    }

    try {
      if (isEditing && editConnection) {
        // Update existing connection
        const updatedConnection = {
          name,
          type: connectionType,
          config,
        };
        updateConnection(editConnection.id, updatedConnection);
        
        // Update in config
        try {
          await (window as any).electronAPI.config.saveConnection({
            ...editConnection,
            ...updatedConnection,
          });
        } catch (error) {
          console.error('Failed to update connection:', error);
        }
      } else {
        // Add new connection
        const newConnection = {
          id: Date.now().toString(),
          name,
          type: connectionType,
          config,
          connected: true,
        };
        addConnection(newConnection);
        
        // Save connection to config
        try {
          await (window as any).electronAPI.config.saveConnection(newConnection);
        } catch (error) {
          console.error('Failed to save connection:', error);
        }
      }
      
      onClose();
    } catch (error: any) {
      setTestError(`Failed to save: ${error.message}`);
    }
  };

  const renderConfigForm = () => {
    switch (connectionType) {
      case 's3':
        return (
          <>
            <input
              type="text"
              placeholder="Access Key ID"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.accessKeyId || ''}
              onChange={(e) => setConfig({ ...config, accessKeyId: e.target.value })}
            />
            <input
              type="password"
              placeholder="Secret Access Key"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.secretAccessKey || ''}
              onChange={(e) => setConfig({ ...config, secretAccessKey: e.target.value })}
            />
            <input
              type="text"
              placeholder="Region (e.g., us-east-1)"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.region || ''}
              onChange={(e) => setConfig({ ...config, region: e.target.value })}
            />
            <input
              type="text"
              placeholder="Endpoint (optional, for S3-compatible)"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.endpoint || ''}
              onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
            />
          </>
        );
      case 'ftp':
        return (
          <>
            <input
              type="text"
              placeholder="Host"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.host || ''}
              onChange={(e) => setConfig({ ...config, host: e.target.value })}
            />
            <input
              type="number"
              placeholder="Port (21)"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.port || ''}
              onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
            />
            <input
              type="text"
              placeholder="User"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.user || ''}
              onChange={(e) => setConfig({ ...config, user: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.password || ''}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
            />
          </>
        );
      case 'sftp':
      case 'ssh':
      case 'scp':
        return (
          <>
            <input
              type="text"
              placeholder="Host"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.host || ''}
              onChange={(e) => setConfig({ ...config, host: e.target.value })}
            />
            <input
              type="number"
              placeholder="Port (22)"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.port || ''}
              onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.username || ''}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password (optional if using key)"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.password || ''}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
            />
            <textarea
              placeholder="Private Key (optional)"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
              rows={3}
              value={config.privateKey || ''}
              onChange={(e) => setConfig({ ...config, privateKey: e.target.value })}
            />
          </>
        );
      case 'smb':
        return (
          <>
            <input
              type="text"
              placeholder="Host"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.host || ''}
              onChange={(e) => setConfig({ ...config, host: e.target.value })}
            />
            <input
              type="text"
              placeholder="Share Name"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.share || ''}
              onChange={(e) => setConfig({ ...config, share: e.target.value })}
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.username || ''}
              onChange={(e) => setConfig({ ...config, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.password || ''}
              onChange={(e) => setConfig({ ...config, password: e.target.value })}
            />
            <input
              type="text"
              placeholder="Domain (optional, default: WORKGROUP)"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={config.domain || ''}
              onChange={(e) => setConfig({ ...config, domain: e.target.value })}
            />
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Edit Connection' : 'New Connection'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Connection Name
            </label>
            <input
              type="text"
              placeholder="My Connection"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Connection Type
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {(['s3', 'ftp', 'sftp'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setConnectionType(type)}
                  disabled={isEditing}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors uppercase ${
                    connectionType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['ssh', 'scp', 'smb'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setConnectionType(type)}
                  disabled={isEditing}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors uppercase ${
                    connectionType === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  } ${isEditing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {renderConfigForm()}

          {/* Test Connection Status */}
          {testStatus !== 'idle' && (
            <div className={`p-3 rounded-lg ${
              testStatus === 'testing' ? 'bg-blue-500/10 border border-blue-500/30' :
              testStatus === 'success' ? 'bg-green-500/10 border border-green-500/30' :
              'bg-red-500/10 border border-red-500/30'
            }`}>
              <div className="flex items-center space-x-2">
                {testStatus === 'testing' && (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-400 text-sm">Testing connection...</span>
                  </>
                )}
                {testStatus === 'success' && (
                  <>
                    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-400 text-sm font-medium">Connection successful!</span>
                  </>
                )}
                {testStatus === 'error' && (
                  <>
                    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div className="flex-1">
                      <span className="text-red-400 text-sm font-medium">Connection failed</span>
                      {testError && <p className="text-red-300 text-xs mt-1">{testError}</p>}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !name}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              type="submit"
              disabled={testStatus !== 'success' && !isEditing}
              className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectionModal;
