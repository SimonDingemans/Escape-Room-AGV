# Software Functionalities

In dit hoofdstuk wordt toegelicht welke functionaliteiten in het tweede walking skeleton zijn geïmplementeerd.
Dit wordt gedaan door te benoemen welke acties een gebruiker kan doen en wat de huidige resultaten daarvan zullen zijn.

## Scenariobeheer

Scenario's worden opgeslagen in de database.
Bij het opstarten van de website krijgt de gebruiker de keuze om een scenario aan te maken of in te laden.
Ook is er de optie om alle hardware op te halen.

### Scenario aanmaken

Het systeem biedt gebruikers de mogelijkheid om nieuwe scenario's aan te maken. 
Bij het maken van een scenario worden automatisch de volgende acties uitgevoerd:
- Het scenario wordt opgeslagen in de database
- Een standaard introductiefase wordt automatisch toegevoegd
- Alle apparaten op dezelfde locatie worden automatisch gekoppeld aan de nieuwe fase

### Scenario inladen

Gebruikers kunnen bestaande scenario's inladen vanuit de database door het scenario-id van het gewenste scenario op te sturen.
Het systeem stuurt alle opgeslagen gegevens over het scenario op naar de frontend.

### Apparaten ophalen

Als de gebruiker op de hardware knop drukt, worden alle video-, display- en audio-apparaten vanuit TouchDesigner in de database gezet.
Ook worden er voor display-apparaten de besturings-nodes in TouchDesigner gezet.
Deze knop moet eenmalig gebruikt worden om nieuwe apparaten in de database te zetten.
Om gebruik te maken van de rest van de applicatie moeten er apparaten in de database staan. 

## Editor

Het systeem heeft een editor waarin video events toegevoegd kunnen worden aan een scenario.

### Video event toevoegen

In de editor kan de gebruiker video events op een tijdlijn zetten.
Wanneer de gebruiker dit doet krijgt hij een formulier te zien waarin de informatie van de event ingevuld moet worden.
Bij het versturen van het formulier wordt de event opgeslagen in de database.
Indien TouchDesigner verbinding heeft met de backend, wordt een bericht gestuurt naar TouchDesigner met alle informatie om de event in TouchDesigner te zetten.
Als TouchDesigner geen verbinding heeft, wordt dit pas gedaan wanneer TouchDesigner verbinding maakt met de backend.

## Besturen escaperoom

Het systeem biedt gebruikers de mogelijkheid om de escaperoom te besturen via een timer-interface.
De timer vormt het centrale besturingselement voor het afspelen van tijdsgebonden events in het scenario.

### Timer starten

Wanneer de gebruiker de timer start, worden automatisch de volgende acties uitgevoerd:
- De visuele timer begint te lopen en toont de verstreken tijd
- Alle tijdsgebonden video events in het scenario worden geactiveerd op hun geplande tijdstippen
- Het systeem stuurt real-time updates naar TouchDesigner voor de uitvoering van events

### Timer beïnvloeden

In de bestuuromgeving kan de gebruiker verschillende acties uitvoeren om de timer te beïnvloeden:

**Pauzeren**: Pauzeert de timer tijdelijk zonder de huidige status te verliezen
**Hervatten**: Hervat de gepauzeerde timer vanaf het punt waar deze werd gepauzeerd
**Snelheid aanpassen**: Wijzigt de afspeelsnelheid van de timer (bijvoorbeeld versnellen of vertragen)
**Stoppen**: Stopt de timer volledig en reset alle actieve events

Alle timer-acties worden real-time doorgegeven aan TouchDesigner om ervoor te zorgen dat de hardware-uitvoering synchroon loopt met de timer-status.
