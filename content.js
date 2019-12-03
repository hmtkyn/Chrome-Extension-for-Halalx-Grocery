chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction',
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {

    var Arr = [].slice.call(document.querySelectorAll('span[itemprop=name]')).slice(2, -1);
    var Content = ""
    for (var i = 0; i < Arr.length; i++) {
      Content += '<span class="gro_get_cat">' + i + '. <input type="checkbox" id="gro_cats_check_' + i + '" class="gro_cats_check" name="gro-' + Arr[i].innerText + '" value="' + Arr[i].innerText + '"><span class="gro_get_cat_inner">' + Arr[i].innerText + '</span></span>';
    };
    function getBrand() {
      var Brand = document.getElementsByClassName('brand-link')[0]
      if (Brand == undefined) { return "" } else { return document.getElementsByClassName('brand-link')[0].innerHTML }
    }
    function getPriceUnit() {
      var PriceUnit = document.querySelectorAll('.price-unit > a')[0]
      if (PriceUnit == undefined) { return "" } else { return document.querySelectorAll('.price-unit > a')[0].innerText }
    }
    function getFixPrice() {
      var price = document.querySelector('.price-current > div').textContent
      if (price.includes("$") === true) {
        return price.split("$")[1]
      } else if (price.includes("¢") === true) {
        return price.split("¢")[0] / 100
      }
    }
    var domInfo = {
      state_title: document.getElementsByTagName('h1')[0].innerText,
      state_price: getFixPrice(),
      state_price_unit: getPriceUnit(),
      state_media: document.getElementsByClassName('image')[0].src,
      state_cats: Content,
      state_short_desc: document.getElementsByClassName('short_desc')[0].innerHTML,
      state_desc: document.getElementsByClassName('description')[0].innerHTML,
      state_brand: getBrand(),
      state_url: window.location["href"],
      state_long_desc: document.getElementsByClassName('description')[1].innerText,
      state_bullets: document.getElementsByClassName('bullets')[0].innerText,
      state_sku: document.getElementsByClassName('identifier-text')[1].innerHTML,
      state_upc: document.getElementsByClassName('identifier-text')[2].innerHTML
    };
    response(domInfo);
  }
});