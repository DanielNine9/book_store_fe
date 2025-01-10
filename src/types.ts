export interface Book {
  id: number;
  title: string;
  author: string;
  price: string;
  category: string;
  image: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  created_at: string;
}

export interface Staff {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  position: string;
  hire_date: string;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface BookStats {
  totalBooks: number;
  outOfStock: number;
  lowStock: number;
  categories: {
    name: string;
    count: number;
  }[];
}