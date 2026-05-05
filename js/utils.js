// Хелперы
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
function diffDays(d1, d2) {
  return Math.round((new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24));
}
function getAgeMonths(birthDate) {
  const now = new Date();
  const bd = new Date(birthDate);
  return (now.getFullYear() - bd.getFullYear()) * 12 + now.getMonth() - bd.getMonth();
}
function escapeHtml(text) {
  return String(text).replace(/[&<>"]/g, function(m) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m];
  });
}