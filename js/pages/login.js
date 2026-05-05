function LoginPage() {
  return `
    <div class="page-content" style="display:flex; align-items:center; justify-content:center;">
      <div class="card" style="width:100%">
        <h2>Вход в трекер</h2>
        <form id="login-form">
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" required>
          </div>
          <div class="form-group">
            <label>Пароль</label>
            <input type="password" name="password" required>
          </div>
          <button type="submit" class="btn">Войти</button>
        </form>
        <p>Или <a href="#" id="register-link">зарегистрироваться</a></p>
      </div>
    </div>
  `;
}

function handleLogin(e) {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  // Простая имитация: сохраняем пользователя без проверки
  const user = { email, name: email.split('@')[0] };
  localStorage.setItem('currentUser', JSON.stringify(user));
  location.reload();
}