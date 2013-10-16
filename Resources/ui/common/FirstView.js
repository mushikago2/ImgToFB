//FirstView Component Constructor
function FirstView() {
    //create object instance, a parasitic subclass of Observable
    var self = Ti.UI.createView();
    
    var _module = require('facebook');
    var _appid = "152874854922555";
    var _permissions = ['publish_stream'];
    var _publishing = false;
    var _publishPrivacy = {value:'ALL_FRIENDS'};
    
    var _img = Ti.UI.createImageView({
        image:"images/summer_chihuahua.jpg"
    });
    
    _img.addEventListener("click", function(e){
        loginToFacebook();
    });
    
    self.add(_img);
    
    var _actInd = Ti.UI.createActivityIndicator();
    _actInd.hide();
    self.add(_actInd);
    
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
            Ti.API.info("すでにログインしています。");
            if(_publishing){
                showPublishDialog();
            }
        }
    }
    
    _module.addEventListener('login', function(e) {
        if (e.success) {
            Ti.API.info("ログインしました。");
            
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
    
    
    //投稿範囲の選択ダイアログ表示
    function showPublishDialog(){
        var _publishDialog = Ti.UI.createOptionDialog();
        _publishDialog.setTitle("どのように投稿しますか？");
        _publishDialog.setOptions([
            "友達まで",
            "一般公開",
            "自分のみ",
            "キャンセル"
        ]);
        _publishDialog.setCancel(3);
        
        _publishDialog.addEventListener('click',function(event){
            if(event.index == 0){
                // 友達まで
                _publishPrivacy = {value:'ALL_FRIENDS'};
                publishImageToFacebook();
            }else if(event.index == 1){
                // 一般公開
                _publishPrivacy = {value:'EVERYONE'};
                publishImageToFacebook();
            }else if(event.index == 2){
                // 自分のみ
                _publishPrivacy = {value:'SELF'};
                publishImageToFacebook();
            }
                    
            if(event.cancel){
                _publishing = false;
            }
        });
            
        _publishDialog.show();
    }
    
    //投稿開始
    function publishImageToFacebook(){
        var _publishImg = _img.toImage();
        var _messageText = "これはテスト投稿です。";
        var _graphStr = "me/photos";
        var _postObj = {
            message: _messageText,
            picture: _publishImg,
            privacy : _publishPrivacy
        };
        var _doneDialog = Ti.UI.createAlertDialog();
        _doneDialog.setTitle("Facebookへ投稿");
        
        _module.requestWithGraphPath(
            _graphStr,
            _postObj,
            "POST",
            function(e) {
                if (e.success) {
                    _doneDialog.setMessage("自分のアルバムに投稿されました。"); 
                    _doneDialog.show();
                }else{
                    _doneDialog.setMessage("エラーが発生し投稿されませんでした。"); 
                    _doneDialog.show();
                }
                            
                _publishing = false;
                _actInd.hide();
            }
        );
            
        _actInd.show();
    }
    
    
    return self;
}

module.exports = FirstView;
