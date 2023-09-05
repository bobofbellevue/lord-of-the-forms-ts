import { ChangeEvent } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";
import { validateName, validateEmail } from "../utils/validations.ts";

export interface InputNameProps {
  value: string;
  label: string;
  fieldName: string;
  submitted: boolean;
  setNameState?(fieldName: string, name: string, error: string): void;
  setEmailState?(email: string, error: string): void;
  list?: string;
  errorMessage: string;
}

export const FunctionalInputName = (props: InputNameProps) => {
  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    const { setEmailState, submitted } = props;
    if (setEmailState) {
      setEmailState(e.target.value, validateEmail(e.target.value, submitted));
    }
  };

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const { setNameState, fieldName, submitted } = props;
    if (setNameState) {
      setNameState(
        fieldName,
        e.target.value,
        validateName(fieldName, e.target.value, submitted)
      );
    }
  };

  return (
    <div>
      <div className="input-wrap">
        <label>{props.label}:</label>
        <input
          type="text"
          onChange={
            props.fieldName === "email"
              ? (e) => onChangeEmail(e)
              : (e) => onChangeName(e)
          }
          value={props.value}
          list={props.list}
        />
      </div>
      <ErrorMessage
        message={props.errorMessage}
        show={props.errorMessage !== ""}
      />
    </div>
  );
};
