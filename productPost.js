window.addEventListener('load', function load(event) {
  document.getElementById('gro_submit').onclick = function () {
    // START = Request Settings
    var baseURL = "https://halalx.com/grocery/wp-json/wc/v3";
    var keyName = "consumer_key";
    var keyValue = "ck_b6e81d8ac63380180906013d74a5888060013299";
    var secretName = "consumer_secret";
    var secretValue = "cs_8ed663f730dc3907226476f29c74b8491900d1c1";
    var reqType = "products";
    // END = Request Settings

    // START = Data Variables
    var productName = document.getElementById('gro_title').innerHTML;
    var productRegularPrice = document.getElementById('gro_price').innerHTML;
    var infoPriceUnit = document.getElementById('gro_price_unit').innerHTML;
    var infoBrand = document.getElementById('gro_brand').innerHTML;
    var infoShortDesc = document.getElementById('gro_short_desc').innerHTML;
    var infoDesc = document.getElementById('gro_desc').innerHTML;
    var elArea = document.getElementById('gro_cats');
    var productShortDesc = elArea.insertAdjacentHTML("beforebegin", "<li>Price Unit: " + infoPriceUnit + "</li>") + elArea.insertAdjacentHTML("beforebegin", "<li>Brand: " + infoBrand + "</li>") + elArea.insertAdjacentHTML("beforebegin", "<li>" + infoShortDesc + "</li>") + elArea.insertAdjacentHTML("beforebegin", "<li>" + infoDesc + "</li>")
    // END = Data Variables

    var data = JSON.stringify({
      "name": "Premium Quality",
      "type": "simple",
      "sku": "789654132990",
      "price": "24.54",
      "regular_price": "24.54",
      "sale_price": "23.54",
      "description": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.",
      "short_description": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      "categories": [
        {
          "id": 516
        },
        {
          "id": 548
        },
        {
          "id": 659
        }
      ],
      "images": [
        {
          "src": "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_front.jpg"
        },
        {
          "src": "http://demo.woothemes.com/woocommerce/wp-content/uploads/sites/56/2013/06/T_2_back.jpg"
        }
      ]
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("POST", baseURL + "/" + reqType + "?" + keyName + "=" + keyValue + "&" + secretName + "=" + secretValue);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "*/*");
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(data);
  };
});