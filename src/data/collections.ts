import type { ShoppingCollection } from '@/domain/types'

export const collections: readonly ShoppingCollection[] = [
  {
    title: 'Sugestões para a cozinha',
    slug: 'sugestoes-cozinha',
    categoryId: 'cozinha',
    description: 'Uma seleção demonstrativa de presentes úteis para a cozinha.',
    url: 'https://colecao.example.invalid/sugestoes-cozinha',
  },
  {
    title: 'Sugestões para o banheiro',
    slug: 'sugestoes-banheiro',
    categoryId: 'banheiro',
    description: 'Uma seleção demonstrativa de presentes para o banheiro.',
    url: 'https://colecao.example.invalid/sugestoes-banheiro',
  },
]
