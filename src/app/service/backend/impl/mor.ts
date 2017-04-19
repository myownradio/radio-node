import { Client } from 'node-rest-client-promise';

import { BackendService, ClientSessionId, NowPlaying } from "../";

const endpoint: string = 'http://myownradio.biz/api/v0/stream/${channelId}/now';

// const endpoint: string = 'http://myownradio.biz/api/r/channel/${channelId}';

export class MorBackendService implements BackendService {
    private client = new Client();

    get name(): string {
        return 'mor'
    };

    getNowPlaying(channelId: string): Promise<NowPlaying> {
        return this.client.getPromise(endpoint, { path: { channelId } })
            .then(({ data, response }) => <NowPlaying> data.data);
    }

    createClientSession(channelId: string): Promise<ClientSessionId> {
        return Promise.reject(new Error('Method not implemented.'));
    }

    deleteClientSession(clientSessionId: ClientSessionId): Promise<void> {
        return Promise.reject(new Error('Method not implemented.'));
    }
}
