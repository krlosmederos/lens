/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeObject } from "../kube-object";
import type { DerivedKubeApiOptions } from "../kube-api";
import { KubeApi } from "../kube-api";
import { asLegacyGlobalForExtensionApi } from "../../../extensions/di-legacy-globals/for-extension-api";
import { createStoresAndApisInjectionToken } from "../../vars/create-stores-apis.token";

export interface RoleRule {
  verbs: string[];
  apiGroups: string[];
  resources: string[];
  resourceNames?: string[];
}

export class Role extends KubeObject {
  static kind = "Role";
  static namespaced = true;
  static apiBase = "/apis/rbac.authorization.k8s.io/v1/roles";

  declare rules?: RoleRule[];

  getRules() {
    return this.rules || [];
  }
}

export class RoleApi extends KubeApi<Role> {
  constructor(opts: DerivedKubeApiOptions = {}) {
    super({
      ...opts,
      objectConstructor: Role,
    });
  }
}

export const roleApi = asLegacyGlobalForExtensionApi(createStoresAndApisInjectionToken)
  ? new RoleApi()
  : undefined;
