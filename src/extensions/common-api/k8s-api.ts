/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

// This is the common k8s API between main and renderer. Currently it is exported there

import { KubeJsonApi as _KubeJsonApi } from "../../common/k8s-api/kube-json-api";
import { kubeJsonApiForClusterInjectionToken } from "../../common/k8s-api/kube-json-api-for-cluster.token";
import createResourceStackInjectable from "../../common/k8s/create-resource-stack.injectable";
import type { KubernetesCluster } from "./catalog";
import type { ResourceStack as _ResourceStack, ResourceApplingStack } from "../../common/k8s/resource-stack";
import { asLegacyGlobalForExtensionApi } from "../di-legacy-globals/for-extension-api";
import kubeApiForClusterInjectable from "../../common/k8s-api/kube-api-for-cluster.injectable";

export const KubeJsonApi = Object.assign(_KubeJsonApi, {
  forCluster: asLegacyGlobalForExtensionApi(kubeJsonApiForClusterInjectionToken),
});

const createResourceStack = asLegacyGlobalForExtensionApi(createResourceStackInjectable);

export class ResourceStack implements ResourceApplingStack {
  #inner: _ResourceStack;

  constructor(cluster: KubernetesCluster, name: string) {
    this.#inner = createResourceStack(cluster, name);
  }

  kubectlApplyFolder(folderPath: string, templateContext?: any, extraArgs?: string[]): Promise<string> {
    return this.#inner.kubectlApplyFolder(folderPath, templateContext, extraArgs);
  }

  kubectlDeleteFolder(folderPath: string, templateContext?: any, extraArgs?: string[]): Promise<string> {
    return this.#inner.kubectlDeleteFolder(folderPath, templateContext, extraArgs);
  }
}

export const forCluster = asLegacyGlobalForExtensionApi(kubeApiForClusterInjectable);

export { apiManager } from "../../common/k8s-api/api-manager";
export { KubeApi, forRemoteCluster } from "../../common/k8s-api/kube-api";
export { KubeObject, KubeStatus } from "../../common/k8s-api/kube-object";
export { KubeObjectStore } from "../../common/k8s-api/kube-object.store";
export { Pod, PodApi as PodsApi } from "../../common/k8s-api/endpoints/pod.api";
export { Node, NodeApi as NodesApi } from "../../common/k8s-api/endpoints/nodes.api";
export { Deployment, DeploymentApi } from "../../common/k8s-api/endpoints/deployment.api";
export { DaemonSet, DaemonSetApi } from "../../common/k8s-api/endpoints/daemon-set.api";
export { StatefulSet, StatefulSetApi } from "../../common/k8s-api/endpoints/stateful-set.api";
export { Job, JobApi } from "../../common/k8s-api/endpoints/job.api";
export { CronJob, CronJobApi } from "../../common/k8s-api/endpoints/cron-job.api";
export { ConfigMap, ConfigMapApi } from "../../common/k8s-api/endpoints/configmap.api";
export { Secret, SecretsApi } from "../../common/k8s-api/endpoints/secret.api";
export { ReplicaSet, ReplicaSetApi } from "../../common/k8s-api/endpoints/replica-set.api";
export { ResourceQuota, ResourceQuotaApi } from "../../common/k8s-api/endpoints/resource-quota.api";
export { LimitRange, LimitRangeApi } from "../../common/k8s-api/endpoints/limit-range.api";
export { HorizontalPodAutoscaler, HorizontalPodAutoscalerApi } from "../../common/k8s-api/endpoints/hpa.api";
export { PodDisruptionBudget, PodDisruptionBudgetApi } from "../../common/k8s-api/endpoints/poddisruptionbudget.api";
export { Service, ServiceApi } from "../../common/k8s-api/endpoints/service.api";
export { Endpoint, EndpointApi } from "../../common/k8s-api/endpoints/endpoint.api";
export { Ingress, IngressApi } from "../../common/k8s-api/endpoints/ingress.api";
export { NetworkPolicy, NetworkPolicyApi } from "../../common/k8s-api/endpoints/network-policy.api";
export { PersistentVolume, PersistentVolumeApi } from "../../common/k8s-api/endpoints/persistent-volume.api";
export { PersistentVolumeClaim, PersistentVolumeClaimsApi } from "../../common/k8s-api/endpoints/persistent-volume-claims.api";
export { StorageClass, StorageClassApi } from "../../common/k8s-api/endpoints/storage-class.api";
export { Namespace, NamespaceApi } from "../../common/k8s-api/endpoints/namespace.api";
export { KubeEvent, KubeEventApi } from "../../common/k8s-api/endpoints/kube-event.api";
export { ServiceAccount, ServiceAccountApi } from "../../common/k8s-api/endpoints/service-accounts.api";
export { Role, RoleApi } from "../../common/k8s-api/endpoints/role.api";
export { RoleBinding, RoleBindingApi } from "../../common/k8s-api/endpoints/role-binding.api";
export { ClusterRole, ClusterRoleApi } from "../../common/k8s-api/endpoints/cluster-role.api";
export { ClusterRoleBinding, ClusterRoleBindingApi } from "../../common/k8s-api/endpoints/cluster-role-binding.api";
export { CustomResourceDefinition, CustomResourceDefinitionApi } from "../../common/k8s-api/endpoints/crd.api";

// types
export type { ILocalKubeApiConfig, IRemoteKubeApiConfig, IKubeApiCluster } from "../../common/k8s-api/kube-api";
export type { IPodContainer, IPodContainerStatus } from "../../common/k8s-api/endpoints/pod.api";
export type { ISecretRef } from "../../common/k8s-api/endpoints/secret.api";
export type { KubeObjectMetadata, KubeStatusData } from "../../common/k8s-api/kube-object";
export type { KubeObjectStoreLoadAllParams, KubeObjectStoreLoadingParams, KubeObjectStoreSubscribeParams } from "../../common/k8s-api/kube-object.store";
