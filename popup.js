'use strict';

// START = Loading data from content js to popup
const setDOMInfo = info => {
  document.getElementById('gro_title').textContent = info.state_title;
  document.getElementById('gro_cats').innerHTML = info.state_cats;
  document.getElementById('gro_price').innerHTML = info.state_price;
  document.getElementById('gro_price_unit').innerHTML = info.state_price_unit;
  document.getElementById('gro_sku').innerHTML = info.state_sku;
  document.getElementById('gro_short_desc').innerHTML = info.state_short_desc;
  document.getElementById('gro_desc').innerHTML = info.state_desc;
  document.getElementById('gro_media').textContent = info.state_media;
  document.getElementById('gro_media_preview').src = info.state_media;
  document.getElementById('gro_brand').innerHTML = info.state_brand;
  document.getElementById('gro_url').innerHTML = info.state_url;
  document.getElementById('gro_long_desc').textContent = info.state_long_desc;
  document.getElementById('gro_bullets').textContent = info.state_bullets;
};
// END = Loading data from content js to popup

// START = DOM is ready and loading data
window.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { from: 'popup', subject: 'DOMInfo' },
      setDOMInfo);
  });
});
// END = DOM is ready and loading data

// START = Get Categories
function getAllCats() {
  var data = null;

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.status == 200) {
      var myCats = JSON.parse(this.responseText);
      var sortMyCats = myCats.sort(function (a, b) { return b["name"] - a["name"] });
      console.log(sortMyCats);
      myCatsFunc(sortMyCats);
      document.getElementById('notif').innerHTML = "<h4 id='notif-cats-success'>Successful, All Categories Fetched.</h4>";
      setTimeout(function () { document.getElementById('notif-cats-success').remove(); }, 3000)
      // START Parent Input Value
      var arr = document.querySelectorAll('.gro_all_cats_check');
      var st = [];
      for (var i = 0; i < arr.length; i++) {
        st[i] = arr[i].value
      };
      var sonuc = st.sort(function (a, b) { return b - a });
      document.getElementById('gro_sub_cat').innerHTML = sonuc[0]
      // END Parent Input Value
    } else if (this.status == 400 || this.status == 401 || this.status == 404 || this.status == 405 || this.status == 409 || this.status == 500 || this.status == 503) {
      document.getElementById('notif').innerHTML = "<h4 id='notif-cats-error'>Failed to Fetch All Categories.</h4>";
      setTimeout(function () { document.getElementById('notif-cats-error').remove(); }, 3000)
      // START Parent Input Value
      document.getElementById('gro_sub_cat').innerHTML = ""
      // END Parent Input Value
    }
  });

  xhr.open("GET", "https://halalx.com/grocery/wp-json/wc/v3/products/categories?consumer_key=ck_b6e81d8ac63380180906013d74a5888060013299&consumer_secret=cs_8ed663f730dc3907226476f29c74b8491900d1c1");
  xhr.setRequestHeader("cache-control", "no-cache");

  xhr.send(data);

  var out = [];
  function myCatsFunc(arr) {
    for (var i = 0; i < arr.length; i++) {
      out += i + 1 + '. <input type="checkbox" class="gro_all_cats_check" name="gro-' + arr[i]["id"] + '" value="' + arr[i]["id"] + '">' + arr[i]["id"] + ' - ' + arr[i]["name"] + '<br>';
    }
    document.getElementById("gro_all_cats").innerHTML = out;
  }
  // ö
  /*   var list = document.getElementById('mylist');
  
    var items = list.childNodes;
    var itemsArr = [];
    for (var i in items) {
      if (items[i].nodeType == 1) { // get rid of the whitespace text nodes
        itemsArr.push(items[i]);
      }
    }
  
    itemsArr.sort(function (a, b) {
      return a.innerHTML == b.innerHTML
        ? 0
        : (a.innerHTML > b.innerHTML ? 1 : -1);
    });
  
    for (i = 0; i < itemsArr.length; ++i) {
      list.appendChild(itemsArr[i]);
    } */
  // ç
}
// END = Get Categories
// START = Create Category
function postCategory() {
  /*   if (document.getElementById('gro_cats_check_0').checked) {
      document.getElementById('gro_sub_cat').innerHTML = "0"
    } else {
      var arr = document.querySelectorAll('.gro_all_cats_check');
      var st = [];
      for (var i = 0; i < arr.length; i++) {
        st[i] = arr[i].value
      };
      var sonuc = st.sort(function (a, b) { return b - a });
      document.getElementById('gro_sub_cat').innerHTML = sonuc[0]
    } */
  var data = new FormData();
  var arr = document.querySelectorAll('.gro_cats_check:checked')
  var cat = []

  for (var i = 0; i < arr.length; i++) {
    cat[i] = arr[i].value
  }
  var parent = document.getElementById('gro_sub_cat').textContent
  data.append("name", cat);
  data.append("parent", parent);
  console.log(cat + ' / ' + parent)

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4 && this.response == 200) {
      console.log(this.responseText);
      document.getElementById('notif').innerHTML = "<h4 id='notif-cats-success'>Successful, Added Category.</h4>";
      setTimeout(function () { document.getElementById('notif-cats-success').remove(); }, 3000)
    }
  });

  xhr.open("POST", "https://halalx.com/grocery/wp-json/wc/v3/products/categories?consumer_key=ck_b6e81d8ac63380180906013d74a5888060013299&consumer_secret=cs_8ed663f730dc3907226476f29c74b8491900d1c1");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("cache-control", "no-cache");

  xhr.send(data);

}
function main() {
  // Initialization work goes here.
  getAllCats();
  document.getElementById("gro_get_all_cats").addEventListener("click", getAllCats);
  document.getElementById("gro_post_cat").addEventListener("click", postCategory);
}
// END = Create Category
document.addEventListener('DOMContentLoaded', function () {
  main();
});