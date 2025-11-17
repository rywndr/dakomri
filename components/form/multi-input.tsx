"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

/**
 * Component untuk input multiple values (array)
 * Digunakan untuk field seperti jenis pelatihan, penyelenggara, dll
 */
interface MultiInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
}

export function MultiInput({
  label,
  values,
  onChange,
  placeholder = "Masukkan nilai",
  disabled = false,
  error,
  required = false,
}: MultiInputProps) {
  const [currentInput, setCurrentInput] = useState("");

  // Tambah item baru ke array
  const handleAdd = () => {
    if (currentInput.trim()) {
      onChange([...values, currentInput.trim()]);
      setCurrentInput("");
    }
  };

  // Hapus item dari array
  const handleRemove = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* List item yang sudah ditambahkan */}
      {values.length > 0 && (
        <div className="space-y-2 mb-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-md"
            >
              <span className="flex-1 text-sm">{value}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className="h-6 w-6 p-0 hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Input untuk tambah item baru */}
      <div className="flex gap-2">
        <Input
          id={label}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={error ? "border-destructive" : ""}
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={disabled || !currentInput.trim()}
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-1" />
          Tambah
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
