/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { autoBind } from "../../utils";
import type { LabelSelector } from "../kube-object";
import { KubeObject } from "../kube-object";
import type { DerivedKubeApiOptions } from "../kube-api";
import { KubeApi } from "../kube-api";
import type { KubeJsonApiData } from "../kube-json-api";
import { asLegacyGlobalForExtensionApi } from "../../../extensions/di-legacy-globals/for-extension-api";
import { createStoresAndApisInjectionToken } from "../../vars/create-stores-apis.token";

export interface PodDisruptionBudget {
  spec: {
    minAvailable: string;
    maxUnavailable: string;
    selector: LabelSelector;
  };
  status: {
    currentHealthy: number;
    desiredHealthy: number;
    disruptionsAllowed: number;
    expectedPods: number;
  };
}

export class PodDisruptionBudget extends KubeObject {
  static kind = "PodDisruptionBudget";
  static namespaced = true;
  static apiBase = "/apis/policy/v1beta1/poddisruptionbudgets";

  constructor(data: KubeJsonApiData) {
    super(data);
    autoBind(this);
  }

  getSelectors() {
    const selector = this.spec.selector;

    return KubeObject.stringifyLabels(selector ? selector.matchLabels : null);
  }

  getMinAvailable() {
    return this.spec.minAvailable || "N/A";
  }

  getMaxUnavailable() {
    return this.spec.maxUnavailable || "N/A";
  }

  getCurrentHealthy() {
    return this.status.currentHealthy;
  }

  getDesiredHealthy() {
    return this.status.desiredHealthy;
  }

}

export class PodDisruptionBudgetApi extends KubeApi<PodDisruptionBudget> {
  constructor(opts: DerivedKubeApiOptions = {}) {
    super({
      ...opts,
      objectConstructor: PodDisruptionBudget,
    });
  }
}

export const pdbApi = asLegacyGlobalForExtensionApi(createStoresAndApisInjectionToken)
  ? new PodDisruptionBudgetApi()
  : undefined;
