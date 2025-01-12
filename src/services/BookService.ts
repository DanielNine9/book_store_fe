import { categories } from './../App';
import axiosInstance from "../utils/axiosConfig";

export const fetchBooks = async (
  page: number,
  limit: number,
  search: string,
  searchFields: string,
  searchOperator: string
) => {
  try {
    const response = await axiosInstance.get("/books/", {
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
  quantity: string
) => {
  try {
    const response = await axiosInstance.post("/books/", {
      title,
      description,
      author_id: authorId,
      categories: categoryIds,
      price: Number(price),
      quantity: Number(quantity)
    });
    return response.data;
  } catch (error) {
    console.error("Error creating book:", error);
    throw error;
  }
};

export const updateBook = async (id: string, data: any) => {
  data.price = Number(data.price)
  data.quantity = Number(data.quantity)
  console.log(data);
  
  try {
    const response = await axiosInstance.put(`/books/${id}`, {
      title: data.title,
      description: data.description,
      author_id: data.author.ID,
      categories: data.categories,
      price: Number(data.price),
      quantity: Number(data.quantity)
    });
    return response.data;
  } catch (error) {
    throw new Error('Lỗi khi cập nhật sách!');
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
