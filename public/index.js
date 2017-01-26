let title = $('#bookmark-title-input');
let url = $('#bookmark-url-input');
let folder = $('#bookmark-folder-input');
let newFolder = $('#new-folder-input');

const showFolders = () => {
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
            <h3 onClick="showURLs('${result[i].id}')">${result[i].folderTitle}
            </div>
            `);
        }
        console.log('The server response', JSON.parse(hitAPI.responseText));
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}

const showURLs = (id) => {
  console.log(id);
}

const sortBookmarksByPopularity = (id) => {
  document.querySelector('#main-folder-display').innerHTML = '';
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', '/bookmarks', true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if(hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        let response = JSON.parse(hitAPI.responseText)
        for (var key in response) {
          let newArr = [];
          if (response.hasOwnProperty(key)) {
            let urls = response[key].urls;
            let sortedURLs;
            if (id === 'sort-popularity-ascending') {
              sortedURLs = urls.sort((a, b) => {
                return b.clickCount - a.clickCount;
              });
            } else {
              sortedURLs = urls.sort((a, b) => {
                return a.clickCount - b.clickCount;
              });
            }
              sortedURLs.map((link) => {
                let longURL = link.longURL;
                let parentFolder = link.parentFolder;
                let id = link.bookmarkId;
                newArr.push(`
                <div
                id="${link.bookmarkId}"
                >
                <p onClick="goToRealURL('${longURL}', '${parentFolder}', '${id}')">${link.shortURL}<p>
                <p>${link.dateAddedHumanReadable}</p>
                <p>Number of visits for this URL: ${link.clickCount}</p>
                </div>
                `)
              });
            $('#main-folder-display').append(`
              <div id="each-bookmark-container">
              <h3>${response[key].folderTitle}
              <ul>
              ${newArr}
              </ul>
              </div>
            `);
          }
        }
      }
    }
  }
}

const sortBookmarksByDate = (id) => {
  document.querySelector('#main-folder-display').innerHTML = '';
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', '/bookmarks', true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if(hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        let response = JSON.parse(hitAPI.responseText)
        for (var key in response) {
          let newArr = [];
          if (response.hasOwnProperty(key)) {
            let urls = response[key].urls;
            let sortedURLs;
            if (id === 'sort-date-ascending') {
              sortedURLs = urls.sort((a, b) => {
                return b.dateAddedRaw - a.dateAddedRaw;
              });
            } else {
              sortedURLs = urls.sort((a, b) => {
                return a.dateAddedRaw - b.dateAddedRaw;
              });
            }
              sortedURLs.map((link) => {
                let longURL = link.longURL;
                let parentFolder = link.parentFolder;
                let id = link.bookmarkId;
                newArr.push(`
                <div
                id="${link.bookmarkId}"
                >
                <p onClick="goToRealURL('${longURL}', '${parentFolder}', '${id}')">${link.shortURL}<p>
                <p>${link.dateAddedHumanReadable}</p>
                <p>Number of visits for this URL: ${link.clickCount}</p>
                </div>
                `)
              });
            $('#main-folder-display').append(`
              <div id="each-bookmark-container">
              <h3>${response[key].folderTitle}
              <ul>
              ${newArr}
              </ul>
              </div>
            `);
          }
        }
      }
    }
  }
}

const goToRealURL = (url, folder, id) => {
  var windowObjectReference;
  console.log(url, folder, id);
  axios.put(`/bookmarks/${folder}/${id}`, null);
  setTimeout(() => {
    windowObjectReference = window.open(`${url}`)
  }, 2000);
}

showFolders();

const saveURL = () => {
  axios.post('/bookmarks', {
    link: url.val(),
    parentFolder: folder.val(),
    bookmarkId: Math.floor(((Date.now()) / 1000000000) * Math.random()),
    dateAddedRaw: Date.now(),
    dateAddedHumanReadable: new Date(),
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
  setTimeout(makeAPICall, 300);
  makeAPICall();
})

//create folders
$('#create-folder-button').on('click', () => {
 saveFolder();
 setTimeout(makeAPICall, 300);
 makeAPICall();
})

$('#sort-popularity-ascending, #sort-popularity-descending').on("click", (event) => {
  sortBookmarksByPopularity(event.target.id);
});

$('#sort-date-ascending, #sort-date-descending').on("click", (event) => {
  sortBookmarksByDate(event.target.id);
});
