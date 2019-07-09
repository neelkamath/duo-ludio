/**
 * This is the abstraction layer for the `localForage` item "categories". Use [[initialize]] when the app starts. The
 * use of any function will automatically download and delete relevant tracks to `localForage`. Therefore, any track
 * saved to a category can be considered to have been downloaded, or in the process of being downloaded.
 */

import * as beats from './beats';
import localForage from 'localforage';

/** This is the item "categories" in persistent storage. The keys are category names, and the values are its tracks. */
export type Categories = Map<string, Set<string>>;

/** Initializes storage if necessary */
export async function initialize(): Promise<void> {
    if (await getCategories() === null) await setCategories(new Map());
}

export async function getCategories(): Promise<Categories> {
    return await localForage.getItem('categories');
}

export async function hasTracks(category: string): Promise<boolean> {
    return (await getCategory(category)).size > 0;
}

export async function create(category: string): Promise<void> {
    const categories = await getCategories();
    categories.set(category, new Set());
    await setCategories(categories);
}

/** @returns Whether `category` has `track` */
export async function hasTrack(category: string, track: string): Promise<boolean> {
    return (await getCategory(category)).has(track);
}

/**
 * This function won't do anything if `category` already contains `track`.
 * @param category Category to add `track` to
 * @param track Track to add
 */
export async function addTrack(category: string, track: string): Promise<void> {
    if (await hasTrack(category, track)) return;
    const categories = await getCategories();
    categories.get(category)!.add(track);
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
    tracks.delete(track);
    await setCategories(categories);
}

/** @param category Category's tracks to return */
export async function getCategory(category: string): Promise<Set<string>> {
    return (await getCategories()).get(category)!;
}

/** @returns Names of every category */
export async function getNames(): Promise<Set<string>> {
    return new Set((await getCategories()).keys());
}

/** @param category Category to check for existence */
export async function has(category: string): Promise<boolean> {
    return (await getNames()).has(category);
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

/** @returns Every track from every category */
export async function getAllTracks(): Promise<Set<string>> {
    const strings = [...(await getCategories()).values()].reduce((allTracks, tracks) => {
        allTracks.push(...tracks);
        return allTracks;
    }, new Array<string>());
    return new Set(strings);
}

/**
 * This will download every track in `categories`, and delete every other downloaded track. This function will return
 * before all the tracks have finished downloading.
 * @param categories Categories to overwrite all existing categories
 */
export async function setCategories(categories: Categories): Promise<void> {
    await localForage.setItem('categories', categories);
    const tracks = [...await getAllTracks()];
    beats.TrackManager.downloadAll(tracks);
    await beats.pruneExcept(tracks);
}