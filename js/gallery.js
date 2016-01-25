(function(){

/**
 * initialize
 */
 document.body.addEventListener("touchmove",function(event){
     event.preventDefault();
 });
 document.addEventListener('DOMContentLoaded', function() {
     FastClick.attach(document.body);
 }, false);

/**
 * Public
 */
 var imgMapComponent = [];	// 储存React ImgComponent 每张图片对象实例

	var PublicMixin = {
	 	// 设置图片在屏幕区域内的随机摆放范围
	 	getMovePostion: function (postion){
	 		postion = postion.toLowerCase();
	 		if (postion === 'width' || postion === 'x') 	return document.body.clientWidth/2;
			if (postion === 'height' || postion === 'y')	return document.body.clientHeight/2;
	 	},
	 	// 获取随机布局
	 	randomSign : function (){ // 取随机正负
	 		var random = this.randomInt(2),n=1;
	 		if (random===2) n=-1;
	 		else n=1;
	 		return n;
	 	},
	 	randomInt : function (n){ // 取随机整数
	 	 	return parseInt(Math.floor(Math.random()*n+1));
	 	},
	 	getRandomTransform : function(){// 取随机旋转角度(css3属性)
	 		return 'translate3d('+this.randomInt(this.getMovePostion('x'))*this.randomSign()+'px,'+
	 				this.randomInt(this.getMovePostion('y'))*this.randomSign()+'px,0)'+
	 				' rotate3d(0,0,1,'+ this.randomInt(180)*this.randomSign() +'deg)';
	 	}
	};

/**
 * ReactComponent
 */
 	// 图片组件
 	var ImgComponent = React.createClass({displayName: "ImgComponent",
 		mixins: [PublicMixin],
 		getInitialState:function (){
 			return{
				zIndex:0,
				transform:this.getRandomTransform(),
				centerClass:''
 			}
 		},
 		randomPostion:function (){
 			this.setState({
 				zIndex:0,
 				transform: this.getRandomTransform(),
 				centerClass:''
 			})
 		},
 		toCenter:function (zIndex){
 			this.setState({
 				zIndex: zIndex,
 				transform:'translate3d(0,0,0) rotate3d(0,0,1,0)'
 			})
 		},
 		componentDidMount: function (){// 将组件最后的react实例保存下来，方便在父组件中调用其属性和方法。
 			// console.log(this)
 			imgMapComponent.push(this);// 记录图片组件react对象实例
 		},
 		render:function (){
 			var style = {
				zIndex:this.state.zIndex,
				transform:this.state.transform,
				backgroundImage:'url(images/'+this.props.index+'.jpg)',
			};
 			return(
 				React.createElement("div", {onClick: this.props.clickCallback, style: style, className: this.state.centerClass, 
				"data-index": this.props.index, randomPostion: this.randomPostion, toCenter: this.toCenter}
 				)
			)
 		}
 	});


 	// 图片池
	var ImgMap = React.createClass({displayName: "ImgMap",
		// mixins: [PublicMixin],
		getDefaultProps : function () {
		    return {
		    	total : 8	//定义图片总数（从0开始计算）
		    };
		},
		componentDidMount:function (){
			// 创建操作提示
			var parent = document.body;
			var div = document.createElement("div");
			div.setAttribute("class", "tip");
			parent.appendChild(div);
			div.innerHTML = '点击一张图片';
			setTimeout(function(){
				parent.removeChild(div);
			},4000);
		},
		handleClick:function (event) {
			var clickImg = event.target;
			var index = clickImg.getAttribute('data-index');
			// 点击已居中的图片
			if (imgMapComponent[index].state.centerClass) {	//再次点击缩小
				imgMapComponent[index].setState({centerClass:''})
			}
			else if(imgMapComponent[index].state.zIndex > 0) {	//再次点击放大
				imgMapComponent[index].setState({centerClass:'enlarge'})
			}
			else{
				// 居中点击的图片，并重新随机排序其余图片
				for (var i = 0; i < imgMapComponent.length; i++) {
					if (index==i) imgMapComponent[i].toCenter(this.props.total);
					else imgMapComponent[i].randomPostion();
				}
			}
		},
		render: function () {
			var  self = this, imgs=[],
			newImg = function (i){
				return React.createElement(ImgComponent, {clickCallback: self.handleClick, index: i})
			};
			for (var i = 0; i < self.props.total; i++) {
				imgs.push(newImg(i));
			}
			return (React.createElement("div", {className: "ImgMap"}, imgs))
		}
	});


	React.render(
	    React.createElement(ImgMap, null),
	    document.body
	);

})();