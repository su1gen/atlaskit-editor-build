import {Parameters} from "@atlaskit/editor-common/dist/types/extensions/types/extension-parameters";
import {ComponentType} from "react";
import {ExtensionComponentProps} from "@atlaskit/editor-common/dist/types/extensions/types/extension-manifest";
import {MaybeESModule} from "@atlaskit/editor-common/dist/types/extensions/types/extension-manifest-common";

export type ExtensionComponent<T extends Parameters> = ComponentType<ExtensionComponentProps<any>>;
export type ExtensionComponentModule<T extends Parameters> = Promise<MaybeESModule<ExtensionComponent<T>>>;