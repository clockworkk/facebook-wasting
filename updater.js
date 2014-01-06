var views = chrome.extension.getViews();
for (var i = 0; i < views.length; i++) {
  if (views[i].location.pathname == "/_generated_background_page.html"){
    var view = views[i]
  }
}

timer = document.getElementById("timer");

// Update every second while it's open
setInterval(update, 1000)
update();

function update(){
  milli = view.get_time();

  var seconds = Math.floor((milli / 1000) % 60);
  var minutes = Math.floor((milli / (60 * 1000)) % 60);
  var hours = Math.floor((milli / (1000*60*60) )%24);
  view.update_badge(minutes + hours*60 );

  timer.innerHTML = hours + ":" + minutes + ":" + seconds;
}
