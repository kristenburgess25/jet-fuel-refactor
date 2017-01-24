let title = $('#bookmark-title-input');
let url = $('#bookmark-url-input');
let folder = $('#bookmark-folder-input');
let newFolder = $('#new-folder-input');

const makeAPICall = () => {
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', '/bookmarks', true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        document.querySelector('#bookmark-folder-input').innerHTML = '';
        let defaultOption = document.createElement('OPTION');
        let text = document.createTextNode('Folder Name for this Bookmark');
        defaultOption.appendChild(text);
        document.querySelector('#bookmark-folder-input').appendChild(defaultOption);
        for (let prop in JSON.parse(hitAPI.responseText)) {
          let opt = document.createElement('OPTION');
          opt.value = prop;
          let text1 = document.createTextNode(prop);
          opt.appendChild(text1);
          document.querySelector('#bookmark-folder-input').appendChild(opt);
        }
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
  axios.post('/bookmarks', {
    title: title.val(),
    url: url.val(),
    folder: folder.val(),
    id: Math.floor(((Date.now()) / 1000000000) * Math.random()),
    type: 'bookmark-update',
  })
})

$('#create-folder-button').on('click', () => {
  axios.post('/bookmarks', {
    folder: newFolder.val(),
    type: 'folder-update',
  })
})

$('#update-bookmarks-button').on('click', () => {
  makeAPICall();
})
