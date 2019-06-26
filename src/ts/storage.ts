interface Categories {
    [category: string]: string[];
}

export function initialize(): void {
    if (getCategories() === null) setCategories({});
}

export function getCategories(): Categories {
    return JSON.parse(localStorage.getItem('categories')!);
}

export function createCategory(category: string): void {
    const categories = getCategories();
    categories[category] = [];
    setCategories(categories);
}

export function categoryHasTrack(category: string, track: string): boolean {
    return getCategory(category).includes(track);
}

export function addCategoryTrack(category: string, track: string): void {
    const categories = getCategories();
    categories[category].push(track);
    setCategories(categories);
}

export function removeCategoryTrack(category: string, track: string): void {
    const categories = getCategories();
    const tracks = categories[category];
    tracks.splice(tracks.indexOf(track), 1);
    setCategories(categories);
}

export function getCategory(category: string): string[] {
    return getCategories()[category];
}

export function getCategoryNames(): string[] {
    return Object.keys(getCategories());
}

export function hasNoCategories(): boolean {
    return getCategoryNames().length === 0;
}

export function hasCategory(category: string): boolean {
    return getCategoryNames().includes(category);
}

export function deleteCategory(category: string): void {
    const categories = getCategories();
    delete categories[category];
    setCategories(categories);
}

export function renameCategory(currentName: string, newName: string): void {
    const categories = getCategories();
    const value = categories[currentName];
    delete categories[currentName];
    categories[newName] = value;
    setCategories(categories);
}

export function setCategories(categories: Categories): void {
    localStorage.setItem('categories', JSON.stringify(categories));
}
