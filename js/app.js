// ... (первые строки без изменений)

// В функции navigateTo после container.innerHTML = await ...Page() добавим вызов инициализации
async function navigateTo(route) {
  const container = document.getElementById('page-container');
  if (!container) return;
  
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-route="${route}"]`);
  if (navItem) navItem.classList.add('active');
  
  if (!activeChildId && route !== 'child') {
    container.innerHTML = `<p>Сначала добавьте ребёнка в <a href="#child">профиле</a></p>`;
    return;
  }
  
  // Очищаем контейнер
  container.innerHTML = '';
  
  let content = '';
  switch(route) {
    case 'dashboard':
      content = await DashboardPage();
      container.innerHTML = content;
      // Дашборд пока не требует отдельных инициализаций
      break;
    case 'feeding':
      content = await FeedingPage();
      container.innerHTML = content;
      initFeedingPage();  // добавим обработчики
      break;
    case 'calendar':
      content = await CalendarPage();
      container.innerHTML = content;
      initCalendarPage(); // добавим обработчики
      break;
    case 'products':
      content = await ProductsPage();
      container.innerHTML = content;
      break;
    case 'reports':
      content = await ReportsPage();
      container.innerHTML = content;
      break;
    case 'child':
      content = await ChildPage();
      container.innerHTML = content;
      initChildPage();    // добавим обработчики
      break;
    default:
      container.innerHTML = '<p>Страница не найдена</p>';
  }
}