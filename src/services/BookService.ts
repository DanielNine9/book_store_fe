import { categories } from './../App';
import axiosInstance from "../utils/axiosConfig";

export const fetchBooks = async (
  page: number,
  limit: number,
  search: string,
  searchFields: string,
  searchOperator: string,
) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = user?.token;
  try {
    const response = await axiosInstance.get("/books/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        limit,
        search,
        search_fields: searchFields,
        search_operator: searchOperator,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    throw error;
  }
};

export const createBook = async (
  title: string,
  description: string,
  authorId: number,
  categoryIds: number[],
  price: string,
  quantity: string,
  publisher: string,
  publicationYear: string,
  weight: string,
  dimensions: string,
  pages: string,
  bindingType: string,
  images: File[] // Assuming images is an array of File objects
) => {
  try {
    const formData = new FormData();
    console.log("authorId" ,authorId)
    formData.append("title", title);
    formData.append("description", description);
    formData.append("author_id", authorId.toString()); 
    formData.append("price", price);
    formData.append("quantity_in_stock", quantity);
    formData.append("publisher", publisher);
    formData.append("publication_year", publicationYear);
    formData.append("weight", weight);
    formData.append("dimensions", dimensions);
    formData.append("pages", pages);
    formData.append("binding_type", bindingType);
    categoryIds.forEach(item => {
      formData.append("categories", String(item)); // Using "categories[]" to indicate multiple values
    });
    images.forEach(item => {
      formData.append("images", item); // Using "categories[]" to indicate multiple values
    });
   

    const response = await axiosInstance.post("/books/", formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
};

export const updateBook = async (
  bookId: number,  // Pass the book ID to update
  title: string,
  description: string,
  authorId: number,
  categoryIds: number[],
  price: string,
  quantity: string,
  publisher: string,
  publicationYear: string,
  weight: string,
  dimensions: string,
  pages: string,
  bindingType: string,
  images: File[] // Assuming images is an array of File objects
) => {
  try {
    const formData = new FormData();
    console.log("authorId", authorId);
    
    // Append all fields to FormData
    formData.append("title", title);
    formData.append("description", description);
    formData.append("author_id", authorId.toString()); 
    formData.append("price", price);
    formData.append("quantity_in_stock", quantity);
    formData.append("publisher", publisher);
    formData.append("publication_year", publicationYear);
    formData.append("weight", weight);
    formData.append("dimensions", dimensions);
    formData.append("pages", pages);
    formData.append("binding_type", bindingType);

    // Append categories array
    categoryIds.forEach(item => {
      formData.append("categories", String(item)); // Categories are passed as an array
    });

    // Append images
    images.forEach(item => {
      formData.append("images", item); // Images are passed as an array
    });

    // Send the request to update the existing book
    const response = await axiosInstance.put(`/books/${bookId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
};


export const deleteBook = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Lỗi khi xóa sách!');
  }
};
