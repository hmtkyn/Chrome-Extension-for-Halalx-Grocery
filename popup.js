// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// Update the relevant fields with the new data.
const setDOMInfo = info => {
  document.getElementById('gro_title').textContent = info.state_title;
  document.getElementById('gro_cats').textContent = info.state_cats;
  document.getElementById('gro_price').value = info.state_price;
  document.getElementById('gro_price_unit').value = info.state_price_unit;
  document.getElementById('gro_short_desc').value = info.state_short_desc;
  document.getElementById('gro_desc').value = info.state_desc;
  document.getElementById('gro_media').textContent = info.state_media;
  document.getElementById('gro_media_preview').src = info.state_media;
  document.getElementById('gro_brand').value = info.state_brand;
  document.getElementById('gro_url').href = info.state_url;
};

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
      tabs[0].id,
      { from: 'popup', subject: 'DOMInfo' },
      // ...also specifying a callback to be called 
      //    from the receiving end (content script).
      setDOMInfo);
  });
});