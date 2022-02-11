/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import createExtensionsPreferencesStoreInjectable from "../../common/extensions/preferences/create-store.injectable";
import versionedMigrationsInjectable from "./migrations/versioned.injectable";

const extensionsPreferencesStoreInjectable = getInjectable({
  instantiate: (di) => {
    const store = di.inject(createExtensionsPreferencesStoreInjectable, {
      migrations: di.inject(versionedMigrationsInjectable),
    });

    store.load();

    return store;
  },
  id: "extensions-preferences-store",
});

export default extensionsPreferencesStoreInjectable;
