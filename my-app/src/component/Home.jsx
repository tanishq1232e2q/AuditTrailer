import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [versions, setVersions] = useState([]);

  
  const fetchVersions = async () => {
      try {
          const res = await axios.get('http://localhost:5000/versions');
          setVersions(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };
    
    
    useEffect(() => {
      fetchVersions();
    }, []);
  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5000/saveversion', { text });
      fetchVersions(); // Refresh history
      alert('Version saved!');
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Mini Audit Trail Generator</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Content Editor</h2>
            <div className="form-floating">
    <textarea onChange={(e)=>setText(e.target.value)} style={{height:"200px"}} className="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
    <label for="floatingTextarea">Enter any text</label>
    </div>
        <button style={{marginTop:"2rem"}}
          onClick={handleSave}
          className='btn btn-outline-primary'
        >
          Save Version
        </button>
      </div>

      <div>
        <h2>Version History</h2>
        {versions.length === 0 ? (
          <p>No versions yet. Save one!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {versions.map((ele) => (
              <li key={ele.id} style={{ display:"flex",flexDirection:"column", justifyContent:"flex-start",alignItems:"flex-start", marginBottom: '1rem', padding: '1rem', border: '2px solid lightblue', borderRadius: '4px' }}>
                <p><strong>ID:</strong> <span>{ele.id}</span></p>
                <p><strong>Timestamp:</strong> {ele.timestamp}</p>
                
               <p><strong>Added Words:</strong> {ele.addedWords.join(', ') || 'None'}</p> 
               <p><strong>Removed Words:</strong> {ele.removedWords.join(', ') || 'None'}</p> 
               <p><strong>Old Length:</strong> {ele.oldLength} words</p> 
               <p><strong>New Length:</strong> {ele.newLength} words</p> 
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;