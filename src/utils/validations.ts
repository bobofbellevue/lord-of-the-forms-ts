export function validateEmail(value: string, submitted: boolean) {
  let errorMessage = "";
  if (submitted && value.length === 0) {
    errorMessage += "Email is required. ";
  }
  const validEmailFormat =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (submitted && value.length > 0 && !validEmailFormat.test(value)) {
    errorMessage += "Invalid email format. ";
  }
  return errorMessage;
}

export function validateName(field: string, name: string, submitted: boolean) {
  let errorMessage = "";
  if (submitted) {
    if (name.length === 0) {
      errorMessage += field + " is required. ";
    } else if (name.length === 1) {
      errorMessage += field + " must be at least 2 characters long. ";
    }
  }
  if (name.length > 30) {
    errorMessage += field + " is too long. ";
  }
  if (name.length > 0 && !/^[a-zA-Z\- ëúóûá'()íî]+$/.test(name)) {
    errorMessage += field + " contains invalid characters. ";
  }
  return errorMessage;
}

export function validatePhone(field: string, phone: string, submitted: boolean) {
  let errorMessage = "";
  if (submitted) {
    if (phone.length === 0) {
      errorMessage += field + " is required. ";
    } else if (phone.length < 7) {
      errorMessage += field + " must be 7 characters long. ";
    }
  }
  return errorMessage;
}
