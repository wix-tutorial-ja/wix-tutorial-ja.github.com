window.onload = function() {
    // 外部リンクを新しいウィンドウで開く
    var links = document.querySelectorAll('a[href^=\"http://\"],a[href^=\"https://\"]');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (!link.href.match('http://wix-tutorial-ja.github.io/')) {
            link.onclick = function(event) {
                window.open(this.href, '_blank');
                event.preventDefault();
            }
        }
    }
    // サイド・ナビ・ブロックの開閉
    var menuBtns = document.querySelectorAll('a.snb');
    for (i = 0; i < menuBtns.length; i++) {
        var btn = menuBtns[i];
        btn.onclick = function() {
            this.classList.toggle('open');
            var menuId = 'sn-block-' + this.id.substr(7,4);
            var menu = document.getElementById(menuId);
            menu.classList.toggle('open');
        };
    }
}
