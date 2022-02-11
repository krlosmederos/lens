/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import "./view.scss";

import React from "react";
import { action, IObservableValue, makeObservable, observable } from "mobx";
import { observer } from "mobx-react";

import { NamespaceSelect } from "../../../../+namespaces/namespace-select";
import { Dialog, DialogProps } from "../../../../dialog";
import { Input } from "../../../../input";
import { systemName } from "../../../../input/input_validators";
import { SubTitle } from "../../../../layout/sub-title";
import { Wizard, WizardStep } from "../../../../wizard";
import { serviceAccountsStore } from "../../store";
import type { ErrorNotification } from "../../../../notifications/error.injectable";
import { withInjectables } from "@ogre-tools/injectable-react";
import closeCreateServiceAccountDialogInjectable from "./close.injectable";
import errorNotificationInjectable from "../../../../notifications/error.injectable";
import createServiceAccountDialogStateInjectable from "./state.injectable";
import type { ShowDetails } from "../../../../kube-object/details/show.injectable";
import showDetailsInjectable from "../../../../kube-object/details/show.injectable";

export interface CreateServiceAccountDialogProps extends Omit<DialogProps, "isOpen" | "close"> {
}

interface Dependencies {
  isOpen: IObservableValue<boolean>;
  close: () => void;
  errorNotification: ErrorNotification;
  showDetails: ShowDetails;
}

@observer
class NonInjectedCreateServiceAccountDialog extends React.Component<CreateServiceAccountDialogProps & Dependencies> {
  @observable name = "";
  @observable namespace = "default";

  constructor(props: CreateServiceAccountDialogProps & Dependencies) {
    super(props);
    makeObservable(this);
  }

  reset = action(() => {
    this.name = "";
    this.namespace = "default";
  });

  createAccount = async () => {
    const { name, namespace } = this;
    const { showDetails, close, errorNotification } = this.props;

    try {
      showDetails(await serviceAccountsStore.create({ namespace, name }));
      close();
    } catch (err) {
      errorNotification(err);
    }
  };

  render() {
    const { ...dialogProps } = this.props;
    const { name, namespace } = this;
    const header = <h5>Create Service Account</h5>;

    return (
      <Dialog
        {...dialogProps}
        className="CreateServiceAccountDialog"
        isOpen={this.props.isOpen.get()}
        close={this.props.close}
        onClose={this.reset}
      >
        <Wizard header={header} done={this.props.close}>
          <WizardStep nextLabel="Create" next={this.createAccount}>
            <SubTitle title="Account Name" />
            <Input
              autoFocus
              required
              placeholder="Enter a name"
              trim
              validators={systemName}
              value={name} onChange={v => this.name = v.toLowerCase()}
            />
            <SubTitle title="Namespace" />
            <NamespaceSelect
              themeName="light"
              value={namespace}
              onChange={({ value }) => this.namespace = value}
            />
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}

export const CreateServiceAccountDialog = withInjectables<Dependencies, CreateServiceAccountDialogProps>(NonInjectedCreateServiceAccountDialog, {
  getProps: (di, props) => ({
    ...props,
    close: di.inject(closeCreateServiceAccountDialogInjectable),
    errorNotification: di.inject(errorNotificationInjectable),
    isOpen: di.inject(createServiceAccountDialogStateInjectable),
    showDetails: di.inject(showDetailsInjectable),
  }),
});
