/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { CatalogEntity } from "../../../common/catalog/entity/entity";


export class CatalogRunEvent {
  #defaultPrevented: boolean;
  #target: CatalogEntity;

  get defaultPrevented() {
    return this.#defaultPrevented;
  }

  get target() {
    return this.#target;
  }

  constructor({ target }: { target: CatalogEntity }) {
    this.#defaultPrevented = false;
    this.#target = target;
  }

  preventDefault() {
    this.#defaultPrevented = true;
  }
}
