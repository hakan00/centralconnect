export const getApiMessage = (error, fallback) => error?.response?.data?.message || fallback;
