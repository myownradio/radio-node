import { FakeBackendService } from './impl/fake';
import { MorBackendService } from "./impl/mor";

export interface NowPlaying {
    offset: number,
    title: string,
    url: string
}

export type ClientSessionId = number;

export interface BackendService {
    name: string

    getNowPlaying(channelId: string): Promise<NowPlaying>

    createClientSession(channelId: string): Promise<ClientSessionId>
    deleteClientSession(clientSessionId: ClientSessionId): Promise<void>
}

const backendServiceMap = {
    fake: FakeBackendService,
    mor: MorBackendService
};

export function getBackendService(backendServiceName: string): Promise<BackendService> {
    return new Promise((accept, reject) => {
        process.nextTick(() => {
            if (backendServiceName in backendServiceMap) {
                accept(new backendServiceMap[backendServiceName]);
            } else {
                reject(new Error(`Backend service with name "${backendServiceName}" is not known.`));
            }
        });
    });
}
