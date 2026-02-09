module.exports = {
  format_date: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  format_time: (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  substring: (str, start, end) => {
    if (!str) return '';
    return str.substring(start, end).toUpperCase();
  }
};