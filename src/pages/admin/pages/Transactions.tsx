import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from '../../../components/Table';

interface Transaction {
  id: number;
  user: {
    username: string;
  };
  book: {
    title: string;
  };
  totalAmount: number;
  status: string;
}

export function TransactionsContent() {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchStatus, setSearchStatus] = useState<string>(''); // Trạng thái tìm kiếm

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/transactions?page=${currentPage}&limit=${itemsPerPage}&search=${searchStatus}&search_fields=status&search_operator=OR`
        );
        setData(response.data.transactions);
        setTotalItems(response.data.total_items);
      } catch (error) {
        setError('Có lỗi xảy ra khi tải dữ liệu.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, itemsPerPage, searchStatus]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const columns = [
    { label: 'Mã', field: 'code' },
    { label: 'ID Giao dịch', field: 'ID' },
    { label: 'Người dùng', field: 'user.username' },
    // { label: 'Tồng số lượng', field: 'book.title' },
    { label: 'Tổng tiền', field: 'total_amount' },
    { label: 'Ngày giao dịch', field: 'transaction_time' },
    {
      label: 'Trạng thái',
      field: 'status',
      render: (data: Transaction) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            data.status === 'completed'
              ? 'bg-green-100 text-green-800'
              : data.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {data.status === 'completed'
            ? 'Hoàn thành'
            : data.status === 'pending'
            ? 'Đang chờ'
            : 'Thất bại'}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Lịch sử Giao dịch</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="p-6">
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Dropdown tìm kiếm */}
        <div className="mb-4">
          <label htmlFor="statusFilter" className="mr-2">
            Tìm kiếm theo trạng thái:
          </label>
          <select
            id="statusFilter"
            value={searchStatus}
            onChange={(e) => {
              setSearchStatus(e.target.value);
              setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Tất cả</option>
            <option value="completed">Hoàn thành</option>
            <option value="pending">Đang chờ</option>
            <option value="failed">Thất bại</option>
          </select>
        </div>

        <Table data={data} columns={columns} loading={loading} error={error} />
      </div>

      <div className="p-6 border-t">
        <div className="flex justify-between items-center">
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
              Trang trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-2 border border-gray-300 rounded-md ml-2 disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
