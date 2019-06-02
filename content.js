// Inform the background page that 
// this tab should have a page-action.
chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction',
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    // Collect the necessary data. 
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`.)

    var Arr = [].slice.call(document.querySelectorAll('span[itemprop=name]')).slice(2, -1);
    var Content = ""
    for (var i = 0; i < Arr.length; i++) {
      Content += Arr[i].innerHTML + " > ";
    };
    var domInfo = {
      state_title: document.getElementsByTagName('h1')[0].innerText,
      state_price: document.querySelector('.price-current > div').textContent,
      state_price_unit: document.querySelectorAll('.price-unit > a')[0].innerText,
      state_media: document.getElementsByClassName('image')[0].src,
      state_cats: Content,
      state_short_desc: document.getElementsByClassName('short_desc')[0].innerHTML,
      state_desc: document.getElementsByClassName('description')[0].innerHTML,
      state_brand: document.getElementsByClassName('brand-link')[0].innerHTML,
      state_url: window.location["href"]
    };

    // Directly respond to the sender (popup), 
    // through the specified callback.
    response(domInfo);
  }
});