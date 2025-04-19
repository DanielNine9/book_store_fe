import React, { useState } from "react";
import { Library } from "lucide-react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  IconButton,
  Button,
  Input,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useAuthorsQuery from "../../../../queries/AuthorQuery";
import useCategoriesQuery from "../../../../queries/CategoryQuery";
import { Delete } from "lucide-react";  // For deleting images

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
  publisher: yup.string().required("Nhà xuất bản là bắt buộc"),
  publication_year: yup
    .number()
    .required("Năm xuất bản là bắt buộc")
    .typeError("Năm xuất bản phải là số"),
  weight: yup
    .number()
    .required("Cân nặng là bắt buộc")
    .positive("Cân nặng phải là số dương")
    .typeError("Cân nặng phải là số"),
  dimensions: yup.string().required("Kích thước là bắt buộc"),
  pages: yup
    .number()
    .required("Số trang là bắt buộc")
    .typeError("Số trang phải là số"),
  binding_type: yup.string().required("Loại bìa là bắt buộc"),
  images: yup.array().min(1, "Cần ít nhất một ảnh").required("Ảnh là bắt buộc"),  // Image validation
});

export function AddBookForm({ onSubmit, onClose, book }: AddBookFormProps) {
  const { data: authorsData, isLoading: isAuthorsLoading } = useAuthorsQuery(
    1,
    100,
    ""
  );
  console.log(book)
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategoriesQuery(1, 100, "");
// console.log("categoriesData?.categories[0].ID", categoriesData?.categories[0].ID)
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    // defaultValues: {
    //   title: "Test Book Title",
    //   author: authorsData?.authors[0], 
    //   category: [categoriesData?.categories[0]],
    //   description: "This is a test description.",
    //   price: 1000,
    //   quantity: 10,
    //   publisher: "Test Publisher",
    //   publication_year: 2023,
    //   weight: 0.5,
    //   dimensions: "15 x 20 x 3 cm",
    //   pages: 200,
    //   binding_type: "Paperback",
    //   images: [{ name: "test-image.jpg", type: "image/jpeg", size: 1000000 }], // Example image object
    // },
    defaultValues: {
      title: book?.title || "",
      author: book?.author || null, 
      category: book?.categories || [],
      description: book?.description || "",
      price: book?.price || 0,
      quantity: book?.quantity_in_stock || 0,
      publisher: book?.book_detail?.publisher || "",
      publication_year: book?.book_detail?.publication_year || "",
      weight: book?.book_detail?.weight || 0,
      dimensions: book?.book_detail?.dimensions || "",
      pages: book?.book_detail?.pages || 0,
      binding_type: book?.book_detail?.binding_type || "",
      images: book?.images || [],  
    },
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // To show selected images before submission

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      const imageUrls = newImages.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...imageUrls]);

      const images = getValues("images");
      setValue("images", [...images, ...newImages]);
    }
  };

  const handleImageDelete = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    const images = getValues("images");
    const newImages = images.filter((_, i) => i !== index);
    setValue("images", newImages);
  };

  const onFormSubmit = (e: any) => {
    const data = getValues();
    onSubmit(e, {
      ...data,
      categories: data?.category?.map((item: any) => item.ID),
      images: data?.images,  
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

        {/* Author Search */}
        <div className="d-flex gap-2" style={{ display: "flex" }}>
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
              getOptionLabel={(option) => option?.name}
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

        {/* Additional Fields */}
        <h3>Chi tiết</h3>
        <Controller
          name="publisher"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nhà xuất bản"
              variant="standard"
              error={!!errors.publisher}
              helperText={errors.publisher?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="publication_year"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Năm xuất bản"
              variant="standard"
              type="number"
              error={!!errors.publication_year}
              helperText={errors.publication_year?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="weight"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Cân nặng (kg)"
              variant="standard"
              type="number"
              error={!!errors.weight}
              helperText={errors.weight?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="dimensions"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Kích thước"
              variant="standard"
              error={!!errors.dimensions}
              helperText={errors.dimensions?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="pages"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Số trang"
              variant="standard"
              type="number"
              error={!!errors.pages}
              helperText={errors.pages?.message}
              fullWidth
            />
          )}
        />
        <Controller
          name="binding_type"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Loại bìa"
              variant="standard"
              error={!!errors.binding_type}
              helperText={errors.binding_type?.message}
              fullWidth
            />
          )}
        />

        {/* Image Upload */}
        <div>
          <Controller
            name="images"
            control={control}
            render={({ field }) => (
              <div>
                <Button
                  variant="contained"
                  component="label"
                  className="mt-4"
                >
                  Thêm ảnh
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
                {imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <div className="flex gap-1">
                      {imagePreviews.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`image-${index}`}
                            className="h-24 w-24 object-cover"
                          />
                          <IconButton
                            onClick={() => handleImageDelete(index)}
                            className="absolute top-0 right-0"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          />
        </div>

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
