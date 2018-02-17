const del = require("del");
const fs = require("fs");
const glob = require("glob");
const path = require("path");

const OUTPUT_FILE = "src/icons.json";

const { getFilename, ICON_REGEXP } = require("./build-icons-utils");

console.info("⏳ Creating icons...");
console.time("In time");

// Folders to add
const CATEGORIES = [
  "action",
  "banking",
  "brand",
  "category",
  "currency",
  "entity",
  "file",
  "ui",
  "user"
];

class Icon {
  constructor(iconPath) {
    this.fileName = getFilename(iconPath);
    this.name = this.getName();
    this.category = this.getCategory(iconPath);
    this.size = this.getSize();
    this.color = this.getColor();
    this.colored = this.getColor() === "color";
  }

  // Category
  getCategory(iconPath) {
    return path.basename(path.dirname(iconPath));
  }

  // Name
  getName() {
    return this.fileName.match(ICON_REGEXP)[3];
  }

  // Size
  getSize() {
    return this.fileName.match(ICON_REGEXP)[5];
  }

  // Color
  getColor() {
    return this.fileName.match(ICON_REGEXP)[7];
  }

  // Color in arui fashion
  getAruiColor() {
    let color = this.getColor();
    if (color === "white") return "alfa-on-color";
    if (color === "black") return "alfa-on-white";
    return false;
  }
}

// Get icons
const iconsObj = {
  categories: []
};

CATEGORIES.forEach(folder => {
  const folderArray = [];
  glob
    .sync(`./node_modules/alfa-ui-primitives/icons/${folder}/**/*.svg`)
    .map(file => folderArray.push(new Icon(file)));
  iconsObj.categories.push(folderArray);
});

// Delete folders
const clean = new Promise(resolve => {
  del.sync(OUTPUT_FILE);
  resolve();
});

const writeJSON = () =>
  new Promise(resolve => {
    console.log(JSON.stringify(iconsObj));
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(iconsObj), "utf8");
    resolve();
  });

// Main process. Clean icons & writes JSON.
Promise.all([clean, writeJSON()])
  .then(() => {
    console.info(`Created: ${iconsObj.icons.length} icons`);
    console.timeEnd("In time");
  })
  .catch(err => {
    if (err) throw err;
  });
