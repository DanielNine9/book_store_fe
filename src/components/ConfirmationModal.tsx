import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: string; // Loại đối tượng (ví dụ: sách, thể loại)
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemType }) => {
  if (!isOpen) return null; // Nếu modal không mở thì không hiển thị gì

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <div className="text-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Xác nhận xóa</h2>
          <p className="text-sm text-gray-500 mt-2">Bạn có chắc muốn xóa {itemType} này không?</p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};
