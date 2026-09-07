const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.log("Укажите пароль:");
  console.log("node scripts/generate-password-hash.js ВашПароль");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

console.log("\nВаш хеш пароля:\n");
console.log(hash);
console.log("");