import * as categories from '../storage/categories';
import {invalidityMessenger} from '../web_components/invalid_message';

export default function (): invalidityMessenger {
    return async (name: string): Promise<string | null> => {
        if (name === '') return 'Please enter a category name.';
        if (await categories.has(name)) return 'That category already exists.';
        return null;
    }
}