chrome.action.onClicked.addListener(function(){
	var c=false;
	chrome.tabs.query({},function(t){
	for(e of t){
		if(e.url=="chrome-extension://"+chrome.runtime.id+"/option.html") c=e.id;
	}
	if(c){
		chrome.tabs.update(c,{"active":true});
	}else{
		chrome.tabs.create({url: "chrome-extension://"+chrome.runtime.id+"/option.html"});
	}
	});
});