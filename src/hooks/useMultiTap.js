import { useRef, useCallback } from "react";

export default function useMultiTap(
    onSuccess,
    { taps = 5, timeout = 600, onProgress } = {}
) {
    const count = useRef(0);
    const timer = useRef(null);

    return useCallback(() => {
        count.current += 1;
        clearTimeout(timer.current);

        if (count.current >= taps) {
            count.current = 0;
            onSuccess();
            return;
        }

        onProgress?.(count.current, taps);

        timer.current = setTimeout(() => {
            count.current = 0;
        }, timeout);
    }, [onSuccess, onProgress, taps, timeout]);
}