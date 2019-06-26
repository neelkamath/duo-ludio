import * as categories from './tabs/categories';
import * as editor from './tabs/edit';
import * as storage from './storage';
import * as tracks from './tabs/tracks';
import './web_components/add_item';
import './web_components/item_editor';
import './web_components/confirm_dialog';
import './web_components/dialog-button';
import './web_components/dismiss_dialog';
import './web_components/tab_icon';
import './web_components/titled_item';
import './web_components/track_data';
import './web_components/vaadin';
import './web_components/validated-adder';
import './web_components/wave_details';

storage.initialize();

addEventListener('load', () => {
    let tabContent = document.querySelector('#tab-content')!;
    for (let name of ['categories', 'tracks', 'edit']) {
        let tab = document.querySelector(`#${name}-tab`)!;
        tab.addEventListener('click', () => {
            tabContent.innerHTML = '';
            let child;
            switch (name) {
                case 'categories':
                    child = categories.getContent();
                    break;
                case 'tracks':
                    child = tracks.getContent();
                    break;
                case 'edit':
                    child = editor.getContent();
            }
            tabContent.appendChild(child);
        });
    }
});
