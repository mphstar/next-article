import { useState } from "react";

export function useFormState<T extends Record<string, string>>(
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setValues(initialValues);
  };

  return {
    values,
    setValues,
    handleChange,
    reset,
  };
}
