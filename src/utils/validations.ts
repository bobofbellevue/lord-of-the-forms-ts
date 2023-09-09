export function getEmailErrors(value: string, submitted: boolean): string {
  let errors = "";
  if (submitted && value.length === 0) {
    errors += "Email is required. ";
  }
  if (submitted && value.length > 0 && !isEmailValid(value)) {
    errors += "Invalid email format. ";
  }
  return errors;
}

function isEmailValid(emailAddress: string) {
  // eslint-disable-next-line no-useless-escape
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return !!emailAddress.match(regex);
}

export function getNameErrors(fieldName: string, name: string, submitted: boolean): string {
  let errors = "";
  if (submitted && name.length === 0) {
    errors += fieldName + " is required. ";
  } else if (submitted && name.length === 1) {
    errors += fieldName + " must be at least 2 characters long. ";
  }
  if (name.length > 30) {
    errors += fieldName + " is too long. ";
  }
  if (name.length > 0 && !/^[a-zA-Z\- ëúóûá'()íî]+$/.test(name)) {
    errors += fieldName + " contains invalid characters. ";
  }
  return errors;
}

export function getPhoneErrors(value: string, submitted: boolean): string {
  let errors = "";
  if (submitted && value.length === 0) {
    errors += "Phone is required. ";
  } else if (submitted && value.length < 7) {
    errors += "Phone must be 7 characters long. ";
  }
  return errors;
}
