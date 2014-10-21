html5 canvas 下楼梯小游戏
===========

### 可以在微信中使用，调用微信浏览器自带的分享功能
    //分享到朋友
    function shareFriend() {
        WeixinJSBridge.invoke('sendAppMessage',{
            "appid": Game.appid,
            "img_url": Game.imgUrl,
            "img_width": "200",
            "img_height": "200",
            "link": Game.lineLink,
            "desc": Game.descContent,
            "title": Game.shareTitle
        }, function(res) {
            //_report('send_msg', res.err_msg);
        })
    }
    
    //分享到朋友圈
    function shareTimeline() {
        WeixinJSBridge.invoke('shareTimeline',{
        	"appid": Game.appid,
            "img_url": Game.imgUrl,
            "img_width": "200",
            "img_height": "200",
            "link": Game.lineLink,
            "desc": Game.descContent,
            "title": Game.shareTitle
        }, function(res) {
               //_report('timeline', res.err_msg);
        });
}
