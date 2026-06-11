import { useEffect, useState } from "hono/jsx";
import { type BirthdayStatus, getBirthdayStatus } from "../utils";

const GIFT_LINKS = [
  { href: "https://amzn.asia/cti4d0v", label: "欲しいものを送ってやる" },
  { href: "https://amzn.asia/8Kh4dGA", label: "酒を送ってやる" }
] as const;

export default function Counter(props: BirthdayStatus) {
  const [status, setStatus] = useState(props);

  useEffect(() => {
    const updateCountdown = () => {
      setStatus(getBirthdayStatus());
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const { isBirthday, age } = status;
  const counts = [
    { unit: "day", value: String(status.days) },
    { unit: "hour", value: String(status.hours).padStart(2, "0") },
    { unit: "min", value: String(status.minutes).padStart(2, "0") },
    { unit: "sec", value: String(status.seconds).padStart(2, "0") }
  ];

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
              今年で{age}歳になりました！
            </p>
            {GIFT_LINKS.map(({ href, label }) => (
              <a
                key={href}
                class="border border-blue-violet bg-blue-light rounded-button inset-shadow-button text-white block text-button-label mt-32 mx-auto max-w-360 py-15 no-underline"
                href={href}
                target="_blank"
                rel="noreferrer"
              >
                {label}
              </a>
            ))}
          </>
        ) : (
          <>
            <noscript>
              JavaScriptを許可するとカウントダウンタイマーが動きます
            </noscript>
            <div class="text-display">やまのくの誕生日まで</div>
            <div class="flex items-center justify-center mt-25">
              {counts.map(({ unit, value }) => (
                <p key={unit}>
                  <span class="block text-count-number mx-10 tracking-number">
                    {value}
                  </span>
                  <span class="block text-count-value text-gray">{unit}</span>
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
