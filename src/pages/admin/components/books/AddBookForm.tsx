import React, { useState, useEffect } from "react";
import { Library } from "lucide-react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
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

// Define validation schema using yup
const validationSchema = yup.object().shape({
  title: yup.string().required("Tên sách là bắt buộc"),
  price: yup
    .number()
    .required("Giá sách là bắt buộc")
    .positive("Giá sách phải là số dương")
    .typeError("Giá sách phải là số"),
  quantity: yup
    .number()
    .required("Số lượng là bắt buộc")
    .min(1, "Số lượng phải lớn hơn 0")
    .typeError("Số lượng phải là số"),
  author: yup.object().required("Cần chọn một tác giả"), // Single author validation
  category: yup.array().min(1, "Cần chọn ít nhất một thể loại"),
  description: yup.string().optional(),
});

export function AddBookForm({ onSubmit, onClose, book }: AddBookFormProps) {
  const { data: authorsData, isLoading: isAuthorsLoading } = useAuthorsQuery(
    1,
    100,
    ""
  );
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategoriesQuery(1, 100, "");

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: book?.title || "",
      author: book?.author || null, // Single author as null
      category: book?.categories || [],
      description: book?.description || "",
      price: book?.price || 0,
      quantity: book?.quantity_in_stock || 0,
    },
  });

  // Handle form submission
  const onFormSubmit = (e: any) => {
    const data = getValues();
    onSubmit(e, {
      ...data,
      categories: data?.category?.map((item: any) => item.ID),
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="mx-auto w-fit">
        <div className="rounded-full bg-indigo-100 p-3">
          <Library className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="d-flex gap-2" style={{ display: "flex" }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Tên sách"
                variant="standard"
                error={!!errors.title}
                helperText={errors.title?.message}
                className="flex-1"
                fullWidth
              />
            )}
          />
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Giá sách"
                variant="standard"
                error={!!errors.price}
                helperText={errors.price?.message}
                type="number"
                className="flex-1"
                fullWidth
              />
            )}
          />
        </div>

        <div className="d-flex gap-2" style={{ display: "flex" }}>
          {/* Author Search */}
          <Controller
            name="author"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                className="flex-1"
                options={authorsData?.authors || []}
                getOptionLabel={(option: any) => option.name || ""}
                onChange={(_, newValue) => field.onChange(newValue)}
                loading={isAuthorsLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Tác giả"
                    placeholder="Tìm kiếm tác giả"
                    error={!!errors.author}
                    helperText={errors.author?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: isAuthorsLoading ? (
                        <CircularProgress color="inherit" size={24} />
                      ) : null,
                    }}
                  />
                )}
              />
            )}
          />
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Số lượng"
                variant="standard"
                type="number"
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
                className="flex-1"
                fullWidth
              />
            )}
          />
        </div>

        {/* Category Search */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={categoriesData?.categories || []}
              getOptionLabel={(option) => option.name}
              onChange={(_, newValue) => field.onChange(newValue)}
              loading={isCategoriesLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label="Thể loại"
                  placeholder="Tìm kiếm thể loại"
                  error={!!errors.category}
                  helperText={errors.category?.message}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: isCategoriesLoading ? (
                      <CircularProgress color="inherit" size={24} />
                    ) : null,
                  }}
                />
              )}
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mô tả"
              multiline
              rows={4}
              variant="standard"
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
            />
          )}
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
