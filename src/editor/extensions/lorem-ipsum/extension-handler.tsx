// import React from 'react';
// import { ExtensionComponentProps } from '@atlaskit/editor-common/extensions';
// import { ReactRenderer } from '@atlaskit/renderer';

export type LoremParams = {
  sentence?: string;
  words?: string;
};

// export default function ({ node }: ExtensionComponentProps<LoremParams>) {
//   const { parameters, type } = node;
//
//   console.log(node)
//   console.log(parameters)
//   console.log(type)
//
//   switch (type) {
//     case 'inlineExtension':
//       console.log(1)
//       return (
//         <span style={{ border: '1px solid blue' }} title="inlineExtension">
//           {parameters && parameters.words}
//         </span>
//       );
//     case 'extension':
//       console.log(2)
//       return (
//         <div
//           style={{ border: '1px solid green', margin: '10px 0' }}
//           title="extension"
//         >
//           {parameters && parameters.sentence}
//         </div>
//       );
//     case 'bodiedExtension':
//       console.log(3)
//       return (
//         <div
//           style={{ border: '1px solid red', margin: '10px 0' }}
//           title="bodiedExtension"
//         >
//           {/* TODO: Bodied extensions will need to render the AkRenderer to be able to deal with nested
//            extensions but there is no good way to provide the providers and extension handlers used to
//            setup the top level one. We should provide a helper for it. */}
//
//           <ReactRenderer
//             allowHeadingAnchorLinks
//             adfStage="stage0"
//             document={{
//               type: 'doc',
//               version: '1',
//               content: node.content,
//             }}
//             appearance="full-page"
//           />
//           <p>{parameters && parameters.sentence}</p>
//         </div>
//       );
//   }
//
//   return null;
// }


import React, {ComponentType} from 'react';
import {ReactRenderer} from '@atlaskit/renderer';
import {Parameters} from "@atlaskit/editor-common/dist/types/extensions/types/extension-parameters";
import {ExtensionComponentProps} from "@atlaskit/editor-common/dist/types/extensions/types/extension-manifest";
import {MaybeESModule} from "@atlaskit/editor-common/dist/types/extensions/types/extension-manifest-common";
//
type ExtensionComponent<T extends Parameters> = ComponentType<ExtensionComponentProps<any>>;
type ExtensionComponentModule<T extends Parameters> = Promise<MaybeESModule<ExtensionComponent<T>>>;
//
//
const renderExtensionModule: ExtensionComponentModule<any> = Promise.resolve(props => {
  const {content, type, parameters} = props.node;
  switch (type) {
    case 'inlineExtension':
      return (
        <span style={{border: '1px solid blue'}} title="inlineExtension">
          {parameters && parameters.words}
        </span>
      );
    case 'extension':
      return (
        <div
          style={{border: '1px solid green', margin: '10px 0'}}
          title="extension"
        >
          {parameters && parameters.sentence}
        </div>
      );
    case 'bodiedExtension':
      return (
        <div
          style={{border: '1px solid red', margin: '10px 0'}}
          title="bodiedExtension"
        >
          {/* TODO: Bodied extensions will need to render the AkRenderer to be able to deal with nested
           extensions but there is no good way to provide the providers and extension handlers used to
           setup the top level one. We should provide a helper for it. */}

          <ReactRenderer
            allowHeadingAnchorLinks
            adfStage="stage0"
            document={{
              type: 'doc',
              version: '1',
              content: content,
            }}
            appearance="full-page"
          />
        </div>
      );
    default:
      return (
        <div></div>
      )
  }
})


export default renderExtensionModule;
