class CountdownTimer {
    public timer: string;
    public tl: number;
    public mes: string;
    public today: Date;
    constructor(tl, mes) {
        this.initialize(tl, mes);
    }
    public initialize(tl, mes): void {
        this.tl = tl;
        this.mes = mes;
    }
    public countDown(): void {
        const today = new Date();
        const day = Math.floor((this.tl - Number(today)) / (24 * 60 * 60 * 1000));
        const hour = Math.floor(((this.tl - Number(today)) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const min = Math.floor(((this.tl - Number(today)) % (24 * 60 * 60 * 1000)) / (60 * 1000)) % 60;
        const sec = Math.floor(((this.tl - Number(today)) % (24 * 60 * 60 * 1000)) / 1000) % 60 % 60;
        if ((this.tl - Number(today)) > 0 || (this.tl - Number(today)) < -86400000) {
            let timer = "";
            timer += `<p>やまのくの誕生日まで</p><div class="number">
            <p><span class="number-day">${day}</span><span class="number_value">day</span></p>
            <p><span class="number-hour">${this.addZero(hour)}</span><span class="number_value">hour</span></p>
            <p><span class="number-min">${this.addZero(min)}</span><span class="number_value">min</span></p>
            <p><span class="number-sec">${this.addZero(sec)}</span><span class="number_value">sec</span></p>
            </div>`;
            document.getElementById("CDT").innerHTML = timer;
            setTimeout(() => {
                this.countDown();
            }, 10);
        } else {
            let mes = "";
            mes += `
                <p class="birth_end">今日誕生日です</p>
                <a class="birth_btn" href="http://amzn.asia/cti4d0v" target="_blank">
                    欲しいものを送ってやる
                </a>
                <a class="birth_btn" href="http://amzn.asia/8Kh4dGA" target="_blank">
                    酒を送ってやる
                </a>
            `;
            document.getElementById("CDT").innerHTML = mes;
            return;
        }
    }
    public addZero(num: number): string {
        return (`0${num}`).slice(-2);
    }
}

function CDT<T>(tl: T, mes: T) {
    const timer = new CountdownTimer(tl, mes);
    timer.countDown();
}

window.onload = () => {
    const now: Date = new Date();
    let tl: Date = new Date(now.getFullYear(), 9, 30);
    const m: Date = new Date();
    if ((Number(tl) - Number(now)) < -86400000) {
        tl = new Date(now.getFullYear() + 1, 9, 30);
    }
    CDT(tl, m);
};
