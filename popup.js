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
      myCatsFunc(myCats);
      document.getElementById('notif').innerHTML = "<h4 id='notif-cats-success'>Successful, All Categories Fetched.</h4>";
      if (document.querySelectorAll("notif-cats-success").length >= 0) {
        setTimeout(function () { document.getElementById('notif-cats-success').remove(); }, 3000)
      }
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
      if (document.querySelectorAll("notif-cats-error").length >= 0) {
        setTimeout(function () { document.getElementById('notif-cats-error').remove(); }, 3000)
      }
      // START Parent Input Value
      document.getElementById('gro_sub_cat').innerHTML = ""
      // END Parent Input Value
    }
  });

  xhr.open("GET", "https://halalx.com/grocery/wp-json/wc/v3/products/categories?per_page=100&consumer_key=ck_b6e81d8ac63380180906013d74a5888060013299&consumer_secret=cs_8ed663f730dc3907226476f29c74b8491900d1c1&orderby=id&order=desc");
  xhr.setRequestHeader("cache-control", "no-cache");

  xhr.send(data);

  var out = [];
  function myCatsFunc(arr) {
    for (var i = 0; i < arr.length; i++) {
      out += i + 1 + '. <input type="checkbox" class="gro_all_cats_check" name="gro-' + arr[i]["id"] + '" value="' + arr[i]["id"] + '">' + arr[i]["id"] + ' - ' + arr[i]["name"] + '<br>';
    }
    document.getElementById("gro_all_cats").innerHTML = out;
  }
}
// END = Get Categories
// START = Create Category
function postCategory() {
  var data = new FormData();

  var selected = document.querySelectorAll('#gro_cats > input:checked')[0].value;
  var parent = parseFloat(document.getElementById('gro_sub_cat').textContent)

  data.append("name", selected);
  data.append("parent", parent);
  console.log(selected + ' / ' + parent)

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
      console.log(this.responseText);
      document.getElementById('notif').innerHTML = "<h4 id='notif-cats-success'>Successful, added category.</h4>";
      getAllCats();
      if (document.querySelectorAll("notif-cats-success").length >= 0) {
        setTimeout(function () { document.getElementById('notif-cats-success').remove(); }, 3000)
      }
    } else if (this.status == 400 || this.status == 403 || this.status == 404) {
      console.log(this.responseText);
      document.getElementById('notif').innerHTML = "<h4 id='notif-cats-error'>Failed, could not add category.</h4>";
      if (document.querySelectorAll("notif-cats-error").length >= 0) {
        setTimeout(function () { document.getElementById('notif-cats-error').remove(); }, 3000)
      }
    }
  });

  xhr.open("POST", "https://halalx.com/grocery/wp-json/wc/v3/products/categories?consumer_key=ck_b6e81d8ac63380180906013d74a5888060013299&consumer_secret=cs_8ed663f730dc3907226476f29c74b8491900d1c1");
  xhr.setRequestHeader("cache-control", "no-cache");

  xhr.send(data);

}
// END = Create Category
// START = Create Product
function postProduct() {
  var proTitle = document.getElementById("gro_title").textContent;
  var proPrice = parseFloat(document.getElementById("gro_price").textContent);
  var proPriceUnit = document.getElementById("gro_price_unit").textContent;
  var proBrand = document.getElementById("gro_brand").textContent;
  var proSKU = document.getElementById("gro_sku").textContent;
  var proinfoShortDesc = document.getElementById("gro_short_desc").innerText;
  var proinfoDesc = document.getElementById("gro_desc").innerText;
  var proDesc = document.getElementById("gro_long_desc").textContent;
  var proFeatures = document.getElementById("gro_bullets").textContent;
  var proMedia = document.getElementById("gro_media").textContent;
  var proURL = document.getElementById("gro_url").innerHTML;
  function proNewPrice() {
    var x = Math.floor((Math.random() * 5) + 1);
    console.log(x);
    var newPrice = proPrice - (proPrice / 100) * x;
    console.log(newPrice.toFixed(2).toString())
    return newPrice.toFixed(2).toString()
  }
  function proCats() {
    var cats = document.querySelectorAll("#gro_all_cats > input:checked");
    var catsvalue = [];
    var i = 0;
    for (i; i < cats.length; i++) {
      catsvalue.push({ "id": parseFloat(cats[i].value) })
    };
    return catsvalue
  };
  var proShortDescription = "<b>Brand: </b>" + proBrand + "<br> <b>Price Unit: </b>" + proPriceUnit + "<br> <b>Info: </b>" + proinfoShortDesc + " " + proinfoDesc + ""
  var proDescription = "<b>Brand: </b>" + proBrand + "<br> <b>Price Unit: </b>" + proPriceUnit + "<br> <b>Info: </b>" + proinfoShortDesc + " " + proinfoDesc + "<br> <b>Description: </b>" + proDesc + "<br> <b>Features: </b>" + proFeatures + ""

  var data = JSON.stringify({
    "name": proTitle,
    "regular_price": proNewPrice(),
    "description": proDescription,
    "short_description": proShortDescription,
    "categories": proCats(),
    "meta_data": [{
      "id": 33563,
      "key": "pro_url",
      "value": proURL
    }],
    "images": [
      {
        "src": proMedia
      }
    ],
    "sku": proSKU
  });

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState == 4 && this.status == 201) {
      console.log(this.responseText);
      document.getElementById('notif').innerHTML = "<h4 id='notif-cats-success'>Successful, added product.</h4>";
      if (document.querySelectorAll("notif-cats-success").length >= 0) {
        setTimeout(function () { document.getElementById('notif-cats-success').remove(); }, 3000)
      }
    } else if (this.readyState == 4 && this.status == 400) {
      console.log(this.responseText);
      console.log(this.status);
      console.log("Aynı ürün ekli zaten");
      document.getElementById('notif').innerHTML = "<h4 id='notif-cats-warning'>Product already added.</h4>";
      if (document.querySelectorAll("notif-cats-warning").length >= 0) {
        setTimeout(function () { document.getElementById('notif-cats-warning').remove(); }, 3000)
      }
    } else if (this.status == 403 || this.status == 404) {
      console.log(this.responseText);
      console.log(this.status);
      document.getElementById('notif').innerHTML = "<h4 id='notif-cats-error'>Failed, could not add product.</h4>";
      if (document.querySelectorAll("notif-cats-error").length >= 0) {
        setTimeout(function () { document.getElementById('notif-cats-error').remove(); }, 3000)
      }
    }
  });

  xhr.open("POST", "https://halalx.com/grocery/wp-json/wc/v3/products?consumer_key=ck_b6e81d8ac63380180906013d74a5888060013299&consumer_secret=cs_8ed663f730dc3907226476f29c74b8491900d1c1");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Cache-Control", "no-cache");

  xhr.send(data);
}
// END = Create Product
function main() {
  getAllCats();
  document.getElementById("gro_get_all_cats").addEventListener("click", getAllCats);
  document.getElementById("gro_post_cat").addEventListener("click", postCategory);
  document.getElementById("gro_submit").addEventListener("click", postProduct);
}

document.addEventListener('DOMContentLoaded', function () {
  main();
});