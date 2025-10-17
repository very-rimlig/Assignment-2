/*först kollar jag hur datat från API:n ser ut, använder await för att ...
await fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=a" )
  .then(res => res. json())
  .then(data => console.log(data));
*/
/* sedan hämtar jag och consoleloggar alla meals i datan
fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=a")
  .then(res => res.json())
  .then(data => {
    if (!data.meals) { //om inget objekt (korrekt term?) som heter meals hittas i datan, skriv ut nedanstående
      console.log("Inga rätter hittades.");
      return;
    } else {
    console.log(data.meals);
    }
  })
  .catch(err => console.error("Fel vid hämtning:", err));
*/

/*eftersom API:n enbart ger måltider som börjar på bokstaven "a"
kan jag plocka fram måltiderna på nedanstående vis */

/*
fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=a")
  .then(res => res.json())
  .then(data => {
    if (!data.meals) { //om inget objekt (korrekt term?) som heter meals hittas i datan, skriv ut nedanstående
      console.log("Inga rätter hittades.");
      return;
    } else {
      data.meals.forEach(meal => console.log(meal.strMeal));
    }
  })
  .catch(err => console.error("Fel vid hämtning:", err));
*/
/*men eftersom det bara är totalt fem måltider vill jag utöka sökningen
så att måltider på alla bokstäver hämtas och för det behöver jag plocka in resultat
från lika många url:er som alfabetet, därför skapar jag en funktion*/

/*här gör jag jobbet men skriver först ut alla rätter i bokstavsordning och sedan de fem första, men inom funktionen i en if-sats

const allMeals = []; //skapar en variabel/en tom lista som ska fyllas på med alla rätter oavsett första bokstav
const letters = "abcdefghijklmnopqrstuvwxyz".split("");

async function fetchAllaRatter() {
  for (const letter of letters) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    const data = await res.json();
    if (data.meals) {
      allMeals.push(...data.meals);
    }
  }
  allMeals.forEach(meal => console.log(meal.strMeal));
  allMeals.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
  const forstaFem = allMeals.slice(0, 5);
  forstaFem.forEach(meal => console.log(meal.strMeal));
}

fetchAllaRatter();
*/

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

// Funktion som hämtar alla rätter
async function fetchAllaRatter() {
  const allMeals = []; // flyttad in här för att hålla det rent
  for (const letter of letters) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    const data = await res.json();
    if (data.meals) {
      allMeals.push(...data.meals);
    }
  }
  return allMeals; // 👈 returnerar listan med alla rätter
}

// Anropa funktionen och hantera resultaten utanför
fetchAllaRatter().then(allMeals => {
  console.log("Det här är alla rätter:");
  allMeals.forEach(meal => console.log(meal.strMeal));

  console.log("\nDet här är de fem första rätterna i bokstavsordning:");
  const sorterade = allMeals.sort((a, b) => a.strMeal.localeCompare(b.strMeal));
  const forstaFem = sorterade.slice(0, 5);
  forstaFem.forEach(meal => console.log(meal.strMeal));
});
