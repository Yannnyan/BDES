import { createLogger, transports, format} from 'winston'

const logger = createLogger({
    transports: [
        new transports.File(
            {
                filename: './logs/redis.log',
                name:'redis',
                level: 'info',
                label: 'Redis',
                options: { flags: 'w' },
                format: format.combine(format.prettyPrint())
            }),
        new transports.File(
            {
                filename: './logs/elastic.log', 
                name:'elastic', level: 'debug', 
                label: 'Elastic',
                options: { flags: 'w' }, 
                format: format.combine(format.prettyPrint())}),
        new transports.File(
            {
                filename: './logs/mongo.log', 
                name: 'mongo', 
                level: 'info', 
                label: 'Mongo',
                options: {flags: "w"}, 
                format: format.combine(format.prettyPrint())})
    ]
});




export {logger}
