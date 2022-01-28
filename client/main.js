document.addEventListener("DOMContentLoaded", () => {
  const socket = io.connect();

  const canvas = document.getElementById('bg');
  const coordinates = document.getElementById('coordinates');
  const onlineInt = document.getElementById('online');
  const ctx = canvas.getContext('2d');

  let colorUpdate = "#070709";

  // функция обновления онлайна
  function refreshOnline(online){
    onlineInt.innerHTML = "онлайн: "+ online;
  }

  // функция обновления координат
  function refreshCoordinates(x,y){
    coordinates.innerHTML = "X: " +x+ " Y: "+y;
  }




  // функция рисовки
  function draw(canvas,ctx, line){
    x = line.posX;
    y = line.posY;
    w = line.width;
    h = line.height;
    color = line.color;
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
  };

  canvas.onmousemove = (e) => {
    x = e.offsetX;
    y = e.offsetY;

    refreshCoordinates(x,y);
  };



  // регистрация нажатия 
  canvas.onmousedown = (e) => {
    // var rect = canvas.getBoundingClientRect();
    // x = (e.clientX - rect.left) | 0;
    // y = (e.clientY - rect.top) | 0;
    x = e.offsetX;
    y = e.offsetY;
    w = 1;
    h = 1;
    color = colorUpdate;

    data = {
      posX: x,
      posY: y,
      width: w,
      height: h,
      color: color
    };

    if (typeof e === 'object') {
      switch (e.button) {
        case 0:
          socket.emit('draw_line', data);
          break;
      }
    }


    // draw(canvas,ctx, data);
    // socket.emit('draw_line', data);
  };

  // рисует с сервера
  socket.on('draw_line', function (line) {
    draw(canvas,ctx,line);
  });

  socket.on('online', function (line) {
    refreshOnline(line.count);
    
  });

  document.getElementById('color1').onclick = function() {
    colorUpdate = "#2B2E31";
  };
  document.getElementById('color2').onclick = function() {
    colorUpdate = "#61676a";
  };
  document.getElementById('color3').onclick = function() {
    colorUpdate = "#a7adb1";
  };
  document.getElementById('color4').onclick = function() {
    colorUpdate = "#dde2e4";
  };
  document.getElementById('color5').onclick = function() {
    colorUpdate = "#fafafa";
  };
  document.getElementById('color6').onclick = function() {
    colorUpdate = "#951a21";
  };
  document.getElementById('color7').onclick = function() {
    colorUpdate = "#e91d2d";
  };
  document.getElementById('color8').onclick = function() {
    colorUpdate = "#e9968c";
  };
  document.getElementById('color9').onclick = function() {
    colorUpdate = "#e35b22";
  };
  document.getElementById('color10').onclick = function() {
    colorUpdate = "#f5831f";
  };
  document.getElementById('color11').onclick = function() {
    colorUpdate = "#fbc59a";
  };
  document.getElementById('color12').onclick = function() {
    colorUpdate = "#ffdd1a";
  };
  document.getElementById('color13').onclick = function() {
    colorUpdate = "#f8e6b7";
  };
  document.getElementById('color14').onclick = function() {
    colorUpdate = "#126936";
  };
  document.getElementById('color15').onclick = function() {
    colorUpdate = "#46b749";
  };
  document.getElementById('color16').onclick = function() {
    colorUpdate = "#c8e4bd";
  };
  document.getElementById('color17').onclick = function() {
    colorUpdate = "#1c505a";
  };
  document.getElementById('color18').onclick = function() {
    colorUpdate = "#75cedb";
  };
  document.getElementById('color19').onclick = function() {
    colorUpdate = "#0076a9";
  };
  document.getElementById('color20').onclick = function() {
    colorUpdate = "#192e62";
  };
  document.getElementById('color21').onclick = function() {
    colorUpdate = "#3b55a3";
  };
  document.getElementById('color22').onclick = function() {
    colorUpdate = "#aebeed";
  };
  document.getElementById('color23').onclick = function() {
    colorUpdate = "#492e72";
  };
  document.getElementById('color24').onclick = function() {
    colorUpdate = "#7e3f98";
  };
  document.getElementById('color25').onclick = function() {
    colorUpdate = "#d3bfe5";
  };
  document.getElementById('color26').onclick = function() {
    colorUpdate = "#901c53";
  };
  document.getElementById('color27').onclick = function() {
    colorUpdate = "#d70b8c";
  };
  document.getElementById('color28').onclick = function() {
    colorUpdate = "#efb1d4";
  };
  document.getElementById('color29').onclick = function() {
    colorUpdate = "#603913";
  };
  document.getElementById('color30').onclick = function() {
    colorUpdate = "#a97b50";
  };
  document.getElementById('color31').onclick = function() {
    colorUpdate = "#e2c095";
  };
  document.getElementById('color32').onclick = function() {
    colorUpdate = "#070709";
  };

});
