const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// funktion som hämtar alla rätter
async function fetchAllaRatter() {
  const allMeals = [];
  for (const letter of letters) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    const data = await res.json();
    if (data.meals) {
      allMeals.push(...data.meals);
    }
  }
  return allMeals;
}

// funktion som skriver ut de fem första rätterna i listan som är i bokstavsordning
function printFirstFiveMeals(allMeals) {
  const sorterade = allMeals.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
  const forstaFem = sorterade.slice(0, 5);
  console.log("\n***Här är de fem första rätterna i bokstavsordning:***");
  forstaFem.forEach(meal => console.log(meal.strMeal));
}

// funktion som filtrerar rätter utifrån kategori och skriver ut dem
function printMealsByCategory(allMeals, givenCategory) {
  const filteredMeals = allMeals.filter(
    meal => meal.strCategory && meal.strCategory.toLowerCase() === givenCategory.toLowerCase()
  );

  console.log(`\n***Det här är alla rätter i kategorin "${givenCategory}":***`);
  filteredMeals.forEach(meal => console.log(`namn: ${meal.strMeal}`));
  console.log(`Totalt antal rätter i kategorin "${givenCategory}": ${filteredMeals.length}`);
}

// kör allt och skriv ut funktionerna
(async function main() {
  const allMeals = await fetchAllaRatter(); // Hämtar alla rätter EN gång
  printFirstFiveMeals(allMeals);
  printMealsByCategory(allMeals, "vegetarian"); // Exempel: "vegetarian"
})();
