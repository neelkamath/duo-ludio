export function initialize() {
    if (getCategories() === null) setCategories({});
}

export function getCategories() {
    return JSON.parse(localStorage.getItem('categories'));
}

export function createCategory(category) {
    let categories = getCategories();
    categories[category] = {'tracks': []};
    setCategories(categories);
}

export function categoryHasTrack(category, track) {
    return getCategoryTracks(category).includes(track);
}

export function addCategoryTrack(category, track) {
    let categories = getCategories();
    categories[category]['tracks'].push(track);
    setCategories(categories);
}

export function removeCategoryTrack(category, track) {
    let categories = getCategories();
    let tracks = categories[category]['tracks'];
    tracks.splice(tracks.indexOf(track), 1);
    setCategories(categories);
}

export function getCategoryTracks(category) {
    return getCategories()[category]['tracks'];
}

export function getCategoryNames() {
    return Object.keys(getCategories());
}

export function hasNoCategories() {
    return getCategoryNames().length === 0;
}

export function hasCategory(category) {
    return getCategoryNames().includes(category);
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
