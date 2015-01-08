// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

function parseJson(response) {
    return JSON.parse(response);
}

function sendResponse(value) {
    var response = parseJson(value);
    
    var packs = new Array();
    for (pack in response["packs"]) {
        packs.push(response["packs"][pack]["name"]);
    }
    $("#list-modpacks").text(packs);
}

// Make the actual CORS request.
function makeCorsRequest(url) {
    
  var response;
    
  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    //alert("Response: " + text);
    sendResponse(text);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}