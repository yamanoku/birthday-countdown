import { getBirthdayStatus } from "../utils";
import Counter from "./$counter";

export default function Index() {
  return <Counter {...getBirthdayStatus()} />;
}
