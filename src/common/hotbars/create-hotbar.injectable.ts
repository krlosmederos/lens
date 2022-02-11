/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { CreateChildLogger } from "../logger/create-child-logger.injectable";
import childLoggerInjectable from "../logger/create-child-logger.injectable";
import { Hotbar, HotbarDependencies } from "./hotbar";
import { CreateHotbarData, defaultHotbarCells } from "./hotbar-types";
import { onTooManyHotbarItemsInjectionToken } from "./too-many-items.token";
import * as uuid from "uuid";
import { tuple } from "../utils";

export type CreateHotbar = (data: CreateHotbarData) => [string, Hotbar];

interface Dependencies {
  createChildLogger: CreateChildLogger;
  onTooManyHotbarItems: () => void;
}

const createHotbar = ({ createChildLogger, onTooManyHotbarItems }: Dependencies): CreateHotbar => (
  (data) => {
    const {
      id = uuid.v4(),
      name,
      items = tuple.filled(defaultHotbarCells, null),
    } = data;
    const deps: HotbarDependencies = {
      onTooManyHotbarItems,
      logger: createChildLogger(`HOTBAR`, { name: data.name }),
    };

    return [id, new Hotbar(deps, name, items)];
  }
);

const createHotbarInjectable = getInjectable({
  instantiate: (di) => createHotbar({
    createChildLogger: (prefix, defaultMeta) => di.inject(childLoggerInjectable, { prefix, defaultMeta }),
    onTooManyHotbarItems: di.inject(onTooManyHotbarItemsInjectionToken),
  }),
  id: "create-hotbar",
});

export default createHotbarInjectable;
