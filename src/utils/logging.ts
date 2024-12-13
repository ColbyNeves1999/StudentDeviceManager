import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const customLevel = {
    levels: {
      error: 0,
      warning: 1,
      alert: 2,
      information: 3,
      success: 4
    },
    colors: {
      error: 'red',
      warning: 'yellow',
      alert: 'magenta',
      information: 'cyan',
      success: 'green'
    }
  };

winston.addColors(customLevel.colors);

const fileRotateTransportCombined = new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    maxFiles: '10d',
});

const fileRotateTransportError = new DailyRotateFile({
    level: 'error',
    filename: 'logs/error-%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    maxFiles: '15d',
});

const fileRotateTransportWarning = new DailyRotateFile({
    level: 'warning',
    filename: 'logs/warning-%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    maxFiles: '15d',
});

const fileRotateTransportAlert = new DailyRotateFile({
    level: 'alert',
    filename: 'logs/alert-%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    maxFiles: '10d',
});

const customLogger = winston.createLogger({

    levels: customLevel.levels,
    level: 'success',
    format: winston.format.combine(winston.format.timestamp({ format: 'DD-MM-YYYY hh:mm:ss A' }),
                                   winston.format.json(),
                                   winston.format.errors({ stack: true })),
    transports: [
        new winston.transports.Console(),
        fileRotateTransportCombined,
        fileRotateTransportError,
        fileRotateTransportWarning,
        fileRotateTransportAlert,

    ],

})

export default customLogger;