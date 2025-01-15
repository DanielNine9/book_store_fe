import React, { useEffect, useState } from "react";
import { Modal } from "../components/shared/Modal";
import { AddBookForm } from "../components/books/AddBookForm";
import { Table } from "../../../components/Table";
import useBooksQuery from "../../../queries/BookQuery";
import { getRandomColor } from "../../../utils/commonUtils";
import {
  updateBook,
  deleteBook,
  createBook,
} from "../../../services/BookService"; // import các hàm update và delete
import { ConfirmationModal } from "../../../components/ConfirmationModal";

export function BooksContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState<any>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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
    setCurrentBook(book); // Lưu thông tin sách vào statea
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
      await refetch();
      setIsDeleteModalOpen(false);
      setCurrentItemToDelete(null);
    } catch (error) {
      console.error("Xóa thất bại:", error);
    }
  };
  console.log("data ", data);
  // Define columns for the Table component
  const columns = [
    { label: "Mã", field: "code" },
    { label: "Tên", field: "title" },
    { label: "Giá", field: "price" },
    { label: "Số lượng", field: "quantity_in_stock" },
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
                // backgroundColor: getRandomColor(),
                backgroundColor: "black",
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
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages]);
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
          onSubmit={async (e, updatedData) => {
            try {
              console.log("updatedData ", updatedData);
                alert("vao day")
              // Destructure the fields from updatedData to pass to updateBook
              const {
                title,
                description,
                author,
                category,
                price,
                quantity,
                publisher,
                publication_year,
                weight,
                dimensions,
                pages,
                binding_type,
                images,
              } = updatedData;
              console.log("currentBook ", currentBook)
              await updateBook(
                currentBook?.id, 
                title,
                description,
                author.ID, // Extract the author ID from the author object
                category.map((item: any) => item.ID), // Extract category IDs
                price,
                quantity,
                publisher,
                publication_year,
                weight,
                dimensions,
                pages,
                binding_type,
                images // Assuming images are passed correctly as a File[] array
              );

              // Close the modal and refetch data after updating
              setIsEditModalOpen(false);
              await refetch();
            } catch (error) {
              console.error("Error updating book:", error);
            }
          }}
          onClose={() => setIsEditModalOpen(false)}
          book={currentBook} // Passing the current book data for editing
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
        title="Thêm sách"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      >
        <AddBookForm
          onSubmit={async (e, formData) => {
            console.log("data2", formData); // To check the formData

            try {
              // Call createBook here with the correct formData
              await createBook(
                formData.title,
                formData.description,
                formData.author.ID, // Assuming 'ID' is the correct field in formData
                formData.category.map((item: any) => item.ID), // Assuming categories is an array of objects
                formData.price,
                formData.quantity,
                formData.publisher,
                formData.publication_year,
                formData.weight,
                formData.dimensions,
                formData.pages,
                formData.binding_type,
                formData.images // Assuming images is an array of File objects
              );

              setIsAddModalOpen(false); // Close the modal after success
              await refetch(); // Refetch books to update the list
            } catch (error) {
              console.log("Error creating book:", error);
            }
          }}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
