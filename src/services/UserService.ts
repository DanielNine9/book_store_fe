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

// Create a new user
export const createUser = async (username: string, password: string, email: string) => {
  try {
    const response = await axiosInstance.post('/users/', {
      username,
      password,
      email,
    });
    return response.data;  // Return the API response (success message + user data)
  } catch (error) {
    throw new Error('Error creating user');
  }
};

// Update user information
interface UserUpdateData {
  id: string;
  username?: string;
  password?: string;
  email?: string;
}

export const updateUser = async ({ id, username, password, email }: UserUpdateData) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, {
      username,
      password,
      email,
    });
    return response.data;  // Return updated user data or success message
  } catch (error) {
    console.error(error);
    throw new Error('Error updating user');
  }
};

// Delete a user by ID
export const deleteUser = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;  // Return success message after deletion
  } catch (error) {
    throw new Error('Error deleting user');
  }
};
