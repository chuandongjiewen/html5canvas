window.onload = function(){
	Game.init();
}

/**
 * 继承父类的方法
 */
function base(derive,baseSprite,baseArgs){
	baseSprite.apply(derive,baseArgs);
	for(prop in baseSprite.prototype){
		var proto = derive.constructor.prototype;
		if(!proto[prop]){
			proto[prop] = baseSprite.prototype[prop];
		}
		proto[prop][SUPER] = baseSprite.prototype;
	}
}
function debug(msg){
	console.log(msg);
}

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
function shareTimeline() {
    WeixinJSBridge.invoke('shareTimeline',{
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
function shareWeibo() {
    WeixinJSBridge.invoke('shareWeibo',{
        "content": Game.descContent,
        "url": Game.lineLink,
    }, function(res) {
        //_report('weibo', res.err_msg);
    });
}
// 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    // 发送给好友
    WeixinJSBridge.on('menu:share:appmessage', function(argv){
        shareFriend();
    });
    // 分享到朋友圈
    WeixinJSBridge.on('menu:share:timeline', function(argv){
        shareTimeline();
    });
    // 分享到微博
    WeixinJSBridge.on('menu:share:weibo', function(argv){
        shareWeibo();
    });
}, false);

function Floor0(x,y){
	this.width = 100;
	this.height = 20;
	this.x = x;
	this.y = y;
}

function Person(x,y){
	this.width = 40;
	this.height = 50
	this.x = x;
	this.y = y;
}


var Game = {
	width : 320,
	height : 480,
	canvas : null,
	context : null,
	timer : null, //定时器
	imageArr : [
		'image/back.png',
		'image/floor0.png',
		'image/floor1.png',
		'image/floor2.png',
		'image/floor3.png',
		'image/person.png'
	],
	imageLoadedNum : 0,

	floorList : [],
	floorVelocity : 0.0005,
	floorSpeed : 1,
	floorMaxSpeed : 25,

	person : null,
	personFloor : null,//人目前站立的floor
	personFallSpeed : 5,
	personIsFalling : false,
	personSumSteps : 4, //按一次方向键走的步数
	personCurSteps : 0, //当前已经走了多少步
	curDirection : "none", //保存按键的方向，值为：none, left, right，没有按键则为none
	preDirection : "none", //保存按键之后，保持的方向

	score : 0, //当前得分
	isGameOver : false,

	// 微信分享
	imgUrl : 'http://183.61.39.198/downfloor/image/back.png',
	lineLink : 'http://183.61.39.198/downfloor/index.html',
	descContent : "我在下楼梯比赛中！",
	hareTitle : '我们比比分～',
	appid : '',

	loadImg : function(callback){
		var self = this;
		var len = self.imageArr.length;
		for(var i = 0; i < len; i++){
			var img = new Image();
			img.src = self.imageArr[i];
			img.onload = function(){
				self.imageLoadedNum ++;
				if(self.imageLoadedNum == len){
					callback();
				}
			}
		}
	},
	init : function(){
		var self = this;
		console.log('init');
		self.canvas = document.getElementById("game");
		self.context = self.canvas.getContext("2d");
		self.initFloor();
		self.loadImg(function(){
			self.run();
		});
	},
	reset : function(){
		var self = this;
		self.floorList = [];
		self.curDirection = "none";
		self.preDirection = "none";
		self.score = 0;
		self.isGameOver = false;
		self.initFloor();
		self.run();
	},
	initFloor : function(){
		var self = this;
		var f1 = new Floor0(0, self.height/2);
		var f2 = new Floor0(self.width/2, self.height);
		var f3 = new Floor0(200, self.height-200);
		var f4 = new Floor0(50, self.height-900);
		self.floorList.push(f1);
		self.floorList.push(f2);
		self.floorList.push(f3);
		self.floorList.push(f4);

		self.person = new Person(30, self.height/2 - 50);
		self.personFloor = new Floor0(f1.x, f1.y);
	},
	drawBack : function(){
		var self = this;
		var back = new Image();
		back.src = "image/back.png";
		self.context.drawImage(back, 0, 0, self.width, self.height);
	},
	drawFloor0 : function(){
		var self = this;
		var len = self.floorList.length;
		for(var i=0; i<len; i++){
			var floor = self.floorList[i];
			var floorImg = new Image();
			floorImg.src = "image/floor0.png";
			self.context.drawImage(floorImg, floor.x, floor.y, floorImg.width, floorImg.height);
			floor.y -= self.floorSpeed;
			if (floor.y < -floor.height) {
				floor.y = self.height + (Math.random()*10000 % self.height) / 2;
				floor.x = Math.random()*(self.width - floor.width);
			}
		}
		
	},
	drawPerson : function(){
		var self = this;
		var personImg = new Image();
		personImg.src = "image/person.png";
		self.context.drawImage(personImg, 0, 0, 40, 50, self.person.x, self.person.y, 40, 50);
	},
	drawScore : function(){
		var self = this;
		self.context.save();
		self.context.fillStyle = "#00f";
		self.context.font = "italic 20px sans-serif";
		self.context.textBaseline = 'top';             //填充字符串
		self.context.fillText("score:"+self.score, 0, 10);
		self.context.restore();
	},
	doMove : function(){
		var self = this;
		var span = 3;
		var fallSpan = 2
		if(self.curDirection == "left"){
			if(self.personIsFalling == false){
				if (self.person.x - span >= self.personFloor.x){
					self.person.x -= span;
					self.person.y -= self.floorSpeed;
				}else{
					self.personIsFalling = true;
				}
			}
			self.preDirection = self.curDirection;
		}else if(self.curDirection == "right"){
			if(self.personIsFalling == false){
				if (self.person.x + span <= self.personFloor.x + self.personFloor.width - self.person.width/2) {
					self.person.x += span;
					self.person.y -= self.floorSpeed;
				}else{
					self.personIsFalling = true;
				}
			}
			self.preDirection = self.curDirection;
		}else{
			self.person.y -= self.floorSpeed;
		}

		self.curDirection = "none";

		if(!self.personIsFalling){
			if(self.preDirection != "none" && self.personCurSteps < self.personSumSteps){
				if(self.preDirection == "left"){
					self.person.x -= span;
				}else if(self.preDirection == "right"){
					self.person.x += span;
				}
				self.personCurSteps ++;
			}else{
				self.preDirection = "none";
				self.personCurSteps = 0;
			}
		}

		// debug("----"+self.preDirection);
		if(self.personIsFalling && self.preDirection == "left"){
			self.person.x = (self.person.x - fallSpan >= 0) ? self.person.x - fallSpan : 0;
			self.person.y += self.personFallSpeed;
		}else if(self.personIsFalling && self.preDirection == "right"){
			self.person.x = (self.person.x + fallSpan <= self.width - self.person.width) ? self.person.x + fallSpan : self.width - self.person.width;
			self.person.y += self.personFallSpeed;
		}

		// debug(self.personFloor);	
	},
	//检测碰撞
	detectCollide : function(){
		var self = this;
		var len = self.floorList.length;
		for(var i = 0; i < len; i++){
			var floor = self.floorList[i];
			var personBottomX = self.person.x + self.person.width/2;
			var personBottomY = self.person.y + self.person.height;

			if (personBottomX >= floor.x && personBottomX <= floor.x + floor.width && personBottomY <= floor.y && personBottomY >= floor.y - 5) {
				if(self.personIsFalling == true){
					self.score ++;
					debug("score: " + self.score);
				}
				self.personIsFalling = false;
				self.personFloor = new Floor0(floor.x, floor.y);
				return;
			}
		}
	},
	//判断游戏是否结束
	detectGameOver : function(){
		var self = this;
		if((self.person.y + self.person.height/2 <= 0) || (self.person.y >= self.height)){
			self.isGameOver = true;
			clearInterval(self.timer);
			self.onGameOver();
		}
	},
	onGameOver : function(){
		var self = this;
		self.context.save();
		self.context.fillStyle = "#ff8800";
		self.context.fillRect(self.width/2-100, self.height/2-50, 200, 100);
		self.context.fillStyle = "#00f";
		self.context.font = "italic 15px sans-serif";
		self.context.textBaseline = 'top';             //填充字符串
		self.context.fillText("分数:"+self.score, self.width/2-100, self.height/2-50);
		self.context.fillText("再玩一次!!", self.width/2-100, self.height/2-30);
		self.context.restore();
		self.descContent = "我在下楼梯比赛中赢得了"+self.score+"分！";
		self.canvas.onclick = function(event){
			debug("restart");
			if(self.isGameOver){
				self.reset();
			}
		}
	},
	clear : function(){
		self.context.clearRect(0, 0, self.width, self.height);
	},
	run : function(){
		var self = this;

		window.onkeydown = function(e){
			var key = e.keyCode;
			if (key === 80) {  
				// 暂停
			}if (key === 37) { // left arrow
				self.curDirection = "left";
				debug("left");
			}else if (key === 39) { // right arrow
				self.curDirection = "right";
				debug("right");
			}
		}

		window.onmousedown = function(event){
			if(event.offsetX <= self.width / 2){
				self.curDirection = "left";
			}else{
				self.curDirection = "right";
			}
			self.stopDefault(event);
		}

		self.timer = setInterval(function(){
			self.drawBack();
			self.drawFloor0();
			self.drawPerson();
			self.drawScore();
			self.doMove();
			self.detectCollide();
			self.detectGameOver();
		}, 1000/60);
	},
	//这个方法暂时有点问题，有些手机浏览器默认双击是界面放大
	stopDefault : function(e){
		if (e && e.preventDefault) {//如果是FF下执行这个
	        e.preventDefault();
	    }else{
	        window.event.returnValue = false;//如果是IE下执行这个
	    }
	    return false;
	}

};
