# Wings for Life Optimal Pace

A web application built with Vue 3 and TypeScript that helps estimate the **optimal distance and pace** for the Wings for Life World Run.

The calculator compares:

* the runner’s predicted finish time (based on the Riegel model),
* the catcher car catch-up time (based on staged speed schedule),

and finds the distance where the difference between those times is minimal.

## Features

* calculates the optimal distance with `1 meter` precision,
* displays net time, gross time, and average pace,
* uses a Riegel coefficient of `1.06` by default,
* validates the form with `zod`,
* displays results only after clicking `Calculate`,
* UI is available in Polish.

## How it works (short version)

1. The user provides a reference result (time + distance), start delay, and runner profile.
2. The calculator estimates running times for different distances using the Riegel formula.
3. For the same distances, it calculates the catcher car catch-up times.
4. The algorithm iteratively narrows the search range (`1 -> 0.1 -> 0.01 -> 0.001 km`) and selects the best result.

## Run locally

Requirements:

* Node.js `>=20`
* Yarn (the project uses Yarn 4 / PnP)

Install dependencies:

```bash
yarn
```

Development mode:

```bash
yarn dev
```

Type check:

```bash
yarn type-check
```

Production build:

```bash
yarn build
```

Lint:

```bash
yarn lint
```

## Project structure

* `src/components/calculation/CalculationComponent.vue` - form + result presentation
* `src/components/calculation/optimize.ts` - optimal distance search algorithm
* `src/components/calculation/riegel.ts` - Riegel model
* `src/components/calculation/car.ts` - catcher car model
* `src/components/CalculatorIntro.vue` - introduction and explanation

## Notes

This tool provides an estimation based on a mathematical model and the assumed catcher car schedule.
Treat the result as planning support, not as a guarantee of the actual race outcome.

## License

This work is licensed under a [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/).

## Contact

For questions or feedback, please reach out via GitHub.
[ifmcjthenknczny](https://github.com/ifmcjthenknczny)  

Project Link: [https://github.com/ifmcjthenknczny/wfl-optimal-pace](https://github.com/ifmcjthenknczny/wfl-optimal-pace)