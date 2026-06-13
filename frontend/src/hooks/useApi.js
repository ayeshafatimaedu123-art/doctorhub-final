import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook for API calls with loading/error state
 * Usage: const { data, loading, error, refetch } = useApi('/doctors');
 */
const useApi = (endpoint, options = {}) => {
  const { params, immediate = true, method = 'get' } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (overrideParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = method === 'get'
        ? await api.get(endpoint, { params: overrideParams || params })
        : await api[method](endpoint, overrideParams || params);
      setData(response.data);
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint, params, method]);

  useEffect(() => {
    if (immediate) fetchData();
  }, [immediate]);

  return { data, loading, error, refetch: fetchData };
};

export default useApi;
