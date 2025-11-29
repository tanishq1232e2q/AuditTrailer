const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { getVersions, addVersion, getLastText } = require('./content');

const app = express();
app.use(express.json());
app.use(cors()); // 

// GET using it we can get all versions
app.get('/versions', (req, res) => {

  res.json(getVersions());
});

// POST it is used for saving a version
app.post('/saveversion', (req, res) => {
  const { text } = req.body;
  if(!text){
    return res.status(400).json({ error: 'Text is required' });
  }

  const oldText = getLastText(); // Previous versions text
  const timestamp = new Date().toISOString(); //setting timestamp

  // Calculating Custom Diff Logic 
  // Split into words on the whitespace
  const oldWords = oldText ? oldText.split(/\s+/) : [];
  const newWords = text.split(/\s+/);

  // Use Sets for added/removed
  const oldSet = new Set(oldWords);
  const newSet = new Set(newWords);

  // Add in new but not old
  const addedWords = newWords.filter(word => !oldSet.has(word));

  // Removed: in old but not new
  const removedWords = oldWords.filter(word => !newSet.has(word));

  // Lengths
  const oldLength = oldWords.length;
  const newLength = newWords.length;

  // Creating a Version object
  const version = {
    id: uuidv4(),
    timestamp,
    addedWords,
    removedWords,
    oldLength,
    newLength,
    newText: text
  };

  addVersion(version); // content file

  res.json({ success: true, version });
});

app.listen(5000, () => console.log('Backend on http://localhost:5000'));