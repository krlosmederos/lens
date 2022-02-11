/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { Inject } from "@ogre-tools/injectable";
import { getLegacyGlobalDiForExtensionApi } from "./setup";

export const asLegacyGlobalForExtensionApi = ((key, param) => {
  return new Proxy(
    {},
    {
      apply(target, thisArg, argArray) {
        const fn = getLegacyGlobalDiForExtensionApi().inject(key, param) as unknown as (...args: any[]) => any;

        return fn(...argArray);
      },
      get(target, propertyName) {
        if (propertyName === "$$typeof") {
          return undefined;
        }

        const instance: any = getLegacyGlobalDiForExtensionApi().inject(key, param);

        const propertyValue = instance[propertyName];

        if (typeof propertyValue === "function") {
          return function (...args: any[]) {
            return propertyValue.apply(instance, args);
          };
        }

        return propertyValue;
      },
    },
  );
}) as Inject<false>;
