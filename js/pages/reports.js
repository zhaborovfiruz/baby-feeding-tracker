async function ReportsPage() {
  const logs = await getByIndex('feedingLogs', 'childId', activeChildId);
  const child = await getById('children', activeChildId);
  
  let reportHtml = '<h2>Отчёт по прикорму</h2>';
  reportHtml += `<p>${child.name}, возраст: ${getAgeMonths(child.birthDate)} мес.</p>`;
  reportHtml += '<table border="1" cellpadding="4" style="width:100%"><tr><th>Дата</th><th>Продукты</th><th>Реакция</th></tr>';
  for (let log of logs.sort((a,b)=>new Date(a.timestamp)-new Date(b.timestamp))) {
    const entries = await getByIndex('feedingEntries', 'logId', log.id);
    const foods = [];
    for (let entry of entries) {
      const food = await getById('foods', entry.foodId);
      foods.push(food ? food.name : '?');
    }
    // Реакции привязанные к log.id
    const reactions = await getByIndex('reactions', 'childId', activeChildId);
    // упрощённо – ищем реакции с feedingLogId == log.id
    const logReactions = reactions.filter(r => r.feedingLogId === log.id);
    reportHtml += `<tr><td>${formatDate(log.timestamp)}</td><td>${foods.join(', ')}</td><td>${logReactions.length ? logReactions.map(r=>r.reactionType).join(', ') : 'Нет'}</td></tr>`;
  }
  reportHtml += '</table>';
  reportHtml += '<button class="btn" onclick="window.print()">Распечатать</button>';
  return reportHtml;
}