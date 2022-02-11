/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { Theme } from "./theme";
import activeThemeIdInjectable from "../../common/user-preferences/active-theme-id.injectable";
import availableThemesInjectable from "./available.injectable";
import { defaultTheme } from "../../common/vars";
import type { ReadonlyDeep } from "type-fest";

export interface ActiveTheme {
  readonly value: ReadonlyDeep<Theme>;
  reset: () => void;
}

const activeThemeInjectable = getInjectable({
  instantiate: (di): ActiveTheme => {
    const activeThemeId = di.inject(activeThemeIdInjectable);
    const availableThemes = di.inject(availableThemesInjectable);

    return {
      get value() {
        return availableThemes.get(activeThemeId.value) ?? availableThemes.get(defaultTheme);
      },
      reset: () => {
        activeThemeId.reset();
      },
    };
  },
  id: "active-theme",
});

export default activeThemeInjectable;
