function loader(vartosaveto, url, callback) {
 var xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
     eval(vartosaveto +"="+ this.responseText);
     eval(callback);
   }
 };
 xhttp.open("GET", url, true);
 xhttp.send();
}
var tobedeleted = {
 "masjidKey" : window.location.href.split("?")[1]
};
//tobedeleted["dataurl"] = "https://ourmasajid.github.io/d/"+tobedeleted.masjidKey+".json";
tobedeleted["dataurl"] = "https://ourmasajid.github.io/d/icrr-cal.json";
tobedeleted["data"]= "";
tobedeleted["dayHTML"]= "<div class='py-3'><div class='container'><div class='card'><div class='card-header lead'> {date}</div><div class='card-body'> {events}</div></div></div></div>";
tobedeleted["eventHTML"]= "<div class='row'><div class='col-3 timecol' style='padding-right:0'><div><div class='eventtime'>{time}</div><div style='margin-top: -10px'>{ampm}</div> <span class='eventduration'>{duration}</span></div></div><div class='col-9' style='padding-left:5px'><h5 class='card-title mb-0'>{title}</h5><p class='mt-0' style='font-size: 14px; color:gray;'>{location}</p><p class='card-text'> {description}</p></div></div>";

/*program start here*/
showLoading();
loader("tobedeleted.data", tobedeleted.dataurl, "createHTML()");

function createHTML(){
 let resultHTML = "";
 const dayHTML = tobedeleted["dayHTML"];
 const eventHTML = tobedeleted["eventHTML"];
 let data = tobedeleted["data"];
 let lastDate = "";
 for (let i = 0; i < data.length; i++) {
  const obj = data[i];
  if (lastDate != obj["starttime"].substring(0,10)) {
   resultHTML=resultHTML.replace("<hr>{events}","");
   resultHTML+=dayHTML;
   let niceDate = getNiceDate(obj["starttime"]);
   resultHTML=resultHTML.replace("{date}",niceDate);
   resultHTML=resultHTML.replace("{events}",eventHTML+"<hr>{events}");
  }
  else{
   resultHTML=resultHTML.replace("{events}",eventHTML+"<hr>{events}");
  }

  resultHTML=resultHTML.replace("{time}",getStarttime(obj["starttime"]));
  resultHTML=resultHTML.replace("{ampm}",getAmpm(obj["starttime"]));
  resultHTML=resultHTML.replace("{duration}",getDuration(obj["starttime"], obj["endtime"]));
  resultHTML=resultHTML.replace("{title}",obj["title"]);
  resultHTML=resultHTML.replace("{location}",obj["location"]);
  resultHTML=resultHTML.replace("{description}",obj["description"]);

  lastDate = obj["starttime"].substring(0,10);
 }
 resultHTML=resultHTML.replace("<hr>{events}","");
 $("body").append(resultHTML);
 hideLoading();
}
function getNiceDate(dateString){
 return new Date(dateString).toString().substring(0,15);
}
function getStarttime(dateString){
 let min = new Date(dateString).toString().substring(18,21);
 let result = new Date(dateString).toString().substring(16,18);
 if (result>12) {
  result = result - 12;
 }
 return result+min;
}
function getAmpm(dateString){
 let result = new Date(dateString).toString().substring(16,18);
 if (result>12) {
  return "pm";
 }
 return "am";
}
function getDuration(startString, endString){
 let dates = new Date(startString);
 let datee = new Date(endString);
 let diff = datee-dates;
 let days = Math.floor(diff / (1000 * 60 * 60 * 24));
 diff -=  days * (1000 * 60 * 60 * 24);
 
 let hours = Math.floor(diff / (1000 * 60 * 60));
 diff -= hours * (1000 * 60 * 60);
 
 let mins = Math.floor(diff / (1000 * 60));
 diff -= mins * (1000 * 60);
 let result = "";
 if (days>0){
  result+=day+"d ";
 }
 if (hours>0){
  result+=hours+"h ";
 }
 if (mins>0){
  result+=mins+"m ";
 }
 return result;
}