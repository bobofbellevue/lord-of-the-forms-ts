import { Component } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";
import { validateEmail, validateName } from "../utils/validations.ts";
import { ClassFormState, ErrorType } from "../types.ts";

export interface InputNameProps {
  errorType: number;
  value: string;
  label: string;
  fieldName: string;
  state: ClassFormState;
  setState(state: ClassFormState): void;
  list?: string;
}

export class ClassInputName extends Component<InputNameProps> {
  onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newErrors = this.props.state.errors;
    const errorMessage = validateEmail(
      e.target.value,
      this.props.state.submitted
    );
    newErrors[ErrorType.Email] = errorMessage;
    this.props.setState({
      ...this.props.state,
      errors: newErrors,
      userStaging: { ...this.props.state.userStaging, email: e.target.value },
    });
  };

  onChangeName = (
    e: React.ChangeEvent<HTMLInputElement>,
    property: string,
    fieldName: string,
    errorType: ErrorType
  ) => {
    const newErrors = this.props.state.errors;
    const errorMessage = validateName(
      fieldName,
      e.target.value,
      this.props.state.submitted
    );
    newErrors[errorType] = errorMessage;
    this.props.setState({
      ...this.props.state,
      errors: newErrors,
      userStaging: {
        ...this.props.state.userStaging,
        [property]: e.target.value,
      },
    });
  };

  render() {
    return (
      <div>
        <div className="input-wrap">
          <label>{this.props.label}:</label>
          <input
            type="text"
            onChange={
              this.props.fieldName === "email"
                ? (e) => this.onChangeEmail(e)
                : (e) =>
                    this.onChangeName(
                      e,
                      this.props.fieldName,
                      this.props.label,
                      this.props.errorType
                    )
            }
            value={this.props.value}
            list={this.props.list}
          />
        </div>
        <ErrorMessage
          message={this.props.state.errors[this.props.errorType]}
          show={this.props.state.errors[this.props.errorType] !== ""}
        />
      </div>
    );
  }
}
