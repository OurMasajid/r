// <!DOCTYPE html>
// <html lang="en">
// <head>
// 	<link rel="stylesheet" href="style.css">
// 	<script src="index.js"></script>
// </head>
// <body>
// 	<div id="analog-clock">
// 		<div id="hour"></div>
// 		<div id="minute"></div>
// 		<div id="second"></div>
// 	</div>
// </body>
// </html>

document.getElementById('analog-clock').innerHTML =
	"<div id='clockhour'></div>"+
	"<div id='clockminute'></div>"+
  "<div id='clocksecond'></div>"+
  "<div id='clockround'></div>"
  ;
  
setInterval(() => {
    d = new Date(); //object of date()
    hr = d.getHours();
    min = d.getMinutes();
    sec = d.getSeconds();
    hr_rotation = 30 * hr + min / 2; //converting current time
    min_rotation = 6 * min;
		sec_rotation = 6 * sec;
		
    clockhour.style.transform = `rotate(${hr_rotation}deg)`;
    clockminute.style.transform = `rotate(${min_rotation}deg)`;
    clocksecond.style.transform = `rotate(${sec_rotation}deg)`;
}, 1000);