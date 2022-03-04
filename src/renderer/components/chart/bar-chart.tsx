/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import React from "react";
import merge from "lodash/merge";
import moment from "moment";
import Color from "color";
import { observer } from "mobx-react";
import type { ChartData, ChartOptions, ChartTooltipItem, Scriptable } from "chart.js";
import { Chart, ChartKind, ChartProps } from "./chart";
import { cssNames } from "../../utils";
import { ZebraStripes } from "./zebra-stripes.plugin";
import { NoMetrics } from "../resource-metrics/no-metrics";
import { withInjectables } from "@ogre-tools/injectable-react";
import activeThemeInjectable, { ActiveTheme } from "../../themes/active.injectable";

export interface BarChartProps extends ChartProps {
  name?: string;
  timeLabelStep?: number;  // Minute labels appearance step
}

interface Dependencies {
  activeTheme: ActiveTheme;
}

const NonInjectedBarChart = observer(({
  activeTheme,
  name,
  data: { datasets = [], ...data } = {},
  className,
  timeLabelStep = 10,
  plugins = [ZebraStripes],
  options,
  ...settings
}: Dependencies & BarChartProps) => {
  const { textColorPrimary, borderFaintColor, chartStripesColor } = activeTheme.value.colors;

  const getBarColor: Scriptable<string> = ({ dataset }) => {
    const color = dataset.borderColor;

    return Color(color).alpha(0.2).string();
  };

  // Remove empty sets and insert default data
  const chartData: ChartData = {
    ...data,
    datasets: datasets
      .filter(set => set.data.length)
      .map(item => ({
        type: ChartKind.BAR,
        borderWidth: { top: 3 },
        barPercentage: 1,
        categoryPercentage: 1,
        ...item,
      })),
  };

  if (chartData.datasets.length == 0) {
    return <NoMetrics/>;
  }

  const formatTimeLabels = (timestamp: string, index: number) => {
    const label = moment(parseInt(timestamp)).format("HH:mm");
    const offset = "     ";

    if (index == 0) return offset + label;
    if (index == 60) return label + offset;

    return index % timeLabelStep == 0 ? label : "";
  };

  const barOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [{
        type: "time",
        offset: true,
        gridLines: {
          display: false,
        },
        stacked: true,
        ticks: {
          callback: formatTimeLabels,
          autoSkip: false,
          source: "data",
          backdropColor: "white",
          fontColor: textColorPrimary,
          fontSize: 11,
          maxRotation: 0,
          minRotation: 0,
        },
        bounds: "data",
        time: {
          unit: "minute",
          displayFormats: {
            minute: "x",
          },
          parser: timestamp => moment.unix(parseInt(timestamp)),
        },
      }],
      yAxes: [{
        position: "right",
        gridLines: {
          color: borderFaintColor,
          drawBorder: false,
          tickMarkLength: 0,
          zeroLineWidth: 0,
        },
        ticks: {
          maxTicksLimit: 6,
          fontColor: textColorPrimary,
          fontSize: 11,
          padding: 8,
          min: 0,
        },
      }],
    },
    tooltips: {
      mode: "index",
      position: "cursor",
      callbacks: {
        title([tooltip]: ChartTooltipItem[]) {
          const xLabel = tooltip?.xLabel;
          const skipLabel = xLabel == null || new Date(xLabel).getTime() > Date.now();

          if (skipLabel) return "";

          return String(xLabel);
        },
        labelColor: ({ datasetIndex }) => {
          return {
            borderColor: "darkgray",
            backgroundColor: chartData.datasets[datasetIndex].borderColor as string,
          };
        },
      },
    },
    animation: {
      duration: 0,
    },
    elements: {
      rectangle: {
        backgroundColor: getBarColor.bind(null),
      },
    },
    plugins: {
      ZebraStripes: {
        stripeColor: chartStripesColor,
        interval: chartData.datasets[0].data.length,
      },
    },
  };

  return (
    <Chart
      className={cssNames("BarChart flex box grow column", className)}
      type={ChartKind.BAR}
      data={chartData}
      options={merge(barOptions, options)}
      plugins={plugins}
      {...settings}
    />
  );
});

export const BarChart = withInjectables<Dependencies, BarChartProps>(NonInjectedBarChart, {
  getProps: (di, props) => ({
    ...props,
    activeTheme: di.inject(activeThemeInjectable),
  }),
});
