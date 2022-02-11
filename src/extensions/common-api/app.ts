/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { getAppVersion } from "../../common/utils";
import getEnabledExtensionNamesInjectable from "../../common/extensions/preferences/get-enabled.injectable";
import * as Preferences from "./user-preferences";
import { asLegacyGlobalForExtensionApi } from "../di-legacy-globals/for-extension-api";
import isSnapInjectable from "../../common/vars/is-snap.injectable";
import { appName, slackUrl, issuesTrackerUrl } from "../../common/vars";
import isLinuxInjectable from "../../common/vars/is-linux.injectable";
import isMacInjectable from "../../common/vars/is-mac.injectable";
import isWindowsInjectable from "../../common/vars/is-windows.injectable";

export const version = getAppVersion();
export const isSnap = asLegacyGlobalForExtensionApi(isSnapInjectable);
export const isWindows = asLegacyGlobalForExtensionApi(isWindowsInjectable);
export const isMac = asLegacyGlobalForExtensionApi(isMacInjectable);
export const isLinux = asLegacyGlobalForExtensionApi(isLinuxInjectable);

export const getEnabledExtensions = asLegacyGlobalForExtensionApi(getEnabledExtensionNamesInjectable);

export { Preferences, appName, slackUrl, issuesTrackerUrl };
