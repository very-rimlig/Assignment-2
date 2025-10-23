const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// --- fetchAllaRatter (en gemensam implementation, används av alla funktioner) ---
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

/* ------------------------
   Funktion 1 (oförändrad)
   — kollar och skriver ut rätter som har milk, butter eller cream
   ------------------------ */
async function findCreamOrMilkOrButter() {
  const allMeals = await fetchAllaRatter();

  const result = allMeals.map(meal => {
    // samlar alla ingredienser som finns (1–20)
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      if (ing && ing.trim() !== "") {
        ingredients.push(ing.toLowerCase());
      }
    }

    //variabel som kollar om "cream" och/eller "milk" finns i listan , eller rättare sagt kategoriserar alla rätter utifrån om det är true/false att någon ingridiens är cream eller milk genom metoden some

    const hasCream = ingredients.some(ing => ing.includes("cream"));
    const hasMilk = ingredients.some(ing => ing.includes("milk"));
    const hasButter = ingredients.some(ing => ing.includes("butter"));

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
   Funktion 2 (oförändrad)
   — groupBy och funcGroupByArea
   ------------------------ */
function groupBy(items, key) {
  return items.reduce((acc, item) => {
    const groupKey = item[key] || "okänd";
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
}

async function funcGroupByArea() {
  const allMeals = await fetchAllaRatter();
  const grouped = groupBy(allMeals, "strArea");

  console.log("Grupper (länder):");
  Object.keys(grouped).forEach(area => {
    console.log(`${area}: ${grouped[area].length} rätter`);
  });

  if (grouped["British"]) {
    console.log("\n*****ENGELSKA RÄTTER, DE TIO FÖRSTA:*****");
    grouped["British"].slice(0, 10).forEach(m => console.log(m.strMeal));
  }
}

/* ------------------------
   Funktion 3 (oförändrad)
   — frekvenskarta per meal (byggd via extractIngredients + flatMap + reduce)
   ------------------------ */

// plockar ut alla ingredienser från en rätt och normaliserar (trim + lowercase)
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
async function buildIngredientFrequency_perMeal() {
  const allMeals = await fetchAllaRatter();

  // För varje meal: bygg en Set med unika ingredienser (per meal)
  const allIngredientsOncePerMeal = allMeals.flatMap(meal => {
    const ingList = extractIngredients(meal);
    const unique = [...new Set(ingList)];
    return unique;
  });

  const freq = allIngredientsOncePerMeal.reduce((acc, ing) => {
    acc[ing] = (acc[ing] || 0) + 1;
    return acc;
  }, {});

  return freq;
}

/* Hjälp: skriv ut topp N ingredienser i fallande ordning */
function printTopN(freqMap, n = 1000) {
  const sorted = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
  console.log(`\n ******ANTAL RÄTTER PER KATEGORI:*****`);
  sorted.forEach(([ing, count]) => console.log(`${ing}: ${count}`));
}

/* ------------------------
   Kör allt i logisk ordning
   (anropar dina befintliga funktioner, utan att ändra dem)
   ------------------------ */
(async function main() {
  try {
    // 1) lista rätter som innehåller cream/milk/butter
    await findCreamOrMilkOrButter();

    // 2) gruppera per area och skriv ut exempel
    await funcGroupByArea();

    // 3) bygg frekvenskarta och skriv ut (valfritt: printTopN)
    const freqPerMeal = await buildIngredientFrequency_perMeal();
    printTopN(freqPerMeal, 20);

  } catch (err) {
    console.error("Något gick fel:", err);
  }
})();
