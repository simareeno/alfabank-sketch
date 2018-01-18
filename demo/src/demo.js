$ = require('jquery');

let categories = [];

$(() => {
  let iconsObj = {};
  const colors = ['all', 'black', 'white', 'color'];
  const sizes = ['all', 's', 'm', 'l', 'xl', 'xxl'];
  let currentColor = 'all';
  let currentSize = 'all';
  let currentKey = '';

  $.getJSON('icons.json', obj => {
    iconsObj = obj;
    showIcons(iconsObj);
  });

  $('.header__color').on('click', () => {
    let currentIndex = colors.indexOf(currentColor);
    colorIndex = currentIndex + 1;
    if (colorIndex == colors.length) colorIndex = 0;
    goColor(colors[colorIndex]);
  });

  $('.header__size').on('click', () => {
    let currentIndex = sizes.indexOf(currentSize);
    sizeIndex = currentIndex + 1;
    if (sizeIndex == sizes.length) sizeIndex = 0;
    goSize(sizes[sizeIndex]);
  });

  $('.search').on('keyup', e => {
    let key = $('.search')
      .val()
      .toLowerCase();
    showIcons(iconsObj, key);
  });

  const goColor = neededColor => {
    currentColor = neededColor;
    for (let i = 0; i < colors.length; i++) {
      $('.header__color').removeClass('header__color--' + colors[i]);
      $('.icons').removeClass('icons--color-' + colors[i]);
    }
    $('.icons').addClass('icons--color-' + currentColor);
    $('.header__color').addClass('header__color--' + currentColor);

    if (currentColor === 'black') {
      $('.icons').addClass('icons--black');
    } else {
      $('.icons').removeClass('icons--black');
    }
  };

  const goSize = neededSize => {
    currentSize = neededSize;
    for (let i = 0; i < sizes.length; i++) {
      $('.header__size').removeClass('header__size--' + sizes[i]);
      $('.icons').removeClass('icons--size-' + sizes[i]);
    }
    $('.header__size').addClass('header__size--' + currentSize);
    $('.icons').addClass('icons--size-' + currentSize);
    if (currentSize !== 'all') {
      $('.header__size').text(currentSize);
    } else {
      $('.header__size').text('size');
    }
  };

  goColor(currentColor);
  goSize(currentSize);
});

const compare = (a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  if (a.size < b.size) return -1;
  if (a.size > b.size) return 1;
  return 0;
};

const showIcons = (iconsObj, searchKey) => {
  let icons = document.createElement('div');
  icons.classList.add('categories__list');
  let iconsArray = [];
  let tempIconsObj = $.extend({}, iconsObj);

  const pushIcons = (iconsArray, type, searchKey) => {
    let tempArray = [];
    let isSearched = new RegExp(searchKey, 'g');
    let counter = 0;
    let nameRegExp = new RegExp(/([a-z]+_)(.*)(?=_.*)/, 'i');

    iconsArray.map(icon => {
      fileName = icon.name;
      category = icon.category;
      if (categories.indexOf(category) === -1) categories.push(category);
      name = icon.name.replace(/\.svg/, '');
      color = name.match(/[^_]+$/)[0];
      name = name.replace(/[^_]+$/, '');
      name = name.replace(/[_]+$/, '');
      size = name.match(/[^_]+$/)[0];
      name = name.match(nameRegExp)[2];

      if (isSearched.test(name)) {
        tempArray.push({
          name: name,
          category: category,
          color: color,
          size: size,
          fileName: icon.name
        });
      }
      if (isSearched.test(name)) {
      }
    });

    return tempArray;
  };

  iconsArray = searchKey
    ? pushIcons(tempIconsObj.icons, 'icons', searchKey)
    : pushIcons(tempIconsObj.icons, 'icons');

  for (let category of categories) {
    const categoryNode = document.createElement('div');
    categoryNode.classList.add('category');
    const categoryName = document.createElement('div');
    categoryName.classList.add('category__name');
    const categoryIcons = document.createElement('div');
    categoryIcons.classList.add('category__icons');
    categoryName.textContent = category;
    icons.append(categoryNode);
    categoryNode.append(categoryName);
    categoryNode.append(categoryIcons);

    iconsArray
      .filter(icon => icon.category === category)
      .sort(compare)
      .map(icon => {
        const iconNode = document.createElement('div');
        const iconImage = document.createElement('img');
        const iconTitle = document.createElement('div');
        iconTitle.textContent = icon.name;
        iconImage.src = 'icons/' + icon.category + '/' + icon.fileName;
        iconImage.onload = e =>
          $(this)
            .parent('.icon')
            .removeClass('icon--inactive');
        iconNode.classList.add('icon');
        iconNode.classList.add('icon--inactive');
        iconTitle.classList.add('icon__title');
        iconImage.classList.add('icon__image');
        iconNode.classList.add('icon--' + icon.size);
        iconNode.classList.add('icon--' + icon.color);
        iconNode.append(iconImage);
        iconNode.append(iconTitle);
        categoryIcons.append(iconNode);
      });
  }

  $('.icons').html(icons);
};
