const express = require('express');
const fileUpload = require('multer');
const httpRequest = require('axios'); 

const server = express();
const SERVER_PORT = process.env.PORT || 3000;

// Config memory storage
const memoryStorageConfig = fileUpload.memoryStorage();
const uploadHandler = fileUpload({ storage: memoryStorageConfig });


server.post('/analyse-logo', uploadHandler.single('logoImage'), async (req, res) => {
    try {
        // Extract image
        const uploadedImage = req.file.buffer;

        // Config URL from roboflow
        const detectionServiceURL = 'https://detect.roboflow.com/?model=logo-detection-mqarb&version=1&api_key=fs4TtQbPBjt66gu4tDiY';
        const serviceApiKey = 'fs4TtQbPBjt66gu4tDiY';
        const serviceResponse = await httpRequest.post(detectionServiceURL, { image: uploadedImage }, {
            headers: {
                'Authorization': `Bearer ${serviceApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Extract prediction
        const logoPrediction = serviceResponse.data.prediction;
        res.json({ logoPrediction });
    } catch (error) {
        console.error('Erreur lors de l analyse de l image :', error);
        res.status(500).json({ error: 'Problème lors de l analyse de l image' });
    }
});

// Access to html file
server.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Init server
server.listen(SERVER_PORT, () => {
    console.log(`Serveur opérationnel sur le port ${SERVER_PORT}`);
});