#!/bin/bash

# Script de configuration de la base de données
# Ce script exécute les migrations Supabase et configure la base de données

echo "🚀 Configuration de la base de données..."

# Vérifier que Supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé"
    echo "📦 Installation de Supabase CLI..."
    npm install -g supabase
fi

# Vérifier les variables d'environnement
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Variables d'environnement Supabase manquantes"
    echo "📝 Veuillez configurer VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env.local"
    exit 1
fi

echo "✅ Variables d'environnement configurées"

# Exécuter les migrations
echo "📊 Exécution des migrations..."
supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Migrations exécutées avec succès"
else
    echo "❌ Erreur lors de l'exécution des migrations"
    exit 1
fi

# Vérifier la connexion à la base de données
echo "🔍 Vérification de la connexion..."
supabase status

if [ $? -eq 0 ]; then
    echo "✅ Connexion à la base de données réussie"
else
    echo "❌ Erreur de connexion à la base de données"
    exit 1
fi

echo "🎉 Configuration de la base de données terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vérifiez que toutes les tables sont créées"
echo "2. Testez l'authentification"
echo "3. Lancez l'application avec 'npm run dev'" 