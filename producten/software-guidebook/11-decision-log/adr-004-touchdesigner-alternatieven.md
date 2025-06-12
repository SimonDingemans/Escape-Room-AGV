### ADR-004 TouchDesigner alternatieven

Datum: 2025-05-06

#### Status

Deels afgekeurd

#### Context

Het huidige systeem is geschreven in TouchDesigner, dit is een node based programming tool. Voor de opdrachtgever was
dit makkelijk maar het team weet niet goed of dit de juiste tool is om verder mee te gaan. Het probleem is dat er voor
de opdracht een webapplicatie moet komen waarin mensen nieuwe scenario’s kunnen maken, echter is het niet goed mogelijk
om via een website met TouchDesigner te interfacen om nieuwe project te maken.

#### Afgewogen opties

Frontend

| Forces                                        | React + [dndkit](https://dndkit.com/) | React + [draggable](https://shopify.github.io/draggable/) | Vue + [draggable](https://shopify.github.io/draggable/) | Svelte + [draggable](https://shopify.github.io/draggable/) |
|-----------------------------------------------|---------------------------------------|-----------------------------------------------------------|---------------------------------------------------------|------------------------------------------------------------|
| Draait op een server en is online beschikbaar | ++                                    | ++                                                        | ++                                                      | ++                                                         |
| Rendert content dynamisch                     | ++                                    | ++                                                        | ++                                                      | ++                                                         |
| Geeft mogelijkheid tot visueel programmeren   | ++                                    | ++                                                        | ++                                                      | ++                                                         |
| Ondersteunt drag and drop                     | ++                                    | ++                                                        | ++                                                      | ++                                                         |
| Documentatie                                  | ++                                    | +                                                         | +                                                       | 0                                                          |
| Complexiteit                                  | ++                                    | +                                                         | +                                                       | +                                                          |

Backend

| Forces                                                            | Weging | Java + Spring Boot | C# + .Net | Python + django | PHP + laravel |
|-------------------------------------------------------------------|--------|--------------------|-----------|-----------------|---------------|
| Kan op een server draaien en online beschikbaar zijn              | 1      | ++                 | ++        | ++              | ++            |
| Object Oriented coding                                            | 1      | ++                 | ++        | +               | +             |
| Kan hardware op uitzondering van camera’s en microfoons aansturen | 1      | +                  | 0         | +               | -             |
| Kan scenario’s inladen                                            | 1      | ++                 | ++        | ++              | ++            |
| Documentatie                                                      | 1      | ++                 | ++        | +               | +             |
| Complexiteit                                                      | 1      | ++                 | +         | +               | +             |
| Kan camera’s en microfoons aansturen                              | 0.1    | ++                 | +         | ++              | --            |

#### Beslissing

De keuze lag op de Java + Spring Boot voor de backend en React + dndkit voor de frontend, omdat dit de hoogst scorende
opties waren. Deze keuzes zijn voorgelegd aan de projectbegeleider. De frontend is goedgekeurd maar de backend is
afgekeurd omdat de projectbegeleider wel heeft kunnen vinden hoe TouchDesigner aangestuurd kan worden via websockets.

#### Consequenties

De frontend is in React.

Frontend zit in het React ecosysteem.

Het team moet TouchDesigner blijven gebruiken

Het team moet kijken hoe een applicatie vanuit TouchDesigner aangestuurd kan worden.

Er moeten websockets gebruikt worden.