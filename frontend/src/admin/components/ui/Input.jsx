import { cn } from '../../../lib/utils';

const Input = ({ label, error, className, id, type, children, ...props }) => {
    const inputClasses = cn(
        'block w-full rounded-lg border-slate-700 bg-slate-900/50 text-slate-100 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm px-4 py-2.5 border transition-colors placeholder-slate-600',
        error && 'border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500',
        className
    );

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-slate-400 mb-1.5">
                    {label}
                </label>
            )}

            {type === 'select' ? (
                <select
                    id={id}
                    className={inputClasses}
                    {...props}
                >
                    {children}
                </select>
            ) : (
                <input
                    id={id}
                    type={type}
                    className={inputClasses}
                    {...props}
                />
            )}

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
