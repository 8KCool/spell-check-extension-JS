/**
 * typeTest = 0 : real function
 * typeTest = 1 : test function
 */

const typeTest = 1
let ignoreWords = [];

/** ==================================================================================== 
 * A debounce function makes sure that your code is only triggered once per user input.
 * =====================================================================================  */

/**
 * When a key event occurs, the debounce function is called.
 */
document.addEventListener("keydown", function(event) {
    processChange();
});

/**
 * debounce function: func: callback, timeout: delay time
 */
function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}


const processChange = debounce(() => checkSpellText());

/** ============================
 * Identify typos in gmail.com
 * ============================= */

/**
 * When gmail.com page is loaded, start checking words spell
 * here we should give delay time because all elements can loaded in a sec.
 */
var utilityDict = new Typo();
var affData = utilityDict._readFile(chrome.runtime.getURL('./typo-js/dictionaries/en_US/en_US.aff'));
var wordData = utilityDict._readFile(chrome.runtime.getURL('./typo-js/dictionaries/en_US/en_US.dic'));
const dictionary = new Typo('en_US', affData, wordData);

window.onload = function() {
    // chrome.runtime.sendMessage({ action: 'init-dictionary', langType });

    setTimeout(checkSpellText, 3000);
}

var Dictionary = ["Hello", "Bye", "Best", "Good"]

/**
 * function to check spell text (this is main function in this app)
 */
const checkSpellText = async() => {
    if (document.getElementsByClassName("oL aDm az9")) {
        console.log(" == start checking spell in Gmail.com == ")

        // get words array that wrong send spell words from the dictionary
        let capitalSenderWords = getWordsFromSenderEmailText();
        let misSpellSenderWords = spellCheckInDictionary(capitalSenderWords);

        // get words array that wrong edit spell words from the dictionary
        let textOfExtractedBody = getEmailEditText();
        let capitalWords = findCapitalWords(textOfExtractedBody);
        let misSpellEditWords = spellCheckInDictionary(capitalWords);

        console.log("======== wrong spell words from the sender Email =========")
        console.log(misSpellSenderWords);
        console.log("======== wrong spell words from the edit Email =========")
        console.log(misSpellEditWords);
        checkWords(textOfExtractedBody, misSpellSenderWords, misSpellEditWords)
    }
}

/**
 * function to get mispelledWords
 * return array
 */
const spellCheckInDictionary = (words) => {
    // debugger;
    // res = await chrome.runtime.sendMessage({ action: 'check-grammar', words });
    // return res.misWords;
    // const misspelledWords = dictionary.check(words[0])
    var res = [];
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (!dictionary.check(word)) {
            res.push(word);
        }
    }
    return res;
}

/**
 * function to get text from email edit element
 * return string
 */
const getEmailEditText = () => {
    if (document.getElementsByClassName("Am Al editable LW-avf tS-tW") && document.getElementsByClassName("Am Al editable LW-avf tS-tW")[0]) {
        let extractedTextBodyCompose = document.getElementsByClassName("Am Al editable LW-avf tS-tW")[0]
        return textOfExtractedBody = extractedTextBodyCompose.innerHTML
    }
    return "";
}

/**
 * function to get text from sender email tag
 * return: array
 */
const getWordsFromSenderEmailText = () => {
    if (document.getElementsByClassName("a3s aiL ") && document.getElementsByClassName("a3s aiL ")[0].children && document.getElementsByClassName("a3s aiL ")[0].children[0]) {
        let extractedAbsenderBody = document.getElementsByClassName("a3s aiL ")[0].children[0].outerHTML
        return capitalWords = findCapitalWords(extractedAbsenderBody);
    }
    return "";
}

/**
 * function to get words list from HTML tag
 * return array
 */
const findCapitalWords = (str) => {
    str = "<br>" + str;
    const regex = /<[^>]*>([^<]*)/g;
    const wordsArray = str.match(regex).map(match => match.replace(/<\/?[^>]+(>|$)|&nbsp;/g, '').trim().split(/\s+/)).flat().filter(word => word !== "").map(word => word.replace(/[^\w\s]|_/g, "").trim().replace(/\s+/g, " "));
    return wordsArray;
}

/**
 * check spelling function
 *  - params
 *    * textOfExtractedBody: text from email edit tag
 *    * capitalWordEmpfaenger: words list from text Of Extracted Body
 *    * capitalWords: words list from email edit element
 */
const checkWords = (textOfExtractedBody, capitalSenderWords, misspelledWords1) => {
    let extractedTextBodyCompose = document.getElementsByClassName("Am Al editable LW-avf tS-tW")[0]

    // remove all span tag "misspelled, if don't remove, span tag will remain"
    var regex = /<\/?span\b[^>]*>/ig;
    textOfExtractedBody = textOfExtractedBody.replace(regex, '');

    const misspelledWords = misspelledWords1.reduce((acc, current) => {
        if (!acc.includes(current)) {
            acc.push(current);
        }
        return acc;
    }, []);

    for (let i = 0; i < misspelledWords.length; i++) {
        var item = misspelledWords[i];


        for (let x = 0; x < capitalSenderWords.length; x++) {
            var itemToSpellcheck = capitalSenderWords[x]
            if (item.charAt(0).toLowerCase() === itemToSpellcheck.charAt(0).toLowerCase() &&
                item.charAt(item.length - 1).toLowerCase() === itemToSpellcheck.charAt(itemToSpellcheck.length - 1).toLowerCase() &&
                item.length == itemToSpellcheck.length) {

                if (ignoreWords.indexOf(item) != -1) { // already ignored word
                    console.log(item + " is ignored")
                } else if (capitalSenderWords.indexOf(item) != -1) { // exist in sender email box
                    console.log(item + " ist gleich " + itemToSpellcheck + ". Erfolgreich und kein Fehler!")
                } else {
                    console.log(item + " und " + item + " sind nicht gleich! Fehler!")
                    var newContent = textOfExtractedBody.replace(new RegExp(item, 'g'), `<span class="misspelled" data="${itemToSpellcheck}">${item}</span>`);
                    extractedTextBodyCompose.innerHTML = newContent
                    textOfExtractedBody = extractedTextBodyCompose.innerHTML
                }
            }
        }
    }
}


/**
 * requirement V1
 *  - point
 *    * when user click misspelled word, highlight this word.
 *    * show mini modal to fix it.
 */
document.addEventListener('click', function(event) {
    // Check if the clicked element has the desired class attribute
    if (event.target.classList.contains('misspelled')) {
        if (document.querySelector(".spellcheck-modal")) {
            document.querySelector(".spellcheck-modal").remove();
        }
        var selectedElement = event.target;
        selectedElement.classList.remove("misspelled-select")
        selectedElement.classList.add("misspelled-select")
        document.body.appendChild(makeMiniModal(selectedElement));
    } else {
        if (!event.target.classList.contains('misspelled')) {
            if (document.querySelector(".misspelled-select")) {
                document.querySelector(".misspelled-select").classList.remove("misspelled-select")
            }
        }
        if (!event.target.classList.contains('spellcheck-modal')) {
            if (document.querySelector(".spellcheck-modal")) {
                document.querySelector(".spellcheck-modal").remove();
            }
        }
    }

});


/**
 * mini modal to show misspelled state and fix
 */

const makeMiniModal = (selectedElement) => {
    // mini modal
    var miniModal = document.createElement('div');
    miniModal.className = 'spellcheck-modal';

    var elementRect = selectedElement.getBoundingClientRect();
    miniModal.style.position = 'absolute';
    miniModal.style.top = (elementRect.bottom + window.pageYOffset + 5) + 'px';
    miniModal.style.left = (elementRect.left + window.pageXOffset) + 'px';


    const modalHeader = document.createElement('div');
    modalHeader.className = "modal-header"
    modalHeader.textContent = 'Possible spelling mistake found.';
    miniModal.appendChild(modalHeader);

    const modalBody = document.createElement('div');
    modalBody.className = "modal-body"

    // Populate modal with suggestions
    var correctWord = selectedElement.getAttribute('data');
    var misspelledWord = selectedElement.textContent
    const suggestions = [];
    suggestions.push(correctWord);
    suggestions.forEach(function(suggestion) {
        const button = document.createElement('button');
        button.className = "suggestion-button"
        button.textContent = suggestion;
        button.addEventListener('click', function(event) {
            // Replace misspelled word with suggestion
            selectedElement.textContent = suggestion;
            selectedElement.classList.remove("misspelled-select")
            selectedElement.classList.remove("misspelled")
            miniModal.remove();
        });
        modalBody.appendChild(button);
    });

    miniModal.appendChild(modalBody);

    const modalFooter = document.createElement('div');
    modalFooter.className = "modal-footer"
    modalFooter.textContent = 'Ignore';
    modalFooter.addEventListener('click', function(event) {
        // Replace misspelled word with suggestion
        ignoreWords.push(misspelledWord);
        selectedElement.classList.remove("misspelled-select")
        selectedElement.classList.remove("misspelled")
        miniModal.remove();
    });
    miniModal.appendChild(modalFooter);

    return miniModal;
}