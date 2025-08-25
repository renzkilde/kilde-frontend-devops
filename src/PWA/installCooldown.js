const INSTALL_COOLDOWN_KEY = "pwa-install-cooldown";
const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;

export function setInstallCooldown() {
  localStorage.setItem(INSTALL_COOLDOWN_KEY, Date.now().toString());
}

export function isInInstallCooldown() {
  const ts = localStorage.getItem(INSTALL_COOLDOWN_KEY);
  if (!ts) return false;
  return Date.now() - Number(ts) < COOLDOWN_MS;
}
