require('dotenv').config();

const devConfig = {
	MONGO_URL: process.env.MONGO_URL_DEV
};

const testConfig = {};

const prodConfig = {
	MONGO_URL: process.env.MONGO_URL_PROD
};

const defaultConfig = {
	site: {
		port: parseInt(process.env.PORT, 10)|| 3000,
		name: process.env.NAME,
		slug: process.env.SLUG,
		secret: process.env.SECRET,
	},
};

function envConfig(env) {
	switch(env) {
		case 'development':
			return devConfig;
		case 'production':
			return prodConfig;
		default:
			return prodConfig;
	}
}

module.exports = Object.assign(defaultConfig, envConfig(process.env.NODE_ENV));

