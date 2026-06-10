import { Temporal } from "temporal-polyfill-lite";

type TimeUntilBirthday = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const TIME_ZONE = "Asia/Tokyo";

const BIRTHDAY = { month: 10, day: 30 };

/**
 * 次の誕生日(日本時間10月30日 0時)までの残り時間を計算する関数
 * @returns 日、時間、分、秒のオブジェクト
 */
export const getTimeUntilBirthday = (): TimeUntilBirthday => {
  const now = Temporal.Now.zonedDateTimeISO(TIME_ZONE);
  let nextBirthday = now.with(BIRTHDAY).startOfDay();

  if (Temporal.ZonedDateTime.compare(now, nextBirthday) > 0) {
    nextBirthday = nextBirthday.add({ years: 1 });
  }

  const { days, hours, minutes, seconds } = now.until(nextBirthday, {
    largestUnit: "day",
    smallestUnit: "second"
  });

  return { days, hours, minutes, seconds };
};

if (import.meta.vitest) {
  const { it, describe, beforeEach, afterEach, expect, vi } = import.meta
    .vitest;

  describe("getTimeUntilBirthday", () => {
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

      const result = getTimeUntilBirthday();

      // 4月1日から10月30日までの日数など
      expect(result.days).toBe(211);
      expect(result.hours).toBe(12);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });

    it("誕生日当日の場合、正しい残り時間を計算する", () => {
      // 日本時間 2024年10月30日 00:00:00 に設定 (誕生日当日の朝)
      const mockDate = new Date("2024-10-30T00:00:00+09:00");
      vi.setSystemTime(mockDate);

      const result = getTimeUntilBirthday();

      // 同じ日なので日数や時間は0にする
      expect(result.days).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });

    it("誕生日後の場合、翌年の誕生日までの時間を計算する", () => {
      // 日本時間 2024年10月31日 12:00:00 に設定 (誕生日10月30日の後)
      const mockDate = new Date("2024-10-31T12:00:00+09:00");
      vi.setSystemTime(mockDate);

      const result = getTimeUntilBirthday();

      // 10月31日から翌年10月30日までの日数
      expect(result.days).toBe(363);
      expect(result.hours).toBe(12);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });
  });
}
