var urls_pattern = [
  "*://www.google.com/url?q=*",
  "*://*.snip.ly/*#http*",
  "*://*.snip.ly/render/*/?_url=*",
  "*fbclid=*",
  "*utm_*"
]

function cleanGoogle(url) {
  var q = url.searchParams.get("q");
  return q;
}

function cleanSniply(url) {
  var q = url;
  var snipURL = new URL(url);
  var _url = snipURL.searchParams.get("_url");
  if (_url != null) {
    url = _url;
  }
  if (url.indexOf('#') > -1)
    var q = url.split('#')[1];
  return q;
}

function cleanUTM(utmURL) {
  for (let p of utmURL.searchParams) {
    if (p.startsWith("utm_"))
      utmURL.searchParams.delete(p);
  }

  return utmURL;
}

function redirect(requestDetails) {
  var url_string = requestDetails.url;
  var url = new URL(url_string);
  var q = "";
  switch (url.hostname) {
    case "www.google.com":
      q = cleanGoogle(url);
      break;
    case "snip.ly":
      q = cleanSniply(url_string);
      break;
    default:
      q = url_string;
  }

  var new_q = new URL(q);

  if(new_q.searchParams.has("fbclid"))
    new_q.searchParams.delete("fbclid");

  if(new_q.search.includes("utm_"))
    new_q = cleanUTM(new_q);

  console.log("Redirecting: " + requestDetails.url + " to : " + new_q.url);
  return {
    redirectUrl: new_q.url
  };
}

chrome.webRequest.onBeforeRequest.addListener(
  redirect,
  { urls: urls_pattern },
  ["blocking"]
);