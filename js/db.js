const DB_NAME = 'BabyFeedTracker';
const DB_VERSION = 1;
let db;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Создаём хранилища объектов
      if (!db.objectStoreNames.contains('children')) {
        db.createObjectStore('children', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('foods')) {
        const store = db.createObjectStore('foods', { keyPath: 'id', autoIncrement: true });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('allergenLevel', 'allergenLevel', { unique: false });
      }
      if (!db.objectStoreNames.contains('feedingLogs')) {
        const store = db.createObjectStore('feedingLogs', { keyPath: 'id', autoIncrement: true });
        store.createIndex('childId', 'childId', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains('feedingEntries')) {
        const store = db.createObjectStore('feedingEntries', { keyPath: 'id', autoIncrement: true });
        store.createIndex('logId', 'logId', { unique: false });
      }
      if (!db.objectStoreNames.contains('reactions')) {
        const store = db.createObjectStore('reactions', { keyPath: 'id', autoIncrement: true });
        store.createIndex('childId', 'childId', { unique: false });
      }
      if (!db.objectStoreNames.contains('stools')) {
        const store = db.createObjectStore('stools', { keyPath: 'id', autoIncrement: true });
        store.createIndex('childId', 'childId', { unique: false });
      }
      if (!db.objectStoreNames.contains('plans')) {
        const store = db.createObjectStore('plans', { keyPath: 'id', autoIncrement: true });
        store.createIndex('childId', 'childId', { unique: false });
      }
    };
  });
}

// Универсальные функции для работы с хранилищами
function addRecord(storeName, data) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.add(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function updateRecord(storeName, data) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getAll(storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getByIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getById(storeName, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function deleteRecord(storeName, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Инициализация БД и наполнение продуктами при первом запуске
async function initDB() {
  await openDB();
  const foods = await getAll('foods');
  if (foods.length === 0) {
    for (let product of DEFAULT_PRODUCTS) {
      await addRecord('foods', product);
    }
  }
}