const makeAPICall = () => {
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', 'http://localhost:3000/bookmarks', true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        console.log(hitAPI.responseText);
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}

makeAPICall();
