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

const params = new URLSearchParams(location.search);
var tobedeleted = {
    masjidKey: params.get("masjidKey")
};
tobedeleted["dataurl"] = tobedeleted.masjidKey + "/data.json?cache=" + new Date().getTime();
tobedeleted["data"] = "";


/*program start here*/
showLoading();
loader("tobedeleted.data", tobedeleted.dataurl, "createHTML()");

selectedDate = new Date();
selectedDate.setDate(selectedDate.getDate() + 2);
var monthsData = [];
var tbodyString = "";
const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function createHTML() {
    let data = tobedeleted["data"]["Daily Prayer"]["data"];
    let month = selectedDate.getMonth() + 1;
    let dayNumber = 0;
    // $(".Date")[1].html("wow");
    for (let i = 0; i < data.length; i++) {
        if (month == data[i]["Month"]) {
            dayNumber++;
            $($(".Date").get(parseInt(dayNumber))).text(getDateToShow(data[i]["Month"],data[i]["Date"]));
            $($(".Day").get(parseInt(dayNumber))).text(getDayToShow(data[i]["Month"],data[i]["Date"]));
            $($(".Fajr").get(parseInt(dayNumber))).text(data[i]["Fajr"]);
            $($(".Sunrise").get(parseInt(dayNumber))).text(data[i]["Sunrise"]);
            $($(".Zuhr").get(parseInt(dayNumber))).text(data[i]["Zuhr"]);
            $($(".Asr").get(parseInt(dayNumber))).text(data[i]["Asr"]);
            $($(".Maghrib").get(parseInt(dayNumber))).text(data[i]["Maghrib"]);
            $($(".Esha").get(parseInt(dayNumber))).text(data[i]["Esha"]);

            $($(".fIqama").get(parseInt(dayNumber))).text(data[i]["fIqama"]);
            $($(".zIqama").get(parseInt(dayNumber))).text(data[i]["zIqama"]);
            $($(".aIqama").get(parseInt(dayNumber))).text(data[i]["aIqama"]);
            $($(".mIqama").get(parseInt(dayNumber))).text(data[i]["mIqama"]);
            $($(".eIqama").get(parseInt(dayNumber))).text(data[i]["eIqama"]);
        }
    }
    cleanUp();
}

function getDateToShow(month, date){
    return months[month] + " " + date;
}

function getDayToShow(month, date){
    return days[new Date(selectedDate.getFullYear(), month-1, date).getDay()];
}

function cleanUp(){
    $("tbody").html($("tbody").html().replace(/am/ig, '').replace(/pm/ig, ''));
    const info = tobedeleted["data"]["Info"]["data"][0];
    masjidname.innerHTML = info["name"];
    masjidaddress.innerHTML = info["address"] + " " + info["city"] + ", " + info["state"] + " " + info["zip"];
    hideLoading();
}