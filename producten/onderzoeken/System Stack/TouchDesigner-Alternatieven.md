Alternatieven moeten de volgende functionaliteiten hebben:

- Hardware op uitzondering van camera en microfoon aansturen
  - Pre: communicatie hardware (camera en microfoon) aansturen
- Scenario’s moeten visueel programmeerbaar zijn
  - Acties moeten gekoppeld kunnen worden aan hardware
  - Pre: voorwaarden aan acties leggen
  - Pre: scenario kan worden opgeslagen in database of in bestand
- Pre: moet op een server kunnen draaien en online beschikbaar



Frontend

| Forces                                        | React + [dndkit](https://dndkit.com/) | React + [draggable](https://shopify.github.io/draggable/) | Vue + [draggable](https://shopify.github.io/draggable/) | Svelte + [draggable](https://shopify.github.io/draggable/) |
| --------------------------------------------- | ------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| Draait op een server en is online beschikbaar | ++                                    | ++                                                        | ++                                                      | ++                                                         |
| Rendert content dynamisch                     | ++                                    | ++                                                        | ++                                                      | ++                                                         |
| Geeft mogelijkheid tot visueel programmeren   | ++                                    | ++                                                        | ++                                                      | ++                                                         |
| Ondersteunt drag and drop                     | ++                                    | ++                                                        | ++                                                      | ++                                                         |
| Documentatie                                  | ++                                    | +                                                         | +                                                       | 0                                                          |
| Complexiteit                                  | ++                                    | +                                                         | +                                                       | +                                                          |

Keuze `React + dndkit`

Backend

| Forces                                                       | Weging | Java + Spring Boot | C# + .Net | Python + django | PHP + laravel |
| ------------------------------------------------------------ | ------ | ------------------ | --------- | --------------- | ------------- |
| Kan op een server draaien en online beschikbaar zijn         | 1      | ++                 | ++        | ++              | ++            |
| Object Oriented coding                                       | 1      | ++                 | ++        | +               | +             |
| Kan hardware op uitzondering van camera’s en microfoons aansturen | 1      | +                  | 0         | +               | -             |
| Kan scenario’s inladen                                       | 1      | ++                 | ++        | ++              | ++            |
| Documentatie                                                 | 1      | ++                 | ++        | +               | +             |
| Complexiteit                                                 | 1      | ++                 | +         | +               | +             |
| Kan camera’s en microfoons aansturen                         | 0.1    | ++                 | +         | ++              | - -           |

Video afspelen:

- Java -> JavaFX
- C# -> WinUI

Keuze `Java + Spring Boot`