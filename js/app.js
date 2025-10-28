/*
Den här javascript-koden hämtar rätter från TheMealDB via API (endpoint per bokstav),
bearbetar datan konsoll-loggar:
-första fem rätterna i bokstavsordning (a-z)
-namn på alla rätter som har kategori "vegetarian"
-antal rätter per kategori
*/

// Här skapar vi en array med alphabetets bokstäver (a-z). Den används för att
// göra alfabetiska sökningar mot API:t (search.php?f=letter) me ett anrop per bokstav.
const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// --- fetchAllaRatter (samma funktion för alla API-anrop) ---
// async-funktionen loopar över alla bokstäver och hämtar rätter från
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
  return allMeals;
}


// ---------------------
// funktion "printFirstFiveMeals"
// skriver ut de fem första rätterna i listan i bokstavsordning.
// sorterar en kopa av listan
function printFirstFiveMeals(allMeals) {
  // icke-muterande sortering (tar en kopia först)
  const sorterade = [...allMeals].sort((a, b) => a.strMeal.localeCompare(b.strMeal)); //sorterar efter namn
  const forstaFem = sorterade.slice(0, 5); // tar dem fem första i listan
  console.log("\n***Här är de fem första rätterna i bokstavsordning:***");
  forstaFem.forEach(meal => console.log(meal.strMeal));
}

// funktion "printMealsByCategory"
// som filtrerar rätter utifrån kategori och skriver ut dem
// + skriver ut totalt antal rätter som matchar kategorin
function printMealsByCategory(allMeals, givenCategory) {
  const filteredMeals = allMeals.filter(
    meal => meal.strCategory && meal.strCategory.toLowerCase() === givenCategory.toLowerCase()
  );

  console.log(`\n***Det här är alla rätter i kategorin "${givenCategory}":***`);
  filteredMeals.forEach(meal => console.log(`namn: ${meal.strMeal}`));
  console.log(`Totalt antal rätter i kategorin "${givenCategory}": ${filteredMeals.length}`);
}

// funktion "countMealsPerCategory"
// räknar antal rätter per kategori och returnerar
// objekt där nyckel = kategori och värde = antal rätter.
// + skriver ut i konsolen.
function countMealsPerCategory(allMeals) {
  const categoryCount = allMeals.reduce((acc, meal) => {
    const category = meal.strCategory || "okänd"; //om kategori saknas/inte definieras
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  console.log("\n***Antal rätter per kategori:***");
  console.log(categoryCount);
  return categoryCount;
}

// kör allt i logisk ordning och skriv ut/consol-logga
// async:en startar direkt, hämtar rätter och kör de olika funktionerna.
(async function main() {
  try {
    const allMeals = await fetchAllaRatter(); // hämtar alla rätter EN gång

    printFirstFiveMeals(allMeals); //sortera och skriv ut de fem första
    printMealsByCategory(allMeals, "vegetarian"); // filtrera på kategori och skriv ut (exempel: "vegetarian")
    countMealsPerCategory(allMeals); // räknar antal rätter per kategori och skriv ut

  } catch (err) {
    // om error så och loggas dem/skrivs ut.
    console.error("Något gick fel:", err);
  }
})();
