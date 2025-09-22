"use client";

import * as React from "react";
import { Input } from "./ui/input";

export interface MoneyInputProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Input>, "onChange"> {
  onValueChange?: (value: number) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ onValueChange, onChange, value, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        inputMode="decimal"
        step="0.01"
        value={value}
        onChange={(event) => {
          const raw = event.target.value;
          const numeric = Number.parseFloat(raw.replace(/,/g, "."));
          if (!Number.isNaN(numeric)) {
            onValueChange?.(numeric);
          }
          onChange?.(event);
        }}
        {...props}
      />
    );
  }
);
MoneyInput.displayName = "MoneyInput";
