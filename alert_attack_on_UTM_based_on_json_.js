/********************************************************

// alert_attack_on_UTM_based_on_json

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

let COOKIE_TIME = 3600;


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

            
            
        })
    
}































































































































































































































































































