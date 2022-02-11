/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./namespace-details.scss";

import React from "react";
import { computed, makeObservable, observable, reaction } from "mobx";
import { disposeOnUnmount, observer } from "mobx-react";
import { DrawerItem } from "../drawer";
import { cssNames, Disposer, prevDefault } from "../../utils";
import { getMetricsForNamespace, type IPodMetrics, Namespace } from "../../../common/k8s-api/endpoints";
import type { KubeObjectDetailsProps } from "../kube-object-details";
import { Spinner } from "../spinner";
import { resourceQuotaStore } from "../+config-resource-quotas/resource-quotas.store";
import { KubeObjectMeta } from "../kube-object-meta";
import { limitRangeStore } from "../+config-limit-ranges/limit-ranges.store";
import { ResourceMetrics } from "../resource-metrics";
import { PodCharts, podMetricTabs } from "../+workloads-pods/pod-charts";
import { ClusterMetricsResourceType } from "../../../common/cluster-types";
import logger from "../../../common/logger";
import type { KubeObjectStore } from "../../../common/k8s-api/kube-object.store";
import type { KubeObject } from "../../../common/k8s-api/kube-object";
import { withInjectables } from "@ogre-tools/injectable-react";
import type { ShouldDisplayMetric } from "../../clusters/should-display-metric.injectable";
import shouldDisplayMetricInjectable from "../../clusters/should-display-metric.injectable";
import type { ShowDetails } from "../kube-object/details/show.injectable";
import showDetailsInjectable from "../kube-object/details/show.injectable";

interface Props extends KubeObjectDetailsProps<Namespace> {
}

interface Dependencies {
  subscribeStores: (stores: KubeObjectStore<KubeObject>[]) => Disposer;
  shouldDisplayMetric: ShouldDisplayMetric;
  showDetails: ShowDetails;
}

@observer
class NonInjectedNamespaceDetails extends React.Component<Props & Dependencies> {
  @observable metrics: IPodMetrics = null;

  constructor(props: Props & Dependencies) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    disposeOnUnmount(this, [
      reaction(() => this.props.object, () => {
        this.metrics = null;
      }),

      this.props.subscribeStores([
        resourceQuotaStore,
        limitRangeStore,
      ]),
    ]);
  }

  @computed get quotas() {
    const namespace = this.props.object.getName();

    return resourceQuotaStore.getAllByNs(namespace);
  }

  @computed get limitranges() {
    const namespace = this.props.object.getName();

    return limitRangeStore.getAllByNs(namespace);
  }

  render() {
    const { object: namespace, shouldDisplayMetric, showDetails } = this.props;

    if (!namespace) {
      return null;
    }

    if (!(namespace instanceof Namespace)) {
      logger.error("[NamespaceDetails]: passed object that is not an instanceof Namespace", namespace);

      return null;
    }

    const status = namespace.getStatus();

    return (
      <div className="NamespaceDetails">
        {shouldDisplayMetric(ClusterMetricsResourceType.Namespace) && (
          <ResourceMetrics
            loader={async () => {
              this.metrics = await getMetricsForNamespace(namespace.getName(), "");
            }}
            tabs={podMetricTabs}
            object={namespace}
            metrics={this.metrics}
          >
            <PodCharts />
          </ResourceMetrics>
        )}
        <KubeObjectMeta object={namespace}/>

        <DrawerItem name="Status">
          <span className={cssNames("status", status.toLowerCase())}>{status}</span>
        </DrawerItem>

        <DrawerItem name="Resource Quotas" className="quotas flex align-center">
          {!this.quotas && resourceQuotaStore.isLoading && <Spinner/>}
          {this.quotas.map(quota => (
            <a key={quota.getId()} onClick={prevDefault(() => showDetails(quota))}>
              {quota.getName()}
            </a>
          ))}
        </DrawerItem>
        <DrawerItem name="Limit Ranges">
          {!this.limitranges && limitRangeStore.isLoading && <Spinner/>}
          {this.limitranges.map(limitrange => (
            <a key={limitrange.getId()} onClick={prevDefault(() => showDetails(limitrange))}>
              {limitrange.getName()}
            </a>
          ))}
        </DrawerItem>
      </div>
    );
  }
}

export const NamespaceDetails = withInjectables<Dependencies, Props>(NonInjectedNamespaceDetails, {
  getProps: (di, props) => ({
    ...props,
    subscribeStores: di.inject(subscribeStoresInjectable),
    shouldDisplayMetric: di.inject(shouldDisplayMetricInjectable),
    showDetails: di.inject(showDetailsInjectable),
  }),
});

