import React from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  ComponentWithAs,
} from "@chakra-ui/react";
import { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  size: _,
  ...props
}) => {
  const [field, { error }] = useField(props);
  let InputOrTextarea: ComponentWithAs<any, {}> = Input;
  if (textarea) {
    InputOrTextarea = Textarea;
  }
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor="name">{label}</FormLabel>
      <InputOrTextarea
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
