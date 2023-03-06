const dbName = 'alert-db';
const dbVersion = 1;

// IndexedDB 오픈
const request = indexedDB.open(dbName, dbVersion);

// 데이터베이스 업그레이드 필요 시
request.onupgradeneeded = function(event) {
  const db = event.target.result;

  // Object Store 생성
  const objectStore = db.createObjectStore("musicStore", { keyPath: "id" });

  // 'title'란 이름의 Index 추가하는데, 이 인덱스는 'title'이란 필드를 이용해서 
  // 새로운 1, 2, 3 ,4 와 같은 인덱스를 만듦, unique가 false이므로 중복된 값들이 있어도 허용
  objectStore.createIndex("title", "title", { unique: false });
};

// 에러 핸들링
request.onerror = function(event) {
  console.error("Database error: ", event.target.errorCode);  
};

// 데이터베이스 연결 성공 시
request.onsuccess = function(event) {
  const db = event.target.result;

  // Transaction 시작
  const transaction = db.transaction("books", "readwrite");

  // Object Store 가져오기
  const objectStore = transaction.objectStore("books");

  // 데이터 추가
  objectStore.add({id: 1, title: "JavaScript: The Definitive Guide", author: "David Flanagan"});
  objectStore.add({id: 2, title: "Eloquent JavaScript", author: "Marijn Haverbeke"});
  objectStore.add({id: 3, title: "You Don't Know JS", author: "Kyle Simpson"});

  // Transaction 완료 시
  transaction.oncomplete = function(event) {
    console.log("Data added successfully");

    // Transaction 시작
    const transaction = db.transaction("books", "readonly");

    // Object Store 가져오기
    const objectStore = transaction.objectStore("books");

    // Index를 이용하여 데이터 가져오기
    const index = objectStore.index("title");
    const request = index.getAll();

    request.onsuccess = function(event) {
      const books = event.target.result;
      console.log(books);
    };
  };
};
