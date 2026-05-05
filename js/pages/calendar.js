async function CalendarPage() {
  const plans = await getByIndex('plans', 'childId', activeChildId);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  // Генерация календаря без изменений
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let cells = '';
  for (let i = 0; i < firstDay; i++) cells += '<div class="calendar-cell"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = formatDate(date);
    let cls = 'calendar-cell';
    const planStart = plans.find(p => formatDate(p.plannedStartDate) === dateStr && p.status === 'in_trial');
    const planNew = plans.find(p => formatDate(p.plannedStartDate) === dateStr && p.status === 'planned');
    if (planStart) cls += ' trial';
    else if (planNew) cls += ' new-product';
    if (formatDate(date) === formatDate(today)) cls += ' today';
    cells += `<div class="${cls}">${d}</div>`;
  }
  
  // Текущие планы
  let planList = '';
  for (let plan of plans) {
    const food = await getById('foods', plan.foodId);
    planList += `<div>${food.name}: ${plan.status} (${formatDate(plan.plannedStartDate)} - ${formatDate(plan.endObservationDate)})</div>`;
  }
  
  return `
    <h2>Календарь ввода продуктов</h2>
    <div class="calendar-grid">
      <div>Вс</div><div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div>
      ${cells}
    </div>
    <div class="card">
      <h3>Запланировать новый продукт</h3>
      <form id="plan-form">
        <div class="form-group">
          <label>Продукт</label>
          <select name="foodId" id="plan-food-select"></select>
        </div>
        <div class="form-group">
          <label>Дата начала</label>
          <input type="date" name="startDate" required>
        </div>
        <button type="submit" class="btn">Запланировать</button>
      </form>
    </div>
    <div class="card">${planList}</div>
  `;
}

async function initCalendarPage() {
  const select = document.getElementById('plan-food-select');
  const foods = await getAll('foods');
  foods.forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.name;
    select.appendChild(opt);
  });
  
  document.getElementById('plan-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const foodId = parseInt(e.target.foodId.value);
    const startDate = e.target.startDate.value;
    const endDate = formatDate(addDays(startDate, 4));
    
    const plans = await getByIndex('plans', 'childId', activeChildId);
    if (plans.some(p => p.status === 'in_trial')) {
      alert('Сначала завершите текущее испытание!');
      return;
    }
    await addRecord('plans', {
      childId: activeChildId,
      foodId,
      plannedStartDate: startDate,
      endObservationDate: endDate,
      status: 'planned'
    });
    alert('Продукт запланирован!');
    window.location.hash = '#calendar';
  });
}