// basketEngine.js
// This is the brain of ShopQuick!
// It reads what the user typed, matches it to real products from our CSV data,
// and compares prices across all stores.

import { STORES, PRICES, STORE_DISTANCES } from '../data/mockPrices';

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
function extractBudget(text) { // looks for "£" followed by a number, optionally with 1 or 2 decimal places
  const match = text.match(/£(\d+(\.\d{1,2})?)/); // regex breakdown: £ followed by digits, optionally a decimal point and 1-2 more digits
  return match ? parseFloat(match[1]) : null; // if no match, return null
}

// ─────────────────────────────────────────────
// STEP 3: Match user words to real products
// e.g. "milk, eggs, chicken" → finds actual items in PRICES data
// ─────────────────────────────────────────────
function matchItems(text) { // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase(); // This will hold the final matched items we find
  const matchedItems = []; // This set will track which normalized keys we've already matched, to avoid duplicates
  const usedKeys = new Set(); // stops same product matching twice

  for (const [keyword, normalizedKeys] of Object.entries(KEYWORD_MAP)) {// Check if the keyword exists as a whole word in the user text 
                                                                          //(e.g. "milk" should not match "milkshake")
    const wordMatch = new RegExp(`\\b${keyword}\\b`); // regex breakdown: \b = word boundary, so it matches "milk" but not "milkshake"
    if(!wordMatch.test(lowerText)) continue; // if the keyword isn't found as a whole word, skip to next

    // Try each possible normalized key until we find one that exists in the data
    for (const key of normalizedKeys) {
      if (usedKeys.has(key)) continue; // we've already matched this product with a previous keyword, skip it

      // Check if ANY store has this product
      const foundInStore = STORES.find(store => PRICES[store.id]?.[key]); // this looks through all stores to see if any of them have 
                                                                            // a price for this product key. 
                                                                            // If it finds one, it returns that store object; 
                                                                            // if not, it returns undefined.
      if (foundInStore) { // we found a store that sells this product, so we can add it to our matched items list
        matchedItems.push({ id: key, name: PRICES[foundInStore.id][key].name }); // we push an object with the product key and the 
                                                                                  // human-friendly name from the price data
        usedKeys.add(key); // mark this product key as used so we don't match it again with another keyword
        break; // found it, move to next keyword
      }
    }
  }

  return matchedItems; // return the list of matched items, which will be used to calculate basket prices in the next step
}

function getDistance(storeId, postcode) { // This is a simple function to get the distance of a store based on the user's postcode prefix
  const prefix = postcode.trim().toUpperCase().split(' ')[0]; // We look up the distances for that prefix in our STORE_DISTANCES data. 
                                                              // If we don't have a specific distance for that prefix, 
                                                              // we use a default set of distances.

  const distances = STORE_DISTANCES[prefix] || STORE_DISTANCES['DEFAULT']; // We return the distance for the given store ID, or 5.0 miles 
                                                                          // if we don't have a specific distance for that store

  return distances[storeId] ?? 5.0; // The "??" operator means "if distances[storeId] is defined and not null, use it; otherwise use 5.0"
}

// ─────────────────────────────────────────────
// STEP 4: Calculate total basket price per store
// ─────────────────────────────────────────────
function calcBaskets(items, postcode) { // For each store, we calculate the total price of the basket by summing the prices of the matched items.
  const sorted = STORES.map(store => { // For each store, we initialize a total price and a count of how many items we found prices for.
    let total = 0; // We also calculate the distance of the store from the user's location using the getDistance function we 
                  // defined earlier.
    let foundCount = 0; // This will count how many of the items in the user's basket we were able to find a price for in this store
    const distance = getDistance(store.id, postcode); // We loop through each matched item and look up its price in the current store. 
                                                      // If we find a price, we add it to the total and

    items.forEach(item => { // For each item in the user's basket, we look up its price in the current store's price data.
      const product = PRICES[store.id]?.[item.id]; // The "?" operator means "if PRICES[store.id] is defined, then look up [item.id]; 
                                                  // otherwise return undefined".
      if (product) { // If we found a price for this item in this store, we add it to the total price for this store's basket 
                    // and increment the found count.
        total += product.price; // We add the price of this product to the total price for this store's basket.
        foundCount++; // We increment the count of how many items we found prices for in this store.
      }
    });

    return { // We return an object representing this store's basket, including the store info, total price, 
            // how many items we found, and the distance.
      store,
      total: parseFloat(total.toFixed(2)),
      foundCount,
      distance,
    };
  })
  // Only include stores that have at least one item
  .filter(b => b.foundCount === items.length) // We filter out any stores where we couldn't find prices for all the items in the user's 
                                              // basket.
  // Sort cheapest first
  .sort((a, b) => a.total - b.total); // We sort the remaining stores by total price, with the cheapest first.
  // Add rank and how much extra vs cheapest - and how much further vs closest 
  // - for the AI summary later - we calculate the closest distance among the stores to use as a reference point for the 
  // "extra distance" calculation.

  const closestDistance = [...sorted].sort((a, b) => a.distance - b.distance)[0].distance; // We create a copy of the sorted array 
                                                                      //and sort it by distance to find the closest store's distance.

  return sorted.map((b, i)  => ({ // Finally, we map over the sorted list of baskets and add some extra info to each one: 
                                  // its rank (1st, 2nd, etc.),
    ...b, // how much more expensive it is compared to the cheapest option, and how much further it is compared to the closest store.
    rank: i + 1, // We add 1 to the index to get a human-friendly rank starting from 1 instead of 0.
    extra: parseFloat((b.total - sorted[0].total).toFixed(2)), // We calculate how much more expensive this basket is 
                                                            // compared to the cheapest one (which is the first in the sorted list).
    extraDistance: parseFloat((b.distance - closestDistance).toFixed(1)), // We calculate how much further this store is compared 
                                                                              // to the closest store.
  }));
}

// ─────────────────────────────────────────────
// STEP 5: Build the AI summary text
// ─────────────────────────────────────────────
function buildSummary(items, baskets, budget) { // If we couldn't find any prices for the items, we return a message saying so.
  if (!baskets.length) return "Sorry, I couldn't find prices for those items."; // We take the cheapest basket 
  //  (the first one in the sorted list) and the second best option (the second one in the list, if it exists).

  const cheapest = baskets[0]; // We start building a message that tells the user which store has the cheapest basket and 
                                // how much it costs.
  const secondBest = baskets[1]; // If we have a second best option, we add to the message how much it costs and how much more 
                                // expensive it is compared to the cheapest one.

  let msg = `Your cheapest basket is £${cheapest.total.toFixed(2)} at ${cheapest.store.name}.`; // If the user provided a budget, 
  // we calculate how much under or over budget the cheapest option is and add that to the message.

  if (budget) { // We calculate how much money the user would have left if they chose the cheapest option, 
                //or how much they would be over budget if it's more expensive than their budget.
    const remaining = budget - cheapest.total; // If the remaining amount is positive or zero, we tell the user how much money 
                                                // they would have left under their budget.
    if (remaining >= 0) { // If the remaining amount is negative, we tell the user how much they would be over budget.
      msg += ` That's £${remaining.toFixed(2)} under your £${budget} budget!`; // We add an exclamation mark to the end of the message 
                                                        // if it's under budget to make it more positive and encouraging.
    } else {
      msg += ` That's £${Math.abs(remaining).toFixed(2)} over your £${budget} budget.`; // We add a period to the end of the message 
                                    // if it's over budget to make it more neutral and less discouraging.
    }
  }

  if (secondBest) { // If we have a second best option, we add to the message how much it costs and how much 
                    // more expensive it is compared to the cheapest one.
    msg += ` Your second best option is ${secondBest.store.name} at £${secondBest.total.toFixed(2)}`; // We add to the message how much 
                                                                // more expensive the second best option is compared to the cheapest one.
    msg += ` - saving you £${secondBest.extra.toFixed(2)} by choosing ${cheapest.store.name}.`; // We add a final sentence to the 
                                                        // message that encourages the user to choose the cheapest option to save money,
  }

  return msg; // Finally, we return the completed message that summarizes the cheapest option, how it compares to the user's budget, 
                  // and what the second best option is if it exists.
}

// ─────────────────────────────────────────────
// MAIN FUNCTION — called by App.js when button is clicked
// ─────────────────────────────────────────────
export function processShoppingRequest(query, postcode) { // This is the main function that takes the user's query and postcode, 
                          // extracts the budget, matches the items, calculates the baskets, and builds the summary message.
  const budget = extractBudget(query); // We extract the budget from the user's query using the extractBudget 
                                        // function we defined earlier.
  const items = matchItems(query); // We match the items in the user's query to real products using the matchItems function 
                                  // we defined earlier.

  if (!items.length) { // If we couldn't match any items from the user's query to our product data, we return a message saying 
                      // we couldn't find any matching products,
    return { // and we also return an empty list of items and baskets since we couldn't find any matches.
      success: false, // The "success" field is set to false to indicate that we couldn't process the request due to no matched items.
      aiResponse: "I couldn't find any matching products. Try typing items like: milk, eggs, chicken, bread.",
      items: [], // We return an empty list of items since we couldn't find any matches.
      baskets: [], // We return an empty list of baskets since we couldn't calculate any prices without matched items.
    };
  }

  const baskets = calcBaskets(items, postcode); // We calculate the total price of the basket at each store using the calcBaskets function we defined earlier,
                                              // which also sorts the stores by price and adds extra info for the summary.

  return { // Finally, we return an object containing the success status, the AI summary message, 
            // the list of matched items, and the list of calculated baskets.
    success: true, // The "success" field is set to true to indicate that we successfully processed the request and found matched items.
    aiResponse: buildSummary(items, baskets, budget),// We build the AI summary message using the buildSummary function we defined 
                                                // earlier, passing in the matched items, calculated baskets, and extracted budget.
    items, // We include the list of matched items in the response so that the frontend can display them to the user.
    baskets,// We include the list of calculated baskets in the response so that the frontend can display the price comparisons to the user.
  };
}
