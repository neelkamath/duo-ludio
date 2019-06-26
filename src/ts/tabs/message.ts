import * as storage from '../storage';

export function getInvalidMessage(name) {
    if (name === '') return 'Please enter a category name.';
    if (storage.hasCategory(name)) return 'That category already exists.';
    return null;
}