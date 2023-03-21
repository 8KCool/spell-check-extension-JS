/**
 * load typo.js to check grammaly spelling
 */


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
window.onload = function() {
    setTimeout(checkSpellText, 3000);
}

var Dictionary = ["Hello", "Bye", "Best", "Good"]

/**
 * function to check spell text (this is main function in this app)
 */
const checkSpellText = async() => {
    if (document.getElementsByClassName("oL aDm az9")) {
        console.log(" == start checking spell in Gmail.com == ")
        let textOfExtractedBody = getEmailEditText();

        let capitalWords = findCapitalWords(textOfExtractedBody);
        let misspelledWords = await spellCheckInDictionary(capitalWords);
        let capitalSenderWords = getWordsFromSenderEmailText();
        debugger;
        console.log(misspelledWords);
        console.log(capitalSenderWords);
        checkWords(textOfExtractedBody, capitalSenderWords, misspelledWords)
    }
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
 * function to get mispelledWords
 * return array
 */
const spellCheckInDictionary = async(words) => {
    var res = [];
    res = await chrome.runtime.sendMessage({ action: 'check-grammar', words });
    return res.misWords;
}

/**
 * check spelling function
 *  - params
 *    * textOfExtractedBody: text from email edit tag
 *    * capitalWordEmpfaenger: words list from text Of Extracted Body
 *    * capitalWords: words list from email edit element
 */
const checkWords = (textOfExtractedBody, capitalWordsEmpfaenger, misspelledWords) => {
    let extractedTextBodyCompose = document.getElementsByClassName("Am Al editable LW-avf tS-tW")[0]
    for (let i = 0; i < misspelledWords.length; i++) {
        var item = misspelledWords[i];
        for (let x = 0; x < capitalWordsEmpfaenger.length; x++) {
            var itemToSpellcheck = capitalWordsEmpfaenger[x]
            if (item.charAt(0).toLowerCase() === itemToSpellcheck.charAt(0).toLowerCase() &&
                item.charAt(item.length - 1).toLowerCase() === itemToSpellcheck.charAt(itemToSpellcheck.length - 1).toLowerCase() &&
                item.length == itemToSpellcheck.length) {

                if (item === itemToSpellcheck) {
                    console.log(item + " ist gleich " + itemToSpellcheck + ". Erfolgreich und kein Fehler!")
                } else {
                    console.log(item + " und " + item + " sind nicht gleich! Fehler!")
                    var newContent = textOfExtractedBody.replace(new RegExp(item, 'gi'), `<span style="background-color: red;">${item}</span>`);
                    var position = newContent.indexOf(`<span style="background-color: red;">${item}</span>`);
                    extractedTextBodyCompose.innerHTML = newContent
                    extractedTextBodyCompose.selectionStart = extractedTextBodyCompose.selectionEnd = position;
                    textOfExtractedBody = extractedTextBodyCompose.innerHTML
                }
            }
        }
    }
}