async function FeedingPage() {
  const logs = await getByIndex('feedingLogs', 'childId', activeChildId);
  logs.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  let logHtml = '';
  for (let log of logs) {
    const entries = await getByIndex('feedingEntries', 'logId', log.id);
    const foodNames = [];
    for (let entry of entries) {
      const food = await getById('foods', entry.foodId);
      foodNames.push(food ? food.name : '?');
    }
    logHtml += `
      <div class="card">
        <div><strong>${formatDate(log.timestamp)}</strong> - ${log.mealType || 'Приём'}</div>
        <div>${foodNames.join(', ')}</div>
        <div>${log.note || ''}</div>
        <button onclick="deleteFeeding(${log.id})">Удалить</button>
      </div>
    `;
  }
  
  return `
    <h2>Журнал кормлений</h2>
    <button class="btn" onclick="openAddFeedingModal()">Добавить запись</button>
    <div id="feeding-list">${logHtml}</div>
    <div id="add-feeding-modal" class="modal">
      <!-- Здесь будет форма добавления, динамически заполняемая -->
    </div>
  `;
}

// Глобальные функции для модального окна добавления кормления
window.openAddFeedingModal = async function() {
  const modal = document.getElementById('add-feeding-modal');
  const foods = await getAll('foods');
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Новое кормление</h3>
      <form id="feeding-form">
        <div class="form-group">
          <label>Дата и время</label>
          <input type="datetime-local" name="timestamp" required>
        </div>
        <div class="form-group">
          <label>Тип приёма</label>
          <select name="mealType">
            <option value="breakfast">Завтрак</option>
            <option value="lunch">Обед</option>
            <option value="snack">Полдник</option>
            <option value="dinner">Ужин</option>
          </select>
        </div>
        <div class="form-group">
          <label>Продукты</label>
          <div id="food-checkboxes">
            ${foods.map(f => `<label><input type="checkbox" name="food_${f.id}"> ${f.name}</label><br>`).join('')}
          </div>
        </div>
        <div class="form-group">
          <label>Заметка</label>
          <textarea name="note"></textarea>
        </div>
        <button type="submit" class="btn">Сохранить</button>
        <button type="button" class="btn-outline" onclick="closeAddFeedingModal()">Отмена</button>
      </form>
    </div>
  `;
  modal.classList.add('active');
  document.getElementById('feeding-form').addEventListener('submit', handleAddFeeding);
};

window.closeAddFeedingModal = function() {
  document.getElementById('add-feeding-modal').classList.remove('active');
};

async function handleAddFeeding(e) {
  e.preventDefault();
  const form = e.target;
  const timestamp = form.timestamp.value;
  const mealType = form.mealType.value;
  const note = form.note.value;
  
  // Собираем выбранные продукты
  const checkboxes = form.querySelectorAll('[name^="food_"]:checked');
  const foodIds = Array.from(checkboxes).map(cb => parseInt(cb.name.split('_')[1]));
  
  if (foodIds.length === 0) {
    alert('Выберите хотя бы один продукт');
    return;
  }
  
  const logId = await addRecord('feedingLogs', {
    childId: activeChildId,
    timestamp,
    mealType,
    note,
    createdBy: currentUser.email
  });
  
  for (let foodId of foodIds) {
    await addRecord('feedingEntries', {
      logId,
      foodId,
      quantity: 0, // упрощено
      texture: 'puree'
    });
  }
  
  closeAddFeedingModal();
  window.location.hash = '#feeding';
}

window.deleteFeeding = async function(logId) {
  if (confirm('Удалить запись?')) {
    await deleteRecord('feedingLogs', logId);
    // удалить связанные entries
    const entries = await getByIndex('feedingEntries', 'logId', logId);
    for (let e of entries) await deleteRecord('feedingEntries', e.id);
    location.reload();
  }
};