/** This is the abstraction layer for the `localStorage` item "categories". Use [[initialize]] when the app starts. */

/** The item in `localStorage` */
interface Categories {
    [category: string]: string[];
}

/** Initializes `localStorage` if necessary */
export function initialize(): void {
    if (getCategories() === null) setCategories({});
}

/** @returns Every category */
export function getCategories(): Categories {
    return JSON.parse(localStorage.getItem('categories')!);
}

export function createCategory(category: string): void {
    const categories = getCategories();
    categories[category] = [];
    setCategories(categories);
}

/** @returns Whether `category` has `track` saved */
export function categoryHasTrack(category: string, track: string): boolean {
    return getCategory(category).includes(track);
}

/**
 * @param category Category to add `track` to
 * @param track Track to add
 */
export function addCategoryTrack(category: string, track: string): void {
    const categories = getCategories();
    categories[category].push(track);
    setCategories(categories);
}

/**
 * @param category Category from which `track` will be removed
 * @param track Track's name
 */
export function removeCategoryTrack(category: string, track: string): void {
    const categories = getCategories();
    const tracks = categories[category];
    tracks.splice(tracks.indexOf(track), 1);
    setCategories(categories);
}

/** @param category Category's tracks to return */
export function getCategory(category: string): string[] {
    return getCategories()[category];
}

/** @returns Names of every category */
export function getCategoryNames(): string[] {
    return Object.keys(getCategories());
}

/** @returns Whether there are any categories */
export function hasNoCategories(): boolean {
    return getCategoryNames().length === 0;
}

/** @param category Category to check for existence */
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

/** @param categories The categories which will overwrite all existing categories */
export function setCategories(categories: Categories): void {
    localStorage.setItem('categories', JSON.stringify(categories));
}
