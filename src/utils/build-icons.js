const path = require('path');
const fs = require('fs');

const INPUT_FOLDER = 'node_modules/arui-feather/icon';
const OUTPUT_FILE = 'public/icons.json';

const clean = new Promise(resolve => {
  fs.unlinkSync(OUTPUT_FILE);
  resolve();
});

const getCategories = new Promise((resolve, reject) => {
  const categories = fs
    .readdirSync(INPUT_FOLDER)
    .map(name => path.join(INPUT_FOLDER, name))
    .filter(source => fs.lstatSync(source).isDirectory());
  categories ? resolve(categories) : reject('Categories missing');
});

const getIcons = categories =>
  new Promise((resolve, reject) => {
    const icons = categories.reduce(
      (result, category, index, array) => {
        const total = result;
        total.icons = total.icons.concat(
          fs.readdirSync(category).map(icon => {
            return {
              name: icon,
              category: path.basename(category)
            };
          })
        );
        return total;
      },
      { icons: [] }
    );
    icons ? resolve(icons) : reject('Icons missing');
  });

clean
  .then(() => getCategories)
  .then(categories => getIcons(categories))
  .then(icons => fs.writeFileSync(OUTPUT_FILE, JSON.stringify(icons)))
  .catch(err => {
    if (err) throw err;
  });
