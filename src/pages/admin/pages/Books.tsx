import React, { useState } from 'react';
import { Modal } from '../components/shared/Modal';
import { AddBookForm } from '../components/books/AddBookForm';
import { Table } from '../../../components/Table';
import useBooksQuery from '../../../queries/BookQuery';
import { getRandomColor } from '../../../utils/commonUtils';

export function BooksContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page state

  // Use the `useBooksQuery` hook to fetch books data with pagination
  const { data, isLoading, error } = useBooksQuery(
    currentPage,
    itemsPerPage,
    '', // search term
    'code', // search field
    'OR' // search operator
  );

  // Calculate total pages based on totalItems and itemsPerPage
  const totalPages = Math.ceil(data?.total_items / itemsPerPage);

  // Define columns for the Table component
  const columns = [
    { label: 'Mã', field: 'code' },
    { label: 'Tên', field: 'title' },
    { label: 'Giá', field: 'price' },
    { label: 'Tác giả', field: 'author.name' },
    {
      label: 'Thể loại',
      field: 'categories',
      render: (item: any) => (
        <div  style={{ maxWidth: '300px', flexWrap: 'wrap', display: "flex" }}>
          {item?.categories?.map((category : any) => (
            <span
              key={category.ID}
              style={{
                backgroundColor: getRandomColor(),
                color: '#fff',
                padding: '2px 8px',
                borderRadius: '4px',
                margin: '2px',
              }}
            >
              {category.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: 'Trạng thái',
      field: 'active',
      render: (item: any) => (item.active ? 'Đang bán' : 'Chưa bán'),
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
  if(currentPage > totalPages){
    setCurrentPage(totalPages)
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Danh sách sách</h2>
        </div>
      </div>

      {/* Display error if exists */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          Lỗi khi tải dữ liệu!
        </div>
      )}

      {/* Show loading state while data is being fetched */}
      {isLoading ? (
        <div className="p-4 bg-gray-100 text-gray-700 rounded-md mb-4">
          Đang tải dữ liệu...
        </div>
      ) : (
        // Use the Table component to display book data
        <Table data={data?.books} columns={columns} loading={isLoading} error={error} />
      )}

      {/* Pagination controls */}
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

      {/* Modal for adding new book */}
      <Modal title='Create Book' isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddBookForm onSubmit={() => {}} onClose={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
}
