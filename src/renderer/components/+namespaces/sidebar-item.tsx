/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { withInjectables } from "@ogre-tools/injectable-react";
import { observer } from "mobx-react";
import React from "react";
import { namespacesRoute, namespacesURL } from "../../../common/routes";
import type { AllowedResources } from "../../clusters/allowed-resources.injectable";
import allowedResourcesInjectable from "../../clusters/allowed-resources.injectable";
import { isActiveRoute } from "../../navigation";
import { Icon } from "../icon";
import { SidebarItem } from "../layout/sidebar/item";

export interface NamespacesSidebarItemProps {}

interface Dependencies {
  allowedResources: AllowedResources;
}

const NonInjectedNamespacesSidebarItem = observer(({ allowedResources }: Dependencies & NamespacesSidebarItemProps) => (
  <SidebarItem
    id="namespaces"
    text="Namespaces"
    isActive={isActiveRoute(namespacesRoute)}
    isHidden={!allowedResources.has("namespaces")}
    url={namespacesURL()}
    icon={<Icon material="layers"/>}
  />
));

export const NamespacesSidebarItem = withInjectables<Dependencies, NamespacesSidebarItemProps>(NonInjectedNamespacesSidebarItem, {
  getProps: (di, props) => ({
    allowedResources: di.inject(allowedResourcesInjectable),
    ...props,
  }),
});
