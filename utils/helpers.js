module.exports = {
  format_date: (date) => {
    return new Date(date).toLocaleDateString();
  },
  format_time: (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};