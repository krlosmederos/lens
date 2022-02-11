/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */

import type { IMapEntry, ObservableMap } from "mobx";

/**
 * An N length tuple of T
 */
export type Tuple<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;

/**
 * A readonly enhanced replacement for an observable map type
 */
export interface ReadonlyObservableMap<K, V> extends ObservableMap<K, V> {
  has(key: K): boolean;
  get(key: K): Readonly<V> | undefined;
  keys(): IterableIterator<K>;
  values(): IterableIterator<Readonly<V>>;
  entries(): IterableIterator<IMapEntry<K, Readonly<V>>>;
  readonly size: number;
  toJSON(): [K, V][];
  [Symbol.iterator](): IterableIterator<IMapEntry<K, Readonly<V>>>;

  /**
   * @deprecated Do not modify this type
   */
  set(key: K, value: V): this;

  /**
   * @deprecated Do not modify this type
   */
  delete(key: K): boolean;

  /**
   * @deprecated Do not modify this type
   */
  clear(): void;
}
