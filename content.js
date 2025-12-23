// content.js
(() => {
  const m3u8Links = [];

  // Find all links in scripts, source tags, video tags, etc.
  document.querySelectorAll("video, source, script, link").forEach((el) => {
    const src = el.src || el.getAttribute("src");
    if (src && src.includes(".m3u8")) {
      m3u8Links.push(src);
    }
  });

  return m3u8Links;
})();
