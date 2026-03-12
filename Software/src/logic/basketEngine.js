// basketEngine.js
// This is the brain of ShopQuick!
// It reads what the user typed, matches it to real products from our CSV data,
// and compares prices across all stores.

import { STORES, PRICES } from '../data/mockPrices';

// ─────────────────────────────────────────────
// STEP 1: KEYWORD MAP
// Maps simple words a user might type → normalized product keys in our data
// Think of this like a dictionary: "milk" → look up "milk_semi_skimmed_4pint" in the price data
// ─────────────────────────────────────────────
const KEYWORD_MAP = {
  // Dairy
  'milk':          ['milk_semi_skimmed_4pint', 'milk_whole_2l', 'milk_skimmed_4pint'],
  'eggs':          ['eggs_free_range_6pk', 'eggs_6_pack', 'eggs_free_range_large_6pk'],
  'egg':           ['eggs_free_range_6pk', 'eggs_6_pack', 'eggs_free_range_large_6pk'],
  'butter':        ['butter_unsalted_250g', 'tesco_salted_butter_250g'],
  'cheese':        ['cheese_cheddar_400g', 'cheese_slices_10pk'],
  'yoghurt':       ['yogurt_greek_500g', 'yogurt_natural_greek'],
  'yogurt':        ['yogurt_greek_500g', 'yogurt_natural_greek'],

  // Bread & Bakery
  'bread':         ['bread_white_800g', 'asda_white_bread_medium', 'asda_wholemeal_bread_800g'],

  // Meat
  'chicken':       ['chicken_breast_600g', 'chicken_breast_fillets_500g', 'chicken_breast_500g'],
  'mince':         ['beef_mince_500g_20pct', 'beef_mince_500g_5pct', 'beef_mince_400g'],
  'beef':          ['beef_mince_500g_20pct', 'beef_mince_500g_5pct'],
  'bacon':         ['bacon_smoked_back_300g', 'bacon_streaky_300g', 'bacon_unsmoked_360g'],
  'sausages':      ['sausages_pork_8pk'],
  'salmon':        ['salmon_fillets_2pk_240g'],

  // Fruit & Veg
  'bananas':       ['bananas_5pack', 'bananas_loose', 'bananas_kg'],
  'banana':        ['bananas_5pack', 'bananas_loose'],
  'apples':        ['apples_6_pack', 'apples_pink_lady_6pack'],
  'apple':         ['apples_6_pack', 'apples_pink_lady_6pack'],
  'potatoes':      ['potatoes_white_2.5kg', 'potatoes_maris_piper_2.5kg'],
  'potato':        ['potatoes_white_2.5kg', 'potatoes_maris_piper_2.5kg'],
  'strawberries':  ['strawberries_400g'],
  'avocado':       ['avocados_ripe_2pk'],
  'tomatoes':      ['tomatoes_cherry_250g', 'tomatoes_vine_6pk'],

  // Cupboard staples
  'pasta':         ['pasta_penne_500g', 'pasta_500g'],
  'rice':          ['rice_basmati_1kg'],
  'beans':         ['baked_beans_4pk'],
  'flour':         ['flour_plain'],
  'sugar':         ['sugar_white_1kg'],
  'oil':           ['olive_oil_500ml'],
  'ketchup':       ['ketchup_tomato_700ml'],

  // Drinks
  'orange juice':  ['orange_juice_1l'],
  'juice':         ['orange_juice_1l'],
  'coffee':        ['instant_coffee_200g'],
  'tea':           ['pg_tips_tea_english_breakfast_speciality_70pk_175g'],

  // Frozen
  'chips':         ['chips_frozen_1.5kg'],
  'peas':          ['peas_frozen_900g'],
  'pizza':         ['pizza_margherita_frozen'],
  'fish fingers':  ['fish_fingers_10pk'],

  // Snacks / Other
  'houmous':       ['houmous_classic_200g'],
  'hummus':        ['houmous_classic_200g'],
};

// ─────────────────────────────────────────────
// STEP 2: Extract budget from user text
// e.g. "£40 budget, milk and eggs" → returns 40
// ─────────────────────────────────────────────
function extractBudget(text) {
  const match = text.match(/£(\d+(\.\d{1,2})?)/);
  return match ? parseFloat(match[1]) : null;
}

// ─────────────────────────────────────────────
// STEP 3: Match user words to real products
// e.g. "milk, eggs, chicken" → finds actual items in PRICES data
// ─────────────────────────────────────────────
function matchItems(text) {
  const lowerText = text.toLowerCase();
  const matchedItems = [];
  const usedKeys = new Set(); // stops same product matching twice

  for (const [keyword, normalizedKeys] of Object.entries(KEYWORD_MAP)) {
    if (!lowerText.includes(keyword)) continue;

    // Try each possible normalized key until we find one that exists in the data
    for (const key of normalizedKeys) {
      if (usedKeys.has(key)) continue;

      // Check if ANY store has this product
      const foundInStore = STORES.find(store => PRICES[store.id]?.[key]);
      if (foundInStore) {
        matchedItems.push({ id: key, name: PRICES[foundInStore.id][key].name });
        usedKeys.add(key);
        break; // found it, move to next keyword
      }
    }
  }

  return matchedItems;
}

// ─────────────────────────────────────────────
// STEP 4: Calculate total basket price per store
// ─────────────────────────────────────────────
function calcBaskets(items) {
  return STORES.map(store => {
    let total = 0;
    let foundCount = 0;

    items.forEach(item => {
      const product = PRICES[store.id]?.[item.id];
      if (product) {
        total += product.price;
        foundCount++;
      }
    });

    return {
      store,
      total: parseFloat(total.toFixed(2)),
      foundCount,
    };
  })
  // Only include stores that have at least one item
  .filter(b => b.foundCount > 0)
  // Sort cheapest first
  .sort((a, b) => a.total - b.total)
  // Add rank and how much extra vs cheapest
  .map((b, i, arr) => ({
    ...b,
    rank: i + 1,
    extra: parseFloat((b.total - arr[0].total).toFixed(2)),
  }));
}

// ─────────────────────────────────────────────
// STEP 5: Build the AI summary text
// ─────────────────────────────────────────────
function buildSummary(items, baskets, budget) {
  if (!baskets.length) return "Sorry, I couldn't find prices for those items.";

  const cheapest = baskets[0];
  const secondBest = baskets[1];

  let msg = `Your cheapest basket is £${cheapest.total.toFixed(2)} at ${cheapest.store.name}.`;

  if (budget) {
    const remaining = budget - cheapest.total;
    if (remaining >= 0) {
      msg += ` That's £${remaining.toFixed(2)} under your £${budget} budget!`;
    } else {
      msg += ` That's £${Math.abs(remaining).toFixed(2)} over your £${budget} budget.`;
    }
  }

  if (secondBest) {
    msg += ` Your second best option is ${secondBest.store.name} at £${secondBest.total.toFixed(2)}`;
    msg += ` - saving you £${secondBest.extra.toFixed(2)} by choosing ${cheapest.store.name}.`;
  }

  return msg;
}

// ─────────────────────────────────────────────
// MAIN FUNCTION — called by App.js when button is clicked
// ─────────────────────────────────────────────
export function processShoppingRequest(query) {
  const budget = extractBudget(query);
  const items = matchItems(query);

  if (!items.length) {
    return {
      success: false,
      aiResponse: "I couldn't find any matching products. Try typing items like: milk, eggs, chicken, bread.",
      items: [],
      baskets: [],
    };
  }

  const baskets = calcBaskets(items);

  return {
    success: true,
    aiResponse: buildSummary(items, baskets, budget),
    items,
    baskets,
  };
}