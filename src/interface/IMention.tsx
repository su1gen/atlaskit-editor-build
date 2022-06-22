import {
    MentionDescription,
    MentionsResult,
    AbstractMentionResource,
    MentionNameResolver,
    ResolvingMentionProvider,
    MentionNameDetails,
    MentionNameStatus,
    TeamMentionProvider,
    SLI_EVENT_TYPE,
} from '@atlaskit/mention/resource';

import {
    InviteExperimentCohort,
    InviteFlow,
    UserRole,
} from '@atlaskit/mention';

export interface MockMentionConfig {
    minWait?: number;
    maxWait?: number;
    mentionNameResolver?: MentionNameResolver;
    enableTeamMentionHighlight?: boolean;
    inviteExperimentCohort?: InviteExperimentCohort;
    productName?: string;
    shouldEnableInvite?: boolean;
    onInviteItemClick?: (flow: InviteFlow) => void;
    userRole?: UserRole;
}