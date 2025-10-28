import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { FiServer, FiTrash2, FiCloud, FiEdit2, FiXCircle } from 'react-icons/fi';
import { BiServer } from 'react-icons/bi';

interface SidebarProps {
  onNewConnection: () => void;
  onEditConnection?: (connectionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNewConnection, onEditConnection }) => {
  const connections = useStore((state) => state.connections);
  const activeConnection = useStore((state) => state.activeConnection);
  const setActiveConnection = useStore((state) => state.setActiveConnection);
  const removeConnection = useStore((state) => state.removeConnection);
  const updateConnection = useStore((state) => state.updateConnection);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleDisconnect = (e: React.MouseEvent, connId: string) => {
    e.stopPropagation();
    if (activeConnection?.id === connId) {
      setActiveConnection(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, connId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this connection?')) {
      removeConnection(connId);
      if (activeConnection?.id === connId) {
        setActiveConnection(null);
      }
      try {
        await (window as any).electronAPI.config.deleteConnection(connId);
      } catch (error) {
        console.error('Failed to delete connection:', error);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent, connId: string) => {
    e.stopPropagation();
    if (onEditConnection) {
      onEditConnection(connId);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 's3':
        return <FiCloud className="text-orange-500" />;
      case 'ftp':
        return <FiServer className="text-blue-500" />;
      case 'sftp':
      case 'ssh':
      case 'scp':
        return <FiServer className="text-purple-500" />;
      case 'smb':
        return <BiServer className="text-green-500" />;
      default:
        return <FiServer />;
    }
  };

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Connections
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {connections.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No connections yet
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {connections.map((conn) => (
              <div
                key={conn.id}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  activeConnection?.id === conn.id
                    ? 'bg-primary-600/20 border border-primary-600/50'
                    : 'hover:bg-gray-700/50'
                }`}
                onClick={() => setActiveConnection(conn)}
                onMouseEnter={() => setHoveredId(conn.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="text-xl">{getIcon(conn.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{conn.name}</div>
                    <div className="text-xs text-gray-400 uppercase">{conn.type}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {activeConnection?.id === conn.id && (
                    <button
                      onClick={(e) => handleDisconnect(e, conn.id)}
                      className="p-1 hover:text-yellow-500 transition-colors"
                      title="Disconnect"
                    >
                      <FiXCircle size={16} />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleEdit(e, conn.id)}
                    className="p-1 hover:text-blue-500 transition-colors"
                    title="Edit connection"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, conn.id)}
                    className="p-1 hover:text-red-500 transition-colors"
                    title="Delete connection"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
