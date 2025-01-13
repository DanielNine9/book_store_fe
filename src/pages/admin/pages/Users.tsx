import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '../components/shared/Modal';
import { AddUserForm } from '../components/users/AddUserForm';
import { Table } from '../../../components/Table';
import useUsersQuery from '../../../queries/UserQuery';

export function UsersContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [itemsPerPage, setItemsPerPage] = useState<number>(Number(import.meta.env.VITE_ITEMS_PER_PAGE)); 
  const { data, error, isLoading, refetch } = useUsersQuery(currentPage, itemsPerPage);

  const totalPages = data?.total_items
    ? Math.ceil(data.total_items / itemsPerPage)
    : 0;
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  const columns = [
    { label: 'Mã', field: 'code' },
    { label: 'Người dùng', field: 'username' },
    { label: 'Email', field: 'email' }, 
    { label: 'Vai trò', field: 'role' },
    {
      label: 'Trạng thái',
      field: 'active',
      render: (data: any) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            data.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {data.active ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      label: 'Thao tác',
      field: 'actions',
      render: (item: any) => (
        <div className="flex items-center space-x-3">
          <button className="text-indigo-600 hover:text-indigo-900">Sửa</button>
          <button className="text-red-600 hover:text-red-900">Xóa</button>
        </div>
      ),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Danh sách Người dùng</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Thêm người dùng
          </button>
        </div>
      </div>

      
      <Table data={data?.users || []} columns={columns} loading={isLoading} error={error?.message as string} />

      <div className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <span className="mr-2">Hiển thị</span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <span className="ml-2">mỗi trang</span>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-2 border border-gray-300 rounded-md mr-2 disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-2 border border-gray-300 rounded-md ml-2 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      </div>

      {/* Modal thêm người dùng */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm người dùng mới"
      >
        <AddUserForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
