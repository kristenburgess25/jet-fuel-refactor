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

          <button
          id="sort-popularity-ascending"
          onClick="sortByPopularity('ascending', '${result[0].folderTitle}')"
          >
          Sort URLs By Popularity (Ascending)
          </button>

          <button
          id="sort-popularity-descending"
          onClick="sortByPopularity('descending', '${result[0].folderTitle}')"
          >
          Sort URLs By Popularity (Descending)
          </button>

          <button
          id="sort-date-ascending"
          onClick="sortByDate('ascending', '${result[0].folderTitle}')"
          >
          Sort URLs By Date (Ascending)
          </button>

          <button
          id="sort-date-descending"
          onClick="sortByDate('descending', '${result[0].folderTitle}')"
          >
          Sort URLs By Date (Descending)
          </button>

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
          console.log('url in map', url);
          $('#main-folder-display').append(`
            <div>
            <p id="${url.id}"
            class="${url.parentFolder} clickable-link"
            >
            ${url.shortURL}
            <p>
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

$(document).on('click', '.clickable-link', (e) => {
  let folderTitle = e.target.className.split(' ')[0];
  let id = e.target.id;
  // axios.get('/api/folders/' + folderTitle + '/urls/' + id)
  axios.get(`/api/folders/${folderTitle}/urls/${id}`)
})

// const openRealURL = () => {
// }

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

const sortByPopularity = (direction, folderTitle) => {
  document.querySelector('#main-folder-display').innerHTML = '';
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', `/api/folders/${folderTitle}/urls`, true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        let result = JSON.parse(hitAPI.responseText);
        let sortedURLs;
        if (direction === 'ascending') {
          sortedURLs = result.sort((a, b) => {
            return a.clickCount - b.clickCount
          });
        } else if (direction === 'descending') {
          sortedURLs = result.sort((a, b) => {
            return b.clickCount - a.clickCount
          });
        }
        let urls = sortedURLs.map((url) => {
          console.log('url in map', url);
          $('#main-folder-display').append(`
            <div">
            <p onClick="goToRealURL(${url})">${url.shortURL}<p>
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

const sortByDate = (direction, folderTitle) => {
  document.querySelector('#main-folder-display').innerHTML = '';
  var hitAPI = new XMLHttpRequest();
  hitAPI.open('GET', `/api/folders/${folderTitle}/urls`, true);
  hitAPI.send();
  hitAPI.onreadystatechange = function() {
    if (hitAPI.readyState === XMLHttpRequest.DONE) {
      if (hitAPI.status === 200) {
        let result = JSON.parse(hitAPI.responseText);
        let sortedURLs;
        if (direction === 'ascending') {
          sortedURLs = result.sort((a, b) => {
            return a.rawDate - b.rawDate;
          });
        } else if (direction === 'descending') {
          sortedURLs = result.sort((a, b) => {
            return b.rawDate - a.rawDate;
          });
        }
        let urls = sortedURLs.map((url) => {
          console.log('url in map', url);
          $('#main-folder-display').append(`
            <div">
            <p onClick="goToRealURL(${url})">${url.shortURL}<p>
            <p>${url.created_at}</p>
            <p>Number of visits for this URL: ${url.clickCount}</p>
            </div>
            `);
        })
        console.log('sorted', sortedURLs);
      } else {
        console.error('There was a problem with the API call.');
      }
    }
  }
}

$('#submit-button').on('click', () => {
  saveURL();
  setTimeout(showFolders, 300);
  showFolders();
})

$('#create-folder-button').on('click', () => {
 saveFolder();
 setTimeout(showFolders, 300);
 showFolders();
})
