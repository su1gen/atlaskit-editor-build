// @ts-ignore
interface AsapBasedAuth {
    readonly asapIssuer: string;
    readonly token: string;
    readonly baseUrl: string;
}

interface ClientBasedAuth {
    readonly clientId: string;
    readonly token: string;
    readonly baseUrl: string;
}

interface AuthContext {
    readonly collectionName?: string;
}

interface UploadParams {
    collection?: string;
}

declare type Auth = ClientBasedAuth | AsapBasedAuth;
declare type AuthProvider = (context?: AuthContext) => Promise<Auth>;
declare type AuthFromContextProvider = (contextId: string) => Promise<Auth>;

interface MediaClientConfig {
    readonly authProvider: AuthProvider;
    readonly initialAuth?: Auth;
    readonly stargateBaseUrl?: string;
    readonly getAuthFromContext?: AuthFromContextProvider;
}
// @ts-ignore
declare type MediaProvider = {
    uploadParams?: UploadParams;
    /**
     * (optional) Used for creating new uploads and finalizing files.
     * NOTE: We currently don't accept MediaClientConfig, because we need config properties
     *       to initialize
     */
    uploadMediaClientConfig?: MediaClientConfig;
    /**
     * Used for displaying Media Cards and downloading files.
     */
    viewMediaClientConfig: MediaClientConfig;
};

let clientBaseAuth: Promise<Auth> = Promise.resolve({
    clientId: "clientId",
    token: "token",
    baseUrl: "http://localhost:3000",
})
let authProvider = (): Promise<Auth> => {
    return Promise.resolve(clientBaseAuth)
}

let mediaClientConfig: MediaClientConfig = {
    authProvider: authProvider,
}

let uploadMediaClientConfig: MediaClientConfig = {
    authProvider: authProvider,
}
// @ts-ignore
const mediaProvider: Promise<MediaProvider> = Promise.resolve({
    uploadParams: {
        collection: "myCollection"
    },

    viewMediaClientConfig: mediaClientConfig,
    uploadMediaClientConfig: uploadMediaClientConfig,
})

// const mediaProvider: Promise<MediaProvider> = Promise.resolve({
//         viewMediaClientConfig: {
//             authProvider: () => Promise.resolve()
//         },
//         uploadMediaClientConfig: {
//             authProvider: () => Promise.resolve()
//         }
//     })

//
//
// import { MediaClient } from '@atlaskit/media-client';
//
// type Access = { [resource: string]: string[] };
// const cachedAuths: { [key: string]: Promise<Auth> } = {};
// const accessUrns: { [key: string]: Access } = {
//     MediaServicesSample: {
//         'urn:filestore:collection:MediaServicesSample': ['read', 'insert'],
//         'urn:filestore:chunk:*': ['create', 'read'],
//         'urn:filestore:upload': ['create'],
//         'urn:filestore:upload:*': ['read', 'update'],
//         'urn:filestore:file': ['create'],
//         'urn:filestore:file:*': ['read', 'update'],
//     },
//     'mediapicker-test': {
//         'urn:filestore:collection': ['create'],
//         'urn:filestore:collection:mediapicker-test': ['read', 'insert'],
//         'urn:filestore:chunk:*': ['create', 'read'],
//         'urn:filestore:upload': ['create'],
//         'urn:filestore:upload:*': ['read', 'update'],
//         'urn:filestore:file': ['create'],
//         'urn:filestore:file:*': ['read', 'update'],
//     },
// };
// const requestAuthProvider = async (authEnvironment: string, collectionName: string,): Promise<Auth> => {
//     const url = `https://media-playground.dev.atl-paas.net/token/tenant?environment=${authEnvironment}`;
//     const body = JSON.stringify({
//         access: accessUrns[collectionName] || {},
//     });
//     const headers = new Headers();
//
//     headers.append('Content-Type', 'application/json; charset=utf-8');
//     headers.append('Accept', 'text/plain, */*; q=0.01');
//
//     const response = await fetch(url, {
//         method: 'POST',
//         body,
//         headers,
//     });
//
//     // We leverage the fact, that our internal /toke/tenant API returns data in the same format as Auth
//     return response.json();
// };
//
// const defaultCollectionName = 'MediaServicesSample';
// const mediaPickerAuthProvider = (authEnvironment: string = 'asap') => (context?: AuthContext,) => {
//     const collectionName = (context && context.collectionName) || defaultCollectionName;
//     authEnvironment = authEnvironment === 'asap' ? 'asap' : '';
//     const cacheKey = `${collectionName}:${authEnvironment}`;
//     if (!cachedAuths[cacheKey]) {
//         cachedAuths[cacheKey] = requestAuthProvider(authEnvironment, collectionName,);
//     }
//     return cachedAuths[cacheKey];
// };
//
// const createUploadMediaClientConfig = (stargateBaseUrl?: string,): MediaClientConfig => ({
//     authProvider: mediaPickerAuthProvider('asap'),
//     stargateBaseUrl,
// });
//
// // const createUploadMediaClient = () => new MediaClient(createUploadMediaClientConfig());
//
//
// const mediaProvider: Promise<MediaProvider> = Promise.resolve({
//     uploadParams: {
//         collection: "myCollection"
//     },
//     // uploadMediaClientConfig?: MediaClientConfig;
//
//     viewMediaClientConfig: mediaClientConfig,
//     uploadMediaClientConfig: createUploadMediaClientConfig(),
// })