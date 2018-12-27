var urls_before_pattern = [
  "*://www.google.com/url?q=*",
  "*://*.snip.ly/*#http*",
  "*://*.snip.ly/render/*/?_url=*"
]
var urls_headers_pattern = [
  "*://*.snip.ly/*"
]

function cleanGoogle(url) {
  var q = url.searchParams.get("q");
  return q;
}

function cleanSniply (url) {
  var q = url;
  var snipURL = new URL(url);
  var _url = snipURL.searchParams.get("_url");
  if(_url != null) {
    url = _url;
  }
  if (url.indexOf('#') > -1)
    var q = url.split('#')[1];
  return q;
}

function redirect(requestDetails) {
    var url_string = requestDetails.url; 
    console.log(url_string);
    var url = new URL(url_string);
    var q = "";
    switch (url.hostname) {
      case "www.google.com" :
        q = cleanGoogle(url);
        break;
      case "snip.ly" : 
        q = cleanSniply(url_string);
        break;
      default :
        q = url_string;
    }
    console.log("Redirecting: " + requestDetails.url + " to : " + q);  
    return {
      redirectUrl: q
    };
  }
  
function redirect_sniply(responseDetails){
  var headers = responseDetails.responseHeaders;
  var link = "";
  for (i = 0; i < headers.length; i++) {
    if(headers[i]["name"] == "Link") {
      link = headers[i]["value"].split(";")[0];
      link = link.substring(1, link.length-1)
      break;
    }
  }

  if (link != "") {
    console.log("Redirect to : " + link);  
    return {
      redirectUrl: link
    };
  } else 
  return {
    responseHeaders: headers
  };

}

  chrome.webRequest.onBeforeRequest.addListener(
    redirect,
    {urls: urls_before_pattern},
    ["blocking"]
  );

chrome.webRequest.onHeadersReceived.addListener(
  redirect_sniply,
  {urls: urls_headers_pattern},
  ["blocking", "responseHeaders"] 
)
