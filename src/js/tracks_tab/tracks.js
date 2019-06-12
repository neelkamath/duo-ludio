export function setUpTracksTab() {
    document.querySelector('#tracks-tab').addEventListener('click', () => {
        document.querySelector('#tab-content').innerHTML = `
            <vaadin-tabs>
                <vaadin-tab>
                    <img class="tab-icon" alt="Alpha" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Greek_lc_alpha.svg/240px-Greek_lc_alpha.svg.png">
                    Alpha
                </vaadin-tab>
                <vaadin-tab>
                    <img class="tab-icon" alt="Beta" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Greek_lc_beta.svg/240px-Greek_lc_beta.svg.png">
                    Beta
                </vaadin-tab>
                <vaadin-tab>
                    <img class="tab-icon" alt="Delta" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Greek_lc_delta.svg/240px-Greek_lc_delta.svg.png">
                    Delta
                </vaadin-tab>
                <vaadin-tab>
                    <img class="tab-icon" alt="Theta" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Greek_lc_theta.svg/240px-Greek_lc_theta.svg.png">
                    Theta
                </vaadin-tab>
            </vaadin-tabs>
        `;
    });
}