import { Component, createRef, RefObject, ChangeEvent } from "react";
import { ErrorMessage } from "../ErrorMessage.tsx";
import { ClassInputPhoneSegment } from "./ClassInputPhoneSegment.tsx";

type onChangeParams = {
  pos: number;
  max: number;
  nextMax: number;
};

type onKeyUpParams = {
  pos: number;
};

type ClassInputPhoneProps = {
  label: string;
  value: string;
  errors: string;
  setPhoneState(value: string): void;
};

export class ClassInputPhone extends Component<ClassInputPhoneProps> {
  // These refs used to reposition the cursor and caret among the phone segment fields
  phoneSegmentRefs: RefObject<HTMLInputElement>[] = [
    createRef(),
    createRef(),
    createRef(),
    createRef(),
  ];

  onChange(e: ChangeEvent<HTMLInputElement>, params: onChangeParams) {
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
      const obj = this.phoneSegmentRefs[i].current;
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
    this.props.setPhoneState(phone);
    // jump to next or previous field and set focus to end of content, in two cases:
    // 1. going forwards if current field is full and there is a next field
    // 2. going backwards if current field is empty and there is a previous field
    if (
      (phoneSegment.length == max && nextMax > 0 && !backwards) ||
      (pos > 0 && backwards && phoneSegment.length === 0)
    ) {
      const newPos = pos + (backwards ? -1 : 1);
      const obj = this.phoneSegmentRefs[newPos].current;
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
  }

  onKeyUp(key: React.Key, params: onKeyUpParams) {
    const { pos } = params;
    const phoneSegments: string[] = [];
    for (let i = 0; i < 4; i++) {
      const obj = this.phoneSegmentRefs[i].current;
      if (obj) {
        phoneSegments.push(obj.value);
      } else {
        phoneSegments.push("");
      }
    }
    // jump to field and set focus to end of content, if hitting backspace in an empty field (onChange would not be triggered)
    if (key === "Backspace" && phoneSegments[pos].length === 0 && pos > 0) {
      const obj = this.phoneSegmentRefs[pos - 1].current;
      if (obj) {
        obj.focus();
        obj.selectionStart = phoneSegments[pos - 1].length;
        obj.selectionEnd = phoneSegments[pos - 1].length;
      }
    }
  }

  render() {
    const { value, errors, label } = this.props;
    return (
      <div>
        <div className="input-wrap">
          <label htmlFor="phone">{label}:</label>
          <div id="phone-input-wrap">
            <ClassInputPhoneSegment
              pos={0}
              value={value.slice(0, 2)}
              reference={this.phoneSegmentRefs[0]}
              onChange={(e) => this.onChange(e, { pos: 0, max: 2, nextMax: 2 })}
              onKeyUp={(e) => this.onKeyUp(e.key, { pos: 0 })}
            />
            -
            <ClassInputPhoneSegment
              pos={1}
              value={value.slice(2, 4)}
              reference={this.phoneSegmentRefs[1]}
              onChange={(e) => this.onChange(e, { pos: 1, max: 2, nextMax: 2 })}
              onKeyUp={(e) => this.onKeyUp(e.key, { pos: 1 })}
            />
            -
            <ClassInputPhoneSegment
              pos={2}
              value={value.slice(4, 6)}
              reference={this.phoneSegmentRefs[2]}
              onChange={(e) => this.onChange(e, { pos: 2, max: 2, nextMax: 1 })}
              onKeyUp={(e) => this.onKeyUp(e.key, { pos: 2 })}
            />
            -
            <ClassInputPhoneSegment
              pos={3}
              value={value.slice(6, 7)}
              reference={this.phoneSegmentRefs[3]}
              onChange={(e) => this.onChange(e, { pos: 3, max: 1, nextMax: 0 })}
              onKeyUp={(e) => this.onKeyUp(e.key, { pos: 3 })}
            />
          </div>
        </div>
        <ErrorMessage message={errors} show={errors !== ""} />
      </div>
    );
  }
}
