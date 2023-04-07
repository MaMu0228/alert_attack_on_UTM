/********************************************************

// alert_attack_on_UTM_based_on_json v1.1

★★★★★★ Made by MaMu0228 ★★★★★★

※설명※
UTM 로그인 후, 관제 룰을 적용한 URL로 fetch를 보내 받아온 JSON의 데이터를 분석해서
공격이라 판단되는 패킷이 있으면 노래를 재생하는 프로그램

▣사용법▣
1. 변경하는 곳을 자기 UTM 설정에 맞춰 변경하기
2. 이 파일 전체 코드를 복사하고, console에 붙여넣기
3. 이후 올라오는 창을 통해 알람으로 쓸 노래 선택하기


********************************************************/

//↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 변경하는 곳 ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

// UTM 로그인 이후 룰을 적용한 다음 'F12 -> 네트워크'를 들어가서 JSON을 가져오는 URL을 적습니다.
let = URL = 'https://UTM-URL-AFTER-SET-RULE'

// UTM에서 공격이라 판단할 sip(source ip)와 dip(destination ip)를 적습니다.
let attackArray = ['at.ta.ck.ip', '123.23.234.123'];

// 공격이라 판단할 패킷에 적용된 정책 번호를 적습니다.
let attackPolicy = ['number'];

// 한 sip가 몇 개의 서로 다른 dip를 가질 때 공격이라 간주할 지 정하는 개수입니다. 
let ATTACK_COUNT = 10;


// 공격이라 간주한 sip가 알람을 울리고나서, 언제 다시 알람을 울릴지 정하는 쿠키, 초 단위입니다.
let COOKIE_TIME =  4000;


//↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑ 변경하는 곳 ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

// 공격 발생시 만들 오디오 객체 변수
let audio



function getDataFromURL() {
    let sipArray = [];
    let dipArray = [];
    let policyArray = [];

    fetch(URL)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(data, 'text/html');
            const elements = htmlDoc.body.innerText;

            if (typeof elements === 'undefined'){
                console.log("elements가 비어있습니다. ");
            }

            const objects = JSON.parse(elements);
            const objectList = Object.values(objects);
            
/////////////// attackPolicy 배열에 들어있는 IP가 있는 지 확인하는 부분 ///////////
            
            let matchingPolicy = [];

            policyArray = objectList[1].map(obj => obj.type).filter(type => type !== undefined);

            var set = new Set(policyArray);
            policyArray = [...set];

            matchingPolicy.push(...policyArray.filter(value => attackPolicy.includes(value)));

            for (let i =0; i <= matchingPolicy.length ; i++){
                if (typeof matchingPolicy[i] !== 'undefined' && !checkCookie("attack_정책_" + matchingPolicy[i])){
                    playMusicFromDB(1);
                    setCookie("attack_정책_" + matchingPolicy[i], matchingPolicy[i], COOKIE_TIME);
                    console.log("!!!!! 정책_" + matchingPolicy[i] + " 에 해당하는 공격이 감지 됐습니다. !!!");
                    console.log("attack_정책_" + matchingPolicy[i] + "쿠키를 만들었습니다.");
                }
            }

////////////// sipArray배열과 json.sip 주소를 가져와 비교해 처리하는 부분 ///////////////////

            sipArray = objectList[i].map(obj => obj.sip).filter(sip => sip !== undefined);

            var set = new Set(sipArray);
            sipArray = [...set];

            let matchingIpArray = [];

            matchingIpArray = sipArray.filter(value => attackArray.includes(value));

////////////// dipArray배열과 json.dip 주소를 가져와 비교해 처리하는 부분 ///////////////////            

            dipArray = objectList[1].map(obj => obj.dip).filter(dip => dip !== undefined);

            var set = new Set(dipArray);
            dipArray = [...set];

            matchingIpArray.push(...dipArray.filter(value => attackArray.includes(value)));

////////////// attackArray 배열에 들어있는 주소가 있을 경우, 쿠키 생성 및 알람을 울리는 부분 ///////////////////                 

            for (let i =0; i <= matchingIpArray.length ; i++){
                if (typeof matchingIpArray[i] !== 'undefined' && !checkCookie("attack_" + matchingIpArray[i])){
                    playMusicFromDB(1);
                    setCookie("attack_" + matchingIpArray[i], matchingIpArray[i], COOKIE_TIME);
                    console.log("!!!!! " + matchingIpArray[i] + " 에 해당하는 공격이 감지 됐습니다. !!!");
                    console.log("attack_" + matchingIpArray[i] + "쿠키를 만들었습니다.");
                }
            }

          
            checkRealAttack(objectList[1], sipArray);
          

            console.log(" alert_attack_on_UTM_based_on_json is on working ");
            
        })
        .catch(error => {
            console.error("getDataFromURL 실행중 에러가 발생: ", error);
        })
}

//###########################
/* 
id를 받아 indexedDB에 저장된 음악 데이터를 다시 가져와 실행하는 함수
*/
//###########################
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


//#############################
/* 
노래를 업로드 시, 이진 파일로 변경하는 함수
*/
//#############################
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

//############################
/* 
indexedDB에 음악 파일 저장
*/
//############################
function saveMusicToDB(musicBlob) {
  // music_store라는 오브젝트 스토어를 readwrite로 지정하고
  const transaction = db.transaction([DB_STORE_NAME], 'readwrite');
  // 오브젝트 스토어를 열고
  const objectStore = transaction.objectStore(DB_STORE_NAME);
  // 받은 musicBlob을 저장함
  const request = objectStore.put({ id:1,  music: musicBlob });

  request.onerror = function(event) {
    console.error('음악 파일 저장 오류:', event.target.errorCode);
  };

  request.onsuccess = function(event) {
    console.log('음악 파일 저장 완료');
    // ****** 노래 업로드 후 자동으로 10초마다 실행되는 부분 ******
    setInterval(getDataFromUrl, 10000);
    console.log('정상적으로 alert_attack_on_UTM_based_on_json이 실행되고 있습니다.')
  };
}

//#################################
/*
쿠키 만드는 초 단위로 만드는 함수
*/
//#################################
function setCookie(cookie_name, cookie_value, seconds) {
  var d = new Date();
  d.setTime(d.getTime() + (seconds * 1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cookie_name + "=" + cookie_value + ";" + expires + ";path=/";
}

//################################
/* 
이름으로 받은 쿠기가 있는지, 전체 쿠키들을 뒤져서 확인하는 함수
*/
//################################
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

//#########################################
/*
jsonArray와 jsonArray에서 중복을 제거한 sipArray를 인수로 받아, 10개 이상 다른 dip를 가진
sip를 공격이라 간주하고 노래를 트는 함수
*/
//#########################################
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

// 노래 업로드 시 이벤트 실행
fileInput.addEventListener('change', uploadMusic);



































































































































































































































































































