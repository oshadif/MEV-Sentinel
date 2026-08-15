import fs from "fs";
const required = [
  "server/src/app.js",
  "server/src/mev/processor.js",
  "server/src/dex/decoder.js",
  "client/src/App.jsx",
  "database/schema.sql",
  "docker-compose.yml"
];
for (const f of required) {
  if (!fs.existsSync(f)) throw new Error(`Missing ${f}`);
}
console.log("Structure OK");
