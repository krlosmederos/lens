/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { Disposer } from "../../utils";
import type { CategoryFilter } from "./registry";
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import catalogCategoryRegistryInjectable from "./registry.injectable";

export type AddCategoryFilter = (fn: CategoryFilter) => Disposer;

const addCategoryFilterInjectable = getInjectable({
  instantiate: (di): AddCategoryFilter => {
    const registry = di.inject(catalogCategoryRegistryInjectable);

    return (fn) => registry.addFilter(fn);
  },
  lifecycle: lifecycleEnum.singleton,
});

export default addCategoryFilterInjectable;

