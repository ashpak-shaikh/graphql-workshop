#!/bin/bash

# Kill any existing Node.js processes
pkill -f "node index.js"

# Start the server
npm start
