## Documentation Backend

## Introduction

Cette documentation décrit la mise en place, les exigences techniques et les composants clés du Backend de notre application.

## Technologies Utilisées

Nous avons adopté une stack moderne pour la construction de notre Backend, qui inclut:

**Node.js** : Notre principal environnement d'exécution.

**GraphQL** : Pour une API flexible et performante.

**MongoDB** : Pour une gestion efficace des données non structurées.

**MySQL** : Pour gérer des données relationnelles.

## Exigences de Mise en Place

Avant de commencer, assurez-vous d'avoir satisfait aux prérequis suivants:

**Node.js** : Il est nécessaire pour exécuter le backend.

**MongoDB** : Créez une base de données locale nommée "haircare". Voici un guide pour vous aider. (cf: (https://www.mongodb.com/fr-fr/basics/create-database#:~:text=Pour%20créer%20une%20base%20de,avec%20la%20commande%20«%20use%20».&text=Attendez%20une%20seconde%20!))

**MySQL** : Créez également une base de données locale nommée "haircare". Consultez ce guide pour plus de détails.
Installation et Démarrage (cf: (https://fr.wikihow.com/créer-une-base-de-données-MySQL#:~:text=Créez%20votre%20base%20de%20données,de%20données%20sans%20espace%20aucun.))

- Pour installer toutes les dépendances, exécutez:

`npm install`
###### ou
`yarn install`

- Pour démarrer le serveur, exécutez:

`npm start`
###### ou
`yarn start`

⚠️ **Remarque**: Si vous préférez utiliser yarn, assurez-vous de l'avoir préalablement installé.

## Aperçu du Projet

Notre Backend est composé des éléments suivants:

**Connexion aux Bases de Données** : Nous avons établi des connexions robustes avec MongoDB et MySQL.

**Modélisation des Données** : Pour MongoDB, nous avons les collections Produit et Programme. Pour MySQL, nous disposons des tables User et Routine.

**Intégration GraphQL** : Nous avons intégré GraphQL pour interagir facilement avec nos bases de données.

**Schémas et Résolveurs** : Mise en place des requêtes CRUD pour les utilisateurs, produits, routines et programmes.
Ajout de Nouvelles Données

Si vous souhaitez ajouter de nouvelles données ou fonctionnalités à notre projet, comme Programme ou Routine, vous devez suivre une structure spécifique:

- Créez un dossier pour la nouvelle donnée, par exemple Programme.
- Dans ce dossier, créez deux fichiers essentiels : resolver.js et schéma.js.
- Ensuite, vous pourrez ajouter et tester vos données directement via le playground GraphQL.

⚠️ **Remarque**: Pour effectuer des requêtes dans le playground GraphQL, une inscription est requise.

## Variables d'Environnement

Pour le bon fonctionnement de notre application, vous devrez créer un fichier .env à la racine de votre projet et y ajouter les variables d'environnement suivantes:

######  #Base de données
MONGO_DB_URL=

MYSQL_DB_NAME=

MYSQL_USER=

MYSQL_PASSWORD=

MYSQL_HOST=

###### #JWT (JSON Web Token)
JWT_SECRET=

###### # Environnement
NODE_ENV=development

**Assurez-vous de remplir ces variables avec vos propres informations avant de démarrer le serveur.**

## Playground Apollo Server

Vous pouvez visualiser et tester les requêtes directement via le playground Apollo Server.

## Image du Playground

 [Backend/Capture-avancement/capture.png]