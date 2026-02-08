import { Skeleton } from 'primereact/skeleton';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
import { Select as BaseSelect, type SelectPropsT } from '../../common/select';

type PropsT<T extends FieldValues> = Omit<SelectPropsT, 'name'> & {
    name: Path<T>;
    control: Control<T>;
    initializing?: boolean;
};

export function Select<T extends FieldValues>(props: PropsT<T>) {
    const { name, control, initializing = false, ...restProps } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { invalid, error } }) =>
                initializing ? (
                    <Skeleton width="full" height="2rem" />
                ) : (
                    <div className="flex flex-col">
                        <BaseSelect
                            {...field}
                            {...restProps}
                            name={name}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            invalid={invalid}
                        />
                        {error && <small className="text-red-400">{error.message}</small>}
                    </div>
                )
            }
        />
    );
}
