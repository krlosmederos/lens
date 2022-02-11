/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable, lifecycleEnum } from "@ogre-tools/injectable";
import type { RoleBinding } from "../../../../../common/k8s-api/endpoints";
import roleBindingDialogStateInjectable from "./state.injectable";

export type OpenRoleBindingDialog = (binding?: RoleBinding) => void;

const openRoleBindingDialogInjectable = getInjectable({
  instantiate: (di): OpenRoleBindingDialog => {
    const state = di.inject(roleBindingDialogStateInjectable);

    return (data) => {
      state.set({
        data,
        isEditing: Boolean(data),
      });
    };
  },
  lifecycle: lifecycleEnum.singleton,
});

export default openRoleBindingDialogInjectable;
