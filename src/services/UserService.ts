import axiosInstance from "../utils/axiosConfig";

// Fetch users with pagination and search
export const fetchUsers = async (page: number, limit: number, search: string, searchFields: string, searchOperator: string) => {
  try {
    const response = await axiosInstance.get('/users/', {
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
    console.error('Error fetching users', error);
  }
};

export const createUser = async (username: string, password: string, role: string, active: boolean) => {
  try {
    const response = await axiosInstance.post('/users/', {
      username,
      password,
      role,
      active: Boolean(active)
    });
    return response.data;  
  } catch (error) {
    throw new Error('Error creating user');
  }
};

interface UserUpdateData {
  id: string;
  username?: string;
  password?: string;
  email?: string;
}

export const updateUser = async (id: string, username: string, password: string, role: string, active: boolean) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, {
      username,
      password,
      role,
      active: Boolean(active)
    });
    return response.data;  // Return updated user data or success message
  } catch (error) {
    console.error(error);
    throw new Error('Error updating user');
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Error deleting user');
  }
};


