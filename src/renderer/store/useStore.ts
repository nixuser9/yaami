import { create } from 'zustand';

export interface Connection {
  id: string;
  name: string;
  type: 's3' | 'ftp' | 'sftp' | 'smb' | 'ssh' | 'scp';
  config: any;
  connected: boolean;
}

export interface FileItem {
  name: string;
  path: string;
  size: number;
  modifiedAt: Date | number;
  isDirectory: boolean;
}

interface AppState {
  connections: Connection[];
  activeConnection: Connection | null;
  currentPath: string;
  files: FileItem[];
  loading: boolean;
  
  setConnections: (connections: Connection[]) => void;
  addConnection: (connection: Connection) => void;
  removeConnection: (id: string) => void;
  updateConnection: (id: string, connection: Partial<Connection>) => void;
  setActiveConnection: (connection: Connection | null) => void;
  setCurrentPath: (path: string) => void;
  setFiles: (files: FileItem[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  connections: [],
  activeConnection: null,
  currentPath: '/',
  files: [],
  loading: false,
  
  setConnections: (connections) =>
    set({ connections }),
  
  addConnection: (connection) =>
    set((state) => ({ connections: [...state.connections, connection] })),
  
  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((c) => c.id !== id),
      activeConnection: state.activeConnection?.id === id ? null : state.activeConnection,
    })),
  
  updateConnection: (id, updatedFields) =>
    set((state) => ({
      connections: state.connections.map((c) =>
        c.id === id ? { ...c, ...updatedFields } : c
      ),
      activeConnection: state.activeConnection?.id === id 
        ? { ...state.activeConnection, ...updatedFields } 
        : state.activeConnection,
    })),
  
  setActiveConnection: (connection) =>
    set({ activeConnection: connection }),
  
  setCurrentPath: (path) =>
    set({ currentPath: path }),
  
  setFiles: (files) =>
    set({ files }),
  
  setLoading: (loading) =>
    set({ loading }),
}));
