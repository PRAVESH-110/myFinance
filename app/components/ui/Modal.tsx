// app/components/ui/Modal.tsx
'use client';

import { useEffect } from 'react';
import { useModal } from '../../context/ModalContext';

export function Modal() {
  const { isOpen, content, closeModal } = useModal();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-md p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        {content}
      </div>
    </div>
  );
}