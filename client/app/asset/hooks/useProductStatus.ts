import { useMemo } from 'react';

type ProductStatus = 'active' | 'designed' | 'recommend';

export function useProductStatus(
  productSummary: unknown,
  simulationSummary: unknown,
): ProductStatus {
  return useMemo(() => {
    if (productSummary) return 'active';
    if (simulationSummary) return 'designed';
    return 'recommend';
  }, [productSummary, simulationSummary]);
}
