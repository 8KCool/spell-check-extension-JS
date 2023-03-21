importScripts('./typo/typo.js');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'check-grammar') {
        const dictionary = new Typo('en_US');
        const words = request.words;
        const misWords = words.filter(word => !dictionary.check(word));
        sendResponse({ misWords });
    }
});