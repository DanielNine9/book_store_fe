import axiosInstance from "../utils/axiosConfig";

export const fetchAllTransaction = async (page: number, limit: number, search: string, searchFields: string, searchOperator: string) => {
    try {
      const response = await axiosInstance.get('/admin/transactions', {
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
      console.error('Error fetching users:', error);
    }
  };

  export async function fetchTransactions(limit: number = 10): Promise<any[]> {
    const response = await axiosInstance.get(`/transactions/?limit=${limit}`);
    return response.data;
}