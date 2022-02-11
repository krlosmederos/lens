/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import type { KubeResource } from "../../common/rbac";
import { castArray } from "lodash/fp";
import allowedResourcesInjectable from "../../renderer/clusters/allowed-resources.injectable";
import { asLegacyGlobalForExtensionApi } from "../di-legacy-globals/for-extension-api";
import replicaSetApiInjectable from "../../common/k8s-api/endpoints/replica-set.api.injectable";
import namespaceApiInjectable from "../../common/k8s-api/endpoints/namespace.api.injectable";
import statefulSetApiInjectable from "../../common/k8s-api/endpoints/stateful-set.api.injectable";
import daemonSetApiInjectable from "../../common/k8s-api/endpoints/daemon-set.api.injectable";
import deploymentApiInjectable from "../../common/k8s-api/endpoints/deployment.api.injectable";
import kubeEventApiInjectable from "../../common/k8s-api/endpoints/kube-event.api.injectable";
import jobApiInjectable from "../../common/k8s-api/endpoints/job.api.injectable";
import cronJobApiInjectable from "../../common/k8s-api/endpoints/cron-job.api.injectable";
import podApiInjectable from "../../common/k8s-api/endpoints/pod.api.injectable";

export * from "../common-api/k8s-api";

const allowedResources = asLegacyGlobalForExtensionApi(allowedResourcesInjectable);

export function isAllowedResource(resources: KubeResource | KubeResource[]) {
  return castArray(resources).every(resource => allowedResources.has(resource));
}

export const replicaSetApi = asLegacyGlobalForExtensionApi(replicaSetApiInjectable);
export const namespacesApi = asLegacyGlobalForExtensionApi(namespaceApiInjectable);
export const statefulSetApi = asLegacyGlobalForExtensionApi(statefulSetApiInjectable);
export const deploymentApi = asLegacyGlobalForExtensionApi(deploymentApiInjectable);
export const daemonSetApi = asLegacyGlobalForExtensionApi(daemonSetApiInjectable);
export const eventApi = asLegacyGlobalForExtensionApi(kubeEventApiInjectable);
export const jobApi = asLegacyGlobalForExtensionApi(jobApiInjectable);
export const cronJobApi = asLegacyGlobalForExtensionApi(cronJobApiInjectable);
export const podsApi = asLegacyGlobalForExtensionApi(podApiInjectable);

export {
  nodesApi,
  configMapApi,
  secretsApi,
  resourceQuotaApi,
  limitRangeApi,
  hpaApi,
  pdbApi,
  serviceApi,
  endpointApi,
  ingressApi,
  networkPolicyApi,
  persistentVolumeApi,
  pvcApi,
  storageClassApi,
  serviceAccountsApi,
  roleApi,
  roleBindingApi,
  clusterRoleApi,
  clusterRoleBindingApi,
  crdApi,
} from "../../common/k8s-api/endpoints";
export { KubeObjectStatusLevel } from "./kube-object-status";

// types
export type { KubeObjectStatus } from "./kube-object-status";

// stores
export type { KubeEventStore as EventStore } from "../../renderer/components/+events/store";
export type { PodStore as PodsStore } from "../../renderer/components/+workloads-pods/store";
export type { NodesStore } from "../../renderer/components/+nodes/nodes.store";
export type { DeploymentStore } from "../../renderer/components/+workloads-deployments/store";
export type { DaemonSetStore } from "../../renderer/components/+workloads-daemonsets/store";
export type { StatefulSetStore } from "../../renderer/components/+workloads-statefulsets/store";
export type { JobStore } from "../../renderer/components/+workloads-jobs/store";
export type { CronJobStore } from "../../renderer/components/+workloads-cronjobs/store";
export type { ConfigMapsStore } from "../../renderer/components/+config-maps/config-maps.store";
export type { SecretsStore } from "../../renderer/components/+config-secrets/secrets.store";
export type { ReplicaSetStore } from "../../renderer/components/+workloads-replicasets/replicasets.store";
export type { ResourceQuotasStore } from "../../renderer/components/+config-resource-quotas/resource-quotas.store";
export type { LimitRangesStore } from "../../renderer/components/+config-limit-ranges/limit-ranges.store";
export type { HPAStore } from "../../renderer/components/+config-autoscalers/hpa.store";
export type { PodDisruptionBudgetsStore } from "../../renderer/components/+config-pod-disruption-budgets/pod-disruption-budgets.store";
export type { ServiceStore } from "../../renderer/components/+network-services/services.store";
export type { EndpointStore } from "../../renderer/components/+network-endpoints/endpoints.store";
export type { IngressStore } from "../../renderer/components/+network-ingresses/ingress.store";
export type { NetworkPolicyStore } from "../../renderer/components/+network-policies/network-policy.store";
export type { PersistentVolumesStore } from "../../renderer/components/+storage-volumes/volumes.store";
export type { VolumeClaimStore } from "../../renderer/components/+storage-volume-claims/volume-claim.store";
export type { StorageClassStore } from "../../renderer/components/+storage-classes/storage-class.store";
export type { NamespaceStore } from "../../renderer/components/+namespaces/namespace-store/namespace.store";
export type { ServiceAccountsStore } from "../../renderer/components/+user-management/+service-accounts/store";
export type { RolesStore } from "../../renderer/components/+user-management/+roles/store";
export type { RoleBindingsStore } from "../../renderer/components/+user-management/+role-bindings/store";
export type { CRDStore } from "../../renderer/components/+custom-resources/crd.store";
export type { CRDResourceStore } from "../../renderer/components/+custom-resources/crd-resource.store";
