import authConfig from '../../auth_config.json';

export const environment = {
    production: false,
    auth: {
        domain: authConfig.domain,
        clientId: authConfig.clientId,
        authorizationParams:{redirect_uri:'http://localhost:4200/startMenu'}
    },
};
