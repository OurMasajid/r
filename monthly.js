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
tobedeleted["dataurl"] = "https://ourmasajid.github.io/d/"+tobedeleted.masjidKey+".json";
tobedeleted["sheetid"] = masajidList[tobedeleted.masjidKey];
tobedeleted["data"]= "";
    

/*program start here*/
showLoading();
loader("tobedeleted.data", tobedeleted.dataurl, "createHTML()");


var monthsData = [];
var tbodyString = "";
var months = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function createHTML(){
    var data = tobedeleted["data"]["Daily Prayer"]["data"];
    var aData = [];
    for (let i = 0; i < data.length; i++) {
        aData.push([]);
        for(var key in data[i].keys()){
            aData[i].push(data[i][key])	;
        }
    }
    console.log(aData);
    // var date = new Date();
    // date.setDate(date.getDate() + 3);
    // var month = date.getMonth() + 1;
    // for (let row = 0; row < data.length; row++) {
    //     if (month == data[row][0]) {/* if current month */
    //         tbodyString+="<tr>";
    //         data[row][1] = months[data[row][0]] + " "+ data[row][1];
    //         for (let col = 1; col < data[row].length - 1; col++) {
    //             tbodyString+="<td>"+data[row][col]+"</td>";
    //         } 
    //         tbodyString+="</tr>";
    //     }
              
    // }
    // tbodyString = tbodyString.replace(/am/ig, '');
    // tbodyString = tbodyString.replace(/pm/ig, '');
    // tbodyString = tbodyString.replace(/a.m./ig, '');
    // tbodyString = tbodyString.replace(/p.m./ig, '');
    // $("tbody").append(tbodyString);
    hideLoading();
}
