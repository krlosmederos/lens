/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import React, { useEffect } from "react";
import { withInjectables } from "@ogre-tools/injectable-react";
import type { IComputedValue } from "mobx";
import { observer } from "mobx-react";
import customResourcesRouteTabsInjectable, { type CustomResourceGroupTabLayoutRoute } from "./route-tabs.injectable";
import type { AllowedResources } from "../../clusters/allowed-resources.injectable";
import allowedResourcesInjectable from "../../clusters/allowed-resources.injectable";
import { crdURL, crdRoute } from "../../../common/routes";
import { isActiveRoute } from "../../navigation";
import { Icon } from "../icon";
import { SidebarItem } from "../layout/sidebar/item";
import subscribeStoresInjectable from "../../kube-watch-api/subscribe-stores.injectable";
import type { SubscribeStores } from "../../kube-watch-api/kube-watch-api";
import { crdStore } from "./crd.store";
import { Spinner } from "../spinner";

export interface CustomResourcesSidebarItemProps {}

interface Dependencies {
  routes: IComputedValue<CustomResourceGroupTabLayoutRoute[]>;
  allowedResources: AllowedResources;
  subscribeStores: SubscribeStores;
}

const NonInjectedCustomResourcesSidebarItem = observer(({ routes, allowedResources, subscribeStores }: Dependencies & CustomResourcesSidebarItemProps) => {
  useEffect(() => subscribeStores([
    crdStore,
  ]), []);

  return (
    <SidebarItem
      id="custom-resources"
      text="Custom Resources"
      url={crdURL()}
      isActive={isActiveRoute(crdRoute)}
      isHidden={!allowedResources.has("customresourcedefinitions")}
      icon={<Icon material="extension"/>}
    >
      {routes.get().map((route) => (
        <SidebarItem
          key={route.id}
          id={route.id}
          text={route.title}
          url={route.routePath}
        >
          {route.subRoutes?.map((subRoute) => (
            <SidebarItem
              key={subRoute.id}
              id={subRoute.id}
              url={subRoute.routePath}
              text={subRoute.title}
            />
          ))}
        </SidebarItem>
      ))}
      {crdStore.isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
    </SidebarItem>
  );
});

export const CustomResourcesSidebarItem = withInjectables<Dependencies, CustomResourcesSidebarItemProps>(NonInjectedCustomResourcesSidebarItem, {
  getProps: (di, props) => ({
    routes: di.inject(customResourcesRouteTabsInjectable),
    allowedResources: di.inject(allowedResourcesInjectable),
    subscribeStores: di.inject(subscribeStoresInjectable),
    ...props,
  }),
});
