/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import Webpack from "webpack";
import WebpackDevServer, { Configuration } from "webpack-dev-server";
import { webpackLensRenderer } from "../../../../webpack.renderer";
import { buildDir } from "../../../common/vars";
import { getInjectable } from "@ogre-tools/injectable";
import webpackDevServerLoggerInjectable from "./server-logger.injectable";
import lensProxyPortInjectable from "../../lens-proxy/port.injectable";

/**
 * API docs:
 * @url https://webpack.js.org/configuration/dev-server/
 * @url https://github.com/chimurai/http-proxy-middleware
 */
const webpackDevServerInjectable = getInjectable({
  id: "webpack-dev-server",
  instantiate: (di): WebpackDevServer => {
    const config = webpackLensRenderer({ showVars: false });
    const compiler = Webpack(config);
    const logger = di.inject(webpackDevServerLoggerInjectable);
    const lensProxyPort = di.inject(lensProxyPortInjectable);
    const options: Configuration = {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      allowedHosts: "all",
      host: "localhost",
      static: buildDir, // aka `devServer.contentBase` in webpack@4
      hot: "only", // use HMR only without errors
      liveReload: false,
      proxy: {
        "*": {
          router(req) {
            logger.debug(`proxy path ${req.path}`, req.headers);

            return `http://localhost:${lensProxyPort.value}`;
          },
          secure: false, // allow http connections
          ws: true, // proxy websockets, e.g. terminal
          logLevel: "error",
        },
      },
      client: {
        overlay: false, // don't show warnings and errors on top of rendered app view
        logging: "error",
      },
    };

    logger.info(`creating`, options);

    return new WebpackDevServer(options, compiler);
  },
});

export default webpackDevServerInjectable;
