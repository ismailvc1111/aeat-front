"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { registerShortcuts } from "../lib/utils/shortcuts";

export type CommandAction = {
  id: string;
  title: string;
  subtitle?: string;
  onSelect: () => void;
  shortcutKey?: string;
  shortcutLabel?: string;
  group?: string;
};

type CommandPaletteContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  registerAction: (action: CommandAction) => () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | undefined>(
  undefined
);

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [actions, setActions] = useState<Map<string, CommandAction>>(new Map());
  const [query, setQuery] = useState("");

  const registerAction = useCallback((action: CommandAction) => {
    setActions((current) => new Map(current).set(action.id, action));
    return () =>
      setActions((current) => {
        const next = new Map(current);
        next.delete(action.id);
        return next;
      });
  }, []);

  useEffect(() => {
    const unregister = registerShortcuts([
      {
        key: "k",
        meta: true,
        handler: () => setOpen((prev) => !prev),
      },
    ]);
    return unregister;
  }, []);

  useEffect(() => {
    const shortcuts = Array.from(actions.values())
      .filter((action) => action.shortcutKey)
      .map((action) => ({
        key: action.shortcutKey!,
        handler: () => action.onSelect(),
      }));
    if (shortcuts.length === 0) return;
    const unregister = registerShortcuts(shortcuts);
    return unregister;
  }, [actions]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const items = Array.from(actions.values());
    if (!normalized) return items;
    return items.filter((action) =>
      `${action.title} ${action.subtitle ?? ""}`.toLowerCase().includes(normalized)
    );
  }, [actions, query]);

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen, registerAction }}>
      {children}
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setQuery("");
          }
        }}
      >
        <DialogContent className="p-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Type a command or search…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-[320px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-2 py-6 text-sm text-muted-foreground">
                  No actions available
                </p>
              ) : (
                <ul className="space-y-1">
                  {filtered.map((action) => (
                    <li key={action.id}>
                      <Button
                        variant="ghost"
                        className="h-auto w-full justify-between text-left"
                        onClick={() => {
                          setOpen(false);
                          setQuery("");
                          action.onSelect();
                        }}
                      >
                        <span className="flex flex-col items-start">
                          <span className="text-sm font-medium">{action.title}</span>
                          {action.subtitle ? (
                            <span className="text-xs text-muted-foreground">
                              {action.subtitle}
                            </span>
                          ) : null}
                        </span>
                        {action.shortcutLabel ? (
                          <span className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            {action.shortcutLabel}
                          </span>
                        ) : null}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </CommandPaletteContext.Provider>
  );
}

export const useCommandPalette = () => {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }
  return ctx;
};

export function useRegisterCommand(action: CommandAction) {
  const { registerAction } = useCommandPalette();
  useEffect(() => {
    return registerAction(action);
  }, [registerAction, action]);
}
