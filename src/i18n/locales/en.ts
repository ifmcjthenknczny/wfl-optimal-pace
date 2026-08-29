export const en = {
  common: {
    distance: 'distance',
    runner: 'runner',
    car: 'car',
    time: 'time',
    delay: 'start delay',
    netTime: 'net time',
    grossTime: 'gross time',
  },

  chart: {
    optimalRun: {
      header: 'runner and car distance',
    },
    startDelay: {
      header: 'start delay and distance run',
    },
  },

  form: {
    distance: 'competition distance',
    atLeast: 'and more',
    atMost: 'up to',
    result: 'competition result',
    canRun: 'I can run without any problem',
    delay: 'start delay at Wings For Life',
    calculate: 'calculate',
    halfmarathon: 'halfmarathon',
    marathon: 'marathon',

    validation: {
      required: 'This field is required',
      invalid_number: 'Enter a valid number',
      invalid_type: 'Invalid data type',
      default_error: 'The entered value is invalid',
      too_small_number: 'Value cannot be less than {val}',
      too_big_number: 'Value cannot be greater than {val}',
      distance_positive: 'Distance must be greater than 0 km',
      hours_min: 'Hours cannot be negative',
      delay_min: 'Delay cannot be negative',
      time_min: 'Reference time must be greater than {val}',
      distance_min: 'Reference distance must be greater than {val} km',
      unrealistic_pace: "Don't bullshit me XD",

      distance_number: 'Distance must be a number',
      delay_number: 'Start delay must be a number',

      hours_int: 'Hours must be an integer',
      minutes_int: 'Minutes must be an integer',
      seconds_int: 'Seconds must be an integer',
    },
  },

  intro: {
    title: 'Pace goal calculator',
    instruction:
      'Enter your recent race result or your race pace to estimate a realistic pace goal for the Wings for Life race.',
    explanation: `A mathematical model based on Riegel's formulas will calculate your abilities and compare them to the movement pattern of a chase car - simultaneously optimizing your pace to achieve the longest distance you've run.`,
    disclaimer: `Keep in mind that these calculations have their limitations - they assume you have the necessary endurance base for the target distance, and even the most precise math can't predict the weather, course elevation, or how you'll feel on race day. The unique Wings for Life format means rigid numbers take a back seat, so treat this result simply as a helpful tactical guide, keeping in mind that having fun and supporting the cause are what matter most on the course.`,
  },

  result: {
    header: 'Optimal run calculation result',

    avgPace: 'average pace',
    return: 'return to form',
  },

  pageTitle: 'Wings For Life - Optimal Pace Calculator',
}
