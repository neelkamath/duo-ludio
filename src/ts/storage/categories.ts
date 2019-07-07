/**
 * This is the abstraction layer for the `localForage` item "categories". Use [[initialize]] when the app starts. The
 * use of any function will automatically download and delete relevant tracks to `localForage`. Therefore, any track
 * saved to a category can be considered to have been downloaded, or in the process of being downloaded.
 */

import * as beats from './beats';
import localForage from 'localforage';

/** This is the `localForage` item "categories". The keys are category names, and the values are the tracks in it. */
export type Categories = Map<string, string[]>;

/** Initializes storage if necessary */
export async function initialize(): Promise<void> {
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

/** @returns Whether `category` has `track` */
export async function hasTrack(category: string, track: string): Promise<boolean> {
    return (await getCategory(category)).includes(track);
}

/**
 * This function won't do anything if `category` already contains `track`.
 * @param category Category to add `track` to
 * @param track Track to add
 */
export async function addTrack(category: string, track: string): Promise<void> {
    if (await hasTrack(category, track)) return;
    const categories = await getCategories();
    categories.get(category)!.push(track);
    await setCategories(categories);
}

/**
 * It is safe to call this function with a `track` which isn't in `category`.
 * @param category Category from which `track` will be removed
 * @param track Track's name
 */
export async function removeTrack(category: string, track: string): Promise<void> {
    if (!await hasTrack(category, track)) return;
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
 * This will download every track in `categories`, and delete every other downloaded track. This function will return
 * before all the tracks have finished downloading.
 * @param categories The categories which will overwrite all existing categories
 */
export async function setCategories(categories: Categories): Promise<void> {
    await localForage.setItem('categories', categories);
    const tracks = await getAllTracks();
    beats.downloadTracks(tracks);
    await beats.pruneExcept(tracks);
}