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

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function createHTML() {
    const prayerData = tobedeleted["data"]["Daily Prayer"]["data"];
    const info = tobedeleted["data"]["Info"]["data"][0];
    const [lat, lon] = info.coordinates.split(',');
    const coordinates = new adhan.Coordinates(lat, lon);
    const calculationParams = adhan.CalculationMethod.NorthAmerica();

    // Set Date Header
    const formattedDate = `${dayNames[today.getDay()]}, ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
    document.getElementById('date-header').textContent = formattedDate;

    const formatTime = (time) => {
        return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(' ', '');
    };

    const getIqamaForDate = (date) => {
        let applicableIqama = {};
        for (const change of prayerData) {
            const changeDate = new Date(change.Date);
            if (changeDate <= date) {
                applicableIqama = {
                    fIqama: change.Fajr_Iqamah,
                    zIqama: change.Zuhr_Iqamah,
                    aIqama: change.Asr_Iqamah,
                    mIqama: change.Maghrib_Iqamah,
                    eIqama: change.Esha_Iqamah
                };
            } else {
                break;
            }
        }
        return applicableIqama;
    };

    // Get prayer times for today and tomorrow
    const todayPrayerTimes = new adhan.PrayerTimes(coordinates, today, calculationParams);
    const todayIqamaTimes = getIqamaForDate(today);
    const tomorrowIqamaTimes = getIqamaForDate(tomorrow);

    // Populate Adhan Times
    document.getElementById('fajr-adhan').textContent = formatTime(todayPrayerTimes.fajr);
    document.getElementById('sunrise-adhan').textContent = formatTime(todayPrayerTimes.sunrise);
    document.getElementById('zuhr-adhan').textContent = formatTime(todayPrayerTimes.dhuhr);
    document.getElementById('asr-adhan').textContent = formatTime(todayPrayerTimes.asr);
    document.getElementById('maghrib-adhan').textContent = formatTime(todayPrayerTimes.maghrib);
    document.getElementById('esha-adhan').textContent = formatTime(todayPrayerTimes.isha);

    // Populate Iqama Times and check for changes
    setIqama('fajr', todayIqamaTimes.fIqama, tomorrowIqamaTimes.fIqama);
    setIqama('zuhr', todayIqamaTimes.zIqama, tomorrowIqamaTimes.zIqama);
    setIqama('asr', todayIqamaTimes.aIqama, tomorrowIqamaTimes.aIqama);
    setIqama('maghrib', todayIqamaTimes.mIqama, tomorrowIqamaTimes.mIqama);
    setIqama('esha', todayIqamaTimes.eIqama, tomorrowIqamaTimes.eIqama);
}

function setIqama(prayer, todayIqama, tomorrowIqama) {
    const iqamaCell = document.getElementById(`${prayer}-iqama`);
    let html = todayIqama || '';

    if (todayIqama && tomorrowIqama && todayIqama !== tomorrowIqama) {
        html += `<br><span class="tomorrow-change">Tomorrow: ${tomorrowIqama}</span>`;
    }

    iqamaCell.innerHTML = html;
}