chrome.storage.local.get("html", function(result){
	if(result.html==undefined)result={"html":[[0,"css","div,p,span{\n\tpadding:0;margin:0;\n\tposition:relative;\n\tbox-sizing:border-box;\n}\nheader{\n\tposition:fixed;\n\ttop:0; left:0;\n\theight:1rem;\n\twidth:100%;\n\tbackground:black;\n\tcolor:white;\n\tfont-size:0.8em;\n\tz-index:1;\n}\nbody{\n\tmargin:1em auto 0;\n\tmax-width:1000px;\n\tword-break:keep-all;\n\tbackground-color:#eee;\n\toverflow-x:hidden;\n}\n.main,\n.chat{\n\tpadding:0.5em 0;\n\tdisplay:flex;\n\tgap:10px;\n\tborder-bottom:thin solid black;\n\tborder-image:linear-gradient(to right,white,silver 10%,silver 90%,white);\n\tborder-image-slice:1;\n}\n.main>p,\n.chat>p{\n\tmargin:auto 0;\n\theight:100%;\n}\n.chat>p{\n\tcolor:var(--c);\n}\n.main>p:first-child,\n.chat>p:first-child{\n\tmin-width:9em;\n\tmax-width:9em;\n\tpadding-left:0.5em;\n}\n.main::before,\n.chat::before{\n\tcontent:\"\";\n\tposition:absolute;\n\tleft:9em; top:4px;\n\twidth:2px; height:calc(100% - 8px);\n\tbackground-color:var(--c);\n}\n\n.main{\n\tbackground-color:white;\n}\n.chat{\n\tmargin-left:4em;\n\tbackground-color:#f8f8f8;\n}\n.info{\n\tmargin:5px;\n\tletter-spacing:0.1em;\n\tfont-weight:bold;\n\tfont-family:system-ui;\n}\n.info>span{\n\tfont-size:.8em;\n}\n.info>p{\n\ttext-align:center;\n}"],[0,"header","<p>{filename}</p>"],[0,"footer",""],[1,"system","\t<div class=\"info\" style=\"--c:{color}\">\n\t\t<p>{text}</p>\n\t</div>"],[0,"メイン","\t<div class=\"main\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[0,"雑談","\t<div class=\"chat\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[0,"情報","\t<div class=\"info\" style=\"--c:{color}\">\n\t\t<span>{author}</span>\n\t\t<p>{text}</p>\n\t</div>"]]};
	document.querySelector(".css textarea").value = result.html[0][2];
	document.querySelector(".css textarea").addEventListener("input",(e)=>{
		var viewCss=e.currentTarget.value;
		for(elem of document.querySelectorAll(".req iframe")){
			elem.contentWindow.document.getElementById("viewCss").innerHTML=viewCss;
		}
		document.getElementById("viewCss").innerHTML=viewCss;
	})
	document.querySelector(".css textarea").addEventListener("keydown",(e)=>{tabkey(e)})
	document.querySelector(".header textarea").value = result.html[1][2];
	document.querySelector(".footer textarea").value = result.html[2][2];
	for(var i=3;i<result.html.length;i++){
		var req=document.createElement("div");
		req.classList.add("req","flex");
		if(result.html[i][0]){
			req.innerHTML='<div class="vflex"><div class="head flex"><input type="text" value="'+result.html[i][1]+'"><label><input type="checkbox" checked><div class="check"><p>タブ</p><p>発言者</p></div></label><button class="up"></button><button class="down"></button><button class="delete"></button></div><div class="textarea"><textarea>'+result.html[i][2]+'</textarea></div></div><iframe>';
		}else{
			req.innerHTML='<div class="vflex"><div class="head flex"><input type="text" value="'+result.html[i][1]+'"><label><input type="checkbox"><div class="check"><p>タブ</p><p>発言者</p></div></label><button class="up"></button><button class="down"></button><button class="delete"></button></div><div class="textarea"><textarea>'+result.html[i][2]+'</textarea></div></div><iframe>';
		}
		req.querySelector("button.up").addEventListener("click",(e)=>{moveUp(e)});
		req.querySelector("button.down").addEventListener("click",(e)=>{moveDown(e)});
		req.querySelector("button.delete").addEventListener("click",(e)=>{reqDelete(e)});
		req.querySelector("textarea").addEventListener("input",(e)=>{htmlView(e)});
		req.querySelector("textarea").addEventListener("keydown",(e)=>{tabkey(e)})
		document.getElementById("html").insertBefore(req,document.getElementById("save"));
	}
	for(elem of document.querySelectorAll(".req")){
		var viewCss=document.createElement("style");
		viewCss.id="viewCss";
		viewCss.innerHTML=result.html[0][2];
		elem.querySelector("iframe").contentWindow.document.head.appendChild(viewCss);
		var viewHtml=elem.querySelector("textarea").value.replace(/\{tab\}/g,"タブ").replace(/\{author\}/g,"発言者").replace(/\{text\}/g,"これはデモテキストです。\n発言はこのように表示されます。").replace(/\{color\}/g,"#00ffff");
		var container=document.createElement("p");
		container.classList.add("container");
		container.innerHTML=viewHtml;
		elem.querySelector("iframe").contentWindow.document.body.appendChild(container);
	}
});
document.querySelector("#fix>input").addEventListener("change",function(){
	if(this.checked){
		document.querySelector(".css").style="position:relative";
	}else{
		document.querySelector(".css").style="position:sticky";
	}
})
document.getElementById("save").addEventListener("click",function(){
	saveData();
})
document.getElementById("add").addEventListener("click",function(){
	var req=document.createElement("div");
	req.classList.add("req","flex");
	req.innerHTML='<div class="vflex"><div class="head flex"><input type="text" value="new"><label><input type="checkbox"><div class="check"><p>タブ</p><p>発言者</p></div></label><button class="up"></button><button class="down"></button><button class="delete"></button></div><div class="textarea"><textarea></textarea></div></div><iframe>';
	req.querySelector("button.up").addEventListener("click",(e)=>{moveUp(e)});
	req.querySelector("button.down").addEventListener("click",(e)=>{moveDown(e)});
	req.querySelector("button.delete").addEventListener("click",(e)=>{reqDelete(e)});
	req.querySelector("textarea").addEventListener("input",(e)=>{htmlView(e)});
	req.querySelector("textarea").addEventListener("keydown",(e)=>{tabkey(e)})
	document.getElementById("html").insertBefore(req,document.getElementById("save"));
	var elem=req;
	var viewCss=document.createElement("style");
	viewCss.id="viewCss";
	viewCss.innerHTML=document.querySelector(".css textarea").value;
	elem.querySelector("iframe").contentWindow.document.head.appendChild(viewCss);
	var viewHtml=elem.querySelector("textarea").value.replace(/\{tab\}/g,"タブ").replace(/\{author\}/g,"発言者").replace(/\{text\}/g,"これはデモテキストです。\n発言はこのように表示されます。").replace(/\{color\}/g,"#00ffff");
	var container=document.createElement("p");
	container.classList.add("container");
	container.innerHTML=viewHtml;
	elem.querySelector("iframe").contentWindow.document.body.appendChild(container);
});
function reqDelete(e){
	var elem=e.currentTarget.parentNode.parentNode.parentNode;
	elem.parentNode.removeChild(elem);
}
function moveUp(e){
	var elem=e.currentTarget.parentNode.parentNode.parentNode;
	if(elem!=document.querySelectorAll("div.req")[0]){
		elem.parentNode.insertBefore(elem,elem.previousElementSibling);
		var viewCss=document.createElement("style");
		viewCss.id="viewCss";
		viewCss.innerHTML=document.querySelector(".css textarea").value;
		elem.querySelector("iframe").contentWindow.document.head.appendChild(viewCss);
		var viewHtml=elem.querySelector("textarea").value.replace(/\{tab\}/g,"タブ").replace(/\{author\}/g,"発言者").replace(/\{text\}/g,"これはデモテキストです。\n発言はこのように表示されます。").replace(/\{color\}/g,"#00ffff");
		var container=document.createElement("p");
		container.classList.add("container");
		container.innerHTML=viewHtml;
		elem.querySelector("iframe").contentWindow.document.body.appendChild(container);
	}
}
function moveDown(e){
	var elem=e.currentTarget.parentNode.parentNode.parentNode;
	if(elem!=document.querySelectorAll("div.req")[document.querySelectorAll("div.req").length-1]){
		elem.parentNode.insertBefore(elem.nextElementSibling,elem);
		var viewCss=document.createElement("style");
		viewCss.id="viewCss";
		viewCss.innerHTML=document.querySelector(".css textarea").value;
		elem.previousElementSibling.querySelector("iframe").contentWindow.document.head.appendChild(viewCss);
		var viewHtml=elem.previousElementSibling.querySelector("textarea").value.replace(/\{tab\}/g,"タブ").replace(/\{author\}/g,"発言者").replace(/\{text\}/g,"これはデモテキストです。\n発言はこのように表示されます。").replace(/\{color\}/g,"#00ffff");
		var container=document.createElement("p");
		container.classList.add("container");
		container.innerHTML=viewHtml;
		elem.previousElementSibling.querySelector("iframe").contentWindow.document.body.appendChild(container);
	}
}
function htmlView(e){
	var elem=e.currentTarget.parentNode.parentNode.parentNode;
	var viewHtml=elem.querySelector("textarea").value.replace(/\{tab\}/g,"タブ").replace(/\{author\}/g,"発言者").replace(/\{text\}/g,"これはデモテキストです。\n発言はこのように表示されます。").replace(/\{color\}/g,"#00ffff");
	var container=document.createElement("p");
	container.classList.add("container");
	container.innerHTML=viewHtml;
	elem.querySelector("iframe").contentWindow.document.body.innerHTML="";
	elem.querySelector("iframe").contentWindow.document.body.appendChild(container);
}
function tabkey(e){
	if(e.keyCode==9){
		e.preventDefault();
		document.execCommand('insertText', false, "\t");
	}else if(e.keyCode==13){
		e.preventDefault();
		var val=e.currentTarget.value,
			pos=e.currentTarget.selectionStart,
			c=0;
		while(val.substr(pos-1,1)!="\n"&&pos!=0){
			if(val.substr(pos-1,1)=="\t"){c++;}else{c=0;}
			pos--;
		}
		document.execCommand('insertText', false, "\n");
		for(var i=1;i<=c;i++) document.execCommand('insertText', false, "\t");
	}
}
function saveData(){
		var array=[];
		array.push([0,"css",document.querySelector(".css textarea").value]);
		array.push([0,"header",document.querySelector(".header textarea").value]);
		array.push([0,"footer",document.querySelector(".footer textarea").value]);
		for(elem of document.querySelectorAll("div.req")){
			var name=elem.querySelector("input[type='text']").value;
			var text=elem.querySelector("textarea").value;
			var type=elem.querySelector("input[type='checkbox']").checked ? 1 : 0;
			array.push([type,name,text]);
		}
		chrome.storage.local.set({html : array}, function(){});
}
window.addEventListener("keydown",function(e){
	if(e.ctrlKey && e.keyCode==83){
		e.preventDefault();
		saveData();
	}
})