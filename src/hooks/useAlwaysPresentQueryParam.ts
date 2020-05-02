import { QueryParamConfig } from 'serialize-query-params';
import { useQueryParam } from 'use-query-params';
import { useEffect } from 'react';

declare type NewValueType<D> = D | ((latestValue: D) => D);

export function useAlwaysPresentQueryParam<D>(
  name: string,
  defaultValue: NonNullable<D>,
  paramConfig?: QueryParamConfig<D>,
): [
  NonNullable<D>,
  (newValue: NewValueType<D>, updateType?: 'replace' | 'push' | 'replaceIn' | 'pushIn' | undefined) => void
] {
  const [queryParam, setQueryParam] = useQueryParam(name, paramConfig);

  useEffect(() => {
    if (queryParam == null) {
      setQueryParam(defaultValue, 'replaceIn');
    }
  }, [queryParam, setQueryParam, defaultValue]);

  return [queryParam ?? defaultValue, setQueryParam];
}
