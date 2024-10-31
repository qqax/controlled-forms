// import {isValidPhoneNumber} from "react-phone-number-input";
//
// function checkEquality(value, errorMsg, id) {
//     return (inputText) => validate("checkEquality", inputText.length > 0 && value.length > 0 && inputText !== value, errorMsg, id);
// }
//
// function minLength(len, errorMsg) {
//     return (inputText) => validate("minLength", inputText.length < len, errorMsg);
// }
//
// function isChecked(errorMsg) {
//     return (inputValue) => validate("isChecked", !inputValue.some(v => v.checked), errorMsg);
// }
//
// function isEmail(inputText) {
//     const mailFormat = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
//     return inputText.match(mailFormat);
// }
//
// export function isGreater(input, errorMsg) {
//     return (inputText) => validate("isGreater", +inputText < +input, errorMsg);
// }
//
// export function isLess(input, errorMsg) {
//     return (inputText) => validate("isGreater", +inputText > +input, errorMsg);
// }
//
// function checkFloat(dimension, unsigned, errorMsg) {
//     const pattern = dimension
//         ? `^${unsigned ? "" : "-?"}\\d*(\\.\\d{1,${dimension}})?$`
//         : `^${unsigned ? "" : "-?"}\\d+$`;
//
//     const floatRegexp = new RegExp(pattern, "g");
//     return (inputText) => validate("checkEquality", !String(inputText).match(floatRegexp), errorMsg);
// }
//
// function validateEmail(errorMsg) {
//     return (inputText) => validate("validateEmail", !isEmail(inputText), errorMsg);
// }
//
// function validatePhone(errorMsg) {
//     return (inputText) => validate("validatePhone", !isValidPhoneNumber(String(inputText)), errorMsg);
// }
//
// function validate(errorId, condition, errorMsg, id) {
//     return {errorId: errorId, msg: condition && errorMsg, componentId: id};
// }
//
// export {validate, isChecked, checkEquality, minLength, checkFloat, validateEmail, validatePhone, isEmail};