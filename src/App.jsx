import { useState, useRef } from "react";

/* ═══════════════════════════════════════════════════
   TRANSLATIONS
═══════════════════════════════════════════════════ */
const T = {
  en: {
    appName:"MealMate", tagline:"Your daily cooking helper",
    tabs:{ plan:"Meal Plan", discover:"Recipes", pantry:"Pantry", market:"Market", saved:"Saved" },
    slots:{ breakfast:"Breakfast", lunch:"Lunch", dinner:"Dinner" },
    slotIcons:{ breakfast:"☀️", lunch:"🌤️", dinner:"🌙" },
    cookNow:"Cook This Now", viewRecipe:"See Full Recipe",
    startCooking:"Start Cooking", next:"Next Step", prev:"Previous",
    done:"Done! Time to eat! 🎉", ingredients:"Ingredients", nutrition:"Nutrition",
    tip:"Chef's Tip", step:"Step", of:"of", close:"Close",
    weeklyBudget:"Weekly Budget", dailyCost:"Cost today", allWeek:"Whole week",
    groceriesNeeded:"Need to buy", nearbyMarkets:"Nearby Markets",
    findMyLocation:"Find My Location", findingLocation:"Finding you...",
    locationFound:"Your Location", directions:"Get Directions", delivery:"Order Delivery",
    availableHere:"Available here", noSaved:"No saved recipes yet.",
    noSavedSub:"Swipe right on recipes you like!", startOver:"Start Over",
    allCaughtUp:"You've seen them all!", swipeHint:"Swipe cards left or right",
    saveLabel:"SAVE", skipLabel:"SKIP",
    mealType:"Meal type:", serves:"Serves",
    protein:"Protein", carbs:"Carbs", fat:"Fat", sodium:"Sodium",
    todayMeals:"Today's Meals", savedBy:"saved recipes",
    people:"people", forPeople:"For", adjustServings:"Adjust servings",
    pantryTitle:"My Pantry", addItem:"+ Add Item",
    pantryEmpty:"Your pantry is empty.", pantryEmptySub:"Add ingredients you have at home.",
    inStock:"In Stock", lowStock:"Running Low", outOfStock:"Out of Stock",
    haveEnough:"You have enough", needMore:"Need more", buyThis:"Need to buy",
    allIngredients:"All ingredients", missingOnly:"Missing only",
    pantryStatus:"Pantry Status", updateQty:"Tap to update",
    ingredientFor:"Ingredients for", people2:"people",
    have:"Have", need:"Need", status:"Status",
    enough:"Enough ✓", low:"Low ⚠️", missing:"Missing ✗",
    dayLabels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    distance:"away", urgent:"Buy soon",
  },
  fil: {
    appName:"MealMate", tagline:"Ang iyong katulong sa pagluluto",
    tabs:{ plan:"Plano", discover:"Mga Recipe", pantry:"Pantry", market:"Market", saved:"Na-save" },
    slots:{ breakfast:"Agahan", lunch:"Tanghalian", dinner:"Hapunan" },
    slotIcons:{ breakfast:"☀️", lunch:"🌤️", dinner:"🌙" },
    cookNow:"Lutuin Ito Ngayon", viewRecipe:"Tingnan ang Recipe",
    startCooking:"Simulan ang Pagluluto", next:"Susunod", prev:"Nakaraan",
    done:"Tapos na! Kain na! 🎉", ingredients:"Mga Sangkap", nutrition:"Sustansya",
    tip:"Tip ng Chef", step:"Hakbang", of:"sa", close:"Isara",
    weeklyBudget:"Badyet sa Linggo", dailyCost:"Gastos ngayon", allWeek:"Buong linggo",
    groceriesNeeded:"Kailangan bilhin", nearbyMarkets:"Mga Market sa Malapit",
    findMyLocation:"Hanapin ang Lokasyon Ko", findingLocation:"Hinahanap kita...",
    locationFound:"Iyong Lokasyon", directions:"Paano Pumunta", delivery:"Mag-order ng Delivery",
    availableHere:"Makikita rito", noSaved:"Wala pang na-save.",
    noSavedSub:"I-swipe pakanan ang gusto mo!", startOver:"Ulit Muli",
    allCaughtUp:"Nakita mo na lahat!", swipeHint:"I-swipe ang mga card",
    saveLabel:"I-SAVE", skipLabel:"PROX.",
    mealType:"Uri ng kain:", serves:"Para sa",
    protein:"Protina", carbs:"Carbs", fat:"Taba", sodium:"Asin",
    todayMeals:"Pagkain Ngayon", savedBy:"na-save na recipe",
    people:"tao", forPeople:"Para sa", adjustServings:"Ayusin ang servings",
    pantryTitle:"Aking Pantry", addItem:"+ Magdagdag",
    pantryEmpty:"Walang laman ang pantry mo.", pantryEmptySub:"Idagdag ang mga sangkap na mayroon ka.",
    inStock:"Sapat", lowStock:"Mababa na", outOfStock:"Wala",
    haveEnough:"Sapat ka pa", needMore:"Kailangan pa ng", buyThis:"Kailangan bilhin",
    allIngredients:"Lahat", missingOnly:"Kulang lang",
    pantryStatus:"Estado ng Pantry", updateQty:"I-tap para i-update",
    ingredientFor:"Mga sangkap para sa", people2:"na tao",
    have:"Mayroon", need:"Kailangan", status:"Estado",
    enough:"Sapat ✓", low:"Mababa ⚠️", missing:"Wala ✗",
    dayLabels:["Lun","Mar","Miy","Huw","Biy","Sab","Lin"],
    distance:"malayo", urgent:"Bilhin agad",
  }
};

/* ═══════════════════════════════════════════════════
   COLORS
═══════════════════════════════════════════════════ */
const C = {
  bg:"#faf8f4", surface:"#ffffff", card:"#f4f1eb",
  accent:"#e8703a", accentDark:"#c45a28",
  green:"#3a9e5f", blue:"#3a7ec4", red:"#e05252",
  text:"#1e1a15", muted:"#8a7d6e", border:"#e8e0d4",
  slotColors:{
    breakfast:{ bg:"#fff8ec", border:"#f4d090", fg:"#c47a10", icon:"☀️" },
    lunch:    { bg:"#ecf8f0", border:"#90d4a8", fg:"#2a7a4a", icon:"🌤️" },
    dinner:   { bg:"#ecf0f8", border:"#90a8d4", fg:"#2a4a8a", icon:"🌙" },
  },
  statusColors:{
    enough:{ bg:"#f0fff5", border:"#90d4a8", fg:"#2a7a4a", label:"✓" },
    low:   { bg:"#fffbec", border:"#f4d090", fg:"#c47a10", label:"⚠️" },
    missing:{ bg:"#fff0f0", border:"#ffb0b0", fg:"#c03030", label:"✗" },
  }
};

/* ═══════════════════════════════════════════════════
   MEALS — base amounts for 2 people, with units
═══════════════════════════════════════════════════ */
const MEALS = [
  { id:"b1", slot:"breakfast", name:"Sinangag at Itlog", region:"Filipino", time:"15 min",
    calories:340, baseCost:35, baseServings:1, image:"🍳", tags:["Filipino","Quick"],
    ingredients:[
      { key:"rice",    name_en:"Leftover Rice",   name_fil:"Kanin (Leftover)",    baseAmt:2,   unit:"cups",  pantryKey:"rice" },
      { key:"garlic",  name_en:"Garlic",           name_fil:"Bawang",              baseAmt:4,   unit:"cloves",pantryKey:"garlic" },
      { key:"eggs",    name_en:"Eggs",             name_fil:"Itlog",               baseAmt:2,   unit:"pcs",   pantryKey:"eggs" },
      { key:"oil",     name_en:"Cooking Oil",      name_fil:"Mantika",             baseAmt:1,   unit:"tbsp",  pantryKey:"oil" },
    ],
    nutrition:{ protein:"14g", carbs:"48g", fat:"12g", sodium:"420mg" },
    steps:["Heat oil. Fry garlic until golden and crispy.","Add cold leftover rice. Press and toss until heated through.","Push rice aside. Fry eggs sunny side up.","Season with salt. Serve together."],
    tip:"Cold day-old rice from the fridge makes the best sinangag." },

  { id:"b2", slot:"breakfast", name:"Champorado", region:"Filipino", time:"20 min",
    calories:380, baseCost:28, baseServings:2, image:"🍫", tags:["Filipino","Comfort"],
    ingredients:[
      { key:"glutinous_rice", name_en:"Glutinous Rice", name_fil:"Malagkit na Bigas", baseAmt:0.5, unit:"cup",  pantryKey:"glutinous_rice" },
      { key:"tablea",         name_en:"Tablea (Cacao)", name_fil:"Tablea",            baseAmt:3,   unit:"pcs",  pantryKey:"tablea" },
      { key:"sugar",          name_en:"Sugar",          name_fil:"Asukal",            baseAmt:3,   unit:"tbsp", pantryKey:"sugar" },
      { key:"milk",           name_en:"Evaporated Milk",name_fil:"Gatas",             baseAmt:4,   unit:"tbsp", pantryKey:"milk" },
    ],
    nutrition:{ protein:"8g", carbs:"62g", fat:"10g", sodium:"80mg" },
    steps:["Cook glutinous rice in 4 cups water, stirring often, about 15 minutes.","Melt tablea into porridge. Stir well.","Add sugar. Simmer 3 more minutes.","Serve with evaporated milk drizzled on top."],
    tip:"Pair with tuyo (dried fish) for the classic sweet-salty Filipino breakfast." },

  { id:"b3", slot:"breakfast", name:"Tapsilog", region:"Filipino", time:"25 min",
    calories:560, baseCost:75, baseServings:1, image:"🥩", tags:["Filipino","High Protein"],
    ingredients:[
      { key:"beef",      name_en:"Beef Tapa",    name_fil:"Beef Tapa",      baseAmt:150, unit:"g",    pantryKey:"beef" },
      { key:"rice",      name_en:"Cooked Rice",  name_fil:"Sinangag",       baseAmt:1,   unit:"cup",  pantryKey:"rice" },
      { key:"eggs",      name_en:"Eggs",         name_fil:"Itlog",          baseAmt:1,   unit:"pc",   pantryKey:"eggs" },
      { key:"soy_sauce", name_en:"Soy Sauce",    name_fil:"Toyo",           baseAmt:3,   unit:"tbsp", pantryKey:"soy_sauce" },
      { key:"calamansi", name_en:"Calamansi",    name_fil:"Calamansi",      baseAmt:3,   unit:"pcs",  pantryKey:"calamansi" },
    ],
    nutrition:{ protein:"38g", carbs:"50g", fat:"20g", sodium:"780mg" },
    steps:["Marinate beef in soy sauce, calamansi, garlic, sugar, pepper. Overnight if possible.","Pan-fry tapa on high heat 2–3 min per side until caramelized.","Prepare sinangag and fry egg sunny side up.","Plate: rice + tapa + egg. Serve with calamansi and soy sauce."],
    tip:"Freeze beef 20 min before marinating — it absorbs flavor much better." },

  { id:"l1", slot:"lunch", name:"Chicken Adobo", region:"Filipino", time:"40 min",
    calories:430, baseCost:85, baseServings:3, image:"🍗", tags:["Filipino","High Protein"],
    ingredients:[
      { key:"chicken",   name_en:"Chicken",      name_fil:"Manok",          baseAmt:500, unit:"g",    pantryKey:"chicken" },
      { key:"soy_sauce", name_en:"Soy Sauce",    name_fil:"Toyo",           baseAmt:0.5, unit:"cup",  pantryKey:"soy_sauce" },
      { key:"vinegar",   name_en:"Cane Vinegar", name_fil:"Suka",           baseAmt:0.5, unit:"cup",  pantryKey:"vinegar" },
      { key:"garlic",    name_en:"Garlic",        name_fil:"Bawang",         baseAmt:8,   unit:"cloves",pantryKey:"garlic" },
      { key:"bay_leaves",name_en:"Bay Leaves",   name_fil:"Bay Leaves",     baseAmt:3,   unit:"pcs",  pantryKey:"bay_leaves" },
    ],
    nutrition:{ protein:"38g", carbs:"6g", fat:"22g", sodium:"820mg" },
    steps:["Marinate chicken in soy sauce, vinegar, garlic, bay leaves for 30 minutes.","Brown chicken in hot oil, 3–4 min per side.","Add marinade + ½ cup water. Boil then simmer 20–25 min uncovered.","Let sauce reduce until sticky. Serve over steamed rice."],
    tip:"Tastes even better the next day — make a big batch!" },

  { id:"l2", slot:"lunch", name:"Sinigang na Baboy", region:"Filipino", time:"75 min",
    calories:390, baseCost:120, baseServings:4, image:"🍲", tags:["Filipino","Soup"],
    ingredients:[
      { key:"pork",      name_en:"Pork Ribs",    name_fil:"Tadyang ng Baboy",baseAmt:600, unit:"g",   pantryKey:"pork" },
      { key:"tamarind",  name_en:"Tamarind",     name_fil:"Sampalok",        baseAmt:200, unit:"g",   pantryKey:"tamarind" },
      { key:"kangkong",  name_en:"Kangkong",     name_fil:"Kangkong",        baseAmt:1,   unit:"bundle",pantryKey:"kangkong" },
      { key:"tomatoes",  name_en:"Tomatoes",     name_fil:"Kamatis",         baseAmt:3,   unit:"pcs", pantryKey:"tomatoes" },
      { key:"onion",     name_en:"Onion",        name_fil:"Sibuyas",         baseAmt:1,   unit:"pc",  pantryKey:"onion" },
      { key:"fish_sauce",name_en:"Fish Sauce",   name_fil:"Patis",           baseAmt:2,   unit:"tbsp",pantryKey:"fish_sauce" },
    ],
    nutrition:{ protein:"32g", carbs:"12g", fat:"18g", sodium:"780mg" },
    steps:["Boil pork with onion. Skim foam. Simmer 45 min until tender.","Add tamarind broth, tomatoes. Simmer 10 min.","Season with fish sauce. Add kangkong last — 2 minutes only.","Serve hot with rice and patis."],
    tip:"No sampalok? Green mango or guava makes a great substitute." },

  { id:"l3", slot:"lunch", name:"Kare-Kare", region:"Filipino", time:"90 min",
    calories:520, baseCost:180, baseServings:5, image:"🥜", tags:["Filipino","Special"],
    ingredients:[
      { key:"beef",        name_en:"Oxtail / Beef Pata", name_fil:"Oxtail / Beef Pata",baseAmt:600,unit:"g",  pantryKey:"beef" },
      { key:"peanut_butter",name_en:"Peanut Butter",     name_fil:"Peanut Butter",     baseAmt:0.5,unit:"cup",pantryKey:"peanut_butter" },
      { key:"eggplant",    name_en:"Eggplant",           name_fil:"Talong",            baseAmt:2,  unit:"pcs",pantryKey:"eggplant" },
      { key:"sitaw",       name_en:"String Beans (Sitaw)",name_fil:"Sitaw",            baseAmt:100,unit:"g",  pantryKey:"sitaw" },
      { key:"bagoong",     name_en:"Bagoong Alamang",    name_fil:"Bagoong Alamang",   baseAmt:4,  unit:"tbsp",pantryKey:"bagoong" },
    ],
    nutrition:{ protein:"41g", carbs:"22g", fat:"34g", sodium:"710mg" },
    steps:["Boil meat 1.5–2 hours until very tender. Reserve broth.","Sauté garlic and onion. Add meat and 4 cups broth. Stir in peanut butter.","Simmer 15 min until thick. Add vegetables, cook 8 min.","Serve with sautéed bagoong alamang."],
    tip:"The bagoong is essential — it balances the rich peanut sauce perfectly." },

  { id:"l4", slot:"lunch", name:"Japanese Gyudon", region:"Japanese", time:"25 min",
    calories:480, baseCost:130, baseServings:2, image:"🥢", tags:["Asian","Quick"],
    ingredients:[
      { key:"beef",      name_en:"Beef Sukiyaki Slices",name_fil:"Beef Sukiyaki",baseAmt:200,unit:"g",  pantryKey:"beef" },
      { key:"onion",     name_en:"Onion",              name_fil:"Sibuyas",       baseAmt:1,  unit:"pc", pantryKey:"onion" },
      { key:"soy_sauce", name_en:"Japanese Soy Sauce", name_fil:"Japanese Toyo",baseAmt:3,  unit:"tbsp",pantryKey:"soy_sauce" },
      { key:"mirin",     name_en:"Mirin",              name_fil:"Mirin",         baseAmt:2,  unit:"tbsp",pantryKey:"mirin" },
      { key:"eggs",      name_en:"Soft-boiled Eggs",   name_fil:"Soft-boiled Itlog",baseAmt:2,unit:"pcs",pantryKey:"eggs" },
    ],
    nutrition:{ protein:"29g", carbs:"52g", fat:"16g", sodium:"890mg" },
    steps:["Mix soy sauce, mirin, sake, dashi, sugar into tsuyu sauce.","Simmer onions in tsuyu 5 min. Lay beef over, cook 2–3 min.","Soft-boil eggs 6.5 min, ice bath, peel and halve.","Serve beef over rice. Top with egg and pickled ginger."],
    tip:"Pre-sliced sukiyaki beef from Asian mart works perfectly here." },

  { id:"d1", slot:"dinner", name:"Beef Nilaga", region:"Filipino", time:"90 min",
    calories:360, baseCost:140, baseServings:4, image:"🥩", tags:["Filipino","Soup","Healthy"],
    ingredients:[
      { key:"beef",      name_en:"Beef Brisket", name_fil:"Beef Brisket",baseAmt:500,unit:"g",  pantryKey:"beef" },
      { key:"potato",    name_en:"Potato",       name_fil:"Patatas",     baseAmt:2,  unit:"pcs",pantryKey:"potato" },
      { key:"cabbage",   name_en:"Cabbage",      name_fil:"Repolyo",     baseAmt:0.5,unit:"head",pantryKey:"cabbage" },
      { key:"corn",      name_en:"Corn",         name_fil:"Mais",        baseAmt:1,  unit:"pc", pantryKey:"corn" },
      { key:"onion",     name_en:"Onion",        name_fil:"Sibuyas",     baseAmt:1,  unit:"pc", pantryKey:"onion" },
      { key:"fish_sauce",name_en:"Fish Sauce",   name_fil:"Patis",       baseAmt:2,  unit:"tbsp",pantryKey:"fish_sauce" },
    ],
    nutrition:{ protein:"35g", carbs:"20g", fat:"14g", sodium:"560mg" },
    steps:["Boil beef with onion and peppercorns. Skim foam. Simmer 60–70 min.","Add corn and potatoes. Cook 12 min.","Add cabbage. Season with fish sauce. Cook 3 min.","Serve in bowl with rice and calamansi."],
    tip:"Low and slow cooking melts the collagen into a silky, rich broth." },

  { id:"d2", slot:"dinner", name:"Sizzling Sisig", region:"Filipino", time:"30 min",
    calories:490, baseCost:95, baseServings:2, image:"🥘", tags:["Filipino","Sizzling"],
    ingredients:[
      { key:"pork",      name_en:"Pork Belly",   name_fil:"Liempo",      baseAmt:300,unit:"g",  pantryKey:"pork" },
      { key:"onion",     name_en:"Onion",        name_fil:"Sibuyas",     baseAmt:1,  unit:"pc", pantryKey:"onion" },
      { key:"calamansi", name_en:"Calamansi",    name_fil:"Calamansi",   baseAmt:4,  unit:"pcs",pantryKey:"calamansi" },
      { key:"soy_sauce", name_en:"Soy Sauce",    name_fil:"Toyo",        baseAmt:2,  unit:"tbsp",pantryKey:"soy_sauce" },
      { key:"eggs",      name_en:"Egg",          name_fil:"Itlog",       baseAmt:1,  unit:"pc", pantryKey:"eggs" },
    ],
    nutrition:{ protein:"34g", carbs:"8g", fat:"34g", sodium:"860mg" },
    steps:["Boil then grill or air-fry pork until crispy. Chop finely.","Mix pork with onion, calamansi, chili, soy sauce.","Heat sizzling plate very hot. Add butter.","Pour sisig. It will sizzle! Top with raw egg. Stir at table."],
    tip:"The hotter the plate, the more dramatic and delicious the result." },

  { id:"d3", slot:"dinner", name:"Pinakbet", region:"Filipino", time:"35 min",
    calories:280, baseCost:70, baseServings:3, image:"🥬", tags:["Filipino","Healthy"],
    ingredients:[
      { key:"eggplant",  name_en:"Eggplant",     name_fil:"Talong",      baseAmt:2,  unit:"pcs",pantryKey:"eggplant" },
      { key:"ampalaya",  name_en:"Ampalaya (Bitter Gourd)",name_fil:"Ampalaya",baseAmt:1,unit:"pc",pantryKey:"ampalaya" },
      { key:"sitaw",     name_en:"String Beans", name_fil:"Sitaw",       baseAmt:100,unit:"g",  pantryKey:"sitaw" },
      { key:"squash",    name_en:"Squash (Kalabasa)",name_fil:"Kalabasa", baseAmt:200,unit:"g",  pantryKey:"squash" },
      { key:"fish_sauce",name_en:"Fish Sauce",   name_fil:"Patis",       baseAmt:2,  unit:"tbsp",pantryKey:"fish_sauce" },
      { key:"bagoong",   name_en:"Bagoong Isda", name_fil:"Bagoong Isda",baseAmt:3,  unit:"tbsp",pantryKey:"bagoong" },
    ],
    nutrition:{ protein:"12g", carbs:"22g", fat:"10g", sodium:"640mg" },
    steps:["Sauté garlic and onion. Add tomatoes until mushy.","Add bagoong isda. Cook 2 min.","Add squash and sitaw. Cook 5 min.","Add eggplant, okra, ampalaya. Cover and cook 8–10 min. Do not over-stir."],
    tip:"Salt and squeeze ampalaya slices before cooking to reduce bitterness if preferred." },
];

const WEEK_PLAN = [
  { b:"b1", l:"l1", d:"d1" }, { b:"b2", l:"l2", d:"d3" },
  { b:"b3", l:"l3", d:"d2" }, { b:"b2", l:"l4", d:"d1" },
  { b:"b1", l:"l5", d:"d2" }, { b:"b3", l:"l1", d:"d3" },
  { b:"b2", l:"l3", d:"d1" },
];

/* Initial pantry — quantities represent "units" matching the recipe units */
const INITIAL_PANTRY = {
  rice:          { name_en:"Rice",            name_fil:"Bigas / Kanin",      qty:8,   unit:"cups",   category:"Grains",    icon:"🍚" },
  glutinous_rice:{ name_en:"Glutinous Rice",  name_fil:"Malagkit na Bigas",  qty:1,   unit:"cup",    category:"Grains",    icon:"🍚" },
  chicken:       { name_en:"Chicken",         name_fil:"Manok",              qty:500, unit:"g",      category:"Meat",      icon:"🍗" },
  pork:          { name_en:"Pork",            name_fil:"Baboy",              qty:300, unit:"g",      category:"Meat",      icon:"🥩" },
  beef:          { name_en:"Beef",            name_fil:"Baka",               qty:0,   unit:"g",      category:"Meat",      icon:"🥩" },
  eggs:          { name_en:"Eggs",            name_fil:"Itlog",              qty:6,   unit:"pcs",    category:"Protein",   icon:"🥚" },
  garlic:        { name_en:"Garlic",          name_fil:"Bawang",             qty:12,  unit:"cloves", category:"Vegetable", icon:"🧄" },
  onion:         { name_en:"Onion",           name_fil:"Sibuyas",            qty:3,   unit:"pcs",    category:"Vegetable", icon:"🧅" },
  tomatoes:      { name_en:"Tomatoes",        name_fil:"Kamatis",            qty:4,   unit:"pcs",    category:"Vegetable", icon:"🍅" },
  eggplant:      { name_en:"Eggplant",        name_fil:"Talong",             qty:2,   unit:"pcs",    category:"Vegetable", icon:"🍆" },
  kangkong:      { name_en:"Kangkong",        name_fil:"Kangkong",           qty:1,   unit:"bundle", category:"Vegetable", icon:"🥬" },
  ampalaya:      { name_en:"Ampalaya",        name_fil:"Ampalaya",           qty:0,   unit:"pc",     category:"Vegetable", icon:"🥒" },
  sitaw:         { name_en:"String Beans",    name_fil:"Sitaw",              qty:100, unit:"g",      category:"Vegetable", icon:"🫛" },
  squash:        { name_en:"Squash",          name_fil:"Kalabasa",           qty:0,   unit:"g",      category:"Vegetable", icon:"🎃" },
  potato:        { name_en:"Potato",          name_fil:"Patatas",            qty:3,   unit:"pcs",    category:"Vegetable", icon:"🥔" },
  cabbage:       { name_en:"Cabbage",         name_fil:"Repolyo",            qty:1,   unit:"head",   category:"Vegetable", icon:"🥬" },
  corn:          { name_en:"Corn",            name_fil:"Mais",               qty:2,   unit:"pcs",    category:"Vegetable", icon:"🌽" },
  tamarind:      { name_en:"Tamarind",        name_fil:"Sampalok",           qty:0,   unit:"g",      category:"Pantry",    icon:"🍋" },
  soy_sauce:     { name_en:"Soy Sauce",       name_fil:"Toyo",               qty:0.75,unit:"cup",    category:"Pantry",    icon:"🍶" },
  vinegar:       { name_en:"Cane Vinegar",    name_fil:"Suka",               qty:0.5, unit:"cup",    category:"Pantry",    icon:"🍾" },
  fish_sauce:    { name_en:"Fish Sauce",      name_fil:"Patis",              qty:0.25,unit:"cup",    category:"Pantry",    icon:"🍾" },
  bay_leaves:    { name_en:"Bay Leaves",      name_fil:"Bay Leaves",         qty:5,   unit:"pcs",    category:"Pantry",    icon:"🌿" },
  oil:           { name_en:"Cooking Oil",     name_fil:"Mantika",            qty:1,   unit:"cup",    category:"Pantry",    icon:"🫙" },
  sugar:         { name_en:"Sugar",           name_fil:"Asukal",             qty:0.5, unit:"cup",    category:"Pantry",    icon:"🍬" },
  milk:          { name_en:"Evaporated Milk", name_fil:"Gatas",              qty:0.5, unit:"cup",    category:"Pantry",    icon:"🥛" },
  calamansi:     { name_en:"Calamansi",       name_fil:"Calamansi",          qty:8,   unit:"pcs",    category:"Pantry",    icon:"🍋" },
  tablea:        { name_en:"Tablea",          name_fil:"Tablea",             qty:0,   unit:"pcs",    category:"Pantry",    icon:"🍫" },
  mirin:         { name_en:"Mirin",           name_fil:"Mirin",              qty:0,   unit:"tbsp",   category:"Pantry",    icon:"🍾" },
  peanut_butter: { name_en:"Peanut Butter",   name_fil:"Peanut Butter",      qty:0.5, unit:"cup",    category:"Pantry",    icon:"🥜" },
  bagoong:       { name_en:"Bagoong",         name_fil:"Bagoong",            qty:0,   unit:"tbsp",   category:"Pantry",    icon:"🫙" },
};

const MARKETS = [
  { id:1, name:"Antipolo Public Market", type_en:"Public Market", type_fil:"Palengke", dist:0.3,
    open:"4AM – 8PM", rating:4.4, badge_en:"Closest", badge_fil:"Pinaka-Malapit", color:"#3a9e5f",
    items:["chicken","pork","kangkong","eggplant","tamarind","garlic","onion","tomatoes","sitaw","ampalaya"] },
  { id:2, name:"SM Supermarket", type_en:"Supermarket", type_fil:"Supermarket", dist:1.2,
    open:"9AM – 9PM", rating:4.2, badge_en:"Biggest", badge_fil:"Pinakamalaki", color:"#3a7ec4",
    items:["mirin","soy_sauce","vinegar","peanut_butter","sugar","milk","oil"] },
  { id:3, name:"Korean & Asian Grocery", type_en:"Specialty Store", type_fil:"Specialty Store", dist:2.4,
    open:"10AM – 8PM", rating:4.7, badge_en:"Best for Asian", badge_fil:"Best para Asian", color:"#e05252",
    items:["mirin","bagoong","tablea","fish_sauce"] },
  { id:4, name:"7-Eleven", type_en:"Convenience", type_fil:"Convenience", dist:0.1,
    open:"24 Hours", rating:3.8, badge_en:"24/7", badge_fil:"24/7", color:"#e8703a",
    items:["eggs","oil","soy_sauce","vinegar","sugar"] },
  { id:5, name:"Barangay Talipapa", type_en:"Local Market", type_fil:"Talipapa", dist:0.6,
    open:"5AM – 2PM", rating:4.5, badge_en:"Cheapest", badge_fil:"Pinaka-Mura", color:"#9b59b6",
    items:["pork","beef","chicken","tamarind","bagoong","fish_sauce","kangkong","calamansi"] },
];

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
function scaleAmt(baseAmt, baseServings, people) {
  const scaled = (baseAmt / baseServings) * people;
  if (scaled >= 1000 && ["g"].includes("g")) {
    return { val: (scaled/1000).toFixed(1).replace(/\.0$/,""), unit:"kg" };
  }
  if (scaled < 1) return { val: scaled.toFixed(2).replace(/\.?0+$/,""), unit:null };
  if (Number.isInteger(scaled)) return { val: scaled, unit:null };
  return { val: parseFloat(scaled.toFixed(1)), unit:null };
}

function formatAmt(baseAmt, baseServings, people, unit) {
  const ratio = people / baseServings;
  const scaled = baseAmt * ratio;
  if (unit === "g" && scaled >= 1000) return `${(scaled/1000).toFixed(1).replace(/\.0$/,"")} kg`;
  if (scaled < 1) return `${scaled.toFixed(2).replace(/\.?0+$/,"")} ${unit}`;
  if (Number.isInteger(scaled)) return `${scaled} ${unit}`;
  return `${parseFloat(scaled.toFixed(1))} ${unit}`;
}

function getIngredientStatus(ingredient, pantry, people, baseServings) {
  const pantryItem = pantry[ingredient.pantryKey];
  if (!pantryItem) return "missing";
  const needed = (ingredient.baseAmt / baseServings) * people;
  const have = pantryItem.qty;
  if (have <= 0) return "missing";
  if (have >= needed) return "enough";
  return "low";
}

/* ═══════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════ */
export default function MealMate() {
  const [lang, setLang]         = useState("fil");
  const [tab, setTab]           = useState("plan");
  const [people, setPeople]     = useState(3);
  const [dayIdx, setDayIdx]     = useState(0);
  const [slot, setSlot]         = useState("breakfast");
  const [swipeSlot, setSwipeSlot] = useState("all");
  const [swipeIdx, setSwipeIdx] = useState(0);
  const [saved, setSaved]       = useState([]);
  const [skipped, setSkipped]   = useState([]);
  const [recipe, setRecipe]     = useState(null);
  const [cookMode, setCookMode] = useState(false);
  const [cookStep, setCookStep] = useState(0);
  const [dragX, setDragX]       = useState(0);
  const [dragging, setDragging] = useState(false);
  const [swipeAnim, setSwipeAnim] = useState(null);
  const [pantry, setPantry]     = useState(INITIAL_PANTRY);
  const [editingKey, setEditingKey] = useState(null);
  const [editVal, setEditVal]   = useState("");
  const [selMarket, setSelMarket] = useState(null);
  const [locStatus, setLocStatus] = useState("idle");
  const [pantryFilter, setPantryFilter] = useState("all"); // all | low | missing
  const dragStart = useRef(null);
  const t = T[lang];

  const swipeMeals = MEALS.filter(m =>
    (swipeSlot === "all" || m.slot === swipeSlot) && !skipped.includes(m.id)
  );
  const current = swipeMeals[swipeIdx % Math.max(swipeMeals.length, 1)];

  function doSwipe(dir) {
    setSwipeAnim(dir);
    setTimeout(() => {
      if (dir === "right") setSaved(p => [...new Set([...p, current.id])]);
      else setSkipped(p => [...p, current.id]);
      setSwipeIdx(i => i + 1);
      setSwipeAnim(null); setDragX(0);
    }, 280);
  }
  function mdown(e) { dragStart.current = e.clientX; setDragging(true); }
  function mmove(e) { if (dragging) setDragX(e.clientX - dragStart.current); }
  function mup() {
    if (!dragging) return; setDragging(false);
    if (dragX > 70) doSwipe("right");
    else if (dragX < -70) doSwipe("left");
    else setDragX(0);
  }
  const cardTx  = swipeAnim==="right"?420:swipeAnim==="left"?-420:dragX;
  const cardRot = swipeAnim==="right"?15:swipeAnim==="left"?-15:dragX/18;

  function openRecipe(m) { setRecipe(m); setCookMode(false); setCookStep(0); }

  function getMealReadiness(meal) {
    const statuses = meal.ingredients.map(ing =>
      getIngredientStatus(ing, pantry, people, meal.baseServings)
    );
    if (statuses.every(s => s === "enough")) return "ready";
    if (statuses.some(s => s === "missing")) return "missing";
    return "low";
  }

  const day = WEEK_PLAN[dayIdx];
  const slotMealId = day[slot[0]]; // b/l/d
  const slotMeal = MEALS.find(m => m.id === slotMealId);
  const dailyCost = (
    MEALS.find(m=>m.id===day.b)?.baseCost * (people/MEALS.find(m=>m.id===day.b)?.baseServings) +
    MEALS.find(m=>m.id===day.l)?.baseCost * (people/MEALS.find(m=>m.id===day.l)?.baseServings) +
    MEALS.find(m=>m.id===day.d)?.baseCost * (people/MEALS.find(m=>m.id===day.d)?.baseServings)
  );
  const weeklyTotal = WEEK_PLAN.reduce((s, d) => {
    return s +
      (MEALS.find(m=>m.id===d.b)?.baseCost * (people/MEALS.find(m=>m.id===d.b)?.baseServings) || 0) +
      (MEALS.find(m=>m.id===d.l)?.baseCost * (people/MEALS.find(m=>m.id===d.l)?.baseServings) || 0) +
      (MEALS.find(m=>m.id===d.d)?.baseCost * (people/MEALS.find(m=>m.id===d.d)?.baseServings) || 0);
  }, 0);

  /* — PEOPLE SELECTOR — */
  function PeopleSelector({ minimal }) {
    return (
      <div style={{ display:"flex", alignItems:"center", gap: minimal ? 6 : 10,
        background: minimal ? "transparent" : C.card,
        borderRadius:14, padding: minimal ? 0 : "10px 14px",
        border: minimal ? "none" : `1.5px solid ${C.border}` }}>
        {!minimal && <span style={{ fontSize:20 }}>👨‍👩‍👧‍👦</span>}
        {!minimal && <span style={{ fontSize:13, color:C.muted, flex:1 }}>{t.forPeople}</span>}
        <button onClick={() => setPeople(p => Math.max(1, p-1))} style={{
          width:32, height:32, borderRadius:"50%", border:`1.5px solid ${C.border}`,
          background:C.surface, color:C.text, fontSize:18, cursor:"pointer", fontWeight:700,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>−</button>
        <span style={{ fontSize: minimal ? 16 : 20, fontWeight:800, color:C.accent, minWidth:28, textAlign:"center" }}>
          {people}
        </span>
        <button onClick={() => setPeople(p => Math.min(12, p+1))} style={{
          width:32, height:32, borderRadius:"50%", border:`1.5px solid ${C.border}`,
          background:C.surface, color:C.text, fontSize:18, cursor:"pointer", fontWeight:700,
          display:"flex", alignItems:"center", justifyContent:"center",
        }}>+</button>
        {!minimal && <span style={{ fontSize:13, color:C.muted }}>{t.people}</span>}
      </div>
    );
  }

  /* — READINESS BADGE — */
  function ReadinessBadge({ meal }) {
    const r = getMealReadiness(meal);
    const styles = {
      ready:   { bg:"#f0fff5", fg:"#2a7a4a", border:"#90d4a8", label: lang==="en"?"✓ Ready to cook":"✓ Pwede na lutuin" },
      low:     { bg:"#fffbec", fg:"#c47a10", border:"#f4d090", label: lang==="en"?"⚠️ Some missing":"⚠️ May kulang" },
      missing: { bg:"#fff0f0", fg:"#c03030", border:"#ffb0b0", label: lang==="en"?"✗ Buy ingredients":"✗ Bumili muna" },
    }[r];
    return (
      <span style={{ background:styles.bg, color:styles.fg, border:`1px solid ${styles.border}`,
        borderRadius:20, padding:"3px 10px", fontSize:11, fontWeight:700 }}>
        {styles.label}
      </span>
    );
  }

  /* ─── PLAN SCREEN ─── */
  function PlanScreen() {
    const slotKey = { breakfast:"b", lunch:"l", dinner:"d" }[slot];
    const slotMeal = MEALS.find(m => m.id === day[slotKey]);
    const slotCost = slotMeal ? Math.round(slotMeal.baseCost * (people / slotMeal.baseServings)) : 0;
    return (
      <div style={{ flex:1, overflowY:"auto", padding:"0 0 8px" }}>
        {/* People + Day selector row */}
        <div style={{ padding:"0 18px 14px", display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <PeopleSelector minimal={false} />
        </div>
        <div style={{ padding:"0 18px 14px" }}>
          <div style={{ display:"flex", gap:6 }}>
            {t.dayLabels.map((d, i) => (
              <button key={i} onClick={() => setDayIdx(i)} style={{
                flex:1, padding:"10px 0", borderRadius:12,
                background: i===dayIdx ? C.accent : C.surface,
                color: i===dayIdx ? "#fff" : C.muted,
                border:`1.5px solid ${i===dayIdx ? C.accent : C.border}`,
                fontWeight:700, fontSize:11, cursor:"pointer",
              }}>{d}</button>
            ))}
          </div>
        </div>

        {/* Slot tabs */}
        <div style={{ display:"flex", padding:"0 18px 14px" }}>
          {["breakfast","lunch","dinner"].map(s => {
            const sc = C.slotColors[s];
            return (
              <button key={s} onClick={() => setSlot(s)} style={{
                flex:1, padding:"11px 4px", cursor:"pointer",
                background: slot===s ? sc.bg : C.surface,
                color: slot===s ? sc.fg : C.muted,
                border:`1.5px solid ${slot===s ? sc.border : C.border}`,
                borderRadius: s==="breakfast"?"12px 0 0 12px":s==="dinner"?"0 12px 12px 0":"0",
                fontSize:12, fontWeight:700, transition:"all 0.15s",
              }}>
                <div style={{ fontSize:18 }}>{sc.icon}</div>
                <div style={{ fontSize:11, marginTop:2 }}>{t.slots[s]}</div>
              </button>
            );
          })}
        </div>

        {/* Selected meal card */}
        {slotMeal && (() => {
          const sc = C.slotColors[slot];
          return (
            <div style={{ margin:"0 18px 14px", background:sc.bg,
              borderRadius:18, padding:16, border:`1.5px solid ${sc.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:11, color:sc.fg, fontWeight:700, margin:"0 0 3px", textTransform:"uppercase" }}>
                    {t.dayLabels[dayIdx]} · {t.slots[slot]}
                  </p>
                  <h2 style={{ fontSize:19, fontWeight:800, color:C.text, margin:"0 0 4px", lineHeight:1.2 }}>
                    {slotMeal.name}
                  </h2>
                  <p style={{ fontSize:12, color:C.muted, margin:"0 0 6px" }}>⏱ {slotMeal.time} · {slotMeal.calories} kcal</p>
                  <ReadinessBadge meal={slotMeal} />
                </div>
                <span style={{ fontSize:44, marginLeft:8 }}>{slotMeal.image}</span>
              </div>
              <div style={{ background:"#ffffff88", borderRadius:12, padding:"8px 12px", marginBottom:12 }}>
                <p style={{ fontSize:12, color:sc.fg, fontWeight:700, margin:"0 0 4px" }}>
                  {t.forPeople} {people} {t.people}:
                </p>
                <p style={{ fontSize:13, color:C.text, margin:0, lineHeight:1.7 }}>
                  {slotMeal.ingredients.slice(0,3).map((ing, i) => (
                    <span key={i}>
                      {formatAmt(ing.baseAmt, slotMeal.baseServings, people, ing.unit)}{" "}
                      {lang==="en" ? ing.name_en : ing.name_fil}
                      {i < 2 ? " · " : "…"}
                    </span>
                  ))}
                </p>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => openRecipe(slotMeal)} style={{
                  flex:1, background:C.accent, color:"#fff", border:"none",
                  borderRadius:12, padding:"11px", fontSize:13, fontWeight:700, cursor:"pointer",
                  boxShadow:"0 2px 10px #e8703a44",
                }}>🍳 {t.cookNow}</button>
                <div style={{
                  background:C.surface, borderRadius:12, padding:"11px 14px",
                  fontSize:15, color:sc.fg, fontWeight:800,
                  border:`1.5px solid ${sc.border}`, whiteSpace:"nowrap",
                }}>₱{slotCost}</div>
              </div>
            </div>
          );
        })()}

        {/* Day overview */}
        <div style={{ padding:"0 18px" }}>
          <p style={{ fontSize:13, color:C.muted, fontWeight:600, margin:"0 0 8px" }}>{t.todayMeals}</p>
          {[["b","breakfast"],["l","lunch"],["d","dinner"]].map(([key, s]) => {
            const m = MEALS.find(x => x.id === day[key]);
            const sc = C.slotColors[s];
            const cost = m ? Math.round(m.baseCost * (people / m.baseServings)) : 0;
            const readiness = m ? getMealReadiness(m) : "missing";
            const rdot = { ready:"#3a9e5f", low:"#c47a10", missing:"#e05252" }[readiness];
            return (
              <div key={s} onClick={() => setSlot(s)} style={{
                display:"flex", alignItems:"center", gap:12,
                background: slot===s ? sc.bg : C.surface,
                border:`1.5px solid ${slot===s ? sc.border : C.border}`,
                borderRadius:14, padding:"11px 14px", marginBottom:8, cursor:"pointer",
              }}>
                <span style={{ fontSize:26 }}>{m?.image}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:11, color:sc.fg, fontWeight:700, margin:"0 0 2px", textTransform:"uppercase" }}>
                    {sc.icon} {t.slots[s]}
                  </p>
                  <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>{m?.name}</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5, justifyContent:"flex-end", marginBottom:3 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:rdot }}/>
                  </div>
                  <span style={{ fontSize:14, color:sc.fg, fontWeight:700 }}>₱{cost}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ margin:"14px 18px 0", background:C.surface, borderRadius:16,
          padding:"14px 18px", border:`1.5px solid ${C.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ fontSize:12, color:C.muted, margin:"0 0 3px" }}>{t.dailyCost}</p>
            <p style={{ fontSize:24, fontWeight:800, color:C.accent, margin:0 }}>₱{Math.round(dailyCost)}</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontSize:12, color:C.muted, margin:"0 0 3px" }}>{t.allWeek}</p>
            <p style={{ fontSize:24, fontWeight:800, color:C.green, margin:0 }}>₱{Math.round(weeklyTotal).toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  /* ─── PANTRY SCREEN ─── */
  function PantryScreen() {
    const entries = Object.entries(pantry);
    const missing = entries.filter(([,v]) => v.qty <= 0);
    const low     = entries.filter(([,v]) => v.qty > 0 && v.qty < 3 &&
      !["cup","cups","tbsp"].includes(v.unit));
    const counts  = { all:entries.length, missing:missing.length, low:low.length };

    const shown = entries.filter(([,v]) => {
      if (pantryFilter === "missing") return v.qty <= 0;
      if (pantryFilter === "low")     return v.qty > 0 && v.qty < 3 && !["cup","cups","tbsp"].includes(v.unit);
      return true;
    });

    const categories = [...new Set(shown.map(([,v]) => v.category))];

    return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Filter tabs */}
        <div style={{ display:"flex", gap:0, padding:"0 18px 12px" }}>
          {[
            { id:"all",     label: lang==="en"?"All Items":"Lahat",    count:counts.all },
            { id:"low",     label: lang==="en"?"Running Low":"Mababa", count:counts.low,    color:"#c47a10" },
            { id:"missing", label: lang==="en"?"Missing":"Wala",       count:counts.missing, color:"#c03030" },
          ].map((f,i) => (
            <button key={f.id} onClick={() => setPantryFilter(f.id)} style={{
              flex:1, padding:"9px 4px", cursor:"pointer", fontSize:12, fontWeight:700,
              background: pantryFilter===f.id ? (f.color || C.accent) : C.surface,
              color: pantryFilter===f.id ? "#fff" : (f.color || C.muted),
              border:`1.5px solid ${pantryFilter===f.id ? (f.color||C.accent) : C.border}`,
              borderRadius: i===0?"12px 0 0 12px":i===2?"0 12px 12px 0":"0",
            }}>
              {f.label} {f.count > 0 && <span style={{ opacity:0.8 }}>({f.count})</span>}
            </button>
          ))}
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"0 18px 16px" }}>
          {shown.length === 0 ? (
            <div style={{ textAlign:"center", paddingTop:40, color:C.muted }}>
              <div style={{ fontSize:40 }}>✅</div>
              <p style={{ marginTop:10 }}>{lang==="en"?"All good! Nothing missing.":"Kumpleto! Walang kulang."}</p>
            </div>
          ) : (
            categories.map(cat => {
              const catItems = shown.filter(([,v]) => v.category === cat);
              return (
                <div key={cat}>
                  <p style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase",
                    letterSpacing:0.5, margin:"14px 0 6px" }}>{cat}</p>
                  {catItems.map(([key, item]) => {
                    const isEditing = editingKey === key;
                    const statusColor = item.qty <= 0 ? "#c03030" :
                      (item.qty < 3 && !["cup","cups","tbsp"].includes(item.unit)) ? "#c47a10" : "#2a7a4a";
                    const statusBg = item.qty <= 0 ? "#fff0f0" :
                      (item.qty < 3 && !["cup","cups","tbsp"].includes(item.unit)) ? "#fffbec" : "#f0fff5";
                    const statusLabel = item.qty <= 0
                      ? (lang==="en"?"Out of Stock":"Wala")
                      : (item.qty < 3 && !["cup","cups","tbsp"].includes(item.unit))
                        ? (lang==="en"?"Running Low":"Mababa")
                        : (lang==="en"?"In Stock":"Sapat");
                    return (
                      <div key={key} style={{
                        background:C.surface, borderRadius:14, padding:"12px 14px",
                        marginBottom:8, border:`1.5px solid ${item.qty<=0?"#ffb0b0":C.border}`,
                        display:"flex", alignItems:"center", gap:12,
                      }}>
                        <span style={{ fontSize:24, flexShrink:0 }}>{item.icon}</span>
                        <div style={{ flex:1 }}>
                          <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:"0 0 3px" }}>
                            {lang==="en" ? item.name_en : item.name_fil}
                          </p>
                          {isEditing ? (
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <input
                                type="number" step="0.5" min="0"
                                value={editVal}
                                onChange={e => setEditVal(e.target.value)}
                                style={{ width:64, padding:"4px 8px", border:`1.5px solid ${C.accent}`,
                                  borderRadius:8, fontSize:14, color:C.text }}
                                autoFocus
                              />
                              <span style={{ fontSize:12, color:C.muted }}>{item.unit}</span>
                              <button onClick={() => {
                                const v = parseFloat(editVal);
                                if (!isNaN(v) && v >= 0) {
                                  setPantry(p => ({ ...p, [key]:{ ...p[key], qty:v } }));
                                }
                                setEditingKey(null);
                              }} style={{ background:C.accent, color:"#fff", border:"none",
                                borderRadius:8, padding:"4px 10px", fontWeight:700, cursor:"pointer", fontSize:12 }}>
                                {lang==="en"?"Save":"I-save"}
                              </button>
                              <button onClick={() => setEditingKey(null)} style={{ background:C.card,
                                color:C.muted, border:`1px solid ${C.border}`, borderRadius:8,
                                padding:"4px 8px", cursor:"pointer", fontSize:12 }}>✕</button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditingKey(key); setEditVal(String(item.qty)); }}
                              style={{ background:"none", border:"none", cursor:"pointer", padding:0,
                                fontSize:13, color:C.muted, textAlign:"left" }}>
                              <span style={{ fontWeight:600, color: statusColor }}>
                                {item.qty} {item.unit}
                              </span>
                              <span style={{ color:C.border }}> · </span>
                              <span style={{ color:C.accent, textDecoration:"underline", fontSize:12 }}>
                                {lang==="en"?"tap to edit":"i-tap para baguhin"}
                              </span>
                            </button>
                          )}
                        </div>
                        <span style={{ background:statusBg, color:statusColor,
                          border:`1px solid ${statusColor}44`, borderRadius:20,
                          padding:"3px 9px", fontSize:11, fontWeight:700, flexShrink:0 }}>
                          {statusLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  /* ─── DISCOVER SCREEN ─── */
  function DiscoverScreen() {
    return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"0 18px 8px" }}>
          <PeopleSelector minimal={false} />
        </div>
        <div style={{ padding:"0 18px 10px" }}>
          <p style={{ fontSize:13, color:C.muted, fontWeight:600, margin:"0 0 8px" }}>{t.mealType}</p>
          <div style={{ display:"flex", gap:6, overflowX:"auto" }}>
            {[["all","🍽️"],["breakfast","☀️"],["lunch","🌤️"],["dinner","🌙"]].map(([s,icon]) => {
              const sc = s !== "all" ? C.slotColors[s] : null;
              return (
                <button key={s} onClick={() => { setSwipeSlot(s); setSwipeIdx(0); }} style={{
                  flexShrink:0, padding:"8px 14px", borderRadius:20, fontSize:13, fontWeight:700, cursor:"pointer",
                  background: swipeSlot===s ? (sc ? sc.fg : C.accent) : C.surface,
                  color: swipeSlot===s ? "#fff" : C.muted,
                  border:`1.5px solid ${swipeSlot===s ? (sc ? sc.fg : C.accent) : C.border}`,
                }}>{icon} {s==="all" ? t.mealSlot?.all||"All" : t.slots[s]}</button>
              );
            })}
          </div>
        </div>

        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", padding:"0 18px 14px", userSelect:"none" }}>
          {current && swipeMeals.length > 0 ? (
            <>
              <p style={{ fontSize:12, color:C.muted, marginBottom:10, textAlign:"center" }}>
                ← {t.swipeHint} →
              </p>
              <div style={{ width:"92%", height:10, background:C.border,
                borderRadius:18, position:"relative", top:8, zIndex:0 }}/>
              <div
                onMouseDown={mdown} onMouseMove={mmove} onMouseUp={mup} onMouseLeave={mup}
                style={{
                  width:"100%", background:C.surface, borderRadius:22, padding:18,
                  border:`2px solid ${dragX>30?C.green:dragX<-30?C.red:C.border}`,
                  cursor:dragging?"grabbing":"grab",
                  transform:`translateX(${cardTx}px) rotate(${cardRot}deg)`,
                  opacity:swipeAnim?0:1,
                  transition:dragging?"none":"transform 0.28s ease, opacity 0.28s, border-color 0.15s",
                  boxShadow:"0 6px 28px #00000014", position:"relative", zIndex:1,
                }}
              >
                {dragX>40&&<div style={{ position:"absolute",top:12,left:12,background:C.green,
                  color:"#fff",fontWeight:800,padding:"4px 14px",borderRadius:20,fontSize:13,
                  opacity:Math.min(dragX/90,1) }}>♥ {t.saveLabel}</div>}
                {dragX<-40&&<div style={{ position:"absolute",top:12,right:12,background:C.red,
                  color:"#fff",fontWeight:800,padding:"4px 14px",borderRadius:20,fontSize:13,
                  opacity:Math.min(-dragX/90,1) }}>✕ {t.skipLabel}</div>}

                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                  <span style={{ background:C.slotColors[current.slot].bg, color:C.slotColors[current.slot].fg,
                    border:`1px solid ${C.slotColors[current.slot].border}`,
                    borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:700 }}>
                    {C.slotColors[current.slot].icon} {t.slots[current.slot]}
                  </span>
                  <ReadinessBadge meal={current} />
                </div>

                <div style={{ textAlign:"center", margin:"6px 0 12px" }}>
                  <div style={{ fontSize:56 }}>{current.image}</div>
                  <h2 style={{ fontSize:20, fontWeight:800, color:C.text, margin:"8px 0 4px" }}>{current.name}</h2>
                  <p style={{ fontSize:13, color:C.muted, margin:0 }}>
                    ⏱ {current.time} · {current.calories} kcal ·{" "}
                    ₱{Math.round(current.baseCost*(people/current.baseServings))} {lang==="en"?"for":"para sa"} {people} {t.people}
                  </p>
                </div>

                {/* Quick ingredient status */}
                <div style={{ background:C.card, borderRadius:12, padding:"10px 12px", marginBottom:12 }}>
                  <p style={{ fontSize:11, color:C.muted, fontWeight:700, margin:"0 0 6px",
                    textTransform:"uppercase", letterSpacing:0.5 }}>
                    {t.ingredientFor} {people} {t.people2}
                  </p>
                  {current.ingredients.map(ing => {
                    const status = getIngredientStatus(ing, pantry, people, current.baseServings);
                    const sc = C.statusColors[status];
                    const needed = formatAmt(ing.baseAmt, current.baseServings, people, ing.unit);
                    const have = pantry[ing.pantryKey]?.qty ?? 0;
                    const haveStr = `${have} ${ing.unit}`;
                    return (
                      <div key={ing.key} style={{ display:"flex", alignItems:"center", gap:8,
                        padding:"5px 0", borderBottom:`1px solid ${C.border}` }}>
                        <div style={{ width:7, height:7, borderRadius:"50%", background:sc.fg, flexShrink:0 }}/>
                        <span style={{ flex:1, fontSize:13, color:C.text }}>
                          {lang==="en" ? ing.name_en : ing.name_fil}
                        </span>
                        <span style={{ fontSize:12, color:C.muted }}>{lang==="en"?"Need":"Kailangan"}: {needed}</span>
                        <span style={{ background:sc.bg, color:sc.fg, border:`1px solid ${sc.border}`,
                          borderRadius:8, padding:"1px 7px", fontSize:10, fontWeight:700, flexShrink:0 }}>
                          {status==="enough" ? t.enough : status==="low" ? t.low : t.missing}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button onClick={() => openRecipe(current)} style={{
                  width:"100%", background:C.accent, color:"#fff", border:"none",
                  borderRadius:12, padding:"11px", fontSize:14, fontWeight:700, cursor:"pointer",
                }}>{t.viewRecipe} →</button>
              </div>

              <div style={{ display:"flex", gap:22, marginTop:14, alignItems:"center" }}>
                <button onClick={() => doSwipe("left")} style={{ width:52, height:52, borderRadius:"50%",
                  background:"#fff5f5", border:`2px solid ${C.red}`, color:C.red,
                  fontSize:22, cursor:"pointer" }}>✕</button>
                <span style={{ fontSize:12, color:C.muted }}>{swipeMeals.length}</span>
                <button onClick={() => doSwipe("right")} style={{ width:52, height:52, borderRadius:"50%",
                  background:"#f0fff5", border:`2px solid ${C.green}`, color:C.green,
                  fontSize:22, cursor:"pointer" }}>♥</button>
              </div>
            </>
          ) : (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:52 }}>✅</div>
              <p style={{ color:C.muted, fontSize:15, marginTop:10 }}>{t.allCaughtUp}</p>
              <button onClick={() => { setSkipped([]); setSwipeIdx(0); }} style={{
                marginTop:14, background:C.accent, color:"#fff", border:"none",
                borderRadius:12, padding:"12px 28px", cursor:"pointer", fontWeight:700, fontSize:14,
              }}>{t.startOver}</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ─── MARKET SCREEN ─── */
  function MarketScreen() {
    const missingKeys = Object.entries(pantry).filter(([,v]) => v.qty <= 0).map(([k]) => k);
    const groceryItems = MEALS.flatMap(m => m.ingredients).reduce((acc, ing) => {
      if (pantry[ing.pantryKey]?.qty <= 0 && !acc.find(a => a.key === ing.pantryKey)) {
        acc.push({ key:ing.pantryKey, item:pantry[ing.pantryKey] });
      }
      return acc;
    }, []);

    return (
      <div style={{ flex:1, overflowY:"auto", padding:"0 18px 16px" }}>
        <div style={{ background:locStatus==="found"?"#f0fff5":C.surface,
          border:`1.5px solid ${locStatus==="found"?"#90d4a8":C.border}`,
          borderRadius:16, padding:"12px 14px", marginBottom:14,
          display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:26 }}>{locStatus==="found"?"📍":"🗺️"}</span>
          <div style={{ flex:1 }}>
            {locStatus==="idle"&&<p style={{ fontSize:13, color:C.muted, margin:0 }}>
              {lang==="en"?"Tap to find markets near you":"I-tap para hanapin ang malapit na market"}</p>}
            {locStatus==="searching"&&<p style={{ fontSize:13, color:C.accent, margin:0, fontWeight:600 }}>{t.findingLocation}</p>}
            {locStatus==="found"&&<div>
              <p style={{ fontSize:11, color:C.green, fontWeight:700, margin:"0 0 2px", textTransform:"uppercase" }}>{t.locationFound}</p>
              <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>Antipolo, Rizal</p>
            </div>}
          </div>
          {locStatus!=="found"&&(
            <button onClick={() => { setLocStatus("searching"); setTimeout(()=>setLocStatus("found"),1500); }}
              style={{ background:C.accent, color:"#fff", border:"none", borderRadius:12,
                padding:"9px 14px", fontSize:13, fontWeight:700, cursor:"pointer",
                opacity:locStatus==="searching"?0.6:1 }}>
              {locStatus==="searching"?"...":"📍 "+t.findMyLocation}
            </button>
          )}
        </div>

        {groceryItems.length > 0 && (
          <>
            <p style={{ fontSize:15, fontWeight:700, color:C.text, margin:"0 0 10px" }}>
              🛒 {t.groceriesNeeded}
              <span style={{ fontSize:13, color:C.muted, fontWeight:400 }}> ({groceryItems.length} items)</span>
            </p>
            {groceryItems.map(({ key, item }) => {
              const market = MARKETS.find(m => m.items.includes(key));
              return (
                <div key={key} style={{ background:C.surface, borderRadius:14, padding:"11px 14px",
                  marginBottom:8, border:"1.5px solid #ffb0b0",
                  display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:22 }}>{item?.icon}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>
                      {lang==="en" ? item?.name_en : item?.name_fil}
                    </p>
                    {market && <p style={{ fontSize:12, color:C.muted, margin:"2px 0 0" }}>
                      {market.name} · {market.dist}km {t.distance}
                    </p>}
                  </div>
                  <span style={{ background:"#fff0f0", color:"#c03030", border:"1px solid #ffb0b0",
                    borderRadius:8, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
                    {lang==="en"?"Buy":"Bilhin"}
                  </span>
                </div>
              );
            })}
          </>
        )}

        <p style={{ fontSize:15, fontWeight:700, color:C.text, margin:"18px 0 10px" }}>📍 {t.nearbyMarkets}</p>
        {[...MARKETS].sort((a,b)=>a.dist-b.dist).map(m => {
          const matchingMissing = m.items.filter(k => pantry[k]?.qty <= 0);
          return (
            <div key={m.id} onClick={() => setSelMarket(selMarket?.id===m.id?null:m)} style={{
              background:C.surface, borderRadius:16, padding:"14px 16px", marginBottom:10,
              border:`1.5px solid ${selMarket?.id===m.id ? m.color : C.border}`,
              cursor:"pointer", transition:"border-color 0.15s",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:12,
                  background:m.color+"22", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:22, flexShrink:0 }}>
                  {m.dist<0.5?"🏪":m.dist<1.5?"🛒":"🏬"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                    <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>{m.name}</p>
                    {matchingMissing.length>0&&(
                      <span style={{ background:"#f0fff5", color:"#2a7a4a", border:"1px solid #90d4a8",
                        borderRadius:12, padding:"1px 7px", fontSize:10, fontWeight:700 }}>
                        ✓ {matchingMissing.length} {lang==="en"?"items you need":"items na kailangan mo"}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize:12, color:C.muted, margin:0 }}>
                    {lang==="en"?m.type_en:m.type_fil} · {m.open}
                  </p>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ background:m.color+"22", color:m.color, borderRadius:8,
                    padding:"3px 10px", fontSize:12, fontWeight:700, marginBottom:4 }}>
                    {m.dist}km
                  </div>
                  <span style={{ fontSize:11, color:C.muted }}>⭐ {m.rating}</span>
                </div>
              </div>
              {selMarket?.id===m.id&&(
                <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}` }}>
                  <p style={{ fontSize:12, color:C.muted, fontWeight:700, textTransform:"uppercase", margin:"0 0 8px" }}>
                    {t.availableHere}
                  </p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
                    {m.items.map(key => {
                      const item = pantry[key];
                      const isMissing = item && item.qty <= 0;
                      return (
                        <span key={key} style={{
                          background: isMissing ? "#f0fff5" : C.card,
                          border:`1px solid ${isMissing ? "#90d4a8" : C.border}`,
                          color: isMissing ? C.green : C.muted,
                          borderRadius:20, padding:"4px 10px", fontSize:12, fontWeight:isMissing?700:400,
                        }}>{isMissing?"✓ ":""}{lang==="en"?(item?.name_en||key):(item?.name_fil||key)}</span>
                      );
                    })}
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button style={{ flex:1, background:C.accent, color:"#fff", border:"none",
                      borderRadius:12, padding:"10px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                      🧭 {t.directions}
                    </button>
                    <button style={{ flex:1, background:"#ecf3ff", color:C.blue,
                      border:`1px solid #b0c8f0`, borderRadius:12, padding:"10px",
                      fontSize:13, fontWeight:700, cursor:"pointer" }}>
                      🛵 {t.delivery}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  /* ─── SAVED SCREEN ─── */
  function SavedScreen() {
    const savedMeals = MEALS.filter(m => saved.includes(m.id));
    const bySlot = {
      breakfast: savedMeals.filter(m=>m.slot==="breakfast"),
      lunch:     savedMeals.filter(m=>m.slot==="lunch"),
      dinner:    savedMeals.filter(m=>m.slot==="dinner"),
    };
    return (
      <div style={{ flex:1, overflowY:"auto", padding:"0 18px 16px" }}>
        <p style={{ fontSize:13, color:C.muted, margin:"0 0 14px" }}>{saved.length} {t.savedBy}</p>
        {savedMeals.length===0 ? (
          <div style={{ textAlign:"center", paddingTop:50 }}>
            <div style={{ fontSize:52 }}>🍽️</div>
            <p style={{ color:C.muted, fontSize:15, marginTop:12 }}>{t.noSaved}</p>
            <p style={{ color:C.muted, fontSize:13 }}>{t.noSavedSub}</p>
          </div>
        ) : (
          ["breakfast","lunch","dinner"].map(s => {
            if (!bySlot[s].length) return null;
            const sc = C.slotColors[s];
            return (
              <div key={s}>
                <div style={{ display:"flex", alignItems:"center", gap:8, margin:"16px 0 8px" }}>
                  <span style={{ fontSize:16 }}>{sc.icon}</span>
                  <span style={{ fontSize:12, color:sc.fg, fontWeight:700, textTransform:"uppercase" }}>{t.slots[s]}</span>
                  <div style={{ flex:1, height:1.5, background:C.border }}/>
                </div>
                {bySlot[s].map(m => (
                  <div key={m.id} onClick={() => openRecipe(m)} style={{
                    background:C.surface, borderRadius:16, padding:"14px", marginBottom:10,
                    border:`1.5px solid ${C.border}`, cursor:"pointer",
                    display:"flex", gap:12, alignItems:"center",
                  }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=sc.fg}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
                    <span style={{ fontSize:36 }}>{m.image}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:11, color:sc.fg, fontWeight:700, margin:"0 0 2px", textTransform:"uppercase" }}>{m.region}</p>
                      <p style={{ fontSize:15, fontWeight:800, color:C.text, margin:"0 0 3px" }}>{m.name}</p>
                      <p style={{ fontSize:12, color:C.muted, margin:"0 0 5px" }}>
                        {m.time} · ₱{Math.round(m.baseCost*(people/m.baseServings))} {lang==="en"?"for":"para sa"} {people}
                      </p>
                      <ReadinessBadge meal={m} />
                    </div>
                    <span style={{ fontSize:18, color:C.muted }}>›</span>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    );
  }

  /* ─── RECIPE MODAL ─── */
  function RecipeModal() {
    if (!recipe) return null;
    const sc = C.slotColors[recipe.slot];
    return (
      <div onClick={() => setRecipe(null)} style={{
        position:"fixed", inset:0, background:"#00000066",
        display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:300,
      }}>
        <div onClick={e=>e.stopPropagation()} style={{
          background:C.bg, borderRadius:"24px 24px 0 0", width:"100%", maxWidth:420,
          maxHeight:"92vh", overflowY:"auto", padding:"22px 20px 32px",
          boxShadow:"0 -8px 40px #00000030",
        }}>
          <div style={{ width:40, height:4, background:C.border, borderRadius:4, margin:"0 auto 16px" }}/>

          <div style={{ textAlign:"center", marginBottom:14 }}>
            <span style={{ background:sc.bg, color:sc.fg, border:`1px solid ${sc.border}`,
              borderRadius:20, padding:"4px 14px", fontSize:12, fontWeight:700 }}>
              {sc.icon} {t.slots[recipe.slot]} · {recipe.region}
            </span>
            <div style={{ fontSize:60, margin:"10px 0 6px" }}>{recipe.image}</div>
            <h2 style={{ fontSize:23, fontWeight:800, color:C.text, margin:"0 0 6px" }}>{recipe.name}</h2>
            <p style={{ fontSize:13, color:C.muted, margin:"0 0 10px" }}>
              ⏱ {recipe.time} · {recipe.calories} kcal · {t.serves} {people} {t.people}
            </p>
            <ReadinessBadge meal={recipe} />
          </div>

          {!cookMode ? (
            <>
              {/* Servings adjuster */}
              <div style={{ background:C.card, borderRadius:14, padding:"12px 16px", marginBottom:14,
                display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <p style={{ fontSize:12, color:C.muted, fontWeight:700, margin:"0 0 2px", textTransform:"uppercase" }}>
                    {t.adjustServings}
                  </p>
                  <p style={{ fontSize:13, color:C.text, margin:0 }}>
                    ₱{Math.round(recipe.baseCost*(people/recipe.baseServings))} {lang==="en"?"total":"kabuuan"}
                  </p>
                </div>
                <PeopleSelector minimal={true} />
              </div>

              {/* Nutrition */}
              <p style={{ fontSize:12, color:C.muted, fontWeight:700, textTransform:"uppercase",
                letterSpacing:0.5, margin:"0 0 8px" }}>{t.nutrition}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                {[[t.protein,recipe.nutrition.protein],[t.carbs,recipe.nutrition.carbs],
                  [t.fat,recipe.nutrition.fat],[t.sodium,recipe.nutrition.sodium]].map(([l,v]) => (
                  <div key={l} style={{ background:C.surface, borderRadius:10, padding:"8px 12px",
                    border:`1px solid ${C.border}` }}>
                    <p style={{ fontSize:11, color:C.muted, margin:"0 0 2px" }}>{l}</p>
                    <p style={{ fontSize:16, fontWeight:800, color:C.text, margin:0 }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* INGREDIENTS with pantry status */}
              <p style={{ fontSize:12, color:C.muted, fontWeight:700, textTransform:"uppercase",
                letterSpacing:0.5, margin:"0 0 4px" }}>{t.ingredients}</p>
              <p style={{ fontSize:11, color:C.muted, margin:"0 0 10px" }}>
                {t.ingredientFor} {people} {t.people2}
              </p>
              {recipe.ingredients.map(ing => {
                const status = getIngredientStatus(ing, pantry, people, recipe.baseServings);
                const sc2 = C.statusColors[status];
                const needed = formatAmt(ing.baseAmt, recipe.baseServings, people, ing.unit);
                const haveQty = pantry[ing.pantryKey]?.qty ?? 0;
                const haveStr = `${haveQty} ${ing.unit}`;
                return (
                  <div key={ing.key} style={{
                    background: status!=="enough" ? sc2.bg : C.surface,
                    border:`1.5px solid ${status!=="enough" ? sc2.border : C.border}`,
                    borderRadius:12, padding:"10px 12px", marginBottom:8,
                  }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:20 }}>{pantry[ing.pantryKey]?.icon || "🥄"}</span>
                      <div style={{ flex:1 }}>
                        <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:"0 0 2px" }}>
                          {lang==="en" ? ing.name_en : ing.name_fil}
                        </p>
                        <div style={{ display:"flex", gap:12, fontSize:12 }}>
                          <span style={{ color:C.muted }}>{t.need}: <strong style={{ color:C.text }}>{needed}</strong></span>
                          <span style={{ color:C.muted }}>{t.have}: <strong style={{ color:sc2.fg }}>{haveStr}</strong></span>
                        </div>
                      </div>
                      <span style={{ background:sc2.bg, color:sc2.fg, border:`1px solid ${sc2.border}`,
                        borderRadius:20, padding:"3px 9px", fontSize:11, fontWeight:700, flexShrink:0 }}>
                        {status==="enough" ? t.enough : status==="low" ? t.low : t.missing}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Tip */}
              <div style={{ background:"#fffbec", border:"1px solid #f4d090",
                borderRadius:14, padding:"12px 14px", margin:"12px 0" }}>
                <p style={{ fontSize:12, color:"#c47a10", fontWeight:700,
                  textTransform:"uppercase", letterSpacing:0.5, margin:"0 0 5px" }}>💡 {t.tip}</p>
                <p style={{ fontSize:13, lineHeight:1.6, color:C.text, margin:0 }}>{recipe.tip}</p>
              </div>

              <button onClick={() => setCookMode(true)} style={{
                width:"100%", background:C.accent, color:"#fff", border:"none",
                borderRadius:14, padding:"14px", fontSize:15, fontWeight:700,
                cursor:"pointer", marginBottom:8, boxShadow:"0 4px 16px #e8703a44",
              }}>🍳 {t.startCooking}</button>
            </>
          ) : (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <p style={{ fontSize:14, fontWeight:700, color:C.text, margin:0 }}>
                  {t.step} {cookStep+1} {t.of} {recipe.steps.length}
                </p>
                <button onClick={() => setCookMode(false)} style={{ background:"none", color:C.muted,
                  border:"none", fontSize:13, cursor:"pointer", padding:"4px 8px" }}>
                  ← {lang==="en"?"Back":"Bumalik"}
                </button>
              </div>
              <div style={{ height:6, background:C.card, borderRadius:6, marginBottom:14, overflow:"hidden" }}>
                <div style={{ height:"100%", background:C.accent, borderRadius:6,
                  width:`${((cookStep+1)/recipe.steps.length)*100}%`, transition:"width 0.3s" }}/>
              </div>
              <div style={{ background:C.card, borderRadius:18, padding:20, marginBottom:14,
                fontSize:16, lineHeight:1.8, color:C.text, minHeight:120 }}>
                {recipe.steps[cookStep]}
              </div>
              <div style={{ display:"flex", gap:5, justifyContent:"center", marginBottom:14 }}>
                {recipe.steps.map((_,i) => (
                  <div key={i} onClick={() => setCookStep(i)} style={{
                    width:i===cookStep?22:8, height:8, borderRadius:4, cursor:"pointer",
                    background:i<=cookStep?C.accent:C.border, transition:"all 0.25s",
                  }}/>
                ))}
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={() => setCookStep(s => Math.max(0,s-1))} disabled={cookStep===0} style={{
                  flex:1, background:C.card, color:cookStep===0?C.border:C.text,
                  border:`1.5px solid ${C.border}`, borderRadius:12, padding:"12px",
                  cursor:cookStep===0?"not-allowed":"pointer", fontWeight:700, opacity:cookStep===0?0.5:1,
                }}>← {t.prev}</button>
                {cookStep < recipe.steps.length-1 ? (
                  <button onClick={() => setCookStep(s=>s+1)} style={{
                    flex:2, background:C.accent, color:"#fff", border:"none",
                    borderRadius:12, padding:"12px", cursor:"pointer", fontWeight:700, fontSize:14,
                  }}>{t.next} →</button>
                ) : (
                  <button onClick={() => setRecipe(null)} style={{
                    flex:2, background:C.green, color:"#fff", border:"none",
                    borderRadius:12, padding:"12px", cursor:"pointer", fontWeight:700, fontSize:14,
                  }}>{t.done}</button>
                )}
              </div>
            </>
          )}
          <button onClick={() => setRecipe(null)} style={{
            marginTop:12, width:"100%", background:"none", color:C.muted,
            border:`1.5px solid ${C.border}`, borderRadius:12, padding:"10px",
            cursor:"pointer", fontSize:14,
          }}>{t.close}</button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id:"plan",     icon:"📅", labelKey:"plan" },
    { id:"discover", icon:"🔍", labelKey:"discover" },
    { id:"pantry",   icon:"🧺", labelKey:"pantry" },
    { id:"market",   icon:"📍", labelKey:"market" },
    { id:"saved",    icon:"♥",  labelKey:"saved" },
  ];

  return (
    <div style={{ background:"#ede8df", minHeight:"100vh", display:"flex",
      alignItems:"center", justifyContent:"center",
      fontFamily:"'Helvetica Neue','Arial',sans-serif", color:C.text }}>

      <div style={{ width:390, height:844, background:C.bg, borderRadius:44,
        display:"flex", flexDirection:"column", overflow:"hidden",
        boxShadow:"0 32px 80px #00000028, 0 0 0 1px #00000010" }}>

        {/* Header */}
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`,
          padding:"16px 20px 12px", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, color:C.accent, margin:"0 0 2px", letterSpacing:-0.5 }}>
                🌿 {t.appName}
              </h1>
              <p style={{ fontSize:12, color:C.muted, margin:0 }}>{t.tagline}</p>
            </div>
            <button onClick={() => setLang(l => l==="en"?"fil":"en")} style={{
              background:C.accent, color:"#fff", border:"none", borderRadius:20,
              padding:"7px 16px", fontSize:13, fontWeight:700, cursor:"pointer",
              boxShadow:"0 2px 8px #e8703a44", display:"flex", alignItems:"center", gap:6,
            }}>
              <span style={{ fontSize:16 }}>{lang==="en"?"🇵🇭":"🇺🇸"}</span>
              {lang==="en"?"Filipino":"English"}
            </button>
          </div>
        </div>

        {/* Screen title */}
        <div style={{ padding:"12px 18px 0", flexShrink:0 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:C.text, margin:0 }}>
            {t.tabs[tab]}
          </h2>
        </div>

        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column", paddingTop:10 }}>
          {tab==="plan"     && <PlanScreen/>}
          {tab==="discover" && <DiscoverScreen/>}
          {tab==="pantry"   && <PantryScreen/>}
          {tab==="market"   && <MarketScreen/>}
          {tab==="saved"    && <SavedScreen/>}
        </div>

        {/* Bottom nav */}
        <div style={{ display:"flex", background:C.surface, borderTop:`1px solid ${C.border}`,
          flexShrink:0, paddingBottom:4 }}>
          {TABS.map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{
              flex:1, padding:"9px 0 5px", background:"none", border:"none", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              color:tab===tb.id?C.accent:C.muted,
              borderTop:tab===tb.id?`2.5px solid ${C.accent}`:"2.5px solid transparent",
              transition:"all 0.15s",
            }}>
              <span style={{ fontSize:18 }}>{tb.icon}</span>
              <span style={{ fontSize:9, fontWeight:tab===tb.id?700:500, letterSpacing:0.2 }}>
                {t.tabs[tb.labelKey]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <RecipeModal/>

      <p style={{ marginTop:14, color:"#b0a090", fontSize:11, textAlign:"center" }}>
        MealMate v5 · Filipino & Asian · ₱ PHP
      </p>
    </div>
  );
}