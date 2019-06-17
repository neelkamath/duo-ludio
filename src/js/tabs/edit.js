export function setUpEditTab() {
    document.querySelector('#edit-tab').addEventListener('click', () => {
        fillHTML();
        setUpAdder();
        let categories = JSON.parse(localStorage.getItem('categories'));
        for (let category in categories) if (categories.hasOwnProperty(category)) addCategory(category);
    });
}

function fillHTML() {
    document.querySelector('#tab-content').innerHTML = `
        <ok-dialog aria-label="Invalid category name" id="error-dialog"></ok-dialog>
        <add-item id="new-category"></add-item>
        <div id="categories-editor"></div>
    `;
}

function hasInvalidName(name) {
    let dialog = document.querySelector('#error-dialog');
    if (name.length === 0) {
        dialog.render('Please enter a category name.');
        return true;
    }
    if (name in JSON.parse(localStorage.getItem('categories'))) {
        dialog.render('That category already exists.');
        return true;
    }
    return false;
}

function saveCategory(category) {
    let categories = JSON.parse(localStorage.getItem('categories'));
    categories[category] = [];
    localStorage.setItem('categories', JSON.stringify(categories));
}

function setUpAdder() {
    let adder = document.querySelector('#new-category');
    adder.button.addEventListener('click', () => {
        let name = adder.field.value.trim();
        if (hasInvalidName(name)) return;
        saveCategory(name);
        adder.field.value = '';
        addCategory(name);
    });
}

function addCategoryHTML(category) {
    let div = document.createElement('div');
    div.innerHTML = `
        <item-editor 
            id="edit-${category}" 
            aria-label="Edit category ${category}"
            dialog-title="Delete?" 
            dialog-body="This will delete the category ${category}." 
            dialog-confirm="Delete"
        >
            ${category}
        </item-editor>
    `;
    document.querySelector('#categories-editor').appendChild(div);
}

function addCategory(category) {
    addCategoryHTML(category);
    let editor = document.querySelector(`#edit-${category}`);
    editor.delete.addEventListener('click', () => {
        editor.confirm.addEventListener('click', () => deleteCategory(category));
    });
}

function deleteCategory(category) {
    let categories = JSON.parse(localStorage.getItem('categories'));
    delete categories[category];
    localStorage.setItem('categories', JSON.stringify(categories));
    document.querySelector(`#edit-${category}`).remove();
}