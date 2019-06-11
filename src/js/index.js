import * as editor from './category_editor';
import './web_components';

if (localStorage.getItem('categories') === null) localStorage.setItem('categories', JSON.stringify({}));

window.addEventListener('load', () => initUI());

function initUI() {
    editor.setUpEditTab();
}