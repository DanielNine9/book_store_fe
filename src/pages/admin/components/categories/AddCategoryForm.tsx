import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import axios from 'axios';
import { createCategory, updateCategory } from '../../../../services/CategoryService';

interface AddCategoryFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onClose: (e: React.FormEvent) => void;
  categoryToEdit?: any; // Thêm prop cho dữ liệu sửa (tùy chọn)
}

export function AddCategoryForm({ onSubmit, categoryToEdit, onClose }: AddCategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null); // Để lưu URL hình ảnh hiện tại

  // Cập nhật form khi có dữ liệu categoryToEdit (chỉnh sửa)
  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setDescription(categoryToEdit.description);
      setCurrentImageUrl(categoryToEdit.image_url); // Lưu URL của hình ảnh cũ
    }
  }, [categoryToEdit]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image) {
      formData.append('image', image); 
    }
  
    try {
      let response;
  
      if (categoryToEdit) {
        response = await updateCategory({
          id: categoryToEdit.ID,
          name,
          description,
          image,
        });
      } else {
        // Create a new category
        response = await createCategory(name, description, image);
      }
  
      const data = response.data;
      console.log(data)
      if (response.status === 200) {
        console.log('Category saved:', data);
        // Clear the form fields after successful submission
        setName('');
        setDescription('');
        setImage(null);
        setCurrentImageUrl(null);
        onSubmit(e); // Trigger the parent callback
      } else {
        console.error('Error saving category:', data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      <div className="mx-auto w-fit">
        <div className="rounded-full bg-indigo-100 p-3">
          <Tag className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Tên loại sách */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tên loại sách
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Mô tả loại sách */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            id="description"
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Hình ảnh (Tùy chọn)
          </label>
          <input
            type="file"
            id="image"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                setImage(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Hiển thị ảnh đã chọn hoặc ảnh cũ */}
        <div className="mt-4">
          {image ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">Ảnh đã chọn</label>
              <img
                src={URL.createObjectURL(image)} // Tạo URL tạm thời cho ảnh
                alt="Selected"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          ) : currentImageUrl ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">Ảnh hiện tại</label>
              <img
                src={currentImageUrl} // Sử dụng URL hình ảnh hiện tại
                alt="Current"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500">Chưa có ảnh</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
        onClick={onClose}
          type="button"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang lưu loại sách...' : categoryToEdit ? 'Cập nhật loại sách' : 'Thêm loại sách'}
        </button>
      </div>
    </form>
  );
}
