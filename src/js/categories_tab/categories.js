export function setUpCategoriesTab() {
    document
        .querySelector('#categories-tab')
        .addEventListener('click', () => document.querySelector('#tab-content').innerHTML = '');
}