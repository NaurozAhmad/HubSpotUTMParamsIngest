(function() {
  console.log('working with query', window.location.search);
  let urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('utm_campaign') || urlParams.get('utm_medium') || urlParams.get('utm_source')) {
    console.log('has query params');
    let expires = new Date();
    expires.setMinutes(expires.getMinutes() + 1440);
    console.log('expires', expires);
    localStorage.setItem('utm_source', urlParams.get('utm_source'));
    localStorage.setItem('utm_campaign', urlParams.get('utm_campaign'));
    localStorage.setItem('utm_medium', urlParams.get('utm_medium'));
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
            for (var i = 0; i < inputs.length; i++) {
              if (inputs[i].name == 'utm_campaign') {
                inputs[i].value = localStorage.getItem('utm_campaign');
              }
              if (inputs[i].name == 'utm_source') {
                inputs[i].value = localStorage.getItem('utm_source');
              }
              if (inputs[i].name == 'utm_medium') {
                inputs[i].value = localStorage.getItem('utm_medium');
              }
            }
          }, 1000);
        }
      }, 1000);
    }
  });
})();