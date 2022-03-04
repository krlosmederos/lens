/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectionToken } from "@ogre-tools/injectable";
import type { LensLogger } from "../logger";

export const baseLoggerInjectionToken = getInjectionToken<LensLogger>({
  id: "base-logger-token",
});
