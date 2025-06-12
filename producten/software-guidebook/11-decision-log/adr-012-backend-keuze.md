### ADR-012 Backend keuze

Datum: 2025-05-26

#### Status

Geaccepteerd

#### Context

Er moet onderzocht hoe een editor gemaakt kan worden die niet afhankelijk is van TouchDesigner.
Hiervoor is een backend server nodig die kan communiceren met een frontend, database en TouchDesigner.
De backend server moet ook functioneren als een websocket server.

#### Afgewogen opties

| Forces                                | Node | Deno | Java + Spring Boot |
|---------------------------------------|------|------|--------------------|
| Server is licht om te draaien         | +    | +    | -                  |
| Kan functioneren als WebSocket server | ++   | ++   | ++                 |
| Kennis van het team                   | +    | 0    | ++                 |
| Documentatie                          | 0    | -    | +                  |
| Tutorials beschikbaar                 | ++   | -    | ++                 |
| Interactie MS SQL                     | ++   | ++   | ++                 |

#### Beslissing

Het team kiest voor Node.js als backend server vanwege de lichte footprint en het vermogen om efficiënt te draaien op verschillende systemen.

#### Consequenties

- Lage drempel voor het opzetten van een snelle en lichte server
- Uitstekende WebSocket ondersteuning via het 'ws' pakket (v8.18.2)
- Ruime beschikbaarheid van tutorials en voorbeelden voor het team
- Goede integratie met MS SQL databases
- Niet alle teamleden hebben evenveel kennis van Node.js vergeleken met Java
- Documentatie is minder gestructureerd dan bij Java + Spring Boot
