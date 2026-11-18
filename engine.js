
const TemplateEngine = {

  getAll() {
    return templates;
  },

  getById(id) {
    return templates.find(template => template.id === id) || null;
  },

  getByCategory(category) {
    if (category === "All") return templates;

    return templates.filter(
      template => template.category === category
    );
  },

  search(query, category = "All") {
    const searchText = query.trim().toLowerCase();

    return templates.filter(template => {

      const matchesCategory =
        category === "All" ||
        template.category === category;

      const matchesSearch =
        !searchText ||
        template.title.toLowerCase().includes(searchText) ||
        template.description.toLowerCase().includes(searchText) ||
        template.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  },

  getTrending() {
    return templates.filter(template => template.trending);
  }

};
