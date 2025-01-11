import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '../components/shared/Modal';
import { AddBookForm } from '../components/books/AddBookForm';
import { Table } from '../../../components/Table';

export function BooksContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [data, setData] = useState<any[]>([]); // Dữ liệu sách và người dùng
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái tải
  const [error, setError] = useState<string | null>(null); // Lỗi khi gọi API

  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState<number>(5); // Số phần tử trên mỗi trang
  const [totalItems, setTotalItems] = useState<number>(0); // Tổng số phần tử

  // Lấy dữ liệu từ API cho cả Book và User
  useEffect(() => {
    setLoading(true);
    setError(null); // Reset lỗi khi bắt đầu lấy dữ liệu
    const getData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/books/?page=${currentPage}&limit=${itemsPerPage}&search=&search_fields=username&search_operator=OR`
        );
        setData(response.data.books); // Cập nhật dữ liệu chung cho cả book và user
        setTotalItems(response.data.total_items); // Cập nhật tổng số phần tử
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

  // Cấu hình cột linh hoạt
  const columns = [
    { label: 'Mã', field: 'code' },
    { label: 'Tên', field: 'title' }, // Hiển thị tên
    { label: 'Giá', field: 'price' }, // Hiển thị loại (Book/User)
    { label: 'Tác giả', field: 'author.name' }, // Tên tác giả (nếu có)
    { label: 'Thể loại', field: 'category.name' }, // Tên thể loại
    {
      label: 'Trạng thái',
      field: 'active', // Trường dữ liệu
      render: (item: any) => (item.active ? "Đang bán" : "Chưa bán"), // Hàm render tùy chỉnh
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Danh sách</h2>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Sử dụng Table component */}
      <Table data={data} columns={columns} loading={loading} error={error} />

      {/* Các điều khiển phân trang */}
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
    </div>
  );
}
