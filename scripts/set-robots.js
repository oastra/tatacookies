const fs = require("fs");
const path = require("path");

const env = process.env.NEXT_PUBLIC_SITE_ENV || "prod";

const src = path.join(__dirname, `../public/robots.${env}.txt`);
const dest = path.join(__dirname, "../public/robots.txt");

fs.copyFileSync(src, dest);
console.log(`✅ Copied ${src} to ${dest}`);
