/**
 * © Marcus Lundblad <ml@update.uu.se>
 * Licensed under GNU Public License 3
 * (see LICENSE file)
 *
 * Based on:
 * https://github.com/mbattersby/unmangleOutlookSafelinks
 */

//loop over all html links
function unmangleAllLinks(body) {
  console.log('unmangleAllLinks');
  var links = body.getElementsByTagName("A");
  for (var i = 0; i < links.length; i++) {
    console.log('link: ' + links[i]);
    unmangleLink(links[i]);
  }
}

//fix a link
function unmangleLink(a) {
  if (a.hostname.endsWith('safelinks.protection.outlook.com') == false) {
    return;
  }
  //remember original url
  var orgUrl = a.href;

  var doInner = false;

  // This is a pretty lame test
  if (a.innerHTML.includes('safelinks.protection.outlook.com')) {
    doInner = true;
  }

  var terms = a.search.replace(/^\?/, '').split('&');

  for (var i = 0; i < terms.length; i++) {
    var s = terms[i].split('=');
    if (s[0] == 'url') {
      a.href = decodeURIComponent(s[1]);
      a.title = "Outlook Unmangled from: " + orgUrl;
      console.log("Rewrote "+orgUrl+" to "+a.href);

      if (doInner) {
        a.textContent = a.href;
      }
      return;
    }
  }
}

function decodeURI(match, p1, offset, string) {
  return decodeURIComponent(p1);
}

function unmangleContent(text) {
  text = text.replace(/https:\/\/[^\.]+\.safelinks\.protection\.outlook\.com\/\?url=([^&]*)&[^>\s]*/g, decodeURI);
  return text;
}

var unmangleOutlookSafelinksPlugin = {
        name : "unmangle-outlook-safelinks-plugin",
        setup : (doc) => unmangleAllLinks(doc)
};

Evo.RegisterPlugin(unmangleOutlookSafelinksPlugin);
