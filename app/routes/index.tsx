import { getTimeUntilBirthday } from "../utils";
import Counter from "./$counter";

export const title = "yamanoku birthday countdown";

export default function Index() {
  const { days, hours, minutes, seconds } = getTimeUntilBirthday();

  return (
    <Counter days={days} hours={hours} minutes={minutes} seconds={seconds} />
  );
}
