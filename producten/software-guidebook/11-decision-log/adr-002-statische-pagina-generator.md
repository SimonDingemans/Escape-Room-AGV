### ADR-002 Statische pagina generator

Datum: 2025-04-16

#### Status

Geaccepteerd

#### Context

We willen een statische website genereren van het Software Guide Book en deze via GitHub Pages online beschikbaar maken.

#### Afgewogen opties

|                                   | MkDocs | mdBook | Jekyll | Docusaurus |
| ----------------------------------- | -------- | :------- | -------- | ------------ |
| Gebruiksvriendelijkheid interface | -      | +      | ++     | ++         |
| Documentatie                      | 0      | ++     | +      | ++         |
| Complexiteit                      | 0      | +      | --     | -          |

#### Beslissing

We hebben gekozen voor mdBooks, want wij wegen complexiteit zwaar.

#### Consequenties

Door mdBooks te kiezen hebben wij geen onnodige features, zoals [search engine optimization](https://docusaurus.io/docs/seo).
