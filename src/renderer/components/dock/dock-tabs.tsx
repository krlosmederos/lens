/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React, { Fragment, useRef, useEffect, useState, UIEvent } from "react";
import { Icon } from "../icon";
import { Tabs } from "../tabs/tabs";
import { DockTab } from "./dock-tab";
import type { DockTab as DockTabModel } from "./dock-store/dock.store";
import { TabKind } from "./dock-store/dock.store";
import { TerminalTab } from "./terminal-tab";

interface Props {
  tabs: DockTabModel[]
  autoFocus: boolean
  selectedTab: DockTabModel
  onChangeTab: (tab: DockTabModel) => void
}

export const DockTabs = ({ tabs, autoFocus, selectedTab, onChangeTab }: Props) => {
  const elem = useRef(null);
  const contentElem = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollStep = 200;

  const scrollToRight = (): void => {
    if(!elem) return;

    setScrollPosition(scrollPosition + scrollStep);

    elem.current.scrollLeft = scrollPosition;
  };


  const scrollToLeft = (): void => {
    if(!elem) return;

    setScrollPosition(scrollPosition - scrollStep);

    elem.current.scrollLeft = scrollPosition;
  };

  const  isScrollableRight = (): boolean => {
    if(!elem || !contentElem) return false;

    const containerWidth = elem.current?.clientWidth;
    const contentWidth = contentElem.current?.clientWidth;

    return contentWidth > containerWidth && scrollPosition < contentWidth - scrollStep;
  };

  const  isScrollableLeft = (): boolean => {
    if(!elem || !contentElem) return false;

    return scrollPosition > scrollStep;
  };

  const renderTab = (tab?: DockTabModel) => {
    if (!tab) {
      return null;
    }

    switch (tab.kind) {
      case TabKind.CREATE_RESOURCE:
      case TabKind.EDIT_RESOURCE:
        return <DockTab value={tab} icon="edit" />;
      case TabKind.INSTALL_CHART:
      case TabKind.UPGRADE_CHART:
        return <DockTab value={tab} icon={<Icon svg="install" />} />;
      case TabKind.POD_LOGS:
        return <DockTab value={tab} icon="subject" />;
      case TabKind.TERMINAL:
        return <TerminalTab value={tab} />;
    }
  };

  useEffect(() => {
    elem.current.addEventListener("scroll", ( evt: UIEvent<HTMLDivElement>) => {
      const position = evt.currentTarget.scrollLeft;

      if (position!== undefined) {
        setScrollPosition(position);
      }
    });
  }, []);

  return (
    <div style={{ overflow: "hidden" }} className={"flex gaps align-center"}>
      {isScrollableLeft() && (
        <Icon
          material="keyboard_arrow_left"
          tooltip="Show tabs to the left"
          onClick={scrollToLeft}
          className={"tab-control scroll-left"}
        />
      )}
      <div ref={elem} className={"tabs-control flex gaps align-center"}>
        <div ref={contentElem} className={"scrollable"}>
          <Tabs
            className="DockTabs"
            autoFocus={autoFocus}
            value={selectedTab}
            onChange={onChangeTab}
          >
            {tabs.map(tab => <Fragment key={tab.id}>{renderTab(tab)}</Fragment>)}
          </Tabs>
        </div>
      </div>
      {isScrollableRight() && (
        <Icon
          material="keyboard_arrow_right"
          tooltip="Show tabs to the right"
          onClick={scrollToRight}
          className={"tab-control scroll-right"}
        />
      )}
    </div>
  );
};
