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

`localStorage` has a key named `categories` which is a JSON `String`. The keys are the names of the categories, and the values are arrays.

## Credits

- [How to Create a Product Vision](https://www.joelonsoftware.com/2002/05/09/product-vision/)
- [Website Boilerplate](https://github.com/neelkamath/website-boilerplate)
- [Vaadin Imports](https://github.com/neelkamath/vaadin-imports)

## License

This project is under the [MIT License](LICENSE).
