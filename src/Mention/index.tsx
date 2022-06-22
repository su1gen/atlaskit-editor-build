import {
    AbstractMentionResource,
    MentionDescription,
    MentionNameDetails,
    MentionNameStatus,
    MentionsResult,
    ResolvingMentionProvider, SLI_EVENT_TYPE,
    TeamMentionProvider
} from "@atlaskit/mention/resource";
import {InviteExperimentCohort, InviteFlow, UserRole} from "@atlaskit/mention";
import {MockMentionConfig} from '../interface/IMention'
import {Search} from 'js-search';



let debugEnabled = false;
function debug(msg: any, ...args: any[]): void {
    if (debugEnabled) {
        // eslint-disable-next-line no-console
        console.log(msg, ...args);
    }
}

class HttpError implements Error {
    name: string;
    message: string;
    statusCode: number;
    stack?: string;

    constructor(statusCode: number, statusMessage: string) {
        this.statusCode = statusCode;
        this.message = statusMessage;
        this.name = 'HttpError';
        this.stack = new Error().stack;
    }
}


export class MockMentionResource extends AbstractMentionResource implements ResolvingMentionProvider, TeamMentionProvider {
    private config: MockMentionConfig;
    private lastReturnedSearch: number;
    private search: Search = new Search('id');

    productName?: string;
    shouldEnableInvite: boolean;
    userRole: UserRole;
    inviteExperimentCohort?: InviteExperimentCohort;
    onInviteItemClick?: (flow: InviteFlow) => void;

    constructor(config: MockMentionConfig, users:any) {
        super();
        //@ts-ignore
        this.users = users
        this.search.addIndex('name');
        this.search.addIndex('mentionName');
        this.search.addIndex('nickname');
        this.search.addDocuments(users)
        // this.search.addDocuments([{
        //     id: "0",
        //     name: "PEtyshara",
        //     mentionName: "Caprice",
        //     nickname: "",
        //     avatarUrl: "data:image/png;base64,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"
        // },
        //     {
        //         id: "1",
        //         name: "PEtyshara",
        //         mentionName: "Caprice",
        //         nickname: "",
        //         avatarUrl: "data:image/png;base64,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"
        //     },
        //     {
        //         id: "2",
        //         name: "Raina Halper",
        //         mentionName: "Caprice",
        //         nickname: "Carolyn",
        //         avatarUrl: "data:image/png;base64,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"
        //     },
        //     {
        //         id: "3",
        //         name: "Raina Halper",
        //         mentionName: "Caprice",
        //         nickname: "Carolyn",
        //         avatarUrl: "data:image/png;base64,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"
        //     }]);

        this.config = config;
        this.lastReturnedSearch = 0;
        this.productName = config.productName;
        this.shouldEnableInvite = !!config.shouldEnableInvite;
        this.inviteExperimentCohort = config.inviteExperimentCohort;
        this.onInviteItemClick = config.onInviteItemClick;
        this.userRole = config.userRole || 'basic';
    }

    filter(query: string): Promise<void> {
        const searchTime = Date.now();
        const notify = (mentions: MentionsResult) => {
            if (searchTime >= this.lastReturnedSearch) {
                this.lastReturnedSearch = searchTime;
                let stats: { teamMentionDuration?: number; duration?: number } = {};
                if (query === 'team') {
                    stats.teamMentionDuration = 200;
                } else {
                    stats.duration = 100;
                }
                this._notifyListeners(mentions, stats);
            } else {
                const date = new Date(searchTime).toISOString().substr(17, 6);
                debug('Stale search result, skipping', date, query); // eslint-disable-line no-console, max-len
            }
            this._notifyAllResultsListeners(mentions);
        };

        const notifyErrors = (error: Error) => {
            this._notifyErrorListeners(error);
        };

        const notifyAnalytics = (
            eventType: string,
            sliName: string,
            action: string,
        ) => {
            this._notifyAnalyticsListeners(eventType, sliName, action);
        };

        const minWait = this.config.minWait || 0;
        const randomTime = (this.config.maxWait || 0) - minWait;
        const waitTime = Math.random() * randomTime + minWait;
        setTimeout(() => {
            let mentions;
            if (query === 'error') {
                notifyErrors(new Error('mock-error'));
                notifyAnalytics(SLI_EVENT_TYPE, 'searchUser', 'failed');
                return;
            } else if (query === '401' || query === '403') {
                notifyErrors(new HttpError(parseInt(query, 10), 'get off my lawn'));
                notifyAnalytics(SLI_EVENT_TYPE, 'searchUser', 'failed');
                return;
            } else if (query) {
                mentions = this.search.search(query);
            } else {
                //@ts-ignore
                mentions = this.users
            }
            //@ts-ignore
            notify({mentions, query});
            notifyAnalytics(SLI_EVENT_TYPE, 'searchUser', 'succeeded');
        }, waitTime + 1);
        return Promise.resolve();
    }

    // eslint-disable-next-line class-methods-use-this
    recordMentionSelection(mention: MentionDescription): void {
        console.log('aloxa3')
        debug(`Record mention selection ${mention.id}`);
    }

    resolveMentionName(
        id: string,
    ): Promise<MentionNameDetails> | MentionNameDetails {
        console.log('aloxa1')

        debug('(mock)resolveMentionName', id);
        if (!this.config.mentionNameResolver) {
            return {
                id,
                name: '',
                status: MentionNameStatus.UNKNOWN,
            };
        }
        return this.config.mentionNameResolver.lookupName(id);
    }

    cacheMentionName(id: string, name: string) {
        debug('(mock)cacheMentionName', id, name);
        if (this.config.mentionNameResolver) {
            this.config.mentionNameResolver.cacheName(id, name);
        }
    }

    supportsMentionNameResolving() {
        const supported = !!this.config.mentionNameResolver;
        debug('supportsMentionNameResolving', supported);
        return supported;
    }

    shouldHighlightMention(mention: MentionDescription): boolean {

        return mention.id === 'oscar';
    }

    mentionTypeaheadHighlightEnabled = () =>
        this.config.enableTeamMentionHighlight || false;

    mentionTypeaheadCreateTeamPath = () => '/people/search#createTeam';
}