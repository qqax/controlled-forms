import React, {forwardRef, FunctionComponent, useCallback, useEffect, useMemo, useState} from "react";
import Controlled from "./Controlled";
import {CheckBox, Input, InputSelect, Pass, Phone, TextArea} from "./Inputs";
import {observer} from "mobx-react-lite";
import user from "../../store/userStore";
import {useTranslation} from "react-i18next";
import {checkFloat, isChecked, isGreater, isLess} from "./Validation";
import {ClickButton, DoubleButton, MainClickButton, RedButton, TrashButton} from "../Buttons";
import usePlacesAutocomplete from "use-places-autocomplete";
import {cx} from "@emotion/css";
import LeafletMap from "../../components/Maps/LeafletMap";
import {cordsFromAddress, defaultGeoData} from "../../components/Maps/Geocode";
import {scheduleKeys} from "../../components/Orders/Delivery";
import {weekDays} from "../common/date";
import useText from "../common/text";

export const ControlledInput = Controlled(Input);
export const ControlledTextArea = Controlled(TextArea);
export const ControlledInputSelect = Controlled(InputSelect);
export const ControlledPass = Controlled(Pass);
export const ControlledPhone = Controlled(Phone);
export const ControlledEmail = forwardRef((props, ref) =>
    <ControlledInput {...props} name="email" inputMode="email" type="text" autoComplete={"email"} ref={ref}/>);

const ControlledCB = Controlled(CheckBox);
export const ControlledCheckBox = forwardRef((props, ref) => {
    return <ControlledCB {...props} type={"checkbox"} labelPosition={"right"} ref={ref}/>
});

export const ControlledPrice = observer(({currency, setCurrency, inputStyle, requiredMsg, errors, setErrors, submitted}) => {
    const currencies = JSON.parse(JSON.stringify(user.currencies));
    const currOptions = useMemo(() => currencies.map(c => {
        return {
            key: c.code,
            value: c.code
        }
    }), [currencies]);
    const {t} = useTranslation();
    return (
        <div className={"flex flex-row gap-2"}>
            <ControlledInput
                id={"price"}
                errors={errors} setErrors={setErrors} submitted={submitted}
                containerStyle={"mb-2"}
                label={t("label.price")}
                clearButton={true}
                labelPosition={"top"}
                inputStyle={inputStyle}
                type={"number"}
                step={"0.01"}
                autoComplete={"off"}
                validate={{
                    required: requiredMsg,
                    func: [checkFloat(2, true, t("input.float", {ns: "errors"}) + `: unsigned, 2 dimensional`)]
                }}
            />
            <ControlledInputSelect id={"currency"}
                                   errors={errors} setErrors={setErrors} submitted={submitted}
                                   label={t("label.currency")}
                                   labelPosition={"top"}
                                   inputStyle={inputStyle}
                                   containerStyle={"mb-2"}
                                   type={"text"}
                                   validate={{required: requiredMsg}}
                                   onChange={(e) => setCurrency(e.target.value)}
                                   value={currency}
                                   setValue={setCurrency}
                                   autoComplete={"off"}
                                   clearButton={true}
                                   selectItems={currOptions}/>
        </div>
    )
});

export const AddNewElem = ({preload, addNewText, componentProps, saveText, saveHandler, Component, ...props}) => {
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [data, setData] = useState(preload
        ? preload.map(data => {
            return {id: crypto.randomUUID(), data};
        })
        : [{id: crypto.randomUUID()}]
    );
    const addElem = useCallback(() => {
        setData([...data, {id: crypto.randomUUID()}]);
    }, [data]);

    const handleDataChange = useCallback(id => userData => {
        const newData = [...data];
        newData[newData.findIndex(d => d.id === id)] = {id: id, data: userData};
        setData(newData);
    }, [data]);

    const deleteItem = useCallback(id => () => {
        const newErrors = {...errors};
        delete newErrors[id];
        setErrors(newErrors);
        setData([...data].filter(d => d.id !== id));
    }, [data, errors]);

    const saveData = useCallback(() => {
        setSubmitted(true);
        if (!Object.values(errors).some(v => v)) {
            saveHandler(data.map(({data}) => data));
            setSubmitted(false);
        }
    }, [data, errors, saveHandler]);

    return (<>
        {data.map(({id, data}) =>
            <Component
                id={id}
                key={id}
                value={data}
                listSubmitted={submitted}
                listErrors={errors}
                setListErrors={setErrors}
                handleDataChange={handleDataChange(id)}
                deleteItem={deleteItem(id)}
                {...props}/>
        )}
        <MainClickButton onClick={addElem} twStyle={"min-h-8 px-4 mb-2"} text={addNewText}/>
        <ClickButton onClick={saveData} twStyle={"min-h-8 px-4"} text={saveText}/>
    </>)
};

export const TimePeriod = ({
                        id,
                        value,
                        deleteItem,
                        handleDataChange,
                        inputStyle,
                        requiredMsg,
                        listSubmitted,
                        setListErrors,
                        listErrors
                    }) => {
    const {t} = useTranslation(["auth"]);
    const greaterMsg = `"to" (${value?.to}) ` + t("input.should_be_greater_then", {ns: "errors"}) + ` "from" (${value?.from})`;

    useEffect(() => {
        setListErrors({
            ...listErrors, [id]: ((!(value?.from?.length > 0 && value?.to?.length > 0) && requiredMsg)
                || (value?.from >= value?.to && greaterMsg)) ?? ""
        });
    }, [value]);

    const error = listErrors[id];
    const iStyle = useMemo(() => cx(inputStyle(listSubmitted && !!error), "px-0.5 h-8"), [listSubmitted, error]);

    return (
        <div className={"ml-4 mb-2"}>
            <div className={"flex gap-2"}>
                <Input
                    id={id + "_time_from"}
                    iStyle={iStyle}
                    type={"time"}
                    autoComplete={"off"}
                    value={value?.from ?? ""}
                    onChange={e => handleDataChange({from: e.target.value, to: value?.to ?? ""})}
                />
                <Input
                    id={id + "_time_to"}
                    iStyle={iStyle}
                    type={"time"}
                    value={value?.to ?? ""}
                    onChange={e => handleDataChange({from: value?.from ?? "", to: e.target.value})}
                    autoComplete={"off"}
                />
                <TrashButton onClick={() => {
                    deleteItem(id);
                }}/>
            </div>
            <p className={`min-h-5 text-sm text-red-600 mt-auto`}>{listSubmitted && error}</p>
        </div>
    )
};

const createWeek = (schedule) => {
    return Object.keys(schedule)
        .filter(k => scheduleKeys.includes(k))
        .reduce((acc, key) => {
            Object.entries(schedule[key])
                .forEach(([days, time]) => {
                    splitScheduleDays(acc, key, days, time);
                });
            return acc;
        }, [...weekDays])
};

const splitScheduleDays = (acc, key, days, time) => {
    days
        .split("")
        .forEach(d => {
            acc[+d] = {...acc[+d], checked: true, [key]: time};
        });
};

export const ControlledSchedule = (props) => {
    const {id, week, setWeek, schedules, scheduleName} = props;
    const [scheduleEditingMode, setScheduleEditingMode] = useState(true);
    const [inclDaysOff, setInclDaysOff] = useState(false);
    const [deliveryDays, setDeliveryDays] = useState({});

    useEffect(() => {
        if (!!schedules && scheduleName && Object.keys(schedules).includes(scheduleName)) {
            setWeek(createWeek(schedules[scheduleName]));
            schedules[scheduleName].incl_days_off && setInclDaysOff(schedules[scheduleName].incl_days_off);
            schedules[scheduleName].delivery_days && setDeliveryDays(schedules[scheduleName].delivery_days);
        } else {
            setWeek(weekDays.map(d => {
                return {...d, checked: true}
            }));
        }
    }, [scheduleName, schedules]);

    const setWorkingDay = useCallback(e => {
        const dayID = e.target.id.charAt(0);
        setWeek(week.map(d => {
            if (d.id === dayID) {
                d.checked = !d.checked;
            }
            return d;
        }));
    }, [week]);
    const selectWorkingDays = useCallback((from, to) => {
        setWeek(week.map((d, i) => {
            d.checked = i >= from && i <= to;
            return d;
        }));
    }, [week]);
    const editAllDays = useCallback(() => {
        setWeek(week.map(d => {
            d.edit = d.checked;
            return d;
        }));
    }, [week]);
    const clearEdit = useCallback(() => {
        setWeek(week.map(d => {
            d.edit = false;
            return d;
        }));
    }, [week]);

    const handleEdit = useCallback(e => {
        const dayID = e.target.id.charAt(0);
        setWeek(week.map(d => {
            if (d.id === dayID) {
                d.edit = !d.edit;
            }
            return d;
        }));
    }, [week]);
    const forEdit = useMemo(() => {
        return week.reduce((acc, d) => {
            d.edit && acc.push(d.name);
            return acc;
        }, []).join(', ')
    }, [week]);

    const weekButtons = [
        <MainClickButton key={"all_week"} twStyle={"min-h-8"} id={"all_week"} onClick={() => selectWorkingDays(0, 6)}
                         text={"all week"}/>,
        <MainClickButton key={"working_days"} twStyle={"min-h-8"} id={"working_days"}
                         onClick={() => selectWorkingDays(0, 4)}
                         text={"working"}/>,
        <MainClickButton key={"weekend"} twStyle={"min-h-8"} id={"weekend"} onClick={() => selectWorkingDays(5, 6)}
                         text={"weekend"}/>
    ];

    const selectButtons = [
        <MainClickButton key={"all_days"} twStyle={"min-h-8 h-full"} id={"all_days"} onClick={editAllDays}
                         text={"edit all days"}/>
    ];

    const handleSaveSchedule = useCallback((data) => {
        setWeek(week.map(d => {
            if (d.edit) {
                d.schedule = data;
                d.edit = false;
            }
            return d;
        }));
    }, [setWeek, week]);

    const [dayADay, setDayADay] = useState("");

    useEffect(() => {
        !dayADay && setDayADay(week.find(d => d.edit)?.day_a_day ?? "");
    }, [dayADay, week]);

    const handleSaveDayADay = useCallback(() => {
        setWeek(week.map(d => {
            if (d.edit) {
                d.day_a_day = dayADay;
                d.edit = false;
            }
            return d;
        }));
        setDayADay("");
    }, [dayADay, week]);

    const {t} = useTranslation(["auth"]);
    const maxIsGreater = useMemo(() => {
        return isGreater(deliveryDays.min, t("input.greater", {ns: "errors"}))
    }, [deliveryDays.min]);
    const minIsLess = useMemo(() => {
        return isLess(deliveryDays.max, t("input.less", {ns: "errors"}))
    }, [deliveryDays.max]);

    return (
        <div className={"p-2 mb-2 border rounded-sm grid grid-cols-2 gap-4"}>
            <div>
                <ControlledDaysSelection
                    id={"week_days" + id}
                    value={week}
                    setValue={setWorkingDay}
                    setEdit={handleEdit}
                    clear={() => selectWorkingDays(-1, -1)}
                    clearEdit={clearEdit}
                    buttons={weekButtons}
                    selectButtons={selectButtons}
                    inputWrapperStyle={"w-full"}
                    validate={{required: props.requiredMsg, func: [isChecked("need to choose some days")]}}
                    {...props}
                />
                <h3>Delivery days</h3>
                <div className={"flex gap-2"}>
                    <ControlledInput
                        id={"delivery_days_min"}
                        value={deliveryDays?.min ?? ""}
                        setValue={v => setDeliveryDays({...deliveryDays, min: v})}
                        containerStyle={"mb-2"}
                        label={t("label.delivery_days_from")}
                        clearButton={true}
                        labelPosition={"top"}
                        type={"number"}
                        step={"1"}
                        autoComplete={"off"}
                        validate={{
                            func: [
                                checkFloat(0, true, t("input.float", {ns: "errors"}) + `: unsigned integer`),
                                minIsLess
                            ]
                        }}
                        {...props}
                    />
                    <ControlledInput
                        id={"delivery_days_max"}
                        containerStyle={"mb-2"}
                        value={deliveryDays?.max ?? ""}
                        setValue={v => setDeliveryDays({...deliveryDays, max: v})}
                        label={t("label.delivery_days_to")}
                        clearButton={true}
                        labelPosition={"top"}
                        type={"number"}
                        step={"1"}
                        autoComplete={"off"}
                        validate={{
                            func: [
                                checkFloat(0, true, t("input.float", {ns: "errors"}) + `: unsigned integer`),
                                maxIsGreater
                            ],
                        }}
                        {...props}
                    />
                </div>
                <ControlledCheckBox
                    id="incl_days_off"
                    value={inclDaysOff}
                    setValue={setInclDaysOff}
                    label={"include days off"}
                    containerStyle={"mb-2"}
                    labelStyle={"ml-2"}
                    {...props}/>
            </div>
            {!!forEdit
                ? <div className={"flex flex-col"}>
                    <DoubleButton value={scheduleEditingMode} onClick={setScheduleEditingMode} textLeft={"Schedule"}
                                  textRight={"Day a day delivery"} id={"schedule-editing-mode"}/>
                    {scheduleEditingMode
                        ? <AddNewElem
                            addNewText={"Add time period"}
                            saveText={"Save for " + forEdit}
                            saveHandler={handleSaveSchedule}
                            preload={week.find(d => d.edit).schedule}
                            Component={TimePeriod}
                            {...props}/>
                        : <div className={"flex flex-col gap-2"}>
                            <label htmlFor={id + "day_a_day"}>Delivery day a day till:</label>
                            <Input
                                id={id + "day_a_day"}
                                iStyle={cx("pl-0.5 min-h-[2rem]", props.inputStyle())}
                                type={"time"}
                                autoComplete={"off"}
                                value={dayADay}
                                clearButton={true}
                                setValue={setDayADay}
                                onChange={e => setDayADay(e.target.value)}
                            />
                            <ClickButton onClick={handleSaveDayADay} twStyle={"min-h-8 px-4"}
                                         text={"Save for " + forEdit}/>
                        </div>}
                </div>
                : <div className={"italic text-gray-500 my-auto text-center"}>Please select some days</div>}
        </div>
    )
};

const DaysSelection = ({value, setValue, setEdit, clear, clearEdit, buttons, selectButtons}) => {
    return (
        <>
            <div className={"grid grid-cols-2 gap-1 mb-2 w-full"}>
                <div className={"text-center my-auto"}>Working days *</div>
                <div className={"text-center my-auto"}>Click to edit</div>
                {value.map(day =>
                    <div key={day.id} className={"grid grid-cols-2 gap-1 mb-2 w-full col-span-2"}>
                        <div className="flex overflow-hidden float-left">
                            <input id={day.id + "_day"} checked={!!day.checked} onChange={setValue}
                                   className={"peer hidden"}
                                   type="checkbox"/>
                            <label htmlFor={day.id + "_day"}
                                   className={" flex w-full min-h-[2rem] items-center pl-2 border rounded-sm select-none cursor-pointer italic hover:bg-green-200 text-gray-500 transition-colors duration-500 ease-in-out peer-checked:hover:bg-green-600 peer-checked:bg-green-700 peer-checked:text-white peer-checked:border-gray-200"}>
                                {day.name}
                            </label>
                        </div>
                        {day.checked ?
                            <div>
                                <input id={day.id + "_edit"} checked={!!day.edit} onChange={setEdit}
                                       className={"peer hidden"}
                                       type="checkbox"/>
                                <label htmlFor={day.id + "_edit"}
                                       className={"border flex w-full min-h-[2rem] pl-2 items-center rounded-sm select-none cursor-pointer italic bg-orange-100 hover:bg-orange-200 text-gray-500 transition-colors duration-500 ease-in-out peer-checked:hover:bg-orange-500 peer-checked:bg-orange-400 peer-checked:text-white peer-checked:border-gray-200"}>
                                    <div className={"flex flex-col gap-2"}>
                                        {day.schedule?.length
                                            ? <div>{day.schedule.map(
                                                (d, i) => <div
                                                    key={String(i) + d.name + "schedule"}>{d.from} - {d.to}</div>)}
                                            </div>
                                            : <span>working</span>}
                                        {day.day_a_day && <span>day a day till {day.day_a_day}</span>}
                                    </div>

                                </label>
                            </div>
                            : <div className={"my-auto text-gray-500 italic text-center"}>day off</div>}
                    </div>
                )}
                <div className={"flex flex-col gap-1"}>
                    {buttons &&
                        buttons.map(button => button)
                    }
                    <RedButton text={"deselect"} onClick={clear} twStyle={"w-full h-8 rounded-sm p-4"}/>
                </div>
                <div className={"flex flex-col gap-1"}>
                    {buttons &&
                        selectButtons.map(button => button)
                    }
                    <RedButton text={"deselect"} onClick={clearEdit} twStyle={"w-full h-8 rounded-sm p-4"}/>
                </div>
            </div>
        </>
    )
};
export const ControlledDaysSelection = Controlled(DaysSelection);

export const ControlledAddress: FunctionComponent = observer(function ControlledAddress({
                                                                                     inputStyle,
                                                                                     textAreaInputStyle,
                                                                                     containerStyle,
                                                                                     submitted,
                                                                                     errors,
                                                                                     setErrors,
                                                                                     address,
                                                                                     setAddress
                                                                                 }) {
    const {
        ready,
        value,
        suggestions: {data},
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete();

    const [showMap, setShowMap] = useState(false);
    const [geoData, setGeoData] = useState(defaultGeoData);

    const [selectedGeoData, setSelectedGeoData] = useState(0);
    const lang = user.language;

    const handleGeoData = useCallback((data) => {
        setGeoData(data);
        setSelectedGeoData(0);
    }, []);

    useEffect(() => {
        address && !!Object.keys(address).length && handleGeoData([address]);
    }, [address]);

    useEffect(() => {
        if (geoData.length) {
            if (value !== geoData[selectedGeoData].display_name) {
                setValue(geoData[selectedGeoData].display_name, false);
            }
            geoData.length > 1 && setShowMap(true);
        }
        setAddress(geoData[selectedGeoData]);
    }, [geoData, selectedGeoData]);

    const onSelect = useCallback((value) => {
        cordsFromAddress({searchString: value, setGeoData: handleGeoData, lang});
        clearSuggestions();
    }, [showMap, value]);

    const onButtonClick = useCallback(() => {
        setShowMap(!showMap);
    }, [showMap]);

    const {requiredMsg} = useText();

    const {t} = useTranslation(["auth"]);
    return (<>
            <ControlledInputSelect
                id={"address"}
                label={t("label.address")}
                labelPosition={"top"}
                inputWrapperStyle={"flex z-10 flex-col lg:flex-row items-center gap-2"}
                inputStyle={inputStyle}
                containerStyle={"mb-2"}
                type={"text"}
                validate={{required: requiredMsg}}
                value={value}
                setValue={setValue}
                onSelect={onSelect}
                autoComplete={"off"}
                clearButton={true}
                freeSolo={true}
                disabled={!ready}
                submitted={submitted}
                preventFilter={true}
                errors={errors}
                setErrors={setErrors}
                selectItems={data.map(place => ({key: place.place_id, value: place.description}))}
                Component={ClickButton}
                componentProps={{
                    onClick: onButtonClick,
                    text: showMap ? t("label.hide_map") : t("label.show_map"),
                    twStyle: "w-48 mr-auto"
                }}
            />
            {geoData.length > 1 && <div>
                Please select area!
                <div className={"flex gap-1"}>
                    {geoData.map((_, i) =>
                        <button key={`polygon-button-${i}`} type="button"
                                className={cx(selectedGeoData === i ? "text-white bg-green-700" : "text-black bg-green-100", "p-2")}
                                onClick={() => {
                                    setValue(geoData[i].display_name, false);
                                    setSelectedGeoData(i);
                                }}>{i + 1}</button>)}
                </div>
            </div>}
            {showMap && <LeafletMap
                lang={lang}
                polygons={geoData[selectedGeoData].geojson && [geoData[selectedGeoData].geojson]}
                center={geoData[selectedGeoData]}
                selectedGeoData={selectedGeoData}
                setGeoData={handleGeoData}
                address={value}
                twStyle={showMap ? "z-0 w-full h-96 mt-3" : "hidden mt-2"}/>}
            <ControlledTextArea
                id="additional"
                errors={errors}
                setErrors={setErrors}
                submitted={submitted}
                value={address?.additional}
                label={t("label.additional")}
                labelPosition={"top"}
                inputStyle={textAreaInputStyle}
                containerStyle={containerStyle}
            />
        </>
    );
});
