//importing useState from React so we can store and upadte data on the page
import {useState} from 'react';
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


  const EXAMPLES = [
    '£10',
    '£20',
    '£30 budget, milk, eggs and bread',
    'chicken, rice and pasta',
    'salmon, potatoes and peas',
    'bacon, eggs and butter'
  ]

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
    }, 1200);
  };

  const handleExampleClick = (example) => {
    setQuery(example);
  }

  const handleReset = () => {
    setQuery('');
    setPostcode('BD1 1AA');
    setResult(null);
    setLoading(false);
  };

  return (
    <>
      <header className='app-header'>
        <h1 className='app-title' onClick={handleReset} style={{ cursor: 'pointer' }}>
            🛒 ShopQuick
        </h1>
        <p className='app-subtitle'>
          Tell us what you need and we'll find the cheapest basket near you.
        </p>
      </header>

      <div className='app-wrapper'>

      <div className='search-card'>
        <p className='search-card-label'>Your Shopping Request</p>

        <div className='input-group'>
          <input
          className='postcode-input'
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder='Postcode'
          />

          <textarea 
          className='query-textarea' 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          placeholder='e.g. "£40 budget, chicken, rice and eggs"'
          rows={3}
          />
        </div>

        <button className='search-button' onClick={handleSearch}>
          🔍Find cheapest basket
          </button>
      </div>

      {loading && (
        <div className='loading-box'>
          <div className='spinner'></div>
          <p> Comparing prices across 5 supermarkets... </p>
          </div>
      )}
      {/* this is for empty state, any items that havent been added in */}
      {!loading && !result && (
        <div className='empty-state'>
          <div className='empty-state-icon'></div>
          <h3>Ready to find your cheapest shop?</h3>
          <p>
            Type your grocery items above, add a budget if you like,<br />
            or try one of these examples:
          </p>
          <div className='example-chips'>
            {EXAMPLES.map((example) => (
              <button
              key={example}
              className='example-chip'
              onClick={() => handleExampleClick(example)}
              >
                {example}
                </button>
            ))}
            </div>
          </div>
      )}


      {result && !loading && (
        <div className='results-section'>


        <div className='ai-response-card'>
          <p className='card-label'>🤖 AI Summary</p>
          <p>{result.aiResponse}</p>          
    </div>

    {result.items && result.items.length > 0 && (
      <div className='item-card'>
        <h2> Items Found ({result.items.length})</h2>
        <div className='items-tag-list'>
          {result.items.map((item) => (
            <span key={item.id} className='item-tag'>
              {item.name}
            </span>
          ))}
        </div>
      </div>
    )}


    {result.baskets && result.baskets.length > 0 && (
      <div className='comparison-card'>
        <h2> Store Comparison</h2>
        <table className='store-table'>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Store</th>
              <th>Total</th>
              <th>vs Cheapest</th>
            </tr>
          </thead>
          <tbody>
            {result.baskets.map((basket, i) => (
              <tr
                key={basket.store.id}
                className={i === 0 ? 'winner-row' : ''}
                >

                <td>
                  <span className={`rank-badge ${i === 0 ? 'rank-1' : 'rank-other'}`}>
                    {basket.rank}
                    </span> 
                </td>

                <td>{basket.store.name}</td>

                <td className='price-bold'>£{basket.total.toFixed(2)}</td>
                <td>
                  {i === 0
                  ? <span className='cheapest-label'> CHEAPEST</span>
                : <span className='extra-cost'>+£{basket.extra.toFixed(2)}</span>
                }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}


    {!result.success && (
      <div className='error-card'>
        No items found. Try typing some grocery items like "milk, bread, eggs"!
      </div>
    )}
    
    </div>
      )}

      </div>
    </>
  );
}

export default App;