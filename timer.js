var previous_total = [0,0];
var time_opened = new Array(2);
var open = [0,0];
var urls = [
  ["*://*.facebook.com/*", "Facebook"],
  ["*://*.twitter.com/*", "Twitter"]
]


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
  for(index = 0; index < urls.length; index++){
    tabs_aysnch_call(index, urls[index][0]);
  }
}

function get_urls(){
  return urls
}

function tabs_aysnch_call(index, url){
  query = new Object()
  query.active = true
  query.url = url;
  chrome.tabs.query(query, function(tabs){
    if( tabs.length > 0){ // Facebook is open somewhere)
      facebook_opened(index);
    }
    if( tabs.length == 0){ // Facebook is not open
      facebook_closed(index);
    }
  })
}

function facebook_opened(index){
  if(open[index] == 0){ // If we just opened it:
    open[index] = 1;
    console.log(urls[index][0] + " has activated")
    // Record this as the time it was opened
    time_opened[index] = new Date().getTime();
    console.log("Sites active at " + time_opened[index]);
  }
}
function facebook_closed(index){
  if( open[index] == 1){ // If we just closed it:
    open[index] = 0;
    console.log(urls[index][0] + " has deactivated");
    // Store the duration it was open in previous_total
    previous_total[index] += (new Date().getTime()) - time_opened[index];
    console.log("All sites deactivated " + time_opened[index])
  }
}

function get_time(index){
  if( open[index] == 1){
    return previous_total[index] + (new Date().getTime()) - time_opened[index];
  }
  else{
    return previous_total[index];
  }
}

setInterval(calculate_badge, 15000);
calculate_badge();

function calculate_badge(){
  total = 0
  for(index = 0;  index < urls.length; index++){
    // console.log(urls[index][0], index, get_time(index))
    total += get_time(index);
  }    

  // For each url
    // total + =get time ( their index )
  // update_badge(total)

   update_badge( Math.floor(get_time(0) / (60*1000)) );
}

function update_badge(minutes){
  details = new Object();
  details.text = "" + minutes
  chrome.browserAction.setBadgeText(details);
}
