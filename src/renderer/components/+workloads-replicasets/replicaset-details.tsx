/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./replicaset-details.scss";
import React from "react";
import { makeObservable, observable, reaction } from "mobx";
import { DrawerItem } from "../drawer";
import { Badge } from "../badge";
import type { ReplicaSetStore } from "./replicasets.store";
import { PodDetailsStatuses } from "../+workloads-pods/pod-details-statuses";
import { PodDetailsTolerations } from "../+workloads-pods/pod-details-tolerations";
import { PodDetailsAffinities } from "../+workloads-pods/pod-details-affinities";
import { disposeOnUnmount, observer } from "mobx-react";
import type { KubeObjectDetailsProps } from "../kube-object-details";
import { getMetricsForReplicaSets, type IPodMetrics, ReplicaSet } from "../../../common/k8s-api/endpoints";
import { ResourceMetrics, ResourceMetricsText } from "../resource-metrics";
import { PodCharts, podMetricTabs } from "../+workloads-pods/pod-charts";
import { PodDetailsList } from "../+workloads-pods/pod-details-list";
import { KubeObjectMeta } from "../kube-object-meta";
import { ClusterMetricsResourceType } from "../../../common/cluster-types";
import { boundMethod, Disposer } from "../../utils";
import logger from "../../../common/logger";
import type { KubeObjectStore } from "../../../common/k8s-api/kube-object.store";
import type { KubeObject } from "../../../common/k8s-api/kube-object";
import { withInjectables } from "@ogre-tools/injectable-react";
import type { ShouldDisplayMetric } from "../../clusters/should-display-metric.injectable";
import shouldDisplayMetricInjectable from "../../clusters/should-display-metric.injectable";
import replicaSetStoreInjectable from "./store.injectable";
import type { PodStore } from "../+workloads-pods/store";
import podStoreInjectable from "../+workloads-pods/store.injectable";
import subscribeStoresInjectable from "../../kube-watch-api/subscribe-stores.injectable";

interface Props extends KubeObjectDetailsProps<ReplicaSet> {
}

interface Dependencies {
  subscribeStores: (stores: KubeObjectStore<KubeObject>[]) => Disposer;
  shouldDisplayMetric: ShouldDisplayMetric;
  replicaSetStore: ReplicaSetStore;
  podStore: PodStore;
}

@observer
class NonInjectedReplicaSetDetails extends React.Component<Props & Dependencies> {
  @observable metrics: IPodMetrics = null;

  constructor(props: Props & Dependencies) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    const {
      podStore,
      subscribeStores,
    } = this.props;

    disposeOnUnmount(this, [
      reaction(() => this.props.object, () => {
        this.metrics = null;
      }),

      subscribeStores([
        podStore,
      ]),
    ]);
  }

  @boundMethod
  async loadMetrics() {
    const { object: replicaSet } = this.props;

    this.metrics = await getMetricsForReplicaSets([replicaSet], replicaSet.getNs(), "");
  }

  render() {
    const { object: replicaSet, shouldDisplayMetric, replicaSetStore, podStore } = this.props;

    if (!replicaSet) {
      return null;
    }

    if (!(replicaSet instanceof ReplicaSet)) {
      logger.error("[ReplicaSetDetails]: passed object that is not an instanceof ReplicaSet", replicaSet);

      return null;
    }

    const { metrics } = this;
    const { status } = replicaSet;
    const { availableReplicas, replicas } = status;
    const selectors = replicaSet.getSelectors();
    const nodeSelector = replicaSet.getNodeSelectors();
    const images = replicaSet.getImages();
    const childPods = replicaSetStore.getChildPods(replicaSet);

    return (
      <div className="ReplicaSetDetails">
        {shouldDisplayMetric(ClusterMetricsResourceType.ReplicaSet) && podStore.isLoaded && (
          <ResourceMetrics
            loader={this.loadMetrics}
            tabs={podMetricTabs}
            object={replicaSet}
            metrics={metrics}
          >
            <PodCharts/>
          </ResourceMetrics>
        )}
        <KubeObjectMeta object={replicaSet}/>
        {selectors.length > 0 &&
        <DrawerItem name="Selector" labelsOnly>
          {
            selectors.map(label => <Badge key={label} label={label}/>)
          }
        </DrawerItem>
        }
        {nodeSelector.length > 0 &&
        <DrawerItem name="Node Selector" labelsOnly>
          {
            nodeSelector.map(label => <Badge key={label} label={label}/>)
          }
        </DrawerItem>
        }
        {images.length > 0 &&
        <DrawerItem name="Images">
          {
            images.map(image => <p key={image}>{image}</p>)
          }
        </DrawerItem>
        }
        <DrawerItem name="Replicas">
          {`${availableReplicas || 0} current / ${replicas || 0} desired`}
        </DrawerItem>
        <PodDetailsTolerations workload={replicaSet}/>
        <PodDetailsAffinities workload={replicaSet}/>
        <DrawerItem name="Pod Status" className="pod-status">
          <PodDetailsStatuses pods={childPods}/>
        </DrawerItem>
        <ResourceMetricsText metrics={metrics}/>
        <PodDetailsList pods={childPods} owner={replicaSet}/>
      </div>
    );
  }
}

export const ReplicaSetDetails = withInjectables<Dependencies, Props>(NonInjectedReplicaSetDetails, {
  getProps: (di, props) => ({
    ...props,
    subscribeStores: di.inject(subscribeStoresInjectable),
    shouldDisplayMetric: di.inject(shouldDisplayMetricInjectable),
    replicaSetStore: di.inject(replicaSetStoreInjectable),
    podStore: di.inject(podStoreInjectable),
  }),
});
