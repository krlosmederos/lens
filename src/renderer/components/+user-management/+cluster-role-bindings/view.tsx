/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./view.scss";

import { observer } from "mobx-react";
import React from "react";
import type { RouteComponentProps } from "react-router";
import { KubeObjectListLayout } from "../../kube-object-list-layout";
import { KubeObjectStatusIcon } from "../../kube-object-status-icon";
import { ClusterRoleBindingDialog } from "./dialog/view";
import { clusterRoleBindingsStore } from "./store";
import { clusterRolesStore } from "../+cluster-roles/store";
import { serviceAccountsStore } from "../+service-accounts/store";
import type { ClusterRoleBindingsRouteParams } from "../../../../common/routes";
import { withInjectables } from "@ogre-tools/injectable-react";
import type { OpenClusterRoleBindingDialog } from "./dialog/open.injectable";
import openClusterRoleBindingDialogInjectable from "./dialog/open.injectable";

enum columnId {
  name = "name",
  namespace = "namespace",
  bindings = "bindings",
  age = "age",
}

export interface ClusterRoleBindingsProps extends RouteComponentProps<ClusterRoleBindingsRouteParams> {
}

interface Dependencies {
  openClusterRoleBindingDialog: OpenClusterRoleBindingDialog;
}

const NonInjectedClusterRoleBindings = observer(({ openClusterRoleBindingDialog }: Dependencies & ClusterRoleBindingsProps) => (
  <>
    <KubeObjectListLayout
      isConfigurable
      tableId="access_cluster_role_bindings"
      className="ClusterRoleBindings"
      store={clusterRoleBindingsStore}
      dependentStores={[clusterRolesStore, serviceAccountsStore]}
      sortingCallbacks={{
        [columnId.name]: binding => binding.getName(),
        [columnId.bindings]: binding => binding.getSubjectNames(),
        [columnId.age]: binding => binding.getTimeDiffFromNow(),
      }}
      searchFilters={[
        binding => binding.getSearchFields(),
        binding => binding.getSubjectNames(),
      ]}
      renderHeaderTitle="Cluster Role Bindings"
      renderTableHeader={[
        { title: "Name", className: "name", sortBy: columnId.name, id: columnId.name },
        { className: "warning", showWithColumn: columnId.name },
        { title: "Bindings", className: "bindings", sortBy: columnId.bindings, id: columnId.bindings },
        { title: "Age", className: "age", sortBy: columnId.age, id: columnId.age },
      ]}
      renderTableContents={binding => [
        binding.getName(),
        <KubeObjectStatusIcon key="icon" object={binding} />,
        binding.getSubjectNames(),
        binding.getAge(),
      ]}
      addRemoveButtons={{
        onAdd: openClusterRoleBindingDialog,
        addTooltip: "Create new ClusterRoleBinding",
      }}
    />
    <ClusterRoleBindingDialog />
  </>
));

export const ClusterRoleBindings = withInjectables<Dependencies, ClusterRoleBindingsProps>(NonInjectedClusterRoleBindings, {
  getProps: (di, props) => ({
    ...props,
    openClusterRoleBindingDialog: di.inject(openClusterRoleBindingDialogInjectable),
  }),
});
