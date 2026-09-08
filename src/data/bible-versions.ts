import type { BibleVersion } from '@/types/bible'

const thiagobodrukAttribution =
  'Traduções bíblicas de autoria e propriedade intelectual da Sociedade Bíblica Internacional (NVI), da Sociedade Bíblica Trinitariana (ACF) e da Imprensa Bíblica Brasileira (AA). Todos os direitos reservados aos autores.'

export const bibleVersions = [
  {
    id: 'blivre',
    name: 'Bíblia Livre',
    abbreviation: 'BLIVRE',
    language: 'pt-BR',
    license: 'CC BY 3.0 BR',
    attribution: 'Bíblia Livre © Diego Santos, Mario Sérgio e Marco Teles — fevereiro de 2018.'
  },
  {
    id: 'acf',
    name: 'Almeida Corrigida e Fiel',
    abbreviation: 'ACF',
    language: 'pt-BR',
    license: 'CC BY-NC (uso não comercial)',
    attribution: thiagobodrukAttribution
  },
  {
    id: 'aa',
    name: 'Almeida Revisada Imprensa Bíblica',
    abbreviation: 'AA',
    language: 'pt-BR',
    license: 'CC BY-NC (uso não comercial)',
    attribution: thiagobodrukAttribution
  },
  {
    id: 'nvi',
    name: 'Nova Versão Internacional',
    abbreviation: 'NVI',
    language: 'pt-BR',
    license: 'CC BY-NC (uso não comercial)',
    attribution: thiagobodrukAttribution
  }
] as const satisfies readonly BibleVersion[]
