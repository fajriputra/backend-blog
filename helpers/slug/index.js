module.exports = {
  convertToSlug: (slug) => {
    return slug
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  },
};
