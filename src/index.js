import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox';
import '@vaadin/vaadin-checkbox/theme/material/vaadin-checkbox-group';
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box';
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box-light';
import '@vaadin/vaadin-custom-field/theme/material/vaadin-custom-field';
import '@vaadin/vaadin-date-picker/theme/material/vaadin-date-picker';
import '@vaadin/vaadin-date-picker/theme/material/vaadin-date-picker-light';
import '@vaadin/vaadin-date-picker/theme/material/vaadin-date-picker-overlay';
import '@vaadin/vaadin-date-picker/theme/material/vaadin-date-picker-overlay-content';
import '@vaadin/vaadin-date-picker/theme/material/vaadin-month-calendar';
import '@vaadin/vaadin-list-box/theme/material/vaadin-list-box';
import '@vaadin/vaadin-radio-button/theme/material/vaadin-radio-button';
import '@vaadin/vaadin-radio-button/theme/material/vaadin-radio-group';
import '@vaadin/vaadin-select/theme/material/vaadin-select';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-field';
import '@vaadin/vaadin-text-field/theme/material/vaadin-email-field';
import '@vaadin/vaadin-text-field/theme/material/vaadin-number-field';
import '@vaadin/vaadin-text-field/theme/material/vaadin-password-field';
import '@vaadin/vaadin-text-field/theme/material/vaadin-text-area';
import '@vaadin/vaadin-time-picker/theme/material/vaadin-time-picker';
import '@vaadin/vaadin-upload/theme/material/vaadin-upload';
import '@vaadin/vaadin-accordion/theme/material/vaadin-accordion';
import '@vaadin/vaadin-accordion/theme/material/vaadin-accordion-panel';
import '@vaadin/vaadin-button/theme/material/vaadin-button';
import '@vaadin/vaadin-context-menu/theme/material/vaadin-context-menu';
import '@vaadin/vaadin-details/theme/material/vaadin-details';
import '@vaadin/vaadin-dialog/theme/material/vaadin-dialog';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-column';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-column-group';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-filter';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-filter-column';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-selection-column';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-sort-column';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-sorter';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-tree-column';
import '@vaadin/vaadin-grid/theme/material/vaadin-grid-tree-toggle';
import '@vaadin/vaadin-icons/vaadin-icons';
import '@vaadin/vaadin-item/theme/material/vaadin-item';
import '@vaadin/vaadin-notification/theme/material/vaadin-notification';
import '@vaadin/vaadin-progress-bar/theme/material/vaadin-progress-bar';
import '@vaadin/vaadin-tabs/theme/material/vaadin-tabs';
import '@vaadin/vaadin-tabs/theme/material/vaadin-tab';
import '@vaadin/vaadin-app-layout/theme/material/vaadin-app-layout';
import '@vaadin/vaadin-form-layout/theme/material/vaadin-form-layout';
import '@vaadin/vaadin-form-layout/theme/material/vaadin-form-item';
import '@vaadin/vaadin-login/theme/material/vaadin-login-form-wrapper';
import '@vaadin/vaadin-login/theme/material/vaadin-login-form';
import '@vaadin/vaadin-login/theme/material/vaadin-login-overlay';
import '@vaadin/vaadin-ordered-layout/theme/material/vaadin-ordered-layout';
import '@vaadin/vaadin-ordered-layout/theme/material/vaadin-vertical-layout';
import '@vaadin/vaadin-ordered-layout/theme/material/vaadin-horizontal-layout';
import '@vaadin/vaadin-split-layout/theme/material/vaadin-split-layout';

if (localStorage.getItem('categories') === null) localStorage.setItem('categories', JSON.stringify({}));

window.addEventListener('load', () => initUI());

function initUI() {
    setUpEditTab();
}

function setUpEditTab() {
    document.querySelector('#edit-tab').addEventListener('click', () => {
        document.querySelector('#tab-content').innerHTML = `
            <div id="category-adder"></div>
            <div id="categories-editor"></div>
        `;
        setUpCategoryAdder();
        let categories = JSON.parse(localStorage.getItem('categories'));
        for (let category in categories) if (categories.hasOwnProperty(category)) addCategory(category);
    });
}

function setUpCategoryAdder() {
    document.querySelector('#category-adder').innerHTML = `
        <vaadin-dialog aria-label="Error message" id="error-dialog"></vaadin-dialog>
        <vaadin-text-field label="Category name" placeholder="Mindless HW" id="new-category-name">
        </vaadin-text-field>
        <vaadin-button theme="icon" aria-label="Add category" id="add-category">
            <iron-icon icon="vaadin:plus"></iron-icon>
        </vaadin-button>
    `;
    document.querySelector('#add-category').addEventListener('click', () => {
        let nameField = document.querySelector('#new-category-name');
        let name = nameField.value.trim();
        let dialog = document.querySelector('#error-dialog');
        if (name.length === 0) {
            dialog.renderer = (root) => root.textContent = 'Please enter a category name';
            dialog.opened = true;
            return;
        }
        let categories = JSON.parse(localStorage.getItem('categories'));
        if (name in categories) {
            dialog.renderer = (root) => root.textContent = 'That category already exists';
            dialog.opened = true;
            return;
        }
        categories[name] = [];
        localStorage.setItem('categories', JSON.stringify(categories));
        nameField.value = '';
        addCategory(name);
    });
}

function addCategory(category) {
    document.querySelector('#categories-editor').innerHTML += `
        <span id="category-${category}">
            <vaadin-dialog id="delete-category-${category}-dialog" no-close-on-esc no-close-on-outside-click>
            </vaadin-dialog>
            <vaadin-item>
                ${category}
                <vaadin-button theme="icon" aria-label="Remove category" id="delete-category-${category}">
                    <iron-icon icon="vaadin:minus"></iron-icon>
                </vaadin-button>
            </vaadin-item>
        </span>
    `;
    document.querySelector(`#delete-category-${category}`).addEventListener('click', () => {
        let dialog = document.querySelector(`#delete-category-${category}-dialog`);
        dialog.renderer = (root) => {
            let titleDiv = document.createElement('div');
            let strong = document.createElement('strong');
            strong.textContent = 'Delete?';
            titleDiv.appendChild(strong);
            root.appendChild(titleDiv);

            root.appendChild(document.createElement('br'));

            let bodyDiv = document.createElement('div');
            bodyDiv.textContent = `This will delete the category ${category}.`;
            root.appendChild(bodyDiv);

            root.appendChild(document.createElement('br'));

            let cancelButton = document.createElement('vaadin-button');
            cancelButton.textContent = 'cancel';
            cancelButton.addEventListener('click', () => dialog.opened = false);
            root.appendChild(cancelButton);

            let confirmButton = document.createElement('vaadin-button');
            confirmButton.textContent = 'Delete';
            confirmButton.addEventListener('click', () => {
                let categories = JSON.parse(localStorage.getItem('categories'));
                delete categories[category];
                document.querySelector(`#category-${category}`).remove();
                localStorage.setItem('categories', JSON.stringify(categories));
                dialog.opened = false;
            });
            root.appendChild(confirmButton);
        };
        dialog.opened = true;
    });
}