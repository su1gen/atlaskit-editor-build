// import { manifest as loremIpsum } from './lorem-ipsum';
// import { manifest as tableCharts } from './table-charts';
import { manifest as embedVideo } from './embed-video';

import { DefaultExtensionProvider } from '@atlaskit/editor-common/extensions';

export const getExtensionProviders = () =>
  new DefaultExtensionProvider<any>(
    [
      // loremIpsum,
      // tableCharts,
      embedVideo,
      // awesome
    ],
  );