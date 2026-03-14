import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}|:<>?';

const TerminalText = ({ 
    text, 
    delay = 0, 
    speed = 30, // ms per character step
    iterations = 5, // how many random characters before settling
    className = "" 
}) => {
    const targetText = String(text);
    const [displayText, setDisplayText] = useState(targetText.replace(/./g, ' '));
    const [started, setStarted] = useState(false);
    
    // Convert to string to map chars easily
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    useEffect(() => {
        if (isInView && !started) {
            const timeout = setTimeout(() => {
                setStarted(true);
            }, delay * 1000);
            return () => clearTimeout(timeout);
        }
    }, [isInView, started, delay]);

    useEffect(() => {
        if (!started) return;

        let currentIteration = 0;
        const totalIterations = targetText.length * iterations;
        
        const interval = setInterval(() => {
            setDisplayText(() => {
                return targetText.split('').map((targetChar, index) => {
                    // If target is a space, keep it a space
                    if (targetChar === ' ') return ' ';
                    
                    // If we've passed this character's reveal threshold, show the real character
                    if (currentIteration >= index * iterations + iterations) {
                        return targetChar;
                    }
                    
                    // If it hasn't started decoding yet, keep it blank
                    if (currentIteration < index * iterations) {
                        return ' ';
                    }

                    // Otherwise, random character
                    return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                }).join('');
            });

            currentIteration++;

            if (currentIteration > totalIterations) {
                clearInterval(interval);
                setDisplayText(targetText); // lock it perfectly at the end
            }
        }, speed);

        return () => clearInterval(interval);
    }, [started, targetText, speed, iterations]);

    return (
        <span ref={containerRef} className={`font-mono tracking-tight ${className}`}>
            {displayText}
        </span>
    );
};

export default TerminalText;
