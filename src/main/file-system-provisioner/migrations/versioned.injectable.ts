/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { joinMigrations } from "../../utils/join-migrations";

const versionedMigrationsInjectable = getInjectable({
  instantiate: () => joinMigrations(),
  id: "file-system-provisioner-store-versioned-migrations",
});

export default versionedMigrationsInjectable ;
