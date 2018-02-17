const del = require('del');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const OUTPUT_IMAGES = 'src/images/icons';
const OUTPUT_JSON = 'src/icons.json';

const { getFilename, ICON_REGEXP } = require('./build-icons-utils');

console.info('⏳ Creating icons...');
console.time('In time');

// Folders to add
const CATEGORIES = [
  'action',
  'banking',
  'brand',
  'category',
  'currency',
  'entity',
  'file',
  'ui',
  'user'
];

class Icon {
  constructor(iconPath) {
    this.fileName = getFilename(iconPath);
    this.name = this.getName();
    this.category = this.getCategory(iconPath);
    this.size = this.getSize();
    this.color = this.getColor();
    this.colored = this.getColor() === 'color';
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
    if (color === 'white') return 'alfa-on-color';
    if (color === 'black') return 'alfa-on-white';
    return false;
  }
}

// Delete folders
const clean = new Promise(resolve => {
  del.sync([OUTPUT_IMAGES, OUTPUT_JSON]);
  resolve();
});

const build = () =>
  new Promise(resolve => {
    fs.mkdirSync(OUTPUT_IMAGES);
    const data = CATEGORIES.map(category => {
      return {
        name: category,
        items: glob
          .sync(`./node_modules/alfa-ui-primitives/icons/${category}/**/*.svg`)
          .map(file => {
            fs.copyFileSync(file, `${OUTPUT_IMAGES}/${path.basename(file)}`);
            return new Icon(file);
          })
      };
    });
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(data), 'utf8');
    resolve();
  });

// Main process. Clean icons & copies svgs & writes JSON.
Promise.all([clean, build()])
  .then(() => {
    console.timeEnd('In time');
  })
  .catch(err => {
    if (err) throw err;
  });
