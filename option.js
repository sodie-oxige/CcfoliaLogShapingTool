var def={"html":{"css":"div,p,span{\n\tpadding: 0;\n\tmargin: 0;\n\tposition: relative;\n\tbox-sizing: border-box;\n}\nheader{\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\theight: 1rem;\n\twidth: 100%;\n\tbackground: black;\n\tcolor: white;\n\tfont-size: .8em;\n\tz-index: 1;\n}\nbody{\n\tmargin: 1em auto 0;\n\tmax-width: 1000px;\n\tbackground-color: #ddd;\n\toverflow-x: hidden;\n}\n.main{\n\tpadding: .5em;\n\tdisplay: flex;\n\tgap: 10px;\n\tbackground-color: white;\n\tborder-bottom: thin solid black;\n\tborder-image: linear-gradient(to right, white, silver 10%, silver 90%, white);\n\tborder-image-slice: 1;\n}\n.main>p{\n\tmargin: auto 0;\n\theight: 100%;\n}\n.main>p:first-child{\n\twidth: 8.5em;\n\tmin-width: 8.5em;\n\tpadding-right: .5em;\n\ttext-align: end;\n}\n.main::before{\n\tcontent: \"\";\n\tposition: absolute;\n\tleft: 9em;\n\ttop: 4px;\n\twidth: 2.5px;\n\theight: calc(100% - 8px);\n\tbackground-color: var(--c);\n\tfilter: contrast(2) saturate(2);\n}\n.chat{\n\tmargin-left: 4em;\n\tbackground-color: #f8f8f8;\n\tfont-size: .8em;\n}\n.chat>p{\n\tcolor: var(--c);\n\tfilter: brightness(70%);\n}\n.secret{\n\tbackground-color: #666;\n\tborder-image: linear-gradient(to right, #666, gray 10%, gray 90%, #666);\n\tborder-image-slice: 1;\n}\n.secret>p{\n\tfont-weight: bold;\n\tfilter: brightness(200%);\n}\n.secret>p:first-child{\n\tline-height: 1.1;\n}\n.secret>p:first-child>span{\n\tfont-size: .5em;\n}\n.secret::after{\n\tcontent: \"\";\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tdisplay: block;\n\theight: 100%;\n\twidth: 5px;\n\tbackground-color: red;\n}\n.info{\n\tmargin: 5px;\n\tletter-spacing: .1em;\n\tfont-weight: bold;\n\tfont-family: system-ui;\n}\n.info>span{\n\tfont-size: .8em;\n}\n.info>p{\n\tmargin: 0 auto;\n\tdisplay: block;\n\twidth: fit-content;\n}","header":"<p>{filename}</p>","footer":"","option":{"option_rubyCut":true,"option_diceSuccess":"\\([^(]+(成功|成功数\\D*?([1-9]+[0-9]|[1-9])|スペシャル)\\D*?$","option_diceFailure":"\\([^(]+(失敗|成功数\\D*?0)\\D*?$"},"comment":[[1,"system","\t<div class=\"info\" style=\"--c:{color}\">\n\t\t<p>{text}</p>\n\t</div>"],[0,"メイン","\t<div class=\"main\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[0,"雑談","\t<div class=\"main chat\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[0,"情報","\t<div class=\"info\" style=\"--c:{color}\">\n\t\t<span>{author}</span>\n\t\t<p>{text}</p>\n\t</div>"],[2,"秘匿\\((.+?),(.+?)\\.\\.\\)","\t<div class=\"main chat secret\" style=\"--c:{color}\">\n\t\t<p>{author}<br><span>$1 - $2</span></p>\n\t\t<p>{text}</p>\n\t</div>"],[2,"(その他)?.*","\t<div class=\"info\" style=\"--c:{color}\">\n\t\t<span>{author}</span>\n\t\t<p>{text}</p>\n\t</div>"]]}};
chrome.storage.local.get("html", function(result){
	if(result.html==undefined)result=def;
	console.log("デバッグ用だから見ちゃやーや。");
	console.log(result);
	document.querySelector(".css textarea").value = result.html.css;
	document.querySelector(".css textarea").addEventListener("input",(e)=>{
		var viewCss=e.currentTarget.value;
		for(elem of document.querySelectorAll(".req iframe")){
			elem.contentWindow.document.getElementById("viewCss").innerHTML=viewCss;
		}
		document.getElementById("viewCss").innerHTML=viewCss;
	})
	document.querySelector(".css textarea").addEventListener("keydown",(e)=>{tabkey(e)})
	document.querySelector(".header textarea").value = result.html.header;
	document.querySelector(".footer textarea").value = result.html.footer;
	for(var i=0;i<result.html.comment.length;i++){
		var req=document.createElement("div");
		req.classList.add("req","flex");
		var a="", b="";
		if(result.html.comment[i][0]%2==1) a=" checked";
		if(result.html.comment[i][0]>=2) b=" checked";
		req.innerHTML='<div class="vflex"><div class="head flex"><input type="text" value="'+result.html.comment[i][1]+'"><label class="regex"><input type="checkbox"'+b+'><p>正規表現</p></label><label class="cond"><input type="checkbox"'+a+'><div class="check"><p>タブ</p><p>発言者</p></div></label><button class="up"></button><button class="down"></button><button class="delete"></button></div><div class="textarea"><textarea>'+result.html.comment[i][2]+'</textarea></div></div><iframe>';
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
		viewCss.innerHTML=result.html.css;
		elem.querySelector("iframe").contentWindow.document.head.appendChild(viewCss);
		var viewHtml=elem.querySelector("textarea").value.replace(/\{tab\}/g,"タブ").replace(/\{author\}/g,"発言者").replace(/\{text\}/g,"これはデモテキストです。\n発言はこのように表示されます。").replace(/\{color\}/g,"#00ffff");
		var container=document.createElement("p");
		container.classList.add("container");
		container.innerHTML=viewHtml;
		elem.querySelector("iframe").contentWindow.document.body.appendChild(container);
	}
	for(key in result.html.option){
		switch(typeof result.html.option[key]){
			case "boolean":
				document.querySelector("input#"+key).checked=result.html.option[key];
				break;
			case "string":
				document.querySelector("input#"+key).value=result.html.option[key];
				break;
		}
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
	req.innerHTML='<div class="vflex"><div class="head flex"><input type="text" value="new"><label class="regex"><input type="checkbox"><p>正規表現</p></label><label class="cond"><input type="checkbox"><div class="check"><p>タブ</p><p>発言者</p></div></label><button class="up"></button><button class="down"></button><button class="delete"></button></div><div class="textarea"><textarea></textarea></div></div><iframe>';
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
document.getElementById("reset").addEventListener("click",function(){
	var flag=confirm("設定をデフォルトに戻します。（保存をしない限りはページ再読み込みで元に戻せます）\nリセットしてもよろしいですか？");
	if(flag==true){
		for(var elem of document.querySelectorAll(".req")) elem.remove();
		result=def;
		console.log("デバッグ用だから見ちゃやーや。");
		console.log(result);
		document.querySelector(".css textarea").value = result.html.css;
		document.querySelector(".css textarea").addEventListener("input",(e)=>{
			var viewCss=e.currentTarget.value;
			for(elem of document.querySelectorAll(".req iframe")){
				elem.contentWindow.document.getElementById("viewCss").innerHTML=viewCss;
			}
			document.getElementById("viewCss").innerHTML=viewCss;
		})
		document.querySelector(".css textarea").addEventListener("keydown",(e)=>{tabkey(e)})
		document.querySelector(".header textarea").value = result.html.header;
		document.querySelector(".footer textarea").value = result.html.footer;
		for(var i=0;i<result.html.comment.length;i++){
			var req=document.createElement("div");
			req.classList.add("req","flex");
			var a="", b="";
			if(result.html.comment[i][0]%2==1) a=" checked";
			if(result.html.comment[i][0]>=2) b=" checked";
			req.innerHTML='<div class="vflex"><div class="head flex"><input type="text" value="'+result.html.comment[i][1]+'"><label class="regex"><input type="checkbox"'+b+'><p>正規表現</p></label><label class="cond"><input type="checkbox"'+a+'><div class="check"><p>タブ</p><p>発言者</p></div></label><button class="up"></button><button class="down"></button><button class="delete"></button></div><div class="textarea"><textarea>'+result.html.comment[i][2]+'</textarea></div></div><iframe>';
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
			viewCss.innerHTML=result.html.css;
			elem.querySelector("iframe").contentWindow.document.head.appendChild(viewCss);
			var viewHtml=elem.querySelector("textarea").value.replace(/\{tab\}/g,"タブ").replace(/\{author\}/g,"発言者").replace(/\{text\}/g,"これはデモテキストです。\n発言はこのように表示されます。").replace(/\{color\}/g,"#00ffff");
			var container=document.createElement("p");
			container.classList.add("container");
			container.innerHTML=viewHtml;
			elem.querySelector("iframe").contentWindow.document.body.appendChild(container);
		}
		for(key in result.html.option){
			document.querySelector("input#"+key).checked=result.html.option[key];
		}
	}
})
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
		var array={};
		array.css=document.querySelector(".css textarea").value;
		array.header=document.querySelector(".header textarea").value;
		array.footer=document.querySelector(".footer textarea").value;
		array.option={};
		for(elem of document.querySelectorAll("#option input")){
			switch(elem.type){
				case "checkbox":
					array.option[elem.id]=elem.checked;
					break;
				case "text":
					array.option[elem.id]=elem.value;
					break;
			}
		}
		array.comment=[];
		for(elem of document.querySelectorAll("div.req")){
			var type1=elem.querySelector("label.cond input[type='checkbox']").checked ? 1 : 0;
			var type2=elem.querySelector("label.regex input[type='checkbox']").checked ? 1 : 0;
			var type=type1+type2*2;
			var name=elem.querySelector("input[type='text']").value;
			var text=elem.querySelector("textarea").value;
			array.comment.push([type,name,text]);
		}
		console.log({html:array});
		chrome.storage.local.set({html : array}, function(){});
}
window.addEventListener("keydown",function(e){
	if(e.ctrlKey && e.keyCode==83){
		e.preventDefault();
		saveData();
	}
})