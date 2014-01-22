var views = chrome.extension.getViews();
for (var i = 0; i < views.length; i++) {
  if (views[i].location.pathname == "/_generated_background_page.html"){
    var view = views[i]
  }
}

timers = document.getElementById("timers");

urls = view.get_urls();
console.log(urls)

// Update every second while it's open
setInterval(update, 1000)
update();



function update(){
	timers.innerHTML = ""
	// for each url
		// string = "" + url + ":" + time
		// text = document.createTextNode(string)
		// get div by id timers
		// append child : text element to the returned element
	for (index = 0; index < urls.length; index++){
		string = "" + urls[index][1] + " : " + get_time(index)
		text = document.createTextNode(string)
		node = document.createElement("span")
		node.appendChild(text)
		// make a span
		// append text to span note
		// switch timers append to append span instead of text
		timers.appendChild(node)
		timers.appendChild(document.createElement("br"))
	}

}

function get_time(index){
  milli = view.get_time(index);

  var seconds = Math.floor((milli / 1000) % 60);
  var minutes = Math.floor((milli / (60 * 1000)) % 60);
  var hours = Math.floor((milli / (1000*60*60) ));

  return hours + ":" + minutes + ":" + seconds 

}
