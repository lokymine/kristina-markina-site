const hash =
  "$2b$12$VTct1vjUZmAY/FhjaoO7DOgJXqh7MGSzKJRmjMQjQ9vMA2HwKzGr6";

const encoded = Buffer.from(hash, "utf8").toString("base64");

console.log(encoded);