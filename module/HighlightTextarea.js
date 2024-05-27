export class HighlightTextarea {
	constructor(elem){
		this.element = elem;
	}

	createDOM(){
		this.container = doucment.createElement("div")
	}
}

/*
	style
	div.html
		├div
		└textarea.hilightTextarea

	textareaを置いとくと、ソレを包むように多要素を追加
	サイズは window.getComputedStyle($1).width で取得、window.onresizeで都度更新
*/


const pageName = location.pathname!="/"? location.pathname.substr(1): "index";
const textarea = document.querySelector("#editor>textarea");
fetch(`/page/${pageName}.html`)
	.then(res=> res.ok ? res.text() : "")
	.then(res=>{
		console.log(res)
		textarea.value = res;
		fitTextarea();
	})
textarea.addEventListener("keydown",function(e){
	console.log(e.key);
})
textarea.addEventListener("input",function(e){
	fitTextarea();
})
document.getElementById("editor").addEventListener("keydown",function(e){
	switch(e.key){
		case "Tab"://タブ文字入力
			let newPos = textarea.selectionStart + 1;
			let value = textarea.value;
			let head = value.slice(0,textarea.selectionStart);
			let foot = value.slice(textarea.selectionEnd);
			textarea.value = head + '\t' + foot;
			textarea.setSelectionRange(newPos,newPos);
			e.preventDefault();
			fitTextarea();
			break;
		case "s"://保存
			if(!e.ctrlKey) return;
			formSubmit(e);
			e.preventDefault();
	}
});

//form送信
document.querySelector("#edit>button[type='submit']").addEventListener("click", function(e){
	formSubmit();
	e.preventDefault();
});
function setRow(elem){
	while(elem){
		console.log(elem)
		elem.children[0].textContent = Number(elem.previousElementSibling.children[0].textContent)+1;
		elem = elem.nextElementSibling;
	}
}

//入力ごとに動かすぞぞぞ
function fitTextarea(){
	//高さ調整
	textarea.style.height = "0px";
	let scrollHeight = textarea.scrollHeight;
	textarea.style.height = `${scrollHeight}px`;
	let rownumber = Math.round(Number(scrollHeight/(16*1.3)));
	console.log(rownumber);
	//preに落とし込む
	var vals = textarea.value.split("\n");
	var elems = document.querySelectorAll("#editor>div>pre");
	var i;
	for(i=0; i<vals.length; i++){
		var text = vals[i]
			.replace(/&/g,"&amp;")
			.replace(/;/g,"&#0059;")
			.replace(/&amp&#0059;/g,"&amp;")
			.replace(/</g,"&lt;")
			.replace(/>/g,"&gt;")
			.replace(/"/g,"&quot;")//"
			.replace(/'/g,"&apos;")//'
			.replace(/ /g,"&#x20;")
			.replace(/(?<=&lt;\/?)(?!\/)([a-zA-Z\d])+(?=&gt;|&#x20;|\s)/g,"<span class='red'>$&</span>")
			.replace(/(?<=&lt;(?!&gt;)[\s\S]*)&quot;((?!&quot;)[\s\S])*&quot;/g,"<span class='green'>$&</span>")
			.replace(/(?<=&lt;(?!&gt;)[\s\S]*)&apos;((?!&apos;)[\s\S])*&apos;/g,"<span class='green'>$&</span>")
			.replace(/(?<=^|&gt;)((?!&lt;)(?!&gt;)[\s\S])+(?=$|&lt;)/g,"<span class='bold'>$&</span>")
			.replace(/\t/g,"<span class='tab'>｜</span>")
			.replace(/&#x20;/g,"<span class='tab'>_</span>")
		if(i < elems.length){
			elems[i].innerHTML = text;
		}else{
			var div = document.createElement("div");
			var span = document.createElement("span");
			span.innerHTML = i+1;
			var pre = document.createElement("pre");
			pre.innerHTML = text;
			div.appendChild(span);
			div.appendChild(pre);
			document.getElementById("editor").appendChild(div);
		}
	}
	for(; i<elems.length; i++){
		elems[i].parentElement.remove();
	}
}

//form送信
function formSubmit(){
	const form = new FormData();
	var text = textarea.value;
	form.append('markup', text);
	fetch("" , {
		method: "POST",
		body: form
	}).then(
		console.log("OK!")
	)
}

//画像アップローダー
document.querySelector('#image>input[type="file"]').addEventListener("change", function(e){
	var fileReader = new FileReader();
	fileReader.onload = (function() {
		document.querySelector('#image>img').src = fileReader.result;
	});
	fileReader.readAsDataURL(e.currentTarget.files[0]);
})
