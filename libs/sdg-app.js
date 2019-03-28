let parentLocation;
try {
  parentLocation = window.parent.location.href;
} catch (e) {
  parentLocation = 'cannot-get-parent-location-because-of-CORS';
}
const isEmbeddedInIFrame = document.location.href !== parentLocation;

const CLOUD_VIZ_REQUEST_DATA = 'CLOUD_VIZ_REQUEST_DATA';
const SDG_APP_RECEIVE_DATA = 'SDG_APP_RECEIVE_DATA';
const CLOUD_VIZ_DISPLAY_PUBLICATION = 'CLOUD_VIZ_DISPLAY_PUBLICATION';
const CLOUD_VIZ_BOOKMARK_PUBLICATION = 'CLOUD_VIZ_BOOKMARK_PUBLICATION';

function sdgAppGetData(onReceiveDataCallback) {
  if (isEmbeddedInIFrame) {
    const handleReceiveData = function handleReceiveData(e) {
      if (e.data.type === SDG_APP_RECEIVE_DATA) {
        onReceiveDataCallback(e.data.data);
      }
      window.removeEventListener('message', handleReceiveData);
    };
    window.addEventListener('message', handleReceiveData);
    window.parent.postMessage({ type: CLOUD_VIZ_REQUEST_DATA }, '*');
  } else {
    d3.tsv("data/data.tsv", function(error, data) {
      onReceiveDataCallback(data);
    });
  }
}

function sdgAppDisplayPublication(doi) {
  if (isEmbeddedInIFrame) {
    window.parent.postMessage({ type: CLOUD_VIZ_DISPLAY_PUBLICATION, doi: doi }, '*');
  }
}

function sdgAppBookmarkPublication(doi) {
  if (isEmbeddedInIFrame) {
    window.parent.postMessage({ type: CLOUD_VIZ_BOOKMARK_PUBLICATION, doi: doi }, '*');
  }
}
