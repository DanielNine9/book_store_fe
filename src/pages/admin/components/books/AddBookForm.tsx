import React, { useEffect, useState } from 'react';
import { Library } from 'lucide-react';

interface AddBookFormProps {
  onSubmit: (e: React.FormEvent, bookData: any) => void;
  onClose: (e: React.FormEvent) => void;
  book?: any; // Truyền vào thông tin sách nếu có
}

export function AddBookForm({ onSubmit, onClose, book }: AddBookFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    if (book) {
      // Nếu có thông tin sách, cập nhật form với dữ liệu của sách
      setFormData({
        title: book.title || '',
        author: book.author || '',
        category: book.category || '',
        description: book.description || '',
      });
    }
  }, [book]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Gọi hàm onSubmit với dữ liệu từ form
    onSubmit(e, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mx-auto w-fit">
        <div className="rounded-full bg-indigo-100 p-3">
          <Library className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Tên sách
          </label>
          <input
            type="text"
            id="title"
            name="title" // Thêm name để quản lý giá trị của input
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Tác giả
          </label>
          <input
            type="text"
            id="author"
            name="author"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
            value={formData.author}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Thể loại
          </label>
          <select
            id="category"
            name="category"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Chọn thể loại</option>
            <option value="fiction">Tiểu thuyết</option>
            <option value="non-fiction">Phi hư cấu</option>
            <option value="science">Khoa học</option>
            <option value="technology">Công nghệ</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={(e) => onClose(e)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {book ? 'Cập nhật sách' : 'Thêm sách'}
        </button>
      </div>
    </form>
  );
}
