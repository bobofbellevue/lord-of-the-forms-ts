import { Component } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";

export interface InputNameProps {
  error: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  value: string;
  label: string;
  list?: string;
}

export class ClassInputName extends Component<InputNameProps> {
  render() {
    return (
      <div>
        <div className="input-wrap">
          <label>{this.props.label}:</label>
          <input
            type="text"
            onChange={this.props.onChange}
            value={this.props.value}
            list={this.props.list}
          />
        </div>
        <ErrorMessage
          message={this.props.error}
          show={this.props.error !== ""}
        />
      </div>
    );
  }
}
