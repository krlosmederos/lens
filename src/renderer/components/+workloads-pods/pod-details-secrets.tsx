/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./pod-details-secrets.scss";

import React, { Component } from "react";
import { autorun, observable, makeObservable } from "mobx";
import { disposeOnUnmount, observer } from "mobx-react";
import { Pod, Secret, secretsApi } from "../../../common/k8s-api/endpoints";
import type { ShowDetails } from "../kube-object/details/show.injectable";
import { withInjectables } from "@ogre-tools/injectable-react";
import { prevDefault } from "../../utils";
import showDetailsInjectable from "../kube-object/details/show.injectable";

export interface PodDetailsSecretsProps {
  pod: Pod;
}

interface Dependencies {
  showDetails: ShowDetails;
}

@observer
class NonInjectedPodDetailsSecrets extends Component<PodDetailsSecretsProps & Dependencies> {
  @observable secrets: Map<string, Secret> = observable.map<string, Secret>();

  componentDidMount(): void {
    disposeOnUnmount(this, [
      autorun(async () => {
        const { pod } = this.props;

        const secrets = await Promise.all(
          pod.getSecrets().map(secretName => secretsApi.get({
            name: secretName,
            namespace: pod.getNs(),
          })),
        );

        secrets.forEach(secret => secret && this.secrets.set(secret.getName(), secret));
      }),
    ]);
  }

  constructor(props: PodDetailsSecretsProps & Dependencies) {
    super(props);
    makeObservable(this);
  }

  render() {
    const { pod, showDetails } = this.props;

    return (
      <div className="PodDetailsSecrets">
        {
          pod.getSecrets()
            .map(secretName => {
              const secret = this.secrets.get(secretName);

              return secret
                ? (
                  <a onClick={prevDefault(() => showDetails(secret))}>
                    {secretName}
                  </a>
                )
                : (
                  <span key={secretName}>
                    {secretName}
                  </span>
                );
            })
        }
      </div>
    );
  }
}

export const PodDetailsSecrets = withInjectables<Dependencies, PodDetailsSecretsProps>(NonInjectedPodDetailsSecrets, {
  getProps: (di, props) => ({
    ...props,
    showDetails: di.inject(showDetailsInjectable),
  }),
});
