const STORAGE_KEY = 'polkadot-tax-tool.disclaimer-accepted-version';

// Bump this when the disclaimer text is materially updated — all users will
// be re-prompted to accept the new version on their next wallet action.
export const CURRENT_DISCLAIMER_VERSION = '2026-05-26';

export function hasAcceptedCurrentDisclaimer(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === CURRENT_DISCLAIMER_VERSION;
  } catch {
    return false;
  }
}

export function recordDisclaimerAcceptance(): void {
  try {
    localStorage.setItem(STORAGE_KEY, CURRENT_DISCLAIMER_VERSION);
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail silent;
    // the user will simply be re-prompted next session.
  }
}
