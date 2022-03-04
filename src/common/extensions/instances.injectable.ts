/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { observable, ObservableMap } from "mobx";
import type { LensExtension } from "../../extensions/lens-extension";
import type { LensExtensionId } from "./manifest";

export type ExtensionInstances = ObservableMap<LensExtensionId, LensExtension>;

const extensionInstancesInjectable = getInjectable({
  instantiate: (): ExtensionInstances => observable.map(),
  id: "extension-instances",
});

export default extensionInstancesInjectable;
