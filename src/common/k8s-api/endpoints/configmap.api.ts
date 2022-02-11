/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { KubeObject } from "../kube-object";
import type { KubeJsonApiData } from "../kube-json-api";
import type { DerivedKubeApiOptions } from "../kube-api";
import { KubeApi } from "../kube-api";
import { autoBind } from "../../utils";
import { asLegacyGlobalForExtensionApi } from "../../../extensions/di-legacy-globals/for-extension-api";
import { createStoresAndApisInjectionToken } from "../../vars/create-stores-apis.token";

export interface ConfigMap {
  data: {
    [param: string]: string;
  };
}

export class ConfigMap extends KubeObject {
  static kind = "ConfigMap";
  static namespaced = true;
  static apiBase = "/api/v1/configmaps";

  constructor(data: KubeJsonApiData) {
    super(data);
    autoBind(this);

    this.data ??= {};
  }

  getKeys(): string[] {
    return Object.keys(this.data);
  }
}

export class ConfigMapApi extends KubeApi<ConfigMap> {
  constructor(opts: DerivedKubeApiOptions = {}) {
    super({
      objectConstructor: ConfigMap,
      ...opts,
    });
  }
}

export const configMapApi = asLegacyGlobalForExtensionApi(createStoresAndApisInjectionToken)
  ? new ConfigMapApi()
  : undefined;
