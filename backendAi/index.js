const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/comedyShows')
.then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const showSchema = new mongoose.Schema({
  title: String,
  prompts: [String],
  generatedShow: String,
  createdAt: { type: Date, default: Date.now }
});

const Show = mongoose.model('Show', showSchema);

app.post('/generate-show', async (req, res) => {
  const { title, prompts } = req.body;
  const generatedShow = prompts.join(' ') + ' ... comedy magic happens here!';
  const newShow = new Show({ title, prompts, generatedShow });

  try {
    await newShow.save();
    res.status(200).json(newShow);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/shows', async (req, res) => {
  try {
    const shows = await Show.find();
    res.status(200).json(shows);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
