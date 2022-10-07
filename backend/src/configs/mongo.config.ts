import { TypegooseModuleOptions } from 'nestjs-typegoose';
import { ConfigService } from '@nestjs/config';

export const mongoConfig = (config: ConfigService): TypegooseModuleOptions => ({
    uri: getMongoUri(config),
    ...getMongoOptions()
});

const getMongoUri = (config: ConfigService): string => {
    const login = config.get('MONGO_LOGIN');
    const password = config.get('MONGO_PASSWORD');
    const host = config.get('MONGO_HOST');
    const port = config.get('MONGO_PORT');
    const database = config.get('MONGO_AUTH_DATABASE');

    return `mongodb://${login}:${password}@${host}:${port}/${database}`;
};

const getMongoOptions = (): Record<string, boolean> => ({
    useNewUrlParser: true
});
