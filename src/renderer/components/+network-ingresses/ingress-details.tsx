/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./ingress-details.scss";

import React from "react";
import { disposeOnUnmount, observer } from "mobx-react";
import { makeObservable, observable, reaction } from "mobx";
import { DrawerItem, DrawerTitle } from "../drawer";
import { ILoadBalancerIngress, Ingress } from "../../../common/k8s-api/endpoints";
import { Table, TableCell, TableHead, TableRow } from "../table";
import { ResourceMetrics } from "../resource-metrics";
import type { KubeObjectDetailsProps } from "../kube-object-details";
import { IngressCharts } from "./ingress-charts";
import { KubeObjectMeta } from "../kube-object-meta";
import { getBackendServiceNamePort, getMetricsForIngress, IIngressMetrics } from "../../../common/k8s-api/endpoints/ingress.api";
import { ClusterMetricsResourceType } from "../../../common/cluster-types";
import { boundMethod } from "../../utils";
import logger from "../../../common/logger";
import type { ShouldDisplayMetric } from "../../clusters/should-display-metric.injectable";
import { withInjectables } from "@ogre-tools/injectable-react";
import shouldDisplayMetricInjectable from "../../clusters/should-display-metric.injectable";

interface Props extends KubeObjectDetailsProps<Ingress> {
}

interface Dependencies {
  shouldDisplayMetric: ShouldDisplayMetric;
}

@observer
class NonInjectedIngressDetails extends React.Component<Props & Dependencies> {
  @observable metrics: IIngressMetrics = null;

  constructor(props: Props & Dependencies) {
    super(props);
    makeObservable(this);
  }

  componentDidMount() {
    disposeOnUnmount(this, [
      reaction(() => this.props.object, () => {
        this.metrics = null;
      }),
    ]);
  }

  @boundMethod
  async loadMetrics() {
    const { object: ingress } = this.props;

    this.metrics = await getMetricsForIngress(ingress.getName(), ingress.getNs());
  }

  renderPaths(ingress: Ingress) {
    const { spec: { rules }} = ingress;

    if (!rules || !rules.length) return null;

    return rules.map((rule, index) => {
      return (
        <div className="rules" key={index}>
          {rule.host && (
            <div className="host-title">
              <>Host: {rule.host}</>
            </div>
          )}
          {rule.http && (
            <Table className="paths">
              <TableHead>
                <TableCell className="path">Path</TableCell>
                <TableCell className="backends">Backends</TableCell>
              </TableHead>
              {
                rule.http.paths.map((path, index) => {
                  const { serviceName, servicePort } = getBackendServiceNamePort(path.backend);
                  const backend = `${serviceName}:${servicePort}`;

                  return (
                    <TableRow key={index}>
                      <TableCell className="path">{path.path || ""}</TableCell>
                      <TableCell className="backends">
                        <p key={backend}>{backend}</p>
                      </TableCell>
                    </TableRow>
                  );
                })
              }
            </Table>
          )}
        </div>
      );
    });
  }

  renderIngressPoints(ingressPoints: ILoadBalancerIngress[]) {
    if (!ingressPoints || ingressPoints.length === 0) return null;

    return (
      <div>
        <Table className="ingress-points">
          <TableHead>
            <TableCell className="name">Hostname</TableCell>
            <TableCell className="ingresspoints">IP</TableCell>
          </TableHead>
          {ingressPoints.map(({ hostname, ip }, index) => {
            return (
              <TableRow key={index}>
                <TableCell className="name">{hostname ? hostname : "-"}</TableCell>
                <TableCell className="ingresspoints">{ip ? ip : "-"}</TableCell>
              </TableRow>
            );
          })
          })
        </Table>
      </div>
    );
  }

  render() {
    const { object: ingress, shouldDisplayMetric } = this.props;

    if (!ingress) {
      return null;
    }

    if (!(ingress instanceof Ingress)) {
      logger.error("[IngressDetails]: passed object that is not an instanceof Ingress", ingress);

      return null;
    }

    const { spec, status } = ingress;
    const ingressPoints = status?.loadBalancer?.ingress;
    const { serviceName, servicePort } = ingress.getServiceNamePort();

    return (
      <div className="IngressDetails">
        {shouldDisplayMetric(ClusterMetricsResourceType.Ingress) && (
          <ResourceMetrics
            loader={this.loadMetrics}
            tabs={[
              "Network",
              "Duration",
            ]}
            object={ingress}
            metrics={this.metrics}
          >
            <IngressCharts/>
          </ResourceMetrics>
        )}
        <KubeObjectMeta object={ingress}/>
        <DrawerItem name="Ports">
          {ingress.getPorts()}
        </DrawerItem>
        {spec.tls &&
        <DrawerItem name="TLS">
          {spec.tls.map((tls, index) => <p key={index}>{tls.secretName}</p>)}
        </DrawerItem>
        }
        {serviceName && servicePort &&
        <DrawerItem name="Service">
          {serviceName}:{servicePort}
        </DrawerItem>
        }
        <DrawerTitle title="Rules"/>
        {this.renderPaths(ingress)}

        <DrawerTitle title="Load-Balancer Ingress Points"/>
        {this.renderIngressPoints(ingressPoints)}
      </div>
    );
  }
}

export const IngressDetails = withInjectables<Dependencies, Props>(NonInjectedIngressDetails, {
  getProps: (di, props) => ({
    shouldDisplayMetric: di.inject(shouldDisplayMetricInjectable),
    ...props,
  }),
});
