type TimeUntilBirthday = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

/**
 * 次の誕生日までの秒数とその内訳を計算する関数
 * @returns 日、時間、分、秒のオブジェクト
 */
export const getTimeUntilBirthday = (): TimeUntilBirthday => {
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
      // 2024年4月1日 12:00:00 に設定 (誕生日10月30日の前)
      const mockDate = new Date(2024, 3, 1, 12, 0, 0);

      vi.setSystemTime(mockDate);

      const result = getTimeUntilBirthday();

      // 4月1日から10月30日までの日数など
      expect(result.days).toBe(211);
      expect(result.hours).toBe(12);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });

    it("誕生日当日の場合、正しい残り時間を計算する", () => {
      // 2024年10月30日 00:00:00 に設定 (誕生日当日の朝)
      const mockDate = new Date(2024, 9, 30, 0, 0, 0);
      vi.setSystemTime(mockDate);

      const result = getTimeUntilBirthday();

      // 同じ日なので日数や時間は0にする
      expect(result.days).toBe(0);
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
      expect(result.seconds).toBe(0);
    });

    it("誕生日後の場合、翌年の誕生日までの時間を計算する", () => {
      // 2024年10月31日 12:00:00 に設定 (誕生日10月30日の後)
      const mockDate = new Date(2024, 9, 31, 12, 0, 0);
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
