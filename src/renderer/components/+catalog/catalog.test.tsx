/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Catalog } from "./catalog";
import { createMemoryHistory } from "history";
import { mockWindow } from "../../../../__mocks__/windowMock";
import type { CatalogEntityRegistry } from "../../catalog/entity/registry";
import { CatalogEntityDetailRegistry } from "../../../extensions/registries";
import type { CatalogEntityStore } from "./catalog-entity-store/catalog-entity.store";
import { getDiForUnitTesting } from "../../getDiForUnitTesting";
import type { DiContainer } from "@ogre-tools/injectable";
import catalogEntityStoreInjectable from "./catalog-entity-store/catalog-entity-store.injectable";
import catalogEntityRegistryInjectable from "../../catalog/entity/registry.injectable";
import type { DiRender } from "../test-utils/renderFor";
import { renderFor } from "../test-utils/renderFor";
import mockFs from "mock-fs";
import directoryForUserDataInjectable from "../../../common/paths/user-data.injectable";
import { noop } from "../../utils";
import { CatalogEntity, type CatalogEntityData, type CatalogEntityActionContext } from "../../../common/catalog/entity/entity";
import catalogEntitySyncerInjectable from "../../catalog/entity/entity-syncer.injectable";

mockWindow();
jest.mock("electron", () => ({
  app: {
    getVersion: () => "99.99.99",
    getName: () => "lens",
    setName: jest.fn(),
    setPath: jest.fn(),
    getPath: () => "tmp",
    getLocale: () => "en",
    setLoginItemSettings: jest.fn(),
  },
  ipcMain: {
    on: jest.fn(),
    handle: jest.fn(),
  },
}));

jest.mock("./hotbar-toggle-menu-item", () => ({
  HotbarToggleMenuItem: () => <div>menu item</div>,
}));

class MockCatalogEntity extends CatalogEntity {
  public apiVersion = "api";
  public kind = "kind";

  constructor(data: CatalogEntityData, public onRun: (context: CatalogEntityActionContext) => void | Promise<void>) {
    super(data);
  }

  public onContextMenuOpen(): void | Promise<void> {}
  public onSettingsOpen(): void | Promise<void> {}
}

describe("<Catalog />", () => {
  const history = createMemoryHistory();
  const mockLocation = {
    pathname: "",
    search: "",
    state: "",
    hash: "",
  };
  const mockMatch = {
    params: {
      // will be used to match activeCategory
      // need to be the same as property values in kubernetesClusterCategory
      group: "entity.k8slens.dev",
      kind: "KubernetesCluster",
    },
    isExact: true,
    path: "",
    url: "",
  };

  function createMockCatalogEntity(onRun: (context: CatalogEntityActionContext) => void | Promise<void>) {
    return new MockCatalogEntity({
      metadata: {
        uid: "a_catalogEntity_uid",
        name: "a catalog entity",
        labels: {
          test: "label",
        },
      },
      status: {
        phase: "",
      },
      spec: {},
    }, onRun);
  }

  let di: DiContainer;
  let catalogEntityStore: CatalogEntityStore;
  let catalogEntityRegistry: CatalogEntityRegistry;
  let render: DiRender;

  beforeEach(async () => {
    di = getDiForUnitTesting({ doGeneralOverrides: true });

    di.override(directoryForUserDataInjectable, () => "some-directory-for-user-data");
    di.override(catalogEntitySyncerInjectable, () => noop);

    await di.runSetups();

    mockFs();

    CatalogEntityDetailRegistry.createInstance();

    render = renderFor(di);

    catalogEntityRegistry = di.inject(catalogEntityRegistryInjectable);
    catalogEntityStore = di.inject(catalogEntityStoreInjectable);
  });

  afterEach(() => {
    CatalogEntityDetailRegistry.resetInstance();

    jest.clearAllMocks();
    jest.restoreAllMocks();
    mockFs.restore();
  });

  it("can use catalogEntityRegistry.addOnBeforeRun to add hooks for catalog entities", (done) => {
    const onRun = jest.fn();
    const catalogEntityItem = createMockCatalogEntity(onRun);

    // mock as if there is a selected item > the detail panel opens
    jest
      .spyOn(catalogEntityStore, "selectedItem", "get")
      .mockImplementation(() => catalogEntityItem);

    catalogEntityRegistry.addOnBeforeRun(
      (event) => {
        expect(event.target.getId()).toBe("a_catalogEntity_uid");
        expect(event.target.getName()).toBe("a catalog entity");

        setTimeout(() => {
          expect(onRun).toHaveBeenCalled();
          done();
        }, 500);
      },
    );

    render(
      <Catalog
        history={history}
        location={mockLocation}
        match={mockMatch}
      />,
    );

    userEvent.click(screen.getByTestId("detail-panel-hot-bar-icon"));
  });

  it("onBeforeRun prevents event => onRun wont be triggered", (done) => {
    const onRun = jest.fn();
    const catalogEntityItem = createMockCatalogEntity(onRun);

    // mock as if there is a selected item > the detail panel opens
    jest
      .spyOn(catalogEntityStore, "selectedItem", "get")
      .mockImplementation(() => catalogEntityItem);

    catalogEntityRegistry.addOnBeforeRun(
      (e) => {
        setTimeout(() => {
          expect(onRun).not.toHaveBeenCalled();
          done();
        }, 500);
        e.preventDefault();
      },
    );

    render(
      <Catalog
        history={history}
        location={mockLocation}
        match={mockMatch}
      />,
    );

    userEvent.click(screen.getByTestId("detail-panel-hot-bar-icon"));
  });

  it("addOnBeforeRun throw an exception => onRun will be triggered", (done) => {
    const onRun = jest.fn();
    const catalogEntityItem = createMockCatalogEntity(onRun);

    // mock as if there is a selected item > the detail panel opens
    jest
      .spyOn(catalogEntityStore, "selectedItem", "get")
      .mockImplementation(() => catalogEntityItem);

    catalogEntityRegistry.addOnBeforeRun(
      () => {
        setTimeout(() => {
          expect(onRun).toHaveBeenCalled();
          done();
        }, 500);

        throw new Error("error!");
      },
    );

    render(
      <Catalog
        history={history}
        location={mockLocation}
        match={mockMatch}
      />,
    );

    userEvent.click(screen.getByTestId("detail-panel-hot-bar-icon"));
  });

  it("addOnRunHook return a promise and does not prevent run event => onRun()", (done) => {
    const onRun = jest.fn(() => done());
    const catalogEntityItem = createMockCatalogEntity(onRun);

    // mock as if there is a selected item > the detail panel opens
    jest
      .spyOn(catalogEntityStore, "selectedItem", "get")
      .mockImplementation(() => catalogEntityItem);

    catalogEntityRegistry.addOnBeforeRun(
      async () => {
        // no op
      },
    );

    render(
      <Catalog
        history={history}
        location={mockLocation}
        match={mockMatch}
      />,
    );

    userEvent.click(screen.getByTestId("detail-panel-hot-bar-icon"));
  });

  it("addOnRunHook return a promise and prevents event wont be triggered", (done) => {
    const onRun = jest.fn();
    const catalogEntityItem = createMockCatalogEntity(onRun);

    // mock as if there is a selected item > the detail panel opens
    jest
      .spyOn(catalogEntityStore, "selectedItem", "get")
      .mockImplementation(() => catalogEntityItem);

    catalogEntityRegistry.addOnBeforeRun(
      async (e) => {
        expect(onRun).not.toBeCalled();

        setTimeout(() => {
          expect(onRun).not.toBeCalled();
          done();
        }, 500);

        e.preventDefault();
      },
    );

    render(
      <Catalog
        history={history}
        location={mockLocation}
        match={mockMatch}
      />,
    );

    userEvent.click(screen.getByTestId("detail-panel-hot-bar-icon"));
  });

  it("addOnRunHook return a promise and reject => onRun will be triggered", (done) => {
    const onRun = jest.fn();
    const catalogEntityItem = createMockCatalogEntity(onRun);

    // mock as if there is a selected item > the detail panel opens
    jest
      .spyOn(catalogEntityStore, "selectedItem", "get")
      .mockImplementation(() => catalogEntityItem);

    catalogEntityRegistry.addOnBeforeRun(
      async () => {
        setTimeout(() => {
          expect(onRun).toHaveBeenCalled();
          done();
        }, 500);

        throw new Error("rejection!");
      },
    );

    render(
      <Catalog
        history={history}
        location={mockLocation}
        match={mockMatch}
      />,
    );

    userEvent.click(screen.getByTestId("detail-panel-hot-bar-icon"));
  });
});
