const port = 13100;

// build a consistent response object
function buildResult(userId, score) {
    let result = {};
    result["userId"] = userId;
    result["score"] = score;
    return result;
}

// create the Express server
import express from 'express';
const app = express();
app.use(express.json());

// our score repository, which we will replace with Redis...
const allScores = {};

// post a score for a user, writing over any previous score
app.post('/scoresByUser/:userId', async (req, res) => {
    if (!req.body.score) {
        console.log("No req.body.score found; did you forget to update putter & the postman json script?");
        res.sendStatus(400);
        return;
    }
    allScores[req.params.userId] = req.body.score; 
    let result = buildResult(req.params.userId, req.body.score);
    console.log(`Created score for user ${result.userId}: ${result.score}`);
    res.send(result);   
});

// get the score stored for this user
app.get('/scoresByUser/:userId', async (req, res) => {
    let score = allScores[req.params.userId];
    if (score == null) {
        res.sendStatus(404);
        return;
    }
    let result = buildResult(req.params.userId, score);
    res.send(result);
});

// start the server
app.listen(port, error => {
    if (error != null) {
        console.log(`Error starting Express server on port ${port}: ${error}`);
    } else {
        console.log(`Listening on port ${port}`);
    }
});
