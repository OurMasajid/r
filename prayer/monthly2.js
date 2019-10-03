/* TODO when months dont have 31 days hide extra rows */
function loader(vartosaveto, url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            eval(vartosaveto + "=" + this.responseText);
            eval(callback);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

let url = new URL(location);
let params = new URLSearchParams(location.search);
var tobedeleted = {
    masjidKey: params.get("masjidKey")
};
tobedeleted["dataurl"] = tobedeleted.masjidKey + "/data.json?cache=" + new Date().getTime();
tobedeleted["data"] = "";


/*program start here*/
loader("tobedeleted.data", tobedeleted.dataurl, "createHTML()");

selectedDate = new Date();

if (params.has('month') === true) {
    selectedDate.setMonth(parseInt(params.get("month")-1));
}
else {
    selectedDate.setDate(selectedDate.getDate() + 2);
}
var monthsData = [];
var tbodyString = "";
const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


document.getElementById("selectedMonth").value = selectedDate.getMonth() + 1;


function createHTML() {
    let data = tobedeleted["data"]["Daily Prayer"]["data"];
    let month = selectedDate.getMonth() + 1;
    let dayNumber = 0;
    // $(".Date")[1].html("wow");
    for (let i = 0; i < data.length; i++) {
        if (month == data[i]["Month"]) {
            dayNumber++;
            $($(".Date").get(dayNumber)).text(getDateToShow(data[i]["Month"],data[i]["Date"]));
            $($(".Day").get(dayNumber)).text(getDayToShow(data[i]["Month"],data[i]["Date"]));
            $($(".Fajr").get(dayNumber)).text(data[i]["Fajr"]);
            $($(".Sunrise").get(dayNumber)).text(data[i]["Sunrise"]);
            $($(".Zuhr").get(dayNumber)).text(data[i]["Zuhr"]);
            $($(".Asr").get(dayNumber)).text(data[i]["Asr"]);
            $($(".Maghrib").get(dayNumber)).text(data[i]["Maghrib"]);
            $($(".Esha").get(dayNumber)).text(data[i]["Esha"]);

            $($(".fIqama").get(dayNumber)).text(data[i]["fIqama"]);
            $($(".zIqama").get(dayNumber)).text(data[i]["zIqama"]);
            $($(".aIqama").get(dayNumber)).text(data[i]["aIqama"]);
            $($(".mIqama").get(dayNumber)).text(data[i]["mIqama"]);
            $($(".eIqama").get(dayNumber)).text(data[i]["eIqama"]);
        }
    }
    cleanUp(dayNumber);
}

function getDateToShow(month, date){
    return months[month] + " " + date;
}

function getDayToShow(month, date){
    return days[new Date(selectedDate.getFullYear(), month-1, date).getDay()];
}

function cleanUp(dayNumber){
    $("tbody").html($("tbody").html().replace(/am/ig, '').replace(/pm/ig, ''));
    const info = tobedeleted["data"]["Info"]["data"][0];
    masjidname.innerHTML = info["name"];
    masjidaddress.innerHTML = info["address"] + " " + info["city"] + ", " + info["state"] + " " + info["zip"];
    //hiding extra rows
    while (dayNumber<31) {//if true there are rows to hide
        dayNumber++;
        $($(".Date").get(dayNumber)).parent().hide();
    }
}

/* ui triggers */



function monthChanged(){
    params.set("month", document.getElementById("selectedMonth").value);
    let newUrl = location.protocol + "//" + location.hostname;
    if(location.port != ""){
        newUrl += ":" + location.port;
    }
    newUrl += location.pathname + "?"+ params.toString();
    window.location = newUrl;
}