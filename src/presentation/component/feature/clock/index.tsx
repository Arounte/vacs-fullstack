import dayjs from 'dayjs';
import { type FC, useEffect, useReducer } from 'react';

type PropsT = {
    className?: string;
};

export const Clock: FC<PropsT> = ({ className }) => {
    const [, force] = useReducer((x) => x + 1, 0);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setInterval>;
        let intervalId: ReturnType<typeof setInterval>;

        const sync = () => {
            const now = Date.now();
            const delay = 1000 - (now % 1000);

            timeoutId = setTimeout(() => {
                force();

                intervalId = setInterval(force, 1000);
            }, delay);
        };

        sync();

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, []);

    return <span className={className}>{dayjs().format('DD.MM.YYYY HH:mm:ss')}</span>;
};
