import { BackendService, ClientSessionId, NowPlaying } from "../";

export class FakeBackendService implements BackendService {
    private lastClientSession: ClientSessionId = 0;

    getNowPlaying(channelId: string): Promise<NowPlaying> {
        return new Promise((resolve) => {
            resolve(<NowPlaying> {
                title: "Fake Title",
                url: "file:///",
                offset: 0
            });
        });
    }

    createClientSession(channelId: string): Promise<ClientSessionId> {
        return new Promise((resolve) => {
            resolve(this.getAndIncrementLastClientSessionId());
        });
    }

    deleteClientSession(clientSessionId: ClientSessionId): Promise<void> {
        return Promise.resolve();
    }

    private getAndIncrementLastClientSessionId(): ClientSessionId {
        return this.lastClientSession ++;
    }
}
