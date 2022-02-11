/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import jobStoreInjectable from "../+workloads-jobs/store.injectable";
import apiManagerInjectable from "../../../common/k8s-api/api-manager.injectable";
import cronJobApiInjectable from "../../../common/k8s-api/endpoints/cron-job.api.injectable";
import createStoresAndApisInjectable from "../../vars/is-cluster-page-context.injectable";
import { CronJobStore } from "./store";

const cronJobStoreInjectable = getInjectable({
  id: "cron-job-store",
  instantiate: (di) => {
    const makeStore = di.inject(createStoresAndApisInjectable);

    if (!makeStore) {
      return undefined;
    }

    const apiManager = di.inject(apiManagerInjectable);
    const api = di.inject(cronJobApiInjectable);
    const store = new CronJobStore({
      jobStore: di.inject(jobStoreInjectable),
    }, api);

    apiManager.registerStore(store);

    return store;
  },
});

export default cronJobStoreInjectable;
