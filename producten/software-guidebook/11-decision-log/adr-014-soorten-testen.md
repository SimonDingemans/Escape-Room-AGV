### ADR-014 Soorten testen

Datum: 2025-06-05

#### Status

Geaccepteerd

#### Context

Het team moet een teststrategie kiezen voor het project. Het systeem bestaat uit meerdere componenten die met elkaar communiceren: een React frontend, Node.js backend met websockets, Microsoft SQL Server en TouchDesigner.

#### Afgewogen opties

| Forces                                  | Unit tests | Integration tests | End-to-end tests | Manual tests |
|-----------------------------------------|------------|-------------------|------------------|--------------|
| Kennis team                             | ++         | -                 | --               | ++           |
| Volledigheid van de test                | 0          | +                 | ++               | +            |
| Dekking van gebruikersscenario's        | --         | 0                 | ++               | +            |
| Complexiteit                            | ++         | +                 | -                | ++           |
| Test websocket communicatie             | --         | +                 | ++               | +            |
| Test interactie met TouchDesigner       | --         | -                 | ++               | ++           |
| Vroege detectie van integratieproblemen | --         | +                 | ++               | +            |
| Automatiseerbaarheid                    | ++         | ++                | ++               | --           |

#### Beslissing

We hebben besloten om end-to-end testen als primaire teststrategie te onderzoeken omdat:
- Het systeem bestaat uit meerdere losstaande componenten waarvan de integratie cruciaal is voor de werking
- End-to-end tests geven de hoogste zekerheid dat het complete systeem werkt zoals bedoeld voor de eindgebruiker

#### Consequenties

- Het team moet een end-to-end test opzetten
- Tests zullen langer duren om uit te voeren dan andere soorten testen
- Er zijn minder testen nodig dan bij andere soorten testen
- Het opzetten van de testomgeving wordt complexer omdat alle componenten draaiend moeten zijn
- Betere garantie dat gebruikersscenario's correct werken
- Minder snelle feedback tijdens development vergeleken met andere testen
- TouchDesigner moet in een testmodus kunnen draaien voor geautomatiseerde tests
- CI/CD pipeline moet geconfigureerd worden om de volledige applicatie stack te kunnen draaien
