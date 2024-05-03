#!/bin/bash

# Controlla se il nome del container è stato fornito come argomento
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <container_name>"
  exit 1
fi

container_name=$1

# Ottieni l'ID del container basato sul nome fornito
container_id=$(docker ps -qf "name=$container_name")

# Verifica se l'ID del container è stato trovato
if [ -z "$container_id" ]; then
  echo "Nessun container trovato con il nome '$container_name'."
  exit 1
fi

# Elimina il container utilizzando l'ID
docker rm -f "$container_id"

echo "Container '$container_name' eliminato con successo."

#Clean dei package maven
mvn clean package

#Compose UP
docker compose up -d --build 