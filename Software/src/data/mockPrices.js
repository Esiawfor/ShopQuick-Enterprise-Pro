//DATA WAS PROVIDED BY AI - WAS ONLY USED FOR SUPPLY ME WITH DATA, IN ORDER TO TEST MY CODE AND WILL NOT BE USED FOR THE FINAL PROTOTYPE
// ADDITIONALLY, THINKING OF WAYS TO COLLECT MORE MARKET VALUE DATA

export const STORES = [
    {id: "aldi", name: "Aldi"},
    {id: "asda", name: "Asda"},
    {id: "tesco", name: "Tesco"},
    {id: "sainsburys", name: "Sainsburys"},
    {id: "morrisons", name: "Morrisons"}
];

export const GroceryItems = [
    {id: "bread", 
    name: "Bread (800g)",
    category: "Breakfast",
    keywords: ["bread","loaf", "toast"],
    prices:{aldi: 0.79, asda: 0.85, tesco: 1.10, sainsburys: 1.20, morrisons: 0.90}
    },
    {id: "milk",
    name: "Milk (2L)",
    category: "Breakfast",
    keywords: ["milk"],
    prices: { aldi: 1.09, asda: 1.15, tesco: 1.20, sainsburys: 1.25, morrisons: 1.10 }
  },
  {
    id: "eggs",
    name: "Eggs (12 pack)",
    category: "Breakfast",
    keywords: ["eggs", "egg"],
    prices: { aldi: 1.89, asda: 2.00, tesco: 2.15, sainsburys: 2.25, morrisons: 1.95 }
  },
  {
    id: "butter",
    name: "Butter (250g)",
    category: "Breakfast",
    keywords: ["butter"],
    prices: { aldi: 1.49, asda: 1.55, tesco: 1.65, sainsburys: 1.75, morrisons: 1.55 }
  },
  {
    id: "cereal",
    name: "Cereal (500g)",
    category: "Breakfast",
    keywords: ["cereal", "cornflakes", "porridge", "oats"],
    prices: { aldi: 1.19, asda: 1.35, tesco: 1.50, sainsburys: 1.65, morrisons: 1.40 }
  },
  {
    id: "orange_juice",
    name: "Orange Juice (1L)",
    category: "Breakfast",
    keywords: ["orange juice", "oj", "juice"],
    prices: { aldi: 0.99, asda: 1.10, tesco: 1.20, sainsburys: 1.30, morrisons: 1.05 }
  },
  {
    id: "yoghurt",
    name: "Yoghurt (500g)",
    category: "Breakfast",
    keywords: ["yoghurt", "yogurt"],
    prices: { aldi: 0.89, asda: 1.00, tesco: 1.10, sainsburys: 1.20, morrisons: 0.95 }
  },

  // ── MEAT ───────────────────────────────────────────────────
  {
    id: "chicken",
    name: "Chicken Breast (1kg)",
    category: "Meat",
    keywords: ["chicken", "chicken breast", "chicken fillets"],
    prices: { aldi: 3.49, asda: 3.75, tesco: 4.00, sainsburys: 4.25, morrisons: 3.80 }
  },
  {
    id: "mince",
    name: "Beef Mince (500g)",
    category: "Meat",
    keywords: ["mince", "beef mince", "ground beef", "beef"],
    prices: { aldi: 2.49, asda: 2.75, tesco: 2.90, sainsburys: 3.10, morrisons: 2.80 }
  },
  {
    id: "sausages",
    name: "Sausages (8 pack)",
    category: "Meat",
    keywords: ["sausages", "sausage", "bangers"],
    prices: { aldi: 1.79, asda: 1.95, tesco: 2.10, sainsburys: 2.25, morrisons: 1.99 }
  },
  {
    id: "bacon",
    name: "Bacon (300g)",
    category: "Meat",
    keywords: ["bacon", "rashers"],
    prices: { aldi: 1.99, asda: 2.10, tesco: 2.25, sainsburys: 2.50, morrisons: 2.15 }
  },
  {
    id: "lamb_chops",
    name: "Lamb Chops (500g)",
    category: "Meat",
    keywords: ["lamb", "lamb chops"],
    prices: { aldi: 3.99, asda: 4.25, tesco: 4.50, sainsburys: 4.75, morrisons: 4.30 }
  },
  {
    id: "pork_chops",
    name: "Pork Chops (500g)",
    category: "Meat",
    keywords: ["pork", "pork chops"],
    prices: { aldi: 2.79, asda: 2.95, tesco: 3.10, sainsburys: 3.25, morrisons: 2.99 }
  },

  // ── FISH & PROTEIN ─────────────────────────────────────────
  {
    id: "tuna",
    name: "Tuna (4 cans)",
    category: "Protein",
    keywords: ["tuna", "tuna cans"],
    prices: { aldi: 2.19, asda: 2.35, tesco: 2.50, sainsburys: 2.75, morrisons: 2.40 }
  },
  {
    id: "salmon",
    name: "Salmon Fillets (2 pack)",
    category: "Fish",
    keywords: ["salmon", "salmon fillets"],
    prices: { aldi: 3.29, asda: 3.50, tesco: 3.75, sainsburys: 4.00, morrisons: 3.60 }
  },
  {
    id: "fish_fingers",
    name: "Fish Fingers (12 pack)",
    category: "Fish",
    keywords: ["fish fingers", "fish"],
    prices: { aldi: 1.49, asda: 1.65, tesco: 1.80, sainsburys: 1.95, morrisons: 1.70 }
  },

  // ── CARBS & STAPLES ────────────────────────────────────────
  {
    id: "rice",
    name: "Rice (1kg)",
    category: "Carbs",
    keywords: ["rice"],
    prices: { aldi: 0.89, asda: 0.95, tesco: 1.05, sainsburys: 1.15, morrisons: 0.99 }
  },
  {
    id: "pasta",
    name: "Pasta (500g)",
    category: "Carbs",
    keywords: ["pasta", "spaghetti", "penne"],
    prices: { aldi: 0.69, asda: 0.75, tesco: 0.85, sainsburys: 0.95, morrisons: 0.79 }
  },
  {
    id: "potatoes",
    name: "Potatoes (2kg)",
    category: "Carbs",
    keywords: ["potatoes", "potato", "spuds"],
    prices: { aldi: 1.19, asda: 1.30, tesco: 1.45, sainsburys: 1.60, morrisons: 1.35 }
  },
  {
    id: "bread_rolls",
    name: "Bread Rolls (6 pack)",
    category: "Carbs",
    keywords: ["rolls", "bread rolls", "buns"],
    prices: { aldi: 0.75, asda: 0.80, tesco: 0.95, sainsburys: 1.10, morrisons: 0.85 }
  },
  {
    id: "wraps",
    name: "Wraps (8 pack)",
    category: "Carbs",
    keywords: ["wraps", "tortillas", "flatbreads"],
    prices: { aldi: 0.89, asda: 1.00, tesco: 1.15, sainsburys: 1.25, morrisons: 1.05 }
  },

  // ── VEGETABLES ─────────────────────────────────────────────
  {
    id: "carrots",
    name: "Carrots (1kg)",
    category: "Veg",
    keywords: ["carrots", "carrot"],
    prices: { aldi: 0.55, asda: 0.60, tesco: 0.70, sainsburys: 0.75, morrisons: 0.65 }
  },
  {
    id: "onions",
    name: "Onions (1kg)",
    category: "Veg",
    keywords: ["onions", "onion"],
    prices: { aldi: 0.59, asda: 0.65, tesco: 0.75, sainsburys: 0.80, morrisons: 0.69 }
  },
  {
    id: "tomatoes",
    name: "Tomatoes (6 pack)",
    category: "Veg",
    keywords: ["tomatoes", "tomato"],
    prices: { aldi: 0.89, asda: 0.99, tesco: 1.10, sainsburys: 1.20, morrisons: 0.99 }
  },
  {
    id: "broccoli",
    name: "Broccoli (each)",
    category: "Veg",
    keywords: ["broccoli"],
    prices: { aldi: 0.59, asda: 0.65, tesco: 0.75, sainsburys: 0.85, morrisons: 0.69 }
  },
  {
    id: "peppers",
    name: "Mixed Peppers (3 pack)",
    category: "Veg",
    keywords: ["peppers", "pepper"],
    prices: { aldi: 0.99, asda: 1.10, tesco: 1.20, sainsburys: 1.30, morrisons: 1.05 }
  },
  {
    id: "lettuce",
    name: "Lettuce (each)",
    category: "Veg",
    keywords: ["lettuce", "salad"],
    prices: { aldi: 0.49, asda: 0.55, tesco: 0.65, sainsburys: 0.75, morrisons: 0.59 }
  },
  {
    id: "spinach",
    name: "Spinach (200g)",
    category: "Veg",
    keywords: ["spinach"],
    prices: { aldi: 0.79, asda: 0.89, tesco: 1.00, sainsburys: 1.10, morrisons: 0.89 }
  },
  {
    id: "cucumber",
    name: "Cucumber (each)",
    category: "Veg",
    keywords: ["cucumber"],
    prices: { aldi: 0.49, asda: 0.55, tesco: 0.65, sainsburys: 0.70, morrisons: 0.59 }
  },
  {
    id: "courgette",
    name: "Courgette (each)",
    category: "Veg",
    keywords: ["courgette", "zucchini"],
    prices: { aldi: 0.49, asda: 0.55, tesco: 0.65, sainsburys: 0.75, morrisons: 0.59 }
  },

  // ── FRUIT ──────────────────────────────────────────────────
  {
    id: "bananas",
    name: "Bananas (5 pack)",
    category: "Fruit",
    keywords: ["bananas", "banana"],
    prices: { aldi: 0.69, asda: 0.75, tesco: 0.80, sainsburys: 0.90, morrisons: 0.75 }
  },
  {
    id: "apples",
    name: "Apples (6 pack)",
    category: "Fruit",
    keywords: ["apples", "apple"],
    prices: { aldi: 0.99, asda: 1.10, tesco: 1.20, sainsburys: 1.30, morrisons: 1.05 }
  },
  {
    id: "grapes",
    name: "Grapes (500g)",
    category: "Fruit",
    keywords: ["grapes", "grape"],
    prices: { aldi: 1.29, asda: 1.40, tesco: 1.55, sainsburys: 1.65, morrisons: 1.45 }
  },
  {
    id: "oranges",
    name: "Oranges (4 pack)",
    category: "Fruit",
    keywords: ["oranges", "orange"],
    prices: { aldi: 0.89, asda: 0.99, tesco: 1.10, sainsburys: 1.20, morrisons: 1.00 }
  },

  // ── DAIRY ──────────────────────────────────────────────────
  {
    id: "cheese",
    name: "Cheddar Cheese (400g)",
    category: "Dairy",
    keywords: ["cheese", "cheddar"],
    prices: { aldi: 2.19, asda: 2.35, tesco: 2.50, sainsburys: 2.75, morrisons: 2.40 }
  },
  {
    id: "cream",
    name: "Double Cream (300ml)",
    category: "Dairy",
    keywords: ["cream", "double cream"],
    prices: { aldi: 0.99, asda: 1.10, tesco: 1.20, sainsburys: 1.30, morrisons: 1.10 }
  },

  // ── BABY ───────────────────────────────────────────────────
  {
    id: "nappies",
    name: "Nappies (44 pack)",
    category: "Baby",
    keywords: ["nappies", "nappy", "diapers"],
    prices: { aldi: 3.99, asda: 4.25, tesco: 4.50, sainsburys: 5.00, morrisons: 4.35 }
  },
  {
    id: "baby_wipes",
    name: "Baby Wipes (64 pack)",
    category: "Baby",
    keywords: ["wipes", "baby wipes"],
    prices: { aldi: 0.89, asda: 1.00, tesco: 1.10, sainsburys: 1.25, morrisons: 1.05 }
  },
  {
    id: "baby_food",
    name: "Baby Food Pouches (4 pack)",
    category: "Baby",
    keywords: ["baby food", "pouches"],
    prices: { aldi: 2.49, asda: 2.75, tesco: 3.00, sainsburys: 3.25, morrisons: 2.85 }
  },

  // ── TINNED & PANTRY ────────────────────────────────────────
  {
    id: "baked_beans",
    name: "Baked Beans (4 cans)",
    category: "Tinned",
    keywords: ["baked beans", "beans"],
    prices: { aldi: 0.99, asda: 1.10, tesco: 1.25, sainsburys: 1.35, morrisons: 1.15 }
  },
  {
    id: "chopped_tomatoes",
    name: "Chopped Tomatoes (4 cans)",
    category: "Tinned",
    keywords: ["chopped tomatoes", "tinned tomatoes"],
    prices: { aldi: 1.09, asda: 1.20, tesco: 1.35, sainsburys: 1.45, morrisons: 1.25 }
  },
  {
    id: "cooking_oil",
    name: "Vegetable Oil (1L)",
    category: "Pantry",
    keywords: ["oil", "cooking oil", "vegetable oil"],
    prices: { aldi: 1.29, asda: 1.40, tesco: 1.55, sainsburys: 1.65, morrisons: 1.45 }
  },
  {
    id: "pasta_sauce",
    name: "Pasta Sauce (500g)",
    category: "Pantry",
    keywords: ["pasta sauce", "tomato sauce", "bolognese sauce"],
    prices: { aldi: 0.79, asda: 0.89, tesco: 0.99, sainsburys: 1.10, morrisons: 0.89 }
  },
  {
    id: "sugar",
    name: "Sugar (1kg)",
    category: "Pantry",
    keywords: ["sugar"],
    prices: { aldi: 0.99, asda: 1.05, tesco: 1.15, sainsburys: 1.25, morrisons: 1.10 }
  },
  {
    id: "flour",
    name: "Plain Flour (1.5kg)",
    category: "Pantry",
    keywords: ["flour", "plain flour"],
    prices: { aldi: 0.89, asda: 0.95, tesco: 1.05, sainsburys: 1.15, morrisons: 0.99 }
  },

  // ── FROZEN ─────────────────────────────────────────────────
  {
    id: "frozen_peas",
    name: "Frozen Peas (900g)",
    category: "Frozen",
    keywords: ["peas", "frozen peas"],
    prices: { aldi: 0.99, asda: 1.10, tesco: 1.20, sainsburys: 1.30, morrisons: 1.10 }
  },
  {
    id: "frozen_chips",
    name: "Frozen Chips (1kg)",
    category: "Frozen",
    keywords: ["chips", "frozen chips", "fries"],
    prices: { aldi: 0.99, asda: 1.10, tesco: 1.25, sainsburys: 1.35, morrisons: 1.15 }
  },

  // ── DRINKS ─────────────────────────────────────────────────
  {
    id: "water",
    name: "Still Water (6 x 500ml)",
    category: "Drinks",
    keywords: ["water", "still water"],
    prices: { aldi: 1.09, asda: 1.20, tesco: 1.35, sainsburys: 1.45, morrisons: 1.25 }
  },
  {
    id: "fizzy_drinks",
    name: "Cola (6 x 330ml)",
    category: "Drinks",
    keywords: ["cola", "fizzy", "coke", "pepsi", "fizzy drinks"],
    prices: { aldi: 1.49, asda: 1.65, tesco: 1.80, sainsburys: 1.95, morrisons: 1.70 }
  },

];