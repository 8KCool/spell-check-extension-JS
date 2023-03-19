console.log('<----- Extension script started running ----->');


let tile = document.createElement('div');
let buttonSpell = document.createElement('button')
buttonSpell.className = 'spell-button'

var data
var jsonString = "654654"

buttonSpell.onclick = function() {

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: jsonString })
    });
}

buttonSpell.innerHTML = "Perform Spell Check"

tile.append(buttonSpell);

// let tileSection = document.getElementById('tile-section');
// $("#tile-section").append(tile);
// 
// debugger
// tileSection.append(tile);
document.body.appendChild(tile);