//importing useState from React so we can store and upadte data on the page
import {useState, UseState} from 'react';
//import{GroceryItems, STORES} from './data/mockPrices';
import { processShoppingRequest } from './logic/basketEngine';
import './App.css'

function App() {
  // stores whatever the user has typed in the serch box
  const [query, setQuery] = useState('');
  // stores the users postcode, defuaulting to BD1 - test only, will change later to user's input
  const [postcode, setPostcode] = useState('BD1 1AA')
  //results are stored the data returned from processShoppingRequest
  //starts as null due to nothing has been searched yet
  const [result, setResult] = useState(null);
  //loading is true while we can proceess the search, false otherwise
  // we use this to show the comparing message
  const [loading, setLoading] = useState(false);

  //this function runs when the user clicks the "find cheapest basket" button
  const handleSearch = () => {
    //if the search box is empty, do nothing
    if(!query.trim()) return;
    //set loading to true so the loading message appears on screen
    setLoading(true);
    //clear any previous results while the new search runs
    setResult(null);
    //adds a small delay to simulate the AI processing the request
    setTimeout(() => {
      //call our backend function with whatever the user typed
      const res = processShoppingRequest(query);
      //save the results so the UI can display it
      setResult(res);
      // turn off loading message now that have results
      setLoading(false);
    }, 100);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1>🛒 ShopQuick</h1>
      <p>Tell us what you need and we'll find the cheapest basket near you.</p>

      <input
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
        placeholder="Postcode"
        style={{ padding: 10, marginRight: 10, borderRadius: 8, border: '1px solid #ccc' }}
      />

      <br /><br />

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder='e.g. "£40 budget, chicken, rice and eggs"'
        rows={3}
        style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', fontSize: 15 }}
      />

      <br />

      <button
        onClick={handleSearch}
        style={{ marginTop: 10, padding: '10px 24px', background: '#00c853', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer' }}
      >
        Find Cheapest Basket
      </button>

      {loading && <p>Comparing prices across 5 supermarkets...</p>}

      {result && !loading && (
        <div>
          <h2>AI Response</h2>
          <p style={{ background: '#f0fff4', padding: 16, borderRadius: 8, border: '1px solid #00c853' }}>
            {result.aiResponse}
          </p>

          <h2>Items Found ({result.items.length})</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {result.items.map((item) => (
              <span key={item.id} style={{ background: '#eee', padding: '4px 12px', borderRadius: 50, fontSize: 13 }}>
                {item.name}
              </span>
            ))}
          </div>

          <h2>Store Comparison</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Rank</th>
                <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Store</th>
                <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Total</th>
                <th style={{ padding: 12, textAlign: 'left', border: '1px solid #ddd' }}>Extra vs Cheapest</th>
              </tr>
            </thead>
            <tbody>
              {result.baskets.map((basket, i) => (
                <tr key={basket.store.id} style={{ background: i === 0 ? '#f0fff4' : '#fff' }}>
                  <td style={{ padding: 12, border: '1px solid #ddd' }}>#{basket.rank}</td>
                  <td style={{ padding: 12, border: '1px solid #ddd' }}>{basket.store.name}</td>
                  <td style={{ padding: 12, border: '1px solid #ddd', fontWeight: 'bold' }}>£{basket.total.toFixed(2)}</td>
                  <td style={{ padding: 12, border: '1px solid #ddd', color: i === 0 ? 'green' : 'red' }}>
                    {i === 0 ? 'CHEAPEST' : `+£${basket.extra.toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {result && !result.success && !loading && (
        <p style={{ color: 'red' }}>No items found. Try typing some grocery items!</p>
      )}
    </div>
  );



  //console.log("Items: ", GroceryItems);
  //console.log("Stores: ", STORES)
  //const results = processShoppingRequest ("£40 budget, chicken, rice and eggs");
  //console.log("Result: ", results);
  
  //return(
    //<div>
      //<h1>ShopQuick</h1>
    //</div>
  //);
}



export default App
