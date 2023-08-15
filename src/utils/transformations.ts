export const capitalize = (value: string) => {
  const lowString = value.toLowerCase();
  let newValue = "";
  let workingString = "";
  let whiteSpace = true;
  for (let i = 0; i < lowString.length; i++) {
    workingString = lowString[i];
    if (whiteSpace) {
      workingString = workingString.toUpperCase();
      whiteSpace = false;
    }
    newValue += workingString;
    if (workingString[0] === " ") {
      whiteSpace = true;
    }
  }
  return newValue;
};

export const formatPhoneNumber = (phone: string) => {
  if (phone.length < 7) {
    return "";
  }
  return (
    phone.slice(0, 2) +
    "-" +
    phone.slice(2, 4) +
    "-" +
    phone.slice(4, 6) +
    "-" +
    phone.slice(6, 7)
  );
};
