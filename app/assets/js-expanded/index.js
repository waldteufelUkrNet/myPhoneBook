// ↓↓↓ VARIABLES DECLARATION ↓↓↓
let keyForCompare;
let isMoreInfoOpen = false;
let list = document.getElementById('list');
// ↑↑↑ VARIABLES DECLARATION ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ EVENT HANDLERS ↓↓↓
document.addEventListener("DOMContentLoaded", ready);
document.getElementById('list-header-wrapper').addEventListener('click', waleSortType);
list.addEventListener('click', groupsAccordion);
list.addEventListener('click', showContactCard);
document.querySelector('.contact-card__close-btn').addEventListener('click', closeContactCard);
document.querySelector('.contact-card__more-info-button-wrapper').addEventListener('click', toggleMoreInfo);
// ↑↑↑ EVENT HANDLERS ↑↑↑

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓↓↓ FUNCTIONS DECLARATION ↓↓↓

/**
 * розраховує висоту області списків
 * запускає функцію sortDataBaseAlphabetical()
 * будує список людей
 */
function ready() {

  // ↓↓↓ визначаємо висоту списку ↓↓↓
    let firstSectionHeight  = document.getElementById('section1').offsetHeight;
    let secondSectionHeight = document.getElementById('section2').offsetHeight;
    let listHeight = 'calc( 100vh - ' + firstSectionHeight + 'px - '
                     + secondSectionHeight + 'px - 10px - 40px - 10px - 5px )';
    document.getElementById('list').style.height = listHeight;
  // ↑↑↑ визначаємо висоту списку ↑↑↑

  let tempArr = sortDataBaseAlphabetical();
  buildItemsList(tempArr, list);
}

/**
 * відслідковує клік на табах, підсвічує активний
 * очущує область контактів
 * викликає потрібні функції для перемальовування списку контактів
 * @param  {object} e об'єкт події click
 * @return {[type]}
 */
function waleSortType (e) {
  // перевірка на атрибут
  let sortType = e.target.dataset.sort;
  if ( !sortType ) return;

  // підсвітка вибору
  document.getElementsByClassName('list-header-item_active')[0].classList.remove('list-header-item_active');
  e.target.classList.add('list-header-item_active');

  list.innerHTML = '';

  let tempArr;
  switch(sortType) {
    case 'peoples':
      tempArr = sortDataBaseAlphabetical();
      buildItemsList(tempArr, list);
      break
    case 'groups':
      writeGroupHeaders();
      break
    case 'companies':
      tempArr = formOneGroup('установи');
      buildItemsList(tempArr, list);
      break
    case 'spec':
      tempArr = formOneGroup('спец.номери');
      buildItemsList(tempArr, list);
      break
    case 'help':
      tempArr = formOneGroup('допомога');
      buildItemsList(tempArr, list);
      break
  }
}

/**
 * відкидає з масиву phoneBook об'єкти-не людей, а людей сортує по алфавіту ( по ключу shortName )
 * @return {Arrey} масив об'єктів-людей, відсортованих за алфавітом
 */
function sortDataBaseAlphabetical () {

  keyForCompare = 'shortName';
  phoneBook.sort( compare );

  let resultArr = [];

  for ( let i = 0; i < phoneBook.length; i++ ) {

    if ( phoneBook[i].group == 'допомога' ||
         phoneBook[i].group == 'установи' ||
         phoneBook[i].group == 'спец.номери' ) continue;

    resultArr.push( phoneBook[i] );
  }
  return resultArr;
}

/**
 * формує заголовки та тіла елементів акордеону
 */
function writeGroupHeaders () {

  keyForCompare = 'group';
  phoneBook.sort( compare );

  // шукаємо назви груп та сортуємо їх у алфавітному порядку
  let setOfGroupNames = new Set();
  for ( let i = 0; i < phoneBook.length; i++ ) {
    setOfGroupNames.add(phoneBook[i].group);
  }

  // формуємо список в HTML
  setOfGroupNames.forEach(function (i){
    let item = document.createElement('div');
    item.classList.add('phone-book-group-header');
    item.setAttribute('data-group-name', i);
    item.innerHTML = i;
    list.insertAdjacentElement('beforeEnd', item);
    list.insertAdjacentHTML('beforeEnd', '<div class="phone-book-group-wrapper"></div>');
  });
}

/**
 * вибирає з масиву контактів phoneBook контакти з вказаною групою
 * @param  {string} groupName назва групи, яку потрібно вибрати з масиву контактів
 * @return {Array} масив об'єктів-контактів, які належать до однієї групи
 */
function formOneGroup (groupName) {
  return phoneBook.filter(function(a){
    return a.group == groupName;
  });
}

/**
 * вписує відсортовану групу контактів у потрібне місце сторінки
 * @param  {Array} arr масив відсортованих за певним алгоритмом контактів
 * @param  {object} target DOM-об'єкт, в який потрібно вставити відсортовані контакти
 */
function buildItemsList(arr, target) {
  for ( let i = 0; i < arr.length; i++ ) {

    let item = document.createElement('div');
    item.classList.add('phone-book-item');
    item.setAttribute('data-shortName', arr[i].shortName);

    let itemHTML = '<div class="phone-book-item__name-wrapper">\
                      <span class="phone-book-item__name">' + arr[i].shortName + '</span>\
                      <span class="phone-book-item__group">' + arr[i].group + '</span>\
                    </div>';
    item.innerHTML = itemHTML;
    target.insertAdjacentElement('beforeEnd', item);

    for ( let j = 0; j < arr[i].phone.length; j++ ) {

      let phone = document.createElement('div');
      phone.classList.add('phone-book-item__phone-wrapper');

      let phoneHTML;

      if ( arr[i].phone[j].operator ) {
        phoneHTML = '<a class="phone-book-item__phone" href="tel:' + arr[i].phone[j].usable + '">\
                       <span>' + arr[i].phone[j].visible + '</span>\
                       <img src="assets/img/' + arr[i].phone[j].operator + '.png" alt="' + arr[i].phone[j].operator + '.png">\
                     </a>';
      } else {
        phoneHTML = '<a class="phone-book-item__phone" href="tel:' + arr[i].phone[j].usable + '">\
                       <span>' + arr[i].phone[j].visible + '</span>\
                     </a>';
      }

      phone.innerHTML = phoneHTML;
      item.append(phone);
    }
  }

  // тут підрівнюю прокрутку, щоб заголовок групи не заїжджав за область видимості
  if ( list.scrollTop > target.previousElementSibling.offsetTop ) {
    target.previousElementSibling.scrollIntoView();
    list.scrollTop -= 3;
  }
}

/**
 * визначає поведінку акордеону груп контактів: показує/приховує вміст групи
 * @param  {object} e об'єкт події click
 */
function groupsAccordion (e) {

  if ( !e.target.dataset.groupName ) return;

  if (e.target.nextSibling.isOpen) {

    e.target.nextSibling.innerHTML = '';
    e.target.nextSibling.isOpen = false;

  } else {

    let tempArr = document.getElementsByClassName('phone-book-group-wrapper');
    for (let i = 0; i < tempArr.length; i++) {
      tempArr[i].innerHTML = '';
      tempArr[i].isOpen = false;
    }

    let oneGroupArr = formOneGroup(e.target.dataset.groupName);
    buildItemsList(oneGroupArr, e.target.nextSibling);
    e.target.nextSibling.isOpen = true;
  }
}

function showContactCard(e) {
  // кліки на групу та телефон обробляються окремо
  if ( e.target.closest('.phone-book-item__phone') || e.target.closest('.phone-book-item__group') ) return;

  let contact = e.target.closest('.phone-book-item');
  if ( !contact ) return;
  contact = contact.getAttribute('data-shortName');

  let obj = phoneBook.find(obj => obj.shortName == contact);

  // очищення усіх полів (після попередніх відкриттів)
  document.querySelector('.contact-card__add-photo-btn').classList.remove('contact-card__add-photo-btn_active');
  document.querySelector('.contact-card__photo').setAttribute('src', 'assets/img/user.png');

  document.querySelector('.contact-card__short-name').textContent = '';
  document.querySelector('.contact-card__group').textContent = '';
  document.querySelector('.contact-card__birthday').textContent = '';

  document.querySelector('.contact-card__more-info-button-wrapper').classList.remove('contact-card__more-info-button-wrapper_active');
  document.querySelector('.contact-card__address-wrapper').classList.remove('contact-card__address-wrapper_active');
  document.querySelector('.contact-card__full-name').textContent = '';
  document.querySelector('.contact-card__description').textContent = '';
  document.querySelector('.contact-card__address').textContent = '';

  document.querySelector('.contact-card__phones-wrapper').innerHTML = '';

  isMoreInfoOpen = false;
  document.querySelector('.contact-card__more-info-wrapper').style.height = '0px';
  document.querySelector('.contact-card__more-info-button-arrow').style.transform = 'rotateX(0deg)';

  document.querySelectorAll('.contact-card__social-item').forEach(function(item){
    item.classList.remove('contact-card__social-item_active');
    item.firstElementChild.setAttribute('href', '#');
  });

  // заповнення полів
  if (obj.photo) {
    document.querySelector('.contact-card__photo').setAttribute('src', 'assets/img/contacts-foto/' + obj.photo);
  } else {
    document.querySelector('.contact-card__add-photo-btn').classList.add('contact-card__add-photo-btn_active');
  }

  document.querySelector('.contact-card__short-name').textContent = obj.shortName;
  document.querySelector('.contact-card__group').textContent = obj.group;
  document.querySelector('.contact-card__birthday').textContent = obj.birthday;

  if ( obj.fullName || obj.description || obj.address ) {
    document.querySelector('.contact-card__more-info-button-wrapper').classList.add('contact-card__more-info-button-wrapper_active');
  }

  if ( obj.address ) {
    document.querySelector('.contact-card__address-wrapper').classList.add('contact-card__address-wrapper_active');
  }

  document.querySelector('.contact-card__full-name').textContent = obj.fullName;
  document.querySelector('.contact-card__description').textContent = obj.description;
  document.querySelector('.contact-card__address').textContent = obj.address;

  for( let i = 0; i < obj.phone.length; i++) {
    let elem = document.createElement('div');
    elem.classList.add('contact-card__prone-group');

    if ( obj.phone[i].operator ) {
      elem.innerHTML = '<div class="contact-card__phone-number">' + obj.phone[i].visible + '</div>\
                        <img class="contact-card__operator" src="assets/img/' + obj.phone[i].operator + '.png" alt="' + obj.phone[i].operator + '">\
                        <a class="contact-card__call-button" href="tel:' + obj.phone[i].usable + '">\
                          <img src="assets/img/phone.png" alt="phone">\
                        </a>\
                        <div class="contact-card__phone-note">' + obj.phone[i].note + '</div>';
    } else {
      elem.innerHTML = '<div class="contact-card__phone-number">' + obj.phone[i].visible + '</div>\
                        <a class="contact-card__call-button" href="tel:' + obj.phone[i].usable + '">\
                          <img src="assets/img/phone.png" alt="phone">\
                        </a>\
                        <div class="contact-card__phone-note">' + obj.phone[i].note + '</div>';
    }

    document.querySelector('.contact-card__phones-wrapper').appendChild(elem);
  }

  // формування кнопок соціалок
  if ( obj.social.telegram.pseudo ) {
    document.querySelector('.contact-card__social-item[data-socialtype="telegram"]').classList.add('contact-card__social-item_active');
    document.querySelector('.contact-card__social-item[data-socialtype="telegram"] .contact-card__social-link').setAttribute('href', 'tg://resolve?domain=' + obj.social.telegram.pseudo.slice(1) );
  } else if ( obj.social.telegram.phone ) {
    document.querySelector('.contact-card__social-item[data-socialtype="telegram"]').classList.add('contact-card__social-item_active');
    document.querySelector('.contact-card__social-item[data-socialtype="telegram"] .contact-card__social-link').setAttribute('href', 'tg://resolve?domain=USER');
  }

  if ( obj.social.viber ) {
    document.querySelector('.contact-card__social-item[data-socialtype="viber"]').classList.add('contact-card__social-item_active');
    document.querySelector('.contact-card__social-item[data-socialtype="viber"] .contact-card__social-link').setAttribute('href', 'viber://chat?number=' + obj.social.viber.slice(1) );
  }

  if ( obj.social.whatsapp ) {
    document.querySelector('.contact-card__social-item[data-socialtype="whatsapp"]').classList.add('contact-card__social-item_active');
    document.querySelector('.contact-card__social-item[data-socialtype="whatsapp"] .contact-card__social-link').setAttribute('href', 'whatsapp://send?phone=send?phone=' + obj.social.whatsapp );
  }

  if ( obj.social.skype ) {
    document.querySelector('.contact-card__social-item[data-socialtype="skype"]').classList.add('contact-card__social-item_active');
    document.querySelector('.contact-card__social-item[data-socialtype="skype"] .contact-card__social-link').setAttribute('href', 'callto:' + obj.social.skype );
  }

  if ( obj.social.email ) {
    document.querySelector('.contact-card__social-item[data-socialtype="email"]').classList.add('contact-card__social-item_active');
    document.querySelector('.contact-card__social-item[data-socialtype="email"] .contact-card__social-link').setAttribute('href', 'mailto:' + obj.social.email );
  }

  // показ попапа
  document.getElementById('section4').style.display = 'block';
  document.querySelector('.contact-card').classList.add('contact-card_active');
}

function closeContactCard (){
  document.getElementById('section4').style.display = 'none';
  document.querySelector('.contact-card').classList.remove('contact-card_active');
}

function toggleMoreInfo(e) {

  if ( !e.target.closest('.contact-card__more-info-button-wrapper_active') ) return;
  let wrapper = document.querySelector('.contact-card__more-info-wrapper');

  if ( !isMoreInfoOpen ) {
    isMoreInfoOpen = true;
    wrapper.style.height = 'auto';
    let height = wrapper.offsetHeight + 'px';
    wrapper.style.height = '0px';
    wrapper.style.transition = 'height 1s';

    // чому не працює без затримки?
    setTimeout(function(){
      wrapper.style.height = height;
    },10);

    document.querySelector('.contact-card__more-info-button-arrow').style.transform = 'rotateX(180deg)';
  } else {
    isMoreInfoOpen = false;
    wrapper.style.height = '0px';
    document.querySelector('.contact-card__more-info-button-arrow').style.transform = 'rotateX(0deg)'
  }
}

/**
 * здійснює лексикографічне сортування масиву об'єктів phoneBook за ключем, записаним в змінній keyForCompare
 * @param  {object} a об'єкт, елемент масиву
 * @param  {object} b об'єкт, елемент масиву
 * @return {[type]}
 */
function compare( a, b ) {
  if ( a[keyForCompare].toLowerCase() < b[keyForCompare].toLowerCase() ) {
    return -1;
  }
  if ( a[keyForCompare].toLowerCase() > b[keyForCompare].toLowerCase() ){
    return 1;
  }
  return 0;
}

// ↑↑↑ FUNCTIONS DECLARATION ↑↑↑