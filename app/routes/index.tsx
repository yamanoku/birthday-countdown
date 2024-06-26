import Counter from "../islands/counter";

export const title = "yamanoku birthday countdown";

export default function Index() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let nextBirthday = new Date(`${currentYear}-10-30`);

  if (now > nextBirthday) {
    nextBirthday = new Date(`${currentYear + 1}-10-30`);
  }

  const diffInSeconds = Math.floor((Number(nextBirthday) - Number(now)) / 1000);
  const days = Math.floor(diffInSeconds / (60 * 60 * 24));
  // hoursを日本時間の24時間計算になるようにする
  let hours = Math.floor((diffInSeconds / (60 * 60)) % 24) - 9;
  hours < 0 ? (hours = hours + 24) : hours;
  const minutes = Math.floor((diffInSeconds / 60) % 60);
  const seconds = diffInSeconds % 60;

  return (
    <>
      <Counter days={days} hours={hours} minutes={minutes} seconds={seconds} />
    </>
  );
}
