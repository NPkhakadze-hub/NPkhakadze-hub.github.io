/* ─── Shared header / footer / contact config for learnenglishonlinecourses.com ─── */
const SITE = {
  name: "Mr Nodar",
  tagline: "English Online Courses",
  email: "NPkhakadze@learnenglishonlinecourses.com",
  // ▼ შეავსე: WhatsApp ნომერი საერთაშორისო ფორმატით (მაგ. 995599123456) და FB გვერდის მისამართი
  whatsapp: "",
  facebook: "https://www.facebook.com/",
  messenger: "https://m.me/"
};
const ROOT = (function(){
  // works both at /site/ and /site/blog/x.html
  const depth = (location.pathname.match(/\//g) || []).length - 1;
  const p = document.querySelector('meta[name="site-root"]');
  return p ? p.content : (depth > 1 && !location.pathname.endsWith("/") ? "../" : "./");
})();

document.addEventListener("DOMContentLoaded", () => {
  const root = document.body.dataset.root || "./";
  const page = document.body.dataset.page || "";
  const nav = [
    ["index.html","მთავარი","home"],
    ["shop/","მასალები","shop"],
    ["blog/","ბლოგი","blog"],
    ["m/","კაბინეტი","cabinet"],
    ["index.html#contact","ჩაწერა","contact"]
  ];
  const header = document.createElement("header");
  header.innerHTML = `<div class="wrap nav">
    <a class="logo" href="${root}index.html"><span class="mark">N</span><span>Mr Nodar<small>ENGLISH ONLINE COURSES</small></span></a>
    <button class="burger" aria-label="მენიუ">☰</button>
    <nav class="menu">${nav.map(([h,t,k]) => `<a href="${root}${h}" class="${k===page?'on':''}">${t}</a>`).join("")}</nav>
  </div>`;
  document.body.prepend(header);
  header.querySelector(".burger").addEventListener("click", () => header.querySelector(".menu").classList.toggle("open"));

  const footer = document.createElement("footer");
  footer.innerHTML = `<div class="wrap cols">
    <div>© ${new Date().getFullYear()} Mr Nodar · Learn English Online Courses<br><a href="mailto:${SITE.email}">${SITE.email}</a></div>
    <div><a href="${root}index.html">მთავარი</a><a href="${root}shop/">მასალები</a><a href="${root}blog/">ბლოგი</a><a href="${root}m/">კაბინეტი</a><a href="${SITE.facebook}" target="_blank" rel="noopener">Facebook</a></div>
  </div>`;
  document.body.append(footer);

  // contact buttons anywhere: <div class="contact-row" data-contact></div>
  document.querySelectorAll("[data-contact]").forEach(el => {
    const wa = SITE.whatsapp ? `<a class="wa" href="https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("გამარჯობა, ინგლისურის გაკვეთილები მაინტერესებს")}" target="_blank" rel="noopener">💬 WhatsApp</a>` : "";
    el.innerHTML = `${wa}
      <a class="ms" href="${SITE.messenger}" target="_blank" rel="noopener">✉️ Messenger</a>
      <a class="fb" href="${SITE.facebook}" target="_blank" rel="noopener">👍 Facebook გვერდი</a>
      <a class="mail" href="mailto:${SITE.email}?subject=${encodeURIComponent("ინგლისურის გაკვეთილები")}">📧 მეილი</a>`;
  });
});
