const Visitor = require('../models/Visitor');

const trackVisitor = async (req, res, next) => {
    try {
        // Simple tracking (ignoring static assets to prevent spam)
        if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
            await Visitor.create({
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent'),
                path: req.originalUrl
            });
        }
        next();
    } catch (err) {
        // Don't block request if tracking fails
        console.error("Tracking Error:", err);
        next();
    }
};

module.exports = trackVisitor;
