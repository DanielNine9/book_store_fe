import axiosInstance from "../utils/axiosConfig";

// Register function for creating a new user
interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const registerUser = async ({ username, email, password }: RegisterData) => {
  try {
    const userData = {
      username,
      email,
      password,
    };

    const response = await axiosInstance.post('/auth/register', userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the response from the backend (success message or data)
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error('Error registering user!');
  }
};

// Login function for authenticating a user
interface LoginData {
  username: string;
  password: string;
}

export const loginUser = async ({ username, password }: LoginData) => {
  try {
    const loginData = {
      username,
      password,
    };

    const response = await axiosInstance.post('/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return the token or user data on successful login
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new Error('Error logging in user!');
  }
};
