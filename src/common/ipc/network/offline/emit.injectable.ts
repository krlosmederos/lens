/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { implWithBroadcast } from "../../impl-with-broadcast";
import { emitNetworkOfflineInjectionToken } from "./emit.token";

const emitNetworkOfflineInjectable = implWithBroadcast(emitNetworkOfflineInjectionToken);

export default emitNetworkOfflineInjectable;
