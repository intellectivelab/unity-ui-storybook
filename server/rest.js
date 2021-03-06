const R = require("ramda");

const unityApiMocks = require("@intellective/unity-api-mocks");

const domainConfig = require("./config");

const config = R.mergeDeepRight(unityApiMocks.defaultConfig, domainConfig);

const usersApi = require("./api/usersApi");

module.exports = function (app) {
	unityApiMocks.configApi(app, config);
	unityApiMocks.usersApi(app, config, undefined);
	unityApiMocks.contentApi(app, config);
	unityApiMocks.casesApi(app, config);
	unityApiMocks.foldersApi(app, config);
	unityApiMocks.selectorsApi(app, config);
	usersApi(app);
};
