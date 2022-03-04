/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { autoBind } from "../../utils";
import { KubeObject } from "../kube-object";
import type { DerivedKubeApiOptions } from "../kube-api";
import { KubeApi } from "../kube-api";
import type { KubeJsonApiData } from "../kube-json-api";
import { asLegacyGlobalForExtensionApi } from "../../../extensions/di-legacy-globals/for-extension-api";
import { createStoresAndApisInjectionToken } from "../../vars/create-stores-apis.token";

export interface SecretRef {
  name: string;
}

export class ServiceAccount extends KubeObject {
  static kind = "ServiceAccount";
  static namespaced = true;
  static apiBase = "/api/v1/serviceaccounts";

  declare secrets?: SecretRef[];
  declare imagePullSecrets?: SecretRef[];

  constructor(data: KubeJsonApiData) {
    super(data);
    autoBind(this);
  }

  getSecrets() {
    return this.secrets || [];
  }

  getImagePullSecrets() {
    return this.imagePullSecrets || [];
  }
}

export class ServiceAccountApi extends KubeApi<ServiceAccount> {
  constructor(opts: DerivedKubeApiOptions = {}) {
    super({
      ...opts,
      objectConstructor: ServiceAccount,
    });
  }
}

export const serviceAccountsApi = asLegacyGlobalForExtensionApi(createStoresAndApisInjectionToken)
  ? new ServiceAccountApi()
  : undefined;
