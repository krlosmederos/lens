/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { Disposer } from "../../utils";
import type { EntityFilter } from "./registry";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import catalogEntityRegistryInjectable from "./registry.injectable";

export type AddEntityFilter = (fn: EntityFilter) => Disposer;


const addEntityFilterInjectable = getInjectable({
  instantiate: (di): AddEntityFilter => {
    const registry = di.inject(catalogEntityRegistryInjectable);

    return (fn) => registry.addFilter(fn);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default addEntityFilterInjectable;

