import React, {forwardRef, Ref} from 'react';
import Controlled, {ControlledProps} from "../src/Controlled";

interface InputProps extends ControlledProps {
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onCopy?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
    onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
    onCut?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input = Controlled(forwardRef<HTMLInputElement, InputProps>((props, ref: Ref<HTMLInputElement>) => {
    return (
        <div className="relative">
            <input
                ref={ref}
                type={props.type}
                step={props.step}
                inputMode={props.inputMode}
                id={props.id}
                name={props.name}
                autoComplete={props.autoComplete || "off"}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                onBlur={props.onBlur}
                onCopy={props.onCopy}
                onPaste={props.onPaste}
                onCut={props.onCut}
                onFocus={props.onFocus}
                onKeyDown={props.onKeyDown}
                disabled={props.disabled}
                className={props.inputClassName}
            />
        </div>
    );
}));

const TextArea = Controlled(forwardRef<HTMLTextAreaElement, InputProps>((props, ref: Ref<HTMLTextAreaElement>) => {
    return (
        <textarea ref={ref}
                  id={props.id}
                  name={props.name}
                  autoComplete={props.autoComplete}
                  placeholder={props.placeholder}
                  value={props.value}
                  onChange={props.onChange}
                  onBlur={props.onBlur}
                  onCopy={props.onCopy}
                  onPaste={props.onPaste}
                  onCut={props.onCut}
                  onKeyDown={props.onKeyDown}
                  disabled={props.disabled}
                  className={props.inputClassName}
        />
    );
}));

const EmailInput = forwardRef((props, ref) =>
    <Input {...props} name="email" inputMode="email" type="text" autoComplete={"email"} ref={ref}/>);

const CheckBox = forwardRef((props, ref) =>
    <Input {...props} type="checkbox" ref={ref}/>);

const Password = forwardRef((props, ref) =>
    <Input {...props} type="password" ref={ref}/>);

export {Input, TextArea, EmailInput, CheckBox, Password};

