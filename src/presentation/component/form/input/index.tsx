import {
    type Control,
    Controller,
    type FieldValues,
    type Path,
} from "react-hook-form";
import {
    Input as BaseInput,
    type PropsT as InputPropsT,
} from "../../common/input";

type PropsT<T extends FieldValues> = Omit<InputPropsT, "name"> & {
    name: Path<T>;
    control: Control<T>;
};

export function Input<T extends FieldValues>(props: PropsT<T>) {
    const { name, control, ...restProps } = props;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
                <BaseInput
                    {...restProps}
                    {...field}
                    invalid={invalid}
                    error={error?.message}
                />
            )}
        />
    );
}
