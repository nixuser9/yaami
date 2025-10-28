import React from 'react';
import { FiPlus } from 'react-icons/fi';

interface HeaderProps {
  onNewConnection: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewConnection }) => {
  return (
    <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center space-x-3">
        <img src="/logo.svg" alt="Yaami" className="w-8 h-8" />
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          Yaami
        </h1>
      </div>

      <button
        onClick={onNewConnection}
        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
      >
        <FiPlus />
        <span>New Connection</span>
      </button>
    </header>
  );
};

export default Header;
