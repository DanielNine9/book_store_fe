import React, { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { Modal } from '../components/shared/Modal'; 
import { AddCategoryForm } from '../components/categories/AddCategoryForm'; 
import { Table } from '../../../components/Table'; 
import useCategoriesQuery from '../../../queries/CategoryQuery';  
import { deleteCategory } from '../../../services/CategoryService';

export function CategoriesContent() {   
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);   
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);   
  const [currentPage, setCurrentPage] = useState<number>(1); 
  const [itemsPerPage, setItemsPerPage] = useState<number>(Number(import.meta.env.VITE_ITEMS_PER_PAGE)); // Số loại sách mỗi trang   
  const [categoryToEdit, setCategoryToEdit] = useState<any | null>(null); 

  const { data, error, isLoading, refetch } = useCategoriesQuery(currentPage, itemsPerPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsAddModalOpen(false);
      await refetch();  // Trigger refetch after adding the category
    } catch (error) {
      console.error("Error adding category:", error);
      alert('Thêm không thành công');
    }
  };

  // Hàm xử lý sửa loại sách
  const handleEdit = (category: any) => {   
    setCategoryToEdit(category);   
    setIsEditModalOpen(true);  
  };

  // Hàm xử lý xóa loại sách
  const handleDelete = async (categoryId: string) => {   
    if (window.confirm('Bạn có chắc chắn muốn xóa loại sách này?')) {     
      try {    
        await deleteCategory(categoryId)   
        // await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${categoryId}`);       
        alert('Đã xóa loại sách');
        await refetch(); // Trigger refetch after deleting the category
      } catch (error) {       
        console.error('Lỗi khi xóa loại sách:', error);       
        alert('Xóa không thành công');
      }   
    } 
  };

  // Cấu hình cột cho bảng
  const columns = [
    { label: 'Mã', field: 'code' },
    { label: 'Tên loại sách', field: 'name' },
    { label: 'Mô tả', field: 'description' },
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
          <button onClick={() => handleDelete(item.ID)} className="text-red-600 hover:text-red-900">
            Xóa
          </button>
        </div>
      ),
    },
  ];

  // Calculate total pages based on the total number of items
  const totalPages = data?.total_items ? Math.ceil(data.total_items / itemsPerPage) : 0;
  useEffect(() => {
    if(currentPage > totalPages){
      setCurrentPage(1)
    }
  }, [totalPages])


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
          {error.message}
        </div>
      )}

      <Table data={data?.categories || []} columns={columns} loading={isLoading} error={error?.message as string} />

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

      {/* Modal thêm loại sách */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm loại sách mới"
      >
        <AddCategoryForm
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleSubmit}
        />
      </Modal>

      {/* Modal sửa loại sách */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Sửa loại sách"
      >
        {categoryToEdit && (
          <AddCategoryForm
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={async (e: React.FormEvent) => {
              e.preventDefault();
              setIsEditModalOpen(false);
              await refetch();  // Trigger refetch after updating the category
            }}
            categoryToEdit={categoryToEdit}
          />
        )}
      </Modal>
    </div>
  );
}
