var urls_pattern = [
  "*://www.google.com/url?q=*",
  "*://*.snip.ly/*#http*",
  "*://*.snip.ly/render/*/?_url=*"
]

function removeParam(key, sourceURL) {
  var rtn = sourceURL.split("?")[0],
      param,
      params_arr = [],
      queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
      params_arr = queryString.split("&");
      for (var i = params_arr.length - 1; i >= 0; i -= 1) {
          param = params_arr[i].split("=")[0];
          if (param === key) {
              params_arr.splice(i, 1);
          }
      }
      rtn = rtn + "?" + params_arr.join("&");
  }
  return rtn;
}

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
    var new_q = removeParam("fbclid", q)
    console.log("Redirecting: " + requestDetails.url + " to : " + new_q);  
    return {
      redirectUrl: new_q
    };
  }
  
  chrome.webRequest.onBeforeRequest.addListener(
    redirect,
    {urls: urls_pattern},
    ["blocking"]
  );