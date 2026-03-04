// ============================================
// SERVEUR WEBHOOK POUR RECEPTION D'EMAILS
// ============================================

const express = require('express');
const { simpleParser } = require('mailparser');
const fs = require('fs');
const path = require('path');

// Initialisation
const app = express();
const PORT = 3000;

// Dossiers pour sauvegarder les fichiers
const DOSSIER_EML = path.join(__dirname, 'emails_bruts');
const DOSSIER_ANALYSES = path.join(__dirname, 'analyses');

// Créer les dossiers s'ils n'existent pas
if (!fs.existsSync(DOSSIER_EML)) fs.mkdirSync(DOSSIER_EML);
if (!fs.existsSync(DOSSIER_ANALYSES)) fs.mkdirSync(DOSSIER_ANALYSES);

function deepParseJSON(value) {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return deepParseJSON(parsed);
    } catch {
      return value;
    }
  }

  if (Array.isArray(value)) {
    return value.map(deepParseJSON);
  }

  if (value && typeof value === "object") {
    const result = {};
    for (const key in value) {
      result[key] = deepParseJSON(value[key]);
    }
    return result;
  }

  return value;
}

// Middleware pour recevoir du texte brut (emails)
app.use(express.text({
  type: '*/*',        // Accepter tous les types de contenu
  limit: '50mb'       // Augmenter la limite pour les gros emails
}));

// ============================================
// ENDPOINT PRINCIPAL - Réception des emails
// ============================================
app.post('/webhook-email', async (req, res) => {
  try {
    // L'email brut est dans req.body
    const emailBrut = req.body;
    console.log(emailBrut)
    console.log(emailBrut.rawEmail, "LOG2-------------------------------")

    if (!emailBrut) {
      return res.status(400).json({ error: 'Email vide' });
    }

    // Générer un identifiant unique
    const timestamp = Date.now();
    const id = `${timestamp}-${Math.random().toString(36).substring(7)}`;

    console.log(`\n📨 [${new Date().toLocaleTimeString()}] Nouvel email reçu (ID: ${id})`);

    // ========================================
    // 1. SAUVEGARDE EN .EML
    // ========================================
    const cheminEML = path.join(DOSSIER_EML, `email-${id}.eml`);
    fs.writeFileSync(cheminEML, emailBrut);
    console.log(`   ✅ Sauvegardé: ${cheminEML}`);

    // ========================================
    // 2. ANALYSE AVEC MAILPARSER
    // ========================================
    const mail = deepParseJSON(req.body).rawEmail;

    // console.log(deepParseJSON(req.body).rawEmail + " BODY")

    // Extraire les informations principales
    const analyse = {
      id: id,
      date_reception: new Date().toISOString(),

      // Métadonnées
      sujet: mail.subject || '(pas de sujet)',
      expediteur: mail.from?.address || 'inconnu',
      destinataires: mail.to && mail.to.value ? mail.to.value.map(d => d.address) : [], date_envoi: mail.date || null,

      // En-têtes importants
      return_path: mail.headers['return-path'] || mail.headers['from'] || null,
      message_id: mail.messageId,

      // Contenu
      a_texte: !!mail.text,
      a_html: !!mail.html,
      taille_texte: mail.text?.length || 0,

      // Liens
      liens: [],

      // Pièces jointes
      pieces_jointes: mail.attachments ? mail.attachments.map(a => ({
        nom: a.filename,
        type: a.contentType,
        taille: a.size
      })) : [],
    };

    // Extraire les liens du HTML ou du texte
    if (mail.html) {
      const regexUrl = /https?:\/\/[^\s"'<>(){}|\\^`[\]]+/g;
      analyse.liens = mail.html.match(regexUrl) || [];
    } else if (mail.text) {
      const regexUrl = /https?:\/\/[^\s]+/g;
      analyse.liens = mail.text.match(regexUrl) || [];
    }

    // Analyse basique de suspicion
    analyse.suspect = {
      liens_raccourcis: analyse.liens.some(l => /bit\.ly|tinyurl|short\.link/i.test(l)),
      urls_ip: analyse.liens.some(l => /\d+\.\d+\.\d+\.\d+/.test(l)),
      mots_urgence: /urgent|immédiat|action requise|vérifiez|cliquez/i.test(mail.subject || '') ||
        /urgent|immédiat|action requise|vérifiez|cliquez/i.test(mail.text || ''),
      points_exclamation: (mail.text || '').split('!').length - 1,
      majuscules: (mail.text || '').match(/[A-Z]{5,}/g)?.length || 0
    };

    // Score d'agressivité (0-100)
    analyse.score_agressivite = Math.min(
      (analyse.suspect.points_exclamation * 5) +
      (analyse.suspect.majuscules * 3) +
      (analyse.suspect.mots_urgence ? 20 : 0),
      100
    );

    // ========================================
    // 3. SAUVEGARDER L'ANALYSE EN JSON
    // ========================================
    const cheminAnalyse = path.join(DOSSIER_ANALYSES, `analyse-${id}.json`);
    fs.writeFileSync(cheminAnalyse, JSON.stringify(analyse, null, 2));
    console.log(`   ✅ Analyse sauvegardée: ${cheminAnalyse}`);

    // Afficher un résumé
    console.log(`   📧 Sujet: ${analyse.sujet}`);
    console.log(`   👤 De: ${analyse.expediteur}`);
    console.log(`   🔗 Liens: ${analyse.liens.length}`);
    console.log(`   📊 Score agressivité: ${analyse.score_agressivite}/100`);

    // Répondre au service de redirection
    res.status(200).json({
      success: true,
      id: id,
      message: 'Email traité avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur lors du traitement:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// ENDPOINT DE TEST
// ============================================
app.get('/test', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Serveur webhook actif',
    dossiers: {
      eml: DOSSIER_EML,
      analyses: DOSSIER_ANALYSES
    }
  });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║  SERVEUR WEBHOOK DÉMARRÉ                     ║
╠══════════════════════════════════════════════╣
║  📡 URL locale: http://localhost:${PORT}       ║
║  🧪 Test: http://localhost:${PORT}/test        ║
║  📥 Webhook: http://localhost:${PORT}/webhook-email ║
║                                              ║
║  📁 Dossier EML: ${DOSSIER_EML}    ║
║  📁 Dossier analyses: ${DOSSIER_ANALYSES} ║
╚══════════════════════════════════════════════╝
  `);
});