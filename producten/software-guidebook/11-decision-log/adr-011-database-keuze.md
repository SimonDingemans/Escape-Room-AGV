### ADR-011 Database keuze

Datum: 2025-05-26

#### Status

Geaccepteerd

#### Context

Het team zoekt een database die alle informatie van een scenario kan opslaan. 
Vanwege weinig beschikbare development tijd moet de database gemakkelijk te gebruiken zijn voor het team.
Bestanden, zoals videos, worden niet in de database opgeslagen maar paden naar de bestanden. 

#### Afgewogen opties

| Forces                           | SQL (MS SQL) | Document-oriented (MongoDB) | Graph database (Neo4J) |
|----------------------------------|--------------|-----------------------------|------------------------|
| Kennis team                      | ++           | -                           | --                     |
| Documentatie                     | ++           | +                           | 0                      |
| Relationele verbanden            | ++           | -                           | -                      |
| Aanpasbaarheid diep geneste data | ++           | 0                           | +                      |
| Uitbreidbaarheid                 | 0            | ++                          | +                      |

#### Beslissing

We hebben besloten om MS SQL als database te gebruiken vanwege de volgende redenen:

- Het team heeft sterke kennis van SQL databases wat de ontwikkeling en onderhoud zal versnellen
- MS SQL heeft uitstekende documentatie beschikbaar wat belangrijk is voor het project
- Het datamodel toont veel relationele verbanden tussen entiteiten (zoals Scenario -> Fase -> Event -> Device -> Location) wat goed
  past bij een SQL database

#### Consequenties

- Snellere ontwikkelcyclus
- Betrouwbare en bewezen technologie
- Sterke data-integriteit

- Minder flexibiliteit bij schemawijzigingen
- Minder optimale fit voor niet-relationele data

