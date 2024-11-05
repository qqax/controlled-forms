import React, {forwardRef} from "react";

// const Input = forwardRef(({
//                               id,
//                               name,
//                               type,
//                               step,
//                               inputMode,
//                               autoComplete,
//                               placeholder,
//                               value,
//                               setValue,
//                               onChange,
//                               onBlur,
//                               onCopy,
//                               onPaste,
//                               onCut,
//                               onFocus,
//                               onKeyDown,
//                               disabled,
//                               clearButton,
//                               inputClassName
//                           }, ref) => {
//     return (<div className="relative">
//         <input ref={ref}
//                id={id}
//                name={name}
//                type={type}
//                step={step}
//                inputMode={inputMode}
//                autoComplete={autoComplete || "off"}
//                placeholder={placeholder}
//                value={value}
//
//                onChange={onChange}
//                onBlur={onBlur}
//                onCopy={onCopy}
//                onPaste={onPaste}
//                onCut={onCut}
//                onFocus={onFocus}
//                onKeyDown={onKeyDown}
//
//                disabled={disabled}
//                className={inputClassName}
//         />
//     </div>)
// });

// const CheckBox = forwardRef(({id, name, type, value, onChange, onBlur, disabled, iStyle}, ref) => {
//     return (<input
//         ref={ref}
//         id={id}
//         name={name}
//         type={type}
//         value={value}
//
//         onChange={onChange}
//         onBlur={onBlur}
//
//         disabled={disabled}
//         className={iStyle}/>)
// });
//
// const TextArea = forwardRef(({
//                                  id,
//                                  name,
//                                  type,
//                                  autoComplete,
//                                  placeholder,
//                                  value,
//                                  setValue,
//                                  onChange,
//                                  onBlur,
//                                  onCopy,
//                                  onPaste,
//                                  onCut,
//                                  onKeyDown,
//                                  disabled,
//                                  iStyle
//                              }, ref) => {
//     return (
//         <textarea ref={ref}
//                   id={id}
//                   name={name}
//                   autoComplete={autoComplete}
//                   placeholder={placeholder}
//                   value={value}
//
//                   onChange={onChange}
//                   onBlur={onBlur}
//                   onCopy={onCopy}
//                   onPaste={onPaste}
//                   onCut={onCut}
//                   onKeyDown={onKeyDown}
//
//                   disabled={disabled}
//                   className={cx("w-full", iStyle)}
//         />);
// });

export {Input, TextArea, CheckBox};