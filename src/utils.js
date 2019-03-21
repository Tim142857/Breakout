
//-----------------------    COOKIES
let createOrEdit = (name,value,days) => {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days * 24 * 60 * 60 * 1000));
    var expires = "; expires="+date.toGMTString();
  }
  else var expires = "";
  document.cookie = name + "=" + value+expires + "; path=/";
}
let erase = name => {
  createOrEdit(name,"",-1);
}

let get = name => {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

let flash = (text, interval, ctx) => {
  ctx.game.time.events.add(Phaser.Timer.SECOND * interval, function(){
    text.visible = !text.visible;
    flash(text, interval, ctx)
  }, this);
}

module.exports =  {
  centerGameObjects: (objects) => {
    objects.forEach(function (object) {
      object.anchor.setTo(0.5)
    })
  },
  cookies: {
    createOrEdit,
    get,
    erase,
  },
  texts: {
    flash
  }
}
