let title = $('#bookmark-title-input');
let url = $('#bookmark-url-input');
let folder = $('#bookmark-folder-input');
let newFolder = $('#new-folder-input');

const showFolders = () => {
  document.querySelector('#main-folder-display').innerHTML = '';
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', '/api/folders', true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        let result = JSON.parse(hitAPI.responseText);
        document.querySelector('#bookmark-folder-input').innerHTML = '';

        let defaultOption = document.createElement('OPTION');
        let text = document.createTextNode('Folder Name for this Bookmark');

        defaultOption.appendChild(text);
        document.querySelector('#bookmark-folder-input').appendChild(defaultOption);
        for (var i = 0; i < result.length; i++) {
          let opt = document.createElement('OPTION');
          opt.value = result[i].folderTitle;
          let text1 = document.createTextNode(result[i].folderTitle);
          opt.appendChild(text1);
          document.querySelector('#bookmark-folder-input').appendChild(opt);
          $('#main-folder-display').append(`
            <div>
            <h3 onClick="showOneFolder('${result[i].folderTitle}')">${result[i].folderTitle}
            </div>
            `);
        }
        console.log('The server response for showFolders', JSON.parse(hitAPI.responseText));
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}

const showOneFolder = (folderTitle) => {
  document.querySelector('#main-folder-display').innerHTML = '';
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', `/api/folders/${folderTitle}`, true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        let result = JSON.parse(hitAPI.responseText);
        console.log('server response for showOneFolder', result);
        $('#main-folder-display').append(`
          <div>
          <h2 onClick="showURLs('${result[0].folderTitle}')">${result[0].folderTitle}</h2>
          </div>
          `);
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}

const showURLs = (folderTitle) => {
  document.querySelector('#main-folder-display').innerHTML = '';
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', `/api/folders/${folderTitle}/urls`, true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        let result = JSON.parse(hitAPI.responseText);
        console.log('server response for showURLs', result);
        let urls = result.map((url) => {
          $('#main-folder-display').append(`
            <div>
            <p onClick="goToRealURL('${url.longURL}', '${url.parentFolder}', '${url.id}')">${url.shortURL}<p>
            <p>${url.created_at}</p>
            <p>Number of visits for this URL: ${url.clickCount}</p>
            </div>
            `);
        })
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}

//need to comment back in the windowObjectReference stuff later
const goToRealURL = (url, parentFolder, urlid) => {
  // var windowObjectReference;
  console.log(`/api/folders/${parentFolder}/urls/${urlid}`);
  axios.put(`http://localhost:3000/api/folders/${parentFolder}/urls/${urlid}`, null);
  // setTimeout(() => {
  //   windowObjectReference = window.open(`${url}`)
  // }, 2000);
}

showFolders();

const saveURL = () => {
  let folderTitle = $('#bookmark-folder-input').val();
  axios.post('/api/folders/${folderTitle}/urls', {
    longURL: $('#bookmark-url-input').val(),
    parentFolder: $('#bookmark-folder-input').val(),
    folder_id: 1167,
    clickCount: 0,
    requestType: 'bookmark-update',
  })
}

const saveFolder = () => {
  axios.post('/api/folders', {
    folderTitle: newFolder.val(),
    requestType: 'folder-update',
  })
}

//create bookmarks
$('#submit-button').on('click', () => {
  saveURL();


  // showFolders() in setTimeout like below
})

//create folders
$('#create-folder-button').on('click', () => {
 saveFolder();
 setTimeout(showFolders, 300);
 showFolders();
})

$('#sort-popularity-ascending, #sort-popularity-descending').on("click", (event) => {
  sortBookmarksByPopularity(event.target.id);
});

$('#sort-date-ascending, #sort-date-descending').on("click", (event) => {
  sortBookmarksByDate(event.target.id);
});
