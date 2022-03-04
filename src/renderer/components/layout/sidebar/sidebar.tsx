/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import styles from "./sidebar.module.scss";
import type { TabLayoutRoute } from "../tab-layout";

import React from "react";
import { observer } from "mobx-react";
import { cssNames } from "../../../utils";
import type { ClusterPageMenuRegistration } from "../../../../extensions/registries";
import { ClusterPageMenuRegistry, ClusterPageRegistry, getExtensionPageUrl } from "../../../../extensions/registries";
import { SidebarItem } from "./item";
import { SidebarCluster } from "./cluster";
import renderTabRoutesSidebarItemsInjectable from "../render-tab-routes-sidebar-items.injectable";
import { ConfigSidebarItem } from "../../+config/sidebar-item";
import { ClusterSidebarItem } from "../../+cluster/sidebar-item";
import { NodesSidebarItem } from "../../+nodes/sidebar-item";
import { WorkloadsSidebarItem } from "../../+workloads/sidebar-item";
import { NetworkSidebarItem } from "../../+network/sidebar-item";
import { StorageSidebarItem } from "../../+storage/sidebar-item";
import { NamespacesSidebarItem } from "../../+namespaces/sidebar-item";
import { EventsSidebarItem } from "../../+events/sidebar-item";
import { HelmSidebarItem } from "../../+helm/sidebar-item";
import { UserManagementSidebarItem } from "../../+user-management/sidebar-item";
import { CustomResourcesSidebarItem } from "../../+custom-resources/sidebar-item";
import isRouteActiveInjectable from "../../../navigation/is-route-active.injectable";
import { asLegacyGlobalForExtensionApi } from "../../../../extensions/di-legacy-globals/for-extension-api";

interface SidebarProps {
  className?: string;
}

// TODO: remove these when making the page registries injectable
const renderTabRoutesSidebarItems = asLegacyGlobalForExtensionApi(renderTabRoutesSidebarItemsInjectable);
const isRouteActive = asLegacyGlobalForExtensionApi(isRouteActiveInjectable);

@observer
export class Sidebar extends React.Component<SidebarProps> {
  static displayName = "Sidebar";

  getTabLayoutRoutes(menu: ClusterPageMenuRegistration): TabLayoutRoute[] {
    if (!menu.id) {
      return [];
    }

    const routes: TabLayoutRoute[] = [];
    const subMenus = ClusterPageMenuRegistry.getInstance().getSubItems(menu);
    const clusterPageRegistry = ClusterPageRegistry.getInstance();

    for (const subMenu of subMenus) {
      const page = clusterPageRegistry.getByPageTarget(subMenu.target);

      if (!page) {
        continue;
      }

      const { extensionId, id: pageId, url, components } = page;

      if (subMenu.components.Icon) {
        console.warn(
          "ClusterPageMenuRegistration has components.Icon defined and a valid parentId. Icon will not be displayed",
          {
            id: subMenu.id,
            parentId: subMenu.parentId,
            target: subMenu.target,
          },
        );
      }

      routes.push({
        routePath: url,
        url: getExtensionPageUrl({ extensionId, pageId, params: subMenu.target.params }),
        title: subMenu.title,
        component: components.Page,
      });
    }

    return routes;
  }

  renderRegisteredMenus() {
    return ClusterPageMenuRegistry.getInstance().getRootItems().map((menuItem, index) => {
      const registeredPage = ClusterPageRegistry.getInstance().getByPageTarget(menuItem.target);
      const tabRoutes = this.getTabLayoutRoutes(menuItem);
      const id = `registered-item-${index}`;
      let pageUrl: string;
      let isActive = false;

      if (registeredPage) {
        const { extensionId, id: pageId } = registeredPage;

        pageUrl = getExtensionPageUrl({ extensionId, pageId, params: menuItem.target.params });
        isActive = isRouteActive(registeredPage.url);
      } else if (tabRoutes.length > 0) {
        pageUrl = tabRoutes[0].url;
        isActive = isRouteActive(tabRoutes.map((tab) => tab.routePath));
      } else {
        return null;
      }

      return (
        <SidebarItem
          key={id}
          id={id}
          url={pageUrl}
          isActive={isActive}
          text={menuItem.title}
          icon={<menuItem.components.Icon/>}
        >
          {renderTabRoutesSidebarItems(tabRoutes)}
        </SidebarItem>
      );
    });
  }

  render() {
    const { className } = this.props;

    return (
      <div className={cssNames("flex flex-col", className)} data-testid="cluster-sidebar">
        <SidebarCluster />
        <div className={styles.sidebarNav}>
          <ClusterSidebarItem />
          <NodesSidebarItem />
          <WorkloadsSidebarItem />
          <ConfigSidebarItem />
          <NetworkSidebarItem />
          <StorageSidebarItem />
          <NamespacesSidebarItem />
          <EventsSidebarItem />
          <HelmSidebarItem />
          <UserManagementSidebarItem />
          <CustomResourcesSidebarItem />
          {this.renderRegisteredMenus()}
        </div>
      </div>
    );
  }
}
