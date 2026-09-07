const bcrypt = require("bcryptjs");

(async () => {
  const password = "test"; // <-- сюда впиши пароль, с которым будешь входить

  const hash = await bcrypt.hash(password, 12);

  console.log("Пароль:", password);
  console.log("Хеш:", hash);
})();