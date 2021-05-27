function whatsTheCurrentPrayer() {
  if (!info ||
    !info["data"] ||
    !info["data"]["Daily Prayer"] ||
    !info["data"]["Daily Prayer"]["data"]) {
    return false;
  }
  let data = info["data"]["Daily Prayer"]["data"];
  let todaysData = "";
  for (let i = 0; i < data.length; i++) {
    //looking at todays data
    if (today.getMonth() + 1 == data[i]["Month"] && today.getDate() == data[i]["Date"]) {
      todaysData = data[i];
      break;
    }
  }
  
  if (isCloseToThisTime(todaysData["Fajr"], 15) ||
      isCloseToThisTime(todaysData["fIqama"], 50)) {
    return "Fajr";
  }
  if (isCloseToThisTime(todaysData["Sunrise"], 10)) {
    return "Sunrise";
  }
  if (isCloseToThisTime(todaysData["Zuhr"], 15) ||
      isCloseToThisTime(todaysData["zIqama"], 50)) {
    return "Zuhr";
  }
  if (isCloseToThisTime(todaysData["Asr"], 15) ||
      isCloseToThisTime(todaysData["aIqama"], 30)) {
    return "Asr";
  }
  if (isCloseToThisTime(todaysData["Maghrib"], 10) ||
      isCloseToThisTime(todaysData["mIqama"], 30)) {
    return "Maghrib";
  }
  if (isCloseToThisTime(todaysData["Esha"], 10) ||
      isCloseToThisTime(todaysData["eIqama"], 25)) {
    return "Esha";
  }
}
function isCloseToThisTime(givenTimeInString = "12:30 AM", time = 15) {
  let givenTime = getDateObjFromStringTime(givenTimeInString);
  console.log(diff_minutes(new Date(), givenTime));
  if (diff_minutes(new Date(), givenTime) < time ) {
    return true;
  }
  return false;
}
function getDateObjFromStringTime(timeString = "12:30 AM") {
  let hour = timeString.split(":")[0];
  //add 12 if PM
  if (timeString.split(":")[1].split(" ")[1].indexOf("PM") > -1) {
    hour = hour + 12;
  }
  let minute = timeString.split(":")[1].split(" ")[0];
  let dateObj = new Date();
  dateObj.setHours(hour,minute);
  return dateObj;
}
function diff_minutes(dt2, dt1) 
 {
  let diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
  
 }