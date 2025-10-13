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
    selectedDate.setMonth(parseInt(params.get("month") - 1));
}
else {
    selectedDate.setDate(selectedDate.getDate() + 2);
}
var monthsData = [];
var tbodyString = "";
const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


document.getElementById("selectedMonth").value = selectedDate.getMonth() + 1;


function createHTML() {
    const prayerData = tobedeleted["data"]["Daily Prayer"]["data"];
    const info = tobedeleted["data"]["Info"]["data"][0];
    const [lat, lon] = info.coordinates.split(',');
    const coordinates = new adhan.Coordinates(lat, lon);
    const calculationParams = adhan.CalculationMethod.NorthAmerica();

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth(); // 0-indexed month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    scheduleTitle.innerHTML = `${fullMonths[month]} ${year}`;

    let tbodyHtml = "";

    const formatTime = (time) => {
        return time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };
    
    const getIqamaForDate = (date) => {
        let applicableIqama = {};
        // Find the most recent Iqama time change on or before the given date
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
                break; // The prayerData is sorted by date, so we can stop.
            }
        }
        return applicableIqama;
    };
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const prayerTimes = new adhan.PrayerTimes(coordinates, date, calculationParams);
        const iqamaTimes = getIqamaForDate(date);

        tbodyHtml += `
            <tr>
                <td class="Date">${day} (${getDayToShow(month + 1, day)})</td>
                <td class="Fajr">${formatTime(prayerTimes.fajr)}</td>
                <td class="fIqama">${iqamaTimes.fIqama || ''}</td>
                <td class="Sunrise">${formatTime(prayerTimes.sunrise)}</td>
                <td class="Zuhr">${formatTime(prayerTimes.dhuhr)}</td>
                <td class="zIqama">${iqamaTimes.zIqama || ''}</td>
                <td class="Asr">${formatTime(prayerTimes.asr)}</td>
                <td class="aIqama">${iqamaTimes.aIqama || ''}</td>
                <td class="Maghrib">${formatTime(prayerTimes.maghrib)}</td>
                <td class="mIqama">${iqamaTimes.mIqama || ''}</td>
                <td class="Esha">${formatTime(prayerTimes.isha)}</td>
                <td class="eIqama">${iqamaTimes.eIqama || ''}</td>
            </tr>
        `;
    }

    $("tbody").html(tbodyHtml);

    // Merge Iqama cells
    mergeAllIqamaCells();

    cleanUp(daysInMonth);
}

function mergeAllIqamaCells() {
    const dataTrs = $("tbody tr");
    const iqamaClasses = ["fIqama", "zIqama", "aIqama", "mIqama", "eIqama"];
    let prevIqamaSet = null;
    let firstRowOfSet = null;
    let rowspan = 1;

    function applyRowspan() {
        if (rowspan > 1 && firstRowOfSet) {
            iqamaClasses.forEach(cls => {
                $(firstRowOfSet).find('.' + cls).attr('rowspan', rowspan);
            });
        }
    }

    dataTrs.each(function() {
        const currentRow = $(this);
        const currentIqamaSet = iqamaClasses.map(cls => currentRow.find('.' + cls).html()).join('|');

        if (prevIqamaSet !== null && currentIqamaSet === prevIqamaSet) {
            rowspan++;
            iqamaClasses.forEach(cls => currentRow.find('.' + cls).remove());
        } else {
            applyRowspan();
            prevIqamaSet = currentIqamaSet;
            firstRowOfSet = currentRow;
            rowspan = 1;
        }
    });

    applyRowspan(); // Apply rowspan for the last set of rows
}

function getDateToShow(month, date) {
    return months[month] + " " + date;
}

function getDayToShow(month, date) {
    return days[new Date(selectedDate.getFullYear(), month - 1, date).getDay()];
}

function cleanUp(dayNumber) {
    $("tbody").html($("tbody").html().replace(/am/ig, '').replace(/pm/ig, ''));
    const info = tobedeleted["data"]["Info"]["data"][0];
    masjidname.innerHTML = info["name"];
    masjidaddress.innerHTML = info["address"] + " " + info["city"] + ", " + info["state"] + " " + info["zip"];
    footer.innerHTML = info["dp_footer"] || "";
}

/* ui triggers */

function monthChanged() {
    params.set("month", document.getElementById("selectedMonth").value);
    let newUrl = location.protocol + "//" + location.hostname;
    if (location.port != "") {
        newUrl += ":" + location.port;
    }
    newUrl += location.pathname + "?" + params.toString();
    window.location = newUrl;
}