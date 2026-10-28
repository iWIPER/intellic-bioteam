@echo off
cd /d "%~dp0"
echo Abrindo a apresentacao IntelliC em http://localhost:8501
python -m streamlit run app.py --server.port 8501
pause
