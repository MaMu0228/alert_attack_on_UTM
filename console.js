////////   초기 IndexedDB 데이터베이스 생성 코드 

var dbName = 'alert-db';
var dbVersion = 1;
var request = indexedDB.open(dbName, dbVersion);

request.onerror = function(event) {
    console.log("cant open db", event.target.errorCode);  
};

///////    테이블 만들기

request.onsuccess = function(event) {
    let db = event.target.result;
    let objectStore = db.createObjectStore("musicStore", {keyPath: "id"});    
}

///////    테이블을 열고 데이터 추가하기
request.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction("musicStore", "readwrite");
    let objectStore = transaction.objectStore("musicStore");
    let request = objectStore.add({id:1, name:"chan", age:26});
}

////// 테이블 열고 데이터 가져오기
request.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction("musicStore", "readonly");
    let objectStore = transaction.objectStore("musicStore");
    let request = objectStore.get(1);
}


























































