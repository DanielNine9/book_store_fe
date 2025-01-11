import React, { useEffect, useState } from 'react';
import { Table } from '../../../components/Table';

// Định nghĩa kiểu dữ liệu cho một giao dịch (transaction)
interface Transaction {
  ID: number;
  userName: string;
  bookTitle: string;
  borrowDate: string;
  returnDate: string;
  status: string;
}

export function TransactionsContent() {
  const [data, setData] = useState<Transaction[]>([]); // Dữ liệu giao dịch
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Lỗi nếu có
  const [currentPage, setCurrentPage] = useState<number>(1); // Trang hiện tại
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Số mục trên mỗi trang

  // Hàm gọi API để lấy dữ liệu
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/transactions/?page=${currentPage}&limit=${itemsPerPage}`
        );
        const result = await response.json();
        setData(result.data); // Giả sử kết quả trả về có thuộc tính 'data' chứa các giao dịch
      } catch (error) {
        setError('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, itemsPerPage]); // Chạy lại khi thay đổi trang hoặc số mục trên mỗi trang

  // Cột của bảng
  const columns = [
    {
      label: 'ID Giao dịch',
      field: 'ID',
    },
    {
      label: 'Người mượn',
      field: 'userName',
    },
    {
      label: 'Sách',
      field: 'bookTitle',
    },
    {
      label: 'Ngày mượn',
      field: 'borrowDate',
    },
    {
      label: 'Hạn trả',
      field: 'returnDate',
    },
    {
      label: 'Trạng thái',
      field: 'status',
      render: (data: Transaction) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            data.status === 'Đã trả'
              ? 'bg-green-100 text-green-800'
              : data.status === 'Đang mượn'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {data.status}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Lịch sử Giao dịch</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
            Xuất báo cáo
          </button>
        </div>
      </div>
      <div className="p-6">
        <Table data={data} columns={columns} loading={loading} error={error} />
      </div>
      <div className="p-6 border-t">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Trang trước
          </button>
          <span className="text-sm text-gray-700">Trang {currentPage}</span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}
