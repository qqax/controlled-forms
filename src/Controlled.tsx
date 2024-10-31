import React, {forwardRef, Ref, useEffect, useState} from "react";
import {removeEmptyObjects} from "cleaning-objects";

interface ControlledProps extends HTMLInputElement {
    setValue?: (value: string | boolean) => void;
    [key: string]: any;
}


const Controlled = (InputComponent: React.FC<any>) => forwardRef((props: ControlledProps, ref: Ref<any>) => {
    return props.setValue ? <OuterControl {...props} InputComponent={InputComponent} ref={ref}/> :
        <InnerControl {...props} InputComponent={InputComponent} ref={ref}/>;
});

interface InnerControlProps extends HTMLInputElement {
    [key: string]: any;
}

interface ErrorControl {
    errorId: string;
    msg?: string;
    componentId?: string
}

const InnerControl = forwardRef((props: InnerControlProps, ref: Ref<any>) => {
    const {value} = props;
    const [inputValue, setInputValue] = useState<string>(value ? value : "");
    return <OuterControl {...props} value={inputValue} setValue={setInputValue} ref={ref}/>;
});

interface LabelProps {
    id: string;
    label: string;
    labelClassName?: string;
    labelPosition: string;
    validate?: { required?: boolean };
}

const Label = ({id, label, labelClassName, labelPosition, validate}: LabelProps) => {
    return (<label htmlFor={id} className={labelClassName}>
                <span
                    className={labelPosition === "in-top" || labelPosition === "in-bottom" ? "relative -top-1.5" : ""}>
                    {label}{validate && validate.required && '\u00A0*'}
                </span>
    </label>);
};


interface OuterControlProps extends HTMLInputElement {
    id: string;
    // type: string;
    label?: string;
    labelPosition: string;
    // value: string | boolean;
    submitted: boolean;
    setValue: (value: string | boolean) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

    validate?: {
        required?: boolean;
        func?: Array<(value: string | boolean) => ErrorControl>
    };
    errors: { [key: string]: any };
    setErrors: (errors: any) => void;

    InputComponent: React.FC<any>;

    AfterInputComponent?: React.FC<any>;
    afterInputComponentProps?: Record<string, any>;

    labelClassName?: string;
    inputClassName?: string | ((hasError: boolean) => string);
    inputWrapperClassName?: string;
    labelInputWrapperClassName?: string;
    containerClassName?: string;
    errorClassName?: string;
}

const OuterControl = forwardRef((props: OuterControlProps, ref: Ref<any>) => {
    const {
        id,
        type,

        label,
        labelPosition,

        value,
        setValue,
        onChange,

        validate,
        errors,
        setErrors,

        submitted,

        InputComponent,

        AfterInputComponent,
        afterInputComponentProps,

        labelClassName,
        inputClassName,
        inputWrapperClassName,
        labelInputWrapperClassName,
        containerClassName,
        errorClassName,
    } = props;

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        type === "checkbox" ? setValue(e ? e.target?.checked : false) : setValue(e ? e.target?.value : "");
        onChange && onChange(e);
    };

    useEffect(() => {
        if (validate) {
            if ((typeof value === 'string' && (!value || value.length === 0))) {
                validate.required && setErrors((errors: ErrorControl[]) => ({...errors, [id]: {required: validate.required}}));
            } else {
                const newErrors: { [key: string]: any } = {[id]: errors[id] ? errors[id] : {}};
                newErrors[id] && delete newErrors[id].required;
                validate.func && validate.func.forEach(func => {
                    const {errorId, msg, componentId} = func(value);
                    const cID = componentId ? componentId : id;
                    if (componentId) {
                        if (errors[componentId] && errors[componentId].required) {
                            return;
                        }
                        newErrors[componentId] = errors[componentId] || {};
                    }
                    if (msg) {
                        newErrors[cID][errorId] = msg;
                    } else {
                        newErrors[cID][errorId] && delete newErrors[cID][errorId];
                    }
                });
                setErrors((errors: ErrorControl[]) => removeEmptyObjects({...errors, ...newErrors}));
            }
        }
    }, [value]);

    return (<div className={containerClassName}>
        <div className={labelInputWrapperClassName}>
            {label && <Label id={id} label={label} validate={validate} labelClassName={labelClassName}
                             labelPosition={labelPosition}/>}
            <div className={inputWrapperClassName}>
                <InputComponent ref={ref} value={value} setValue={setValue} onChange={onInputChange}
                                inputClassName={inputClassName} {...props}/>
                {AfterInputComponent && <AfterInputComponent {...afterInputComponentProps}/>}
            </div>
        </div>
        <p className={errorClassName ? errorClassName : `error_message`}>{submitted && errors[id] && Object.values(errors[id]).join(" ")}</p>
    </div>);
});

export default Controlled;