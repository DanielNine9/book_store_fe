import React, { useState, useEffect } from 'react'; 
import { Modal } from '../components/shared/Modal'; 
import { AddAuthorForm } from '../components/authors/AddAuthorForm'; 
import { Table } from '../../../components/Table'; 
import useAuthorsQuery from '../../../queries/AuthorQuery'; 
import { deleteAuthor } from '../../../services/AuthorService'; 
import { ConfirmationModal } from '../../../components/ConfirmationModal'; // Import ConfirmationModal

export function AuthorsContent() {   
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);   
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);   
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [itemsPerPage, setItemsPerPage] = useState<number>(Number(import.meta.env.VITE_ITEMS_PER_PAGE)); 
  const [authorToEdit, setAuthorToEdit] = useState<any | null>(null); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for the delete confirmation modal
  const [authorToDelete, setAuthorToDelete] = useState<any | null>(null); // State for the author to delete

  const { data, error, isLoading, refetch } = useAuthorsQuery(currentPage, itemsPerPage);

  const handleSubmit = async (e: React.FormEvent) => {
    // e.preventDefault();
    try {
      setIsAddModalOpen(false);
      await refetch();  // Trigger refetch after adding the author
      alert('Thêm thành công');
    } catch (error) {
      console.error("Error adding author:", error);
      alert('Thêm không thành công');
    }
  };

  const handleEdit = (author: any) => {   
    setAuthorToEdit(author);   
    setIsEditModalOpen(true);  
  };

  const handleDelete = (author: any) => {   
    setAuthorToDelete(author); // Set the author to be deleted
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  };

  const handleDeleteConfirm = async () => {
    if (!authorToDelete) return;
    try {
      await deleteAuthor(authorToDelete.ID);  // Proceed with the deletion
      alert('Đã xóa tác giả');
      await refetch(); // Trigger refetch after deleting the author
      setIsDeleteModalOpen(false); // Close the modal after confirming
    } catch (error) {
      console.error('Lỗi khi xóa tác giả:', error);
      alert('Xóa không thành công');
    }
  };

  const columns = [
    { label: 'Mã', field: 'code' },
    { label: 'Tên tác giả', field: 'name' },
    { label: 'Mô tả', field: 'bio' },
    { label: 'Hình ảnh', field: 'image_url', render: (item: any) => (
        item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
        ) : (
          <span className="text-gray-500">Không có ảnh</span>
        )
      )
    },
    { label: 'Thao tác', field: 'actions', render: (item: any) => (
        <div className="flex items-center space-x-3">
          <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900">
            Sửa
          </button>
          <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-900">
            Xóa
          </button>
        </div>
      ),
    },
  ];

  const totalPages = data?.total_items ? Math.ceil(data.total_items / itemsPerPage) : 0;

  useEffect(() => {
    if(currentPage > totalPages){
      setCurrentPage(1)
    }
  }, [totalPages]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Danh sách Tác giả</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Thêm tác giả
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          {error.message}
        </div>
      )}

      <Table data={data?.authors || []} columns={columns} loading={isLoading} error={error?.message as string} />

      {/* Pagination */}
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
            Trang {data?.current_page} / {totalPages}
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

      {/* Modal to add new author */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm tác giả mới"
      >
        <AddAuthorForm
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* Modal to edit author */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Sửa tác giả"
      >
        {authorToEdit && (
          <AddAuthorForm
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={async (e: React.FormEvent) => {
              // e.preventDefault();
              alert("Chỉnh sửa thành công")
              setIsEditModalOpen(false);
              await refetch();  // Trigger refetch after updating the author
            }}
            authorToEdit={authorToEdit}
          />
        )}
      </Modal>

      {/* Confirmation Modal for Deleting Author */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemType="tác giả" // The item type for the confirmation message
      />
    </div>
  );
}
