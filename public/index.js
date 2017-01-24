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
        //do stuff with the response data, like put it on the page
        console.log(JSON.parse(hitAPI.responseText));
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}

makeAPICall();
//TODO look up IIFEs in ES6

$('#submit-button').on('click', () => {
  let id = 2;
  axios.post('/bookmarks', {
    title: title.val(),
    url: url.val(),
    folder: folder.val(),
    id: Date.now(),
  })
})

$('#update-bookmarks-button').on('click', () => {
  makeAPICall();
})
