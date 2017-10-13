function CountdownTimer() {
    this.initialize.apply(this, arguments);
}

CountdownTimer.prototype = {
    initialize: function(tl, mes) {
        this.tl = tl;
        this.mes = mes;
    },
    countDown: function() {
        var today = new Date();
        var day = Math.floor((this.tl - today) / (24 * 60 * 60 * 1000));
        var hour = Math.floor(((this.tl - today) % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        var min = Math.floor(((this.tl - today) % (24 * 60 * 60 * 1000)) / (60 * 1000)) % 60;
        var sec = Math.floor(((this.tl - today) % (24 * 60 * 60 * 1000)) / 1000) % 60 % 60;
        var me = this;
        if ((this.tl - today) > 0 || (this.tl - today) < -86400000) {
            var timer = '';
            timer += '<p>やまのくの誕生日まで</p>';
            timer += '<div class="number">';
            timer += '<p><span class="number-day">' + day + '</span><span class="number_value">day</span></p>';
            timer += '<p><span class="number-hour">' + this.addZero(hour) + '</span><span class="number_value">hour</span></p>';
            timer += '<p><span class="number-min">' + this.addZero(min) + '</span><span class="number_value">min</span></p>';
            timer += '<p><span class="number-sec">' + this.addZero(sec) + '</span><span class="number_value">sec</span></p>';
            timer += '</div>';
            document.getElementById('CDT').innerHTML = timer;
            setTimeout(function() {
                me.countDown();
            }, 10);
        } else {
            document.getElementById('CDT').innerHTML = this.mes;
            return;
        }
    },
    addZero: function(num) {
        return ('0' + num).slice(-2);
    }
};

function CDT(tl, mes) {
    var timer = new CountdownTimer(tl, mes);
    timer.countDown();
}

window.onload = function() {
    var now = new Date();
    var tl = new Date(now.getFullYear(), 9, 30);
    var mes = '';
    mes += '<p class="birth_end">今日誕生日です</p>';
    mes += '<a class="birth_btn" href="http://amzn.asia/cti4d0v" target="_blank">欲しいものを送ってやる</a>';
    mes += '<a class="birth_btn" href="http://amzn.asia/8Kh4dGA" target="_blank">酒を送ってやる</a>';
    if ((tl - now) < -86400000) {
        tl = new Date(now.getFullYear() + 1, 9, 30);
    }
    CDT(tl, mes);
};