export function isInStandaloneMode() {
  return Boolean(
    window.matchMedia && window.matchMedia("(display-mode: standalone)").matches
  );
}
