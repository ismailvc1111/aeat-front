"use client";

import * as React from "react";
import { Input } from "./ui/input";

export interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onValueChange?: (value: number) => void;
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ onValueChange, value, ...props }, ref) => {
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
          props.onChange?.(event as any);
        }}
        {...props}
      />
    );
  }
);
MoneyInput.displayName = "MoneyInput";
