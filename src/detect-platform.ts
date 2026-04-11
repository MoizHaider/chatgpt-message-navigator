// ---------------------------------------------------------------------------
// Detect which AI chat platform we're on, based on the current URL.
// ---------------------------------------------------------------------------

import { chatgptConfig, geminiConfig, type PlatformConfig } from "./platform-config";

let cached: PlatformConfig | null = null;

export function getActivePlatform(): PlatformConfig {
  if (cached) return cached;

  const host = location.hostname;

  if (host.includes("gemini.google.com")) {
    cached = geminiConfig;
  } else {
    cached = chatgptConfig; // default / fallback
  }

  return cached;
}
