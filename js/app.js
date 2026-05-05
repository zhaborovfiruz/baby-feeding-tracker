// Глобальные переменные
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let activeChildId = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initDB();
    if (currentUser) {
      await loadChildren();
      document.getElementById('app').innerHTML = renderAppShell();
      setupRouting();
      navigateTo(window.location.hash.slice(1) || 'dashboard');
    } else {
      document.getElementById('app').innerHTML = LoginPage();
      document.getElementById('login-form').addEventListener('submit', handleLogin);
    }
  } catch (err) {
    document.getElementById('app').innerHTML = `<div class="error">Ошибка загрузки: ${err.message}</div>`;
  }
});

function renderAppShell() {
  return `
    <header class="app-header">
      <h1>🍼 Прикорм</h1>
      <div>
        <span id="child-selector"></span>
        <button class="btn-outline" id="logoutBtn">Выйти</button>
      </div>
    </header>
    <div class="page-content" id="page-container"></div>
    <nav class="bottom-nav">
      <a href="#dashboard" class="nav-item" data-route="dashboard">
        <span class="material-icons">home</span>
        Главная
      </a>
      <a href="#feeding" class="nav-item" data-route="feeding">
        <span class="material-icons">restaurant</span>
        Журнал
      </a>
      <a href="#calendar" class="nav-item" data-route="calendar">
        <span class="material-icons">calendar_month</span>
        План
      </a>
      <a href="#products" class="nav-item" data-route="products">
        <span class="material-icons">inventory_2</span>
        Продукты
      </a>
      <a href="#reports" class="nav-item" data-route="reports">
        <span class="material-icons">assessment</span>
        Отчёты
      </a>
    </nav>
  `;
}

function setupRouting() {
  window.addEventListener('hashchange', () => {
    const route = window.location.hash.slice(1) || 'dashboard';
    navigateTo(route);
  });
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    location.reload();
  });
}

async function navigateTo(route) {
  const container = document.getElementById('page-container');
  if (!container) return;
  
  // Активируем нужный пункт меню
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-route="${route}"]`);
  if (navItem) navItem.classList.add('active');
  
  // Проверяем, есть ли уже сохранённый ребёнок, иначе предложить создать
  if (!activeChildId && route !== 'child') {
    container.innerHTML = `<p>Сначала добавьте ребёнка в <a href="#child">профиле</a></p>`;
    return;
  }
  
  switch(route) {
    case 'dashboard':
      container.innerHTML = await DashboardPage();
      break;
    case 'feeding':
      container.innerHTML = await FeedingPage();
      break;
    case 'calendar':
      container.innerHTML = await CalendarPage();
      break;
    case 'products':
      container.innerHTML = await ProductsPage();
      break;
    case 'reports':
      container.innerHTML = await ReportsPage();
      break;
    case 'child':
      container.innerHTML = await ChildPage();
      break;
    default:
      container.innerHTML = '<p>Страница не найдена</p>';
  }
}