import React, { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import { createAuthor, updateAuthor } from '../../../../services/AuthorService'; // Replace with appropriate service
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Button, CircularProgress } from '@mui/material';

interface AddAuthorFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onClose: (e: React.FormEvent) => void;
  authorToEdit?: any; // Optional prop for editing author data
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Tên tác giả là bắt buộc"),
  bio: yup.string().required("Tiểu sử là bắt buộc"),
  // image: yup.mixed().nullable(),
});

export function AddAuthorForm({ onSubmit, authorToEdit, onClose }: AddAuthorFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null); // Store current image URL

  // Initialize form with React Hook Form
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: authorToEdit?.name || '',
      bio: authorToEdit?.bio || '',
      // image: authorToEdit?.image_url || null, // For editing
    },
  });

  // Update the form when there's data in authorToEdit (for editing)
  useEffect(() => {
    if (authorToEdit) {
      setCurrentImageUrl(authorToEdit.image_url); // Set current image URL for editing
    }
  }, [authorToEdit]);

  const onFormSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('bio', data.bio);
    if (image) {
      formData.append('image', image); // Append image if provided
    }

    try {
      let response;

      if (authorToEdit) {
        // Update the author if editing
        response = await updateAuthor({
          id: authorToEdit.ID,
          name: data.name,
          bio: data.bio,
          image,
        });
      } else {
        // Create a new author if adding
        response = await createAuthor({ name: data.name, bio: data.bio, image });
      }

      const responseData = response.data;
      if (response?.data?.ID) {
        console.log('Author saved:', responseData);
        reset();
        setImage(null);
        setCurrentImageUrl(null);
        onSubmit(data); // Trigger onSubmit after the form is saved
      } else {
        console.error('Error saving author:', responseData);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="mx-auto w-fit">
        <div className="rounded-full bg-indigo-100 p-3">
          <Tag className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Author Name */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tên tác giả"
              variant="standard"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message as string}
            />
          )}
        />

        {/* Author Bio */}
        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Tiểu sử"
              variant="standard"
              multiline
              rows={4}
              fullWidth
              error={!!errors.bio}
              helperText={errors.bio?.message as string}
            />
          )}
        />

        {/* Image Upload */}
        {/* <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Hình ảnh (Tùy chọn)
              </label>
              <input
                {...field}
                type="file"
                id="image"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setImage(e.target.files[0]);
                    field.onChange(e.target.files[0]);
                  }
                }}
              />
            </>
          )}
        /> */}

        {/* Display selected or current image */}
        {/* <div className="mt-4">
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
        </div> */}
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          onClick={onClose}
          variant="outlined"
          className="text-sm font-medium text-gray-700"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={false} // Set to `true` if there's any loading state
        >
          {authorToEdit ? 'Cập nhật tác giả' : 'Thêm tác giả'}
        </Button>
      </div>
    </form>
  );
}
