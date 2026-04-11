import { scrollObserver, resetActiveBtn } from "./scroll-observer";
import { createBtn } from "./createBtn";
import { getActivePlatform } from "./detect-platform";

const observedElements = new WeakSet<Element>();

export function injectNavigationButtons() {
  const config = getActivePlatform();

  const parent = document.querySelector(config.conversationParent);
  if (!parent) return;

  const msgContainer =
    config.btnAnchorStrategy === "firstChild"
      ? parent.firstElementChild
      : parent;

  const chatArray = parent.querySelectorAll<HTMLElement>(
    config.userMessageSelector,
  );

  if (!msgContainer || chatArray.length === 0) {
    // Chat cleared or navigated away — clean up
    const old = document.getElementById("navigate-btn-container");
    if (old) old.remove();
    return;
  }

  let btnContainer = document.getElementById("navigate-btn-container");
  if (!btnContainer) {
    btnContainer = document.createElement("div");
    btnContainer.id = "navigate-btn-container";
    msgContainer.append(btnContainer);
  }

  // Build a list of wanted IDs (stable attribute or index-based fallback)
  const wantedIds: string[] = [];
  for (let i = 0; i < chatArray.length; i++) {
    if (config.messageIdAttribute) {
      wantedIds.push(chatArray[i].getAttribute(config.messageIdAttribute) || "");
    } else {
      wantedIds.push(`${config.name}-${i}`);
    }
  }

  // Build a map of what we already have: turnId → button element
  const existingBtns = btnContainer.querySelectorAll<HTMLButtonElement>(
    "button[data-turn-id]",
  );

  // Quick equality check — if all IDs match in order, skip the work
  if (existingBtns.length === wantedIds.length) {
    let same = true;
    for (let i = 0; i < wantedIds.length; i++) {
      if ((existingBtns[i].getAttribute("data-turn-id") || "") !== wantedIds[i]) {
        same = false;
        break;
      }
    }
    if (same) return;
  }

  // Full rebuild only when the set of messages changed
  resetActiveBtn();
  btnContainer.innerHTML = "";

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < chatArray.length; i++) {
    const chat = chatArray[i];
    chat.dataset.navIndex = String(i);

    if (!observedElements.has(chat)) {
      scrollObserver.observe(chat);
      observedElements.add(chat);
    }

    const btn = createBtn(chat, i, wantedIds[i]);
    fragment.appendChild(btn);
  }

  btnContainer.appendChild(fragment);
}
