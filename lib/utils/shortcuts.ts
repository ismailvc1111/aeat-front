export type Shortcut = {
  key: string;
  meta?: boolean;
  shift?: boolean;
  handler: () => void;
  preventDefault?: boolean;
};

export const registerShortcuts = (
  shortcuts: Shortcut[]
): (() => void) => {
  const listener = (event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    if (target) {
      const tagName = target.tagName?.toLowerCase();
      const isEditable =
        target.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select";
      if (isEditable && event.key !== "Escape") {
        return;
      }
    }
    shortcuts.forEach((shortcut) => {
      const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const metaPressed = event.metaKey || event.ctrlKey;
      const matchesMeta =
        shortcut.meta === undefined ? true : shortcut.meta === metaPressed;
      const matchesShift =
        shortcut.shift === undefined ? true : shortcut.shift === event.shiftKey;
      if (matchesKey && matchesMeta && matchesShift) {
        if (shortcut.preventDefault !== false) {
          event.preventDefault();
        }
        shortcut.handler();
      }
    });
  };
  window.addEventListener("keydown", listener);
  return () => window.removeEventListener("keydown", listener);
};
