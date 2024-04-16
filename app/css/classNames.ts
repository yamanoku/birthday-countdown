import { css } from "hono/css";

const htmlClass = css`
  font-size: 62.5%;
  font-family: "Yu Gothic", YuGothic, Meirio, "Helvetica Neue", "Helvetica",
    "Arial", sans-serif;
  -webkit-text-size-adjust: 100%;
`;

const bodyClass = css`
  background: #36465d;
  color: #fff;
  padding: 0 10px;
  text-align: center;
  font-weight: 400;
  font-size: 4.2rem;
`;

const numberClass = css`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  margin-top: 25px;
`;

const numberValueClass = css`
  display: block;
  font-size: 3rem;
  color: #b9bfc9;
`;

const numberKeyClass = css`
  font-size: 15rem;
  margin: 10px;
  letter-spacing: -0.05em;
`;

const birthEndClass = css`
  font-size: 5rem;
  line-height: 1.4;
`;

const birthBtnClass = css`
  border: 1px solid #303e50;
  background-color: #529ecc;
  border-radius: 3px;
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.25);
  color: #fff;
  display: block;
  font-size: 2.8rem;
  margin: 32px auto 0;
  max-width: 360px;
  padding: 15px 0;
  text-decoration: none;
`;

export {
  htmlClass,
  bodyClass,
  numberClass,
  numberValueClass,
  numberKeyClass,
  birthEndClass,
  birthBtnClass
};
