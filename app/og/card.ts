import type { OgSnapshot } from "./params.ts";

const NAVY = "#36465d";
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

  if (snapshot.mode === "eve") {
    return frame(`<div style="display:flex;flex-direction:column;width:1200px;height:630px;align-items:center;justify-content:center;">
      ${logo(120)}
      <div style="display:flex;margin-top:40px;font-size:72px;">明日は誕生日！</div>
    </div>`);
  }

  return frame(`<div style="display:flex;flex-direction:column;width:1200px;height:630px;align-items:center;justify-content:center;">
    ${logo(108)}
    <div style="display:flex;margin-top:36px;font-size:42px;">やまのくの誕生日まで</div>
    <div style="display:flex;margin-top:16px;font-size:96px;">あと${snapshot.days}日</div>
  </div>`);
};
