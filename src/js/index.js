import * as editor from './edit_tab/category_editor';
import * as tracks from './tracks_tab/tracks';
import * as categories from './categories_tab/categories';
import './vaadin';

if (localStorage.getItem('categories') === null) localStorage.setItem('categories', JSON.stringify({}));

window.addEventListener('load', () => initUI());

function initUI() {
    categories.setUpCategoriesTab();
    editor.setUpEditTab();
    tracks.setUpTracksTab();
}