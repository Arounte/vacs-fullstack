import clsx from 'clsx';
import { Calendar as BaseCalendar, type CalendarProps } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import { Skeleton } from 'primereact/skeleton';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';

type PropsT<T extends FieldValues> = Omit<CalendarProps, 'name'> & {
    label?: string;
    name: Path<T>;
    control: Control<T>;
    initializing?: boolean;
};

export function Calendar<T extends FieldValues>(props: PropsT<T>) {
    const { name, control, label, className, initializing = false, ...restProps } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { invalid } }) =>
                initializing ? (
                    <Skeleton width="full" height="2rem" />
                ) : (
                    <div className="flex flex-col">
                        <FloatLabel>
                            <BaseCalendar
                                {...field}
                                {...restProps}
                                className={clsx('w-full', className)}
                                id={`__${name}`}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                invalid={invalid}
                                showTime
                                hourFormat="24"
                                locale="ru"
                            />
                            {label && <label htmlFor={`__${name}`}>{label}</label>}
                        </FloatLabel>
                    </div>
                )
            }
        />
    );
}
