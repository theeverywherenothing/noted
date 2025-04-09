const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('token');
    window.location.href = '/auth';
    return Promise.reject('Unauthorized');
  }

  return response;
};

export default authFetch;
