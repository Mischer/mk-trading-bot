import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoConfig = async (configService: ConfigService): Promise<MongooseModuleOptions> => {
	console.log('MONGO URL: ' + getMongoUrl(configService));
	return {
		uri: getMongoUrl(configService),
		...getMongoOptions(),
	};
};

function getMongoUrl(configService): string {
	return (
		'mongodb://' +
		configService.get('MONGO_LOGIN') +
		':' +
		configService.get('MONGO_PASSWORD') +
		'@' +
		configService.get('MONGO_HOST') +
		':' +
		configService.get('MONGO_PORT') +
		'/' +
		configService.get('MONGO_AUTH_DATABASE')
	);
}

function getMongoOptions() {
	return {
		retryAttempts: 3,
	};
}
