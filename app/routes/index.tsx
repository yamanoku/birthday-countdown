import Counter from "../islands/counter";
import { getTimeUntilBirthday } from "../utils";

export const title = "yamanoku birthday countdown";

export default function Index() {
  const { days, hours, minutes, seconds } = getTimeUntilBirthday();

  return (
    <Counter days={days} hours={hours} minutes={minutes} seconds={seconds} />
  );
}
