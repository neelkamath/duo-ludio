function fillHTML() {
    document.querySelector('#tab-content').innerHTML = `
        <vaadin-dialog aria-label="Error message" id="error-dialog"></vaadin-dialog>
        <vaadin-text-field label="Category name" placeholder="Mindless HW" id="new-category-name"></vaadin-text-field>
        <vaadin-button theme="icon" aria-label="Add category" id="add-category">
            <iron-icon icon="vaadin:plus"></iron-icon>
        </vaadin-button>
        <div id="categories-editor"></div>
    `;
}

export function setUpEditTab() {
    document.querySelector('#edit-tab').addEventListener('click', () => {
        fillHTML();
        setUpAdder();
        let categories = JSON.parse(localStorage.getItem('categories'));
        for (let category in categories) if (categories.hasOwnProperty(category)) addCategory(category);
    });
}

function renderInvalidDialog(message) {
    let dialog = document.querySelector('#error-dialog');
    dialog.renderer = (root) => root.textContent = message;
    dialog.opened = true;
}

function hasInvalidName(name) {
    if (name.length === 0) {
        renderInvalidDialog('Please enter a category name');
        return true;
    }
    if (name in JSON.parse(localStorage.getItem('categories'))) {
        renderInvalidDialog('That category already exists');
        return true;
    }
    return false;
}

function save(category) {
    let categories = JSON.parse(localStorage.getItem('categories'));
    categories[category] = [];
    localStorage.setItem('categories', JSON.stringify(categories));
}

function setUpAdder() {
    document.querySelector('#add-category').addEventListener('click', () => {
        let nameField = document.querySelector('#new-category-name');
        let name = nameField.value.trim();
        if (hasInvalidName(name)) return;
        save(name);
        nameField.value = '';
        addCategory(name);
    });
}

function addCategoryHTML(category) {
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
}

function addCategory(category) {
    addCategoryHTML(category);
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