/*
Den här javascript-koden hämtar rätter från TheMealDB (enkelt per bokstav)
och
- listar rätter som innehåller "cream", "milk" eller "butter"
- grupperar rätter per område/land och skriver antal per grupp
- visar de tio första brittiska rätterna om det finns några
- bygger en frekvenskarta över ingredienser (räknar varje ingrediens max en gång per rätt)
*/



// Här skapar vi en array med alphabetets bokstäver (a-z). Den används för att
// göra alfabetiska sökningar mot API:t (search.php?f=letter) me ett anrop per bokstav.
const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// --- fetchAllaRatter (samma funktion för alla API-anrop) ---
// Async-funktionen loopar över alla bokstäver och hämtar rätter från
// API:n för varje bokstav. Resultatet samlas i en array/lista (allMeals) som
// returneras när alla anrop körts klart.
async function fetchAllaRatter() {
  const allMeals = []; //den tomma listan/arrayen som fylls på
  for (const letter of letters) {
    // Ett anrop per bokstav där await gör att vi väntar in svaret innan
    // vi går vidare till nästa bokstav.
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    const data = await res.json(); // parsar/omvandlar JSON till ett JS-objekt
    if (data.meals) {
      // Om API:et returnerar en lista med rätter så lägger vi in dem i allMeals
      allMeals.push(...data.meals);
    }
  }
  return allMeals; // returnerar samtliga rätter som hittats
}

/* ------------------------
Funktion: findCreamOrMilkOrButter
— kollar och skriver ut rätter som har milk, butter eller cream
------------------------ */
// Den här funktionen hämtar först alla rätter via fetchAllaRatter() och
// bygger sedan ett enklare objekt per.
// matchar någon ingridiens i rätten med stringen "cream", "milk" eller "butter". Resultatet skrivs ut
// i konsolen.
async function findCreamOrMilkOrButter() {
  const allMeals = await fetchAllaRatter(); //hämta data

  const result = allMeals.map(meal => {
    // samlar ingredienser från fälten strIngredient1..strIngredient20 (1-20)
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      if (ing && ing.trim() !== "") {
        // trimma och gör lowercase av texten/ingridienserna
        ingredients.push(ing.toLowerCase());
      }
    }

    //variabel som kollar om "cream" och/eller "milk" finns i listan ,
    // eller rättare sagt kategoriserar alla rätter utifrån om det är true/false
    // att någon ingridiens är cream eller milk genom metoden some

    const hasCream = ingredients.some(ing => ing.includes("cream"));
    const hasMilk = ingredients.some(ing => ing.includes("milk"));
    const hasButter = ingredients.some(ing => ing.includes("butter"));

    // returnerar ett objekt (select+reshape) med namn, kategori och flags/boolean-värde
    return {
      name: meal.strMeal,
      category: meal.strCategory,
      hasCream,
      hasMilk,
      hasButter
    };
  });

  // utskrift av resultaten/de rätter som innehåller grädde eller mjölk eller smör
  console.log("\n***Rätter som innehåller grädde, mjölk eller smör:***");
  result.forEach(meal => {
    if (meal.hasCream || meal.hasMilk || meal.hasButter) {
      console.log(`Namn: ${meal.name} (${meal.category})`);
      if (meal.hasCream) console.log(" - innehåller grädde");
      if (meal.hasMilk) console.log(" - innehåller mjölk");
      if (meal.hasButter) console.log(" - innehåller smör");
      console.log("");
    }
  });
}

/* ------------------------
Funktion: groupBy och funcGroupByArea
= gruppering per strArea (land) och utskrift
------------------------ */
// en groupBy som reducerar en lista till ett objekt där nycklarna är
// värdet för det angivna fältet och värdena är arrayer/listor med objekt som hör dit
function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const groupKey = item[key] || "okänd";
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
}

// funktionen hämtar alla rätter, grupperar dem per area (strArea) och
// skriver ut antalet rätter per område. Den skriver också ut de tio första
// brittiska rätterna om gruppen "British" finns.
async function funcGroupByArea() {
  const allMeals = await fetchAllaRatter(); //data hämtas igen (har inte hunnit optimera detta)
  const grouped = groupBy(allMeals, "strArea");

  console.log("Grupper (länder):");
  Object.keys(grouped).forEach(area => {
    console.log(`${area}: ${grouped[area].length} rätter`);
  });
// De tio första brittiska rätterna skrivs ut genom en if-sats
  if (grouped["British"]) {
    console.log("\n*****ENGELSKA RÄTTER, DE TIO FÖRSTA:*****");
    grouped["British"].slice(0, 10).forEach(m => console.log(m.strMeal));
  }
}

/* ------------------------
Funktion: frekvenskarta per rätt
— gjord via extractIngredients + flatMap + reduce
------------------------ */

// extractIngredients hämtar upp till 20 ingrediensfält från en rätt (meal)
// normaliserar dom (trim + lowercase). Returnerar sen en array/lista med ingredienser.
function extractIngredients(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const raw = meal[`strIngredient${i}`];
    if (raw && raw.trim() !== "") {
      ingredients.push(raw.trim().toLowerCase());
    }
  }
  return ingredients;
}

// funktion som räknar varje ingridiens max 1 gång per rätt (count per meal)
// det görs genom att först skapa en unik lista
// per meal (Set) och sedan räkna förekomsten över alla meals.
async function buildIngredientFrequency_perMeal() {
  const allMeals = await fetchAllaRatter(); //hämtar data igen

  // För varje rätt (meal): skapa en array/lista med unika ingredienser (så varje ingrediens
  // bara räknas en gång per meal) och använd flatMap så att de bildar en ny lång lista.
  const allIngredientsOncePerMeal = allMeals.flatMap(meal => {
    const ingList = extractIngredients(meal);
    const unique = [...new Set(ingList)];
    return unique;
  });
 // här skapas en "frekvenskarta" genom använda metoden .reduce (ingrediens: antalRätter)
  const freq = allIngredientsOncePerMeal.reduce((acc, ing) => {
    acc[ing] = (acc[ing] || 0) + 1;
    return acc;
  }, {});

  return freq;
}

/* Hjälpare som skriver ut topp N ingredienser i fallande ordning */
//funktionenen tar emot en frekvenskarta (freqMap) där varje nyckel är en ingrediens
//och värdet hur många rätter som innehåller den ingridiensen/matchar.
// funktionenen sorterar ingredienserna i fallande ordning utifrån antal rätter
// och skriver ut dem .

function printTopN(freqMap, n = 1000) { //1000 är satt för att jag inte visste hur många det var
  // Konvertera objektet till en array av [ingredienser, antal] och sortera efter antal, högst först
  const sorted = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n); // ta de n första, satt till 1000 så det blir alla (färre än 1000)
  console.log(`\n ******ANTAL RÄTTER PER KATEGORI:*****`);
  // skriver ut ingrediens och antal rätter i konsolen
  sorted.forEach(([ing, count]) => console.log(`${ing}: ${count}`));
}

/* ------------------------
  main deklareras och körs ( i logisk ordning)
   async:en gör att main startar direkt när filen laddas och kör flödet i en try/catch.
   ------------------------ */
(async function main() {
  try {
    // 1: lista rätter som innehåller cream/milk/butter
    await findCreamOrMilkOrButter();

    // 2: gruppera per area och skriv ut exempel
    await funcGroupByArea();

    // 3: bygg frekvenskarta och skriv ut (valfritt: printTopN)
    const freqPerMeal = await buildIngredientFrequency_perMeal();
    printTopN(freqPerMeal, 20);

  } catch (err) {
    // om error så och loggas dem/skrivs ut.
    console.error("Något gick fel:", err);
  }
})();
