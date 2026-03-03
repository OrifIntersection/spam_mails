# Art generative project - spam_mails 
<<<<<<< Updated upstream
Dans le cadre de la partie art génératif de notre planning, nous réalisons un programme permettant de transformer les spams d'une boîte mail en une œuvre artistique générée par notre machine à partir des données reçues.

## Données utilisables :
Longueur des mots, liens contenus dans le mail, taille du mail, mail de l'expéditeur, IP du serveur de l'expéditeur, les pièces jointes, l'heure d'envoi, et bien plus encore...

## Données traitées dans notre projet: 
Voici les données que nous utilisons actuellement dans les mails reçus : <br>
Liens contenus dans le mail, pièces jointes & script cachés

## Outils utilisés
=======

Script for filter spam mails and recover some informations about the spam

##  Données utilisables :

Longueur des mots, liens contenus dans le mail, taille du mail, mail de l'expéditeur, IP du serveur de l'expéditeur, heure d'envoi, et bien plus encore...

##  Données utilisées :

Voici les données que nous traitons actuellement dans les mails reçus :

Liens contenus dans le mail, pièces jointes & script cachés

##  Possibilités coté JavaScript :

**Métadonnées** : La librairie JS "mailparser" nous permet de récupérer les métadonnées du mail afin de pouvoir les utiliser par la suite.

**Liens, scripts, pièces jointes...** : Nous utilisons un regex et recherchons des mots clés afin de déterminer si un mail contient ou non des liens/scripts.

**Bienveillance du mail** : Un appel à une API nous permet de filtrer la bienveillance du mail. 

## Itinéraire de nos données

## Redirection du mail
Le principe de base était d'automatiser la procédure d'analyse afin que le processus puisse fonctionner en effectuant le moins de tâches possibles. 
#### V1
Dans un premier temps, nous devrons lancer notre serveur Node.JS, [ngrok](https://ngrok.com/) en local ainsi que le scénario de [Make](https://eu1.make.com/) en distant afin d'établir une connexion entre les différents services.

Je me suis donc rendu sur make.com afin de créer un mailhook qui récéptionnerai tout les mails à traiter. Il suffit de lui envoyer nos spams directement à cette adresse : 2u6idvmpcyvee3z2dwreqly87o44qnfc@hook.eu1.make.com.
Afin de pouvoir communiquer directement avec notre serveur express (Node.JS ) local, nous utilisons ngrok qui sert de tunnel entre Make et mon localhost. Cela va pouvoir permettre à Make via une requête HTTP d'envoyer le mail directement sur mon serveur local.

![Schéma de la redirection des mails](/assets/images/redirection_schema.png)
>>>>>>> Stashed changes
