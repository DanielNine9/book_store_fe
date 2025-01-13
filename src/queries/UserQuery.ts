import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../services/UserService';

const useUsersQuery = (
  currentPage: number,
  itemsPerPage: number,
  search: string = '',
  searchFields: string = 'code',
  searchOperator: string = 'OR'
) => {
  const queryKey = ['users', currentPage, itemsPerPage, search, searchFields, searchOperator];
  return useQuery({
    queryKey,
    queryFn: () => fetchUsers(currentPage, itemsPerPage, search, searchFields, searchOperator),
    staleTime: 1000 * 10, 
  });
};

export default useUsersQuery;
