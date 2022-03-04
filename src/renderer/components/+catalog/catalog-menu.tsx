/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import treeStyles from "./catalog-tree.module.scss";
import styles from "./catalog-menu.module.scss";

import React from "react";
import type { TreeItemProps } from "@material-ui/lab";
import { TreeItem, TreeView } from "@material-ui/lab";
import { Icon } from "../icon";
import { StylesProvider } from "@material-ui/core";
import { cssNames } from "../../utils";
import { observer } from "mobx-react";
import type { CatalogCategory } from "../../../common/catalog/category/category";
import type { IComputedValue } from "mobx";
import { withInjectables } from "@ogre-tools/injectable-react";
import categoriesInjectable from "../../../common/catalog/category/categories.injectable";

export interface CatalogMenuProps {
  activeItem: string;
  onItemClick: (id: string) => void;
}

function getCategoryIcon(category: CatalogCategory) {
  const { icon } = category.metadata ?? {};

  if (typeof icon === "string") {
    return (
      <Icon
        small
        {...Icon.convertProps(icon)}
      />
    );
  }

  return null;
}

function Item(props: TreeItemProps) {
  return (
    <TreeItem classes={treeStyles} {...props}/>
  );
}

interface Dependencies {
  categories: IComputedValue<CatalogCategory[]>;
}

const NonInjectedCatalogMenu = observer(({ activeItem, categories, onItemClick }: CatalogMenuProps & Dependencies) => (
  // Overwrite Material UI styles with injectFirst https://material-ui.com/guides/interoperability/#controlling-priority-4
  <StylesProvider injectFirst>
    <div className="flex flex-col w-full">
      <div className={styles.catalog}>Catalog</div>
      <TreeView
        defaultExpanded={["catalog"]}
        defaultCollapseIcon={<Icon material="expand_more" />}
        defaultExpandIcon={<Icon material="chevron_right" />}
        selected={activeItem || "browse"}
      >
        <Item
          nodeId="browse"
          label="Browse"
          data-testid="*-tab"
          onClick={() => onItemClick("*")} />
        <Item
          nodeId="catalog"
          label={<div className={styles.parent}>Categories</div>}
          className={cssNames(styles.bordered)}
        >
          {categories.get().map(category => (
            <Item
              icon={getCategoryIcon(category)}
              key={category.getId()}
              nodeId={category.getId()}
              label={category.metadata.name}
              data-testid={`${category.getId()}-tab`}
              onClick={() => onItemClick(category.getId())} />
          ))}
        </Item>
      </TreeView>
    </div>
  </StylesProvider>
));

export const CatalogMenu = withInjectables<Dependencies, CatalogMenuProps>(NonInjectedCatalogMenu, {
  getProps: (di, props) => ({
    ...props,
    categories: di.inject(categoriesInjectable),
  }),
});
