import axiosInstance from "../utils/axiosConfig";

export const fetchAuthors = async (page: number, limit: number, search: string, searchFields: string, searchOperator: string) => {
  try {
    const response = await axiosInstance.get('/authors/', {
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
    console.error('Error fetching authors:', error);
  }
};

interface AuthorCreateData {
    name: string;
    bio: string;
    image: File | null;
  }
  export const createAuthor = async ({ name, bio, image }: AuthorCreateData) => {
    try {
      // Create a JSON object to hold the data
      const authorData = {
        name,
        bio,
        image: image ? image : null, // You can leave image null or undefined if there's no file
      };
  
      // If you don't need to handle files, use JSON directly
      const response = await axiosInstance.post('/authors/', authorData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("response ", response)
      return response;
    } catch (error) {
      throw new Error('Error creating author!');
    }
  };
  

  interface AuthorUpdateData {
    id: string;
    name: string;
    bio: string;
    image?: File | null;
  }
  
  export const updateAuthor = async ({ id, name, bio, image }: AuthorUpdateData) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      if (image) {
        formData.append('image', image);
      }
  
      const authorData = {
        name,
        bio,
        image: image ? image : null, // You can leave image null or undefined if there's no file
      };
      const response = await axiosInstance.put(`/authors/${id}`, authorData, {
        headers: {
          // 'Content-Type': 'multipart/form-data',
          'Content-Type': 'application/json',
        },
      });
  
      return response;
    } catch (error) {
      console.error('Error updating author:', error);
      throw new Error('Error updating author!');
    }
  };

  
  export const deleteAuthor = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/authors/${id}`);
      return response.data; // Return the deleted author data (or confirmation)
    } catch (error) {
      throw new Error('Error deleting author!');
    }
  };
  
