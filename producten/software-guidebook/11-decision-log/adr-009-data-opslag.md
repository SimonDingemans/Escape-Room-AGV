### ADR-009 data opslag

Datum: 2025-05-20

#### Status

Geaccepteerd

#### Context

Wij hebben een plek nodig waar wij de data opslaan die betrekking heeft tot en met de events die weergegeven worden in
TouchDesigner

#### Afgewogen opties

| Forces                                   | TouchDesigner | SQL Database | NOSQL Database  | los bestand |
|------------------------------------------|---------------|--------------|-----------------|-------------|
| Kennis team                              | 0             | ++           | -               | -           | 
| complexiteit van de verbinding           | ++            | 0            | 0               | 0           |
| relaties onderlinge data                 | +             | ++           | +               | +           |
| toegevoegde complexiteit door tussenlaag | ++            | --           | -               | -           |

#### Beslissing

Het team heeft besloten om TouchDesigner te gaan gebruiken voor het opslaan van onze data
Dit komt omdat de force toegevoegde complexiteit zwaar mee telt in dit oordeel en hetzelfde geldt voor de complexiteit van de verbinding
Als je dit in bescouwing neemt is TouchDesigner de duidelijke keuze

#### Consequenties

De data moet opgeslagen worden in TouchDesigner