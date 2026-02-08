import clsx from 'clsx';
import { Dropdown, type DropdownProps } from 'primereact/dropdown';
import { FloatLabel } from 'primereact/floatlabel';

export type SelectPropsT = DropdownProps & {
    label?: string;
};

export function Select(props: SelectPropsT) {
    const { name, label, className, ...restProps } = props;

    return (
        <FloatLabel>
            <Dropdown
                {...restProps}
                name={name}
                className={clsx('w-full', className)}
                id={`__${name}`}
                editable
                showClear
            />
            {label && <label htmlFor={`__${name}`}>{label}</label>}
        </FloatLabel>
    );
}
