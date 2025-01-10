import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '../components/shared/Modal';
import { AddCategoryForm } from '../components/categories/AddCategoryForm'; // Giả sử bạn có form thêm loại sách
import { Table } from '../../../components/Table'; // Import lại Table

export function CategoriesContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [data, setData] = useState<any[]>([]); // Dữ liệu loại sách
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái tải dữ liệu
  const [error, setError] = useState<string | null>(null); // Lỗi khi gọi API
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState<number>(Number(import.meta.env.VITE_ITEMS_PER_PAGE)); // Số loại sách mỗi trang
  const [totalItems, setTotalItems] = useState<number>(0); // Tổng số loại sách

  // Lấy dữ liệu từ API
  useEffect(() => {
    setLoading(true);
    setError(null); // Reset lỗi khi bắt đầu lấy dữ liệu
    const getData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories/?page=${currentPage}&limit=${itemsPerPage}`
        );
        setData(response.data.categories); // Cập nhật dữ liệu loại sách
        setTotalItems(response.data.total_items); // Cập nhật tổng số loại sách
      } catch (error) {
        setError('Lỗi khi tải dữ liệu!');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [currentPage, itemsPerPage]);

  // Tính số lượng trang
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Hàm xử lý form thêm loại sách
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Xử lý logic thêm loại sách ở đây
    setIsAddModalOpen(false);
  };

  // Cấu hình cột cho bảng
  const columns = [
    { label: 'Tên loại sách', field: 'name' }, // Tên loại sách
    { label: 'Mô tả', field: 'description' }, // Mô tả loại sách
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Danh sách Loại sách</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Thêm loại sách
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Sử dụng lại Table component */}
      <Table data={data} columns={columns} loading={loading} error={error} />

      {/* Phân trang */}
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

      {/* Modal thêm loại sách */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm loại sách mới"
      >
        <AddCategoryForm onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
}
