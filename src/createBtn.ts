import { getActivePlatform } from "./detect-platform";

const MAX_PREVIEW_LENGTH = 200;

/**
 * Extract the preview text from a user-message element.
 * - ChatGPT: use the element's direct textContent.
 * - Gemini : collect text from `<p class="query-text-line">` children
 *            to avoid including the "You said" screen-reader span.
 */
function extractPreviewText(messageEle: HTMLElement): string {
  const config = getActivePlatform();

  let rawText: string;

  if (config.previewTextSelector) {
    const parts = messageEle.querySelectorAll(config.previewTextSelector);
    rawText = Array.from(parts)
      .map((p) => p.textContent?.trim() || "")
      .filter(Boolean)
      .join(" ");
  } else {
    rawText = messageEle.textContent || "";
  }

  return rawText.length > MAX_PREVIEW_LENGTH
    ? rawText.slice(0, MAX_PREVIEW_LENGTH) + "…"
    : rawText;
}

export const createBtn = (
  messageEle: HTMLElement,
  index: number,
  turnId: string,
) => {
  const text = extractPreviewText(messageEle);

  const btn = document.createElement("button");
  btn.className = "nav-btn";
  btn.style.setProperty("--msg-preview", JSON.stringify(text));
  btn.setAttribute("data-turn-id", turnId);
  btn.setAttribute("data-nav-index", String(index));

  const line = document.createElement("div");
  line.className = "msg-line";
  btn.appendChild(line);

  btn.onclick = () => {
    messageEle.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return btn;
};
