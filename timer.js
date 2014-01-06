var previous_total = 0;
var time_opened;
var open = 0;

chrome.tabs.onUpdated.addListener( function callback( tabId, changeInfo, tab) {
  check_tabs();
});
chrome.tabs.onRemoved.addListener(function(){
  check_tabs();
});

check_tabs();

function check_tabs(){
  query = new Object();
  query.url = "*://*.facebook.com/*"
  chrome.tabs.query(query, function(tabs){
    if( tabs.length > 0){ // Facebook is open somewhere
      if( open == 0){ // If we just opened it:
        open = 1;
        // Record this as the time it was opened
        time_opened = new Date().getTime();
        console.log("Facebook opened at " + time_opened);
        
      }
    }
    if( tabs.length == 0){ // Facebook is not open
      if( open == 1){ // If we just closed it:
        open = 0;
        console.log("Facebook closed");
        // Store the duration it was open in previous_total
        previous_total += (new Date().getTime()) - time_opened;
      }
    }
  })
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
   update_badge(Math.floor((get_time() / (60 * 1000)) % 60));
}

function update_badge(minutes){
  console.log(minutes);
  details = new Object();
  details.text = "" + minutes
  chrome.browserAction.setBadgeText(details);
}
