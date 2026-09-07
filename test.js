const bcrypt = require("bcryptjs");

(async () => {
  const hash =
    "$2b$12$VTct1vjUZmAY/FhjaoO7DOgJXqh7MGSzKJRmjMQjQ9vMA2HwKzGr6";

  console.log(await bcrypt.compare("test", hash));
  console.log(await bcrypt.compare("admin123", hash));
})();