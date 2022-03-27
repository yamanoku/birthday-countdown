var c=Object.defineProperty;var d=(r,t,e)=>t in r?c(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var o=(r,t,e)=>(d(r,typeof t!="symbol"?t+"":t,e),e);const m=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&a(u)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerpolicy&&(s.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?s.credentials="include":n.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}};m();class p{constructor(t,e,a){o(this,"elementID");o(this,"birthDay");o(this,"birthdayMessage");this.elementID=t,this.birthDay=e,this.birthdayMessage=a}countDown(){const t=new Date,e=Number(this.birthDay)-Number(t),a=Math.floor(e/(24*60*60*1e3)),n=Math.floor(e%(24*60*60*1e3)/(60*60*1e3)),s=Math.floor(e%(24*60*60*1e3)/(60*1e3))%60,u=Math.floor(e%(24*60*60*1e3)/1e3)%60%60,i=document.getElementById(this.elementID);if(i!==null)if(e>0||e<-864e5){const l=`
        <p>\u3084\u307E\u306E\u304F\u306E\u8A95\u751F\u65E5\u307E\u3067</p>
        <div class="number">
          <p>
            <span class="number-day">${a}</span>
            <span class="number_value">day</span>
          </p>
          <p>
            <span class="number-hour">
            ${String(n).padStart(2,"0")}
            </span>
            <span class="number_value">hour</span>
          </p>
          <p>
            <span class="number-min">
            ${String(s).padStart(2,"0")}
            </span>
            <span class="number_value">min</span>
          </p>
          <p>
            <span class="number-sec">
              ${String(u).padStart(2,"0")}
            </span>
            <span class="number_value">sec</span>
          </p>
        </div>`;i.innerHTML=l,setTimeout(()=>{this.countDown()},10)}else i.innerHTML=this.birthdayMessage}}window.onload=()=>{const r="CDT",t=new Date;let e=new Date(t.getFullYear(),9,30);Number(e)-Number(t)<-864e5&&(e=new Date(t.getFullYear()+1,9,30));const a=`
    <p class="birth_end">
      \u4ECA\u65E5\u8A95\u751F\u65E5\u3067\u3059
    </p>
    <a class="birth_btn" href="http://amzn.asia/cti4d0v" target="_blank">
      \u6B32\u3057\u3044\u3082\u306E\u3092\u9001\u3063\u3066\u3084\u308B
    </a>
    <a class="birth_btn" href="http://amzn.asia/8Kh4dGA" target="_blank">
      \u9152\u3092\u9001\u3063\u3066\u3084\u308B
    </a>`;new p(r,e,a).countDown()};
