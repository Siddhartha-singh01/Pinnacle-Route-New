/**
 * Accordion ("What we do")
 * ------------------------
 * Opens one panel at a time. Targets the #wwd container.
 */

export function initAccordion(): void {
  const root = document.getElementById("wwd");
  if (!root) return;

  const items = Array.from(root.querySelectorAll<HTMLElement>(".wwd-item"));

  const openItem = (target: HTMLElement) => {
    items.forEach((it) => {
      const panel = it.querySelector<HTMLElement>(".wwd-panel");
      const head = it.querySelector<HTMLElement>(".wwd-head");
      if (!panel) return;

      const isOpen = it === target;
      it.classList.toggle("is-open", isOpen);
      head?.setAttribute("aria-expanded", String(isOpen));
      panel.style.maxHeight = isOpen ? panel.scrollHeight + "px" : "0px";
    });
  };

  items.forEach((it) => {
    it.querySelector(".wwd-head")?.addEventListener("click", () => openItem(it));
  });

  // Open the first item by default
  if (items[0]) openItem(items[0]);

  // Keep the open panel sized correctly on resize
  window.addEventListener("resize", () => {
    const open = root.querySelector<HTMLElement>(".wwd-item.is-open .wwd-panel");
    if (open) open.style.maxHeight = open.scrollHeight + "px";
  });
}
