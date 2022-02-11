/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { Kubectl, KubectlDependencies } from "./kubectl";
import directoryForKubectlBinariesInjectable from "./directory-for-kubectl-binaries/directory-for-kubectl-binaries.injectable";
import userPreferencesStoreInjectable from "../user-preferences/store.injectable";

export type CreateKubectl = (clusterVersion: string) => Kubectl;

const createKubectl = (deps: KubectlDependencies): CreateKubectl => (
  (version) => new Kubectl(deps, version)
);

const createKubectlInjectable = getInjectable({
  instantiate: (di) => createKubectl({
    userStore: di.inject(userPreferencesStoreInjectable),
    directoryForKubectlBinaries: di.inject(directoryForKubectlBinariesInjectable),
  }),
  id: "create-kubectl",
});

export default createKubectlInjectable;
