/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { RequireExactlyOne } from "type-fest";
import type { ClusterId } from "../../cluster-types";
import { getChannelInjectionToken } from "../channel";

export type KubectlApplyAll = (clusterId: ClusterId, resources: string[], extraArgs: string[]) => Promise<RequireExactlyOne<{ stdout: string; stderr: string }>>;

export const kubectlApplyAllInjectionToken = getChannelInjectionToken<KubectlApplyAll>("kubectl:apply-all");
