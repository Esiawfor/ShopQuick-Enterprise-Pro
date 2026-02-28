//bringing in the grocery items stored in the mock prices 
import{GroceryItems, STORES} from '../data/mockPrices';


//this is the budget extraction, where it pulls out the budget from the user's message
//for example "£40 budget" --> 40
export function extractTheBudget(input){
    //the different ways a user might type a budget
    //each line is a different type of pattern
    const patterns= [
        /£\s*(\d+(?:\.\d{1,2})?)/i,
    /(\d+(?:\.\d{1,2})?)\s*pounds?/i,
    /budget\s*(?:of|is|:)?\s*£?\s*(\d+(?:\.\d{1,2})?)/i,
    /spend\s*£?\s*(\d+(?:\.\d{1,2})?)/i,
    ];
    // here it loops through each pattern and test it against what users type
    for (const pattern of patterns){
        const match = input.match(pattern);
        if (match) return parseFloat(match[1]);
    }
    // if no budget is found in the user's input it returns null
    return null;
}

// this is item matching, where it scans the users 
// input for keywords and returns matching items
export function matchItems(input){
    //converts everyhting to lowercases
    const lower = input.toLowerCase();
    //stores all theitems we find
    const matched = [];
    
    //loop through every grocery item in the database
    for(const item of GroceryItems){
        //loop through each keyword that item has
        for(const keyword of item.keywords){
            //check if the user's input contains this keyword
            if(lower.includes(keyword.toLowerCase())){
                //makes sure there isnt a duplicate item to avoid any sort of duplication
                if(!matched.find((m)=> m.id==item.id)){
                    matched.push(item);
                }
                // stops checking keywords for this item once we found one match
                break;
            }
        }
        

    }
    //return the full list of matched items
    return matched;
}


//Basket calculation - for each store, adds up the price of every matched
//item
export function calcualteTheBaskets(matchItems){
    //loop though every store in our list
    return STORES.map((store) => {
        //for each store, map every matched item to its price at the store
        const breakdown = matchItems.map((item) => ({
            name:item.name, //name of the items
            price: item.prices[store.id], //price of the items at the specifc store
            category:item.category,// what the items categories is

        }));
        //add up all the item prices to get the basket total
        //toFixed(2) rounds it to 2 decimal places
        const total = parseFloat(
            breakdown.reduce((sum,item)=> sum + item.price,0).toFixed(2)
        );
        
        //return the store's information, total cost and full item breakdown
        return{
            store,
            total,
            breakdown,
        };

    });
}

//this code will sort the baskets cheapest first and adds extra cost vs cheapest
export function rankBaskets(baskets,budget){
    //sort all the basket by total price, lowest first
    const sorted = [...baskets].sort((a,b)=> a.total - b.total);
    //grab the cheapest total so we can compare other stores agasint it
    const cheapest = sorted[0].total;
    
    //go through each sorted basket and add extra info
    return sorted.map((basket, index) => ({
        ...basket, //keep all the existing basket data
        rank: index +1, // ranks the prices from cheapest - rank 1 and increments to the most expensive the more ranks it has
        extra: parseFloat((basket.total-cheapest).toFixed(2)), // how much more than cheapest
        withinBudget: budget ? basket.total <= budget: null, // is it within the user's budget
    }));
}

// generates the message shown to the user
export function generateAIResponse(rankedBaskets, budget, matchItems){
    // if no items were found then a message telling the user to try again
    if(matchItems.length == 0){
        return "I couldn't find any matching items. Try Something like: '£40 budget, chicken, rice, eggs and bread'.";
    }
    // get the cheapest and second cheapest from ranked stores
    const best = rankedBaskets[0];
    const sec = rankedBaskets[1];

    //if something is wrong and we dont have at least 2 stores, stop here
    if(!best || !sec) {
        return "Something went wrong calculating the basket"
    }
    
    //work out the budget message depending on whether they are over
    const BudgetNote = budget
    ? best.withinBudget
    ? `That's £${(budget-best.total).toFixed(2)} under your £${budget} budget!` //under budget
    : `Note: this is £${(best.total-budget).toFixed(2)} over your £${budget} budget.` //over budget
    :"";// no budget given so leave this blank

    //full response message shown to the user
    return `Your cheapest basket is £${best.total.toFixed(2)} at ${best.store.name}.${BudgetNote} 
    Your second best option is ${sec.store.name} at £${sec.total.toFixed(2)} - 
    saving you £${sec.extra.toFixed(2)} by choosing ${best.store.name}.`;
}

//here the code where you can call - pass in the raw data from user input
//and returns evertyhing the UI needs to display results

export function processShoppingRequest(input){
    //pull out the budget from the user's message
    const budget = extractTheBudget(input);
    //find all the grocery items the user mentioned
    const matchedItems = matchItems(input);

    //if no items were found, return an unsuccessful result straight away
    if(matchedItems.length === 0 ){
        return {
            success: false, budget,
            items: [],
            baskets: [],
            aiResponse: generateAIResponse([], budget, []),
        };
    }

    //calculate the basket total at each store
    const baskets = calcualteTheBaskets(matchedItems);
    //rank the baskets cheapest first
    const rankedBaskets = rankBaskets(baskets, budget);
    //generate the AI response
    const aiResponse = generateAIResponse(rankedBaskets, budget, matchedItems);

    //return everyhting the UI needs to display the results
    return{
        success: true, budget,
        items: matchedItems,
        baskets: rankedBaskets, aiResponse,
    };

}
