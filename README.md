# Duo Ludio

Check it out [here](https://duo-ludio.netlify.com/)!

![Favicon](src/favicon.png)

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

### JavaScript

The underscore convention is used to denote private things in `class`es (e.g., `foo() {}` is public but `_bar() {}` is private).

### Favicon

The favicon is generated from [favicon.io](https://favicon.io/favicon-generator/). Only the Apple touch icon is used, by renaming it to `favicon.png`, and storing it in the `src` directory. Styling is dictated by [Vaadin's Material Design specs](https://cdn.vaadin.com/vaadin-material-styles/1.2.0/demo/index.html). Since the web app uses the default Vaadin material theme, the font family is Roboto, the text color is `#6200ee`, and the background color is `#fff`.

### Storage

`localStorage` is used to persist data. Each of the following headings are items present in `localStorage`.

#### `categories`

This is a JSON object serialized as a `String`. Each key is the name of a category, and each value is an `array` of `string`s. Each `string` in the `array` denotes the name of a track present in `src/binaural_beats/tracks`.

##### Example

```json
{
  "meditation": [
    "Theta_6_Hz_Isochronic_Pulses.mp3"
  ]
}
```

### Binaural Beats

The binaural beats used are from the [v2.0.2](https://github.com/neelkamath/binaural-beats-dataset/releases/tag/v2.0.2) release of the Binaural Beats Dataset. The `src` directory from the dataset is saved as `src/binaural_beats` in this repo.

### UI

This project is based on Material design.

### CSS

Since this project is based off of Material Design, dialog buttons should be modelled after their [specs](https://www.material.io/design/components/dialogs.html). However, Vaadin Components do no follow this, and hence custom styling must be applied. You should use the CSS class `.dialog-button` present in `src/style.css` when creating dialogs containing buttons. For custom web components which require such styling inlined as their performance would suffer otherwise, the class's styling may be inlined by copy-paste-modifying this ready-made class's CSS.

### Web Components

This project uses the free material design version of [Vaadin Components](https://vaadin.com/components). For ease of usage, every single component has been installed and imported, regardless of whether it is used or not. Each of the following headings document custom web components (corresponding "`id`s" subheadings refer to the HTML `id` of the respective element in the web component).

#### `add-category`

This contains a text field for the user to enter the name of a category they'd like to add, along with a button which adds it.

##### `id`s

|ID|Explanation|
|---|---|
|`name`|The text field|
|`add`|The button|

##### Example

###### HTML

```html
<add-category id="new-category"></add-category>
```

###### JavaScript

```js
let root = document.querySelector('#new-category').shadowRoot;
root.querySelector('#add').addEventListener('click', () => {
    let textField = root.querySelector('#name');
    console.log(textField.value);
    textField.value = '';
});
```

#### `confirm-dialog`

Since Vaadin's confirm dialog component isn't free, a custom web component was created to serve the same purpose. This component is meant to be used as the root HTML of a `vaadin-dialog` when rendered.

##### Attributes

|Attribute|Required|Explanation|Example|
|---|---|---|---|---|
|`title`|Yes|Title|Delete?|
|`body`|Yes|Body|This will delete the category Meditation.|
|`cancel`|Yes|Cancel button text|Cancel|
|`confirm`|Yes|Confirm button text|Delete|

##### `id`s

|ID|Explanation|
|---|---|
|`title`|Dialog title|
|`body`|Dialog body|
|`cancel`|Cancel button|
|`confirm`|Confirm button|

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

- Description: [How to Create a Product Vision by Joel Spolsky](https://www.joelonsoftware.com/2002/05/09/product-vision/)
- [Website Boilerplate](https://github.com/neelkamath/website-boilerplate)
- [Vaadin Imports](https://github.com/neelkamath/vaadin-imports)
- Favicon: [favicon.io](https://favicon.io/favicon-generator/)
- [Binaural Beats Dataset](https://github.com/neelkamath/binaural-beats-dataset)

## License

This project is under the [MIT License](LICENSE).
