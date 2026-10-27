/*
 * SOSSEN Card — carte Lovelace pour l'intégration SOSSEN Direct (micro-onduleurs SOSSEN).
 * https://github.com/ritonbrunis-lab/sossen-card — licence MIT.
 *
 * Aucune configuration obligatoire : la carte trouve toute seule les onduleurs de l'intégration
 * `sossen_direct` (registre des entités : plateforme + translation_key), quels que soient leurs noms.
 * Un seul fichier, sans dépendance ni compilation. Suit le thème Home Assistant (clair ou sombre).
 */
const SC_VERSION = '1.0.0';
const DOMAINES = ['sossen_direct', 'sossen'];

// translation_key de l'intégration → rôle dans la carte
const CLES = {
  ac_power_w: 'ac', ac_voltage_v: 'v', status: 'etat', power_limit: 'limite', temperature_c: 'temp',
  energy_total_kwh: 'energie', dc_power_total_w: 'dc',
  dc_power_1_w: 'p1', dc_power_2_w: 'p2', dc_power_3_w: 'p3', dc_power_4_w: 'p4',
  dc_voltage_1_v: 'u1', dc_voltage_2_v: 'u2', dc_voltage_3_v: 'u3', dc_voltage_4_v: 'u4',
  limit_commands: 'commandes', ac_frequency_hz: 'freq',
  dc_current_1_a: 'i1', dc_current_2_a: 'i2', dc_current_3_a: 'i3', dc_current_4_a: 'i4',
  overvoltage_protection: 'protection', protection_last_action: 'action',
  protection_high_voltage: 'seuil_haut', protection_low_voltage: 'seuil_bas',
};
const COUPURE_V = 253;            // les onduleurs se déconnectent vers 253 V (norme EN 50549 / VDE)
const MARGE_BRIDE = 40;           // production à moins de 40 W de la limite = onduleur bridé (même règle que l'intégration)

const TXT = {
  fr: {
    titre: 'Solaire', en_prod: (n, t) => `${n}/${t} en production`, aujourdhui: "aujourd'hui", au_repos: 'Au repos',
    producing: 'En production', alarm: 'Alarme', off: 'Arrêt', hors_ligne: 'Hors ligne', bride: 'Bridé',
    limite: 'limite', panneau: 'Panneau', tension: 'Tension réseau', max: 'max', protection: 'Protection',
    prot_on: 'Protection active', prot_off: 'Protection coupée', coupure: 'coupure', seuils: 'seuils',
    graphe: 'Production et tension', production: 'Production', aucun: "Aucun onduleur SOSSEN Direct trouvé.",
    aucun2: "Installe l'intégration SOSSEN Direct, ou indique les onduleurs dans la configuration de la carte.",
    nuit: 'Les onduleurs dorment : ils se réveillent avec le soleil.', autorise: 'autorisés',
    e_titre: 'Titre', e_onduleurs: 'Onduleurs (vide = tous)', e_tension: 'Tension et protection',
    e_panneaux: 'Détail des panneaux', e_graphe: 'Graphique du jour', e_compact: 'Compacte',
    e_onduleur: 'Onduleur', choisir: "Choisis un onduleur dans la configuration de la carte.", frequence: 'Fréquence',
    temperature: 'Température', rendement: 'Rendement', max_modele: 'max du modèle', commandes: (n) => `${n} commandes de limite reçues`,
    tension_ac: 'Tension', limite_maj: 'Limite', panneaux: 'Panneaux', part: 'de la production', de_limite: 'de la limite',
  },
  en: {
    titre: 'Solar', en_prod: (n, t) => `${n}/${t} producing`, aujourdhui: 'today', au_repos: 'Idle',
    producing: 'Producing', alarm: 'Alarm', off: 'Off', hors_ligne: 'Offline', bride: 'Limited',
    limite: 'limit', panneau: 'Panel', tension: 'Grid voltage', max: 'max', protection: 'Protection',
    prot_on: 'Protection on', prot_off: 'Protection off', coupure: 'trip', seuils: 'thresholds',
    graphe: 'Production and voltage', production: 'Production', aucun: 'No SOSSEN Direct inverter found.',
    aucun2: 'Install the SOSSEN Direct integration, or list the inverters in the card configuration.',
    nuit: 'The inverters are asleep: they wake up with the sun.', autorise: 'allowed',
    e_titre: 'Title', e_onduleurs: 'Inverters (empty = all)', e_tension: 'Voltage and protection',
    e_panneaux: 'Panel details', e_graphe: "Today's chart", e_compact: 'Compact',
    e_onduleur: 'Inverter', choisir: 'Pick an inverter in the card configuration.', frequence: 'Frequency',
    temperature: 'Temperature', rendement: 'Efficiency', max_modele: 'model max', commandes: (n) => `${n} limit commands received`,
    tension_ac: 'Voltage', limite_maj: 'Limit', panneaux: 'Panels', part: 'of production', de_limite: 'of the limit',
  },
  de: {
    titre: 'Solar', en_prod: (n, t) => `${n}/${t} in Betrieb`, aujourdhui: 'heute', au_repos: 'Ruhezustand',
    producing: 'In Betrieb', alarm: 'Alarm', off: 'Aus', hors_ligne: 'Offline', bride: 'Gedrosselt',
    limite: 'Limit', panneau: 'Modul', tension: 'Netzspannung', max: 'max', protection: 'Schutz',
    prot_on: 'Schutz aktiv', prot_off: 'Schutz aus', coupure: 'Abschaltung', seuils: 'Schwellen',
    graphe: 'Erzeugung und Spannung', production: 'Erzeugung', aucun: 'Kein SOSSEN-Direct-Wechselrichter gefunden.',
    aucun2: 'Installiere die Integration SOSSEN Direct oder gib die Wechselrichter in der Kartenkonfiguration an.',
    nuit: 'Die Wechselrichter schlafen: Sie wachen mit der Sonne auf.', autorise: 'erlaubt',
    e_titre: 'Titel', e_onduleurs: 'Wechselrichter (leer = alle)', e_tension: 'Spannung und Schutz',
    e_panneaux: 'Moduldetails', e_graphe: 'Tagesdiagramm', e_compact: 'Kompakt',
    e_onduleur: 'Wechselrichter', choisir: 'Wähle einen Wechselrichter in der Kartenkonfiguration.', frequence: 'Frequenz',
    temperature: 'Temperatur', rendement: 'Wirkungsgrad', max_modele: 'Modell-Max.', commandes: (n) => `${n} Limit-Befehle empfangen`,
    tension_ac: 'Spannung', limite_maj: 'Limit', panneaux: 'Module', part: 'der Erzeugung', de_limite: 'des Limits',
  },
  es: {
    titre: 'Solar', en_prod: (n, t) => `${n}/${t} produciendo`, aujourdhui: 'hoy', au_repos: 'En reposo',
    producing: 'Produciendo', alarm: 'Alarma', off: 'Apagado', hors_ligne: 'Sin conexión', bride: 'Limitado',
    limite: 'límite', panneau: 'Panel', tension: 'Tensión de red', max: 'máx.', protection: 'Protección',
    prot_on: 'Protección activa', prot_off: 'Protección desactivada', coupure: 'desconexión', seuils: 'umbrales',
    graphe: 'Producción y tensión', production: 'Producción', aucun: 'No se ha encontrado ningún inversor SOSSEN Direct.',
    aucun2: 'Instala la integración SOSSEN Direct o indica los inversores en la configuración de la tarjeta.',
    nuit: 'Los inversores duermen: se despiertan con el sol.', autorise: 'permitidos',
    e_titre: 'Título', e_onduleurs: 'Inversores (vacío = todos)', e_tension: 'Tensión y protección',
    e_panneaux: 'Detalle de los paneles', e_graphe: 'Gráfico del día', e_compact: 'Compacta',
    e_onduleur: 'Inversor', choisir: 'Elige un inversor en la configuración de la tarjeta.', frequence: 'Frecuencia',
    temperature: 'Temperatura', rendement: 'Rendimiento', max_modele: 'máx. del modelo', commandes: (n) => `${n} órdenes de límite recibidas`,
    tension_ac: 'Tensión', limite_maj: 'Límite', panneaux: 'Paneles', part: 'de la producción', de_limite: 'del límite',
  },
  it: {
    titre: 'Solare', en_prod: (n, t) => `${n}/${t} in produzione`, aujourdhui: 'oggi', au_repos: 'A riposo',
    producing: 'In produzione', alarm: 'Allarme', off: 'Spento', hors_ligne: 'Non in linea', bride: 'Limitato',
    limite: 'limite', panneau: 'Pannello', tension: 'Tensione di rete', max: 'max', protection: 'Protezione',
    prot_on: 'Protezione attiva', prot_off: 'Protezione disattivata', coupure: 'distacco', seuils: 'soglie',
    graphe: 'Produzione e tensione', production: 'Produzione', aucun: 'Nessun inverter SOSSEN Direct trovato.',
    aucun2: "Installa l'integrazione SOSSEN Direct o indica gli inverter nella configurazione della scheda.",
    nuit: 'Gli inverter dormono: si svegliano con il sole.', autorise: 'consentiti',
    e_titre: 'Titolo', e_onduleurs: 'Inverter (vuoto = tutti)', e_tension: 'Tensione e protezione',
    e_panneaux: 'Dettaglio dei pannelli', e_graphe: 'Grafico del giorno', e_compact: 'Compatta',
    e_onduleur: 'Inverter', choisir: "Scegli un inverter nella configurazione della scheda.", frequence: 'Frequenza',
    temperature: 'Temperatura', rendement: 'Rendimento', max_modele: 'max del modello', commandes: (n) => `${n} comandi di limite ricevuti`,
    tension_ac: 'Tensione', limite_maj: 'Limite', panneaux: 'Pannelli', part: 'della produzione', de_limite: 'del limite',
  },
  nl: {
    titre: 'Zonne-energie', en_prod: (n, t) => `${n}/${t} in productie`, aujourdhui: 'vandaag', au_repos: 'In rust',
    producing: 'In productie', alarm: 'Alarm', off: 'Uit', hors_ligne: 'Offline', bride: 'Begrensd',
    limite: 'limiet', panneau: 'Paneel', tension: 'Netspanning', max: 'max', protection: 'Beveiliging',
    prot_on: 'Beveiliging actief', prot_off: 'Beveiliging uit', coupure: 'afschakeling', seuils: 'drempels',
    graphe: 'Productie en spanning', production: 'Productie', aucun: 'Geen SOSSEN Direct-omvormer gevonden.',
    aucun2: 'Installeer de integratie SOSSEN Direct of geef de omvormers op in de kaartconfiguratie.',
    nuit: 'De omvormers slapen: ze worden wakker met de zon.', autorise: 'toegestaan',
    e_titre: 'Titel', e_onduleurs: 'Omvormers (leeg = alle)', e_tension: 'Spanning en beveiliging',
    e_panneaux: 'Paneeldetails', e_graphe: 'Grafiek van vandaag', e_compact: 'Compact',
    e_onduleur: 'Omvormer', choisir: 'Kies een omvormer in de kaartconfiguratie.', frequence: 'Frequentie',
    temperature: 'Temperatuur', rendement: 'Rendement', max_modele: 'max. van het model', commandes: (n) => `${n} limietopdrachten ontvangen`,
    tension_ac: 'Spanning', limite_maj: 'Limiet', panneaux: 'Panelen', part: 'van de productie', de_limite: 'van de limiet',
  },
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const CSS = `
:host{display:block}
ha-card{display:block;overflow:hidden;
  --sc-solaire:#ffd60a;--sc-solaire-txt:var(--sc-solaire);--sc-ok:#30d158;--sc-alerte:#ff9f0a;--sc-coupure:#ff453a;--sc-bleu:#64d2ff;
  --sc-texte:var(--primary-text-color);--sc-texte2:var(--secondary-text-color);--sc-trait:var(--divider-color,rgba(127,127,127,.2));
  --sc-tuile:color-mix(in srgb,var(--primary-text-color) 5%,transparent);--sc-piste:color-mix(in srgb,var(--primary-text-color) 11%,transparent);
  font-variant-numeric:tabular-nums;color:var(--sc-texte);-webkit-tap-highlight-color:transparent}
ha-card.clair{--sc-solaire-txt:#a87400;--sc-alerte:#c25e00;--sc-coupure:#d70015;--sc-ok:#1f9d48}
.c{container-type:inline-size;padding:18px 18px 16px;display:flex;flex-direction:column;gap:14px}
.etiq{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--sc-texte2);display:flex;align-items:center;gap:7px}
.pt{width:8px;height:8px;border-radius:50%;flex:none;background:currentColor}
.u{font-size:.5em;font-weight:600;color:var(--sc-texte2);margin-left:3px;letter-spacing:0}
/* en-tête */
.tete{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap}
.tete .g{flex:1 1 260px;min-width:0}
.hero{font-size:44px;font-weight:800;letter-spacing:-.03em;line-height:1.05;margin-top:4px}
.sous{font-size:13.5px;color:var(--sc-texte2);margin-top:3px;font-weight:500}
.puces{display:flex;gap:6px;flex-wrap:wrap}
.puce{display:inline-flex;align-items:center;gap:6px;min-height:30px;padding:0 11px;border-radius:15px;background:var(--sc-tuile);
  font-size:12.5px;font-weight:600;white-space:nowrap;cursor:pointer;border:0;color:inherit;font-family:inherit}
.soleil{width:16px;height:16px;flex:none;color:var(--sc-solaire)}
.soleil.actif{animation:sc-tourne 24s linear infinite}
@keyframes sc-tourne{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.soleil.actif{animation:none}}
/* tension */
.tension{background:var(--sc-tuile);border-radius:18px;padding:13px 14px 11px}
.tension .l1{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.tension .val{font-size:20px;font-weight:800}
.jauge{position:relative;height:8px;border-radius:4px;margin:12px 0 4px;background:var(--sc-piste);overflow:visible}
.jauge .z{position:absolute;top:0;bottom:0}
.jauge .curseur{position:absolute;top:-5px;width:4px;height:18px;border-radius:2px;background:var(--sc-texte);
  box-shadow:0 0 0 2px var(--ha-card-background,var(--card-background-color,#fff));transform:translateX(-2px);transition:left .8s ease}
.jauge .maxi{position:absolute;top:-3px;width:2px;height:14px;background:var(--sc-texte2);opacity:.7;transform:translateX(-1px)}
.reperes{position:relative;height:15px;font-size:11px;font-weight:600;color:var(--sc-texte2)}
.reperes span{position:absolute;transform:translateX(-50%);white-space:nowrap}
.reperes span:first-child{transform:none}
.action{font-size:12.5px;color:var(--sc-texte2);margin-top:4px;line-height:1.4}
.action b{color:var(--sc-texte);font-weight:600}
/* onduleurs */
.grille{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.grille.seul{grid-template-columns:minmax(0,1fr)!important}
@container (min-width:620px){
  .seul .ond{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);column-gap:26px;row-gap:7px;align-content:start}
  .seul .ond>:not(.pann){grid-column:1}
  .seul .ond .pann{grid-column:2;grid-row:1 / span 4;border-top:0;border-left:1px solid var(--sc-trait);padding:2px 0 2px 22px;margin:0;align-content:center;gap:6px}
  .seul .ond .pann div{font-size:13px}
  .seul .ond .w{font-size:34px}
}
@container (min-width:620px){.grille{grid-template-columns:repeat(var(--sc-col-m,2),minmax(0,1fr))}}
@container (min-width:860px){.grille{grid-template-columns:repeat(var(--sc-col,4),minmax(0,1fr))}}
@container (max-width:300px){.grille{grid-template-columns:minmax(0,1fr)}}
.ond{background:var(--sc-tuile);border-radius:18px;padding:12px 13px 11px;display:flex;flex-direction:column;gap:7px;cursor:pointer;
  min-width:0;transition:opacity .3s}
.ond.eteint{opacity:.62}
.ond .nom{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:700;min-width:0}
.ond .nom span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ond .ligw{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:2px 6px;min-width:0}
.ond .badge{flex:none;font-size:10.5px;font-weight:700;padding:2px 7px;border-radius:9px;white-space:nowrap;
  background:color-mix(in srgb,var(--sc-alerte) 18%,transparent);color:var(--sc-alerte)}
.ond .badge.rouge{background:color-mix(in srgb,var(--sc-coupure) 18%,transparent);color:var(--sc-coupure)}
.ond .w{font-size:27px;font-weight:800;letter-spacing:-.02em;line-height:1.05}
.barre{position:relative;height:6px;border-radius:3px;background:var(--sc-piste)}
.barre i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:var(--sc-solaire);transition:width .8s ease}
.barre b{position:absolute;top:-3px;width:2px;height:12px;border-radius:1px;background:var(--sc-alerte);transform:translateX(-1px)}
.ond .lim{display:flex;justify-content:space-between;font-size:11.5px;color:var(--sc-texte2);font-weight:600;gap:6px}
.pann{display:grid;gap:3px;border-top:1px solid var(--sc-trait);padding-top:7px;margin-top:1px}
.pann div{display:flex;justify-content:space-between;font-size:12px;gap:6px;color:var(--sc-texte2)}
.pann b{color:var(--sc-texte);font-weight:600;white-space:nowrap}
.pann em{font-style:normal;font-weight:500;color:var(--sc-texte2);margin-left:5px}
.compacte .pann,.compacte .ond .lim{display:none}
.compacte .ond .w{font-size:22px}
/* graphique */
.graphe{background:var(--sc-tuile);border-radius:18px;padding:12px 12px 6px}
.graphe svg{display:block;width:100%;height:auto;overflow:visible}
.leg{display:flex;gap:12px;flex-wrap:wrap;font-size:11.5px;color:var(--sc-texte2);font-weight:600;margin:6px 2px 8px}
.leg span{display:inline-flex;align-items:center;gap:5px}
.leg i{width:10px;height:3px;border-radius:2px;display:inline-block}
/* carte d'un onduleur */
.stats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
@container (min-width:520px){.stats{grid-template-columns:repeat(4,minmax(0,1fr))}}
.stat{background:var(--sc-tuile);border-radius:14px;padding:10px 12px;min-width:0;cursor:pointer}
.stat .v{font-size:19px;font-weight:800;margin-top:3px;white-space:nowrap}
.stat .etiq{font-size:10px}
.pgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
@container (min-width:520px){.pgrid.n4{grid-template-columns:repeat(4,minmax(0,1fr))}}
.pan{background:var(--sc-tuile);border-radius:14px;padding:10px 12px;min-width:0}
.pan .v{font-size:21px;font-weight:800;margin:3px 0 6px;white-space:nowrap}
.pan .d{font-size:11.5px;color:var(--sc-texte2);font-weight:600;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.grosse{height:10px;border-radius:5px}
.grosse b{height:18px;top:-4px}
.lim2{display:flex;justify-content:space-between;font-size:12px;color:var(--sc-texte2);font-weight:600;gap:8px;margin-top:6px}
.lim2 span[data-plus]{cursor:pointer}
.pied{font-size:11.5px;color:var(--sc-texte2);font-weight:500}
.vide{padding:22px 18px;font-size:14px;color:var(--sc-texte2);line-height:1.5}
.vide b{color:var(--sc-texte);display:block;font-size:16px;margin-bottom:4px}
.nuit{font-size:13px;color:var(--sc-texte2);padding:2px 2px 0}
`;

class SossenCard extends HTMLElement {
  static getConfigElement() { return document.createElement('sossen-card-editor'); }
  static getStubConfig() { return {}; }

  setConfig(config) {
    this._config = { show_voltage: true, show_panels: true, show_chart: true, compact: false, ...(config || {}) };
    this._sig = null;
    this._histo = null;
    this._histoT = 0;
    this._jour = null;
    if (this._hass) this._rendre(true);
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.addEventListener('click', (e) => this._clic(e));
    }
    this._rendre(false);
  }

  getCardSize() { return this._config?.show_chart ? 8 : 5; }
  getGridOptions() { return { columns: 'full', min_columns: 6 }; }

  connectedCallback() {
    this._minuteur = setInterval(() => this._charger(), 5 * 60 * 1000);
    // largeur réelle : le graphique est dessiné à l'échelle 1 (texte lisible du téléphone à l'écran large)
    this._ro = new ResizeObserver((e) => {
      const l = Math.round(e[0].contentRect.width);
      if (l && Math.abs(l - (this._larg || 0)) > 8) {
        this._larg = l;
        cancelAnimationFrame(this._raf);          // redessin hors du rappel (sinon Safari : « ResizeObserver loop »)
        this._raf = requestAnimationFrame(() => this._rendre(true));
      }
    });
    this._ro.observe(this);
  }
  disconnectedCallback() { clearInterval(this._minuteur); cancelAnimationFrame(this._raf); this._ro?.disconnect(); }

  // ---------------------------------------------------------------- données
  _t() { const l = (this._hass?.locale?.language || this._hass?.language || 'en').slice(0, 2); return TXT[l] || TXT.en; }

  _nf(v, d = 0) {
    const l = this._hass?.locale?.language || 'en';
    return Number(v).toLocaleString(l, { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  _w(v) {   // puissance lisible : « 812 W » ou « 3,23 kW »
    if (v == null) return '—';
    return Math.abs(v) >= 1000 ? `${this._nf(v / 1000, 2)}<span class="u">kW</span>` : `${this._nf(v)}<span class="u">W</span>`;
  }

  _num(id) {
    const s = id && this._hass.states[id];
    if (!s) return null;
    const v = parseFloat(s.state);
    return Number.isFinite(v) ? v : null;
  }

  _decouvrir() {
    const ents = this._hass.entities || {};
    const devs = this._hass.devices || {};
    const voulus = (this._config.inverters || []).filter(Boolean);
    const parDev = {};
    let protection = {};
    for (const e of Object.values(ents)) {
      if (!DOMAINES.includes(e.platform) || !e.device_id) continue;
      const role = CLES[e.translation_key];
      if (!role) continue;
      (parDev[e.device_id] ||= {})[role] = e.entity_id;
    }
    const ond = [];
    for (const [id, r] of Object.entries(parDev)) {
      if (r.protection || r.action || r.seuil_haut) { protection = { ...protection, ...r }; if (!r.ac) continue; }
      if (!r.ac) continue;
      if (voulus.length && !voulus.includes(id)) continue;
      const d = devs[id] || {};
      ond.push({ id, nom: d.name_by_user || d.name || id, ...r });
    }
    const ordre = (o) => (voulus.length ? voulus.indexOf(o.id) : 0);
    const nat = new Intl.Collator(undefined, { numeric: true });
    ond.sort((a, b) => ordre(a) - ordre(b) || nat.compare(a.nom, b.nom));
    // nom court : retire le préfixe commun (« SOSSEN 2in1 FR 2 » … → « 2 » si tous partagent « SOSSEN 2in1 FR »)
    if (ond.length > 1) {
      let p = ond[0].nom;
      for (const o of ond) while (p && !o.nom.startsWith(p)) p = p.slice(0, -1);
      p = p.replace(/\S*$/, '');
      if (p.trim().length >= 3) for (const o of ond) o.court = o.nom.slice(p.length).trim() || o.nom;
    }
    return { ond, protection };
  }

  _lire() {
    const { ond, protection } = this._decouvrir();
    const st = this._hass.states;
    for (const o of ond) {
      o.etat = st[o.etat]?.state ?? 'unavailable';
      o.hors = o.etat === 'unavailable' || o.etat === 'unknown' || st[o.ac]?.state === 'unavailable';
      o.w = this._num(o.ac) ?? 0;
      o.vv = this._num(o.v);
      o.lim = this._num(o.limite);
      o.lmax = parseFloat(st[o.limite]?.attributes?.max) || null;
      o.t = this._num(o.temp);
      o.panneaux = [1, 2, 3, 4].filter((i) => o['p' + i]).map((i) => ({ i, w: this._num(o['p' + i]), u: this._num(o['u' + i]), a: this._num(o['i' + i]) }));
      o.f = this._num(o.freq);
      o.dcw = this._num(o.dc);
      o.cmd = this._num(o.commandes);
      o.bride = o.etat === 'producing' && o.lim != null && o.w >= o.lim - MARGE_BRIDE;
    }
    const p = {
      on: protection.protection ? st[protection.protection]?.state === 'on' : null,
      action: protection.action ? st[protection.action]?.state : null,
      actionT: protection.action ? st[protection.action]?.last_changed : null,
      haut: this._num(protection.seuil_haut), bas: this._num(protection.seuil_bas),
      ids: protection,
    };
    return { ond, p };
  }

  // historique du jour (production totale + tension la plus haute), relu toutes les 5 min
  async _charger() {
    if (!this._hass || !this._ond?.length || this._charge) return;
    this._charge = true;
    try {
      const minuit = new Date(); minuit.setHours(0, 0, 0, 0);
      if (this._config.show_chart) {
        const ids = this._ond.flatMap((o) => [o.ac, o.v].filter(Boolean));
        const r = await this._hass.callWS({ type: 'history/history_during_period', start_time: minuit.toISOString(),
          entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false });
        this._histo = this._echantillonner(r, minuit.getTime());
      }
      const en = this._ond.map((o) => o.energie).filter(Boolean);
      if (en.length) {
        const s = await this._hass.callWS({ type: 'recorder/statistics_during_period', start_time: minuit.toISOString(),
          statistic_ids: en, period: 'day', types: ['change'] });
        let tot = 0, ok = false;
        for (const id of en) for (const x of s[id] || []) if (Number.isFinite(x.change)) { tot += x.change; ok = true; }
        this._jour = ok ? tot : null;
      }
    } catch (e) {
      console.warn('sossen-card : historique indisponible', e);
    }
    this._charge = false;
    this._histoT = Date.now();
    this._rendre(true);
  }

  _echantillonner(r, t0) {
    const PAS = 5 * 60 * 1000, n = Math.ceil((Date.now() - t0) / PAS) + 1;
    const serie = (id) => {
      const pts = (r[id] || []).map((x) => [(x.lu ?? x.lc ?? 0) * 1000, parseFloat(x.s)]);
      const out = new Array(n).fill(null);
      let j = 0, der = null;
      for (let k = 0; k < n; k++) {
        const t = t0 + k * PAS;
        while (j < pts.length && pts[j][0] <= t) { der = pts[j][1]; j++; }
        out[k] = Number.isFinite(der) ? der : null;
      }
      return out;
    };
    const prod = new Array(n).fill(0), volt = new Array(n).fill(null);
    for (const o of this._ond) {
      const a = serie(o.ac); a.forEach((v, k) => { prod[k] += v || 0; });
      if (o.v) serie(o.v).forEach((v, k) => { if (v != null && v > 100) volt[k] = Math.max(volt[k] ?? 0, v); });
    }
    return { t0, PAS, prod, volt };
  }

  // ---------------------------------------------------------------- rendu
  _rendre(force) {
    if (!this._config || !this._hass || !this.shadowRoot) return;
    const { ond, p } = this._lire();
    const sig = JSON.stringify([ond.map((o) => [o.nom, o.etat, Math.round(o.w / 5), o.vv, o.lim, o.t, o.panneaux]), p, this._hass.themes?.darkMode, this._hass.locale?.language]);
    if (!force && sig === this._sig) return;
    const premier = !this._ond;
    this._sig = sig;
    this._ond = ond;
    this._p = p;
    if (premier || Date.now() - this._histoT > 5 * 60 * 1000) setTimeout(() => this._charger(), 0);
    this.shadowRoot.innerHTML = `<style>${CSS}</style>${this._html(ond, p)}`;
  }

  _html(ond, p) {
    const T = this._t(), c = this._config;
    const clair = this._hass.themes?.darkMode === false ? 'clair' : '';
    if (!ond.length) return `<ha-card class="${clair}"><div class="vide"><b>${T.aucun}</b>${T.aucun2}</div></ha-card>`;
    const total = ond.reduce((s, o) => s + o.w, 0);
    const actifs = ond.filter((o) => o.etat === 'producing').length;
    const autorise = ond.reduce((s, o) => s + (o.lim ?? 0), 0);
    const tous = ond.every((o) => o.hors || o.etat === 'off');
    const sous = [T.en_prod(actifs, ond.length)];
    if (this._jour != null) sous.push(`${this._nf(this._jour, 1)} kWh ${T.aujourdhui}`);
    if (autorise && actifs) sous.push(`${this._nf(autorise)} W ${T.autorise}`);
    const soleil = `<svg class="soleil ${actifs ? 'actif' : ''}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" fill="currentColor"/>${
      [0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<rect x="11" y="1.5" width="2" height="4" rx="1" fill="currentColor" transform="rotate(${a} 12 12)"/>`).join('')}</svg>`;
    const bride = ond.filter((o) => o.bride).length;
    const puces = [];
    if (p.on != null) puces.push(`<button class="puce" data-plus="${esc(p.ids.protection)}"><i class="pt" style="color:${p.on ? 'var(--sc-ok)' : 'var(--sc-texte2)'}"></i>${p.on ? T.prot_on : T.prot_off}</button>`);
    if (bride) puces.push(`<span class="puce"><i class="pt" style="color:var(--sc-alerte)"></i>${bride} ${T.bride.toLowerCase()}</span>`);
    return `<ha-card class="${clair} ${c.compact ? 'compacte' : ''}"><div class="c">
      <div class="tete"><div class="g">
        <div class="etiq">${soleil}${esc(c.title || T.titre)}</div>
        <div class="hero">${tous ? T.au_repos : this._w(total)}</div>
        <div class="sous">${sous.join(' · ')}</div></div>
        ${puces.length ? `<div class="puces">${puces.join('')}</div>` : ''}</div>
      ${tous ? `<div class="nuit">${T.nuit}</div>` : ''}
      ${c.show_voltage ? this._htmlTension(ond, p, T) : ''}
      <div class="grille ${ond.length === 1 ? 'seul' : ''}" style="--sc-col:${Math.min(4, Math.max(2, ond.length))};--sc-col-m:${ond.length === 3 ? 3 : 2}">${ond.map((o) => this._htmlOnd(o, T)).join('')}</div>
      ${c.show_chart ? this._htmlGraphe(p, T) : ''}
    </div></ha-card>`;
  }

  _htmlTension(ond, p, T) {
    const vs = ond.map((o) => o.vv).filter((v) => v != null && v > 100);
    if (!vs.length) return '';
    const v = Math.max(...vs);
    const maxJour = this._histo ? Math.max(v, ...this._histo.volt.filter((x) => x != null)) : null;
    const MIN = 225, MAX = 256, pos = (x) => `${(Math.min(MAX, Math.max(MIN, x)) - MIN) / (MAX - MIN) * 100}%`;
    const haut = p.haut ?? 249, bas = p.bas ?? haut - 3;
    const coul = v >= COUPURE_V - 1 ? 'var(--sc-coupure)' : v >= haut ? 'var(--sc-alerte)' : 'var(--sc-ok)';
    const zones = [[MIN, bas, 'var(--sc-ok)', .55], [bas, haut, 'var(--sc-alerte)', .55], [haut, COUPURE_V, 'var(--sc-alerte)', .9], [COUPURE_V, MAX, 'var(--sc-coupure)', .9]]
      .map(([a, b, col, op]) => `<i class="z" style="left:${pos(a)};width:calc(${pos(b)} - ${pos(a)});background:${col};opacity:${op};${a === MIN ? 'border-radius:4px 0 0 4px;' : ''}${b === MAX ? 'border-radius:0 4px 4px 0;' : ''}"></i>`).join('');
    let action = '';
    if (p.action && !['unknown', 'unavailable'].includes(p.action)) {
      const h = p.actionT ? new Date(p.actionT).toLocaleTimeString(this._hass.locale?.language || 'en', { hour: '2-digit', minute: '2-digit' }) : '';
      action = `<div class="action">${T.protection} : <b>${esc(p.action)}</b>${h ? ` · ${h}` : ''}</div>`;
    }
    return `<div class="tension">
      <div class="l1"><span class="etiq"><i class="pt" style="color:${coul}"></i>${T.tension}</span>
        <span class="val">${this._nf(v, 1)}<span class="u">V</span></span></div>
      <div class="jauge">${zones}${maxJour != null && maxJour > v + 0.4 ? `<i class="maxi" style="left:${pos(maxJour)}" title="${T.max} ${this._nf(maxJour, 1)} V"></i>` : ''}<i class="curseur" style="left:${pos(v)}"></i></div>
      <div class="reperes"><span style="left:0">${MIN}</span>${p.bas != null ? `<span style="left:${pos(bas)}">${this._nf(bas, bas % 1 ? 1 : 0)}</span>` : ''}<span style="left:${pos(haut)}">${this._nf(haut, 0)}</span><span style="left:${pos(COUPURE_V)};color:var(--sc-coupure)">${COUPURE_V}</span></div>
      ${maxJour != null ? `<div class="action">${T.max} ${T.aujourdhui} : <b style="color:${maxJour >= haut ? 'var(--sc-alerte)' : 'inherit'}">${this._nf(maxJour, 1)} V</b></div>` : ''}
      ${action}</div>`;
  }

  _htmlOnd(o, T) {
    const coul = o.hors ? 'var(--sc-texte2)' : o.etat === 'producing' ? 'var(--sc-ok)' : o.etat === 'alarm' ? 'var(--sc-coupure)' : 'var(--sc-texte2)';
    const badge = o.hors ? `<span class="badge rouge">${T.hors_ligne}</span>` : o.etat === 'alarm' ? `<span class="badge rouge">${T.alarm}</span>`
      : o.bride ? `<span class="badge">${T.bride}</span>` : '';
    const base = Math.max(o.lmax ?? 0, o.lim ?? 0, o.w, 100);   // échelle = puissance max du modèle (attribut max de la limite)
    const pann = this._config.show_panels && o.panneaux.length ? `<div class="pann">${o.panneaux.map((x) =>
      `<div><span title="${T.panneau} ${x.i}">P${x.i}</span><b>${x.w == null ? '—' : this._nf(x.w)} W${x.u != null && x.u > 0 ? `<em>${this._nf(x.u, 1)} V</em>` : ''}</b></div>`).join('')}</div>` : '';
    const bas = [o.lim != null ? `${T.limite} ${this._nf(o.lim)} W` : '', o.t != null ? `${this._nf(o.t)} °C` : ''].filter(Boolean);
    return `<div class="ond ${o.hors || o.etat === 'off' ? 'eteint' : ''}" data-plus="${esc(o.ac)}" role="button" tabindex="0">
      <div class="nom"><i class="pt" style="color:${coul}"></i><span>${esc(o.court || o.nom)}</span></div>
      <div class="ligw"><div class="w">${this._w(o.w)}</div>${badge}</div>
      <div class="barre"><i style="width:${Math.min(100, o.w / base * 100)}%"></i>${o.lim != null ? `<b style="left:${Math.min(100, o.lim / base * 100)}%"></b>` : ''}</div>
      ${bas.length ? `<div class="lim"><span data-plus="${esc(o.limite || '')}">${bas[0] || ''}</span><span>${bas[1] || ''}</span></div>` : ''}
      ${pann}</div>`;
  }

  _htmlGraphe(p, T) {
    const h = this._histo;
    if (!h || !h.prod.some((v) => v > 0)) return '';
    const n = h.prod.length;
    // fenêtre utile : du premier au dernier point produit (± 30 min), au moins 7 h → 20 h
    const heure = (k) => new Date(h.t0 + k * h.PAS).getHours() + new Date(h.t0 + k * h.PAS).getMinutes() / 60;
    let a = h.prod.findIndex((v) => v > 0), b = n - 1;
    a = Math.max(0, Math.min(a - 6, Math.round(7 * 12)));
    const fin = Math.max(n - 1, Math.round(20 * 12));
    const W = Math.max(280, Math.round((this._larg || 640) - 60)), H = W < 500 ? 150 : 190, G = 34, D = 34, HT = 10, BS = 22;
    const x = (k) => G + (k - a) / Math.max(1, fin - a) * (W - G - D);
    const pmax = Math.max(500, ...h.prod) * 1.08;
    const yP = (v) => H - BS - v / pmax * (H - BS - HT);
    const vs = h.volt.filter((v) => v != null);
    const vmin = Math.min(230, ...vs) - 1, vmax = Math.max(COUPURE_V + 1, ...vs);
    const yV = (v) => H - BS - (v - vmin) / (vmax - vmin) * (H - BS - HT);
    let aire = `M${x(a)},${yP(0)}`;
    for (let k = a; k <= b; k++) aire += `L${x(k).toFixed(1)},${yP(h.prod[k]).toFixed(1)}`;
    aire += `L${x(b)},${yP(0)}Z`;
    let ligne = '', lev = false;
    for (let k = a; k <= b; k++) {
      const v = h.volt[k];
      if (v == null) { lev = false; continue; }
      ligne += `${lev ? 'L' : 'M'}${x(k).toFixed(1)},${yV(v).toFixed(1)}`; lev = true;
    }
    const seuil = (v, col, dash) => v == null ? '' : `<line x1="${G}" x2="${W - D}" y1="${yV(v)}" y2="${yV(v)}" stroke="${col}" stroke-width="1.5" stroke-dasharray="${dash}" opacity=".85"/>`;
    const heures = [];
    for (let hh = Math.ceil(heure(a)); hh <= heure(fin); hh += (fin - a) > 150 ? 3 : 2) {
      const k = a + Math.round((hh - heure(a)) * 12);
      heures.push(`<text x="${x(k)}" y="${H - 5}" text-anchor="middle">${hh}h</text>`);
    }
    const kw = pmax >= 2000;
    const lblP = [0.5, 1].map((f) => `<text x="${G - 6}" y="${yP(pmax / 1.08 * f) + 4}" text-anchor="end">${kw ? this._nf(pmax / 1.08 * f / 1000, 1) + ' kW' : this._nf(pmax / 1.08 * f) + ' W'}</text>`).join('');
    const lblV = vs.length ? [p.haut ?? 249, COUPURE_V].map((v) => `<text x="${W - D + 6}" y="${yV(v) + 4}">${this._nf(v)} V</text>`).join('') : '';
    return `<div class="graphe">
      <div class="etiq">${T.graphe}</div>
      <div class="leg"><span><i style="background:var(--sc-solaire)"></i>${T.production}</span>${vs.length ? `<span><i style="background:var(--sc-bleu)"></i>${T.tension}</span><span><i style="background:var(--sc-coupure)"></i>${T.coupure} ${COUPURE_V} V</span>` : ''}</div>
      <svg viewBox="0 0 ${W} ${H}" font-size="11" fill="var(--sc-texte2)" font-weight="600">
        <defs><linearGradient id="scg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--sc-solaire)" stop-opacity=".55"/><stop offset="1" stop-color="var(--sc-solaire)" stop-opacity=".05"/></linearGradient></defs>
        <line x1="${G}" x2="${W - D}" y1="${H - BS}" y2="${H - BS}" stroke="var(--sc-trait)"/>
        <path d="${aire}" fill="url(#scg)"/><path d="${aire.replace(/Z$/, '')}" fill="none" stroke="var(--sc-solaire)" stroke-width="1.6" stroke-linejoin="round"/>
        ${vs.length ? seuil(COUPURE_V, 'var(--sc-coupure)', '0') + seuil(p.haut, 'var(--sc-alerte)', '4 4') + `<path d="${ligne}" fill="none" stroke="var(--sc-bleu)" stroke-width="1.5" stroke-linejoin="round"/>` : ''}
        ${lblP}${lblV}${heures.join('')}
      </svg></div>`;
  }

  _clic(e) {
    const el = e.composedPath().find((n) => n.dataset?.plus);
    const id = el?.dataset.plus;
    if (!id) return;
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true }));
  }
}

// ---------------------------------------------------------------- carte d'un seul onduleur
class SossenInverterCard extends SossenCard {
  static getConfigElement() { return document.createElement('sossen-inverter-card-editor'); }
  static getStubConfig(hass) {
    const e = Object.values(hass?.entities || {}).find((x) => DOMAINES.includes(x.platform) && x.translation_key === 'ac_power_w');
    return e ? { device: e.device_id } : {};
  }
  setConfig(config) {
    const c = { show_chart: true, ...(config || {}) };
    super.setConfig({ ...c, inverters: c.device ? [c.device] : ['__aucun__'], show_voltage: false, show_panels: true });
  }
  getCardSize() { return this._config?.show_chart ? 7 : 4; }
  getGridOptions() { return { columns: 12, min_columns: 6 }; }

  _html(ond, p) {
    const T = this._t(), c = this._config;
    const clair = this._hass.themes?.darkMode === false ? 'clair' : '';
    const o = ond[0];
    if (!o) return `<ha-card class="${clair}"><div class="vide"><b>${T.aucun}</b>${T.choisir}</div></ha-card>`;
    const coul = o.hors ? 'var(--sc-texte2)' : o.etat === 'producing' ? 'var(--sc-ok)' : o.etat === 'alarm' ? 'var(--sc-coupure)' : 'var(--sc-texte2)';
    const etat = o.hors ? T.hors_ligne : T[o.etat] || o.etat;
    const badge = o.hors || o.etat === 'alarm' ? `<span class="puce" style="color:var(--sc-coupure)"><i class="pt"></i>${etat}</span>`
      : o.bride ? `<span class="puce" style="color:var(--sc-alerte)"><i class="pt"></i>${T.bride}</span>`
      : `<span class="puce"><i class="pt" style="color:${coul}"></i>${etat}</span>`;
    const base = Math.max(o.lmax ?? 0, o.lim ?? 0, o.w, 100);
    const sous = [];
    if (this._jour != null) sous.push(`${this._nf(this._jour, 2)}\u00a0kWh ${T.aujourdhui}`);
    const dc = o.dcw ?? o.panneaux.reduce((s2, x) => s2 + (x.w || 0), 0);
    const rend = dc > 50 && o.w > 0 ? Math.min(100, o.w / dc * 100) : null;
    const stat = (etq, v, id) => `<div class="stat" ${id ? `data-plus="${esc(id)}"` : ''}><div class="etiq">${etq}</div><div class="v">${v}</div></div>`;
    const stats = [
      stat(T.limite_maj, o.lim != null ? `${this._nf(o.lim)}<span class="u">W</span>` : '—', o.limite),
      stat(T.tension_ac, o.vv != null && o.vv > 100 ? `${this._nf(o.vv, 1)}<span class="u">V</span>` : '—', o.v),
      stat(T.temperature, o.t != null ? `${this._nf(o.t)}<span class="u">°C</span>` : '—', o.temp),
      o.f != null && o.f > 0 ? stat(T.frequence, `${this._nf(o.f, 2)}<span class="u">Hz</span>`, o.freq)
        : stat(T.rendement, rend != null ? `${this._nf(rend, 1)}<span class="u">%</span>` : '—', o.dc),
    ].join('');
    const totP = o.panneaux.reduce((s2, x) => s2 + (x.w || 0), 0);
    const pmax = Math.max(1, ...o.panneaux.map((x) => x.w || 0));
    const pans = o.panneaux.map((x) => `<div class="pan" data-plus="${esc(o['p' + x.i])}">
      <div class="etiq">${T.panneau} ${x.i}</div>
      <div class="v">${x.w == null ? '—' : this._w(x.w)}</div>
      <div class="barre"><i style="width:${(x.w || 0) / pmax * 100}%"></i></div>
      <div class="d">${[x.u != null && x.u > 0 ? `${this._nf(x.u, 1)}\u00a0V` : '', x.a != null && x.a > 0 ? `${this._nf(x.a, 2)}\u00a0A` : '',
        totP > 0 && x.w != null ? `${this._nf(x.w / totP * 100)}\u00a0%` : ''].filter(Boolean).join(' · ') || '—'}</div></div>`).join('');
    return `<ha-card class="${clair}"><div class="c">
      <div class="tete"><div class="g">
        <div class="etiq" style="text-transform:none;letter-spacing:.02em;font-size:13px;color:var(--sc-texte)"><i class="pt" style="color:${coul}"></i>${esc(c.title || o.nom)}</div>
        <div class="hero">${this._w(o.w)}</div>
        ${sous.length ? `<div class="sous">${sous.join(' · ')}</div>` : ''}</div>
        <div class="puces">${badge}</div></div>
      <div><div class="barre grosse" data-plus="${esc(o.ac)}"><i style="width:${Math.min(100, o.w / base * 100)}%"></i>${o.lim != null ? `<b style="left:${Math.min(100, o.lim / base * 100)}%"></b>` : ''}</div>
        <div class="lim2"><span data-plus="${esc(o.limite || '')}">${o.lim ? `${this._nf(Math.min(100, o.w / o.lim * 100))}\u00a0% ${T.de_limite}` : ''}</span><span>${o.lmax ? `${T.max_modele} ${this._nf(o.lmax)}\u00a0W` : ''}</span></div></div>
      <div class="stats">${stats}</div>
      ${o.panneaux.length ? `<div class="pgrid n${o.panneaux.length}">${pans}</div>` : ''}
      ${c.show_chart ? this._htmlGraphe(p, T) : ''}
      ${o.cmd != null ? `<div class="pied">${T.commandes(this._nf(o.cmd))}</div>` : ''}
    </div></ha-card>`;
  }
}

class SossenInverterCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._maj(); }
  set hass(hass) { this._hass = hass; this._maj(); }
  _maj() {
    if (!this._hass || !this._config) return;
    const T = TXT[(this._hass.locale?.language || 'en').slice(0, 2)] || TXT.en;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => T[s.label] || s.name;
      this._form.addEventListener('value-changed', (e) => {
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: e.detail.value }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.schema = [
      { name: 'device', label: 'e_onduleur', required: true, selector: { device: { filter: DOMAINES.map((integration) => ({ integration })), entity: { domain: 'sensor', device_class: 'power' } } } },
      { name: 'title', label: 'e_titre', selector: { text: {} } },
      { name: 'show_chart', label: 'e_graphe', selector: { boolean: {} } },
    ];
    this._form.data = { show_chart: true, ...this._config };
  }
}

// ---------------------------------------------------------------- éditeur visuel
class SossenCardEditor extends HTMLElement {
  setConfig(config) { this._config = config; this._maj(); }
  set hass(hass) { this._hass = hass; this._maj(); }
  _maj() {
    if (!this._hass || !this._config) return;
    const T = TXT[(this._hass.locale?.language || 'en').slice(0, 2)] || TXT.en;
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.computeLabel = (s) => T[s.label] || s.name;
      this._form.addEventListener('value-changed', (e) => {
        this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: e.detail.value }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.schema = [
      { name: 'title', label: 'e_titre', selector: { text: {} } },
      { name: 'inverters', label: 'e_onduleurs', selector: { device: { filter: DOMAINES.map((integration) => ({ integration })), multiple: true } } },
      { type: 'grid', name: '', schema: [
        { name: 'show_voltage', label: 'e_tension', selector: { boolean: {} } },
        { name: 'show_panels', label: 'e_panneaux', selector: { boolean: {} } },
        { name: 'show_chart', label: 'e_graphe', selector: { boolean: {} } },
        { name: 'compact', label: 'e_compact', selector: { boolean: {} } },
      ] },
    ];
    this._form.data = { show_voltage: true, show_panels: true, show_chart: true, compact: false, ...this._config };
  }
}

if (!customElements.get('sossen-card')) customElements.define('sossen-card', SossenCard);
if (!customElements.get('sossen-card-editor')) customElements.define('sossen-card-editor', SossenCardEditor);
if (!customElements.get('sossen-inverter-card')) customElements.define('sossen-inverter-card', SossenInverterCard);
if (!customElements.get('sossen-inverter-card-editor')) customElements.define('sossen-inverter-card-editor', SossenInverterCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === 'sossen-card')) {
  window.customCards.push({ type: 'sossen-card', name: 'SOSSEN Card', preview: true,
    description: 'Micro-onduleurs SOSSEN : production, panneaux, limite, tension réseau et protection anti-surtension.',
    documentationURL: 'https://github.com/ritonbrunis-lab/sossen-card' });
}
if (!window.customCards.some((c) => c.type === 'sossen-inverter-card')) {
  window.customCards.push({ type: 'sossen-inverter-card', name: 'SOSSEN Inverter Card', preview: true,
    description: 'Un micro-onduleur SOSSEN en détail : production, limite, tension, température, panneaux et graphique du jour.',
    documentationURL: 'https://github.com/ritonbrunis-lab/sossen-card' });
}
console.info(`%c SOSSEN-CARD ${SC_VERSION} `, 'background:#ffd60a;color:#1c1c1e;font-weight:700;border-radius:4px');
