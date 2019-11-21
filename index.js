const firstPageContainer = document.getElementsByClassName("first-page-container")[0];
const continueButton = document.getElementsByClassName("continueButton")[0];
const invalidInput = document.getElementsByClassName("invalid-input")[0];
const loaderContainer = document.getElementsByClassName("loader-container")[0];
const stagedWords = document.getElementsByClassName("keywords-input")[0];
const stagedWordCount = document.getElementsByClassName("word-count-input")[0];
const responseContainer = document.getElementsByClassName("response")[0];
const responseText = document.getElementsByClassName("response-text")[0];

async function sendResultsToServer(stagedWords, stagedWordCount){
    try{
        const words = stagedWords.value.trim();
        const wCount = stagedWordCount.value.trim();
        const revisedWords = words.split(' ').join('_');
        const response = await fetch(`http://localhost:5005/classify/${revisedWords}/${wCount}`);
        return await response.text();
    } catch (e) {
        console.log({e});
        return null
    }

}

function addText(response) {
    responseText.innerText = response;
    responseContainer.style.display = 'block';
}


stagedWords.addEventListener("keydown", async e => {
    invalidInput.style.display = 'none';
    responseContainer.style.display = 'none';
    if (stagedWords.value.length > 0 && stagedWordCount.value.length > 0){
        continueButton.setAttribute("style", "cursor:pointer")
        if (e.code === "Enter") {
            const res = await sendResultsToServer(stagedWords, stagedWordCount);
            addText(res)
        }
    } else {
        continueButton.setAttribute("style", "cursor:no-drop")
        return;
    }
});

stagedWordCount.addEventListener("keydown", async e => {
    invalidInput.style.display = 'none';
    responseContainer.style.display = 'none';

    if (stagedWords.value.length > 0 && stagedWordCount.value.length > 0){
        continueButton.setAttribute("style", "cursor:pointer")
        if (e.code === "Enter"){
            const res = await sendResultsToServer(stagedWords, stagedWordCount);
            addText(res)
        }
    } else {
        continueButton.setAttribute("style", "cursor:no-drop")
        return;
    }
});


continueButton.addEventListener("click", async e => {
    invalidInput.style.display = 'none';
    responseContainer.style.display = 'none';
    if (stagedWords.value.length > 0 && stagedWordCount.value.length > 0) {
        e.preventDefault();
        const res = await sendResultsToServer(stagedWords, stagedWordCount);
        addText(res)
    }
    else {
        continueButton.setAttribute("style", "cursor:no-drop")
        invalidInput.style.display = "block";
        return;
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