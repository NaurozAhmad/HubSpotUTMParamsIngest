(function() {
  console.log('working with query', window.location.search);
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('utm_campaign') || urlParams.get('utm_medium') || urlParams.get('utm_source') || urlParams.get('gclid')) {
    console.log('has query params');
    let expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10800);
    console.log('expires', expires);
    if (urlParams.get('gclid')) {
      localStorage.removeItem('utm_source');
      localStorage.removeItem('utm_campaign');
      localStorage.removeItem('utm_medium');
      localStorage.setItem('gclid', urlParams.get('gclid'));
    } else {
      localStorage.removeItem('gclid');
      localStorage.setItem('utm_source', urlParams.get('utm_source'));
      localStorage.setItem('utm_campaign', urlParams.get('utm_campaign'));
      localStorage.setItem('utm_medium', urlParams.get('utm_medium'));
    }
    localStorage.setItem('expiry', expires);
  }
})();

(function() {
  window.addEventListener('message', event => {
    if (event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady') {
      setTimeout(function() {
        let expiry = new Date(localStorage.getItem('expiry'));
        let now = new Date();
        console.log("Form loaded!");
        if (expiry.getTime() < now.getTime()) {
          console.log('expired');
        } else {
          setTimeout(function() {
            console.log('setting values of hubspot form.');
            let myiframe = document.getElementById('hs-form-iframe-0');
            console.log('myiframe', myiframe);
            var y = (myiframe.contentWindow || myiframe.contentDocument);
            console.log('y', y.document);
            let inputs = y.document.getElementsByClassName('hs-input')
            console.log('utm', inputs);
            let utm_campaign = '';
            let utm_guid = '';
            if (localStorage.getItem('utm_campaign')) {
              utm_campaign = localStorage.getItem('utm_campaign').split('-')[0];
              utm_guid = localStorage.getItem('utm_campaign').split('-')[1] || '';
            }
            for (var i = 0; i < inputs.length; i++) {
              if (localStorage.getItem('gclid')) {
                if (inputs[i].name == 'gclid') {
                  inputs[i].value = localStorage.getItem('gclid');
                }
              } else {
                if (inputs[i].name == 'utm_campaign') {
                  inputs[i].value = utm_campaign;
                }
                if (inputs[i].name == 'utm_source') {
                  inputs[i].value = localStorage.getItem('utm_source');
                }
                if (inputs[i].name == 'utm_medium') {
                  inputs[i].value = localStorage.getItem('utm_medium');
                }
                if (inputs[i].name == 'utm_guid') {
                  inputs[i].value = utm_guid;
                }
              }
            }
          }, 1000);
        }
      }, 1000);
    }
  });
})();
