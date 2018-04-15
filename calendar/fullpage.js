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
tobedeleted["eventHTML"]= "<div class='row'><div class='col-3' style='padding-right:0'><div class=''><div class='eventtime' style='font-size: 26px;'>{time}</div><div style='margin-top: -10px'>{ampm}</div> <span class='eventtime' style='font-size: 26px; color: gray;'>{duration}</span></div></div><div class='col-9' style='padding-left:5px'><h5 class='card-title mb-0'>{title}</h5><p class='mt-0' style='font-size: 14px; color:gray;'>{location}</p><p class='card-text'> {description}</p></div></div><hr>";

/*program start here*/
showLoading();
loader("tobedeleted.data", tobedeleted.dataurl, "createHTML()");

function createHTML(){
 const dayHTML = tobedeleted["dayHTML"];
 const eventHTML = tobedeleted["eventHTML"];
 let data = tobedeleted["data"];
 for (let i = 0; i < data.length; i++) {
  const obj = data[i];
    
 }
}