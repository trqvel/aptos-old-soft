// logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

function createLoggerInstance(addressIndex) {
    const myFormat = printf(({ level, message, timestamp }) => {
        const formattedTimestamp = timestamp.replace(/:/g, '-');
        return `${formattedTimestamp} ${level}: ${message}`;
    });

    return createLogger({
        format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            myFormat
        ),
        transports: [
            new transports.File({ filename: `./logs/aptos_bridge_${new Date().toISOString().replace(/:/g, '-').replace(/T|\..+/g, '_')}.log` }),
            new transports.Console()
        ],
    });
}

module.exports = {
    createLoggerInstance
}
