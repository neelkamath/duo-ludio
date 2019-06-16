import * as editor from './edit_tab/edit';
import * as tracks from './tracks_tab/tracks';
import * as categories from './categories_tab/categories';
import './web_components/vaadin';
import './web_components/add_category';
import './web_components/item_editor';
import './web_components/confirm_dialog';
import './web_components/ok_dialog';
import './web_components/tab_icon';
import './web_components/titled_item';
import './web_components/wave_details';

if (localStorage.getItem('categories') === null) localStorage.setItem('categories', JSON.stringify({}));

window.addEventListener('load', () => {
    categories.setUpCategoriesTab();
    editor.setUpEditTab();
    tracks.setUpTracksTab();
});
