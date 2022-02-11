/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { withInjectables } from "@ogre-tools/injectable-react";
import { observer } from "mobx-react";
import React from "react";
import { clusterRoute, clusterURL } from "../../../common/routes";
import allowedResourcesInjectable, { AllowedResources } from "../../clusters/allowed-resources.injectable";
import { isActiveRoute } from "../../navigation";
import { Icon } from "../icon";
import { SidebarItem } from "../layout/sidebar/item";

export interface ClusterSidebarItemProps {}

interface Dependencies {
  allowedResources: AllowedResources;
}

const NonInjectedClusterSidebarItem = observer(({ allowedResources }: Dependencies & ClusterSidebarItemProps) => (
  <SidebarItem
    id="cluster"
    text="Cluster"
    isActive={isActiveRoute(clusterRoute)}
    isHidden={!allowedResources.has("nodes")}
    url={clusterURL()}
    icon={<Icon svg="kube"/>}
  />
));

export const ClusterSidebarItem = withInjectables<Dependencies, ClusterSidebarItemProps>(NonInjectedClusterSidebarItem, {
  getProps: (di, props) => ({
    allowedResources: di.inject(allowedResourcesInjectable),
    ...props,
  }),
});
