@echo off
cd backend
if not exist node_modules call npm install
start "SkillDuel Backend" cmd /k npm start
cd ..\frontend
if not exist node_modules call npm install
start "SkillDuel Frontend" cmd /k npm run dev
