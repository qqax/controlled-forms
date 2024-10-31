import React, {forwardRef, useCallback, useEffect, useRef, useState} from "react";
import {SmallCloseButton} from "../Buttons";
import PasswordStrengthBar from "react-password-strength-bar";
import PhoneInput from "react-phone-number-input";
import {cx} from "@emotion/css";
import withClickOutside from "../withClickOutside";
import {removeEmptyObjects} from "../common/objects";

const Input = forwardRef(({
                              id,
                              name,
                              type,
                              step,
                              inputMode,
                              autoComplete,
                              placeholder,
                              value,
                              setValue,
                              onChange,
                              onBlur,
                              onCopy,
                              onPaste,
                              onCut,
                              onFocus,
                              onKeyDown,
                              disabled,
                              clearButton,
                              iStyle
                          }, ref) => {
    return (<div className="relative">
        <input ref={ref}
               id={id}
               name={name}
               type={type}
               step={step}
               inputMode={inputMode}
               autoComplete={autoComplete || "off"}
               placeholder={placeholder}
               value={value}

               onChange={onChange}
               onBlur={onBlur}
               onCopy={onCopy}
               onPaste={onPaste}
               onCut={onCut}
               onFocus={onFocus}
               onKeyDown={onKeyDown}

               disabled={disabled}
               className={cx("w-full", iStyle)}
        />
        {clearButton && <SmallCloseButton onClick={() => {
            setValue("");
        }} twStyle={cx(type === "time" ? "right-6" : "right-0", "absolute top-1/2 transform -translate-y-1/2")}/>}
    </div>)
});

const CheckBox = forwardRef(({id, name, type, value, onChange, onBlur, disabled, iStyle}, ref) => {
    return (<input
        ref={ref}
        id={id}
        name={name}
        type={type}
        value={value}

        onChange={onChange}
        onBlur={onBlur}

        disabled={disabled}
        className={iStyle}/>)
});

const TextArea = forwardRef(({
                                 id,
                                 name,
                                 type,
                                 autoComplete,
                                 placeholder,
                                 value,
                                 setValue,
                                 onChange,
                                 onBlur,
                                 onCopy,
                                 onPaste,
                                 onCut,
                                 onKeyDown,
                                 disabled,
                                 iStyle
                             }, ref) => {
    return (
        <textarea ref={ref}
                  id={id}
                  name={name}
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  value={value}

                  onChange={onChange}
                  onBlur={onBlur}
                  onCopy={onCopy}
                  onPaste={onPaste}
                  onCut={onCut}
                  onKeyDown={onKeyDown}

                  disabled={disabled}
                  className={cx("w-full", iStyle)}
        />);
});

const SelectButton = ({id, value, onClick, onKeyDown, focused}) => {
    const ref = useRef();
    useEffect(() => {
        focused === id && ref.current?.focus();
    }, [focused, id]);

    return (<button ref={ref} id={id} type={"button"} value={value} onClick={onClick} onKeyDown={onKeyDown}
                    className="p-1 hover:bg-gray-100 focus:bg-gray-300 outline-none text-start">
        {value}</button>)
};

const InputSelect = withClickOutside((props) => {
    const {
        selectItems,
        freeSolo,
        innerRef,
        open,
        setOpen,
        preventFilter,
        dropListStyle,
        onKeyDown,
        value,
        setValue,
        onSelect
    } = props;
    const [focused, setFocused] = useState(null);
    const ref = useRef();

    useEffect(() => {
        if (!freeSolo && !open && !selectItems.map(({value}) => value).includes(value)) {
            setValue("");
        }
    }, [open]);

    const selectItem = useCallback((e) => {
        if (freeSolo || selectItems.map(({value}) => value).includes(e.target.value)) {
            setValue(e.target?.value || "");
            setOpen(false);
            setFocused(null);
            onSelect && onSelect(e.target?.value);
        }
    }, [freeSolo, onSelect, selectItems, setOpen, setValue]);

    const focusOnInput = useCallback(() => {
        ref.current?.focus();
        setFocused(null);
    }, []);

    const onInputKeyDown = useCallback((e) => {
        if (open) {
            switch (e.keyCode) {
                case 13: {
                    e.preventDefault();
                    selectItem(e);
                    break;
                }
                case 27: {
                    ref.current?.blur();
                    selectItems.map(({value}) => value).includes(e.target?.value)
                        ? setValue(e.target?.value || "")
                        : setValue("");
                    setOpen(false);
                    break;
                }
                case 38: {
                    setFocused(selectItems.length - 1);
                    break;
                }
                case 40: {
                    setFocused(0);
                    break;
                }
                default:
                    setFocused(null);
            }
        }

        onKeyDown && onKeyDown(e);
    }, [onKeyDown, open, selectItem, selectItems.length, setOpen]);

    const onButtonKeyDown = useCallback((e) => {
        switch (e.keyCode) {
            case 13: {
                e.preventDefault();
                selectItem(e);
                break;
            }
            case 27: {
                focusOnInput();
                break;
            }
            case 38: {
                const newIndex = (+e.target.id - 1);
                if (newIndex < 0) {
                    focusOnInput();
                } else {
                    setFocused((+e.target.id - 1 + selectItems.length) % selectItems.length);
                }
                break;
            }
            case 40:
                if (+e.target.id + 1 === selectItems.length) {
                    focusOnInput();
                } else {
                    setFocused((+e.target.id + 1) % selectItems.length);
                }
                break;
            default:
                setFocused(null);
        }
    }, [focusOnInput, selectItem, selectItems.length]);
    return (<div ref={innerRef} className="relative w-full">
        {!freeSolo && preventFilter
            ? <button type="button" className={cx(props.inputStyle(), "text-start px-1 h-8")}
                      onClick={() => setOpen(true)}>{value}</button>
            : <Input ref={ref}
                     onFocus={() => setOpen(true)}
                     onKeyDown={onInputKeyDown} {...props}/>
        }

        {open &&
            <div
                className={cx(dropListStyle, "absolute z-10 flex flex-col top-full mt-0.5 bg-white shadow-gray-500 shadow-sm w-full")}>
                {selectItems.filter((item) => {
                    return !value || preventFilter || item.value.includes(value)
                }).map(({key, value}, index) => (
                    <SelectButton key={key} value={value}
                                  onClick={selectItem}
                                  onKeyDown={onButtonKeyDown}
                                  focused={focused} id={index}/>))}
            </div>}
    </div>);
});

const Phone = forwardRef((props, ref) => {
    const {id, placeholder, value, setValue, countryCode} = props;
    // Is possible: {value && isPossiblePhoneNumber(value) ? 'true' : 'false'}
    // Is valid: {value && isValidPhoneNumber(value) ? 'true' : 'false'}
    // National: {value && formatPhoneNumber(value)}
    // International: {value && formatPhoneNumberIntl(value)}
    return (<PhoneInput
        id={id}
        ref={ref}
        placeholder={placeholder}
        international
        defaultCountry={countryCode}
        className="w-full"
        inputComponent={Input}
        value={value}
        onChange={setValue}
        numberInputProps={{
            ...props, type: "tel", inputMode: "tel", autoComplete: "tel",
        }}
    />);
});

const Eye = ({toggleEye, openEye, disabled}) => {
    return (<span aria-label="toggle password visibility"
                  className={cx(openEye ? "icon-eye-show" : "icon-eye-hide", 'cursor-pointer text-2xl align-center px-1 select-none', disabled && 'cursor-default')}
                  onClick={!disabled ? toggleEye : undefined}
                  onMouseDown={e => e.preventDefault()}
                  onMouseUp={e => e.preventDefault()}
    />)
};

const Pass = ({
                  id,
                  name,
                  autoComplete,
                  placeholder,
                  value,
                  setValue,
                  onChange,
                  onBlur,
                  disabled,
                  clearButton,
                  checkStrength,
                  submitted,
                  setErrors,
                  errors,
                  iStyle
              }) => {
    const [openEye, setOpenEye] = useState(false);
    const toggleEye = useCallback(() => {
        setOpenEye(!openEye)
    }, [openEye]);
    const [passWarn, setPassWarn] = useState("");
    useEffect(() => {
        if (submitted) {
            if (passWarn) {
                setErrors(errors => ({...errors, [id]: {passWarn: passWarn}}));
            } else if (!passWarn && errors[id] && errors[id]["passWarn"]) {
                const newErrors = errors[id];
                delete newErrors.passWarn;
                setErrors(errors => removeEmptyObjects({...errors, ...newErrors}));
            }
        }
    }, [submitted, passWarn]);

    return (<>
        <div className="relative">
            <input id={id}
                   name={name}
                   type={openEye ? 'text' : 'password'}
                   autoComplete={autoComplete ? autoComplete : "off"}
                   placeholder={placeholder}
                   value={value}

                   onChange={onChange}
                   onBlur={onBlur}
                   onCopy={e => e.preventDefault()}
                   onPaste={e => e.preventDefault()}
                   onCut={e => e.preventDefault()}

                   disabled={disabled}
                   className={iStyle}
            />
            <span className="absolute flex flex-row right-0 top-1/2 transform -translate-y-1/2">
                {clearButton && <SmallCloseButton onClick={() => {
                    setValue("")
                }}/>}
                <Eye toggleEye={toggleEye} openEye={openEye} disabled={disabled}/>
        </span>
        </div>
        {checkStrength && <PasswordStrengthBar scoreWords="" shortScoreWord="" password={value}
                                               onChangeScore={(score, feedback) => {
                                                   if (feedback.warning) {
                                                       setPassWarn(translatePassWarn([feedback.warning, ...feedback.suggestions])
                                                           .map(tr => t(tr)).join(" "));
                                                       return;
                                                   }
                                                   if (score < 4 && value && value.length > 0) {

                                                       setPassWarn(t("password_warn.too_simple"));
                                                       return;
                                                   }
                                                   setPassWarn("");
                                               }}
        />}
    </>)
};

const translatePassWarn = (stringArray) => {
    return stringArray.map(str => {
        switch (str) {
            case "This is a top-10 common password":
                return "password_warn.common10";
            case "This is a top-100 common password":
                return "password_warn.common100";
            case "Straight rows of keys are easy to guess":
                return "password_warn.straight_rows";
            case "Short keyboard patterns are easy to guess":
                return "password_warn.short_pattern";
            case "Repeats like \"aaa\" are easy to guess":
                return "password_warn.repeats_aaa";
            case "Repeats like \"abcabcabc\" are only slightly harder to guess than \"abc\"":
                return "password_warn.repeats_abcabc";
            case "Sequences like abc or 6543 are easy to guess":
                return "password_warn.sequences";
            case "Recent years are easy to guess":
                return "password_warn.recent_years";
            case "Dates are often easy to guess":
                return "password_warn.dates";
            case "Use a few words, avoid common phrases":
                return "password_suggestion.common_;phrases";
            case "No need for symbols, digits, or uppercase letters":
                return "password_suggestion.no_need";
            case "Add another word or two. Uncommon words are better.":
                return "password_suggestion.add_word";
            case "Use a longer keyboard pattern with more turns":
                return "password_suggestion.longer_pat;tern";
            case "Avoid repeated words and characters":
                return "password_suggestion.repeated";
            case "Avoid sequences":
                return "password_suggestion.sequences";
            case "Avoid recent years":
                return "password_suggestion.recent_years";
            case "Avoid years that are associated with you":
                return "password_suggestion.years";
            case "Avoid dates and years that are associated with you":
                return "password_suggestion.dates";
            case "Capitalization doesn't help very much":
                return "password_suggestion.capitalization";
            case "All-uppercase is almost as easy to guess as all-lowercase":
                return "password_suggestion.all_case";
            case "Reversed words aren't much harder to guess":
                return "password_suggestion.reversed";
            case "Predictable substitutions like '@' instead of 'a' don't help very much":
                return "password_suggestion.substitution";
            default:
                return str;
        }
    });
};

export {Input, InputSelect, Pass, Phone, TextArea, CheckBox};