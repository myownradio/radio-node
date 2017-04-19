import { Client } from 'node-rest-client';

import { BackendService, ClientSessionId, NowPlaying } from "../";

const endpoint: string = 'http://myownradio.biz/api/v0/stream/${channelId}/now';

export class MorBackendService implements BackendService {
    get name(): string {
        return 'mor'
    };

    getNowPlaying(channelId: string): Promise<NowPlaying> {
        return new Promise((resolve, reject) => {
            const client = new Client();
            const req = client.get(endpoint, { path: { channelId } }, (data, response) => {
                if (response.statusCode === 200) {
                    resolve(<NowPlaying> {
                        title: data.data.title,
                        url: data.data.url,
                        offset: data.data.offset
                    });
                } else {
                    reject(new Error('Error response.'));
                }
            });
            req.on('error', err => reject(err));
        });
    }

    createClientSession(channelId: string): Promise<ClientSessionId> {
        return Promise.reject(new Error('Method not implemented.'));
    }

    deleteClientSession(clientSessionId: ClientSessionId): Promise<void> {
        return Promise.reject(new Error('Method not implemented.'));
    }
}
