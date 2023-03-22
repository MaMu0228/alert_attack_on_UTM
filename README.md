# alert_attack_on_UTM
It catures packets which are you want to alert, and literally alert with song. 



-----------한글------------

안랩의 UTM과 같은 곳에서 10초마다 패킷을 관제할 때, 특정 srcIP의 패킷이 검출 될 경우 
노래를 틀어 알려주는 소스코드입니다.

**** '브라우저 console'에서 실행합니다.****

코드를 실행하기 전 

// 요청할 URL, UTM에서 10초마다 새로고침하는 페이지 URL을 넣으면 됨, 네이버는 테스트용

let URL = 'https://www.naver.com/';

// 알람을 울릴 특정 IP주소, '환율'은 네이버에서 테스트할 때를 위한 용도

let attackArray = ['환율', 'value2', 'value3', 'etc...'];

// 쿠키 지속 시간, 초 단위

let COOKIE_TIME = 60;

// 찾을 주소 값을 갖고 있는 클래스 이름, 

let CLASS_NAME = ".stock_title"

여기의 코드 값들을 바꿔주시기 바랍니다.

그 이후 

'i)'에 해당하는 코드를 먼저 실행해 indexedDB를 만들고, 현재 코드를 실행한 페이지 맨 밑으로 내려 알림으로 쓸 노래파일을 업로드 후

'ii)'에 해당하는 코드를 실행하면, 여러분이 설정한 COOKIE_TIME에 맞춰서 노래를 틀어 알람을 합니다.





