import { useState, useEffect } from 'react';

/**
 * Debounce a value — useful for search inputs
 * Usage: const debouncedSearch = useDebounce(searchTerm, 400);
 */
const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
