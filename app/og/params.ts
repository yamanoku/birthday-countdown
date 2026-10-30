import { type BirthdayStatus, getBirthdayStatus } from "../utils.ts";

export type OgSnapshot =
  | { mode: "birthday"; age: number }
  | {
      mode: "countdown";
      days: number;
      hours: number;
    };

export const OG_MIN_AGE = 0;
export const OG_MAX_AGE = 120;
export const OG_MIN_DAYS = 0;
export const OG_MAX_DAYS = 366;
export const OG_MIN_HOURS = 0;
export const OG_MAX_HOURS = 23;

/**
 * ページと同じく誕生日当日を優先する。
 * 0時を過ぎると残り時間は翌年分になるが、画面は祝辞のままなので画像も祝辞にする。
 * 画像は時間まで。分はページ側だけで進む。
 */
export const toOgSnapshot = (status: BirthdayStatus): OgSnapshot => {
  if (status.isBirthday) {
    return { mode: "birthday", age: status.age };
  }

  return {
    mode: "countdown",
    days: status.days,
    hours: status.hours
  };
};

export const ogAssetFilename = (snapshot: OgSnapshot): string => {
  if (snapshot.mode === "birthday") {
    return `birthday-${snapshot.age}.png`;
  }

  return `countdown-${snapshot.days}-${snapshot.hours}.png`;
};

export const buildOgPath = (snapshot: OgSnapshot): string => {
  return `/og/${ogAssetFilename(snapshot)}`;
};

export const ogImageAlt = (snapshot: OgSnapshot): string => {
  if (snapshot.mode === "birthday") {
    return `今日はやまのくの誕生日です。今年で${snapshot.age}歳になりました`;
  }

  return `やまのくの誕生日まで あと${snapshot.days}日${snapshot.hours}時間`;
};

const ages = OG_MAX_AGE - OG_MIN_AGE + 1;
const daySlots = OG_MAX_DAYS - OG_MIN_DAYS + 1;
const hourSlots = OG_MAX_HOURS - OG_MIN_HOURS + 1;

/** ビルド時に書き出す枚数。Workers Free の静的アセット上限は 2 万ファイル。 */
export const ogAssetCount = ages + daySlots * hourSlots;

export const eachOgSnapshot = function* (): Generator<OgSnapshot> {
  for (let age = OG_MIN_AGE; age <= OG_MAX_AGE; age++) {
    yield { mode: "birthday", age };
  }

  for (let days = OG_MIN_DAYS; days <= OG_MAX_DAYS; days++) {
    for (let hours = OG_MIN_HOURS; hours <= OG_MAX_HOURS; hours++) {
      yield { mode: "countdown", days, hours };
    }
  }
};

const BIRTHDAY_PATH = /^\/og\/birthday-(\d{1,3})\.png$/;
const COUNTDOWN_PATH = /^\/og\/countdown-(\d{1,3})-(\d{1,2})\.png$/;

const parseCanonicalInt = (
  value: string,
  min: number,
  max: number
): number | null => {
  if (!/^\d{1,3}$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  if (String(parsed) !== value || parsed < min || parsed > max) {
    return null;
  }

  return parsed;
};

/**
 * ビルド成果物と同じパスだけを読む。先頭ゼロや範囲外は null。
 * 開発サーバがこの結果で描画し、本番は同名の静的ファイルを返す。
 */
export const parseOgAssetPath = (pathname: string): OgSnapshot | null => {
  const birthday = BIRTHDAY_PATH.exec(pathname);
  if (birthday) {
    const age = parseCanonicalInt(birthday[1], OG_MIN_AGE, OG_MAX_AGE);
    if (age === null) {
      return null;
    }

    return { mode: "birthday", age };
  }

  const countdown = COUNTDOWN_PATH.exec(pathname);
  if (!countdown) {
    return null;
  }

  const days = parseCanonicalInt(countdown[1], OG_MIN_DAYS, OG_MAX_DAYS);
  const hours = parseCanonicalInt(countdown[2], OG_MIN_HOURS, OG_MAX_HOURS);
  if (days === null || hours === null) {
    return null;
  }

  return { mode: "countdown", days, hours };
};

if (import.meta.vitest) {
  const { it, describe, expect, beforeEach, afterEach, vi } = import.meta
    .vitest;

  describe("toOgSnapshot", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("誕生日前は時間までのカウントダウンにする", () => {
      vi.setSystemTime(new Date("2024-04-01T12:34:56+09:00"));

      expect(toOgSnapshot(getBirthdayStatus())).toEqual({
        mode: "countdown",
        days: 211,
        hours: 11
      });
    });

    it("誕生日当日の午後は残り時間が翌年でも祝辞にする", () => {
      vi.setSystemTime(new Date("2024-10-30T15:00:00+09:00"));

      const status = getBirthdayStatus();
      expect(status.isBirthday).toBe(true);
      expect(status.days).toBeGreaterThan(0);
      expect(toOgSnapshot(status)).toEqual({ mode: "birthday", age: 35 });
    });
  });

  describe("buildOgPath", () => {
    it("静的ファイルのパスを組む", () => {
      expect(buildOgPath({ mode: "birthday", age: 37 })).toBe(
        "/og/birthday-37.png"
      );
      expect(buildOgPath({ mode: "countdown", days: 211, hours: 4 })).toBe(
        "/og/countdown-211-4.png"
      );
    });
  });

  describe("parseOgAssetPath", () => {
    it("正規のパスを読む", () => {
      expect(parseOgAssetPath("/og/birthday-37.png")).toEqual({
        mode: "birthday",
        age: 37
      });
      expect(parseOgAssetPath("/og/countdown-211-11.png")).toEqual({
        mode: "countdown",
        days: 211,
        hours: 11
      });
      expect(parseOgAssetPath("/og/countdown-0-0.png")).toEqual({
        mode: "countdown",
        days: 0,
        hours: 0
      });
    });

    it("書き出すパスはすべて読み戻せる", () => {
      let count = 0;
      let mismatch = 0;
      for (const snapshot of eachOgSnapshot()) {
        const parsed = parseOgAssetPath(buildOgPath(snapshot));
        if (JSON.stringify(parsed) !== JSON.stringify(snapshot)) {
          mismatch += 1;
        }
        count += 1;
      }

      expect(mismatch).toBe(0);
      expect(count).toBe(ogAssetCount);
    });

    it("先頭ゼロ、範囲外、別形式は拒否する", () => {
      expect(parseOgAssetPath("/og/birthday-037.png")).toBeNull();
      expect(parseOgAssetPath("/og/birthday-121.png")).toBeNull();
      expect(parseOgAssetPath("/og/countdown-01-2.png")).toBeNull();
      expect(parseOgAssetPath("/og/countdown-211-00.png")).toBeNull();
      expect(parseOgAssetPath("/og/countdown-211-24.png")).toBeNull();
      expect(parseOgAssetPath("/og/countdown-367-0.png")).toBeNull();
      expect(parseOgAssetPath("/og?mode=birthday&age=37")).toBeNull();
      expect(parseOgAssetPath("/og/countdown-211-4.png.bak")).toBeNull();
    });
  });

  describe("ogImageAlt", () => {
    it("モードごとの代替テキストを返す", () => {
      expect(ogImageAlt({ mode: "birthday", age: 37 })).toBe(
        "今日はやまのくの誕生日です。今年で37歳になりました"
      );
      expect(ogImageAlt({ mode: "countdown", days: 211, hours: 12 })).toBe(
        "やまのくの誕生日まで あと211日12時間"
      );
    });
  });

  describe("ogAssetCount", () => {
    it("無料枠の 2 万ファイルに収まる", () => {
      expect(ogAssetCount).toBe(8929);
      expect(ogAssetCount).toBeLessThan(20000);
    });
  });
}
