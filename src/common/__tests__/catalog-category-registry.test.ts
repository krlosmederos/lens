/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import { CatalogCategoryRegistry } from "../../renderer/catalog/category/registry";
import { CatalogCategory, type CatalogCategorySpec } from "../catalog/category/category";


class TestCatalogCategoryRegistry extends CatalogCategoryRegistry { }

class TestCatalogCategory extends CatalogCategory {
  public readonly apiVersion = "catalog.k8slens.dev/v1alpha1";
  public readonly kind = "CatalogCategory";
  public metadata = {
    name: "Test Category",
    icon: "",
  };
  public spec: CatalogCategorySpec = {
    group: "entity.k8slens.dev",
    versions: [],
    names: {
      kind: "Test",
    },
  };
}

class TestCatalogCategory2 extends CatalogCategory {
  public readonly apiVersion = "catalog.k8slens.dev/v1alpha1";
  public readonly kind = "CatalogCategory";
  public metadata = {
    name: "Test Category 2",
    icon: "",
  };
  public spec: CatalogCategorySpec = {
    group: "entity.k8slens.dev",
    versions: [],
    names: {
      kind: "Test2",
    },
  };
}

describe("CatalogCategoryRegistry", () => {
  it("should remove only the category registered when running the disposer", () => {
    const registry = new TestCatalogCategoryRegistry();

    expect(registry.categories.get().length).toBe(0);

    const d1 = registry.add(new TestCatalogCategory());
    const d2 = registry.add(new TestCatalogCategory2());

    expect(registry.categories.get().length).toBe(2);

    d1();
    expect(registry.categories.get().length).toBe(1);

    d2();
    expect(registry.categories.get().length).toBe(0);
  });

  it("doesn't return items that are filtered out", () => {
    const registry = new TestCatalogCategoryRegistry();

    registry.add(new TestCatalogCategory());
    registry.add(new TestCatalogCategory2());

    expect(registry.categories.get().length).toBe(2);
    expect(registry.filteredCategories.get().length).toBe(2);

    const disposer = registry.addFilter(category => category.metadata.name === "Test Category");

    expect(registry.categories.get().length).toBe(2);
    expect(registry.filteredCategories.get().length).toBe(1);

    const disposer2 = registry.addFilter(category => category.metadata.name === "foo");

    expect(registry.categories.get().length).toBe(2);
    expect(registry.filteredCategories.get().length).toBe(0);

    disposer();

    expect(registry.categories.get().length).toBe(2);
    expect(registry.filteredCategories.get().length).toBe(0);

    disposer2();

    expect(registry.categories.get().length).toBe(2);
    expect(registry.filteredCategories.get().length).toBe(2);
  });
});
