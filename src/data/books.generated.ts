import type { BibleBook } from '@/types/bible'

export const bibleBooks = [
  {
    "id": "GEN",
    "slug": "genesis",
    "order": 1,
    "name": "Gênesis",
    "abbreviation": "Gn",
    "testament": "old",
    "chapters": 50
  },
  {
    "id": "EXO",
    "slug": "exodo",
    "order": 2,
    "name": "Êxodo",
    "abbreviation": "Êx",
    "testament": "old",
    "chapters": 40
  },
  {
    "id": "LEV",
    "slug": "levitico",
    "order": 3,
    "name": "Levítico",
    "abbreviation": "Lv",
    "testament": "old",
    "chapters": 27
  },
  {
    "id": "NUM",
    "slug": "numeros",
    "order": 4,
    "name": "Números",
    "abbreviation": "Nm",
    "testament": "old",
    "chapters": 36
  },
  {
    "id": "DEU",
    "slug": "deuteronomio",
    "order": 5,
    "name": "Deuteronômio",
    "abbreviation": "Dt",
    "testament": "old",
    "chapters": 34
  },
  {
    "id": "JOS",
    "slug": "josue",
    "order": 6,
    "name": "Josué",
    "abbreviation": "Js",
    "testament": "old",
    "chapters": 24
  },
  {
    "id": "JDG",
    "slug": "juizes",
    "order": 7,
    "name": "Juízes",
    "abbreviation": "Jz",
    "testament": "old",
    "chapters": 21
  },
  {
    "id": "RUT",
    "slug": "rute",
    "order": 8,
    "name": "Rute",
    "abbreviation": "Rt",
    "testament": "old",
    "chapters": 4
  },
  {
    "id": "1SA",
    "slug": "1-samuel",
    "order": 9,
    "name": "1 Samuel",
    "abbreviation": "1Sm",
    "testament": "old",
    "chapters": 31
  },
  {
    "id": "2SA",
    "slug": "2-samuel",
    "order": 10,
    "name": "2 Samuel",
    "abbreviation": "2Sm",
    "testament": "old",
    "chapters": 24
  },
  {
    "id": "1KI",
    "slug": "1-reis",
    "order": 11,
    "name": "1 Reis",
    "abbreviation": "1Rs",
    "testament": "old",
    "chapters": 22
  },
  {
    "id": "2KI",
    "slug": "2-reis",
    "order": 12,
    "name": "2 Reis",
    "abbreviation": "2Rs",
    "testament": "old",
    "chapters": 25
  },
  {
    "id": "1CH",
    "slug": "1-cronicas",
    "order": 13,
    "name": "1 Crônicas",
    "abbreviation": "1Cr",
    "testament": "old",
    "chapters": 29
  },
  {
    "id": "2CH",
    "slug": "2-cronicas",
    "order": 14,
    "name": "2 Crônicas",
    "abbreviation": "2Cr",
    "testament": "old",
    "chapters": 36
  },
  {
    "id": "EZR",
    "slug": "esdras",
    "order": 15,
    "name": "Esdras",
    "abbreviation": "Ed",
    "testament": "old",
    "chapters": 10
  },
  {
    "id": "NEH",
    "slug": "neemias",
    "order": 16,
    "name": "Neemias",
    "abbreviation": "Ne",
    "testament": "old",
    "chapters": 13
  },
  {
    "id": "EST",
    "slug": "ester",
    "order": 17,
    "name": "Ester",
    "abbreviation": "Et",
    "testament": "old",
    "chapters": 10
  },
  {
    "id": "JOB",
    "slug": "jo",
    "order": 18,
    "name": "Jó",
    "abbreviation": "Jó",
    "testament": "old",
    "chapters": 42
  },
  {
    "id": "PSA",
    "slug": "salmos",
    "order": 19,
    "name": "Salmos",
    "abbreviation": "Sl",
    "testament": "old",
    "chapters": 150
  },
  {
    "id": "PRO",
    "slug": "proverbios",
    "order": 20,
    "name": "Provérbios",
    "abbreviation": "Pv",
    "testament": "old",
    "chapters": 31
  },
  {
    "id": "ECC",
    "slug": "eclesiastes",
    "order": 21,
    "name": "Eclesiastes",
    "abbreviation": "Ec",
    "testament": "old",
    "chapters": 12
  },
  {
    "id": "SNG",
    "slug": "cantico-dos-canticos",
    "order": 22,
    "name": "Cântico dos Cânticos",
    "abbreviation": "Ct",
    "testament": "old",
    "chapters": 8
  },
  {
    "id": "ISA",
    "slug": "isaias",
    "order": 23,
    "name": "Isaías",
    "abbreviation": "Is",
    "testament": "old",
    "chapters": 66
  },
  {
    "id": "JER",
    "slug": "jeremias",
    "order": 24,
    "name": "Jeremias",
    "abbreviation": "Jr",
    "testament": "old",
    "chapters": 52
  },
  {
    "id": "LAM",
    "slug": "lamentacoes",
    "order": 25,
    "name": "Lamentações",
    "abbreviation": "Lm",
    "testament": "old",
    "chapters": 5
  },
  {
    "id": "EZK",
    "slug": "ezequiel",
    "order": 26,
    "name": "Ezequiel",
    "abbreviation": "Ez",
    "testament": "old",
    "chapters": 48
  },
  {
    "id": "DAN",
    "slug": "daniel",
    "order": 27,
    "name": "Daniel",
    "abbreviation": "Dn",
    "testament": "old",
    "chapters": 12
  },
  {
    "id": "HOS",
    "slug": "oseias",
    "order": 28,
    "name": "Oseias",
    "abbreviation": "Os",
    "testament": "old",
    "chapters": 14
  },
  {
    "id": "JOL",
    "slug": "joel",
    "order": 29,
    "name": "Joel",
    "abbreviation": "Jl",
    "testament": "old",
    "chapters": 3
  },
  {
    "id": "AMO",
    "slug": "amos",
    "order": 30,
    "name": "Amós",
    "abbreviation": "Am",
    "testament": "old",
    "chapters": 9
  },
  {
    "id": "OBA",
    "slug": "obadias",
    "order": 31,
    "name": "Obadias",
    "abbreviation": "Ob",
    "testament": "old",
    "chapters": 1
  },
  {
    "id": "JON",
    "slug": "jonas",
    "order": 32,
    "name": "Jonas",
    "abbreviation": "Jn",
    "testament": "old",
    "chapters": 4
  },
  {
    "id": "MIC",
    "slug": "miqueias",
    "order": 33,
    "name": "Miqueias",
    "abbreviation": "Mq",
    "testament": "old",
    "chapters": 7
  },
  {
    "id": "NAM",
    "slug": "naum",
    "order": 34,
    "name": "Naum",
    "abbreviation": "Na",
    "testament": "old",
    "chapters": 3
  },
  {
    "id": "HAB",
    "slug": "habacuque",
    "order": 35,
    "name": "Habacuque",
    "abbreviation": "Hc",
    "testament": "old",
    "chapters": 3
  },
  {
    "id": "ZEP",
    "slug": "sofonias",
    "order": 36,
    "name": "Sofonias",
    "abbreviation": "Sf",
    "testament": "old",
    "chapters": 3
  },
  {
    "id": "HAG",
    "slug": "ageu",
    "order": 37,
    "name": "Ageu",
    "abbreviation": "Ag",
    "testament": "old",
    "chapters": 2
  },
  {
    "id": "ZEC",
    "slug": "zacarias",
    "order": 38,
    "name": "Zacarias",
    "abbreviation": "Zc",
    "testament": "old",
    "chapters": 14
  },
  {
    "id": "MAL",
    "slug": "malaquias",
    "order": 39,
    "name": "Malaquias",
    "abbreviation": "Ml",
    "testament": "old",
    "chapters": 4
  },
  {
    "id": "MAT",
    "slug": "mateus",
    "order": 40,
    "name": "Mateus",
    "abbreviation": "Mt",
    "testament": "new",
    "chapters": 28
  },
  {
    "id": "MRK",
    "slug": "marcos",
    "order": 41,
    "name": "Marcos",
    "abbreviation": "Mc",
    "testament": "new",
    "chapters": 16
  },
  {
    "id": "LUK",
    "slug": "lucas",
    "order": 42,
    "name": "Lucas",
    "abbreviation": "Lc",
    "testament": "new",
    "chapters": 24
  },
  {
    "id": "JHN",
    "slug": "joao",
    "order": 43,
    "name": "João",
    "abbreviation": "Jo",
    "testament": "new",
    "chapters": 21
  },
  {
    "id": "ACT",
    "slug": "atos",
    "order": 44,
    "name": "Atos",
    "abbreviation": "At",
    "testament": "new",
    "chapters": 28
  },
  {
    "id": "ROM",
    "slug": "romanos",
    "order": 45,
    "name": "Romanos",
    "abbreviation": "Rm",
    "testament": "new",
    "chapters": 16
  },
  {
    "id": "1CO",
    "slug": "1-corintios",
    "order": 46,
    "name": "1 Coríntios",
    "abbreviation": "1Co",
    "testament": "new",
    "chapters": 16
  },
  {
    "id": "2CO",
    "slug": "2-corintios",
    "order": 47,
    "name": "2 Coríntios",
    "abbreviation": "2Co",
    "testament": "new",
    "chapters": 13
  },
  {
    "id": "GAL",
    "slug": "galatas",
    "order": 48,
    "name": "Gálatas",
    "abbreviation": "Gl",
    "testament": "new",
    "chapters": 6
  },
  {
    "id": "EPH",
    "slug": "efesios",
    "order": 49,
    "name": "Efésios",
    "abbreviation": "Ef",
    "testament": "new",
    "chapters": 6
  },
  {
    "id": "PHP",
    "slug": "filipenses",
    "order": 50,
    "name": "Filipenses",
    "abbreviation": "Fp",
    "testament": "new",
    "chapters": 4
  },
  {
    "id": "COL",
    "slug": "colossenses",
    "order": 51,
    "name": "Colossenses",
    "abbreviation": "Cl",
    "testament": "new",
    "chapters": 4
  },
  {
    "id": "1TH",
    "slug": "1-tessalonicenses",
    "order": 52,
    "name": "1 Tessalonicenses",
    "abbreviation": "1Ts",
    "testament": "new",
    "chapters": 5
  },
  {
    "id": "2TH",
    "slug": "2-tessalonicenses",
    "order": 53,
    "name": "2 Tessalonicenses",
    "abbreviation": "2Ts",
    "testament": "new",
    "chapters": 3
  },
  {
    "id": "1TI",
    "slug": "1-timoteo",
    "order": 54,
    "name": "1 Timóteo",
    "abbreviation": "1Tm",
    "testament": "new",
    "chapters": 6
  },
  {
    "id": "2TI",
    "slug": "2-timoteo",
    "order": 55,
    "name": "2 Timóteo",
    "abbreviation": "2Tm",
    "testament": "new",
    "chapters": 4
  },
  {
    "id": "TIT",
    "slug": "tito",
    "order": 56,
    "name": "Tito",
    "abbreviation": "Tt",
    "testament": "new",
    "chapters": 3
  },
  {
    "id": "PHM",
    "slug": "filemom",
    "order": 57,
    "name": "Filemom",
    "abbreviation": "Fm",
    "testament": "new",
    "chapters": 1
  },
  {
    "id": "HEB",
    "slug": "hebreus",
    "order": 58,
    "name": "Hebreus",
    "abbreviation": "Hb",
    "testament": "new",
    "chapters": 13
  },
  {
    "id": "JAS",
    "slug": "tiago",
    "order": 59,
    "name": "Tiago",
    "abbreviation": "Tg",
    "testament": "new",
    "chapters": 5
  },
  {
    "id": "1PE",
    "slug": "1-pedro",
    "order": 60,
    "name": "1 Pedro",
    "abbreviation": "1Pe",
    "testament": "new",
    "chapters": 5
  },
  {
    "id": "2PE",
    "slug": "2-pedro",
    "order": 61,
    "name": "2 Pedro",
    "abbreviation": "2Pe",
    "testament": "new",
    "chapters": 3
  },
  {
    "id": "1JN",
    "slug": "1-joao",
    "order": 62,
    "name": "1 João",
    "abbreviation": "1Jo",
    "testament": "new",
    "chapters": 5
  },
  {
    "id": "2JN",
    "slug": "2-joao",
    "order": 63,
    "name": "2 João",
    "abbreviation": "2Jo",
    "testament": "new",
    "chapters": 1
  },
  {
    "id": "3JN",
    "slug": "3-joao",
    "order": 64,
    "name": "3 João",
    "abbreviation": "3Jo",
    "testament": "new",
    "chapters": 1
  },
  {
    "id": "JUD",
    "slug": "judas",
    "order": 65,
    "name": "Judas",
    "abbreviation": "Jd",
    "testament": "new",
    "chapters": 1
  },
  {
    "id": "REV",
    "slug": "apocalipse",
    "order": 66,
    "name": "Apocalipse",
    "abbreviation": "Ap",
    "testament": "new",
    "chapters": 22
  }
] as const satisfies readonly BibleBook[]
