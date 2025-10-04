import { useEffect, useState } from "hono/jsx";
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
      <div class="mt-60">
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
      <div class="mt-20">
        {isBirthday ? (
          <>
            <p class="text-display leading-[1.4]">
              今日はやまのくの誕生日です
              <br />
              今年で{getAge}歳になりました！
            </p>
            <a
              class="border border-blue-violet bg-blue-light rounded-button inset-shadow-button text-white block text-button-label mt-32 mx-auto max-w-360 py-15 no-underline"
              href="http://amzn.asia/cti4d0v"
              target="_blank"
              rel="noreferrer"
            >
              欲しいものを送ってやる
            </a>
            <a
              class="border border-blue-violet bg-blue-light rounded-button inset-shadow-button text-white block text-button-label mt-32 mx-auto max-w-360 py-15 no-underline"
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
            <div class="text-display">やまのくの誕生日まで</div>
            <div class="flex items-center justify-center mt-25">
              <p>
                <span class="block text-count-number mx-10 tracking-number">
                  {time.days}
                </span>
                <span class="block text-count-value text-gray">day</span>
              </p>
              <p>
                <span class="block text-count-number mx-10 tracking-number">
                  {String(time.hours).padStart(2, "0")}
                </span>
                <span class="block text-count-value text-gray">hour</span>
              </p>
              <p>
                <span class="block text-count-number mx-10 tracking-number">
                  {String(time.minutes).padStart(2, "0")}
                </span>
                <span class="block text-count-value text-gray">min</span>
              </p>
              <p>
                <span class="block text-count-number mx-10 tracking-number">
                  {String(time.seconds).padStart(2, "0")}
                </span>
                <span class="block text-count-value text-gray">sec</span>
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
