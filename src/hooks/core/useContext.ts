import {
  inject,
  InjectionKey,
  provide,
  reactive,
  readonly as defineReadonly,
  ShallowUnwrapRef,
} from 'vue';

export interface CreateContextOptions {
  readonly?: boolean;
  // createProvider?:boolean;
  native?: boolean;
}

export function createContext<T>(
  context: any,
  key: InjectionKey<T> = Symbol()
  // options: CreateContextOptions = {}
) {
  // const { readonly = true, native = true } = options;
  // const state = reactive(context);
  // const provideData = readonly ? defineReadonly(state) : state;
  provide(key, context);
}

export function useContext<T>(key: InjectionKey<T>, native?: boolean): T;
export function useContext<T>(key: InjectionKey<T>, defaultValue?: any, native?: boolean): T;

export function useContext<T>(
  key: InjectionKey<T> = Symbol(),
  defaultValue?: any
): ShallowUnwrapRef<T> {
  return inject(key, defaultValue || {});
}
