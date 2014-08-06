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
var Game = {
	imageArr : {
		'back':'image/back.png',
		'floor0' : 'image/floor0.png'
	},
	init : function(){
		console.log('init');
		var canvas = document.getElementById("game");
		var context = canvas.getContext("2d");
		//var image = new Image();
		//image.src = "image/1.png";
		//if(image.complete){
		//	context.drawImage(this, 0, 0, this.width, this.height);
		//}else{
		//	image.onload = function(){
		//		context.drawImage(this, 0, 0, this.width, this.height);
		//	//	context.drawImage(this, 0, 0, 100, 100, 0, 0, 100, 100);
		//	}
		//}
		
		context.save();	
		//draw geometric shape
		// var g1 = context.createRadialGradient(100, 150, 10, 300, 150, 50);
		//g1.addColorStop(0.1, 'rgb(255, 0, 0)');
		//g1.addColorStop(0.5, 'rgb(0, 255, 0)');
		//g1.addColorStop(1, 'rgb(0, 0, 255)');
		//context.fillStyle = g1;
		//context.fillRect(0, 0, 400, 300);
		var g1 = context.createRadialGradient(200, 150, 0, 200, 150, 100);
        g1.addColorStop(0.1, 'rgb(255,0,0)');  
        g1.addColorStop(1, 'rgb(50,0,0)');
        context.fillStyle = g1;
        context.beginPath();
        context.arc(200, 150, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
		
	}
};
