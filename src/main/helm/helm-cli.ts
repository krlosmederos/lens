/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import packageInfo from "../../../package.json";
import path from "path";
import { LensBinary } from "../lens-binary";
import assert from "assert";

export class HelmCli extends LensBinary {

  public constructor(baseDir: string, version: string) {
    super({
      version,
      baseDir,
      originalBinaryName: "helm",
      newBinaryName: "helm3",
    });
  }

  protected getTarName(): string | null {
    return `${this.binaryName}-v${this.binaryVersion}-${this.platformName}-${this.arch}.tar.gz`;
  }

  protected getUrl() {
    return `https://get.helm.sh/helm-v${this.binaryVersion}-${this.platformName}-${this.arch}.tar.gz`;
  }

  protected getBinaryPath() {
    return path.join(this.dirname, this.binaryName);
  }

  protected getOriginalBinaryPath() {
    return path.join(this.dirname, `${this.platformName}-${this.arch}`, this.originalBinaryName);
  }
}

const helmVersion = packageInfo.config.bundledHelmVersion;
const baseDir = process.env.NODE_ENV === "production"
  ? process.resourcesPath
  : path.join(process.cwd(), "binaries", "client", process.arch);

assert(typeof baseDir === "string", "baseDir MUST be a string");

export const helmCli = new HelmCli(baseDir, helmVersion);

