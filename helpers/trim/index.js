module.exports = {
  removeSpace: (input) => {
    if (!input) return "";
    return input.trim().replace(/\s+/g, " ");
  },
};
