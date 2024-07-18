# alert_attack_on_UTM

Here are two version browser console JSfile, If your UTM work based on JSON, use "alert_attack_on_UTM_based_on_json.js", otherwise "alert_attack_on_UTM_based_on_class"
<br>
<strong>BUT!!!</strong>
<br>
"alert_attack_on_UTM_based_on_json.js" has more many functions !!!
<br><br>
# HOW TO USE 
1. Login the UTM
2. Move to the traffic page in UTM
3. Edit JavaScript code for your enviroment
4. Copy the JavaScript in "Alert_attack_on_UTM_based_on_json.js" or "Alert_attack_on_UTM_based_on_class"
   (★ Alert_attack_on_UTM_based_on_json.js has more many function ★)
5. Press 'F12' button and Move 'Console'
6. Paste the code on 'Console'
7. Press 'Enter' button
8. Select song file for alert
9. Done

★ functions ★
<br>
1. When specific sip or dip packet goes through UTM, Alert song and Show the packet information on console window 
2. Alert when Network scan or Port scan is suspected and Show the packet information on console window
3. When specific policy packet goes through UTM, Alert song and Show the packet information on console window
4. When UTM logout, Alert
5. When Alert is activated, Save the packet in IndexedDB
6. When Alerting is activated, The page turns to red color(Click any place to turn back) 

<br>
-----------한글------------

# 사용법

1. UTM에서 로그인을 합니다.
2. UTM에서 관제하는 트래픽 창으로 이동합니다.
3. JavaScript 코드를 자신의 UTM 환경에 맞춰서 변경합니다
4. 'F12'를 누르고 'Console'로 이동합니다
5. JavaScript 코드를 복사 후 'Console'에 붙여넣고 실행합니다
6. 파일 선택창이 나올텐데, 알람으로 사용할 음악 파일을 선택합니다
7. 끝입니다.


<br>
★ 기능들 ★
<br>

1. 특정 sip나 dip를 가진 패킷이 UTM에 들어올 경우, 알람을 울리고 패킷 정보를 Console 창에 띄웁니다.
2. 네트워크 스캔이나 포트 스캔이 의심될 때, 알람을 울리고 패킷 정보를 Console 창에 띄웁니다.
3. 특정 정책이 적용돼 차단되거나 허용된 패킷이 들어올 경우, 알람을 울리고 패킷 정보를 Console 창에 띄웁니다.
4. UTM이 로그아웃된 경우, 알람을 울림
5. 알람을 울릴 때의 패킷 정보를 IndexedDB에 저장함
6. 알람이 울릴 때, 페이지의 색깔이 붉은 색으로 변합니다(아무 곳이나 누르면 다시 원래대로 돌아옵니다)



<strong>/******
<br>
개발하다 마주친 문제 및 고생한 점과 해결법들 
<br>
******/</strong>

★문제 1 : <br>
보안 때문에 '인터넷'과 자바스크립트 외 '다른 개발 언어들'(파이썬, C, C++, C#) 등의 언어는 사용할 수 없음
--
(해결법) 전역할 때까지//
자바스크립트를 본격적으로 제대로 공부하기 시작함, 밖에서 공부하고 공부한 지식을 노트에 적어 가져와 개발 시작

★문제 2 : <br>
i) 공격 발생시 알람으로 노래를 틀어야하는 데, 로컬 파일에 직접 접근하는 것은 보안정책상 대부분의 브라우저에서 막혀있음
<br>
ii) URL을 통해 알람을 울리려 해도 CORS 문제에 직면
--
(해결법) 3주 소요//
IndexedDB 라는 것을 통해 DB를 만들고, 이 DB에 노래 파일을 업로드 후 사용하는 방법을 통해 노래 재생을 할 수 있음을 발견

★문제 3 : <br>
IndexedDB에 노래 파일 업로드가 안됨
--
(해결법) 1일 소요//
파일을 이진파일로 바꾸고 저장해야함을 배움

★문제 4 : <br>
특정 sip와 dip가 왔을 때 그것을 어떻게 공격이라 판단하고, 어떻게 일정 시간 내 딱 한번만 울리게 만들 것인가
--
(해결법) 7일 소요//
UTM URL의 'body'에서 sip와 dip 클래스 내 데이터를 가져와 특정 sip, dip 배열과 비교하고,
공격이라 판단되는 ip는 1시간 지속되는 'attack_ip'란 쿠키를 만들어, 쿠키가 있을 시 알람을 안 울리게 하는 방법을 고안

★문제 5 : <br>
10초마다 새로고침되는 UTM 관제 특징상, 어떻게 10초마다 새로운 관제 패킷을 가져올 것인가
--
(해결법) 4일 소요//
XMLHttpRequest를 공부해 사용해보다가, 더 편한 fetch와 setInterval()를 통해 10초마다 갱신 패킷을 가져옴

★문제 6 : <br>
i) UTM 페이지에서 테스트해보니, 관제 패킷들이 들어있을 'body'가 비어있는 html을 받음<br>
ii) 도대체 왜 html이 비어있는 지 원인 분석이 필요
--
(해결법) 2일 소요//
알고보니 ahnlab UTM은 서버에서 JSON 형태로 데이터를 HTML과 따로 받고 있었음 

★문제 7 : <br>
어떻게 ahnlab UTM 서버에서 JSON을 어떻게 가져와 사용할 것인가
--
(해결법) 3일 소요//
fetch로 서버에 따로 요청을 보내고, HTML의 body 내용을 가져와 JSON으로 파싱하고, 그 안에서 패킷들을 가져오기

★문제 8 : <br>
C&C 공격처럼 인트라넷 IP가 외부 IP로 향하는 공격은 어떻게 알람을 울릴 것인가?
--
(해결법) 2일 소요//
UTM은 이미 그런 공격들을 특정 정책을 통해 차단하고 있고, 방화벽 정책은 트래픽 패킷에 나오는 '정책 번호'를 통해 알 수 있으니
JSON에서 정책 번호를 가져와 알람을 울림

★문제 9 : <br>
UTM에서 fetch를 통해 URL을 가져올 때 필요한 인증, 인가 문제는 어떻게 해결할 것인가?
--
(해결법) 3일 소요//
복잡하게 생각할 필요 없이, 그냥 UTM 로그인 후 console에서 실행하면 로그인한 아이디 권한을 가지고 fetch가 가능

★문제 10 : <br>
특정 IP를 통해 공격을 알리는 건 한계가 있음, 진짜 네트워크 스캔 공격이 오면 어떻게 판단할 것인가?
--
(해결법) 2일 소요//
네트워크 스캔의 특징은 한 sip가 여러 개의 dip를 향하는 패킷이라는 것이므로, 10개 이상의 다른 dip를 향한 sip
패킷이 차단될 경우 공격이라 판단하게 함

★문제 11 : <br>
네트워크 스캔 공격을 판단하는 알고리즘 구성 및 속도 향상이 필요
--
(해결법) 7일 소요//
배열로 사용했다, 객체를 사용했다, 검색을 통해 최적화 방법을 구상하며 겨우 구현

★문제 12 : <br>
관제 룰이 바뀔 때마다 'F12 -> 네트워크'에 들어가 변경된 JSON URL을 가져와서 코드에 적용하는 데,<br> 
이런 귀찮은 과정을 안할 수 있게 만들자
--
(해결법) 1일 소요//
관제 룰이 들어있는 HTML 요소에 적힌 '관제 룰'을 가져와, encodeURIComponent()를 이용해 
URI 형태로 변환 후 JSON URL에 삽입해 fetch로 사용하기

★문제 13 : <br>
UTM의 관제가 시간이 지나면 세션 키가 만료되거나, 윈도우 메모리의 부족으로 자동으로 로그아웃되는 현상이 있을 때 알람을 울리게 만들자
--
(해결법) 4일 소요 //  
메모리가 가득차서 브라우저가 종료되는 건 브라우저 코드가 초기화 되는 것이기에, 자바스크립트로는 어쩔 수 없다.
그래도 window.addEventListner의 'beforeunload' 이벤트를 사용해 로그아웃시 알람을 울리고
window.performance.memory 객체를 이용해 페이지 메모리 사용량이 99% 이상 될 시 알람을 울리게 만들었다.

★문제 14 : <br>
페이지를 새로고침하면, 이전에 공격이 왔을 때 잘 알람을 울렸는지 기록을 찾아볼 수가 없음, 기록해야 할 필요성을 느낌 
--
(해결법) 1일 소요 //
공격 알람을 울릴 때, IndexedDB에 공격 패킷의 정보들을 기록하게 만듦

★문제 15 : <br>
포트 스캔 공격이 오면 어떻게 하지?
--
(해결법) 7일 소요 //
네트워크 스캔 알고리즘을 변형해서, 하나의 sip가 일정 개수 이상의 dport를 가질 경우 알람을 울리게 함

★문제 16 : <br>
공격이 왔을 때 최초의 공격 패킷의 시간을 방화벽에서 찾는 게 귀찮음, 공격이 올 경우 바로 첫 패킷의 시간과 기타 필요한 정보를 띄우게 만들자
--
(해결법) 3일 소요 //
UTM에서 받아오는 jsonArray는 시간이 역순을 돼 있기에, 다시 순서를 반대로 돌리고
공격을 탐지할 당시의 sip를 통해서, jsonArray의 첫 번째 sip의 시간과 정보들을 console에 띄움
차후 UTM 관제 페이지에서 반투명의 알람창에 정보를 보낼 수 있게, 전역 변수에 알람할 정보를 저장하는 것까지 함
*/

★문제 17 : <br>
매 10초마다 모든 jsonArray에 대해서 포트스캔, 네트워크 스캔을 하면 많은 자원을 사용하게 됨, 불필요한 계산을 줄일 방법이 없을까?
--
(해결법) 1일 소요 //
jsonArray를 받아올 때, jsonArray의 길이가 15 이상이 아니면 네트워크 스캔, 포트 스캔 검사를 안하게 만들어서, 불필요한 계산을 줄임



