import React, { FC, ReactNode, Children, cloneElement, useState } from "react";

interface ControlledFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    legend: string;
    disabled?: boolean;
    formStyle?: string;
    legendStyle?: string;
    buttonText?: string;
    buttonContainerStyle?: string;
    WaitButton: React.FC<{ disabled: boolean; buttonText?: string; buttonContainerStyle?: string }>;
    AfterButtonComponent?: React.FC;
    formErrors?: any;
    ErrorsComponent: React.FC<{ errors: any }>;
    children: ReactNode;
}

const ControlledForm: FC<ControlledFormProps> = (props) => {
    const [errors, setErrors] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState<boolean>(false);
    const {
        onSubmit,
        legend,
        disabled,
        formStyle,
        legendStyle,
        buttonText,
        buttonContainerStyle,
        WaitButton,
        AfterButtonComponent,
        formErrors,
        ErrorsComponent
    } = props;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        !submitted && setSubmitted(true);
        !Object.keys(errors).length && onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit} className={formStyle}>
            <fieldset>
                <legend className={legendStyle}>{legend}</legend>
                {Children.map(Children.toArray(props.children).filter(Boolean), (child) =>
                    cloneElement(child, {
                        errors: errors,
                        setErrors: setErrors,
                        submitted: submitted
                    })
                )}
                <WaitButton
                    disabled={disabled || (submitted && !!Object.keys(errors).length)}
                    buttonText={buttonText}
                    buttonContainerStyle={buttonContainerStyle}
                />
                {AfterButtonComponent && <AfterButtonComponent />}
            </fieldset>
            {formErrors && <ErrorsComponent errors={formErrors} />}
        </form>
    );
};

export default ControlledForm;