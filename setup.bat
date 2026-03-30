@echo off
REM Script para setup inicial do WorkinOrg no Windows

echo ╔════════════════════════════════════════╗
echo ║     WORKINORG - Setup Inicial          ║
echo ║     Sistema de Gerenciamento de        ║
echo ║     Academia com Node.js + React       ║
echo ╚════════════════════════════════════════╝
echo.

REM Verificar se Node.js está instalado
echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não está instalado!
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

REM Verificar se MongoDB está instalado ou accessível
echo.
echo [2/5] Verificando MongoDB...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  MongoDB não está instalado localmente
    echo Opções:
    echo   1. Instalar MongoDB: https://www.mongodb.com/try/download/community
    echo   2. Usar MongoDB Atlas: https://www.mongodb.com/cloud/atlas
    echo   3. Usar Docker: docker run -d -p 27017:27017 --name mongodb mongo
    echo.
    echo Pressione uma tecla para continuar...
    pause
) else (
    echo ✅ MongoDB encontrado
)

REM Instalar dependências do Backend
echo.
echo [3/5] Instalando dependências do Backend...
cd Back-End
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar Backend
    pause
    exit /b 1
)
echo ✅ Backend configurado
cd ..

REM Criar admin inicial
echo.
echo [4/5] Criando admin inicial...
cd Back-End
call npm run seed
if errorlevel 1 (
    echo ⚠️  Erro ao criar admin (verifique MongoDB)
) else (
    echo ✅ Admin criado: admin@workinorg.com / admin123
)
cd ..

REM Instalar dependências do Frontend
echo.
echo [5/5] Instalando dependências do Frontend...
cd Front-End
call npm install
if errorlevel 1 (
    echo ❌ Erro ao instalar Frontend
    pause
    exit /b 1
)
echo ✅ Frontend configurado
cd ..

echo.
echo ╔════════════════════════════════════════╗
echo ║   ✅ Setup Concluído com Sucesso!      ║
echo ╚════════════════════════════════════════╝
echo.
echo 📚 Próximos passos:
echo.
echo 1️⃣  Abra dois terminais diferentes
echo.
echo Terminal 1 - Backend:
echo   cd Back-End
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd Front-End
echo   npm run dev
echo.
echo 🌐 Acesse http://localhost:5173
echo 🔐 Use: admin@workinorg.com / admin123
echo.
echo Para mais informações, leia o README.md
echo.
pause
