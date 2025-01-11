import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { createAuthor, updateAuthor } from '../../../../services/AuthorService'; // Replace with appropriate service

interface AddAuthorFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onClose: (e: React.FormEvent) => void;
  authorToEdit?: any; // Optional prop for editing author data
}

export function AddAuthorForm({ onSubmit, authorToEdit, onClose }: AddAuthorFormProps) {
  const [name, setName] = useState('');
  const [bio, setbio] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null); // Store current image URL

  // Update the form when there's data in authorToEdit (for editing)
  useEffect(() => {
    if (authorToEdit) {
      setName(authorToEdit.name);
      setbio(authorToEdit.bio);
      setCurrentImageUrl(authorToEdit.image_url); // Set current image URL
    }
  }, [authorToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (image) {
      formData.append('image', image); // Append image if provided
    }

    try {
      let response;

      if (authorToEdit) {
        // Update the author if editing
        response = await updateAuthor({
          id: authorToEdit.ID,
          name,
          bio,
          image,
        });
      } else {
        // Create a new author if adding
        response = await createAuthor({name, bio, image});
      }

      const data = response.data;
      if (response?.data?.ID) {
        console.log('Author saved:', data);
        setName('');
        setbio('');
        setImage(null);
        setCurrentImageUrl(null);
        onSubmit(e); // Trigger onSubmit after the form is saved
      } else {
        console.error('Error saving author:', data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mx-auto w-fit">
        <div className="rounded-full bg-indigo-100 p-3">
          <Tag className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tên tác giả
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

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            Tiểu sử
          </label>
          <textarea
            id="bio"
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            required
            value={bio}
            onChange={(e) => setbio(e.target.value)}
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

        {/* Display selected or current image */}
        <div className="mt-4">
          {image ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">Ảnh đã chọn</label>
              <img
                src={URL.createObjectURL(image)} // Create temporary URL for the selected image
                alt="Selected"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          ) : currentImageUrl ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">Ảnh hiện tại</label>
              <img
                src={currentImageUrl} // Use the current image URL
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
          {isSubmitting ? 'Đang lưu tác giả...' : authorToEdit ? 'Cập nhật tác giả' : 'Thêm tác giả'}
        </button>
      </div>
    </form>
  );
}
