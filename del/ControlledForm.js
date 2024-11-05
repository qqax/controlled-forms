// import React, {Children, cloneElement, useState} from "react";
//
// const ControlledForm = (props) => {
//     const [errors, setErrors] = useState({});
//     const [submitted, setSubmitted] = useState(false);
//     const {
//         onSubmit,
//         legend,
//         disabled,
//         formStyle,
//         legendStyle,
//         buttonText,
//         buttonContainerStyle,
//         WaitButton,
//         AfterButtonComponent,
//         formErrors,
//         ErrorsComponent
//     } = props;
//
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         !submitted && setSubmitted(true);
//         !Object.keys(errors).length && onSubmit(e);
//     };
//
//     return (<form onSubmit={handleSubmit} className={formStyle}>
//         <fieldset>
//             <legend className={legendStyle}>{legend}</legend>
//             {Children.map(Children.toArray(props.children).filter(Boolean), (child) => cloneElement(child, {
//                 errors: errors,
//                 setErrors: setErrors,
//                 submitted: submitted
//             }))}
//             <WaitButton disabled={disabled || (submitted && !!Object.keys(errors).length)} buttonText={buttonText}
//                         buttonContainerStyle={buttonContainerStyle}/>
//             {AfterButtonComponent && <AfterButtonComponent/>}
//         </fieldset>
//         {formErrors && <ErrorsComponent errors={formErrors}/>}
//     </form>)
// };
//
// export default ControlledForm;