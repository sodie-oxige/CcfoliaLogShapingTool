window.onload=function(){ if(document.title=="ccfolia - logs"){chrome.storage.local.get(null, function(result){
	if(result.html==undefined)result={"html":[[0,"css","div,p,span{\n\tpadding:0;margin:0;\n\tposition:relative;\n\tbox-sizing:border-box;\n}\nheader{\n\tposition:fixed;\n\ttop:0; left:0;\n\theight:1rem;\n\twidth:100%;\n\tbackground:black;\n\tcolor:white;\n\tfont-size:0.8em;\n\tz-index:1;\n}\nbody{\n\tmargin:1em auto 0;\n\tmax-width:1000px;\n\tword-break:keep-all;\n\tbackground-color:#eee;\n\toverflow-x:hidden;\n}\n.main,\n.chat{\n\tpadding:0.5em 0;\n\tdisplay:flex;\n\tgap:10px;\n\tborder-bottom:thin solid black;\n\tborder-image:linear-gradient(to right,white,silver 10%,silver 90%,white);\n\tborder-image-slice:1;\n}\n.main>p,\n.chat>p{\n\tmargin:auto 0;\n\theight:100%;\n}\n.chat>p{\n\tcolor:var(--c);\n}\n.main>p:first-child,\n.chat>p:first-child{\n\tmin-width:9em;\n\tmax-width:9em;\n\tpadding-left:0.5em;\n}\n.main::before,\n.chat::before{\n\tcontent:\"\";\n\tposition:absolute;\n\tleft:9em; top:4px;\n\twidth:2px; height:calc(100% - 8px);\n\tbackground-color:var(--c);\n}\n\n.main{\n\tbackground-color:white;\n}\n.chat{\n\tmargin-left:4em;\n\tbackground-color:#f8f8f8;\n}\n.info{\n\tmargin:5px;\n\tletter-spacing:0.1em;\n\tfont-weight:bold;\n\tfont-family:system-ui;\n}\n.info>span{\n\tfont-size:.8em;\n}\n.info>p{\n\ttext-align:center;\n}"],[0,"header","<p>{filename}</p>"],[0,"footer",""],[1,"system","\t<div class=\"info\" style=\"--c:{color}\">\n\t\t<p>{text}</p>\n\t</div>"],[0,"メイン","\t<div class=\"main\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[0,"雑談","\t<div class=\"chat\" style=\"--c:{color}\">\n\t\t<p>{author}</p>\n\t\t<p>{text}</p>\n\t</div>"],[0,"情報","\t<div class=\"info\" style=\"--c:{color}\">\n\t\t<span>{author}</span>\n\t\t<p>{text}</p>\n\t</div>"]]};
	const req=result.html;
	let css=req.shift(),
		header=req.shift(),
		footer=req.shift();
	css=css[2];
	header=decodeURI(header[2].replace(/\{filename\}/g,location.href.match(/(?<=\/)[^\/\.]+(?=\.[^\/\.]+)/)));
	footer=decodeURI(footer[2].replace(/\{filename\}/g,location.href.match(/(?<=\/)[^\/\.]+(?=\.[^\/\.]+)/)));
	document.head.innerHTML=document.head.innerHTML.replace(/(?<=<title>).+(?=<\/title>)/,decodeURI(location.href.match(/(?<=\/)[^\/\.]+(?=\.[^\/\.]+)/)))+"<style>"+css+"</style>";
	document.body.innerHTML="<header>"+header+"</header>" + document.body.innerHTML + "<footer>"+footer+"</footer>";
	let p=document.querySelector("body>p");
	while(p.tagName=="P"){
		const tab=p.children[0].textContent.replace(/\s\[|\]/g,""),
			author=p.children[1].textContent.replace(/[@＠・]/g,"$&<wbr>"),
			text=p.children[2].innerHTML,
			color=p.style.color;
		var div=document.createElement("div");
		div.classList.add("container");
		let check=false;
		for(var j=0;j<req.length;j++){
			switch(req[j][0]){
				case 0:
					if(tab==req[j][1]){
						div.innerHTML=req[j][2].replace(/\{tab\}/g,tab)
							.replace(/\{author\}/g,author)
							.replace(/\{text\}/g,text)
							.replace(/\{color\}/g,color);
						check=true;
					}
					break;
				case 1:
					if(author==req[j][1]){
						div.innerHTML=req[j][2].replace(/\{tab\}/g,tab)
							.replace(/\{author\}/g,author)
							.replace(/\{text\}/g,text)
							.replace(/\{color\}/g,color);
						check=true;
					}
					break;
			}
			if(check)break;
		}
		if(!check) div.innerHTML=p.innerHTML;
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
