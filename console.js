////////   초기 IndexedDB 데이터베이스 생성 코드 

var dbName = 'alert-db';
var dbVersion = 1;
var request = indexedDB.open(dbName, dbVersion);

request.onerror = function(event) {
    console.log("cant open db", event.target.error);  
};

///////    테이블 만들기

request.onsuccess = function(event) {
    let db = event.target.result;
    let objectStore = db.createObjectStore("musicStore", {keyPath: "id"});    
}

///////    테이블을 열고 데이터 추가하기
request.onsuccess = function(event) {
    let transaction = db.transaction("musicStore", "readwrite");
    let objectStore = transaction.objectStore("musicStore");
    
}




























































