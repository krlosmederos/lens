/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

// App's common configuration for any process (main, renderer, build pipeline, etc.)
import path from "path";
import packageInfo from "../../package.json";
import { asLegacyGlobalForExtensionApi } from "../extensions/di-legacy-globals/for-extension-api";
import isMacInjectable from "./vars/is-mac.injectable";
import isProductionInjectable from "./vars/is-production.injectable";
import isTestEnvInjectable from "./vars/is-test-env.injectable";
import isWindowsInjectable from "./vars/is-windows.injectable";

/**
 * @deprecated use di.inject(isMacInjectable) instead
 */
export const isMac = asLegacyGlobalForExtensionApi(isMacInjectable);

/**
 * @deprecated use di.inject(isWindowsInjectable) instead
 */
export const isWindows = asLegacyGlobalForExtensionApi(isWindowsInjectable);

/**
 * @deprecated use di.inject(isTestEnvInjectable) instead
 */
export const isTestEnv = asLegacyGlobalForExtensionApi(isTestEnvInjectable);

/**
 * @deprecated use di.inject(isProductionInjectable) instead
 */
export const isProduction = asLegacyGlobalForExtensionApi(isProductionInjectable);

export const isDebugging = ["true", "1", "yes", "y", "on"].includes((process.env.DEBUG ?? "").toLowerCase());
export const isDevelopment = !isTestEnv && !isProduction;

export const integrationTestingArg = "--integration-testing";
export const isIntegrationTesting = process.argv.includes(integrationTestingArg);

export const productName = packageInfo.productName;
export const appName = `${packageInfo.productName}${isDevelopment ? "Dev" : ""}`;
export const publicPath = "/build/" as string;
export const defaultTheme = "lens-dark" as string;
export const defaultFontSize = 12;
export const defaultTerminalFontFamily = "RobotoMono";
export const defaultEditorFontFamily = "RobotoMono";

// Webpack build paths
export const contextDir = process.cwd();
export const buildDir = path.join(contextDir, "static", publicPath);
export const preloadEntrypoint = path.join(contextDir, "src/preload.ts");
export const mainDir = path.join(contextDir, "src/main");
export const rendererDir = path.join(contextDir, "src/renderer");
export const htmlTemplate = path.resolve(rendererDir, "template.html");
export const sassCommonVars = path.resolve(rendererDir, "components/vars.scss");

export const __static = (() => {
  const root = isDevelopment
    ? contextDir
    : (process.resourcesPath ?? contextDir);

  return path.resolve(root, "static");
})();

// Apis
export const apiPrefix = "/api" as string; // local router apis
export const apiKubePrefix = "/api-kube" as string; // k8s cluster apis
export const shellRoute = "/shell" as string;

// Links
export const issuesTrackerUrl = "https://github.com/lensapp/lens/issues" as string;
export const slackUrl = "https://join.slack.com/t/k8slens/shared_invite/zt-wcl8jq3k-68R5Wcmk1o95MLBE5igUDQ" as string;
export const supportUrl = "https://docs.k8slens.dev/latest/support/" as string;
export const docsUrl = "https://docs.k8slens.dev/main/" as string;
