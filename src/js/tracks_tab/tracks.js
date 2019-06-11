export function setUpTracksTab() {
    document
        .querySelector('#tracks-tab')
        .addEventListener('click', () => document.querySelector('#tab-content').innerHTML = '');
}