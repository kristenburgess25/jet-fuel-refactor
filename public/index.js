let title = $('#bookmark-title-input');
let url = $('#bookmark-url-input');
let folder = $('#bookmark-folder-input');

const makeAPICall = () => {
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', '/bookmarks', true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        //do stuff with the response data
        console.log(hitAPI.responseText);
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}

makeAPICall();

$('#submit-button').on('click', () => {
  let id = 2;
  axios.post('/bookmarks/2', 'foo');
})
