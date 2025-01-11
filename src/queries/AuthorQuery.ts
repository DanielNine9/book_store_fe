import { useQuery } from '@tanstack/react-query';
import { fetchAuthors } from '../services/AuthorService';

const useBooksQuery = (
  currentPage: number,
  itemsPerPage: number,
  search: string = '',
  searchFields: string = 'code',
  searchOperator: string = 'OR'
) => {
  const queryKey = ['authors', currentPage, itemsPerPage, search, searchFields, searchOperator];
  return useQuery({
    queryKey,
    queryFn: () => fetchAuthors(currentPage, itemsPerPage, search, searchFields, searchOperator),
    staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
    // placeholderData: keepPreviousData,   // Keep previous data while new data is loading
    // cacheTime: 1000 * 60 * 10, // Cache data for 10 minutes even after query is not used
  });
};

export default useBooksQuery;
