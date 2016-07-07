var main_page_tpl = '\
<ul>\
  {{#each channels}}\
    <li><a href="#" class="tele-submenu" data-id="{{id}}"> {{name}} </a></li>\
  {{/each}}\
</ul>\
'
var sub_page_tpl = '\
<ul>\
  {{#each links}}\
    <li><a href="#" class="tele-play-link" data-link="{{link}}" data-name="{{name}}" data-bitrate="{{bitrate}}" data-id="{{id}}"> {{name}} کیفیت {{bitrate}} </a></li>\
  {{/each}}\
</ul>\
'
main_page_tpl = Handlebars.compile(main_page_tpl);
sub_page_tpl = Handlebars.compile(sub_page_tpl);
var addon = {}

async.waterfall([
  function(callback) {
    // get security token (unnecessary!)
    $.get('http://m.s1.telewebion.com/op/op?action=getSecurityToken', function(res, err) { callback(null, res) })
  },
  function(token, callback) {
    // get channel list
    $.getJSON('http://www.telewebion.com/mock/channel.json?nginxcache', function(res, err) { callback(null, res, token) })
  },
  function(channels, token, callback) {
    var main_page = main_page_tpl({channels: channels});
    var constructor  = function() { return main_page };
    var onMainCreate = function() {
      $('.tele-submenu').off().click(function(){
        var id = $(this).data("id");
        var name = $(this).text();
        addon.createSubMenu(id, name);
      })
    };
    
    addon.main = {
      id            : 'tele-main',
      title         : 'شبکه های ایران',
      addon         : 'vv.pouya.telewebion',
      constructor   : constructor,
      onAfterCreate : onMainCreate,
      rtl           : true,
    }
    
    vv.page(addon.main);
  }
])

addon.createSubMenu = function(id, name) {
  async.waterfall([
    function(callback) {
      // get security token (unnecessary!)
      $.get('http://m.s1.telewebion.com/op/op?action=getSecurityToken', function(res, err) { callback(null, res) })
    },
    function(token, callback) {
      // get channel info
      $.getJSON('http://m.s1.telewebion.com/op/op?action=getChannelLinks&ChannelID='+id, function(res, err) { callback(null, res, token) })
    },
    function(links, token, callback) {
      links = _.map(links, function(o) { o.name = name; o.id = id; return o });
      var src = sub_page_tpl({links: links});
      var constructor  = function() { return src };
      var onSubCreate = function() {
        $('.tele-play-link').off().click(function(){
          var link = $(this).data("link");
          var id   = $(this).data("id").toString() + $(this).data("bitrate");
          var name = $(this).data("name");
          vv.play({
            id        : id,
            url       : link,
            type      : "application/x-mpegURL",
            title     : name,
            addon     : "vv.pouya.telewebion",
            previous  : addon.current,
            live      : true,
          });
        })
      };
      
      addon.current = {
        id            : 'tele-sub',
        title         : name,
        addon         : 'vv.pouya.telewebion',
        constructor   : constructor,
        onAfterCreate : onSubCreate,
        rtl           : true,
        previous      : addon.main,
      }
      
      vv.page(addon.current);
    }
  ]);
}
