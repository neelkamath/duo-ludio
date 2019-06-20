export function initialize() {
    if (getCategories() === null) setCategories({});
}

export function getCategories() {
    return JSON.parse(localStorage.getItem('categories'));
}

export function createCategory(category) {
    let categories = getCategories();
    categories[category] = [];
    setCategories(categories);
}

export function deleteCategory(category) {
    let categories = getCategories();
    delete categories[category];
    setCategories(categories);
}

function setCategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}
