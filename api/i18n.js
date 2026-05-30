const FILES = {
  en: "i18n/en-US.json",
  zh: "i18n/zh-TW.json"
};

export async function fetchI18n(lang) {
  const path = FILES[lang];
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Failed to load ${path} (${r.status})`);
  return r.json();
}
