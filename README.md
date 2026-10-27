# SOSSEN Card

Carte Home Assistant pour les micro-onduleurs **SOSSEN**, compagne de l'intégration
[SOSSEN Direct](https://github.com/ritonbrunis-lab/sossen-direct).

*English version below.*

![Tablette, thème sombre](images/tablette-sombre.png)

<p>
  <img src="images/telephone-sombre.png" width="32%" alt="Téléphone, thème sombre">
  <img src="images/telephone-clair.png" width="32%" alt="Téléphone, thème clair">
  <img src="images/alarme.png" width="32%" alt="Alarme et onduleur hors ligne">
</p>

## Ce qu'elle montre

- **Production totale** en direct, onduleurs en production, énergie du jour et puissance autorisée.
- **Chaque onduleur** : puissance, barre de production avec le repère de sa limite, badge *Bridé*, *Alarme* ou *Hors ligne*,
  température et détail de chaque panneau (puissance et tension). Les modèles 4in1 affichent leurs 4 panneaux.
- **Tension du réseau** : jauge avec les seuils de la protection anti-surtension et la coupure à 253 V, maximum du jour,
  dernière action de la protection.
- **Graphique du jour** : production et tension, avec les seuils.
- Un appui sur un onduleur ouvre sa fiche ; un appui sur sa limite permet de la changer.

## Aucune configuration

La carte trouve toute seule les onduleurs de l'intégration SOSSEN Direct, quels que soient leurs noms ou la langue.
Elle fonctionne aussi avec l'intégration [SOSSEN](https://github.com/caveman2024/sossen-ha) (`sossen-ha`).
Elle suit le thème de Home Assistant (clair ou sombre), s'adapte au téléphone, à la tablette et à l'ordinateur,
et parle la langue de ton profil : français, anglais, allemand, espagnol, italien ou néerlandais (sinon anglais).

## Installation

**HACS** (recommandé) : HACS → ⋮ → Dépôts personnalisés → `https://github.com/ritonbrunis-lab/sossen-card`,
catégorie *Tableau de bord*. Installe **SOSSEN Card**, puis recharge la page.

**À la main** : copie `dist/sossen-card.js` dans `config/www/`, puis Paramètres → Tableaux de bord → ⋮ → Ressources →
Ajouter `/local/sossen-card.js` (module JavaScript).

## Utilisation

Ajoute la carte **SOSSEN Card** depuis le sélecteur de cartes, ou en YAML :

```yaml
type: custom:sossen-card
```

Options (toutes facultatives, aussi réglables dans l'éditeur visuel) :

| Option | Défaut | Rôle |
|---|---|---|
| `title` | « Solaire » | Titre de la carte |
| `inverters` | tous | Liste d'appareils (identifiants d'appareil) à afficher, dans cet ordre |
| `show_voltage` | `true` | Tension du réseau et protection |
| `show_panels` | `true` | Détail des panneaux |
| `show_chart` | `true` | Graphique du jour |
| `compact` | `false` | Tuiles réduites (sans panneaux ni limite) |

## Carte d'un onduleur : `sossen-inverter-card`

Un onduleur en détail : production et pourcentage de sa limite, puissance max du modèle, limite (un appui pour la changer),
tension, température, rendement ou fréquence, chaque panneau (puissance, tension, courant, part de la production),
énergie du jour, graphique du jour et nombre de commandes de limite reçues. Pose-en une par onduleur :

```yaml
type: custom:sossen-inverter-card
device: <identifiant de l'appareil>   # choisi dans l'éditeur visuel
# facultatif : title, show_chart
```

## Bon à savoir

- La carte lit l'historique et les statistiques de Home Assistant pour le graphique et l'énergie du jour
  (rafraîchis toutes les 5 minutes).
- Un onduleur est dit *bridé* quand il produit à moins de 40 W de sa limite (même règle que la protection de l'intégration).
- Projet personnel, **sans lien avec SOSSEN** ni avec Tuya, fourni tel quel (licence MIT).

---

# SOSSEN Card (English)

Home Assistant card for **SOSSEN** micro-inverters, companion of the
[SOSSEN Direct](https://github.com/ritonbrunis-lab/sossen-direct) integration.

- Live total production, inverters producing, today's energy and allowed power.
- Each inverter: power, production bar with its limit marker, *Limited* / *Alarm* / *Offline* badge, temperature and
  per-panel power and voltage (4in1 models show their 4 panels).
- Grid voltage gauge with the overvoltage protection thresholds and the 253 V trip, today's maximum and the protection's last action.
- Today's chart: production and voltage with thresholds. Tap an inverter for its details, tap its limit to change it.

No configuration needed: the card discovers the SOSSEN Direct inverters by itself, follows your Home Assistant theme
(light or dark), adapts to phone, tablet and desktop, and speaks English, French, German, Spanish, Italian or Dutch.
It also works with the [SOSSEN](https://github.com/caveman2024/sossen-ha) integration (`sossen-ha`).

**Install with HACS**: HACS → ⋮ → Custom repositories → `https://github.com/ritonbrunis-lab/sossen-card`, category *Dashboard*.
Or copy `dist/sossen-card.js` to `config/www/` and add `/local/sossen-card.js` as a JavaScript module resource.

```yaml
type: custom:sossen-card
# optional: title, inverters (device ids), show_voltage, show_panels, show_chart, compact
```

`custom:sossen-inverter-card` (option `device`) shows a single inverter in detail: limit, voltage, temperature,
efficiency, each panel, today's energy and chart, limit commands received. Add one per inverter.

Personal project, **not affiliated with SOSSEN** or Tuya, provided as is (MIT licence).
