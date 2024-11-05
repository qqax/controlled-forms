import React, {
    FC,
    ReactNode,
    Children,
    cloneElement,
    useState,
    ReactElement, FormEvent,
} from "react";

interface ControlledFormProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    disabled?: boolean;
    formStyle?: string;

    legend: string;
    legendStyle?: string;

    buttonText?: string;
    buttonContainerStyle?: string;
    WaitButton: FC<{ disabled: boolean; buttonText?: string; buttonContainerStyle?: string }>;

    formErrors?: any;
    ErrorsComponent: FC<{ errors: any }>;

    children: ReactNode;
}

const ControlledForm: FC<ControlledFormProps> = (props) => {
    const [errors, setErrors] = useState<Record<string, any>>({});
    const [submitted, setSubmitted] = useState<boolean>(false);
    const {
        onSubmit,
        children,
        legend,
        disabled,
        formStyle,
        legendStyle,
        buttonText,
        buttonContainerStyle,
        WaitButton,
        formErrors,
        ErrorsComponent
    } = props;

    const childrenArray = Children.toArray(children).filter(Boolean);
    const childrenWithProps = childrenArray
        .map(child => {
                return cloneElement(child as ReactElement, {
                    errors: errors,
                    setErrors: setErrors,
                    submitted: submitted
                })
            }
        )

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        !submitted && setSubmitted(true);
        !Object.keys(errors).length && onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit} className={formStyle}>
            <fieldset>
                <legend className={legendStyle}>{legend}</legend>
                {childrenWithProps}
                <WaitButton
                    disabled={disabled || (submitted && !!Object.keys(errors).length)}
                    buttonText={buttonText}
                    buttonContainerStyle={buttonContainerStyle}
                />
            </fieldset>
            {formErrors && <ErrorsComponent errors={formErrors}/>}
        </form>
    );
};

export default ControlledForm;