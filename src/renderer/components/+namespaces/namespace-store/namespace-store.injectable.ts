/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { NamespaceStore } from "./namespace.store";
import apiManagerInjectable from "../../../../common/k8s-api/api-manager.injectable";
import selectedNamespacesStorageInjectable from "./storage.injectable";
import namespaceApiInjectable from "../../../../common/k8s-api/endpoints/namespace.api.injectable";

const namespaceStoreInjectable = getInjectable({
  id: "namespace-store",

  instantiate: (di) => {
    const apiManager = di.inject(apiManagerInjectable);
    const api = di.inject(namespaceApiInjectable);
    const namespaceStore = new NamespaceStore({
      storage: di.inject(selectedNamespacesStorageInjectable),
    }, api);


    apiManager.registerStore(namespaceStore);

    return namespaceStore;
  },
});

export default namespaceStoreInjectable;
