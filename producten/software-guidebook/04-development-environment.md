# Development Environment

Dit hoofdstuk gaat alleen over het tweede walking skeleton

## Setup

Om de software te ontwikkelen heeft de developer [TouchDesigner](https://derivative.ca/download) versie 2023.12230
en [Node.js](https://nodejs.org/en/download) versie 22 of nieuwer nodig.

---

Open de laatste versie van het TouchDesigner_Backend.toe bestand in TouchDesigner.

Start de WebSocket server door in de backend walking-skeleton folder (`producten/walking-skeleton/versie 2/backend`)
`node server.js` te runnen in de terminal.

Start de frontend in development door in de frontend walking-skeleton folder (
`producten/walking-skeleton/frontend/versie 2/frontend`) `yarn dev` te runnen in de
terminal.

## Documentatie

Documenteer alle beslissingen waarin keuzes overwogen zijn in [de decision log](./11-decision-log) in de vorm van een
nieuw ADR. Voeg de link naar de ADR toe in [de summary](./SUMMARY.md) in de lijst onder decision log.

## Continuous Integration

Voor dit project is er een Continuous Integration die bij wijzigingen aan de frontend code op de main branch de frontend
build om te controleren of de code compileert.

De Continuous Integration is vastgelegd in de frontend-build.yml (`.github/workflows/frontend-build.yml`)

## Continuous Deployment

### Software Guidebook

Het software guidebook wordt automatisch gedeployed naar [de GitHub pages](https://aim-ene-feb25.github.io/pacman/) van
dit project wanneer een wijziging aan het software guidebook gemaakt is op de main branch. De onderdelen die op de
GitHub pages komen zijn vastgelegd in de [summary](./SUMMARY.md).

De Continuous Deployment is vastgelegd in de pages-deploy.yml (`.github/workflows/pages-deploy.yml`)
