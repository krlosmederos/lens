/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { asLegacyGlobalForExtensionApi } from "../../../extensions/di-legacy-globals/for-extension-api";
import { createStoresAndApisInjectionToken } from "../../vars/create-stores-apis.token";
import type { DerivedKubeApiOptions } from "../kube-api";
import { KubeApi } from "../kube-api";
import { KubeObject } from "../kube-object";
import type { RoleRule } from "./role.api";

export class ClusterRole extends KubeObject {
  static kind = "ClusterRole";
  static namespaced = false;
  static apiBase = "/apis/rbac.authorization.k8s.io/v1/clusterroles";

  declare rules?: RoleRule[];

  getRules() {
    return this.rules || [];
  }
}

export class ClusterRoleApi extends KubeApi<ClusterRole> {
  constructor(opts: DerivedKubeApiOptions = {}) {
    super({
      ...opts,
      objectConstructor: ClusterRole,
    });
  }
}

export const clusterRoleApi = asLegacyGlobalForExtensionApi(createStoresAndApisInjectionToken)
  ? new ClusterRoleApi()
  : undefined;
