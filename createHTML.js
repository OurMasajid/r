var url = "https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vTtTotyMaOJLmoLQCgHv1bIueVlXdUNS8iBJBXeI4zLWe8Txw5egQTQeYSYiwiB5fRJ2l6niJphlqrz/pub?gid=0&single=true&output=csv";
setTimeout(() => {
    Papa.parse(url, {
        download: true,
        complete: function(results) {
        createHTML(results.data);
    }
}, 0);

	
});
var monthsData = [];
var tbodyString = "";
function createHTML(data){
    var date = new Date();
    date.setDate(date.getDate() + 3);
    var month = date.getMonth() + 1;
    for (let row = 0; row < data.length; row++) {
        if (month == data[row][0]) {/* if current month */
            tbodyString+="<tr>";
            for (let col = 1; col < data[row].length - 1; col++) {
                tbodyString+="<td>"+data[row][col]+"</td>";
            } 
            tbodyString+="</tr>";
        }
              
    }
    tbodyString = tbodyString.replace(/am/ig, '');
    tbodyString = tbodyString.replace(/pm/ig, '');
    tbodyString = tbodyString.replace(/a.m./ig, '');
    tbodyString = tbodyString.replace(/p.m./ig, '');
    $("tbody").append(tbodyString);
}
