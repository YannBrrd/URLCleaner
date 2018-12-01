var pattern = "https://www.google.com/url?q=*"

function redirect(requestDetails) {
    var url_string = requestDetails.url; 
    var url = new URL(url_string);
    var q = url.searchParams.get("q");
    console.log("Redirecting: " + requestDetails.url + " to : " + q);  
    return {
      redirectUrl: q
    };
  }
  
  chrome.webRequest.onBeforeRequest.addListener(
    redirect,
    {urls: [pattern]},
    ["blocking"]
  );