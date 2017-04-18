import { FakeBackendService } from './impl/fake';

export interface NowPlaying {
    offset: number,
    title: string,
    url: string
}

export type ClientSessionId = number;

export interface BackendService {
    getNowPlaying(channelId: string): Promise<NowPlaying>

    createClientSession(channelId: string): Promise<ClientSessionId>
    deleteClientSession(clientSessionId: ClientSessionId): Promise<void>
}

export function getBackendService(backendServiceName: string): Promise<BackendService> {
    return new Promise((accept, reject) => {
        process.nextTick(() => {
            switch (backendServiceName) {
                case 'fake':
                    accept(new FakeBackendService());
                    break;
                default:
                    reject(new Error(`Backend service with name ${backendServiceName} is not known.`));
            }
        });
    });
}
