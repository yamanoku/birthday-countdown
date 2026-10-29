import { type BirthdayStatus, getBirthdayStatus } from "../utils";

export type OgSnapshot =
  | { mode: "birthday"; age: number }
  | {
      mode: "countdown";
      days: number;
      hours: number;
      minutes: number;
    };

const BIRTHDAY_KEYS = ["mode", "age"] as const;
const COUNTDOWN_KEYS = ["mode", "days", "hours", "minutes"] as const;

/**
 * ページと同じく誕生日当日を優先する。
 * 0時を過ぎると残り時間は翌年分になるが、画面は祝辞のままなので画像も祝辞にする。
 */
export const toOgSnapshot = (status: BirthdayStatus): OgSnapshot => {
  if (status.isBirthday) {
    return { mode: "birthday", age: status.age };
  }

  return {
    mode: "countdown",
    days: status.days,
    hours: status.hours,
    minutes: status.minutes
  };
};

export const buildOgPath = (snapshot: OgSnapshot): string => {
  if (snapshot.mode === "birthday") {
    return `/og?mode=birthday&age=${snapshot.age}`;
  }

  return `/og?mode=countdown&days=${snapshot.days}&hours=${snapshot.hours}&minutes=${snapshot.minutes}`;
};

export const ogImageAlt = (snapshot: OgSnapshot): string => {
  if (snapshot.mode === "birthday") {
    return `今日はやまのくの誕生日です。今年で${snapshot.age}歳になりました`;
  }

  return `やまのくの誕生日まで あと${snapshot.days}日${snapshot.hours}時間${snapshot.minutes}分`;
};

export type ParsedOgRequest = {
  snapshot: OgSnapshot;
  canonical: boolean;
};

const parseIntInRange = (
  value: string | null,
  min: number,
  max: number
): number | null => {
  if (value === null || !/^\d{1,3}$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  if (parsed < min || parsed > max) {
    return null;
  }

  return parsed;
};

/**
 * クエリをスナップショットに読む。
 * 並びが正規形でなければ canonical: false。未知のキー、重複、範囲外は null。
 */
export const parseOgRequest = (url: URL): ParsedOgRequest | null => {
  const entries = [...url.searchParams.entries()];
  const keys = entries.map(([key]) => key);
  if (new Set(keys).size !== keys.length) {
    return null;
  }

  const mode = url.searchParams.get("mode");
  const allowed =
    mode === "birthday"
      ? BIRTHDAY_KEYS
      : mode === "countdown"
        ? COUNTDOWN_KEYS
        : null;
  if (!allowed || keys.length !== allowed.length) {
    return null;
  }

  for (const key of allowed) {
    if (!keys.includes(key)) {
      return null;
    }
  }

  const snapshot =
    mode === "birthday"
      ? parseBirthday(url.searchParams.get("age"))
      : parseCountdown(
          url.searchParams.get("days"),
          url.searchParams.get("hours"),
          url.searchParams.get("minutes")
        );
  if (!snapshot) {
    return null;
  }

  const canonicalSearch = buildOgPath(snapshot).slice("/og".length);
  return { snapshot, canonical: url.search === canonicalSearch };
};

const parseBirthday = (age: string | null): OgSnapshot | null => {
  const parsed = parseIntInRange(age, 0, 120);
  if (parsed === null) {
    return null;
  }

  return { mode: "birthday", age: parsed };
};

const parseCountdown = (
  days: string | null,
  hours: string | null,
  minutes: string | null
): OgSnapshot | null => {
  const parsedDays = parseIntInRange(days, 0, 366);
  const parsedHours = parseIntInRange(hours, 0, 23);
  const parsedMinutes = parseIntInRange(minutes, 0, 59);
  if (parsedDays === null || parsedHours === null || parsedMinutes === null) {
    return null;
  }

  return {
    mode: "countdown",
    days: parsedDays,
    hours: parsedHours,
    minutes: parsedMinutes
  };
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

    it("誕生日前は分までのカウントダウンにする", () => {
      vi.setSystemTime(new Date("2024-04-01T12:34:56+09:00"));

      expect(toOgSnapshot(getBirthdayStatus())).toEqual({
        mode: "countdown",
        days: 211,
        hours: 11,
        minutes: 25
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
    it("正規のクエリ順でパスを組む", () => {
      expect(buildOgPath({ mode: "birthday", age: 37 })).toBe(
        "/og?mode=birthday&age=37"
      );
      expect(
        buildOgPath({ mode: "countdown", days: 211, hours: 12, minutes: 4 })
      ).toBe("/og?mode=countdown&days=211&hours=12&minutes=4");
    });
  });

  describe("parseOgRequest", () => {
    it("正規のカウントダウン URL を読む", () => {
      expect(
        parseOgRequest(
          new URL(
            "https://example.test/og?mode=countdown&days=211&hours=12&minutes=4"
          )
        )
      ).toEqual({
        snapshot: { mode: "countdown", days: 211, hours: 12, minutes: 4 },
        canonical: true
      });
    });

    it("並びが違えば値は読み、正規形ではないと返す", () => {
      expect(
        parseOgRequest(new URL("https://example.test/og?age=37&mode=birthday"))
      ).toEqual({
        snapshot: { mode: "birthday", age: 37 },
        canonical: false
      });
    });

    it("先頭ゼロは値として読み、正規形ではないと返す", () => {
      expect(
        parseOgRequest(
          new URL(
            "https://example.test/og?mode=countdown&days=01&hours=2&minutes=3"
          )
        )
      ).toEqual({
        snapshot: { mode: "countdown", days: 1, hours: 2, minutes: 3 },
        canonical: false
      });
    });

    it("範囲外、未知のキー、重複、自由文は拒否する", () => {
      expect(
        parseOgRequest(
          new URL(
            "https://example.test/og?mode=countdown&days=367&hours=0&minutes=0"
          )
        )
      ).toBeNull();
      expect(
        parseOgRequest(
          new URL("https://example.test/og?mode=birthday&age=37&days=1")
        )
      ).toBeNull();
      expect(
        parseOgRequest(
          new URL("https://example.test/og?mode=birthday&mode=countdown&age=37")
        )
      ).toBeNull();
      expect(
        parseOgRequest(
          new URL("https://example.test/og?mode=birthday&age=三十七")
        )
      ).toBeNull();
      expect(
        parseOgRequest(new URL("https://example.test/og?mode=party&age=37"))
      ).toBeNull();
    });
  });

  describe("ogImageAlt", () => {
    it("モードごとの代替テキストを返す", () => {
      expect(ogImageAlt({ mode: "birthday", age: 37 })).toBe(
        "今日はやまのくの誕生日です。今年で37歳になりました"
      );
      expect(
        ogImageAlt({ mode: "countdown", days: 211, hours: 12, minutes: 4 })
      ).toBe("やまのくの誕生日まで あと211日12時間4分");
    });
  });
}
