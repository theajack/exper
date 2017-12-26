var Draw=function(opt){
  if(typeof opt.ele=='string'){
    opt.ele=document.getElementById(opt.ele);
  }
  this.ele=opt.ele;
  this.color='#000';
  this.lineWidth=opt.lineWidth||1;
  this.width=opt.width||400;
  this.height=opt.height||400;
  this.mode='pen';
  this.ctx=null;
  _initDrawEle.call(this,opt);
};Draw.prototype.usePen=function(){
  this.mode='pen';
  this.ele._canvas.css('cursor',"url('assets/images/pen.png'),auto");
  this.ele._tools._eraser.innerText='橡皮';
};Draw.prototype.useEraser=function(){
  this.mode='eraser';
  this.ele._canvas.css('cursor',"url('assets/images/eraser.png'),auto");
  this.ele._tools._eraser.innerText='画笔';
};Draw.prototype.open=function(){
  this.ele._file.click();
};Draw.prototype.save=function(){
  var filename='ship.png';
  var data=this.ele._canvas.toDataURL("image/png");
  var save_link = document.createElement('a');
  save_link.href = data;
  save_link.download = filename;

  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  save_link.dispatchEvent(event);
};Draw.prototype.clear=function(){
  this.ctx.clearRect(0,0,this.width,this.height);
	//drawImg(filedata)
};
function _initDrawEle(opt){
  this.ele._draw=this;
  var _this=this;
  this.ele.style.width=this.width+'px';
  this.ele.style.height=(this.height+24)+'px';
  _addClass(this.ele,'draw-wrapper');
  var tools=_create('div');
  _addClass(tools,'draw-tools');
  var toolOpt=opt.tools||['open','clear','save','eraser'];
  if(toolOpt.indexOf('open')!=-1){
    _addTool(tools,'open','打开',function(){_this.open();});
  }
  if(toolOpt.indexOf('clear')!=-1){
    _addTool(tools,'clear','清除',function(){_this.clear();});
  }
  if(toolOpt.indexOf('save')!=-1){
    _addTool(tools,'save','保存',function(){_this.save();});
  }
  if(toolOpt.indexOf('eraser')!=-1){
    _addTool(tools,'eraser','橡皮',function(){
      if(_this.mode=='pen'){
        _this.useEraser();
      }else{
        _this.usePen();
      }
    });
  }
  this.ele.appendChild(tools);
  var file=_create('input');
  file.style.display='none';
  file.setAttribute('type','file');
  file.onchange = function(e){
		var filedata = e.target.files[0];	
		var readFile = new FileReader();
		readFile.readAsDataURL(filedata);
		readFile.onload = function(){
			var Img = new Image();
			Img.src = this.result;
			Img.onload = function(){
				//canvas.width = Img.width;
				//canvas.height = Img.height;
				_this.ctx.drawImage(Img,0,0);
			}
		}
	}
  this.ele.appendChild(file);
  
  var canvas=_create('canvas');
  _addClass(canvas,'draw-canvas');
  canvas.width=this.width;
  canvas.height=this.height;
  canvas.innerText='您的浏览器不兼容';
  this.ele.appendChild(canvas);
  this.ctx = canvas.getContext('2d');
  this.ctx.lineWidth=this.lineWidth;
	canvas.last = null;
  canvas.onmousedown = function(e){
    this.last = [e.offsetX,e.offsetY];
	}
  canvas.onmousemove = function(e){
    if(this.last != null){
      if(_this.mode=='pen'){
        _this.ctx.beginPath();
        _this.ctx.moveTo(this.last[0],this.last[1]);
        _this.ctx.lineTo(e.offsetX,e.offsetY);
        _this.ctx.stroke();
        this.last = [e.offsetX,e.offsetY];
      }else{
        _this.ctx.clearRect(e.offsetX-5,e.offsetY-5,10,10);
      }
    }
  };
	canvas.onmouseup = function(){
		//canvas.onmousemove = null;	
		this.last = null;
	}
	canvas.onmouseout = function(){
		//canvas.onmousemove = null;
		this.last = null;
  }
  this.ele._file=file;
  this.ele._canvas=canvas;
  this.ele._tools=tools;
}
function _addTool(tools,name,text,func){
  var t=_create('div');
  _addClass(t,'tool-item');
  t.onclick=func;
  t.innerText=text;
  tools['_'+name]=t;
  tools.appendChild(t);
}
function _create(o){
  return document.createElement(o)
}
function _addClass(obj,a){
  obj.className += " " + a;
}
