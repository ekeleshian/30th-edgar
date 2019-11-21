const firstPageContainer = document.getElementsByClassName("first-page-container")[0];
const continueButton = document.getElementsByClassName("continueButton")[0];
const invalidInput = document.getElementsByClassName("invalid-input")[0];
const loaderContainer = document.getElementsByClassName("loader-container")[0];
const stagedWords = document.getElementsByClassName("keywords-input")[0];
const stagedWordCount = document.getElementsByClassName("word-count-input")[0];


async function sendResultsToServer(stagedWords, stagedWordCount){
    try{
        const words = stagedWords.value.trim();
        const wCount = stagedWordCount.value.trim();
        console.log({wCount})
        const revisedWords = words.split(' ').join('_');
        const response = await fetch(`http://localhost:5005/classify/${revisedWords}/${wCount}`);
        return await response.text();
    } catch (e) {
        console.log({e});
        return null
    }

}

stagedWords.addEventListener("keydown", async e => {
    invalidInput.style.display = 'none';
    if (stagedWords.value.length > 0 && stagedWordCount.value.length > 0){
        continueButton.setAttribute("style", "cursor:pointer")
    } else {
        return;
    }
    if (e.code === "Enter"){
        const res = await sendResultsToServer(stagedWords, stagedWordCount);
        console.log({res})
    }
});

stagedWordCount.addEventListener("keydown", async e => {
    invalidInput.style.display = 'none';
    if (stagedWords.value.length > 0 && stagedWordCount.value.length > 0){
        continueButton.setAttribute("style", "cursor:pointer")
        if (e.code === "Enter"){
            const res = await sendResultsToServer(stagedWords, stagedWordCount);
            console.log({res})
        }
    } else {
        return;
    }
});


continueButton.addEventListener("click", async e => {
    if (stagedWords.value.length > 0 && stagedWordCount.value.length > 0) {
        e.preventDefault();
        const res = await sendResultsToServer(stagedWords, stagedWordCount);
        console.log({res})
    }
    else {
        invalidInput.style.display = "block"
    }
});


document.addEventListener("DOMContentLoaded", function() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.browserAction.setIcon({path: 'our_logo_32x32.png'});
        chrome.tabs.sendMessage(tabs[0].id, {click: true}, () => {
            chrome.runtime.onMessage.addListener( async (request) => {

                if (request.hasOwnProperty("MESSAGE_FROM_BKG")) {
                    if (request.firstMessage === true) {
                        console.log('message received from background')
                    }
                }
            })
        })

    })
})