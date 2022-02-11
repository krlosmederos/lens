/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { DerivedKubeApiOptions, KubeApi } from "../kube-api";
import { KubeObject } from "../kube-object";
import { autoBind } from "../../../renderer/utils";
import { metricsApi } from "./metrics.api";
import type { IPodMetrics } from "./pod.api";
import type { KubeJsonApiData } from "../kube-json-api";

export type NamespaceStatusPhase = "Active" | "Terminating";

export interface NamespaceStatus {
  phase: NamespaceStatusPhase;
}
export class Namespace extends KubeObject {
  static kind = "Namespace";
  static namespaced = false;
  static apiBase = "/api/v1/namespaces";

  declare status?: NamespaceStatus;

  constructor(data: KubeJsonApiData) {
    super(data);
    autoBind(this);
  }

  getStatus() {
    return this.status?.phase ?? "-";
  }
}

export class NamespaceApi extends KubeApi<Namespace> {
  constructor(opts: DerivedKubeApiOptions = {}) {
    super({
      ...opts,
      objectConstructor: Namespace,
    });
  }
}

export function getMetricsForNamespace(namespace: string, selector = ""): Promise<IPodMetrics> {
  const opts = { category: "pods", pods: ".*", namespace, selector };

  return metricsApi.getMetrics({
    cpuUsage: opts,
    memoryUsage: opts,
    fsUsage: opts,
    fsWrites: opts,
    fsReads: opts,
    networkReceive: opts,
    networkTransmit: opts,
  }, {
    namespace,
  });
}
