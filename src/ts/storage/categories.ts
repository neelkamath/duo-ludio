/** This is the abstraction layer for the `localStorage` item "categories". Use [[initialize]] when the app starts. */

/** The `localStorage` item "categories" */
interface Categories {
    [category: string]: string[];
}

/** Initializes `localStorage` if necessary */
export function initialize(): void {
    if (getCategories() === null) setCategories({});
}

export function getCategories(): Categories {
    return JSON.parse(localStorage.getItem('categories')!);
}

export function create(category: string): void {
    const categories = getCategories();
    categories[category] = [];
    setCategories(categories);
}

/** @returns Whether `category` has `track` saved */
export function hasTrack(category: string, track: string): boolean {
    return getCategory(category).includes(track);
}

/**
 * @param category Category to add `track` to
 * @param track Track to add
 */
export function addTrack(category: string, track: string): void {
    const categories = getCategories();
    categories[category].push(track);
    setCategories(categories);
}

/**
 * @param category Category from which `track` will be removed
 * @param track Track's name
 */
export function removeTrack(category: string, track: string): void {
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
export function getNames(): string[] {
    return Object.keys(getCategories());
}

/** @returns Whether there are any categories */
export function hasNoCategories(): boolean {
    return getNames().length === 0;
}

/** @param category Category to check for existence */
export function has(category: string): boolean {
    return getNames().includes(category);
}

export function deleteCategory(category: string): void {
    const categories = getCategories();
    delete categories[category];
    setCategories(categories);
}

export function rename(currentName: string, newName: string): void {
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
