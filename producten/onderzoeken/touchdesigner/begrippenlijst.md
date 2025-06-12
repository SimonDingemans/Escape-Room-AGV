verschillende soorten operators

Components (COMPs) - hebben een eigen netwerk

Texture Operators (TOPs) -		alle Image operators/alles wat met textures te maken heeft

Channel Operators (CHOPs) -		regelt alles met betrekking tot processing van data en de output ervan

Surface Operators (SOPs) -		genereert, importeert, bewerkt en combineert 3D oppervlakken

Materials (MATs)		-	zorgt ervoor dat SOPs of 3D objecten een textured oppervlak

Data Operators (DATs)	-		wordt gebruikt om tekst data of tabellen op te slaan

nodes		-			operators

netwerk		-			een groep van verbonden nodes van operators (elk component bevat een netwerk en elk netwerk leeft in een component)

parameters	-			alle operators hebben parameters waarmee de operator bestuurd kan worden

flags 		-			elke operator bevat flags, deze zijn niet heel interessant voor onze use case

wire 		-			de gekleurde lijn die de output van een node verbind met de input van een andere node in een netwerk

link		-			de grijze gestippelde lijn die aanduidt dat er data word opgehaald uit een andere operator

parameter binding 	-		er voor zorgen dat twee parameters met elkaar verbonden zijn

timeline	-			kan op start stop en examine staan, als de timeline op stop staat doet het programma niks en met examine kan je het programma per frame besturen

palette		-			kan worden gebruikt voor pre made networks en je kan je eigen component erin opslaan


node names are case sensitive