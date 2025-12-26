import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password";

/**
 * Props untuk FormField
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
 * Reusable form field component label, input (text/password), error msg
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
            {type === "password" ? (
                <PasswordInput
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onBlur={onBlur}
                    disabled={disabled}
                    aria-invalid={!!error}
                />
            ) : (
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
            )}
            {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
    );
}
