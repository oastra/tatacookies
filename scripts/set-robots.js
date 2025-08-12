const fs = require("fs");
const path = require("path");

const raw = process.env.VERCEL_ENV || "production"; // production | preview | development
const map = { production: "prod", preview: "preview", development: "dev" };
const env = map[raw];

const src = path.join(__dirname, `../public/robots.${env}.txt`);
const dest = path.join(__dirname, "../public/robots.txt");

if (!fs.existsSync(src)) throw new Error(`Missing ${src}`);
fs.copyFileSync(src, dest);
console.log(`✅ robots.txt set for ${env} (${raw})`);
