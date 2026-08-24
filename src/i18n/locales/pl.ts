export const pl = {
  common: {
    distance: 'dystans',
    runner: 'biegacz',
    car: 'samochód',
    time: 'czas',
    delay: 'opóźnienie startu',
    netTime: 'czas netto',
    grossTime: 'czas brutto',
  },

  chart: {
    optimalRun: {
      header: 'dystans biegacza i auta',
    },
    startDelay: {
      header: 'opóźnienie startu a przebiegnięty dystans',
    },
  },

  form: {
    distance: 'dystans zawodów',
    atLeast: 'i więcej',
    atMost: 'do',
    result: 'wynik na zawodach',
    canRun: 'bez problemu jestem w stanie przebiec',
    delay: 'opóźnienie startu na Wings For Life',
    calculate: 'oblicz',
    halfmarathon: 'półmaraton',
    marathon: 'maraton',

    validation: {
      required: 'To pole jest wymagane',
      invalid_number: 'Wpisz liczbę',
      invalid_type: 'Nieprawidłowy typ danych',
      default_error: 'Wprowadzona wartość jest nieprawidłowa',
      too_small_number: 'Wartość nie może być mniejsza niż {val}',
      too_big_number: 'Wartość nie może być większa niż {val}',
      distance_positive: 'Dystans referencyjny musi być większy niż 0 km',
      hours_min: 'Godziny nie mogą być ujemne',
      delay_min: 'Opóźnienie nie może być ujemne',
      time_min: 'Czas referencyjny musi być większy od {val}',
      distance_min: 'Dystans musi być większy niż {val} km',
      unrealistic_pace: 'Nie ściemniaj XD',

      distance_number: 'Dystans musi być liczbą',
      delay_number: 'Opóźnienie musi być liczbą',

      hours_int: 'Godziny muszą być liczbą całkowitą',
      minutes_int: 'Minuty muszą być liczbą całkowitą',
      seconds_int: 'Sekundy muszą być liczbą całkowitą',
    },
  },

  intro: {
    title: 'Kalkulator Optymalnego Biegu',
    instruction:
      'Podaj swój wynik z ostatnich zawodów lub tempo runa, aby oszacować realny cel tempa na zawody Wings for Life.',
    explanation:
      'Model matematyczny oparty na wzorach Riegla wyliczy Twoje możliwości i porówna je ze schematem poruszania się samochodu pościgowego - jednocześnie optymaliząc tempo pod kątem osiągnięcia przez Ciebie najdłuższego przebiegniętego dystansu.',
  },

  result: {
    header: 'Wynik obliczeń optymalnego biegu',
    avgPace: 'średnie tempo',
    return: 'wróć do formularza',
  },

  pageTitle: 'Wings For Life - Kalkulator Optymalnego Tempa',
}
