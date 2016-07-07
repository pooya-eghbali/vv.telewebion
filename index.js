var main_page_tpl = '\
<ul>\
  {{#each channels}}\
    <li><a href="#" class="tele-submenu" data-id="{{id}}"> {{name}} </a></li>\
  {{/each}}\
</ul>\
'
main_page_tpl = Handlebars.compile(main_page_tpl);
addon = {}

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
    var onMainCreate = function() {};
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

