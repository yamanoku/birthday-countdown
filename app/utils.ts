import { Temporal } from "temporal-polyfill-lite";

export type BirthdayStatus = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** 日付だけの残り日数。時刻が途中でも、その日のうちは変わらない。 */
  dateDays: number;
  isBirthday: boolean;
  /** 日本時間で誕生日の前日。 */
  isEve: boolean;
  age: number;
};

const TIME_ZONE = "Asia/Tokyo";

const BIRTHDAY = { month: 10, day: 30 };
const BIRTH_YEAR = 1989;

/**
 * 次の誕生日(日本時間10月30日 0時)までの残り時間と、誕生日当日かどうか・年齢を
 * 同一時刻のサンプルから計算する関数
 * @returns 日、時間、分、秒、誕生日当日フラグ、年齢のオブジェクト
 */
export const getBirthdayStatus = (): BirthdayStatus => {
  const now = Temporal.Now.zonedDateTimeISO(TIME_ZONE);
  let nextBirthday = now.with(BIRTHDAY).startOfDay();

  if (Temporal.ZonedDateTime.compare(now, nextBirthday) > 0) {
    nextBirthday = nextBirthday.add({ years: 1 });
  }

  const { days, hours, minutes, seconds } = now.until(nextBirthday, {
    largestUnit: "day",
    smallestUnit: "second"
  });

  const isBirthday = now.month === BIRTHDAY.month && now.day === BIRTHDAY.day;
  const dateDays = isBirthday
    ? 0
    : hours === 0 && minutes === 0 && seconds === 0
      ? days
      : days + 1;

  return {
    days,
    hours,
    minutes,
    seconds,
    dateDays,
    isBirthday,
    isEve: dateDays === 1,
    age: now.year - BIRTH_YEAR
  };
};

if (import.meta.vitest) {
  const { it, describe, beforeEach, afterEach, expect, vi } = import.meta
    .vitest;

  describe("getBirthdayStatus", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("誕生日前の場合、正しい残り時間を計算する", () => {
      // 日本時間 2024年4月1日 12:00:00 に設定 (誕生日10月30日の前)
      const mockDate = new Date("2024-04-01T12:00:00+09:00");

      vi.setSystemTime(mockDate);

      const result = getBirthdayStatus();

      // 4月1日から10月30日までの日数など
      expect(result.days).toBe(211);
      expect(result.hours).toBe(12);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.dateDays).toBe(212);
      expect(result.isBirthday).toBe(false);
      expect(result.isEve).toBe(false);
    });

    it("日本時間の0時〜9時の間でも、正しい残り時間を計算する", () => {
      // 日本時間 2024年4月1日 06:00:00 に設定 (UTCでは前日の21時)
      const mockDate = new Date("2024-04-01T06:00:00+09:00");
      vi.setSystemTime(mockDate);

      const result = getBirthdayStatus();

      // 4月1日6時から10月30日0時までは211日と18時間
      expect(result.days).toBe(211);
      expect(result.hours).toBe(18);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });

    it("誕生日当日の場合、正しい残り時間を計算する", () => {
      // 日本時間 2024年10月30日 00:00:00 に設定 (誕生日当日の朝)
      const mockDate = new Date("2024-10-30T00:00:00+09:00");
      vi.setSystemTime(mockDate);

      const result = getBirthdayStatus();

      // 同じ日なので日数や時間は0にする
      expect(result.days).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.dateDays).toBe(0);
      expect(result.isBirthday).toBe(true);
      expect(result.isEve).toBe(false);
      expect(result.age).toBe(2024 - 1989);
    });

    it("誕生日の前日は、時刻にかかわらず前日になる", () => {
      vi.setSystemTime(new Date("2024-10-29T00:00:00+09:00"));
      expect(getBirthdayStatus().isEve).toBe(true);
      expect(getBirthdayStatus().dateDays).toBe(1);

      vi.setSystemTime(new Date("2024-10-29T23:30:00+09:00"));
      expect(getBirthdayStatus().isEve).toBe(true);
      expect(getBirthdayStatus().isBirthday).toBe(false);
    });

    it("前々日はあと2日で、前日ではない", () => {
      vi.setSystemTime(new Date("2024-10-28T15:00:00+09:00"));

      const result = getBirthdayStatus();
      expect(result.dateDays).toBe(2);
      expect(result.isEve).toBe(false);
    });

    it("誕生日後の場合、翌年の誕生日までの時間を計算する", () => {
      // 日本時間 2024年10月31日 12:00:00 に設定 (誕生日10月30日の後)
      const mockDate = new Date("2024-10-31T12:00:00+09:00");
      vi.setSystemTime(mockDate);

      const result = getBirthdayStatus();

      // 10月31日から翌年10月30日までの日数
      expect(result.days).toBe(363);
      expect(result.hours).toBe(12);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
      expect(result.isBirthday).toBe(false);
    });
  });
}
