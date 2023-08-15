import { ErrorMessage } from "../ErrorMessage.tsx";

export interface InputNameProps {
  error: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  value: string;
  label: string;
  list?: string;
}

export const FunctionalInputName = (props: InputNameProps) => {
  return (
    <div>
      <div className="input-wrap">
        <label>{props.label}:</label>
        <input
          type="text"
          onChange={props.onChange}
          value={props.value}
          list={props.list}
        />
      </div>
      <ErrorMessage message={props.error} show={props.error !== ""} />
    </div>
  );
};
