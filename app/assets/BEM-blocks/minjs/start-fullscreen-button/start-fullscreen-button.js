"use strict";

document.querySelector('.start-fullscreen-button').onclick = function () {
  document.body.requestFullscreen();
  var gifLoader = document.querySelector('.start-fullscreen-button__loader');
  gifLoader.classList.toggle('start-fullscreen-button__loader_active');
  setTimeout(function () {
    document.querySelector('.start-fullscreen-button-wrapper1').style.display = 'none';
    gifLoader.classList.toggle('start-fullscreen-button__loader_active');
  }, 2000); // document.body.innerHTML = '';
  // setTimeout(function(){
  //   document.exitFullscreen();
  // },10000);
};