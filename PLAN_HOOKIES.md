# Plan d'action Hookies

Ce document decrit ce que je vais implementer pour repondre a la demande cliente.

## Synthese client (version partageable)

- Espace employe: caisse enregistreuse, calculateur ingredients, agenda operationnel.
- Espace direction: module devis pour chiffrer rapidement une commande client.
- Espace client: interface tablette/borne connectee au flux de commandes.
- Creneaux: proposition de slots retrait/livraison selon disponibilite cuisine.

Benefice: un deploiement progressif qui apporte de la valeur des le premier module, sans bloquer l'activite.

## Objectif global

Mettre en place une suite complete:
- un espace employe (caisse, calculateur ingredients, agenda)
- un espace direction (devis)
- une borne/tablette client reliee au flux de commandes

## 1) Cote employe

### 1.1 Caisse enregistreuse
- creer une interface de caisse simple et rapide
- ajouter/supprimer des articles du menu
- calcul automatique du total (ex: menu 1 + menu 2)
- gestion des quantites
- remise (optionnelle) et mode de paiement
- validation et envoi de la commande vers l'espace commandes

### 1.2 Calculette ingredients -> nombre de menus
- definir les recettes par menu (ingredients + quantites)
- saisir le stock disponible (patate, salade, saumon, etc.)
- calculer combien de menus peuvent etre produits
- afficher l'ingredient limitant

### 1.3 Agenda operationnel
- agenda reservations
- agenda livraisons
- agenda evenements (ex: entreprise X, lot X)
- statuts: prevu, confirme, termine
- filtres par type d'evenement
- vue jour/semaine pour organisation equipe

## 2) Cote direction

### 2.1 Espace devis
- creer un devis client (ex: Monsieur X, X menus)
- calcul automatique du montant
- suivi statut devis (brouillon, envoye, accepte)
- preparation export/impression PDF
- recap clair: quantites, prix unitaire, total

## 3) Cote client

### 3.1 Interface borne/tablette
- parcours de commande simplifie
- panier + validation
- envoi direct vers l'espace commandes interne

### 3.2 Creneaux de retrait/livraison
- proposer des creneaux disponibles lors de la commande
- bloquer les creneaux pleins selon capacite
- afficher l'heure estimee au client
- logique de capacite similaire a une prise de rendez-vous

## 4) Plan de realisation (ordre)

1. module caisse employe (MVP)
2. agenda reservations/livraisons/evenements
3. espace devis direction
4. optimisation borne client + creneaux
5. finition UX, tests, validation metier

## 5) Decoupage en sprints

### Sprint 1 - Caisse employe (priorite haute)
- ecran caisse + panier + total
- envoi vers commandes internes
- controle acces EMPLOYEE/ADMIN/WEBMASTER

### Sprint 2 - Agenda operationnel
- reservations + livraisons + evenements
- filtres et statuts

### Sprint 3 - Devis direction
- creation devis + statut + total
- export PDF

### Sprint 4 - Borne client et creneaux
- parcours commande borne
- proposition de creneaux selon capacite

## 6) Estimation delai (indicative)

- Sprint 1: 3 a 5 jours
- Sprint 2: 4 a 6 jours
- Sprint 3: 3 a 5 jours
- Sprint 4: 4 a 7 jours

Total estime: 14 a 23 jours ouvrés (selon arbitrages et retours metier).

## 7) Estimation budget (indicative)

La charge peut etre chiffree en forfait par sprint ou en regie.

- Option forfait: prix fixe par sprint valide en amont.
- Option regie: facturation au temps passe avec reporting hebdomadaire.

Le chiffrage final dependra du niveau de finition UX, du PDF devis, et des regles creneaux.

## 8) Livrables

- ecrans fonctionnels pour chaque module
- routes API associees
- persistance BDD des nouvelles donnees
- controles d'acces par role (EMPLOYEE, ADMIN, WEBMASTER, CLIENT)
- tests de parcours critiques (commande, reservation, devis)
- documentation courte d'utilisation (equipe + direction)

## 9) Contrainte qualite

- ne pas casser les parcours existants (admin, espace client, menu)
- conserver les droits d'acces actuels
- deploiement progressif par module
- verification build avant mise en production
- recette metier avec validation cliente en fin de sprint
