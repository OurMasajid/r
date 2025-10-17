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
    const showHijriParam = params.get('showHijri');
    const showHijri = showHijriParam === 'true';
    document.getElementById('showHijri').checked = showHijri;

    if (!showHijri) {
        document.querySelector('th.islamicDate').style.display = 'none';
    }

    const hijriAdjustment = parseInt(params.get('hijriAdjustment')) || 0;
    document.getElementById('hijriAdjustment').value = hijriAdjustment;

    const prayerData = tobedeleted["data"]["Daily Prayer"]["data"];
    const info = tobedeleted["data"]["Info"]["data"][0];
    const [lat, lon] = info.coordinates.split(',');
    const coordinates = new adhan.Coordinates(lat, lon);
    const calculationParams = adhan.CalculationMethod.NorthAmerica();

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth(); // 0-indexed month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    scheduleTitle.innerHTML = `${fullMonths[month]} ${year} Daily Prayer Schedule`;
    document.querySelector('th.Date').innerHTML = months[month + 1];

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

        const adjustedDate = new Date(date);
        adjustedDate.setDate(adjustedDate.getDate() + hijriAdjustment);
        const islamicDate = new Intl.DateTimeFormat('en-US-u-ca-islamic', { day: 'numeric', month: 'numeric' }).format(adjustedDate);

        tbodyHtml += `
            <tr>
                <td class="Date">${day} (${getDayToShow(month + 1, day)})</td>
                ${showHijri ? `<td class="islamicDate">${islamicDate}</td>` : ''}
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

    // Apply alternating row highlighting
    applyAlternatingHighlight();

    // Highlight current day
    highlightCurrentDay();

    cleanUp(daysInMonth);
}

function mergeAllIqamaCells() {
    const dataTrs = $("tbody tr");
    const iqamaClasses = ["fIqama", "zIqama", "aIqama", "mIqama", "eIqama"];
    let prevIqamaSet = null;
    let firstRowOfSet = null;
    let rowspan = 1;
    let groupId = 0;

    function applyRowspan() {
        if (rowspan > 1 && firstRowOfSet) {
            iqamaClasses.forEach(cls => {
                $(firstRowOfSet).find('.' + cls).attr('rowspan', rowspan);
            });
        }
    }

    dataTrs.each(function () {
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
            groupId++;
        }
        $(this).attr('data-iqama-group', groupId);
    });

    applyRowspan(); // Apply rowspan for the last set of rows
}

function applyAlternatingHighlight() {
    let lastGroupId = -1;
    $("tbody tr").each(function() {
        const row = $(this);
        const groupId = parseInt(row.attr('data-iqama-group'));
        if (groupId !== lastGroupId) {
            const groupClass = (groupId % 2 === 0) ? 'even-group' : 'odd-group';
            $(`tr[data-iqama-group="${groupId}"]`).addClass(groupClass);
            lastGroupId = groupId;
        }
    });
}

function highlightCurrentDay() {
    const today = new Date();
    // only highlight if the month is the current month
    if (today.getMonth() !== selectedDate.getMonth() || today.getFullYear() !== selectedDate.getFullYear()) {
        return;
    }

    const dayOfMonth = today.getDate();
    const dataTrs = $("tbody tr");

    dataTrs.each(function() {
        const row = $(this);
        const dateCellText = row.find('.Date').text(); // e.g. "1 (Mon)"
        const day = parseInt(dateCellText.split(' ')[0]);

        if (day === dayOfMonth) {
            const groupId = row.attr('data-iqama-group');
            $(`tr[data-iqama-group="${groupId}"]`).addClass('highlight-group');
            return false; // break the loop
        }
    });
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

function toggleHijri() {
    const showHijriCheckbox = document.getElementById('showHijri');
    params.set('showHijri', showHijriCheckbox.checked);
    let newUrl = location.protocol + "//" + location.hostname;
    if (location.port != "") {
        newUrl += ":" + location.port;
    }
    newUrl += location.pathname + "?" + params.toString();
    window.location = newUrl;
}

function hijriAdjustmentChanged() {
    const adjustment = document.getElementById('hijriAdjustment').value;
    params.set('hijriAdjustment', adjustment);
    let newUrl = location.protocol + "//" + location.hostname;
    if (location.port != "") {
        newUrl += ":" + location.port;
    }
    newUrl += location.pathname + "?" + params.toString();
    window.location = newUrl;
}