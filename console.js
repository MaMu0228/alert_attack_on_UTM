// indexedDB 생성
const DB_NAME = 'music_db';
const DB_VERSION = 1;
const DB_STORE_NAME = 'music_store';

let db;

const request = window.indexedDB.open(DB_NAME, DB_VERSION);

request.onerror = function(event) {
  console.error('indexedDB 생성 오류:', event.target.errorCode);
};

request.onsuccess = function(event) {
  db = event.target.result;
  console.log('indexedDB 생성 완료');
};

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  const objectStore = db.createObjectStore(DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
  console.log('object store 생성 완료');
};

// 파일 업로드 창 생성
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.addEventListener('change', uploadMusic);

// 화면 하단에 파일 선택 창을 만듦
document.body.appendChild(fileInput);

function uploadMusic(event) {
  // 파일을 file에 저장
  const file = event.target.files[0];
  // FileReader() 객체를 만듦
  const reader = new FileReader();
  // FileReader 객체에 데이터가 담기는 이벤트 발생시, event.target.result(ArrayBuffer객체)를 blob객체로 만듦
  reader.onload = function(event) {
    const musicBlob = new Blob([event.target.result], { type: file.type });
    // 만든 Blob 객체를 
    saveMusicToDB(musicBlob);
  };
  // reader.onload 이벤트를 발생시키기 위한 코드로, 이진데이터 파일을 바이트 단위(ArrayBuffer)로 읽음
  reader.readAsArrayBuffer(file);
}

// indexedDB에 음악 파일 저장
function saveMusicToDB(musicBlob) {
  // music_store라는 오브젝트 스토어를 readwrite로 지정하고
  const transaction = db.transaction([DB_STORE_NAME], 'readwrite');
  // 오브젝트 스토어를 열고
  const objectStore = transaction.objectStore(DB_STORE_NAME);
  // 받은 musicBlob을 저장함
  const request = objectStore.add({ music: musicBlob });

  request.onerror = function(event) {
    console.error('음악 파일 저장 오류:', event.target.errorCode);
  };

  request.onsuccess = function(event) {
    console.log('음악 파일 저장 완료');
    
  };
}

let audio; // audio 변수를 함수 외부에서 선언

// 음악재생
function playMusicFromDB(id) {
  const transaction = db.transaction([DB_STORE_NAME], 'readonly');
  const objectStore = transaction.objectStore(DB_STORE_NAME);
  // id 인수에 담김 숫자로 오브젝트 스토어에서 데이터를 가져와 request에 넣음
  const request = objectStore.get(id);

  // request라는 변수에 오브젝트를 불러오는 코드가 실패해 onerror 이벤트 발생시 실행
  request.onerror = function(event) {
    console.error('음악 파일 불러오기 오류:', event.target.errorCode);
  };
  // request라는 변수에 오브젝트를 불러오는 코드가 성공해 onsuccess 이벤트 발생시 실행
  request.onsuccess = function(event) {
    const musicBlob = event.target.result.music;
    const audioURL = URL.createObjectURL(musicBlob);

    var audio = new Audio(audioURL);
    audio.controls = true;
    audio.play(); // 음악 파일 재생

    document.body.appendChild(audio);

    console.log('음악 파일 재생');
  };
};  

/////////// 위 코드들을 먼저 실행해 노래 파일을 업로드 후 밑에 코드 실행

// 요청할 URL
let URL = 'https://example.com';
let attackArray = ['value1', 'value2', 'value3'];

// URL에서 비동기적으로 요청을 보내 받은 데이터에서 특정 클래스의 데이터를 가져오고
// 배열들을 비교해, 일치하는 게 있을 시 노래를 재생하는 코드
function getDataFromUrl() {
  let sipArray = [];

  fetch(URL)
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, 'text/html');
      const elements = htmlDoc.querySelectorAll('.foo');

      elements.forEach(element => {
        sipArray.push(element.textContent.trim());
      });

      attackArray.some(value => {
        if (sipArray.includes(value)) {
            playMusicFromDB(1);
            return true;
        }
    });
    .catch(error => {
      console.error('Error:', error);
    });
}

setInterval(getDataFromUrl, 10000);

