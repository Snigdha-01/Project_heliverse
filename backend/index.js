const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

const dataFilePath = path.join(__dirname, 'heliverse_mock_data.json');

app.use(cors());
app.use(express.json());

// Route handler for the root URL
app.get('/', (req, res) => {
    res.json('Hello');
});

// retrieve all users
app.get('/api/users', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// specific user by ID
app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }
        const users = JSON.parse(data);
        const user = users.find(user => user.id === userId);
        if (!user) {
            res.status(404).send('User not found');
            return;
        }
        res.json(user);
    });
});

// create a new user
app.post('/api/users', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }
        const users = JSON.parse(data);
        const newUser = req.body;
        // Generate a unique ID for the new user (replace with your logic)
        newUser.id = users.length > 0 ? users[users.length - 1].id + 1 : 1;
        users.push(newUser);
        fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), err => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing JSON file');
                return;
            }
            res.status(201).json(newUser);
        });
    });
});

// update an existing user
app.put('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }
        let users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            res.status(404).send('User not found');
            return;
        }
        const updatedUser = { ...users[userIndex], ...req.body };
        users[userIndex] = updatedUser;
        fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), err => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing JSON file');
                return;
            }
            res.json(updatedUser);
        });
    });
});

//delete a user by ID
app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading JSON file');
            return;
        }
        let users = JSON.parse(data);
        const updatedUsers = users.filter(user => user.id !== userId);
        if (users.length === updatedUsers.length) {
            res.status(404).send('User not found');
            return;
        }
        fs.writeFile(dataFilePath, JSON.stringify(updatedUsers, null, 2), err => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing JSON file');
                return;
            }
            res.status(204).end();
        });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

