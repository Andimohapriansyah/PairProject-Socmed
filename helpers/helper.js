function formatDate(value) {
  return new Date(value).toISOString().split('T')[0];
}

module.exports = { formatDate };