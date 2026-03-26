export const formatLabel = (value) =>
  String(value || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const formatDateTime = (value) => {
  if (!value) {
    return 'Not scheduled';
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
};

export const formatDate = (value) => {
  if (!value) {
    return 'No date';
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium'
  }).format(new Date(value));
};

export const toInputDateTime = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

export const truncateText = (value, limit = 140) => {
  if (!value) {
    return '';
  }

  return value.length > limit ? `${value.slice(0, limit).trim()}...` : value;
};
