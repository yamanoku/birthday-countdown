import { useEffect, useState } from "hono/jsx";
import {
  birthBtnClass,
  birthEndClass,
  numberClass,
  numberKeyClass,
  numberValueClass
} from "../css/classNames";
import { getTimeUntilBirthday } from "../utils";

type InitialTime = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export default function Counter(props: InitialTime) {
  const [time, setTime] = useState(props);

  useEffect(() => {
    const updateCountdown = () => {
      const { days, hours, minutes, seconds } = getTimeUntilBirthday();
      setTime({ days, hours, minutes, seconds });
    };

    const intervalId = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const isBirthday =
    new Date()
      .toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
      .slice(5, 10) === "10-30";
  const getAge = new Date().getFullYear() - 1989;

  return (
    <>
      <div style="margin-top: 60px">
        <svg
          width="180"
          height="180"
          viewBox="0 0 246 242"
          role="img"
          aria-label="yamanoku"
        >
          <path
            style="transform: translate(-64px, -67px); fill: #fff"
            fill-rule="evenodd"
            d="M64,67v54l82,82-46,46v60h56L310,155V96H230l-21,20L160,67H64ZM176,203l-45,46h25L293,113H230l-39,39-31-31H94Z"
          />
        </svg>
      </div>
      <div style="margin-top: 20px">
        {isBirthday ? (
          <>
            <p class={birthEndClass}>
              今日はやまのくの誕生日です
              <br />
              今年で{getAge}歳になりました！
            </p>
            <a
              class={birthBtnClass}
              href="http://amzn.asia/cti4d0v"
              target="_blank"
              rel="noreferrer"
            >
              欲しいものを送ってやる
            </a>
            <a
              class={birthBtnClass}
              href="http://amzn.asia/8Kh4dGA"
              target="_blank"
              rel="noreferrer"
            >
              酒を送ってやる
            </a>
          </>
        ) : (
          <>
            <noscript>
              JavaScriptを許可するとカウントダウンタイマーが動きます
            </noscript>
            <div>やまのくの誕生日まで</div>
            <div class={numberClass}>
              <p>
                <span class={numberKeyClass}>{time.days}</span>
                <span class={numberValueClass}>day</span>
              </p>
              <p>
                <span class={numberKeyClass}>
                  {String(time.hours).padStart(2, "0")}
                </span>
                <span class={numberValueClass}>hour</span>
              </p>
              <p>
                <span class={numberKeyClass}>
                  {String(time.minutes).padStart(2, "0")}
                </span>
                <span class={numberValueClass}>min</span>
              </p>
              <p>
                <span class={numberKeyClass}>
                  {String(time.seconds).padStart(2, "0")}
                </span>
                <span class={numberValueClass}>sec</span>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
