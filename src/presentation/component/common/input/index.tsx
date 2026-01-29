import { InputText, type InputTextProps } from "primereact/inputtext";
import type { FC } from "react";

export type PropsT = InputTextProps & {
    label?: string;
    error?: string;
};

export const Input: FC<PropsT> = (props) => {
    const { name, label, error, ...restProps } = props;

    return (
        <div className="flex flex-col">
            {label && <label className="text-md mb-2 font-medium" htmlFor={`__${name}`}>{label}</label>}
            <InputText id={`__${name}`} name={name} {...restProps} />
            {error && <small className="text-red-400">{error}</small>}
        </div>
    );
};
