import React, {forwardRef} from "react";
import Controlled from "../src/Controlled";
import {CheckBox, Input, TextArea} from "./InputsOld";

export const ControlledInput = Controlled(Input);
export const ControlledTextArea = Controlled(TextArea);
export const ControlledEmail = forwardRef((props, ref) =>
    <ControlledInput {...props} name="email" inputMode="email" type="text" autoComplete={"email"} ref={ref}/>);

const ControlledCB = Controlled(CheckBox);
export const ControlledCheckBox = forwardRef((props, ref) => {
    return <ControlledCB {...props} type={"checkbox"} labelPosition={"right"} ref={ref}/>
});

