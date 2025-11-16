import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

/**
 * Props untuk FormField component
 */
interface FormFieldProps {
    id: string;
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    error?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    onBlur: () => void;
}

/**
 * Reusable form field component label, input, dan error msg
 */
export function FormField({
    id,
    name,
    label,
    type = "text",
    placeholder,
    value,
    error,
    disabled,
    onChange,
    onBlur,
}: FormFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                disabled={disabled}
                aria-invalid={!!error}
            />
            {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
    );
}
