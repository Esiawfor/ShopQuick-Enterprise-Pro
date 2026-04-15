//importing useState from React so we can store and upadte data on the page
import {useState, useEffect} from 'react';
//import{GroceryItems, STORES} from './data/mockPrices';
import { processShoppingRequest } from './logic/basketEngine';
import './App.css'

const AVATAR_OPTIONS = ['👩', '👨'];

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Halal']
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

  const [mealType, setMealType] = useState('dinner');

  const [savedLists, setSavedLists] = useState([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);



  const [profile, setProfile] = useState({
    name: '',
    avatar: '🧑',
    dietary: [],
    postcode: 'BD1 1AA',
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const[isEditingProfile, setIsEditingProfile] = useState(false);

  const[profileDraft, setProfileDraft] = useState({ ...profile});
  useEffect(() => {
    const savedRaw = localStorage.getItem('shopquick_lists');
    if(savedRaw) setSavedLists(JSON.parse(savedRaw));

    const savedProfile = localStorage.getItem('shopquick_profile');
    if(savedProfile){
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setProfileDraft(parsed);

      if (parsed.postcode) setPostcode(parsed.postcode);
    }
  }, []);

  const handleSaveProfile = () => {
    setProfile(profileDraft);
    localStorage.getItem('shopquick_profile', JSON.stringify(profileDraft));
    if(profileDraft.postcode) setPostcode(profileDraft.postcode);
    setIsEditingProfile(false);
  };

  const handleToggleDietary = (option) => {
    setProfileDraft(prev => {
      const already = prev.dietary.includes(option);
      return{
        ...prev,
        dietary: already ? prev.dietary.filter(d => d !== option) : [...prev.dietary, option],
      };
    });
  };

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
      const res = processShoppingRequest(query, postcode);
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
    setPostcode(profile.postcode || 'BD1 1AA');
    setResult(null);
    setLoading(false);
  };

  const handleSaveList = () => {
    const newEntry = {
      id: Date.now(),
      mealType, query, result,
      savedAt: new Date().toLocaleDateString('en-GB')
    };
  
    const updated = [newEntry, ...savedLists];
    setSavedLists(updated);
    localStorage.setItem('shopquick_lists', JSON.stringify(updated));
    setIsDrawerOpen(true);
  };
  
  const handleDeleteList = (idToDelete) => {

    const updated = savedLists.filter((entry) => entry.id !== idToDelete);

    setSavedLists(updated);

    localStorage.setItem('shopquick_lists', JSON.stringify(updated))
    };

  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn't support voice to text feature. Try Google Chrome instead. ")
    }

    const recognition = new SpeechRecognition

    recognition.lang = 'en-GB';

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.start()
    setIsListening(true);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setQuery(spokenText);
      setIsListening(false);
    }

    recognition.onerror = () => {
      setIsListening(false);
      alert("Couldn't hear anything. Please check your microphone is on and working! ")
    }

    recognition.onend = () => {
      setIsListening(false);
    }
  }
  return (
    <>
      <header className='app-header'>
        <h1 className='app-title' onClick={handleReset} style={{ cursor: 'pointer' }}>
            🛒 ShopQuick
        </h1>
        <p className='app-subtitle'>
          Tell us what you need and we'll find the cheapest basket near you.
        </p>
        <div className='header-buttons'>
          <button className='drawer-trigger' onClick={() => setIsProfileOpen(true)}>
            <span>{profile.avatar}</span>
            {profile.name ? profile.name : 'My Profile'}
          </button>

          <button className='drawer-trigger' onClick={() => setIsDrawerOpen(true)}>
            Saved Lists
            {savedLists.length > 0 && (
              <span className='saved-count'>{savedLists.length}</span>
            )}
          </button>
        </div>
      </header>
                        {/*      Main Content */     } 
      <div className='app-wrapper'>

      <div className='search-card'>
        <p className='search-card-label'>Your Shopping Request</p>
      
      <div className='meal-selector'>
        <p className='search-card-label'>This shop is for...</p>
        <div className='meal-options'>
          {['dinner', 'lunch', 'other'].map((type) => (
            <button
            key={type}
            className={`meal-btn ${mealType === type ? 'meal-btn-active' : ''}`}
            onClick={() => setMealType(type)}
            >
            {type === 'dinner' ? '🍽️' : type === 'lunch' ? '🥗' : '🛒'} 
            {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>


        <div className='input-group'>
          <input
          className='postcode-input'
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder='Postcode'
          />
        <div style={{ position: 'relative'}}>
          <textarea 
          className='query-textarea' 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          placeholder='e.g. "£40 budget, chicken, rice and eggs"'
          rows={3}
          style={{paddingRight: '48px'}}
          />

      
        <button
        onClick={handleVoiceInput}
        title="Click to speak your shopping list"
        className={`mic-button ${isListening ? 'listening' : ''}`}
        >
          {isListening ? '🔴' : '🎤'}
        </button> 
        </div>
        </div>
        <button className='search-button' onClick={handleSearch}>
          🔍Find cheapest basket
          </button>
      </div>
      
      {/*   loading state   */}
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
              <th>Distance</th>
              <th>vs Cheapest</th>
              <th>vs Closest</th>
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

                <td>{basket.distance.toFixed(1)} miles</td>
                <td>
                  {i === 0
                  ? <span className='cheapest-label'> CHEAPEST</span>
                : <span className='extra-cost'>+£{basket.extra.toFixed(2)}</span>
                }
                </td>
                <td>
                  {basket.extraDistance === 0
                  ? <span className='closest-label'> CLOSEST</span>
                : <span className='extra-distance'>+{basket.extraDistance.toFixed(1)} mi</span>
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
    
    {result.success && (
      <button className='save-button' onClick={handleSaveList}>
        Save this {mealType} list
      </button>
    )}
    </div>
      )}
      </div>


      {isProfileOpen && (
        <div className='drawer-overlay' onClick={() => {
          setIsProfileOpen(false);
          setIsEditingProfile(false);
          setProfileDraft({ ...profile});
        }} />
      )}

      <div className={`saved-drawer ${isProfileOpen ? 'drawer-open' : ''}`}>
        <div className='drawer-header'>
          <h2>My Profile</h2>
          <button className='drawer-close' onClick={() => {
            setIsProfileOpen(false);
            setIsEditingProfile(false);
            setProfileDraft({ ...profile});
          }}>x</button>
        </div>
      </div>
        
      
      {/* View Mode */}
      {!isEditingProfile && (
        <div className='profile-view'>

          <div className='profile-avatar-display'>{profile.avatar}</div>

          <h3 className='profile-name'>
            {profile.name || 'No name set'}
          </h3>

          <div className='profile-info-row'>
            <span className='profile-info-label'> Postcode</span>
            <span className='profile-info-value'>{profile.postcode || '-'}</span>
          </div>

          <div className='profile-info-row'>
            <span className='profile-info-label'>Dietary</span>
            <div className='profile-dietary-tags'>
              {profile.dietary.length > 0 ? profile.dietary.map(d => (
                <span key={d} className='item-tag'>{d}</span>
              ))
              : <span style={{ color: 'var(--text-mid)', fontSize: '0.85rem'}}></span>
            }
            </div>
          </div>
          
          <button className='search-button' style={{ marginTop: '20px'}}
          onClick={() => setIsEditingProfile(true)}>
            Edit Profile
          </button>        
        </div>
      )}

      {/* Edit Mode */}
      {isEditingProfile && (
        <div className='profile-edit'>

          {/* Choose Avatar */}
          <p className='search-card-label' style={{ marginBottom: '10px'}}>Choose your avatar</p>
          <div className='avatar-picker'>
            {AVATAR_OPTIONS.map(emoji => (
              <button key={emoji} className={`avatar-option ${profileDraft.avatar === emoji ? 'avatar-selected' : ''}`}
              onClick={() => setProfileDraft(prev => ({ ...prev, avatar:emoji }))}
            > {emoji}
            </button>
            ))}
          </div>
          
          <p className='search-card-label' style={{ marginBottom: '18px', marginBottom: '6px'}}>Your Name</p>
          <input className='postcode-input'
          style={{ width: '100%'}}
          value={profileDraft.name}
          onChange={(e) => setProfileDraft(prev => ({ ...prev, name: e.target.value}))}
          placeholder='e.g. Mark'
          />

          <p className='search-card-label' style={{ marginTop: '18px', marginBottom: '6px'}}>Default Postcode</p>
          <input className='postcode-input'
          style={{ width: '100%'}}
          value={profileDraft.postcode}
          onChange={(e) => setProfileDraft(prev => ({ ...prev, postcode: e.target.value}))}
          placeholder='e.g. BD1 1AA'
          />

          <p className='search-card-label' style={{ marginTop: '18px', marginBottom: '10px'}}>Dietary Preferences</p>
          <div className='meal-options' style={{ flexWrap: 'wrap' }}>
            {DIETARY_OPTIONS.map(option => (
              <button
              key={option}
              className={`meal-btn ${profileDraft.dietary.includes(option) ? 'meal-btn-active' : ''}`}
              onClick={() => handleToggleDietary(option)}
              >
                {option}
              </button>
            ))}
          </div>


          {/* Save and Cancel button */}
          <button className='search-button' style={{marginTop: '24px'}}
          onClick={handleSaveProfile}>
            Save Profile
          </button>
          <button className='save-button' style={{ marginTop: '10px'}}
          onClick={() => {
            setIsEditingProfile(false);
            setProfileDraft({ ...profile});
          }}>
            Cancel
          </button>

        </div>
      )}



      {isDrawerOpen && (
        <div className='drawer-overlay' onClick={() => setIsDrawerOpen(false)} />
      )}

      <div className={`saved-drawer ${isDrawerOpen ? 'drawer-open' : ''}`}>

        <div className='drawer-header'>
          <h2>Saved Lists</h2>
          <button className='drawer-close' onClick={() => setIsDrawerOpen(false)}>x</button>
        </div>

        {savedLists.length === 0 && (
          <p className='drawer-empty'>No saved lists yet! Run a search and press Save</p>
        )}

        {savedLists.map((entry) => (
          <div key={entry.id} className='saved-entry'>
            <div className='saved-entry-header'>
              <span className='saved-meal-badge'>
                {entry.mealType === 'dinner' ? '🍽️' : entry.mealType === 'lunch' ? '🥗' : '🛒'}
                {entry.mealType.charAt(0).toUpperCase() + entry.mealType.slice(1)}
              </span>
              <span className='saved-date'>"{entry.savedAt}</span>
              <button
                className='delete-btn'
                onClick={() => handleDeleteList(entry.id)}
                title='Delete this list'
                >
                🗑️
                </button>
            </div>
            <p className='saved-query'>"{entry.query}"</p>
            {entry.result.baskets?.[0] && (
              <p className='saved-cheapest'>
                Cheapest: <strong>{entry.result.baskets[0].store.name}</strong> - £{entry.result.baskets[0].total.toFixed(2)}
              </p>
            )}
      </div>
        ))}

    </div>
    </>
  );
}

export default App;