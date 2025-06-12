# Principles

In dit hoofdstuk beschrijven wij de principes die wij hebben gekozen en volgen tijdens dit project.

## Communicatie TouchDesigner

Alle communicatie met TouchDesigner moet via het WebSocket-protocol verlopen, omdat dit de enigste manier is om met de gratis versie van TouchDesigner te communiceren. Hierdoor moet de te ontwikkelen software via het WebSocket-protocol communiceren met TouchDesigner.

## DRY (Don't Repeat Yourself)

Wij geven voorkeur aan weinig herhalende code. Dit doen wij door bijvoorbeeld gebruik te maken van methoden als een stukje functionaliteit zich vaak herhaalt.

## Don't Reinvent the Wheel

Wij geven de voorkeur aan bestaande libraries en tools. Bij de backend gebruiken wij bijvoorbeeld de Node.js WebSocket library.

## Database is leidend

De database data is leidend voor alle synchronisatie. Dit betekent dat wanneer er een verschil is tussen de database en TouchDesigner, TouchDesigner kloppend wordt gemaakt naar de data uit de database.
