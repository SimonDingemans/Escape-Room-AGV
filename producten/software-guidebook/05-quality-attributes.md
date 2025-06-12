# Quality Attributes

In dit hoofdstuk worden de belangrijkste niet-functionele vereisten (quality attributes) besproken.
In dit project is rekening gehouden met de volgende quality attributes: extensibility, maintainability en reliability.
Er zijn ook een aantal attributen waar normaal wel op wordt gelet, maar die voor dit project momenteel niet van toepassing zijn,
namelijk scalability en security.

## Extensibility

Extensibility gaat over hoe gemakkelijk nieuwe functionaliteit kan worden toegevoegd aan het systeem zonder dat daarvoor veel bestaande code moet worden aangepast.
In dit project is dat vooral belangrijk, zodat het mogelijk is dat er in de toekomst nieuwe kamers en apparaten toegevoegd kunnen worden aan de escaperoom.

In het eerste walking skeleton staat alle logica in TouchDesigner, inclusief alle data. Omdat TouchDesigner niet veel documentatie
heeft en weinig developers ermee bekend zijn, is het maken van toekomstige uitbreidingen lastig.
Daarom is een tweede walking skeleton gemaakt met een andere architectuur die het makkelijker maakt om het systeem in de toekomst uit te breiden.
Dit is gedaan door de logica te verplaatsen naar de backend en de data op te slaan in een database.
Zo is het project minder afhankelijk van de complexiteit van TouchDesigner

## Maintainability

Maintainability is hoe eenvoudig het systeem onderhouden kan worden. Op lange termijn is dit belangrijk, zodat het systeem niet verouderd en problemen opgelost kunnen worden.
Net als bij het vorige quality attribuut zou dit lastig zijn met het eerste walking skeleton vanwege TouchDesigner.
Het tweede walking skeleton is zo gemaakt dat de gebruikte technieken bekend zijn voor een groter deel van de developers, waardoor het beter te onderhouden is.

## Reliability

Reliability betekent dat het systeem blijft functioneren zoals verwacht, zonder fouten. In dit project is de betrouwbaarheid vooral van belang bij het synchroniseren van data
tussen de database/backend en TouchDesigner. Verder is het belangrijk bij de verbinding tussen TouchDesigner en de backend via WebSockets.
Bij het opstarten van TouchDesigner moet deze direct verbinding maken met de backend. Als dit mislukt of de verbinding wordt verbroken, moet er automatish nieuwe pogingen gedaan worden.
Verder is in de Frontend te zien of Touchdesigner wel of niet verbonden is, zodat de gebruiker weet of de data gesynchroniseerd wordt.
