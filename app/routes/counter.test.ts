import { jsx } from "hono/jsx";
import { renderToString } from "hono/jsx/dom/server";
import { describe, expect, it } from "vitest";
import type { BirthdayStatus } from "../utils";
import Counter from "./$counter";

const TIMELINE_HREF = "https://scrapbox.io/yamanoku-timeline/";
const GIFT_HREFS = [
  "https://amzn.asia/cti4d0v",
  "https://amzn.asia/8Kh4dGA"
] as const;

function status(overrides: Partial<BirthdayStatus>): BirthdayStatus {
  return {
    days: 10,
    hours: 4,
    minutes: 3,
    seconds: 2,
    dateDays: 11,
    isBirthday: false,
    isEve: false,
    age: 36,
    ...overrides
  };
}

function anchors(html: string): { href: string; text: string }[] {
  const found: { href: string; text: string }[] = [];
  for (const match of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)) {
    const href = match[1]?.match(/\bhref="([^"]*)"/)?.[1];
    if (href === undefined) continue;
    const text = match[2]?.replace(/<[^>]+>/g, "").trim() ?? "";
    found.push({ href, text });
  }
  return found;
}

function render(props: BirthdayStatus): string {
  return renderToString(jsx(Counter, props));
}

describe("Counter", () => {
  it("誕生日当日はタイムラインと祝辞と贈り物のリンクを出す", () => {
    const html = render(
      status({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        dateDays: 0,
        isBirthday: true,
        isEve: false,
        age: 37
      })
    );
    const links = anchors(html);
    const timeline = links.find((link) => link.href === TIMELINE_HREF);

    expect(html).toContain("今日はやまのくの誕生日です");
    expect(html).toContain("今年で37歳になりました！");
    expect(timeline?.text.length).toBeGreaterThan(0);
    for (const href of GIFT_HREFS) {
      expect(
        links.some((link) => link.href === href && link.text.length > 0)
      ).toBe(true);
    }
  });

  it("誕生日の前日にはタイムラインのURLを出さない", () => {
    const html = render(
      status({
        days: 0,
        hours: 8,
        minutes: 0,
        seconds: 0,
        dateDays: 1,
        isBirthday: false,
        isEve: true
      })
    );

    expect(html).not.toContain(TIMELINE_HREF);
    expect(html).toContain("やまのくの誕生日まで");
    expect(html).toContain(">0<");
    expect(html).toContain(">08<");
    expect(html).toContain(">day<");
    expect(html).toContain(">hour<");
    expect(html).toContain(">min<");
    expect(html).toContain(">sec<");
    expect(anchors(html).some((link) => link.href === TIMELINE_HREF)).toBe(
      false
    );
  });

  it("通常のカウントダウンにはタイムラインのURLを出さない", () => {
    const html = render(
      status({
        dateDays: 12,
        isBirthday: false,
        isEve: false
      })
    );

    expect(html).not.toContain(TIMELINE_HREF);
    expect(html).toContain("やまのくの誕生日まで");
    expect(html).toContain(">10<");
    expect(html).toContain(">04<");
    expect(html).toContain(">03<");
    expect(html).toContain(">02<");
    expect(html).toContain(">day<");
    expect(html).toContain(">sec<");
    expect(anchors(html).some((link) => link.href === TIMELINE_HREF)).toBe(
      false
    );
  });
});
