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

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function createHTML() {
    const prayerData = tobedeleted["data"]["Daily Prayer"]["data"];
    const jummaData = tobedeleted["data"]["Jumma"] ? tobedeleted["data"]["Jumma"]["data"] : [];
    const info = tobedeleted["data"]["Info"]["data"][0];
    const [lat, lon] = info.coordinates.split(',');
    const coordinates = new adhan.Coordinates(lat, lon);
    const calculationParams = adhan.CalculationMethod.NorthAmerica();

    // Handle Jumma Prayers
    if (jummaData && jummaData.length > 0) {
        createJummaHTML(jummaData);
    }

    // Set Daily Prayers Date Header
    const formattedDate = `${dayNames[today.getDay()]}, ${monthNames[today.getMonth()]} ${today.getDate()}`;
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

    // Set link for monthly schedule button
    const monthlyLink = document.getElementById('monthly-link');
    if (monthlyLink) {
        monthlyLink.href = `monthly3.html?masjidKey=${tobedeleted.masjidKey}`;
    }
}

function createJummaHTML(jummaData) {
    const jummaSection = document.getElementById('jumma-section');
    let jummaHtml = '';

    jummaData.forEach((jumma, index) => {
        const jummaNumber = jummaData.length > 1 ? ` ${index + 1}` : '';
        jummaHtml += `
            <table align="center" class="jumma-table">
                <thead>
                    <tr><th colspan="2">Jumma${jummaNumber}</th></tr>
                </thead>
                <tbody>
                    ${jumma.Khateeb ? `<tr><td class="prayer-name">Khateeb</td><td>${jumma.Khateeb}</td></tr>` : ''}
                    ${jumma.Khutba ? `<tr><td class="prayer-name">Khutba</td><td>${jumma.Khutba}</td></tr>` : ''}
                    ${jumma.Iqama ? `<tr><td class="prayer-name">Iqama</td><td>${jumma.Iqama}</td></tr>` : ''}
                    ${jumma.Language ? `<tr><td class="prayer-name">Language</td><td>${jumma.Language}</td></tr>` : ''}
                </tbody>
            </table>
        `;
    });

    if (jummaHtml) {
        jummaSection.innerHTML = jummaHtml;
        jummaSection.style.display = 'block';
    }
}

function setIqama(prayer, todayIqama, tomorrowIqama) {
    const iqamaCell = document.getElementById(`${prayer}-iqama`);
    let html = todayIqama || '';

    if (todayIqama && tomorrowIqama && todayIqama !== tomorrowIqama) {
        html += `<br><span class="tomorrow-change">Tomorrow: ${tomorrowIqama}</span>`;
    }

    iqamaCell.innerHTML = html;
}