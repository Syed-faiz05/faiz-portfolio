import { Award } from 'lucide-react';

const Achievements = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-100">Achievements</h2>
                <p className="text-slate-400 mt-1">Showcase your certifications and awards</p>
            </div>

            <div className="flex flex-col items-center justify-center p-20 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-medium text-slate-300">Feature Coming Soon</h3>
                <p className="text-slate-500 mt-1 max-w-sm text-center">
                    This module is currently under development. Check back later for updates.
                </p>
            </div>
        </div>
    );
};

export default Achievements;
