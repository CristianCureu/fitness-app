import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

type FormInputProps = TextInputProps & {
  label?: string;
  error?: string;
  helper?: string;
  containerClassName?: string;
};

export const FormInput = forwardRef<TextInput, FormInputProps>(
  (
    {
      label,
      error,
      helper,
      containerClassName,
      className,
      editable = true,
      placeholderTextColor = "#6E7694",
      ...props
    },
    ref
  ) => {
    return (
      <View className={cn("gap-2", containerClassName)}>
        {label ? (
          <Text className="text-xs font-semibold text-text-muted tracking-[1px]">
            {label}
          </Text>
        ) : null}

        <TextInput
          ref={ref}
          className={cn(
            "w-full px-4 py-4 bg-surface-light border rounded-2xl text-base text-text-primary",
            error ? "border-red-500" : "border-border",
            !editable && "opacity-60",
            className
          )}
          editable={editable}
          placeholderTextColor={placeholderTextColor}
          {...props}
        />

        {(error || helper) && (
          <Text className={cn("text-xs", error ? "text-red-400" : "text-text-muted")}>
            {error || helper}
          </Text>
        )}
      </View>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
