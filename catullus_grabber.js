const CATULLUS_URL = "https://www.perseus.tufts.edu/hopper/xmlchunk?doc=Perseus:text:1999.02.0003:poem=";

function getCatullus(){
	poemNumber = document.getElementById('catullusSelector').value;
	document.getElementById('input').value = '';
	var x = new XMLHttpRequest();
	x.open('GET', CATULLUS_URL+poemNumber, true);
	x.onreadystatechange = function () {
		if (x.readyState == 4 && x.status == 200) {
			var doc = x.responseXML;
			poemObject = xmlToJson(doc);
			try {
				poemLines = poemObject['TEI.2']['text']['body']['div1']['div2']['l'];
				for (var line in poemLines){
					document.getElementById('input').value += poemLines[line]['#text'] + "\n";
				}
			} catch (TypeError){
				//if it doesn't exist
			}
		}
	}
	x.send(null);
}