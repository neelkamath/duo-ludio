<p align="center"><img alt="Favicon" src="src/icons/apple-touch-icon.png"></p>

# Duo Ludio

Check it out [here](https://duo-ludio.netlify.com/)!

For a person who needs help concentrating, Duo Ludio is a web app that provides categorized binaural beats. Unlike other binaural beats players, this product is accessible anywhere since it has the option of being installed offline on any device.

The name Duo Ludio is Latin for "Two Player" ("Two" for binaural beats).

## Installation

1. Install [node.js 10](https://nodejs.org/en/download/).
1. Clone the repository using one of the following methods.
    - SSH: `git clone git@github.com:neelkamath/duo-ludio.git`
    - HTTPS: `git clone https://github.com/neelkamath/duo-ludio.git`
1. `cd duo-ludio`
1. `npm i`
1. Generate service worker: `npm run sw`

## Usage

### Development

`npm run dev`

Open `http://localhost:1234` in your browser.

#### Testing Precaching

Run the following each time you have new files to test for precaching.
1. Build: `npm run dev`
1. After the files have been built, stop the server to run another command: `Ctrl+C`/`command+C`
1. Update service worker: `npm run sw`
1. Update build with updated service worker: `npm run dev`
1. Open `http://localhost:1234` in your browser.

### Production

1. Build: `npm run build`
1. Update service worker: `npm run sw`
1. Update build with updated service worker: `npm run build`

The `dist/` directory will contain the built website.

### Documentation

1. `npm run doc` 
1. Open `docs/index.html` in your browser.

## Testing

`npm run test`

## Documentation

### Styling

The Material Design spec is not to be followed strictly, but as a guideline. Theming for things such as favicons are taken from [Vaadin's Material Design specs](https://cdn.vaadin.com/vaadin-material-styles/1.2.0/demo/index.html).

The background color is `#fff`, and the theme color is `#6200ee` (both CSS colors).

### TypeScript

Parcel leaks an implementation detail for certain uses of `async`/`await` (see [this issue](https://github.com/parcel-bundler/parcel/issues/1762#issuecomment-504389468)). As a workaround, the statement `import 'regenerator-runtime/runtime';` is included in certain files.

All web components are imported in `src/ts/web_components/components.ts`.

When using TypeDoc to document web components, use the custom `@attribute` field to document the element's attributes.

Mandatory attribute documentation example:
```
@attribute `aria-label` (required) ARIA label (e.g., `Confirm deleting category Meditation`)
```
Optional attribute documentation example:
```
@attribute `aria-label` (optional, default: `Confirm`) ARIA label (e.g., `Confirm deleting category Meditation`)
```

TypeDoc does'nt allow you to use the `event` in places such as constructors. A workaround is to document `Event`s by creating and documenting `private` methods which dispatch them.

### Binaural Beats

The binaural beats used are from the [v6.0.0](https://github.com/neelkamath/binaural-beats-dataset/releases/tag/v6.0.0) release of the Binaural Beats Dataset. The `src` directory from the dataset is saved as `src/binaural_beats` in this repo.

### Continuous Deployment

Continuous delivery has been setup using [Netlify](https://www.netlify.com) to automatically update the production web app whenever there's a new commit to the `master` branch.

### Favicon

[favicon.io](https://favicon.io/favicon-generator/) is used to generate the favicon. Generate it as shown below.

![Favicon Setup](favicon_setup.png)

### Storage

`localForage` is used to persist data.
 
#### `categories`

The abstraction layer for the `categories` item is `src/ts/storage/categories.ts`. 

The `categories` item contains the user's binaural beats collection. Each key is the name of a category. Each value is an `array` of `string`s denoting the names of tracks. Track names correspond to tracks in the directory `src/binaural_beats/tracks/`. An example is shown below.
```json
{
  "Meditation": [
    "Theta_6_Hz_Isochronic_Pulses.mp3"
  ]
}
```

#### Binaural Beats

To access metadata on binaural beats (which are stored in `src/binaural_beats/data.json`), use the abstraction layer `src/ts/storage/beats.ts`.

Each track is downloaded a `localForage` item of the same name. For example, `Alpha_8_Hz.mp3`'s `Blob` is saved to the `Alpha_8_Hz.mp3` item.

## Credits

- Description: [How to Create a Product Vision by Joel Spolsky](https://www.joelonsoftware.com/2002/05/09/product-vision/)
- Favicon: [favicon.io](https://favicon.io/favicon-generator/)
- [Binaural Beats Dataset](https://github.com/neelkamath/binaural-beats-dataset)

## License

This project is under the [MIT License](LICENSE).
