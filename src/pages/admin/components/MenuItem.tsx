import React from 'react';

interface MenuItemProps {
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
  active?: boolean;
  onClick: () => void;
}

export function MenuItem({ icon, text, isOpen, active = false, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 ${
        active ? 'bg-indigo-700' : 'hover:bg-indigo-700'
      } transition-colors`}
    >
      <span className="flex items-center justify-center">{icon}</span>
      {isOpen && <span className="ml-4">{text}</span>}
    </button>
  );
}