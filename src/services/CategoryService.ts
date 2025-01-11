import axiosInstance from "../utils/axiosConfig";


export const fetchCategories = async (page: number, limit: number, search: string, searchFields: string, searchOperator: string) => {
    try {
      const response = await axiosInstance.get('/categories/', {
        params: {
          page,
          limit,
          search,
          search_fields: searchFields,
          search_operator: searchOperator,
        },
      });
      return response.data;  // Trả về dữ liệu từ API
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu', error);
    }
  };
  
  export const createCategory = async (name: string, description: string, image: File | null) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (image) {
        formData.append('image', image);
      }
  
      const response = await axiosInstance.post('/categories/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response;
    } catch (error) {
      throw new Error('Lỗi khi thêm loại sách!');
    }
  };
  

interface CategoryUpdateData {
  id: string;
  name: string;
  description: string;
  image?: File | null; 
}

export const updateCategory = async ({ id, name, description, image }: CategoryUpdateData) => {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    if (image) {
      formData.append('image', image);
    }

    const response = await axiosInstance.put(`/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response; 
  } catch (error: any) {
    console.error(error);
    throw new Error('Lỗi khi cập nhật loại sách!'); 
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data; 
  } catch (error) {
    throw new Error('Lỗi khi xóa loại sách!');
  }
};
