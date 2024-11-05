// import React, {forwardRef, useEffect, useState} from "react";
// import {removeEmptyObjects} from "cleaning-objects";
//
// const Controlled = InputComponent => forwardRef((props, ref) => {
//     return props.setValue ? <OuterControl {...props} InputComponent={InputComponent} ref={ref}/> :
//         <InnerControl {...props} InputComponent={InputComponent} ref={ref}/>
// });
//
// const InnerControl = forwardRef((props, ref) => {
//     const {value} = props;
//     const [inputValue, setInputValue] = useState(value ? value : "");
//     return <OuterControl {...props} value={inputValue} setValue={setInputValue} ref={ref}/>
// });
//
// const Label = ({id, label, lStyle, labelPosition, validate}) => {
//     return (<label htmlFor={id} className={lStyle}>
//                 <span
//                     className={labelPosition === "in-top" || labelPosition === "in-bottom" ? "relative -top-1.5" : ""}>
//                     {label}{validate && validate.required && '\u00A0*'}
//                 </span>
//     </label>);
// };
//
// const OuterControl = forwardRef((props, ref) => {
//     const {
//         id,
//         type,
//         label,
//         labelPosition,
//         value,
//         setValue,
//         onChange,
//         validate,
//         errors,
//         setErrors,
//         submitted,
//         InputComponent,
//         Component,
//         componentProps,
//         labelStyle,
//         inputStyle,
//         inputWrapperStyle,
//         containerStyle
//     } = props;
//
//     const onInputChange = (e) => {
//         type === "checkbox" ? setValue(e ? e.target?.checked : false) : setValue(e ? e.target?.value : "");
//         onChange && onChange(e);
//     };
//
//     useEffect(() => {
//         if (validate) {
//             if ((!value || value.length === 0)) {
//                 validate.required && setErrors(errors => ({...errors, [id]: {required: validate.required}}));
//             } else {
//                 const newErrors = {[id]: errors[id] ? errors[id] : {}};
//                 newErrors[id] && delete newErrors[id].required;
//                 validate.func && validate.func.forEach(func => {
//                     const {errorId, msg, componentId} = func(value);
//                     const cID = componentId ? componentId : id;
//                     if (componentId) {
//                         if (errors[componentId] && errors[componentId].required) {
//                             return;
//                         }
//                         newErrors[componentId] = errors[componentId] || {};
//                     }
//                     if (msg) {
//                         newErrors[cID][errorId] = msg;
//                     } else {
//                         newErrors[cID][errorId] && delete newErrors[cID][errorId];
//                     }
//                 });
//                 setErrors(errors => removeEmptyObjects({...errors, ...newErrors}));
//             }
//         }
//     }, [value]);
//
//     const cStyle = cx("relative flex", labelPosition === "top" || labelPosition === "bottom" ? "flex-col" : labelPosition === "left" || labelPosition === "right" ? "flex-row" : "");
//     const lStyle = cx(labelStyle, labelPosition === "in-top" ? "absolute h-[0.5px] left-4 text-[8px] bg-white px-1 z-10" : labelPosition === "in-bottom" ? "absolute h-[0.5px] bottom-0 left-4 text-[8px] bg-white px-1" : "");
//     const iStyle = cx(inputStyle && inputStyle(submitted && errors && !!errors[id]), type !== "checkbox" && cx(labelPosition === 'in-top' ? "pt-1.5 px-0.5 pb-0.5" : labelPosition === 'in-bottom' ? "pb-1.5 px-0.5 pt-0.5" : "p-0.5", "h-8"));
//     const iWrapperStyle = cx(inputWrapperStyle, "relative");
//     return (<div className={"flex flex-col w-full"}>
//         <div className={containerStyle}>
//             <div className={cStyle}>
//                 {label && !(labelPosition === "bottom" || labelPosition === "right") &&
//                     <Label id={id} label={label} validate={validate} lStyle={lStyle} labelPosition={labelPosition}/>}
//                 <div className={iWrapperStyle}>
//                     <InputComponent ref={ref} value={value} setValue={setValue} onChange={onInputChange}
//                                     iStyle={iStyle} {...props}/>
//                     {Component && <Component {...componentProps}/>}
//                 </div>
//                 {label && (labelPosition === "bottom" || labelPosition === "right") &&
//                     <Label id={id} label={label} validate={validate} lStyle={lStyle} labelPosition={labelPosition}/>}
//             </div>
//             <p className={`min-h-5 text-sm text-red-600 mt-auto`}>{submitted && errors[id] && Object.values(errors[id]).join(" ")}</p>
//         </div>
//     </div>)
// });
//
// export default Controlled;