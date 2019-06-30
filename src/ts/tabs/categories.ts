// @ts-ignore
import {DetailsElement} from '@vaadin/vaadin-details/src/vaadin-details';

/** @returns The "Categories" tab's content */
export default function (): DetailsElement {
    const details = document.createElement('vaadin-details');
    details.innerHTML = `
        <div slot="summary">About</div>
        <p>
            For a person who needs help concentrating, Duo Ludio is a web app that provides categorized binaural beats. 
            Unlike other binaural beats players, this product is accessible anywhere since it has the option to be 
            installed offline on any device.
        </p>
        <p>
            Binaural beats simulate brainwaves so that you can boost particular states (e.g., concentration for 
            studying, relaxation for helping fall asleep). You'll need to use headphones while listening to them.
        </p>
        <p>
            It doesn't require an account since it saves your data locally. This project is open source on
            <a href="https://github.com/neelkamath/duo-ludio">GitHub</a>.
        </p>
    `;
    return details;
}