const LOCATION_FILES = {
  en: "db/locations-en.json",
  zh: "db/locations-zh.json"
};

const HUB_FILES = {
  en: "db/transport-hubs-en.json",
  zh: "db/transport-hubs-zh.json"
};

async function fetchJson(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error(`Failed to load ${path} (${r.status})`);
  return r.json();
}

export function fetchLocations(lang)     { return fetchJson(LOCATION_FILES[lang]); }
export function fetchTransportHubs(lang) { return fetchJson(HUB_FILES[lang]); }