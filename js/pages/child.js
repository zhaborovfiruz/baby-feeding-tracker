async function ChildPage() {
  const children = await getAll('children');
  const child = children.find(c => c.id === activeChildId) || {};
  
  return `
    <h2>Профиль ребёнка</h2>
    <form id="child-form">
      <div class="form-group">
        <label>Имя</label>
        <input type="text" name="name" value="${escapeHtml(child.name || '')}" required>
      </div>
      <div class="form-group">
        <label>Дата рождения</label>
        <input type="date" name="birthDate" value="${child.birthDate ? formatDate(child.birthDate) : ''}" required>
      </div>
      <div class="form-group">
        <label>Тип вскармливания до прикорма</label>
        <select name="feedingType">
          <option value="breast" ${child.feedingType==='breast'?'selected':''}>Грудное</option>
          <option value="formula" ${child.feedingType==='formula'?'selected':''}>Искусственное</option>
          <option value="mixed" ${child.feedingType==='mixed'?'selected':''}>Смешанное</option>
        </select>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" name="allergyFamily" ${child.allergyFamily?'checked':''}> Аллергии у родителей
        </label>
      </div>
      <button type="submit" class="btn">Сохранить</button>
    </form>
  `;
}

// Инициализация обработчиков для страницы профиля
function initChildPage() {
  const form = document.getElementById('child-form');
  if (form) {
    form.addEventListener('submit', handleChildFormSubmit);
  }
}

// Обработчик сохранения профиля
async function handleChildFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = {
    name: form.name.value,
    birthDate: form.birthDate.value,
    feedingType: form.feedingType.value,
    allergyFamily: form.allergyFamily.checked
  };
  
  if (activeChildId) {
    data.id = activeChildId;
    await updateRecord('children', data);
  } else {
    const newId = await addRecord('children', data);
    activeChildId = newId;
  }
  alert('Профиль сохранён');
  window.location.hash = '#dashboard';
}