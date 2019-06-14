import * as editor from './edit_tab/edit';
import * as tracks from './tracks_tab/tracks';
import * as categories from './categories_tab/categories';
import './vaadin';
import './web_components/add_category';
import './web_components/item_editor';
import './web_components/confirm_dialog';
import './web_components/ok_dialog';

if (localStorage.getItem('categories') === null) localStorage.setItem('categories', JSON.stringify({}));

window.addEventListener('load', () => initUI());

function initUI() {
    categories.setUpCategoriesTab();
    editor.setUpEditTab();
    tracks.setUpTracksTab();
}