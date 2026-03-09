# Art generative project - spam_mails 

Script for filter spam mails and recover some informations about the spam

##  Données utilisables :
Longueur des mots, liens contenus dans le mail, taille du mail, mail de l'expéditeur, IP du serveur de l'expéditeur, heure d'envoi, et bien plus encore...

##  Données utilisées :

Voici les données que nous traitons actuellement dans les mails reçus :

Liens contenus dans le mail, pièces jointes & script cachés...
<br>
{
  "id": "1772790547513-vc3u4e",
  "date_reception": "2026-03-06T09:49:07.555Z",
  "sujet": "Fwd: Plus que 7 jours pour gagner 100 €",
  "expediteur": "yaelfavre22@gmail.com",
  "destinataires": [],
  "date_envoi": "2026-03-06T09:49:07.127Z",
  "return_path": "<yaelfavre22@gmail.com>",
  "a_texte": true,
  "a_html": true,
  "taille_texte": 6538,
  "liens": [],
  "pieces_jointes": [],
  "suspect": {
    "liens_raccourcis": false,
    "urls_ip": false,
    "mots_urgence": false,
    "points_exclamation": 0,
    "majuscules": 10
  },
  "score_agressivite": 30
}

##  Possibilités coté JavaScript :

**Métadonnées** : La librairie JS [mailparser](https://nodemailer.com/extras/mailparser) nous permet de récupérer les métadonnées du mail afin de pouvoir les utiliser par la suite.

**Liens, scripts, pièces jointes...** : Nous utilisons un regex et recherchons des mots clés afin de déterminer si un mail contient ou non des liens/scripts.

**Bienveillance du mail** : Un appel à une API ou une IA externe nous permettrait de filtrer la bienveillance du mail. Cependant afin de maintenir la confidentialité de nos mails, nous installons une librairie afin de traiter les données en local.

## Librairies utilisées: mailparser, mailparse, express, node-nlp et csv-parser

## Itinéraire de nos données
Voici l'itinéraire complet de nos données, en premier temps, nous devrons réceptionner le mail afin de pouvoir en extraire les données. Nous procédons à une redirection de mail afin d'automatiser au maximum le processus.

### Redirection du mail
Le principe de base était d'automatiser la procédure d'analyse afin que le processus puisse fonctionner en effectuant le moins de tâches possibles. 
#### V1
Dans un premier temps, nous devrons lancer notre serveur Node.JS, [ngrok](https://ngrok.com/) en local ainsi que le scénario de [Make](https://eu1.make.com/) en distant afin d'établir une connexion entre les différents services.

Je me suis donc rendu sur make.com afin de créer un mailhook qui récéptionnerai tout les mails à traiter. Il suffit de lui envoyer nos spams directement à cette adresse : 2u6idvmpcyvee3z2dwreqly87o44qnfc@hook.eu1.make.com.
Afin de pouvoir communiquer directement avec notre serveur express (Node.JS ) local, nous utilisons ngrok qui sert de tunnel entre Make et mon localhost. Cela va pouvoir permettre à Make via une requête HTTP d'envoyer le mail directement sur mon serveur local.

![Schéma de la redirection des mails](/assets/images/redirection_schema.png)


### Emotions du mail
Afin de filtrer les émotions du mail, nous utilisons un [NLP](https://www.ibm.com/fr-fr/think/topics/natural-language-processing). Après avoir comparé plusieurs NLP, l'outil utilisé sera [...](https://ngrok.com/)  .
