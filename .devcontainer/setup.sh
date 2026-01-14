#!/bin/bash

# Avvia PostgreSQL
sudo service postgresql start

# Crea il database e l'utente
sudo -u postgres psql -c "CREATE USER planetalert WITH PASSWORD 'planetalert';"
sudo -u postgres psql -c "CREATE DATABASE planetalert;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE planetalert TO planetalert;"
sudo -u postgres psql -c "ALTER USER planetalert WITH SUPERUSER;"

# Imposta le variabili d'ambiente
echo "export POSTGRES_URL='postgres://planetalert:planetalert@localhost:5432/planetalert'" >> ~/.bashrc
echo "export POSTGRES_PRISMA_URL='postgres://planetalert:planetalert@localhost:5432/planetalert?pgbouncer=true'" >> ~/.bashrc
echo "export POSTGRES_URL_NON_POOLING='postgres://planetalert:planetalert@localhost:5432/planetalert'" >> ~/.bashrc

# Ricarica il bashrc
source ~/.bashrc

# Installa le dipendenze
pnpm install

# Genera e applica le migrazioni del database
pnpm db:generate
pnpm db:push 