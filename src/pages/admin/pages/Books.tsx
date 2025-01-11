import React, { useEffect, useState } from "react";
import { Modal } from "../components/shared/Modal";
import { AddBookForm } from "../components/books/AddBookForm";
import { Table } from "../../../components/Table";
import useBooksQuery from "../../../queries/BookQuery";
import { getRandomColor } from "../../../utils/commonUtils";
import { updateBook, deleteBook } from "../../../services/BookService"; // import các hàm update và delete
import { ConfirmationModal } from "../../../components/ConfirmationModal";

export function BooksContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Trạng thái modal sửa
  const [currentBook, setCurrentBook] = useState<any>(null); // Dữ liệu sách hiện tại khi sửa

  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [itemsPerPage, setItemsPerPage] = useState(5); // Items per page state

  // Use the `useBooksQuery` hook to fetch books data with pagination
  const { data, isLoading, error, refetch } = useBooksQuery(
    currentPage,
    itemsPerPage,
    "", // search term
    "code", // search field
    "OR" // search operator
  );

  // Calculate total pages based on totalItems and itemsPerPage
  const totalPages = Math.ceil(data?.total_items / itemsPerPage);

  // Handle edit book
  const handleEditBook = (book: any) => {
    setCurrentBook(book); // Lưu thông tin sách vào state
    setIsEditModalOpen(true); // Mở modal sửa
  };

  // Handle delete book
  const handleDeleteBook = (bookId: string) => {
    setCurrentItemToDelete(bookId);
    setItemType("sách");
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentItemToDelete) return;

    try {
      await deleteBook(currentItemToDelete); // Xóa sách
      await refetch()
      setIsDeleteModalOpen(false);
      setCurrentItemToDelete(null);
    } catch (error) {
      console.error("Xóa thất bại:", error);
    }
  };

  // Define columns for the Table component
  const columns = [
    { label: "Mã", field: "code" },
    { label: "Tên", field: "title" },
    { label: "Giá", field: "price" },
    { label: "Tác giả", field: "author.name" },
    {
      label: "Thể loại",
      field: "categories",
      render: (item: any) => (
        <div style={{ maxWidth: "300px", flexWrap: "wrap", display: "flex" }}>
          {item?.categories?.map((category: any) => (
            <span
              key={category.ID}
              style={{
                backgroundColor: getRandomColor(),
                color: "#fff",
                padding: "2px 8px",
                borderRadius: "4px",
                margin: "2px",
              }}
            >
              {category.name}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Trạng thái",
      field: "active",
      render: (item: any) => (item.active ? "Đang bán" : "Chưa bán"),
    },
    {
      label: "Thao tác",
      field: "actions",
      render: (item: any) => (
        <div className="flex items-center space-x-3">
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={() => handleEditBook(item)}
          >
            Sửa
          </button>
          <button
            className="text-red-600 hover:text-red-900"
            onClick={() => handleDeleteBook(item.ID)}
          >
            Xóa
          </button>
        </div>
      ),
    },
  ];
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItemToDelete, setCurrentItemToDelete] = useState<any>(null);
  const [itemType, setItemType] = useState(""); 
  useEffect(() => {
    if(currentPage > totalPages){
      setCurrentPage(1)
    }
  }, [totalPages])
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Danh sách sách</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Thêm sách
          </button>
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
        <Table
          data={data?.books}
          columns={columns}
          loading={isLoading}
          error={error?.message as string}
        />
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-2 border border-gray-300 rounded-md ml-2 disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      </div>

      {/* Modal for editing book */}
      <Modal
        title="Sửa sách"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        {/* AddBookForm có thể được sửa đổi để nhận và hiển thị thông tin sách để chỉnh sửa */}
        <AddBookForm
          onSubmit={(updatedData) => {
            updateBook(currentBook?.code, updatedData);
            setIsEditModalOpen(false);
          }}
          onClose={() => setIsEditModalOpen(false)}
          book={currentBook} // Truyền thông tin sách cần sửa
        />
      </Modal>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemType={itemType}
      />
      {/* Modal for adding new book */}
      <Modal
        title="Create Book"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <AddBookForm
          onSubmit={() => {}}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
