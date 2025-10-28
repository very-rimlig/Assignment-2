# app.js och verygood.js


## Sammanfattning
Javascript-koden i app.js hämtar rätter från TheMealDB via API endpoint, 
samlar ihop dem och kör dem i utskriftskonsollen.
Det som hämtas OCH skrivs ut är:
-De fem första rätternas namn i bokstavsordning
-Alla rätternas namn i kategorin "vegetarian"
Koden skapar även ett Javascript-objekt som räknar antalet rätter
per kategori, detta skrivs också ut i utskriftskonsollen.


Koden i verygood.js hämtar också alla rätter från TheMealDB via API endpoint på samma sätt som i app.js
och bearbetar dem och skriver ut i konsollen. Det som hämtas och skrivs ut är:
– Alla rätter som innehåller grädde, mjölk eller smör (gruppering via nyckel + enkel gruppering och reshaping)
– Antalet rätter per område (land) samt exempel på de första tio brittiska rätterna (gruppering via nyckel och frekvensräkning)
– De vanligaste ingredienserna, sorterade efter hur ofta de förekommer (frequency map)

Koden i filerna app.js och verygood.js demonstrerar bland annat:
asynkron datainhämtning med fetch etc. 
array/list-manipulation (sortering, filtrering, reducering).
filtrering och gruppering av data, samt byggande av frekvenskartor med reduce och Set
enklare omstrukturering (reshape) av inhämtad data när objekt byggs

---

## Filstruktur
Koden i Assignment-2 består av två Javascript-filer:
-app.js
-verygood.js

Utöver dessa finns:
-readme.md, denna fil som beskriver JavaScript-filerna
-övriga filer (html och css är tomma)

+i js-filerna finns utförligare kommentarer till koden

---

## Centrala funktioner i filerna

- **app.js**  
Förklaring av centrala funktioner/kod:
- letters — array med alfabetets bokstäver.
- fetchAllaRatter() — asynkron funktion som itererar över letters, anropar API:t för varje bokstav och samlar alla rätter i en array som returneras.
- printFirstFiveMeals(allMeals) — icke-muterande sortering och utskrift av de fem första rätterna i alfabetisk ordning.
-printMealsByCategory(allMeals, givenCategory) — filtrerar och skriver ut rätter för en given kategori (case-insensitive).
- countMealsPerCategory(allMeals) — räknar hur många rätter som finns per kategori och loggar ett objekt med räkningarna.
- main() (IIFE) — kör flödet: hämtar data och anropar ovanstående funktioner; fångar fel i try/catch och loggar dem.

- **verygood.js**  
Förklaring av centrala funktioner/kod:
- fetchAllaRatter() loopar över bokstäver a–z, hämtar rätter från API:t och samlar dem i en lista.
- findCreamOrMilkOrButter() extraherar ingredienser per rätt och markerar om de innehåller "cream", "milk" eller "butter" (strängmatch via includes) och skriver ut dem.
- groupBy() är en generell gruppera-funktion; funcGroupByArea() grupperar hämtade rätter på strArea och skriver antal per område samt de första 10 brittiska rätterna.
- extractIngredients() normaliserar och returnerar en rätts ingredienser (upp till 20 fält).
- buildIngredientFrequency_perMeal() skapar en frekvenskarta där varje ingrediens räknas max en gång per rätt (använder Set för unikhet per meal).
- printTopN() sorterar och skriver ut de vanligaste ingredienserna med antal rätter.
- main() anropar ovan funktioner i ordning och fångar fel med try/catch.
- Matchningen är enkel textmatchning (t.ex. "milk" matchar även "buttermilk"); ingen avancerad normalisering av ingrediensnamn förutom trim och lowercase.

---



## Vad händer när koden i app.js körs:
1. main() startar och körs omedelbart (async). 


2. fetchAllaRatter():
- Skapar tom array/lista för alla rätter (allMeals).
- Loopar över alfabetets bokstäver (letters) och gör await fetch(...) för varje bokstav.
- För varje bokstav i alfabetet (i loopen) gör funktionen ett API-anrop. När svaret kommer omvandlas/parsas det från JSON-format till ett JavaScript-objekt. Om svaret innehåller en lista av rätter (data.meals finns), så lägger funktionen till rätterna (pushas) i listan/arrayen allMeals.
- Funktionen returnerar allMeals när loopen är klar.

3. printFirstFiveMeals(allMeals):
- Skapar en kopia av allMeals och sorterar med localeCompare.
- Skriver ut de första fem posterna/ consollloggar dom.

4. printMealsByCategory(allMeals, givenCategory):
- Filtrerar allMeals på meal.strCategory (case-insensitive/oavsett gemener, versaler etc.).
- Loggar varje resultat och totalen.

5. countMealsPerCategory(allMeals):
- Reducerar allMeals till ett objekt { kategori: antal } och loggar det.

6. Om något nätverksfel eller JSON-parsefel uppstår fångas det och skrivs ut i konsolen.

---
## Vad händer när koden i verygood.js körs:
1. main() startar och körs omedelbart (async). 

2. fetchAllaRatter():
- Skapar tom Array/lista för allMeals.
- Loopar över alla bokstäver i letters (a–z) och gör för varje bokstav ett await fetch(...) mot TheMealDB (search.php?f=${letter}).
- Parsar varje svar med await res.json(). Om data.meals finns läggs dessa rätter in i allMeals via push(...data.meals).
- Returnerar den samlade listan allMeals efter att loopen slutförts.

3. findCreamOrMilkOrButter() (anropas först från main()):
- Anropar fetchAllaRatter() för att få allMeals.
- För varje meal extraherar/plockar koden ut ingredienserna (1–20) till en Array/lista som modifieras med trim + lowercase.
- Bestämmer via boolean-villkor hasCream, hasMilk, hasButter genom ingredients.some(ing => ing.includes("...")).
- Rätterna mappas till ett förenklat objekt som innehåller name, category, hasCream, hasMilk, hasButter .
- Skriver ut i konsolen de rätter som har någon av dessa (och specificerar vilka: grädde/mjölk/smör).

4. funcGroupByArea() (näst i ordning från main()):
- Anropar fetchAllaRatter() igen (hämtar data på nytt).
- Använder groupBy(allMeals, "strArea") för att gruppera rätter per område/land.
- Loggar antal rätter per strArea.
- Om det finns en grupp "British" skriver den ut de första tio brittiska rätterna.

5. buildIngredientFrequency_perMeal() och printTopN():
- extractIngredients(meal) tar ut och normaliserar ingredienser (trim + lowercase).
- buildIngredientFrequency_perMeal() skapar för varje rätt en unik lista av ingredienser (använder new Set(...)) så att varje ingrediens räknas max en gång per rätt.
- Flatar ut dessa och räknar förekomst över alla rätter med reduce för att bygga en frekvenskarta { ingrediens: antalRätter }.
- printTopN(freqMap, n) sorterar frekvenskartans entries i fallande ordning och skriver ut de n vanligaste ingredienserna.

6. Konsolutskrifter och felhantering:
- main() anropar funktionerna i ordning: först findCreamOrMilkOrButter(), sedan funcGroupByArea(), sedan frekvensbygget + printTopN().
- Alla utskrifter går till console.log. Eventuella fel i nätverk eller runtime fångas i catch och skrivs ut med console.error("Något gick fel:", err).
