#!/bin/bash

echo "🚀 Iniciando deploy do EMS Backend..."

# 1. Parar containers existentes
echo "📦 Parando containers existentes..."
docker-compose down

# 2. Limpar volumes antigos (opcional - remova se quiser manter dados)
echo "🧹 Limpando volumes antigos..."
# docker-compose down --volumes

# 3. Construir e iniciar os serviços
echo "🔨 Construindo e iniciando serviços..."
docker-compose up -d

# 4. Aguardar serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 10

# 5. Executar migrações do banco
echo "📊 Executando migrações do banco..."
npm run db:migrate

# 6. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 7. Fazer build da aplicação
echo "🔨 Fazendo build da aplicação..."
npm run build

# 8. Iniciar aplicação
echo "🚀 Iniciando aplicação..."
npm start

echo "✅ Deploy concluído!"
echo "📡 API disponível em: http://localhost:3333"
echo "📚 Documentação disponível em: http://localhost:3333/docs" 