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
		port: parseInt(process.env.PORT, 10) || 3000,
		name: process.env.NAME,
		slug: process.env.SLUG,
		secret: process.env.SECRET,
		oAuth: {
			host: process.env.OAUTH_HOST,
			githubAuth: {
				clientID: process.env.GITHUB_AUTH_CLIENT_ID,
				clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET
			},
			facebookAuth: {
				clientID: process.env.FACEBOOK_AUTH_CLIENT_ID,
				clientSecret: process.env.FACEBOOK_AUTH_CLIENT_SECRET,
				callbackURL: process.env.FACEBOOK_AUTH_CALLBACK_URL
			},
			googleAuth: {
				clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
				clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
				callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL
			}
		},
		analytics: process.env.ANALYTICS
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

