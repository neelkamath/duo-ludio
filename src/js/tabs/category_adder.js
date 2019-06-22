import * as storage from '../storage';

export function getInvalidMessage(name) {
    if (name === '') return 'Please enter a category name.';
    if (storage.getCategoryNames().includes(name)) return 'That category already exists.';
    return null
}

export function setUpAdder(adderId, func = () => {
}) {
    let adder = document.querySelector(`#${adderId}`);
    adder.getInvalidMessage = getInvalidMessage;
    adder.handleAdd = (name) => {
        storage.createCategory(name);
        func(name);
    };
}