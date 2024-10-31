import { isValidPhoneNumber } from "react-phone-number-input";

function checkEquality(value: string, errorMsg: string, id: string): (inputText: string) => { errorId: string; msg: string | undefined; componentId: string | undefined; } {
    return (inputText: string) => validate("checkEquality", inputText.length > 0 && value.length > 0 && inputText !== value, errorMsg, id);
}

function minLength(len: number, errorMsg: string): (inputText: string) => { errorId: string; msg: string | undefined; componentId: string | undefined; } {
    return (inputText: string) => validate("minLength", inputText.length < len, errorMsg);
}

function isChecked(errorMsg: string): (inputValue: { checked: boolean }[]) => { errorId: string; msg: string | undefined; componentId: string | undefined; } {
    return (inputValue: { checked: boolean }[]) => validate("isChecked", !inputValue.some(v => v.checked), errorMsg);
}

function isEmail(inputText: string): boolean | null {
    const mailFormat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return mailFormat.test(inputText);
}

export function isGreater(input: number, errorMsg: string): (inputText: string) => { errorId: string; msg: string | undefined; componentId: string | undefined; } {
    return (inputText: string) => validate("isGreater", +inputText < +input, errorMsg);
}

export function isLess(input: number, errorMsg: string): (inputText: string) => { errorId: string; msg: string | undefined; componentId: string | undefined; } {
    return (inputText: string) => validate("isGreater", +inputText > +input, errorMsg);
}

function checkFloat(dimension: number | undefined, unsigned: boolean, errorMsg: string): (inputText: string) => { errorId: string; msg: string | undefined; componentId: string | undefined; } {
    const pattern = dimension
        ? `^${unsigned ? "" : "-?"}\\d*(\\.\\d{1,${dimension}})?$`
        : `^${unsigned ? "" : "-?"}\\d+$`;

    const floatRegexp = new RegExp(pattern, "g");
    return (inputText: string) => validate("checkEquality", !String(inputText).match(floatRegexp), errorMsg);
}

function validateEmail(errorMsg: string): (inputText: string) => { errorId: string; msg: string | undefined; componentId: string | undefined; } {
    return (inputText: string) => validate("validateEmail", !isEmail(inputText), errorMsg);
}

function validatePhone(errorMsg: string): (inputText: string) => { errorId: string; msg: string | undefined; componentId: string | undefined; } {
    return (inputText: string) => validate("validatePhone", !isValidPhoneNumber(String(inputText)), errorMsg);
}

function validate(errorId: string, condition: boolean, errorMsg: string, id?: string): { errorId: string; msg: string | undefined; componentId: string | undefined; } {
    return { errorId: errorId, msg: condition && errorMsg, componentId: id };
}

export { validate, isChecked, checkEquality, minLength, checkFloat, validateEmail, validatePhone, isEmail };