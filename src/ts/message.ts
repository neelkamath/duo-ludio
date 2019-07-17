import * as categories from './storage/categories';
import {InvalidityMessenger} from './web_components/invalid-message';

export default function (): InvalidityMessenger {
    return async (name: string): Promise<string | null> => {
        if (name.trim() === '') return 'Please enter a category name.';
        if (await categories.has(name)) return 'That category already exists.';
        return null;
    }
}