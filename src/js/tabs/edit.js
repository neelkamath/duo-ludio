export function setUpTab() {
    document.querySelector('#edit-tab').addEventListener('click', () => {
        document.querySelector('#tab-content').innerHTML = getContent();
        setUpAdder();
        let categories = JSON.parse(localStorage.getItem('categories'));
        Object.keys(categories).forEach((category) => addCategory(category));
    });
}

function getContent() {
    return `
        <ok-dialog aria-label="Invalid category name" id="error-dialog"></ok-dialog>
        <add-item id="new-category"></add-item>
        <div id="categories-editor"></div>
    `;
}

function dialogDisplayed(name) {
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
        adder.field.value = '';
        if (dialogDisplayed(name)) return;
        saveCategory(name);
        addCategory(name);
    });
}

function createCategory(category) {
    let span = document.createElement('span');
    span.innerHTML = `
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
    return span;
}

function addCategory(category) {
    document.querySelector('#categories-editor').appendChild(createCategory(category));
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
