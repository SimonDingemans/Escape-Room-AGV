### ADR-015 Advies walking skeleton

Datum: 2025-06-11

#### Status

Voorgesteld

#### Context

In dit project wordt een escape room editor en player ontwikkeld met als doel een flexibel, uitbreidbaar en
onderhoudbaar systeem. Er zijn twee hoofdopties geëvalueerd voor de technische opzet:

- **Walking skeleton 1: TouchDesigner focus:** alle dataopslag en logica bevinden zich in TouchDesigner.
- **Walking skeleton 2: Minder TouchDesigner:** zoveel mogelijk logica bevindt zich buiten TouchDesigner, dataopslag in een
  centrale database (Microsoft SQL Server).

#### Afgewogen opties

| Forces                                                 | TouchDesigner focus | Minder TouchDesigner |
|--------------------------------------------------------|---------------------|----------------------|
| Snelheid proof-of-concept                              | +                   | +                    |
| Flexibiliteit/aanpasbaarheid                           | -                   | ++                   |
| Herbruikbaarheid componenten                           | +                   | ++                   |
| Overzichtelijkheid componenten / functies              | -                   | ++                   |
| Koppeling met externe systemen                         | 0                   | +                    |
| Schaalbaarheid/Onderhoudbaarheid                       | -                   | ++                   |
| Testbaarheid                                           | -                   | +                    |
| Afhankelijkheid van TouchDesigner                      | --                  | 0                    |
| Aantal developers dat snel met het project kan starten | --                  | 0                    |

#### Beslissing

We adviseren om verder te gaan met het walking skeleton volgens de “Minder TouchDesigner”-optie. Hierdoor wordt zo veel
mogelijk logica en dataopslag buiten TouchDesigner gebracht en gecentraliseerd in een database met een losse backend (
Node.js). TouchDesigner wordt enkel gebruikt als aansturing van de apparaten voor het daadwerkelijk afspelen van events.

#### Consequenties

- Kleinere afhankelijkheid van TouchDesigner: TouchDesigner is gemakkelijk te vervangen of te updaten zonder dat de
  kernlogica herschreven hoeft te worden.
- Code is makkelijker te testen, onderhouden en uit te breiden door de duidelijke scheiding tussen backend en frontend.
- Extra investering in het ontwikkelen van API’s en dataopslagstructuren buiten TouchDesigner, maar dit verdient zich
  terug in flexibiliteit en onderhoudbaarheid.
- Er zijn meer developers die snel met het project kunnen starten.
- Simon Phoelich (de opdrachtgever) begrijpt minder van de code.
- Praktijkhuis AGV is minder afhankelijk van Simon Phoelich
