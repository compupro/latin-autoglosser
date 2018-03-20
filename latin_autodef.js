const WORD_LOOKUP_URL = "http://www.perseus.tufts.edu/hopper/xmlmorph?lang=la&lookup=";

function generateClickableText(){
	var clickableTextContainer = document.getElementById('clickableText');
	while (clickableTextContainer.firstChild){
		clickableTextContainer.removeChild(clickableTextContainer.firstChild);
	}
	var input = document.getElementById('input').value;
	var inputTokens = input.replace(/\r?\n|\r/g, ' \n ').split(' ');
	for (var word in inputTokens){
		if (inputTokens[word] != '\n'){
			var wordElement = document.createElement('a');
			wordElement.innerHTML = inputTokens[word];
			wordElement.className = 'clickableText';
			wordElement.href = '#';
			wordElement.lookupWord = inputTokens[word].replace(/\W+/g, '');
			wordElement.onclick = function (strangeObject) {getWordDefinitions(strangeObject['target']['lookupWord']);}
			document.getElementById('clickableText').appendChild(wordElement);
		} else {
			var wordElement = document.createElement('br');
			document.getElementById('clickableText').appendChild(wordElement);
		}
	}
}

var currentWordGlossObject;

function getWordDefinitions(word){
	var x = new XMLHttpRequest();
	x.open('GET', WORD_LOOKUP_URL+word, true);
	x.onreadystatechange = function () {
		if (x.readyState == 4 && x.status == 200) {
			var doc = x.responseXML;
			currentWordGlossObject = xmlToJson(doc);
			try {
				if (!Array.isArray(currentWordGlossObject['analyses']['analysis'])){ //I discovered that if there's only one analysis, there will not be an array and instead I get an object instead.
					currentWordGlossObject['analyses']['analysis'] = [currentWordGlossObject['analyses']['analysis']]; //the workaround is to just turn it back into an array
				}
				displayGloss(0);
				generateAnalysisButtons();
			} catch (TypeError){
				//if there's no definitions
			}
		}
	}
	x.send(null);
}

function displayGloss(analysis){
	wordGlossElement = document.getElementById('wordGloss');
	wordGlossElement.innerHTML = '';
	for (var key in currentWordGlossObject['analyses']['analysis'][analysis]){
		var keyText = currentWordGlossObject['analyses']['analysis'][analysis][key]['#text'];
		if (keyText != undefined && key != 'form'){
			document.getElementById('wordGloss').innerHTML += "<br />" + key + " " + keyText;
		}
	}
}

function generateAnalysisButtons(){
	var analysisButtonContainer = document.getElementById('analysisButtons');
	while (analysisButtonContainer.firstChild){
		analysisButtonContainer.removeChild(analysisButtonContainer.firstChild);
	}
	var analysisArray = currentWordGlossObject['analyses']['analysis'];
	for (var analysis in analysisArray){
		var analysisButton = document.createElement('input');
		analysisButton.type = 'button';
		analysisButton.value = analysisArray[analysis]['lemma']['#text'];
		analysisButton.analysis = analysis;
		analysisButton.onclick = function (strangeObject) {displayGloss(strangeObject['target']['analysis']);} //I don't really know what the strangeObject is...
		analysisButtonContainer.appendChild(analysisButton);
	}
}

