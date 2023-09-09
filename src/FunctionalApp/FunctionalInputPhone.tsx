import { useRef, ChangeEvent, KeyboardEvent } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";
import { FunctionalInputPhoneSegment } from "./FunctionalInputPhoneSegment.tsx";

type onChangeParams = {
  pos: number;
  max: number;
  nextMax: number;
};

type onKeyUpParams = {
  pos: number;
};

type FunctionalInputPhoneProps = {
  label: string;
  value: string;
  setPhoneState(phone: string): void;
  errors: string;
};

export const FunctionalInputPhone = (props: FunctionalInputPhoneProps) => {
  const phoneSegmentRefs: React.RefObject<HTMLInputElement>[] = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const onChange = (
    e: ChangeEvent<HTMLInputElement>,
    params: onChangeParams
  ) => {
    const { pos, max, nextMax } = params;
    // strip out non-digit characters
    const value = e.target.value.replace(/[^0-9]/g, "");
    let phoneSegment = value;
    let phoneExcess = "";
    // strip out characters that exceed field length
    if (phoneSegment.length > max) {
      phoneExcess = phoneSegment.slice(max, max + 1);
      phoneSegment = phoneSegment.slice(0, max);
    }
    const newPhoneSegments: string[] = [];
    for (let i = 0; i < 4; i++) {
      const obj = phoneSegmentRefs[i].current;
      if (obj) {
        newPhoneSegments.push(obj.value);
      } else {
        newPhoneSegments.push("");
      }
    }
    const oldLength = newPhoneSegments.join("").length;
    newPhoneSegments[pos] = phoneSegment;
    // excess character can be bumped along to next field if empty
    if (
      pos < 3 &&
      phoneExcess.length === 1 &&
      newPhoneSegments[pos + 1].length === 0
    ) {
      newPhoneSegments[pos + 1] = phoneExcess;
    }
    // determine if we are going backwards - deleting characters - whether by backspace, delete key, or overtyping
    const backwards = newPhoneSegments.join("").length < oldLength;
    const phone = newPhoneSegments.join("");
    props.setPhoneState(phone);
    // jump to next or previous field and set focus to end of content, in two cases:
    // 1. going forwards if current field is full and there is a next field
    // 2. going backwards if current field is empty and there is a previous field
    if (
      (phoneSegment.length == max && nextMax > 0 && !backwards) ||
      (pos > 0 && backwards && phoneSegment.length === 0)
    ) {
      const newPos = pos + (backwards ? -1 : 1);
      const obj = phoneSegmentRefs[newPos].current;
      if (obj) {
        obj.focus();
        if (!backwards && nextMax == newPhoneSegments[newPos].length) {
          // highlight existing text if it fills up the field
          obj.selectionStart = 0;
          obj.selectionEnd = newPhoneSegments[newPos].length;
        } else {
          // set caret to end of text
          obj.selectionStart = newPhoneSegments[newPos].length;
          obj.selectionEnd = newPhoneSegments[newPos].length;
        }
      }
    }
  };

  const onKeyUp = (
    e: KeyboardEvent<HTMLInputElement>,
    params: onKeyUpParams
  ) => {
    const { pos } = params;
    const phoneSegments: string[] = [];
    for (let i = 0; i < 4; i++) {
      const obj = phoneSegmentRefs[i].current;
      if (obj) {
        phoneSegments.push(obj.value);
      } else {
        phoneSegments.push("");
      }
    }
    // jump to field and set focus to end of content, if hitting backspace in an empty field (onChange would not be triggered)
    if (e.key === "Backspace" && phoneSegments[pos].length === 0 && pos > 0) {
      const obj = phoneSegmentRefs[pos - 1].current;
      if (obj) {
        obj.focus();
        obj.selectionStart = phoneSegments[pos - 1].length;
        obj.selectionEnd = phoneSegments[pos - 1].length;
      }
    }
  };

  const { errors, value } = props;
  return (
    <div>
      <div className="input-wrap">
        <label htmlFor="phone">Phone:</label>
        <div id="phone-input-wrap">
          <FunctionalInputPhoneSegment
            pos={0}
            value={value.slice(0, 2)}
            reference={phoneSegmentRefs[0]}
            onChange={(e) => onChange(e, { pos: 0, max: 2, nextMax: 2 })}
            onKeyUp={(e) => onKeyUp(e, { pos: 0 })}
          />
          -
          <FunctionalInputPhoneSegment
            pos={1}
            value={value.slice(2, 4)}
            reference={phoneSegmentRefs[1]}
            onChange={(e) => onChange(e, { pos: 1, max: 2, nextMax: 2 })}
            onKeyUp={(e) => onKeyUp(e, { pos: 1 })}
          />
          -
          <FunctionalInputPhoneSegment
            pos={2}
            value={value.slice(4, 6)}
            reference={phoneSegmentRefs[2]}
            onChange={(e) => onChange(e, { pos: 2, max: 2, nextMax: 1 })}
            onKeyUp={(e) => onKeyUp(e, { pos: 2 })}
          />
          -
          <FunctionalInputPhoneSegment
            pos={3}
            value={value.slice(6, 7)}
            reference={phoneSegmentRefs[3]}
            onChange={(e) => onChange(e, { pos: 3, max: 1, nextMax: 0 })}
            onKeyUp={(e) => onKeyUp(e, { pos: 3 })}
          />
        </div>
      </div>
      <ErrorMessage message={errors} show={errors !== ""} />
    </div>
  );
};
