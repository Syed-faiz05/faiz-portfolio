import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

const AnimatedCounter = ({ value, direction = "up", delay = 0, suffix = "", prefix = "", format = true, duration = 1.5 }) => {
    const ref = useRef(null);
    const motionValue = useMotionValue(direction === "down" ? value : 0);
    const springValue = useSpring(motionValue, {
        damping: 60,
        stiffness: 100,
        restDelta: 0.001
    });
    const isInView = useInView(ref, { once: true, margin: "-10%" });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView) {
            setTimeout(() => {
                motionValue.set(direction === "down" ? 0 : value);
            }, delay * 1000);
        }
    }, [motionValue, isInView, delay, value, direction]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            const formatted = format 
                ? Intl.NumberFormat("en-US").format(Math.floor(latest))
                : Math.floor(latest);
            setDisplayValue(formatted);
        });
    }, [springValue, format]);

    return (
        <span ref={ref} className="font-mono tabular-nums tracking-tight">
            {prefix}{displayValue}{suffix}
        </span>
    );
};

export default AnimatedCounter;
