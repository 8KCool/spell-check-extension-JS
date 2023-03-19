console.log('<----- Injected script started running ----->');

function findCapitalWords(str) {
    const regex = /\b[A-Z][a-z]*\b/g;
    const matches = str.match(regex);
    return matches;
}

function parseEssentialDetails() {
    // ++++++++++++++++++++++ EXTRACT SENDER EMAIL ADDRESS + TEXT BODY +++++++++++++++++++
    console.log("key down finished");
    if (document.getElementsByClassName("oL aDm az9")) {
        //email Adresse Empfänger    
        debugger;
        let extractedEmailCompose = document.getElementsByClassName("oL aDm az9")[0].querySelector('span').getAttribute('email') /* to extract the sender email address */
            //Textfenster Empfänger
        let extractedTextBodyCompose = document.getElementsByClassName("Am Al editable LW-avf tS-tW")[0]
        let textOfExtractedBody = extractedTextBodyCompose.innerHTML

        // ++++++++++++++++++++++ EXTRACT SENDER EMAIL ADDRESS + TEXT BODY +++++++++++++++++++


        //let extractedAbsender = document.getElementsByClassName("go")[0].innerHTML /* to extract the receiver email address */
        let extractedAbsenderBody = document.getElementsByClassName("a3s aiL ")[0].children[0].outerHTML

        // ++++++++++++++++++++++ EXTRACT SENDER EMAIL ADDRESS + TEXT BODY +++++++++++++++++++

        var capitalWords = findCapitalWords(extractedAbsenderBody);
        var capitalWordsEmpfaenger = findCapitalWords(textOfExtractedBody);

        // ++++++++++++++++++++++ delete capitalized words to be ignored from  +++++++++++++++++++
        /* +++++++++++++++++ algorhythm for identifying proper names and then spellchecking them - under construction ++++++++++++
        var capitalWords = ["Hello", "Matthias", "Caytlin", "Bye", "Best", "Good"]

        console.log("stringArray vorher " + capitalWords)

        var ignoreWords = ["Hello", "Bye", "Best", "Good"]

        function deleteWordsToIgnore(array) {

        for (let i = 0; i < capitalWords.length; i++) {
            if (ignoreWords.indexOf(capitalWords[i]) !== -1) {
                stringArray.splice(i, 1);
                i--;
            }
            }
            return array
        }

        console.log("stringArray nachher " + stringArray)

        */

        let results = [];

        console.log("großgeschriebene Wörter aus Abesender-Text " + capitalWords)

        var ignoreWords = ["Hello", "Bye", "Best", "Good"]

        for (let i = 0; i < capitalWords.length; i++) {
            if (ignoreWords.indexOf(capitalWords[i]) !== -1) {
                capitalWords.splice(i, 1);
                i--;
            }
        }
        console.log("großgeschriebene Wörter nach Bereinigung " + capitalWords)

        function findWordsWithSameCapital(text) {

            const regex = /\b([A-Z])[a-z]*\b/g;
            const matches = text.match(regex);

            console.log(typeof matches)
            if (matches) {
                console.log("match = " + matches)
                return matches
            }
        }

        const wordsWithSameCapital = findWordsWithSameCapital(textOfExtractedBody);
        console.log("wordsWithSameCapital ist gleich: ");
        console.log(wordsWithSameCapital)


        for (let i = 0; i < capitalWords.length; i++) {

            var item = capitalWords[i];

            for (let x = 0; x < wordsWithSameCapital.length; x++) {
                var itemToSpellcheck = wordsWithSameCapital[x]
                if (item.charAt(0) === itemToSpellcheck.charAt(0) &&
                    item.charAt(item.length - 1) === itemToSpellcheck.charAt(itemToSpellcheck.length - 1)) {

                    if (item === itemToSpellcheck) {
                        console.log(item + " ist gleich " + itemToSpellcheck + ". Erfolgreich und kein Fehler!")
                    } else {
                        console.log(item + " und " + itemToSpellcheck + " sind nicht gleich! Fehler!")
                        var newContent = textOfExtractedBody.replace(new RegExp(itemToSpellcheck, 'gi'), `<span style="background-color: red;">${itemToSpellcheck}</span>`);

                        extractedTextBodyCompose.innerHTML = newContent
                        textOfExtractedBody = extractedTextBodyCompose.innerHTML
                    }

                }

            }
        }

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //this replaces the string that has been identified as misspelled (searchStr) and
        // replaces it with a formatted version of the string with .replace()


    } else if (document.getElementsByClassName("afV")) {
        let extractedEmailResponse = document.getElementsByClassName("afV")[0].getAttribute('hovercard-id')
        console.log("Adresse aus Compose-Fenster:" + extractedEmailResponse)
    } else {}
}

// parseEssentialDetails()


function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function saveInput() {
    parseEssentialDetails();
}

const processChange = debounce(() => saveInput());


document.addEventListener('keydown', (e) => {
    processChange();
});