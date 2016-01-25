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
	var PublicMixin = {
	 	// 设置图片在屏幕区域内的随机摆放范围
	 	getMoveX: function (){
	 		return document.body.clientWidth/2;
	 	},
	 	getMoveY: function (){
	 		return document.body.clientHeight/2;
	 	},
	 	// 获取随机布局
	 	randomSign : function (){ // 取随机正负
	 		var random = this.randomInt(2),n=1;
	 		if (random===2) n=-1;
	 		else n=1;
	 		return n;
	 	},
	 	randomInt : function (n){ // 取随机整数,范围值0~n
	 	 	return parseInt(Math.floor(Math.random()*n+1));
	 	},
	 	getRandomTransform : function(){// 取随机旋转角度(css3属性)
	 		return 'translate3d('+this.randomInt(this.getMoveX())*this.randomSign()+'px,'+
	 				this.randomInt(this.getMoveY())*this.randomSign()+'px,0)'+
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
 		componentDidMount: function (){
 			this.props.ImgMap_children.push(this);// 将这个组件实例保存到父组件中
 		},
 		render:function (){
 			var style = {
				zIndex:this.state.zIndex,
				transform:this.state.transform,
				backgroundImage:'url(images/'+this.props.index+'.jpg)',
			};
 			return(
 				React.createElement("div", {onClick: this.props.clickCallback, style: style, className: this.state.centerClass, "data-index": this.props.index})
			)
 		}
 	});


 	// 图片池
	var ImgMap = React.createClass({displayName: "ImgMap",
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
			var imgComponent = this._children;
			var clickImg = event.target;
			var index = clickImg.getAttribute('data-index');
			// 点击已居中的图片
			if (imgComponent[index].state.centerClass) {	//再次点击缩小
				imgComponent[index].setState({centerClass:''})
			}
			else if(imgComponent[index].state.zIndex > 0) {	//再次点击放大
				imgComponent[index].setState({centerClass:'enlarge'})
			}
			else{
				// 居中点击的图片，并重新随机排序其余图片
				for (var i = 0; i < imgComponent.length; i++) {
					if (index==i) imgComponent[i].toCenter(this.props.total);
					else imgComponent[i].randomPostion();
				}
			}
		},
		render: function () {
			this._children = [];// 用于保存子组件的react实例
			var  
				self = this, 
				imgs=[],
				newImg = function (i){
					return React.createElement(ImgComponent, {clickCallback: self.handleClick, index: i, ImgMap_children: self._children})
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