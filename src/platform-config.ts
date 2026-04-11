// ---------------------------------------------------------------------------
// Platform-specific DOM selectors & identifiers
// ---------------------------------------------------------------------------

export interface PlatformConfig {
  /** Platform name for debugging */
  name: "chatgpt" | "gemini";

  /** Selector for the root element the MutationObserver attaches to */
  observerRoot: string;

  /** Selector for the parent container that holds the conversation */
  conversationParent: string;

  /** Selector for individual user-message elements */
  userMessageSelector: string;

  /**
   * Attribute on a user-message element that provides a stable unique ID.
   * `null` when the platform doesn't expose one (we fall back to index-based IDs).
   */
  messageIdAttribute: string | null;

  /**
   * Optional selector scoped *inside* a user-message element to extract
   * preview text from. When `null`, we use the element's own `textContent`.
   */
  previewTextSelector: string | null;

  /**
   * How to locate the anchor element the button-container is appended to:
   *  - `"firstChild"` → `parent.firstElementChild`
   *  - `"self"`       → the parent element itself
   */
  btnAnchorStrategy: "firstChild" | "self";
}

// ---- ChatGPT ---------------------------------------------------------------

export const chatgptConfig: PlatformConfig = {
  name: "chatgpt",
  observerRoot: "main",
  conversationParent: 'div[role="presentation"]',
  userMessageSelector: 'div[data-message-author-role="user"]',
  messageIdAttribute: "data-message-id",
  previewTextSelector: null,
  btnAnchorStrategy: "firstChild",
};

// ---- Gemini ----------------------------------------------------------------

export const geminiConfig: PlatformConfig = {
  name: "gemini",
  observerRoot: "chat-window",
  conversationParent: "chat-window",
  userMessageSelector: 'div[role="heading"][aria-level="2"].query-text',
  messageIdAttribute: null,
  previewTextSelector: "p.query-text-line",
  btnAnchorStrategy: "self",
};
