document.addEventListener('DOMContentLoaded', () => {
    // We query for all BrightCove elements.
    const bcComponents = document.querySelectorAll('.bright-cove-container');

    // for each one we instantiate a new BrightCoveComponentWithPoster instance if it has an overlay.
    bcComponents.forEach(bcComponent => {
        const overlay = bcComponent.querySelector('.overlay');

        if (overlay) {
            return new BrightCoveComponentWithPoster(bcComponent);
        }
    });
});


class BrightCoveComponentWithPoster {
    #bcContainer;

    constructor(bcContainer) {
        this.#bcContainer = bcContainer;

        // This MO is watching for the DOM to populate with the BrightCove elements.
        const observer = new MutationObserver(mutations => {
            const bcPlayButton = mutations[0].target.querySelector('.vjs-big-play-button');

            // just for testing
            const bcTitleText = mutations[0].target.querySelector('.vjs-dock-text');
            bcPlayButton.style.display = 'none';
            bcTitleText.style.display = 'none';

            if (bcPlayButton) {
                this.#overlayEventInitializer();
            }
        });

        const videoContainer = this.#bcContainer.querySelector('video-js');

        observer.observe( videoContainer, {
            childList: true,
        });
    }

    #logElement() {
        console.log('[Bright Cover Poster Initialized]', this.#bcContainer);
    }

    #overlayEventInitializer() {
        const overlay = this.#bcContainer.querySelector('.overlay');
        const overlayTitleElement = overlay.querySelector('.overlay-title');
        const overlayDescElement = overlay.querySelector('.overlay-desc');
        const errorContainer = this.#bcContainer.querySelector('.vjs-error-display');
        const overlayPlayButton = this.#bcContainer.querySelector(".play-button");

        // We use this MO to see if the .vjs-errors-dialog is generated and react when it does
        const observer = new MutationObserver(mutations => {
            const errorCodeDialog = errorContainer.querySelector('.vjs-errors-dialog');

            if(errorCodeDialog) {
                overlayTitleElement.textContent = "There was an error.";
                overlayDescElement.textContent = "Video is currently unavailable";
                overlayPlayButton.style.display = "none";
                overlay.style.backgroundColor = 'black';
            }
        });

        observer.observe(errorContainer, {
            childList: true,
        })

        // We dispatch our click event to the BrightCove play button
        overlay.addEventListener('click', e => {
            e.preventDefault();
            const bcPlayer = this.#bcContainer.querySelector('.vjs-tech');
            let event = new Event('click');
            bcPlayer.dispatchEvent(event);

            const overlay = this.#bcContainer.querySelector('.overlay');
            overlay.style.display = 'none';
        });

        this.#logElement();
    }
}
