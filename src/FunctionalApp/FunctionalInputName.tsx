import { ChangeEvent } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";

export interface InputNameProps {
  label: string;
  value: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
  list?: string;
  errors: string;
}

export const FunctionalInputName = (props: InputNameProps) => {
  const { label, onChange, value, list, errors } = props;
  return (
    <div>
      <div className="input-wrap">
        <label>{label}:</label>
        <input
          type="text"
          onChange={(e) => onChange(e)}
          value={value}
          list={list}
        />
      </div>
      <ErrorMessage message={errors} show={errors !== ""} />
    </div>
  );
};
