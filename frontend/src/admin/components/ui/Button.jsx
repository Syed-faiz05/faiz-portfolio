import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    disabled,
    type = 'button',
    ...props
}) => {
    const variants = {
        primary: 'bg-cyan-600 hover:bg-cyan-500 text-white focus:ring-cyan-500 shadow-lg shadow-cyan-500/20',
        secondary: 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white focus:ring-slate-500',
        danger: 'bg-red-500/10 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white focus:ring-red-500',
        ghost: 'text-slate-400 hover:bg-slate-800 hover:text-white',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    return (
        <button
            type={type}
            className={cn(
                'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
