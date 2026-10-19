// Better Wellness: Google Ads conversion tracking.
// To switch it on, paste both values from Google Ads (Goals > Conversions > your
// WhatsApp conversion > Tag setup > "Install the tag yourself"). While either is
// empty, nothing loads and no data is sent to Google.
(function () {
  var ADS_ID = '';            // looks like 'AW-123456789'
  var CONVERSION_LABEL = '';  // looks like 'AbC-D_efG-h12_34-567'

  if (!ADS_ID || !CONVERSION_LABEL) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ADS_ID);

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ADS_ID);
  document.head.appendChild(script);

  // Every booking happens on WhatsApp, so a tap on any WhatsApp link counts as a conversion
  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[href*="wa.me/"]') : null;
    if (!link) {
      return;
    }
    gtag('event', 'conversion', {
      send_to: ADS_ID + '/' + CONVERSION_LABEL,
      transport_type: 'beacon'
    });
  });
})();
