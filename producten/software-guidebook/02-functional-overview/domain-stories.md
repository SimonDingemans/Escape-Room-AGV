# Domain Stories

In dit hoofdstuk worden de belangrijkste gewenste functionaliteiten van de opdrachtgever besproken.
Dit gebeurt door middel van verschillende domain stories, tekeningen die laten zien hoe het domein (in dit geval de escape room) werkt.
Tussen haakjes wordt er weergegeven of dit om de huidige situatie (as-is) of de toekomstige situatie met een systeem (to-be) gaat.

## Handeling van de operator
### Huidige situatie
Allereerst worden de handelingen van de operator uitgebeeld in de volgende domain story.  

![Handeling operator (as-is)](../pictures/domain-stories/Handelingen%20operator%20(as%20is)_2025-04-23.png)

In deze domain story staat in stap 1 t/m 7 welke systemen worden opgestart.
Daarna krijgen de studenten een briefing (stap 8). 
De escape room zelf begint op de gang waar een filmpje wordt getoont op het systeem in de gang (stap 9).
Daarna wordt de timer gestart (stap 10) in de woonkamer en wordt daar ook een filmpje opgestart (stap 11).
De operator kan ook een hint geven op het woonkamer systeem (stap 12).

Het active team doet de escape room en het backup team zit in een andere ruimte en kan met een communicatiesysteem communiceren met het active team.
De docent of operator kan ook via het robotmaatje communiceren met het active team. Stap 11 t/m 14 staan niet vast, maar kunnen door elkaar lopen.
Als laatste vult het active team het planbord in.

Na deze stap gaan de studenten naar de gang en wordt stap 9 t/m 12 herhaald, maar dit keer gaan het active team naar de IC kamer.
Stap 13 t/m 15 blijven ook hetzelfde.

### Toekomstige situatie
#### Coarse grained

Een coarse grained domain story laat een globaal overzicht zien van een proces zonder in detail te treden. Dit type
diagram toont de hoofdstappen van het proces op een versimpelde manier.

In de toekomstige situatie worden de handelingen van de operator vereenvoudigd. 
In de domain story hieronder wordt een groffe schets van de toekomstige situatie weergegeven.

![Handelingen operator, coarse grained](../pictures/domain-stories/Coarse%20grained%20hints%20tonen%20(to%20be).png)

Als eerst laadt de operator een scenario in het systeem en dan zet het systeem automatisch alle onderdelen aan.
Daarna toont het systeem alle mogelijke hints aan de operator.
Als derde kan de operator een hint activeren.

#### Fine grained

Een fine grained domain story laat de details van een proces zien door dieper in te gaan op specifieke onderdelen. Dit
type diagram toont de individuele stappen en interacties die plaatsvinden binnen een groter proces.

In de onderstaande fine grained domain stories worden extra opties bij het besturen getoond.
Dit zijn de mogelijkheden voor het pauzeren, doorspoelen en stoppen van de timer van het scenario.

![Handelingen operator, fine grained pauzeren](../pictures/domain-stories/Fine%20grained%20hints%20tonen,%20pauzeren%20(to%20be).png)

Bij de domain story over pauzeren wordt in stap 4 de timer gepauzeerd.
Als effect daarvan zal het systeem de interne timer stoppen en zullen er geen nieuwe dingen gestart worden die afhankelijk zijn van de timer.

![Handelingen operator, fine grained doorspoelen](../pictures/domain-stories/Fine%20grained%20hints%20tonen,%20doorspoelen%20(to%20be).png)

Bij de bovenstaande fine grained domain story in stap 4 spoelt de operator door naar de volgende fase.
In stap 5 toont het systeem de nieuwe mogelijke hints van de volgende fase.

![Handelingen operator, fine grained stoppen](../pictures/domain-stories/Fine%20grained%20hints%20tonen,%20stoppen%20(to%20be).png)

Bij de domain story over scenario stoppen wordt in stap 4 het scenario gestopt.
Het systeem zorgt dan dat alle schermen terug naar de start schermen gaan en alle apparaten worden stopgezet.

## Handelingen van het backup team (to-be)

In de toekomstige situatie ziet de domain story er als volgende uit:

![Handelingen backup-team (to-be)](../pictures/domain-stories/Handelingen%20backupteam%20(to%20be)_2025-04-23.png)

In stap 1, 2 en 3 wordt er weergegeven dat het backup team en het active team kunnen communiceren.
In stap 4 en 5 gaat het echt over de handelingen zelf. 
Het team doet een puzzel, waaruit een code komt.
Deze kunnen ze invoeren in het systeem.
Wat niet hier getekent staat, is dat het systeem na het invullen van de code een hint kan activeren voor het active team.

## Scenariomaker

De scenariomaker kan een scenario maken in de editor. 
In onderstaande domain story staat de werkwijze.

![Scenariomaker maakt scenario](../pictures/domain-stories/egon/Fine%20grained%20scenariomaker%20maakt%20scenario%20(to%20be).egn.svg)

Stap 1 kan ook vervangen worden met "Scenariomaker maakt nieuw scenario aan in editor".
Daarnaast kunnen stappen 2 t/m 6 vaker gedaan worden als dat nodig is.
Als laatste kan een scenariomaker het scenario publiceren.
Het bestand wordt dan op de computer opgeslagen.

In onderstaande domain story gaat het over het simuleren van een scenario.

![Simulator](../pictures/domain-stories/egon/Simulator%20(to%20be).egn.svg)

In stap 1 selecteert de scenariomaker een scenario.
Stap 2, 3 en 4 word beschreven hoe het systeem met de hint omgaat.
Bij stap 5 en 6 bewerkt de scenariomaker de hint die weergegeven wordt in de simulator.
Stap 7 en 8 gaan over de interactie die de scenariomaker heeft met de tijdlijn.

## Proces van scenario in simulator

Een scenario kan in een simulator getest worden. Hoe dit allemaal te werk gaat wordt in [deze uitleg](../../onderzoeken/scenario%20in%20simulator/Uitleg.md) beschreven.
