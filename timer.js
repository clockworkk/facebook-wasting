var previous_total = 0;
var time_opened;
var open = 0;

chrome.tabs.onUpdated.addListener( function callback( tabId, changeInfo, tab) {
  check_tabs();
});
chrome.tabs.onRemoved.addListener(function(){
  check_tabs();
});
chrome.tabs.onActivated.addListener(function(){
  check_tabs();
});
chrome.idle.onStateChanged.addListener(function(status){
  console.log(status)
  if( status == "locked" || status == "idle" ){
    facebook_closed();
  }
  else if (status == "active"){
    check_tabs();
  }
  else{
    console.log("Error: Some other status logged...", status)
  }
});
check_tabs();

function check_tabs(){
  query = new Object();
  query.active = true
  query.url = "*://*.facebook.com/*"
  chrome.tabs.query(query, function(tabs){
    if( tabs.length > 0){ // Facebook is open somewhere
      facebook_opened();
    }
    if( tabs.length == 0){ // Facebook is not open
      facebook_closed();
    }
  })
}

function facebook_opened(){
  if( open == 0){ // If we just opened it:
    open = 1;
    // Record this as the time it was opened
    time_opened = new Date().getTime();
    console.log("Facebook active at " + time_opened);
  }
}
function facebook_closed(){
  if( open == 1){ // If we just closed it:
    open = 0;
    console.log("Facebook deactivated");
    // Store the duration it was open in previous_total
    previous_total += (new Date().getTime()) - time_opened;
  }
}

function get_time(){
  if( open == 1){
    return previous_total + (new Date().getTime()) - time_opened;
  }
  else{
    return previous_total;
  }
}

setInterval(calculate_badge, 30000);
calculate_badge();

function calculate_badge(){
   update_badge(Math.floor(get_time() / (60 * 1000)));
}

function update_badge(minutes){
  details = new Object();
  details.text = "" + minutes
  chrome.browserAction.setBadgeText(details);
}
