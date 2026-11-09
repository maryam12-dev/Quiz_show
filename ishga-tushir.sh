#!/bin/sh
cd backend && { [ -d node_modules ] || npm install; } && (npm start &) 
cd ../frontend && { [ -d node_modules ] || npm install; } && npm run dev
