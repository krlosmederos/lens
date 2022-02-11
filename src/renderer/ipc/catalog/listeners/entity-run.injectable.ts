/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getInjectable } from "@ogre-tools/injectable";
import { emitCatalogEntityRunInjectionToken } from "../../../../common/ipc/catalog/entity-run/emit.token";
import catalogEntityRegistryInjectable from "../../../catalog/entity/registry.injectable";
import ipcRendererInjectable from "../../ipc-renderer.injectable";

const initCatalogEntityRunListenerInjectable = getInjectable({
  instantiate: (di) => {
    const ipcRenderer = di.inject(ipcRendererInjectable);
    const entityRegistry = di.inject(catalogEntityRegistryInjectable);

    return () => {
      emitCatalogEntityRunInjectionToken.setupListener(ipcRenderer, (entityId) => {
        const entity = entityRegistry.findById(entityId);

        if (entity) {
          entityRegistry.onRun(entity);
        }
      });
    };
  },
  id: "init-catalog-entity-run-listener",
});

export default initCatalogEntityRunListenerInjectable;
