window.onload=function(){ if(document.title=="ccfolia - logs"){chrome.storage.local.get(null, function(result){
	if(result.html==undefined)result={"html":{"css":"div,p,span{\n\tpadding: 0;\n\tmargin: 0;\n\tposition: relative;\n\tbox-sizing: border-box;\n}\nheader{\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\theight: 1rem;\n\twidth: 100%;\n\tbackground: black;\n\tcolor: white;\n\tfont-size: .8em;\n\tz-index: 1;\n}\nbody{\n\tmargin: 1em auto 0;\n\tmax-width: 1000px;\n\tbackground-color: #ddd;\n\toverflow-x: hidden;\n}\n.main{\n\tpadding: .5em;\n\tdisplay: flex;\n\tgap: 10px;\n\tbackground-color: white;\n\tborder-bottom: thin solid black;\n\tborder-image: linear-gradient(to right, white, silver 10%, silver 90%, white);\n\tborder-image-slice: 1;\n}\n.main>p{\n\tmargin: auto 0;\n\theight: 100%;\n}\n.main>p:first-child{\n\twidth: 8.5em;\n\tmin-width: 8.5em;\n\tpadding-right: .5em;\n\ttext-align: end;\n}\n.main::before{\n\tcontent: \"\";\n\tposition: absolute;\n\tleft: 9em;\n\ttop: 4px;\n\twidth: 2.5px;\n\theight: calc(100% - 8px);\n\tbackground-color: var(--c);\n\tfilter: contrast(2) saturate(2);\n}\n.chat{\n\tmargin-left: 4em;\n\tbackground-color: #f8f8f8;\n\tfont-size: .8em;\n}\n.chat>p{\n\tcolor: var(--c);\n\tfilter: brightness(70%);\n}\n.secret{\n\tbackground-color: #666;\n\tborder-image: linear-gradient(to right, #666, gray 10%, gray 90%, #666);\n\tborder-image-slice: 1;\n}\n.secret>p{\n\tfont-weight: bold;\n\tfilter: brightness(200%);\n}\n.secret>p:first-child{\n\tline-height: 1.1;\n}\n.secret>p:first-child>span{\n\tfont-size: .5em;\n}\n.secret::after{\n\tcontent: \"\";\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\tdisplay: block;\n\theight: 100%;\n\twidth: 5px;\n\tbackground-color: red;\n}\n.info{\n\tmargin: 5px;\n\tletter-spacing: .1em;\n\tfont-weight: bold;\n\tfont-family: system-ui;\n}\n.info>span{\n\tfont-size: .8em;\n}\n.info>p{\n\tmargin: 0 auto;\n\tdisplay: block;\n\twidth: fit-content;\n}","header":"<p>{filename}</p>","footer":"","option":{"option_rubyCut":true,"option_diceSuccess":" \\([^(]+(成功|成功数\\D*?([1-9]+[0-9]|[1-9])|スペシャル)\\D*?$","option_diceFailure":" \\([^(]+(失敗|成功数\\D*?0)\\D*?$"},"comment":[[1,"system","\t<div class=\"info\" style=\"--c:{color}\">\n\t\t<p>{text}</p>\n\t</div>"],[0,"メイン","\t<div class=\"main\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[0,"雑談","\t<div class=\"main chat\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[0,"情報","\t<div class=\"info\" style=\"--c:{color}\">\n\t\t<span>{author}</span>\n\t\t<p>{text}</p>\n\t</div>"],[2,"秘匿\\((.+?),(.+?)\\.\\.\\)","\t<div class=\"main chat secret\" style=\"--c:{color}\">\n\t\t<p>{author}<br><span>$1 - $2</span></p>\n\t\t<p>{text}</p>\n\t</div>"],[2,"(その他)?.*","\t<div class=\"info\" style=\"--c:{color}\">\n\t\t<span>{author}</span>\n\t\t<p>{text}</p>\n\t</div>"]]}};
	const req=result.html;
	let css=req.css,
		header=req.header,
		footer=req.footer,
		comment=req.comment,
		option=req.option;
	header=decodeURI(header.replace(/\{filename\}/g,location.href.match(/(?<=\/)[^\/]+(?=\.[^\/\.]+)/)));
	footer=decodeURI(footer.replace(/\{filename\}/g,location.href.match(/(?<=\/)[^\/]+(?=\.[^\/\.]+)/)));
	document.head.innerHTML=document.head.innerHTML.replace(/(?<=<title>).+(?=<\/title>)/,decodeURI(location.href.match(/(?<=\/)[^\/\.]+(?=\.[^\/\.]+)/)))+"<style>"+css+"</style>";
	document.body.innerHTML="<header>"+header+"</header>" + document.body.innerHTML + "<footer>"+footer+"</footer>";
	let p=document.querySelector("body>p");
	while(p.tagName=="P"){
		let tab=p.children[0].textContent.replace(/\s\[|\]/g,""),
			author=p.children[1].textContent.replace(/[@＠・]/g,"$&<wbr>"),
			text=p.children[2].innerHTML,
			color=p.style.color;
		text = text
			.replace(/(?!^)\r?\n(?!$)/g,"<br>\n")
			.replace(new RegExp(option.option_diceSuccess,"mg"),"<span style='color:blue;'>$&</span>")
			.replace(new RegExp(option.option_diceFailure,"mg"),"<span style='color:red;'>$&</span>");
		if(option.option_rubyCut)author = author.replace(/[\(（][a-zA-Zぁ-んァ-ンｦ-ﾟ・ー\s]+[）\)]/,"")
		var div=document.createElement("div");
		div.classList.add("container");
		for(var j=0;j<comment.length;j++){
			var cond=false;
			var rt="", reg="";
			switch(comment[j][0]){
				case 0:
					cond=(tab==comment[j][1]);
					break;
				case 1:
					cond=(author==comment[j][1]);
					break;
				case 2:
					cond=(new RegExp(comment[j][1]).test(tab));
					rt=tab;
					reg=new RegExp(comment[j][1]);
					break;
				case 3:
					cond=(new RegExp(comment[j][1]).test(author));
					rt=author;
					reg=new RegExp(comment[j][1]);
					break;
			}
			if(cond){
				var resultText = comment[j][2].replace(/\{tab\}/g,tab)
					.replace(/\{author\}/g,author)
					.replace(/\{text\}/g,text)
					.replace(/\{color\}/g,color);
				if(reg!="") resultText = rt.match(reg)[0].replace(reg,resultText);
				div.innerHTML=resultText;
				break;
			}
		}
		if(!div.innerHTML) div.innerHTML=p.innerHTML;
		if(p.nextElementSibling!=null){
			var temp=p;
			p=p.nextElementSibling;
			document.body.insertBefore(div,temp);
			temp.remove();
		}else{
			document.body.insertBefore(div,p);
			p.remove();
			break;
		}
	}
});}}
