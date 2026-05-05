async function ProductsPage() {
  const foods = await getAll('foods');
  const child = await getById('children', activeChildId);
  const ageMonths = getAgeMonths(child.birthDate);
  
  let html = '<h2>Каталог продуктов</h2>';
  html += '<input type="text" id="product-search" placeholder="Поиск...">';
  html += '<div class="product-grid">';
  foods.forEach(f => {
    const allowed = ageMonths >= f.minAgeMonths;
    html += `
      <div class="product-card allergen-${f.allergenLevel}" style="opacity:${allowed?1:0.5}">
        <b>${f.name}</b>
        <div>с ${f.minAgeMonths} мес.</div>
        <div>Аллергенность: ${f.allergenLevel}</div>
      </div>
    `;
  });
  html += '</div>';
  return html;
}