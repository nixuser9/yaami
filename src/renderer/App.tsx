import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ConnectionModal from './components/ConnectionModal';
import FileBrowser from './components/FileBrowser';
import Header from './components/Header';
import { useStore } from './store/useStore';

function App() {
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [editingConnectionId, setEditingConnectionId] = useState<string | null>(null);
  const activeConnection = useStore((state) => state.activeConnection);
  const setConnections = useStore((state) => state.setConnections);
  const connections = useStore((state) => state.connections);

  const handleEditConnection = (connectionId: string) => {
    setEditingConnectionId(connectionId);
    setShowConnectionModal(true);
  };

  const handleCloseModal = () => {
    setShowConnectionModal(false);
    setEditingConnectionId(null);
  };

  const editingConnection = editingConnectionId 
    ? connections.find(c => c.id === editingConnectionId)
    : undefined;

  // Load saved connections on startup
  useEffect(() => {
    const loadConnections = async () => {
      try {
        const savedConnections = await (window as any).electronAPI.config.getConnections();
        if (savedConnections && savedConnections.length > 0) {
          setConnections(savedConnections.map((conn: any) => ({
            ...conn,
            connected: false,
          })));
        }
      } catch (error) {
        console.error('Failed to load connections:', error);
      }
    };

    loadConnections();
  }, [setConnections]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header onNewConnection={() => setShowConnectionModal(true)} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          onNewConnection={() => setShowConnectionModal(true)}
          onEditConnection={handleEditConnection}
        />

        {/* File Browser */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {activeConnection ? (
            <FileBrowser />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <img src="/logo.svg" alt="Yaami" className="w-32 h-32 mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-semibold mb-2">Welcome to Yaami</h2>
                <p className="text-gray-400 mb-6">
                  Connect to your cloud storage to get started
                </p>
                <button
                  onClick={() => setShowConnectionModal(true)}
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
                >
                  New Connection
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Connection Modal */}
      {showConnectionModal && (
        <ConnectionModal 
          onClose={handleCloseModal}
          editConnection={editingConnection}
        />
      )}
    </div>
  );
}

export default App;
