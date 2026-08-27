/* GA4 + Google Consent Mode v2 — learnenglishonlinecourses.com
 *
 * ნოდარისთვის: ქვემოთ ერთი ხაზია შესაცვლელი — GA_ID.
 * სანამ იქ 'G-XXXXXXXXXX' წერია, ეს ფაილი **არაფერს ტვირთავს** და საიტი სუფთაა:
 * არც cookie, არც მოთხოვნა Google-თან, არც სიჩქარეზე გავლენა.
 *
 * ⚠️ ეს ფაილი /lessons/ და /m/ გვერდებზე არასდროს ჩაისმება (იხ. build.py head()).
 */
(function () {
  "use strict";

  var GA_ID = "G-BVE99MFNZN";        // ← Measurement ID (GA4 → Admin → Data streams)

  if (GA_ID === "G-XXXXXXXXXX") return;              // ჯერ არ არის — მუნჯი რეჟიმი
  if (!/^G-[A-Z0-9]{6,}$/.test(GA_ID)) return;       // არასწორი ფორმატი — არაფერს ვტვირთავთ

  /* ── Consent Mode v2 ────────────────────────────────────────────────
     რეგიონს Google ვიზიტორის IP-ით ადგენს, არა გვერდის ენით — ქართველი
     ემიგრანტი გერმანიიდან ქართულ „/"-ს კითხულობს და მაინც EEA-ს წესებში ხვდება.
     EEA (30) + GB + CH → denied. დანარჩენი მსოფლიო → analytics granted.
     EU-ში cookieless ping-ები მაინც მიდის და GA4 მოდელირებულ მონაცემებს აჩვენებს,
     ამიტომ cookie-ზოლი არ გვჭირდება. */
  var EEA = [
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT",
    "LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",   // EU 27
    "IS","LI","NO",                                                 // + EEA 3
    "GB","CH"                                                       // + UK, შვეიცარია
  ];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  // რეგიონული default ჯერ, შემდეგ საერთო — Google-ის დოკუმენტაციის რიგი.
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    region: EEA
  });
  gtag("consent", "default", {
    ad_storage: "denied",            // სარეკლამო cookie არსად არ გვჭირდება
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted"
  });

  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
  document.head.appendChild(s);

  /* ── Events ─────────────────────────────────────────────────────────
     Scroll/outbound/file_download — GA4 Enhanced measurement-ს აქვს, აქ არ ვიმეორებთ. */

  var CONTACT = [
    ["https://wa.me", "click_whatsapp"],
    ["https://m.me",  "click_messenger"],
    ["tel:",          "click_phone"],
    ["mailto:",       "click_email"]
  ];

  function postSlug() {
    var m = location.pathname.match(/^\/blog\/([a-z0-9-]+)\.html$/);
    return m ? m[1] : null;
  }

  function send(name, a, extra) {
    var p = {
      page_location: location.href,
      link_url: a.getAttribute("href") || ""
    };
    var slug = postSlug();
    if (slug) p.post_slug = slug;
    if (extra) for (var k in extra) p[k] = extra[k];
    gtag("event", name, p);
  }

  document.addEventListener("click", function (e) {
    var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
    if (!a) return;
    var href = a.getAttribute("href") || "";

    if (a.closest(".lang, .langbar")) {
      send("click_lang_switch", a, { lang_to: a.getAttribute("hreflang") || "" });
      return;
    }

    for (var i = 0; i < CONTACT.length; i++) {
      if (href.indexOf(CONTACT[i][0]) === 0) {
        send(CONTACT[i][1], a);
        // ბლოგპოსტიდან დაწერილი კონტაქტი ცალკეც აღირიცხება — CTA-ს ეფექტურობისთვის
        if (postSlug()) send("blog_cta_click", a, { cta_type: CONTACT[i][1] });
        return;
      }
    }
  }, true);
})();
