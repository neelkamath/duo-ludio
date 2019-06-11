# Duo Ludio

For a person who needs help concentrating, Duo Ludio is a web app that provides categorized binaural beats. Unlike other binaural beats players, this product is accessible anywhere since it has the option to be installed offline.

The name Duo Ludio is Latin for "Two Player" ("Two" for binaural beats).

## Installation

1. Clone the repository using one of the following methods.
    - SSH: `git clone git@github.com:neelkamath/duo-ludio.git`
    - HTTPS: `git clone https://github.com/neelkamath/duo-ludio.git`
1. `cd duo-ludio`
1. Install [node.js 10](https://nodejs.org/en/download/).
1. `npm i`

## Usage

### Development

1. `npm run dev`
1. Open `index.html` in your browser.

### Production

`npm run build`

The `dist` directory will contain the built website.

## Documentation

### Storage

`localStorage` is used to persist data. Each of the following headings are items present in `localStorage`.

#### `categories`

This is a JSON object serialized as a `String`. Each key is the name of a category, and each value is an empty array.

##### Example

```json
{
  "meditation": [],
  "programming": []
}
```

### Web Components

This project uses the free material design version of [Vaadin Components](https://vaadin.com/components). Each of the following headings document custom web components.

#### `confirm-dialog`

Since Vaadin's confirm dialog component isn't free, a custom web component was created to serve the same purpose. This component is meant to be used as the root HTML of a `vaadin-dialog` when rendered.

##### Attributes

|Attribute|Required|ID|Explanation|Example|
|---|---|---|---|---|
|`title`|Yes|`title`|Title|Delete?|
|`body`|Yes|`body`|Body|This will delete the category Meditation.|
|`cancel`|Yes|`cancel`|Cancel button text|Cancel|
|`confirm`|Yes|`confirm`|Confirm button text|Delete|

##### Example

###### HTML

```html
<vaadin-dialog id="delete-photo-dialog" no-close-on-esc no-close-on-outside-click></vaadin-dialog>
<vaadin-button id="delete-photo">Delete photo</vaadin-button>
```

###### JavaScript

```js
document.querySelector('#delete-photo').addEventListener('click', () => {
    let dialog = document.querySelector('#delete-photo-dialog');
    dialog.renderer = (root) => root.innerHTML = `
        <confirm-dialog 
            id="photo-confirm-dialog"
            title="Delete?" 
            body="This will permanently delete the photo."
            cancel="Cancel" 
            confirm="Delete" 
        ></confirm-dialog>
    `;
    dialog.opened = true;
    let root = document.querySelector('#photo-confirm-dialog').shadowRoot;
    root.querySelector('#cancel').addEventListener('click', () => dialog.opened = false);
    root.querySelector('#confirm').addEventListener('click', () => dialog.opened = false);
});
```

## Credits

- [How to Create a Product Vision](https://www.joelonsoftware.com/2002/05/09/product-vision/)
- [Website Boilerplate](https://github.com/neelkamath/website-boilerplate)
- [Vaadin Imports](https://github.com/neelkamath/vaadin-imports)

## License

This project is under the [MIT License](LICENSE).
