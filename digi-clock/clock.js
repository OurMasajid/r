setInterval(digiclock_tick, 1000);
digiclock_tick()
function digiclock_tick() {
  let time = new Date().toLocaleTimeString().split(":");
  let secondsAmPm = time[2].split(" ");
  document.getElementById('digi-clock').innerHTML = `<div class='row'>
          <div class='col-7 text-right p-1'>
            <span class='title'>`+time[0] + ":" +time[1]+`</span>
          </div>
          <div class='col text-left m-auto'>
            <div class='row'>
              <div class='col p-0'>
                <span class='h1' style='line-height: 1;'>`+secondsAmPm[0]+`</span>
              </div>
            </div>
            <div class='row'>
              <div class='col p-0'>
                <span class='h2'>`+secondsAmPm[1]+`</span>
              </div>
            </div>
          </div>
        </div>`
}