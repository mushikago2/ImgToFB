//FirstView Component Constructor
function FirstView() {
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();
	
	var _module = require('facebook');
	var _appid = "152874854922555";
    var _permissions = ['publish_stream'];
	var _publishing = false;
	
	var _img = Ti.UI.createImageView({
	    image:"images/summer_chihuahua.jpg"
	});
	
	_img.addEventListener("click", function(e){
	    loginToFacebook();
	})
	
	self.add(_img);
	
	//ログイン
	function loginToFacebook(){
	    _publishing = true;
	    _module.appid = _appid;
        _module.permissions = _permissions;
        if(_module.loggedIn === false) {
            var _alertDialog = Ti.UI.createAlertDialog({
                title : "Facebook",
                message : "Facebookにログインしますか？",
                buttonNames : ["ログイン", "キャンセル"]
            });
            _alertDialog.addEventListener('click', function(e) {
                if(e.index === 0) {
                    Ti.API.info("ログインを選択しました。");
                    _module.authorize();
                };
            });
            _alertDialog.show();
        }else{
            Ti.API.info("すでにログインしています。")
            if(_publishing){
                showPublishDialog();
            }
        }
	}
	
	_module.addEventListener('login', function(e) {
        if (e.success) {
            Ti.API.info("ログインしました。")
            
            //サムネイル取得
            var _filePath = "https://graph.facebook.com/" + _module.uid + "/picture";
            Ti.API.info("ユーザのサムネイル = " + _filePath);
            
            if(_publishing){
                showPublishDialog();
            }
            
        } else if (e.error) {
            _publishing = false;
        } else if (e.cancelled) {
            _publishing = false;
        }
    });
	
	
	//パブリッシュ
	function showPublishDialog(){
	    alert("投稿ダイアログ")
	}
	
	return self;
}

module.exports = FirstView;
