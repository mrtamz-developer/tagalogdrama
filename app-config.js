window.TAGALOGDRAMA = {
  version: '1.1.0',
  apiBaseUrl: '',
  features: {
    payments: false,
    authentication: false,
    videoPlayback: false,
    rewardedAds: false,
    localLibrary: true
  }
};

// app.js reads this value when a backend is deployed.
window.TAGALOGDRAMA_API = window.TAGALOGDRAMA.apiBaseUrl;
