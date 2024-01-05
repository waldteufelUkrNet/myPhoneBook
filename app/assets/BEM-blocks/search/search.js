$(document).ready(function(){
  // відкрити/закрити панель
  $('.header__language-cover-for-click').click(function(){
    $('.header__language-list').toggleClass('header__language-list_active');
  });

  // вибір мови
  $('.header__language-list img').click(function(){
    let lang = $(this).attr('data-lang');
    $('.header__selected-language-wrapper').attr('data-lang', lang);
    $('.header__selected-language-wrapper img:eq(0)').attr('src', 'assets/img/lang-' + lang + '.png');
    $('.header__language-list').removeClass('header__language-list_active');
  });

  // закриття, якщо клік мимо панелі
  $(document).click(function(e){
    if ( $(e.target)[0].className != 'header__language-list' &&
         $(e.target)[0].className != 'header__language-cover-for-click' ) {
      $('.header__language-list').removeClass('header__language-list_active');
    }
  });

  $('.header__menu-btn').click(function(){
    console.log(1)
  });
});