//FirstView Component Constructor
function FirstView() {
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();
	
	var _img = Ti.UI.createImageView({
	    image:"images/summer_chihuahua.jpg"
	});
	
	_img.addEventListener("click", function(e){
	    alert("この画像をFacebookへ投稿します。")
	})
	
	self.add(_img);
	
	return self;
}

module.exports = FirstView;
