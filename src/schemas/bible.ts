import { z } from 'zod'

export const verseSchema = z.object({
  verse: z.number().int().positive(),
  text: z.string().trim().min(1)
})

export const chapterSchema = z.object({
  version: z.enum(['BLIVRE', 'ACF', 'AA', 'NVI']),
  book: z.string().min(2),
  chapter: z.number().int().positive(),
  verses: z.array(verseSchema).min(1)
})

export const noteContentSchema = z
  .string()
  .trim()
  .min(1, 'Escreva alguma coisa antes de salvar.')
  .max(4000, 'A nota deve ter no máximo 4.000 caracteres.')
