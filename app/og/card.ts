import type { OgSnapshot } from "./params.ts";

const NAVY = "#36465d";
const GRAY = "#b9bfc9";
const FONT = "Noto Sans JP";

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="246" height="242" viewBox="0 0 246 242"><path fill="#ffffff" fill-rule="evenodd" transform="translate(-64 -67)" d="M64,67v54l82,82-46,46v60h56L310,155V96H230l-21,20L160,67H64ZM176,203l-45,46h25L293,113H230l-39,39-31-31H94Z"/></svg>`;

const LOGO_SRC = `data:image/svg+xml,${encodeURIComponent(LOGO_SVG)}`;

const frame = (inner: string): string => {
  return `<div style="display:flex;width:1200px;height:630px;background:${NAVY};color:#ffffff;font-family:${FONT};">${inner}</div>`;
};

const logo = (size: number): string => {
  return `<img src="${LOGO_SRC}" width="${size}" height="${size}" style="width:${size}px;height:${size}px;" />`;
};

export const cardHtml = (snapshot: OgSnapshot): string => {
  if (snapshot.mode === "birthday") {
    return frame(`<div style="display:flex;flex-direction:column;width:1200px;height:630px;align-items:center;justify-content:center;">
      ${logo(120)}
      <div style="display:flex;margin-top:40px;font-size:52px;">今日はやまのくの誕生日です</div>
      <div style="display:flex;margin-top:18px;font-size:40px;">今年で${snapshot.age}歳になりました！</div>
    </div>`);
  }

  const counts = [
    { unit: "day", value: String(snapshot.days) },
    { unit: "hour", value: String(snapshot.hours).padStart(2, "0") }
  ];

  const columns = counts
    .map(({ unit, value }) => {
      return `<div style="display:flex;flex-direction:column;align-items:center;width:300px;">
        <div style="display:flex;font-size:132px;letter-spacing:-0.05em;line-height:1;">${value}</div>
        <div style="display:flex;margin-top:8px;font-size:32px;color:${GRAY};">${unit}</div>
      </div>`;
    })
    .join("");

  return frame(`<div style="display:flex;flex-direction:column;width:1200px;height:630px;padding:64px 72px;box-sizing:border-box;">
    <div style="display:flex;align-items:center;">${logo(72)}</div>
    <div style="display:flex;margin-top:28px;font-size:46px;">やまのくの誕生日まで</div>
    <div style="display:flex;flex-grow:1;align-items:center;justify-content:space-evenly;margin-top:12px;">${columns}</div>
  </div>`);
};
