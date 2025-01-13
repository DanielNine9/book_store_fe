import { useQuery } from '@tanstack/react-query';
import { fetchBooks } from '../services/BookService';

const useBooksQuery = (
  currentPage: number,
  itemsPerPage: number,
  search: string = '',
  searchFields: string = 'code',
  searchOperator: string = 'OR'
) => {
  const queryKey = ['books', currentPage, itemsPerPage, search, searchFields, searchOperator];
  return useQuery({
    queryKey,
    queryFn: () => fetchBooks(currentPage, itemsPerPage, search, searchFields, searchOperator),
    // staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    staleTime: 1000 * 10, 

    // placeholderData: keepPreviousData,   // Keep previous data while new data is loading
    // cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes even after query is not used
  });
};

export default useBooksQuery;
