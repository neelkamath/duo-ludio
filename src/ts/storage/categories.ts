/** This is the abstraction layer for the `localForage` item "categories". Use [[initialize]] when the app starts. */

import * as beats from './beats';
import localForage from 'localforage';

/** This is the `localForage` item "categories". The keys are category names, and the values are the tracks in it. */
export type Categories = Map<string, string[]>;

/** Initializes storage if necessary */
export async function initialize(): Promise<void> {
    localForage.config({name: 'Duo Ludio', description: "Stores the user's binaural beats collection"});
    if (await getCategories() === null) await setCategories(new Map());
}

export async function getCategories(): Promise<Categories> {
    return await localForage.getItem('categories');
}

export async function hasTracks(category: string): Promise<boolean> {
    return (await getCategory(category)).length > 0;
}

export async function create(category: string): Promise<void> {
    const categories = await getCategories();
    categories.set(category, []);
    await setCategories(categories);
}

/** @returns Whether `category` has `track` saved */
export async function hasTrack(category: string, track: string): Promise<boolean> {
    return (await getCategory(category)).includes(track);
}

/**
 * @param category Category to add `track` to
 * @param track Track to add
 */
export async function addTrack(category: string, track: string): Promise<void> {
    const categories = await getCategories();
    categories.get(category)!.push(track);
    await setCategories(categories);
}

/**
 * @param category Category from which `track` will be removed
 * @param track Track's name
 */
export async function removeTrack(category: string, track: string): Promise<void> {
    const categories = await getCategories();
    const tracks = categories.get(category)!;
    tracks.splice(tracks.indexOf(track), 1);
    await setCategories(categories);
}

/** @param category Category's tracks to return */
export async function getCategory(category: string): Promise<string[]> {
    return (await getCategories()).get(category)!;
}

/** @returns Names of every category */
export async function getNames(): Promise<string[]> {
    return [...(await getCategories()).keys()];
}

/** @param category Category to check for existence */
export async function has(category: string): Promise<boolean> {
    return (await getNames()).includes(category);
}

export async function deleteCategory(category: string): Promise<void> {
    const categories = await getCategories();
    categories.delete(category);
    await setCategories(categories);
}

export async function rename(currentName: string, newName: string): Promise<void> {
    const categories = await getCategories();
    const value = categories.get(currentName)!;
    categories.delete(currentName);
    categories.set(newName, value);
    await setCategories(categories);
}

/** @returns Every track from every category sans duplicates */
export async function getAllTracks(): Promise<string[]> {
    const tracks = new Array<string>().concat(...(await getCategories()).values());
    return tracks.filter((track, index) => tracks.indexOf(track) === index);
}

/**
 * This will delete all downloaded tracks which aren't present in `categories`.
 * @param categories The categories which will overwrite all existing categories
 */
export async function setCategories(categories: Categories): Promise<void> {
    await localForage.setItem('categories', categories);
    await beats.pruneExcept(await getAllTracks());
}