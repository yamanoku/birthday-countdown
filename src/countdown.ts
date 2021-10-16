class CountdownTimer {
  public elementID: string;
  public birthDay: Date;
  public birthdayMessage: string;
  public constructor(
    elementID: string,
    birthDay: Date,
    birthdayMessage: string
  ) {
    this.elementID = elementID;
    this.birthDay = birthDay;
    this.birthdayMessage = birthdayMessage;
  }
  public countDown(): void {
    const today = new Date();
    const day = Math.floor(
      (Number(this.birthDay) - Number(today)) / (24 * 60 * 60 * 1000)
    );
    const hour = Math.floor(
      ((Number(this.birthDay) - Number(today)) % (24 * 60 * 60 * 1000)) /
        (60 * 60 * 1000)
    );
    const min =
      Math.floor(
        ((Number(this.birthDay) - Number(today)) % (24 * 60 * 60 * 1000)) /
          (60 * 1000)
      ) % 60;
    const sec =
      (Math.floor(
        ((Number(this.birthDay) - Number(today)) % (24 * 60 * 60 * 1000)) / 1000
      ) %
        60) %
      60;
    const countDownTimerElement: HTMLElement | null = document.getElementById(
      this.elementID
    );
    if (countDownTimerElement === null) return;
    if (
      Number(this.birthDay) - Number(today) > 0 ||
      Number(this.birthDay) - Number(today) < -86400000
    ) {
      const timer = `
        <p>やまのくの誕生日まで</p>
        <div class="number">
          <p>
            <span class="number-day">${day}</span>
            <span class="number_value">day</span>
          </p>
          <p>
            <span class="number-hour">
            ${String(hour).padStart(2, "0")}
            </span>
            <span class="number_value">hour</span>
          </p>
          <p>
            <span class="number-min">
            ${String(min).padStart(2, "0")}
            </span>
            <span class="number_value">min</span>
          </p>
          <p>
            <span class="number-sec">
              ${String(sec).padStart(2, "0")}
            </span>
            <span class="number_value">sec</span>
          </p>
        </div>`;
      countDownTimerElement.innerHTML = timer;
      setTimeout(() => {
        this.countDown();
      }, 10);
    } else {
      countDownTimerElement.innerHTML = this.birthdayMessage;
    }
  }
}

window.onload = () => {
  const elementID = "CDT";
  const today = new Date();
  let birthDay = new Date(today.getFullYear(), 9, 30);
  if (Number(birthDay) - Number(today) < -86400000) {
    birthDay = new Date(today.getFullYear() + 1, 9, 30);
  }
  const birthdayMessage = `
    <p class="birth_end">
      今日誕生日です
    </p>
    <a class="birth_btn" href="http://amzn.asia/cti4d0v" target="_blank">
      欲しいものを送ってやる
    </a>
    <a class="birth_btn" href="http://amzn.asia/8Kh4dGA" target="_blank">
      酒を送ってやる
    </a>`;
  const timer = new CountdownTimer(elementID, birthDay, birthdayMessage);
  timer.countDown();
};
