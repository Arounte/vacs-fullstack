import clsx from 'clsx';
import { Dropdown, type DropdownProps } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';
import { Skeleton } from 'primereact/skeleton';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';

type PropsT<T extends FieldValues> = Omit<DropdownProps, 'name'> & {
    label?: string;
    name: Path<T>;
    control: Control<T>;
    initializing?: boolean;
};

export function Select<T extends FieldValues>(props: PropsT<T>) {
    const { name, control, label, options, className, initializing = false, ...restProps } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { invalid, error } }) =>
                initializing ? (
                    <Skeleton width="full" height="2rem" />
                ) : (
                    <div className="flex flex-col">
                        <FloatLabel>
                            <Dropdown
                                {...field}
                                {...restProps}
                                className={clsx('w-full', className)}
                                id={`__${name}`}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                invalid={invalid}
                                options={options}
                                editable
                                showClear
                            />
                            {label && <label htmlFor={`__${name}`}>{label}</label>}
                        </FloatLabel>
                        {error && <small className="text-red-400">{error.message}</small>}
                    </div>
                )
            }
        />
    );
}
