$ = require('jquery');

$(function() {
  let iconsObj = {};
  let colors = ['all', 'black', 'white', 'color'];
  let sizes = ['all', 's', 'm', 'l', 'xl', 'xxl'];
  let currentColor = colors[0];
  let currentSize = sizes[0];
  let currentKey = '';

  $.getJSON('icons.json', function(obj) {
    iconsObj = obj;
    showIcons(iconsObj);
  });

  $('.header__color').on('click', function() {
    let currentIndex = colors.indexOf(currentColor);
    colorIndex = currentIndex + 1;
    if (colorIndex == colors.length) {
      colorIndex = 0;
    }
    goColor(colors[colorIndex]);
  });

  $('.header__size').on('click', function() {
    let currentIndex = sizes.indexOf(currentSize);
    sizeIndex = currentIndex + 1;
    if (sizeIndex == sizes.length) {
      sizeIndex = 0;
    }
    goSize(sizes[sizeIndex]);
  });

  $('.search').on('keyup', function() {
    let key = $(this).val().toLowerCase();
    currentKey = $(this).val().toLowerCase();
    showIcons(iconsObj, key);
  });

  function goColor(neededColor) {
    currentColor = neededColor;
    for (var i = 0; i < colors.length; i++) {
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
  }

  function goSize(neededSize) {
    currentSize = neededSize;
    for (var i = 0; i < sizes.length; i++) {
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
  }

  goColor(currentColor);
  goSize(currentSize);
});

function compare(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  if (a.size < b.size) return -1;
  if (a.size > b.size) return 1;
  return 0;
}

function showIcons(iconsObj, searchKey) {
  let icons = document.createElement('div');
  let iconsArray = [];
  icons.classList.add('icons__list');
  let tempIconsObj = $.extend({}, iconsObj);

  function pushIcons(iconsArray, type, searchKey) {
    let tempArray = [];
    let isSearched = new RegExp(searchKey, 'g');
    let counter = 0;
    let nameRegExp = new RegExp(/([a-z]+_)(.*)(?=_.*)/, 'i');

    iconsArray.map(function(icon) {
      fileName = icon.name;
      name = icon.name.replace(/\.svg/, '');
      size = 'black';
      // console.log(name);
      // let nameWithoutSvg = icon.name.replace(/\.svg/, '');
      color = name.match(/[^_]+$/)[0];
      name = name.replace(/[^_]+$/, '');
      name = name.replace(/[_]+$/, '');
      size = name.match(/[^_]+$/)[0];
      name = name.match(nameRegExp)[2];

      if (isSearched.test(name)) {
        // console.log(nameWithoutSvg, isSearched, isSearched.test(nameWithoutSvg));
        // console.log(nameWithoutSvg, isSearched)
        tempArray.push({
          name: name,
          color: color,
          size: size,
          fileName: icon.name
        });
      }

      if (isSearched.test(name)) {
      }
    });
    return tempArray;
  }

  if (searchKey) {
    iconsArray = pushIcons(tempIconsObj.icons, 'icons', searchKey);
  } else {
    iconsArray = pushIcons(tempIconsObj.icons, 'icons');
  }

  iconsArray.sort(compare);
  iconsArray.map(function(icon) {
    let iconNode = document.createElement('div');
    let iconImage = document.createElement('img');
    let iconTitle = document.createElement('div');
    iconTitle.textContent = icon.name;
    // iconTitle.textContent = iconTitle.textContent.slice(5, -4);
    iconImage.src = '/icons/' + icon.fileName;
    iconImage.onload = function(e) {
      $(this).parent('.icon').removeClass('icon--inactive');
    };
    iconNode.classList.add('icon');
    iconNode.classList.add('icon--inactive');
    iconTitle.classList.add('icon__title');
    iconImage.classList.add('icon__image');
    console.log(icon.color, icon);
    iconNode.classList.add('icon--' + icon.size);
    iconNode.classList.add('icon--' + icon.color);
    // iconNode.classList.add('icon--' + icon.type);
    iconNode.append(iconImage);
    iconNode.append(iconTitle);
    icons.append(iconNode);
  });

  $('.icons').html(icons);
}
