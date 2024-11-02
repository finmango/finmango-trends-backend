const express = require('express');
const cors = require('cors');
const googleTrends = require('google-trends-api');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*'  // Allow all origins for now
}));

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/trends', async (req, res) => {
    try {
        const {
            terms = '',
            startDate,
            endDate,
            geo = ''
        } = req.query;

        const searchTerms = terms.split(',').filter(term => term.trim());

        if (searchTerms.length === 0) {
            return res.status(400).json({ error: 'No search terms provided' });
        }

        const options = {
            keyword: searchTerms,
            startTime: new Date(startDate),
            endTime: new Date(endDate),
            geo: geo || undefined
        };

        const results = await googleTrends.interestOverTime(options);
        const data = JSON.parse(results);

        res.json(data);
    } catch (error) {
        console.error('Error fetching trends:', error);
        res.status(500).json({ error: 'Failed to fetch trends data' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
