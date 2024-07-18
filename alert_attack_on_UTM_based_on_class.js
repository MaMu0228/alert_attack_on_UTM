
/***************************
  alert_attack_on_UTM_v1.0
    Made By MaMu0228
 
*메뉴얼
1. 먼저 UTM에 로그인을 합니다.
2. UTM 로그인 후, 룰을 적용해 관제하는 화면으로 이동합니다.
3. //★★★▼▼▼▼설정 하는 부분▼▼▼▼★★★ 의 밑 부분을 자기 UTM 관제에 맞춰 설정한 다음
4. 페이지 내 '모든 소스 코드를 복사'해서 console에 붙여넣고 실행 뒤, 노래를 선택하면 실행이 됩니다.
5. 만약 공격이 탐지 돼 노래가 재생될 경우, 그냥 맨 밑에 생긴 Audio 객체의 멈춤 버튼을 누르면 됩니다.
****************************/

//＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠
//▼▼▼▼▼▼▼사용자가 설정 바꾸는 부분▼▼▼▼▼▼▼

// 요청할 UTM의 관제 URL, 네이버는 테스트용
let URL = 'https://www.naver.com/';

// 탐지할 문자열 배열(소스IP + 목적지 IP 둘다 넣으면 됩니다)
let attackArray = ['환율', '증시', 'value3', 'etc...', 
                   '서울 도심 대규모 집회·행사에 교통정체 극심', '민주 "檢, 김용 재판서 혐의 입증 불리한 진술 삭제…조작수사"' 
                  , "테라 '20% 수익보장'에 투자금 50배 급증…美회계사도 속았다",
                  "'봄바람 살랑∼' 전국 벚꽃 명소마다 상춘객 '북적'", 
                   "저녁방송 메인뉴스 보기"];

// 찾을 src 주소 값을 갖고 있는 클래스 이름
let CLASS_NAME1 = ".issue"

// 찾을 목적지 주소 값을 갖고 있는 클래스 이름
let CLASS_NAME2 = '.news'

// 한 sip가 몇 개의 서로 다른 dip를 가질 때 공격이라 간주할 지 정하는 개수입니다. 
let ATTACK_COUNT = 10;


// 공격이라 간주한 sip가 알람을 울리고나서, 언제 다시 알람을 울릴지 정하는 쿠키, 초 단위입니다.
let COOKIE_TIME =  4000;


//▲▲▲▲▲▲▲▲사용자가 설정 바꾸는 부분▲▲▲▲▲▲▲▲
//＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠＠

let audio; // audio 객체용


/*#######################################
 # 함수들 정의영역
########################################*/

// 비동기적으로 URL에 fetch를 보내, 특정 클래스 내 데이터를 가져와
// attackArray와 비교하는 함수
function getDataFromUrl() {
  let sipArray = [];
  let dipArray = [];

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

/**************************************
CLASS_NAME1 처리해서 sipArray에 넣는 부분(소스 IP 처리 부분)
****************************************/
      
      // 만든 thmlDoc이란 변수에서 '.foo'란 클래스 내 있는 데이터를 가져와 elemets에 저장한다
      const elements = htmlDoc.querySelectorAll(CLASS_NAME1);
      
      if (typeof elements === 'undefined'){
        console.log("elements가 비어있습니다");
      }
      
      // for...of 구문 사용
      for (const element of elements) {
        // 디버깅 용
        console.log("*디버깅용* element값 : " + element.textContent.trim());
        sipArray.push(element.textContent.trim());
      }
      // 디버깅 용
      console.log("*디버깅용* CLASS_NAME1 넣은 sipArray: " + sipArray);    
      
      // sipArray에 들어있는 값들 중, attack_Array와 일치하는 값이 있는지 보고, 있을 시 matchingValue에 넣음
      let matchingValue = [];
      matchingValue = sipArray.filter(value => attackArray.includes(value));
      
/**************************************
CLASS_NAME2 처리해서 sipArray에 넣는 부분(소스 IP 처리 부분)
****************************************/

      // 만든 thmlDoc이란 변수에서 '.foo'란 클래스 내 있는 데이터를 가져와 elemets에 저장한다
      const elements2 = htmlDoc.querySelectorAll(CLASS_NAME2);
      
      if (typeof elements2 === 'undefined'){
        console.log("elements2가 비어있습니다");
      }
      
      // element2에 있는 값들을 element에 넣고, element 내 데이터를 공백 제거 후 저장
      for (const element of elements2) {
        // 디버깅용
        console.log("*디버깅용* element2값 : " + element.textContent.trim());
        dipArray.push(element.textContent.trim());
      }
      // 디버깅용
      console.log("*디버깅용* CLASS_NAME2 넣은 이후 dipArray: " + dipArray);    
      
      // dipArray와 attack_Array 비교 후 일치 값이 있을 시 일치 값을 matchingValue에 추가함
      matchingValue.push(...dipArray.filter(value => attackArray.includes(value)));

/**************************************
두 클래스(sip, dip)에서 가져와 저장한 배열을 공격 IP와 비교하는 부분
****************************************/     
      
      // 디버깅용
      console.log("### matchingValue :" + matchingValue);
      // 배열 내 중복 값을 제거 하기 위해 집합으로 변경하고, 다시 배열로 바꿈
      // 디버깅용
      console.log("###중복 제거 후### matchingValue :  " + matchingValue)
      
      for (let i = 0; i <= matchingValue.length; i++){
        if (typeof matchingValue[i] !== 'undefined' && !checkCookie("attack_" + matchingValue[i])){
          playMusicFromDB(1);
          setCookie("attack_" + matchingValue[i], matchingValue[i], COOKIE_TIME);
          console.log("attack_" + matchingValue[i] + "쿠키를 만들었습니다.");
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
    
}


/*
jsonArray와 jsonArray에서 중복을 제거한 sipArray를 인수로 받아, 10개 이상 다른 dip를 가진
sip를 공격이라 간주하고 노래를 트는 함수
*/
function checkRealAttack(jsonArray, sipArray) {

  // sipArray에 들어있는 sip들을 객체로 모두 초기화하기
  let attackObjs = sipArray.reduce((acc, cur) => ({...acc, [cur]:{}}), {});

  const attackCounts = {};

  for (const {sip, dip} of jsonArray){
    
    if (attackObjs.hasOwnProperty(sip)){
      attackCounts[sip] = (attackCounts[sip] || 0) + 1;
      
      if (!attackObjs[sip].hasOwnProperty(dip)){
        attackObjs[sip][dip] = {};

        if (attackCounts[sip] >= ATTACK_COUNT && !checkCookie("attack_" + sip)){
          playMusicFromDB(1);
          setCookie("attack_" + sip, sip, COOKIE_TIME);
          console.log(sip + " 주소로부터 공격이 의심됩니다. ");
        }
      }
    }
  }
};


// id를 받아 indexedDB에 저장된 음악 데이터를 다시 가져와 실행하는 함수
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

// 이름으로 받은 쿠기가 있는지, 전체 쿠키들을 뒤져서 확인하는 함수
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

/*#######################################
실행 코드들
########################################*/

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

const fileInput = document.createElement('input');
fileInput.type = 'file';

// 파일 선택 창 띄우기
fileInput.click();

fileInput.addEventListener('change', uploadMusic);

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
    // ****** 공격 탐지 함수가 실행되는 부분 ******
    setInterval(getDataFromUrl, 10000);
    console.log('정상적으로 alert_attack_on_UTM_v1.0이 실행되고 있습니다.')
  };
}



