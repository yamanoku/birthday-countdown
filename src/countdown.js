class CountdownTimer {
    constructor() {
        this.initialize(...arguments);
    }
    initialize(tl, mes) {
        this.tl = tl;
        this.mes = mes;
    }
    countDown() {
        const today = new Date();
        const day = Math.floor((this.tl - today) / (24 * 60 * 60 * 1000));
        const hour = Math.floor(((this.tl - today) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const min = Math.floor(((this.tl - today) % (24 * 60 * 60 * 1000)) / (60 * 1000)) % 60;
        const sec = Math.floor(((this.tl - today) % (24 * 60 * 60 * 1000)) / 1000) % 60 % 60;
        const me = this;
        if ((this.tl - today) > 0 || (this.tl - today) < -86400000) {
            let timer = '';
            timer += `
            <p>やまのくの誕生日まで</p>
            <div class="number">
                <p><span class="number-day">${day}</span><span class="number_value">day</span></p>
                <p><span class="number-hour">${this.addZero(hour)}</span><span class="number_value">hour</span></p>
                <p><span class="number-min">${this.addZero(min)}</span><span class="number_value">min</span></p>
                <p><span class="number-sec">${this.addZero(sec)}</span><span class="number_value">sec</span></p>
            </div>
            `;
            document.getElementById('CDT').innerHTML = timer;
            setTimeout(() => {
                me.countDown();
            }, 10);
        } else {
            document.getElementById('CDT').innerHTML = this.mes;
            return;
        }
    }
    addZero(num) {
        return (`0${num}`).slice(-2);
    }
}

function CDT(tl, mes) {
    const timer = new CountdownTimer(tl, mes);
    timer.countDown();
}

window.onload = () => {
    const now = new Date();
    let tl = new Date(now.getFullYear(), 9, 30);
    let mes = '';
    mes += `
    <p class="birth_end">今日誕生日です</p>
    <a class="birth_btn" href="http://amzn.asia/cti4d0v" target="_blank">欲しいものを送ってやる</a>
    <a class="birth_btn" href="http://amzn.asia/8Kh4dGA" target="_blank">酒を送ってやる</a>
    `;
    if ((tl - now) < -86400000) {
        tl = new Date(now.getFullYear() + 1, 9, 30);
    }
    CDT(tl, mes);
};