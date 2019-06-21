export function initialize() {
    if (getCategories() === null) setCategories({});
}

export function getCategories() {
    return JSON.parse(localStorage.getItem('categories'));
}

export function createCategory(category) {
    let categories = getCategories();
    categories[category] = {id: `T${new Date().getTime()}`, tracks: []};
    setCategories(categories);
}

export function getCategoryNames() {
    return Object.keys(getCategories());
}

export function getCategoryId(category) {
    return getCategories()[category]['id'];
}

export function deleteCategory(category) {
    let categories = getCategories();
    delete categories[category];
    setCategories(categories);
}

export function renameCategory(currentName, newName) {
    let categories = getCategories();
    let value = categories[currentName];
    delete categories[currentName];
    categories[newName] = value;
    setCategories(categories);
}

export function setCategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}
