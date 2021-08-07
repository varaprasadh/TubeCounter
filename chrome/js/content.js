

function renderCount(count) {
    let controls = document.querySelector('.ytp-left-controls');
    let watchCountButton = document.querySelector(".ytp-watch-count-button");
    if (watchCountButton) {
        watchCountButton.remove();
    }
    let fab = `<div class="ytp-watch-count-button" data-tooltip-target-id="ytp-watch-count-button" title="watch count" aria-label="watch count">
                           <div class="ytp-watch-count-icon">
                                <svg width="100%" height="100%" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.25 12C19.25 13 17.5 18.25 12 18.25C6.5 18.25 4.75 13 4.75 12C4.75 11 6.5 5.75 12 5.75C17.5 5.75 19.25 11 19.25 12Z"></path>
                                    <circle cx="12" cy="12" r="2.25" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></circle>
                                </svg>
                           </div>
                           <div class="ytp-watch-count-text">${count}</div>
                        </div> `

    let fab_element = new DOMParser().parseFromString(fab, "text/html").body.firstChild;
    controls.appendChild(fab_element)
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
       if(request.type === 'refresh-video-count' ){
           const videoPlayer = document.querySelector("#movie_player > div.html5-video-container > video");
           if (videoPlayer) {
               videoPlayer.addEventListener('loadeddata', e => {
                   processAndRenderCount();
               })
           }
       }
    }
);

async function processAndRenderCount() {
    let videoID = new URL(window.location.href).searchParams.get('v');

    if (videoID) {

        let videos = {};

        try {
            videos = await getStorage();
        } catch (err) {
            videos = {};
        }

        videos[videoID] = (videos[videoID] || 0) + 1;

        await chrome.storage.local.set({ videos: videos });
        renderCount(videos[videoID]);
    } 
}


window.onload = async () => {
    await processAndRenderCount();

}

// helpers
function getStorage() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['videos'], (data) => {
            if (!data.videos) reject("no data");
            resolve(data.videos)
        })
    })
}

