import React from 'react';
import { Tag } from 'lucide-react';

interface AddCategoryFormProps {
  onSubmit: (e: React.FormEvent) => void;
}

export function AddCategoryForm({ onSubmit }: AddCategoryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Thêm loại sách
        </button>
      </div>
    </form>
  );
}
