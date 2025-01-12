import React, { useEffect, useState } from "react";
import { Library } from "lucide-react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  InputAdornment,
  TextareaAutosize,
} from "@mui/material";
import useAuthorsQuery from "../../../../queries/AuthorQuery";
import useCategoriesQuery from "../../../../queries/CategoryQuery";

interface AddBookFormProps {
  onSubmit: (e: React.FormEvent, bookData: any) => void;
  onClose: (e: React.FormEvent) => void;
  book?: any; // Optional: pass in book data for editing
}

interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}
// In AddBookForm component
export function AddBookForm({ onSubmit, onClose, book }: AddBookFormProps) {
  const [formData, setFormData] = useState({
    title: book?.title || "",
    author: book?.author || [],
    category: book?.categories || [],
    description: book?.description || "",
    price: book?.price || 0,
    quantity: book?.quantity_in_stock || 0,
  });

  const [authorSearch, setAuthorSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  // Fetch authors and categories based on search input
  const { data: authorsData, isLoading: isAuthorsLoading } = useAuthorsQuery(
    1,
    100,
    authorSearch
  );
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategoriesQuery(1, 100, categorySearch);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, {
      ...formData,
      categories: formData?.category?.map((item: any) => item.ID),
    }); // Call the onSubmit passed from BooksContent
  };

  // Ensure options is always an array to prevent errors
  const authorOptions = authorsData?.authors || [];
  const categoryOptions = categoriesData?.categories || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mx-auto w-fit">
        <div className="rounded-full bg-indigo-100 p-3">
          <Library className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="d-flex gap-2" style={{ display: "flex" }}>
          <TextField
            id="title"
            label="Tên sách"
            variant="standard"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="flex-1"
            style={{ width: "100%" }}
          />
          <TextField
            id="price"
            label="Giá sách"
            variant="standard"
            name="price"
            onChange={handleChange}
            value={formData.price}
            type="number"
            className="flex-1"
            style={{ width: "100%" }}
          />
        </div>
        <div className="d-flex gap-2" style={{ display: "flex" }}>
          <Autocomplete
            // multiple
            id="author"
            options={authorOptions}
            getOptionLabel={(option) => option.name || ""}
            value={formData.author}
            onChange={(_, newValue) => {
              console.log("newValue ", newValue);
              setFormData({ ...formData, author: newValue });
            }}
            className="flex-1"
            style={{ width: "100%" }}
            loading={isAuthorsLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Tác giả"
                placeholder="Tìm kiếm tác giả"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: isAuthorsLoading ? (
                    <CircularProgress color="inherit" size={24} />
                  ) : null,
                }}
              />
            )}
          />
          <TextField
            id="quantity"
            label="Số lượng"
            variant="standard"
            name="quantity"
            onChange={handleChange}
            value={formData.quantity}
            type="number"
            className="flex-1"
            style={{ width: "100%" }}
          />
        </div>

        {/* Author Search */}

        {/* Category Search */}
        <Autocomplete
          multiple
          id="category"
          options={categoryOptions}
          getOptionLabel={(option) => option.name}
          value={formData.category}
          onChange={(_, newValue) =>
            setFormData({ ...formData, category: newValue })
          }
          loading={isCategoriesLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Thể loại"
              placeholder="Tìm kiếm thể loại"
              InputProps={{
                ...params.InputProps,
                endAdornment: isCategoriesLoading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : null,
              }}
            />
          )}
        />

        {/* Description */}
        <TextField
          id="description"
          label="Mô tả"
          multiline
          rows={4}
          variant="standard"
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={{ width: "100%" }}
        />
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
          {book ? "Cập nhật sách" : "Thêm sách"}
        </button>
      </div>
    </form>
  );
}
