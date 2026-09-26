import { z } from 'zod';

// Zod schema define a 'data' filed in database depended on selected block type

export const heroBannerSchema = z.object({
  imageUrl: z.string().min(1, "Зображення обов'язкове"),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
});

export const horizontalSliderSchema = z.object({
  title: z.string().optional(),
  dealTypeFilter: z.enum(['ALL', 'RENT', 'SALE']).default('ALL'),
  limit: z.coerce.number().min(3).max(15).default(8),
});

export const itemGridSchema = z.object({
  title: z.string().optional(),
  dealTypeFilter: z.enum(['ALL', 'RENT', 'SALE']).default('ALL'),
  limit: z.coerce.number().min(4).max(10).default(6),
  seeAllLink: z.string().default('/'),
});

export const imageTextSchema = z.object({
  imageUrl: z.string().min(1),
  imagePosition: z.enum(['left', 'right']).default('left'),
  title: z.string().min(1),
  text: z.string().min(1),
});

export const BLOCK_REGISTRY = {
  HERO_BANNER: { schema: heroBannerSchema, label: 'Банер' },
  HORIZONTAL_SLIDER: { schema: horizontalSliderSchema, label: "Слайдер об'єктів" },
  ITEM_GRID: { schema: itemGridSchema, label: "Список об'єктів" },
  IMAGE_TEXT: { schema: imageTextSchema, label: 'Картинка + текст' },
} as const;

export type BlockTypeKey = keyof typeof BLOCK_REGISTRY;

// Виводить точний TS-тип `data` для кожного типу блоку з його Zod-схеми —
// один раз описав схему, тип автоматично узгоджений, дублювати вручну не треба
export type BlockData<T extends BlockTypeKey> = z.infer<(typeof BLOCK_REGISTRY)[T]['schema']>;