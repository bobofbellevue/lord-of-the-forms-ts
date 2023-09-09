import { Component, ChangeEvent } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";

export interface InputNameProps {
  value: string;
  label: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
  list?: string;
  errors: string;
}

export class ClassInputName extends Component<InputNameProps> {
  render() {
    const { label, value, list, errors, onChange } = this.props;
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
  }
}
