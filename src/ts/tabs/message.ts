import * as storage from '../storage';
import {getInvalidMessage} from '../web_components/invalid_message';

export function getInvalidMessenger(): getInvalidMessage {
    return (name) => {
        if (name === '') return 'Please enter a category name.';
        if (storage.hasCategory(name)) return 'That category already exists.';
        return null;
    }
}