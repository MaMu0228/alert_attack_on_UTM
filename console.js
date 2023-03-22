
/***************************
이 코드 실행 메뉴얼

1. 먼저 UTM에 로그인을 합니다.
2. UTM 로그인 후, 룰을 적용해 거부 패킷을 보여주는 화면으로 이동합니다.
3. console을 키고 '#i)' 코드를 실행해 indexedDB 생성 코드를 실행합니다, 만약 기존 indexedDB가 존재시 초기화 후 다시 실행합니다.
4. 이후 페이지 맨 밑에 추가된 '파일선택'을 통해 노래를 업로드 해 indexedDB에 노래를 저장합니다.
5. '#ii)' 코드를 실행해 10초마다 공격 탐지 프로세스를 실행합니다.
6. 만약 공격이 탐지 돼 노래가 재생될 경우, 그냥 맨 밑에 생긴 Audio 객체의 멈춤 버튼을 누르면 됩니다.

****************************/

// #i) /////////////////////////// 

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
    const audioURL = window.URL.createObjectURL(musicBlob);
    // window.URL.createObjectURL()도 지원 안 하는 브라우저일 경우 밑 코드 사용
    // const audioURL = window.webkitURL.createObjectURL(musicBlob);

    var audio = new Audio(audioURL);
    audio.controls = true;
    audio.play(); // 음악 파일 재생

    document.body.appendChild(audio);

    console.log('음악 파일 재생');
  };
};  

// 쿠키 만드는 초 단위로 만드는 함수
function setCookie(cookie_name, cookie_value, seconds) {
  var d = new Date();
  d.setTime(d.getTime() + (seconds * 1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cookie_name + "=" + cookie_value + ";" + expires + ";path=/";
}

// 이름으로 받은 쿠기가 있는지 확인하는 함수
function checkCookie(name) {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return true;
    }
  }
  return false;
}

// #####################################################
/////#ii) ↑↑↑↑위 코드들을 먼저 실행해 노래 파일을 업로드 후↑↑↑ 
/////#ii-2) ↓↓↓↓ 밑에 코드 실행 ↓↓↓↓
// #####################################################

// 요청할 URL, 네이버는 테스트용
let URL = 'https://www.naver.com/';
// 테스트용 예시
let attackArray = ['환율', 'value2', 'value3', 'etc...'];
// 쿠키 지속 시간, 초 단위
let COOKIE_TIME = 60;
// 찾을 주소 값을 갖고 있는 클래스 이름, 
let CLASS_NAME = ".stock_title"

// URL에서 비동기적으로 요청을 보내 받은 데이터에서 특정 클래스의 데이터를 가져오고
// 배열들을 비교해, 일치하는 게 있을 시 노래를 재생하는 코드
function getDataFromUrl() {
  let sipArray = [];

  // URL로 비동기 요청 전송
  fetch(URL)
    // 정상적으로 응답을 받으면, 그 응답을 response란 변수로 받은 후 text()로 바꿈
    .then(response => response.text())
    // 이후 얻은 response.text를 data란 매개 변수로 받고 
    .then(data => {
      // DOMParser()란 객체를 만들고
      const parser = new DOMParser();
      // response.text를 /text/html로 바꾼다
      const htmlDoc = parser.parseFromString(data, 'text/html');
      // 만든 thmlDoc이란 변수에서 '.foo'란 클래스 내 있는 데이터를 가져와 elemets에 저장한다
      const elements = htmlDoc.querySelectorAll(CLASS_NAME);
      
      elements.forEach(element => {
        sipArray.push(element.textContent.trim());
      });

      const matchingValue = sipArray.find(value => attackArray.includes(value));
      
      if (typeof matchingValue !== 'undefined' && !checkCookie("attack_" + matchingValue)){
        playMusicFromDB(1);
        setCookie("attack_" + matchingValue, matchingValue, COOKIE_TIME);
      }
    /*
      if (sipArray.some(value => attackArray.includes(value))) {
        playMusicFromDB(1);
        setCookie("attack_" + value, value, 20);
      }
    })
    */
    })
    .catch(error => {
      console.error('Error:', error);
    });
    // 배열 내 중복 값을 제거 하기 위해 집합으로 변경하고, 다시 배열로 바꿈
}

// 특정 시간마다 코드 실행, 시간 단위는 밀리초
setInterval(getDataFromUrl, 10000);

