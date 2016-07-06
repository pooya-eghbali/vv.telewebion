var main_page = '\
<ul>\
  <li><a href="#" class="tele-submenu" data-sub="ch4m"> شبکه ۴ </a></li>\
</ul>\
'

var ch4m = '\
<ul>\
  <li><a href="#" class="tele-play-source" data-source="ch4-q300"> شبکه چهار - کیفیت ۳۰۰ </a></li>\
  <li><a href="#" class="tele-play-source" data-source="ch4-q500"> شبکه چهار - کیفیت ۵۰۰ </a></li>\
</ul>\
'

var submenus = {
  ch4m: {
    src       : ch4m,
    title     : "شبکه ۴",
    previous  : "main"
  }
}

var constructor = function(){
  return main_page;
}

var media = {
  "ch4-q300": {
    url       : "http://s12.telewebion.com:1935/live-secure/tv4-300k.stream/playlist.m3u8",
    title     : "شبکه ۴",
    previous  : "ch4m",
    id        : "tele-ch4-300",
    type      : "application/x-mpegURL"
  },
  "ch4-q500": {
    url       : "http://s12.telewebion.com:1935/live-secure/tv4-500k.stream/playlist.m3u8",
    title     : "شبکه ۴",
    previous  : "ch4m",
    id        : "tele-ch4-500",
    type      : "application/x-mpegURL"
  },
}

getPrevious = function(previous){
  if(previous === "main") {
    return addon.main;
  }
  var sub = submenus[previous];
  var constructor = function(){
    return sub.src;
  }
  var previous = getPrevious(sub.previous);
  var page = {
    id          : 'tele-sub',
    title       : sub.src,
    addon       : 'vv.pouya.telewebion',
    constructor : constructor,
    blur        : true,
    onCreate    : onSubCreate,
    previous    : previous
  }
  return page;
}

onMainCreate = function(){
  $(".tele-submenu").click(function(){
    var sub = $(this).data("sub");
    var sub = submenus[sub];
    var constructor = function(){
      return sub.src;
    }
    var previous = getPrevious(sub.previous);
    var page = {
      id          : 'tele-sub',
      title       : sub.src',
      addon       : 'vv.pouya.telewebion',
      constructor : constructor,
      blur        : true,
      onCreate    : onSubCreate,
      previous    : previous
    }
    vv.page(page);
  })
}

onSubCreate = function(){
  $(".tele-play-source").click(function(){
    var source = $(this).data("source");
    vv.play({
      id        : media[source].id,
      url       : media[source].url,
      type      : media[source].type,
      title     : media[source].title,
      addon     : "vv.pouya.telewebion",
      previous  : getPrevious(media[source].previous)
    });
  })
}

addon = {}
addon.main = {
  id          : 'tele-main',
  title       : 'شبکه های ایران',
  addon       : 'vv.pouya.telewebion',
  constructor : constructor,
  blur        : true,
  onCreate    : onCreate
}

vv.page(addon.main);
