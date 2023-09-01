import { ChangeEvent } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";
import { ErrorType, FunctionalStateType } from "../types.ts";
import { validateName, validateEmail } from "../utils/validations.ts";

const onChangeField = (
  e: ChangeEvent<HTMLInputElement>,
  props: InputNameProps
) => {
  const newErrors = props.state.errors;
  let errorMessage = "";
  if (props.errorType === ErrorType.Email) {
    errorMessage = validateEmail(e.target.value, props.state.submitted);
  } else {
    errorMessage = validateName(
      props.fieldName,
      e.target.value,
      props.state.submitted
    );
  }
  newErrors[props.errorType] = errorMessage;
  props.state.setErrors(newErrors);
  props.state.setUserStaging({
    ...props.state.userStaging,
    [props.fieldName]: e.target.value,
  });
};

export interface InputNameProps {
  state: FunctionalStateType;
  value: string;
  label: string;
  errorType: ErrorType;
  fieldName: string;
  list?: string;
}

export const FunctionalInputName = (props: InputNameProps) => {
  return (
    <div>
      <div className="input-wrap">
        <label>{props.label}:</label>
        <input
          type="text"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChangeField(e, props)
          }
          value={props.value}
          list={props.list}
        />
      </div>
      <ErrorMessage
        message={props.state.errors[props.errorType]}
        show={props.state.errors[props.errorType] !== ""}
      />
    </div>
  );
};
