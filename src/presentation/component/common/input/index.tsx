import clsx from 'clsx';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText, type InputTextProps } from 'primereact/inputtext';
import { Skeleton } from 'primereact/skeleton';
import type { FC } from 'react';

export type PropsT = InputTextProps & {
    label?: string;
    error?: string;
    initializing?: boolean;
};

export const Input: FC<PropsT> = (props) => {
    const { name, label, error, className, initializing = false, ...restProps } = props;

    return initializing ? (
        <Skeleton width="full" height="2rem" />
    ) : (
        <div className="flex flex-col">
            <FloatLabel>
                <InputText
                    className={clsx('w-full', className)}
                    id={`__${name}`}
                    name={name}
                    {...restProps}
                />
                {label && (
                    <label className="text-md mb-2 font-medium" htmlFor={`__${name}`}>
                        {label}
                    </label>
                )}
            </FloatLabel>
            {error && <small className="text-red-400">{error}</small>}
        </div>
    );
};
