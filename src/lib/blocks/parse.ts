import { BLOCK_REGISTRY, type BlockTypeKey, type BlockData } from './registry';

export function parseBlockData<T extends BlockTypeKey>(type: T, rawData: unknown): BlockData<T> {
  const { schema } = BLOCK_REGISTRY[type];
  return schema.parse(rawData) as BlockData<T>;
}