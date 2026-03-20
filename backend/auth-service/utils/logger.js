const logger = {
    getTimestamp: () => new Date().toISOString(),
    
    logAuth: (action, email, success, error = null) => {
        console.log(JSON.stringify({
            timestamp: logger.getTimestamp(),
            level: success ? 'INFO' : 'ERROR',
            service,
            action: `MUTATION_${mutation.toUpperCase()}`,
            userId,
            success,
            error: error ? error.message : null,
        }));
    },

    logError: (service, action, error, context = {}) => {
        console.error(JSON.stringify({
            timestamp: logger.getTimestamp(),
            level: 'ERROR',
            service,
            action,
            message: error.message,
            stack: error.stack,
            ...context,
        }));
    },

    logUpdate: (service, action, userId, changes) => {
        console.log(JSON.stringify({
            timestamp: logger.getTimestamp(),
            level: 'INFO',
            service,
            action,
            userId,
            changes,
        }));
    },

    logDelete: (service, action, userId, change) =>{
        console.log(JSON.stringify({
            timestamp: logger.getTimestamp(),
            level: 'INFO',
            service,
            action,
            userId,
            change,
        }));
    },

    logRefreshToken: (service, action, userId, success, error = null) => {
        console.log(JSON.stringify({
            timestamp: logger.getTimestamp(),
            level: success ? 'INFO' : 'ERROR',
            service,
            action,
            userId,
            success,
            error: error ? error.message : null,
        }));
    }
};

export default logger;