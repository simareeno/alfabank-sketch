$ = require('jquery');

$(function() {
  let iconsObj = {};
  let colors = ['all', 'color', 'white', 'colored'];
  let sizes = ['all', 's', 'm', 'l', 'xl'];
  let currentColor = colors[2];
  let currentSize = sizes[2];
  let currentKey = '';

  $.getJSON('icons.json', function(obj) {
    iconsObj = obj;
    showIcons(iconsObj, currentKey, currentColor, currentSize);
  });

  $('.header__color').on('click', function() {
    let currentIndex = colors.indexOf(currentColor);
    colorIndex = currentIndex + 1;
    if (colorIndex == colors.length) {
      colorIndex = 0;
    }
    currentColor = colors[colorIndex];
    for (var i = 0; i < colors.length; i++) {
      $(this).removeClass('header__color--' + colors[i]);
    }
    $(this).addClass('header__color--' + currentColor);

    if (currentColor === 'color') {
      $('.icons').addClass('icons--black');
    } else {
      $('.icons').removeClass('icons--black');
    }
    showIcons(iconsObj, currentKey, currentColor, currentSize);
  });

  $('.header__size').on('click', function() {
    let currentIndex = sizes.indexOf(currentSize);
    sizeIndex = currentIndex + 1;
    if (sizeIndex == sizes.length) {
      sizeIndex = 0;
    }
    currentSize = sizes[sizeIndex];
    for (var i = 0; i < sizes.length; i++) {
      $(this).removeClass('header__size--' + sizes[i]);
      $('.icons').removeClass('header__size--' + sizes[i]);
    }
    $(this).addClass('header__size--' + currentSize);
    $('.icons').addClass('header__size--' + currentSize);
    if (currentSize !== 'all') {
      $(this).text(currentSize);
    }

    showIcons(iconsObj, currentKey, currentColor, currentSize);
  });

  $('.search').on('keyup', function() {
    let key = $(this).val().toLowerCase();
    currentKey = $(this).val().toLowerCase();
    showIcons(iconsObj, key, currentColor, currentSize);
  });
});

function compare(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  if (a.size < b.size) return -1;
  if (a.size > b.size) return 1;
  return 0;
}

function showIcons(iconsObj, searchKey, colorKey, sizeKey) {
  let icons = document.createElement('div');
  let iconsArray = [];
  icons.classList.add('icons__list');
  let tempIconsObj = $.extend({}, iconsObj);

  if (searchKey) {
    iconsArray = pushIcons(tempIconsObj.icons, 'icons', searchKey);
  } else {
    iconsArray = pushIcons(tempIconsObj.icons, 'icons');
  }

  function pushIcons(iconsArray, type, searchKey) {
    let tempArray = [];
    let isSearched = new RegExp(searchKey, 'g');
    let counter = 0;

    iconsArray.map(function(icon) {
      let colorIsImportant = false;
      let sizeIsImportant = false;
      let keyIsOk = true;
      let colorIsOk = true;
      let sizeIsOk = true;

      fileName = icon.name;
      name = icon.name.replace(/.svg/, '');
      color = name.match(/[^_]+$/)[0];
      name = name.replace(/[^_]+$/, '');
      name = name.replace(/[_]+$/, '');
      size = name.match(/[^_]+$/)[0];
      name = name.replace(/[^_]+$/, '');
      name = name.replace(/[_]+$/, '');

      if (colorKey !== 'all') {
        colorIsImportant = true;
      }

      if (sizeKey !== 'all') {
        sizeIsImportant = true;
      }

      if (isSearched.test(name)) {
        keyIsOk = true;
      } else {
        keyIsOk = false;
      }

      if (colorIsImportant && color !== colorKey) {
        colorIsOk = false;
      }

      if (sizeIsImportant && size !== sizeKey) {
        sizeIsOk = false;
      }

      if (keyIsOk && colorIsOk && sizeIsOk) {
        tempArray.push({
          name: name,
          category: icon.category,
          color: color,
          size: size,
          fileName: icon.name
        });
      }
    });
    return tempArray;
  }

  iconsArray.sort(compare);

  iconsArray.map(function(icon) {
    let iconNode = document.createElement('div');
    let iconImage = document.createElement('img');
    let iconTitle = document.createElement('div');
    iconTitle.textContent = icon.name;
    // iconTitle.textContent = iconTitle.textContent.slice(5, -4);
    iconImage.src = '/icons/' + icon.category + '/' + icon.fileName;
    iconImage.onload = function(e) {
      $(this).parent('.icon').removeClass('icon--inactive');
    };
    iconNode.classList.add('icon');
    iconNode.classList.add('icon--inactive');
    iconTitle.classList.add('icon__title');
    iconImage.classList.add('icon__image');
    iconNode.classList.add('icon--' + icon.size);
    iconNode.classList.add('icon--' + icon.color);
    // iconNode.classList.add('icon--' + icon.type);
    iconNode.append(iconImage);
    iconNode.append(iconTitle);
    icons.append(iconNode);
  });

  $('.icons').html(icons);
}
