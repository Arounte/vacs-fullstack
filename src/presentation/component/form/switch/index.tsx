import { InputSwitch, type InputSwitchProps } from 'primereact/inputswitch';
import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';

type PropsT<T extends FieldValues> = Omit<InputSwitchProps, 'name' | 'checked'> & {
    label?: string;
    name: Path<T>;
    control: Control<T>;
};

export function Switch<T extends FieldValues>(props: PropsT<T>) {
    const { name, control, label, ...restProps } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { invalid } }) => (
                <div className="flex items-center gap-4">
                    <InputSwitch
                        {...restProps}
                        {...field}
                        id={`__${name}`}
                        checked={field.value}
                        invalid={invalid}
                    />
                    {label && <label htmlFor={`__${name}`}>{label}</label>}
                </div>
            )}
        />
    );
}
