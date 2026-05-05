async function DashboardPage() {
  const child = await getById('children', activeChildId);
  if (!child) return '<p>Ребёнок не найден</p>';
  
  const ageMonths = getAgeMonths(child.birthDate);
  
  // Текущий активный план
  const plans = await getByIndex('plans', 'childId', activeChildId);
  const activePlan = plans.find(p => p.status === 'in_trial');
  let planHtml = '<p>Нет активного испытания</p>';
  if (activePlan) {
    const food = await getById('foods', activePlan.foodId);
    const start = new Date(activePlan.plannedStartDate);
    const end = new Date(activePlan.endObservationDate);
    const today = new Date();
    const totalDays = diffDays(start, end) + 1;
    const day = Math.min(diffDays(start, today) + 1, totalDays);
    planHtml = `
      <div class="card" style="background:#e8f5e9">
        <strong>Сейчас вводим:</strong> ${food.name}<br>
        <small>День ${day} из ${totalDays}</small>
        <div style="background:#eee; height:8px; border-radius:4px; margin-top:8px;">
          <div style="width:${(day/totalDays)*100}%; background:#4caf50; height:100%; border-radius:4px;"></div>
        </div>
        ${day >= totalDays ? '<button class="btn" onclick="completeTrial('+activePlan.id+')">Завершить испытание</button>' : ''}
      </div>
    `;
  }
  
  return `
    <h2>Привет, ${child.name}!</h2>
    <p>Возраст: ${ageMonths} месяцев</p>
    ${planHtml}
    <button class="btn" onclick="location.href='#feeding'">Записать кормление</button>
  `;
}

// Глобальная функция завершения испытания
window.completeTrial = async function(planId) {
  const plan = await getById('plans', planId);
  plan.status = 'completed';
  await updateRecord('plans', plan);
  alert('Продукт добавлен в безопасные!');
  location.reload();
};