import { Component } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";
import { validateEmail, validateName } from "../utils/validations.ts";

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

export class ClassInputName extends Component<InputNameProps> {
  onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { setEmailState, submitted } = this.props;
    if (setEmailState) {
      setEmailState(e.target.value, validateEmail(e.target.value, submitted));
    }
  };

  onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { setNameState, fieldName, submitted } = this.props;
    if (setNameState) {
      setNameState(
        fieldName,
        e.target.value,
        validateName(fieldName, e.target.value, submitted)
      );
    }
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
                : (e) => this.onChangeName(e)
            }
            value={this.props.value}
            list={this.props.list}
          />
        </div>
        <ErrorMessage
          message={this.props.errorMessage}
          show={this.props.errorMessage !== ""}
        />
      </div>
    );
  }
}
