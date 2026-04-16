//importing useState from React so we can store and upadte data on the page
import {useState, useEffect} from 'react';
//import{GroceryItems, STORES} from './data/mockPrices';
import { processShoppingRequest } from './logic/basketEngine';
import './App.css'
import logo from './logo.png';

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

  //mealType is either dinner, lunch or other, which we send to the backend to help it understand the user's needs better
  //defaults to dinner, but user can change it with the buttons in the UI
  const [mealType, setMealType] = useState('dinner');

  //savedLists is an array of the user's saved shopping lists, which are stored in local storage so they persist between sessions
  // each entry has the form { id, mealType, query, result, savedAt }
  const [savedLists, setSavedLists] = useState([]);

//isDrawerOpen is true when the saved lists drawer is open, false otherwise
// we use this to show and hide the drawer when the user clicks the "Saved Lists" button or the close button
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


//profile stores the user's profile information, such as name, avatar, dietary preferences and default postcode
  const [profile, setProfile] = useState({
    name: '', // we can add a name field to the profile, which the user can edit in the profile drawer
    avatar: '🧑', // we can add an avatar field to the profile, which the user can choose from a set of emojis in the profile drawer
    dietary: [], // we can add a dietary field to the profile, which is an array of dietary preferences that the user can select in the profile drawer
    postcode: 'BD1 1AA',
  });

  //isProfileOpen is true when the profile drawer is open, false otherwise
  // we use this to show and hide the drawer when the user clicks the profile button or the close button
  const [isProfileOpen, setIsProfileOpen] = useState(false);

//isEditingProfile is true when the user is editing their profile, false when they are just viewing it
// we use this to switch between view mode and edit mode in the profile drawer, which show different UI and allow the user 
// to edit their information when in edit mode
  const[isEditingProfile, setIsEditingProfile] = useState(false);

  //profileDraft is a temporary state that holds the user's changes to their profile while they are editing it, so that 
  // they can cancel their changes if they want to without affecting the actual profile until they click save
  const[profileDraft, setProfileDraft] = useState({ ...profile});
  useEffect(() => { // this runs when the component first loads, we use it to load any saved lists and profile information 
                    // from local storage so that it persists between sessions
    const savedRaw = localStorage.getItem('shopquick_lists'); // we can use a unique key like 'shopquick_lists' to store our data 
                                                              //in local storage, to avoid conflicts with other data
    if(savedRaw) setSavedLists(JSON.parse(savedRaw)); // if there is any saved data under that key, we parse it from JSON 
                                                      // and set it to our state so we can use it in the UI

// we do the same for the profile information, using a different key like 'shopquick_profile'
    const savedProfile = localStorage.getItem('shopquick_profile'); 
    if(savedProfile){// if there is saved profile data, we parse it and set it to both the profile and profileDraft states, 
                    // so that the user can see their saved information and edit it if they want to
      const parsed = JSON.parse(savedProfile); // we can also set the postcode state to the saved postcode if it exists, 
                                              // so that the search box is pre-filled with their default postcode
      setProfile(parsed); // we update the profile state with the saved information, so that it shows in the profile view
      setProfileDraft(parsed);// we also update the profileDraft state with the same information, so that if the user clicks edit, 
                              // they see their current information in the input fields

      if (parsed.postcode) setPostcode(parsed.postcode); // if there is a saved postcode in the profile, we set it to the postcode state, 
                                                        // so that it shows in the search box and is used for searches
    }
  }, []);

  const handleSaveProfile = () => { // this function runs when the user clicks the "Save Profile" button in the profile drawer, 
                                    // it saves their changes to their profile
    setProfile(profileDraft);// we update the actual profile state with the changes they made in the profileDraft, 
                            // so that it shows in the profile view
    localStorage.getItem('shopquick_profile', JSON.stringify(profileDraft)); // we also save the updated profile information to local 
                                                                            // storage, so that it persists between sessions
    if(profileDraft.postcode) setPostcode(profileDraft.postcode); // if the user updated their default postcode, we also update the 
                                                                  // postcode state with the new value, so that it shows in the search 
                                                                  // box and is used for searches
    setIsEditingProfile(false); // after saving, we exit edit mode and go back to view mode in the profile drawer, 
                                // so that the user can see their updated information without the input fields
  };

  const handleToggleDietary = (option) => { // this function runs when the user clicks on a dietary preference button in the profile 
                                            // edit mode, it toggles that preference on or off in the profileDraft state
    setProfileDraft(prev => {// we update the profileDraft state based on the previous state, to ensure we are working with the latest 
                            // information
      const already = prev.dietary.includes(option); // we check if the option that was clicked is already in the dietary array of the 
                                                      // profileDraft, to know if we need to add it or remove it
      return{ // we return a new profileDraft object with the same information as before, but with the dietary array updated based on 
              // whether the option was already there or not
        ...prev, // we spread the previous profileDraft to keep all the other information the same
        dietary: already ? prev.dietary.filter(d => d !== option) : [...prev.dietary, option], // if the option was already in the 
                                                              // dietary array, we create a new array without that option using filter,
      };
    });
  };

  const EXAMPLES = [
    '£10', // we can have some example queries that the user can click on to quickly fill the search box and see how the app works,
    '£20',// these examples can include different budgets, items and meal types to show the variety of requests the app can handle
    '£30 budget, milk, eggs and bread',//
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
    setTimeout(() => { // after the delay, we call our backend function to process the shopping request, passing in the user's query 
                      // and postcode
      //call our backend function with whatever the user typed
      const res = processShoppingRequest(query, postcode);
      //save the results so the UI can display it
      setResult(res);
      // turn off loading message now that have results
      setLoading(false); // we can adjust the delay time as needed to balance realism and responsiveness, but around 1-2 seconds is 
                        // usually good for simulating AI processing without making the user wait too long
    }, 1200); // we can adjust the delay time as needed to balance realism and responsiveness, but around 1-2 seconds is usually good 
              // for simulating AI processing without making the user wait too long
  };

  const handleExampleClick = (example) => {// this function runs when the user clicks on one of the example chips, it fills the search 
                                            // box with that example query so they can see how it works
    setQuery(example);// we set the query state to the example that was clicked, which updates the search box with that text
  }

  const handleReset = () => {// this function runs when the user clicks on the app title in the header, it resets the search box, 
                            // postcode and results to start a new search
    setQuery('');// we clear the query state to empty string, which clears the search box
    setPostcode(profile.postcode || 'BD1 1AA');// we reset the postcode to the user's default postcode from their profile if it exists, 
                                              // or back to the original default if not
    setResult(null);// we clear the results state to null, which clears any displayed results and shows the empty state message
    setLoading(false);// we also make sure to turn off loading in case it was on, so that the loading message doesn't show when we reset
  };

  const handleSaveList = () => { // this function runs when the user clicks the "Save this list" button after getting results, it saves 
                                  // their search query, meal type and results
    const newEntry = {// we create a new entry object with the information we want to save about 
                      // this search, including a unique id, the meal type,
      id: Date.now(),// we can use the current timestamp as a simple unique id for each saved entry, since it's unlikely the user 
                    // will save multiple lists in the same millisecond
      mealType, query, result,// we save the meal type, query and result of this search, so that the user can see it in their 
                              // saved lists and refer back to it later
      savedAt: new Date().toLocaleDateString('en-GB')// we also save the date when this list was saved, so that the user can see 
                                                    // when they saved it in their list of saved entries
    };
  
    const updated = [newEntry, ...savedLists]; // we create a new array of saved lists with the new entry added to the beginning, 
                                              // so that the most recent saves show up first
    setSavedLists(updated);// we update the savedLists state with this new array, so that it shows in the UI 
                          // and the user can see their saved list right away
    localStorage.setItem('shopquick_lists', JSON.stringify(updated)); // we also save the updated list of saved entries to local 
                                                          // storage, so that it persists between sessions and the user can see
    setIsDrawerOpen(true);// after saving a new list, we automatically open the saved lists drawer so that the user 
                          // can see their saved entry and access it easily
  };
  
  const handleDeleteList = (idToDelete) => { // this function runs when the user clicks the delete button on one of their saved lists 
                                        // in the drawer, it removes that list from their saved entries

    const updated = savedLists.filter((entry) => entry.id !== idToDelete);// we create a new array of saved lists that excludes the entry with the id that was clicked for deletion,
                                                // using the filter method to keep all entries except the one we want to delete

    setSavedLists(updated);// we update the savedLists state with this new array, so that the deleted entry is removed from the UI and 
                          // the user can see their updated list of saved entries

    localStorage.setItem('shopquick_lists', JSON.stringify(updated))// we also save the updated list of saved entries to local storage, 
    // so that the deletion persists between sessions and the user doesn't see the deleted entry when they come back later
    };

  const [isListening, setIsListening] = useState(false);// this state variable tracks whether the app is currently listening for 
  // voice input, so we can update the UI accordingly (e.g. change the mic button color)

  const handleVoiceInput = () => {// this function runs when the user clicks the mic button, it activates the Web Speech API 
  // to listen for voice input and convert it to text

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;// we check if the browser supports the Web Speech API by looking for the SpeechRecognition object in the window,
    // and also check for the webkitSpeechRecognition for compatibility with some browsers like Chrome

    if (!SpeechRecognition) {// if the browser doesn't support the Web Speech API, we alert the user and return early from the 
                            // function to avoid errors
      alert("Your browser doesn't support voice to text feature. Try Google Chrome instead. ")// we can also provide a link to the 
                                      // Chrome download page in the alert message to help users get the right browser
    }

    const recognition = new SpeechRecognition// if the browser does support the Web Speech API, we create a new instance of the 
                            // SpeechRecognition object to start using it for voice input

    recognition.lang = 'en-GB';// we can set the language of the speech recognition to English (UK) to better understand users in that region,
    // and also because our example queries and responses are in English

    recognition.continuous = false;// we set continuous to false so that the recognition stops automatically after the user finishes 
                                  // speaking,

    recognition.interimResults = false;// we set interimResults to false so that we only get the final transcribed text after the user 
                                        // finishes speaking,

    recognition.start()// we start the speech recognition, which will prompt the user to allow microphone access and then listen 
                        // for their voice input
    setIsListening(true);// we set isListening to true to update the UI and indicate that the app is now listening for voice input

    recognition.onresult = (event) => {// this event handler runs when the speech recognition successfully transcribes the user's 
                                    // voice input into text,
      const spokenText = event.results[0][0].transcript;// we extract the transcribed text from the event object, 
      // which is usually found in event.results[0][0].transcript for the first result
      setQuery(spokenText);// we set the query state to the transcribed text, which updates the search box with what the user said
      setIsListening(false);// we set isListening to false to update the UI and indicate that the app has stopped listening after 
                            // getting the input
    }

    recognition.onerror = () => {// this event handler runs if there is an error during speech recognition, 
                          // such as if the user doesn't allow microphone access or if there is a problem with the recognition process
      setIsListening(false);// we set isListening to false to update the UI and indicate that the app has stopped 
                      // trying to listen for voice input
      alert("Couldn't hear anything. Please check your microphone is on and working! ")// we alert the user that there was an issue 
                                      // with getting their voice input, and suggest they check their microphone settings to fix it
    }

    recognition.onend = () => { // this event handler runs when the speech recognition service has stopped, either after 
                                // successfully getting input or after an error
      setIsListening(false);// we set isListening to false to update the UI and indicate that the app is no longer listening for  
                              // voice input
    }
  }
  return ( // we return the JSX that defines the UI of our app, using the state variables and event handlers we defined 
            // above to create an interactive experience for the user
    <>
      {/*   Header Section with title, subtitle and buttons for profile and saved lists   */}
      <header className='app-header'>
         <title>ShopQuick</title>
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

          {/*   Input group with postcode and query input, and voice input button   */}
        <div className='input-group'>
          <input
          className='postcode-input'
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)} // we bind the value of the postcode input to the postcode state, and 
          // update that state when the user types in the input, so that we can use the postcode for searches and show it in the input
          placeholder='Postcode'
          />
        <div style={{ position: 'relative'}}>
          <textarea 
          className='query-textarea' 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} // we use a textarea for the query input to allow for multi-line input and 
          // better display of longer queries, and we style it to have some padding on the right to make room for the mic button
          placeholder='e.g. "£40 budget, chicken, rice and eggs"'
          rows={3}
          style={{paddingRight: '48px'}}
          />

      
        <button
        onClick={handleVoiceInput}
        title="Click to speak your shopping list"
        className={`mic-button ${isListening ? 'listening' : ''}`}
        >
          {/* we can change the icon or color of the mic button based on whether the app is currently listening for voice input,
           to give the user visual feedback about the state of the voice input feature */}
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

        {/*   Results Section, shows the AI summary, list of items found and store comparison table   */}
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

    {/* we only show the store comparison table if there are any baskets in the results, which means the AI was able to find 
    prices for some of the items and compare them across stores. If there are no baskets, it means the AI couldn't find any prices 
    for the items, and we can show an error message instead. This way we avoid showing an empty or confusing table when there are 
    no results to compare. */}
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

        {/*   Profile Drawer   */}
      {isProfileOpen && (
        <div className='drawer-overlay' onClick={() => {
          setIsProfileOpen(false); // when the user clicks outside the drawer, we close the drawer and cancel 
          // any edits by resetting the profileDraft to the current profile information and exiting edit mode
          setIsEditingProfile(false);// we also make sure to exit edit mode if the user clicks outside the drawer, 
          // so that if they were in the middle of editing their profile and click away,
          setProfileDraft({ ...profile});// we reset the profileDraft to the current profile information, 
          // so that if they come back to edit again,
        }} />
      )}
        {/* we show the drawer overlay when the profile drawer is open, and clicking on it will 
        close the drawer and cancel any edits, by resetting the profileDraft to the current profile information and exiting edit mode */}
      <div className={`saved-drawer ${isProfileOpen ? 'drawer-open' : ''}`}>
        <div className='drawer-header'>
          <h2>My Profile</h2>
          <button className='drawer-close' onClick={() => {
            setIsProfileOpen(false); // when the user clicks the close button, we also close the drawer and cancel any edits by 
            // resetting the profileDraft to the current profile information and exiting edit mode

            setIsEditingProfile(false);// we also make sure to exit edit mode if the user clicks the close button, 
            // so that if they were in the middle of editing their profile and click close, they don't lose their current profile info 
            // and can come back to edit again if they want to without their unsaved changes still being there when they open the drawer again 

            setProfileDraft({ ...profile}); // we reset the profileDraft to the current profile information, 
            // so that if they come back to edit again, they see their actual saved 
            // information in the input fields instead of any unsaved changes they had before
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
            {AVATAR_OPTIONS.map(emoji => ( // we show the avatar options as buttons with the emoji, and highlight the one that is 
            // currently selected in the profileDraft state, so the user can see which one they have chosen while editing
              <button key={emoji} className={`avatar-option ${profileDraft.avatar === emoji ? 'avatar-selected' : ''}`}
              onClick={() => setProfileDraft(prev => ({ ...prev, avatar:emoji }))}
            > {emoji}
            </button>
            ))}
          </div>
          
          <p className='search-card-label' style={{ marginBottom: '18px', marginBottom: '6px'}}>Your Name</p> 
          <input className='postcode-input'
          style={{ width: '100%'}}
          value={profileDraft.name} // we use profileDraft.name as the value of the name input, 
                                    // so that when the user types in it, they are updating the profileDraft state 
                                    // and can see their changes in real time
          onChange={(e) => setProfileDraft(prev => ({ ...prev, name: e.target.value}))} // we update the name field in the 
                    // profileDraft state when the user types in the name input, so that they can see their changes as they make them
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
                onClick={() => handleDeleteList(entry.id)} // when the user clicks the delete button on a saved entry, 
                // we call the handleDeleteList function with that entry's id to remove it from their saved lists
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