// ============================================
// SERVEUR WEBHOOK POUR RECEPTION D'EMAILS
// ============================================
const express = require('express');
const fs = require('fs');
const path = require('path');
// LIGNE SUPPRIMÉE : const Sentiment = require('sentiment');

// ============================================
// MODULE NLP POUR ANALYSE DE SENTIMENT
// ============================================
const { NlpManager } = require('node-nlp');

// Initialisation
const app = express();
const PORT = 3000;

// Dossiers pour sauvegarder les fichiers
const DOSSIER_EML = path.join(__dirname, 'emails_bruts');
const DOSSIER_ANALYSES = path.join(__dirname, 'analysis');
const DOSSIER_TEXTES = path.join(__dirname, 'textes');
const DOSSIER_MODELS = path.join(__dirname, 'models');
const DOSSIER_NLPJS = path.join(__dirname, 'npm-nlp_analysis');

// Créer les dossiers s'ils n'existent pas
if (!fs.existsSync(DOSSIER_EML)) fs.mkdirSync(DOSSIER_EML);
if (!fs.existsSync(DOSSIER_ANALYSES)) fs.mkdirSync(DOSSIER_ANALYSES);
if (!fs.existsSync(DOSSIER_TEXTES)) fs.mkdirSync(DOSSIER_TEXTES);
if (!fs.existsSync(DOSSIER_MODELS)) fs.mkdirSync(DOSSIER_MODELS);
if (!fs.existsSync(DOSSIER_NLPJS)) fs.mkdirSync(DOSSIER_NLPJS);

// ============================================
// CONFIGURATION NLP HYBRIDE
// ============================================
const MODEL_PATH = path.join(DOSSIER_MODELS, 'hybrid-model.nlp');
let manager = null;
let modelLoaded = false;

// Initialiser le NLP
async function initializeNLP() {
  console.log('🔄 Initialisation du module NLP hybride...');

  try {
    manager = new NlpManager({ languages: ['fr'] });

    if (fs.existsSync(MODEL_PATH)) {
      manager.load(MODEL_PATH);
      modelLoaded = true;
      console.log('✅ Modèle NLP hybride chargé avec succès');
      console.log('   - Lexique personnalisé actif');
      console.log('   - Intentions entraînées actives');
    } else {
      console.log('⚠️ Modèle non trouvé! Utilisation du mode basique');
      console.log('   Pour entraîner: node scripts/train-hybrid.js');
    }
  } catch (error) {
    console.error('❌ Erreur chargement modèle NLP:', error.message);
  }
}

// Fonction d'analyse avec fallback
async function analyzeSentiment(text, id) {

  if (!text || text.trim() === '') {
    return {
      score: 0,
      vote: 'neutral',
      words: [],
      comparative: 0,
      intent: 'unknown',
      intentConfidence: 0
    };
  }

  try {
    console.log(`📝 Analyse pour ID: ${id}`);
    console.log(`   modelLoaded = ${modelLoaded}`);
    if (modelLoaded && manager) {

      console.log(`   ✅ Mode ML activé pour ID: ${id}`);
      const result = await manager.process('fr', text);

      // Sauvegarde
      const cheminNpmNLP = path.join(DOSSIER_NLPJS, `analyse-${id}.json`);
      fs.writeFileSync(cheminNpmNLP, JSON.stringify({ result }, null, 2));
      console.log(`   ✅ Fichier ML créé: ${cheminNpmNLP}`);

      return {
        score: result.sentiment ? result.sentiment.score : 0,
        vote: result.sentiment ? result.sentiment.vote : 'neutral',
        words: result.sentiment && result.sentiment.words ? result.sentiment.words : [],
        comparative: result.sentiment ? result.sentiment.comparative : 0,
        intent: result.intent || 'unknown',
        intentConfidence: result.score || 0
      };

    } else {
      return fallbackSentimentAnalysis(text);
    }
  } catch (error) {
    console.error('Erreur analyse sentiment:', error);
    return fallbackSentimentAnalysis(text);
  }

}

// Analyse de secours (basique)
function fallbackSentimentAnalysis(text) {
  const words = text.toLowerCase().split(' ');

  const negativeWords = ['con', 'putain', 'chier', 'merde', 'salope', 'connard', 'enfoiré', 'débile', 'triste', 'désolé', 'déçu'];
  const positiveWords = ['content', 'super', 'génial', 'excellent', 'bravo', 'merci', 'cool', 'parfait', 'heureux', 'bien'];

  let score = 0;
  const detectedWords = [];

  words.forEach(word => {
    if (negativeWords.includes(word)) {
      score -= 2;
      detectedWords.push(word);
    }
    if (positiveWords.includes(word)) {
      score += 2;
      detectedWords.push(word);
    }
  });

  const vote = score > 0 ? 'positive' : (score < 0 ? 'negative' : 'neutral');
  const comparative = words.length > 0 ? score / words.length : 0;

  return {
    score,
    vote,
    words: detectedWords,
    comparative,
    intent: 'unknown',
    intentConfidence: 0,
    mode: 'fallback'
  };
}

// Fonction pour classifier le sentiment
function getSentimentLabel(score) {
  if (score <= -3) return 'très négatif';
  if (score < 0) return 'négatif';
  if (score === 0) return 'neutre';
  if (score <= 2) return 'positif';
  return 'très positif';
}

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
  type: '*/*',
  limit: '50mb'
}));

// ============================================
// ENDPOINT PRINCIPAL - Réception des emails
// ============================================
app.post('/index', async (req, res) => {
  try {
    const emailBrut = req.body;

    if (!emailBrut) {
      return res.status(400).json({ error: 'Email vide' });
    }

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

    // Extraire les informations principales
    const analyse = {
      id: id,
      date_reception: new Date().toISOString(),

      // Métadonnées
      sujet: mail.subject || '(pas de sujet)',
      expediteur: mail.from?.address || 'inconnu',
      destinataires: mail.to && mail.to.value ? mail.to.value.map(d => d.address) : [],
      date_envoi: mail.date || null,

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

    // ========================================
    // 3. ANALYSE DE SENTIMENT
    // ========================================
    const texteComplet = mail.text || mail.html || '';

    if (texteComplet) {
      // Appeler la fonction d'analyse de sentiment avec l'ID
      const sentimentResult = await analyzeSentiment(texteComplet, id);

      analyse.sentiment = {
        score: sentimentResult.score,
        vote: sentimentResult.vote,
        label: getSentimentLabel(sentimentResult.score),
        words: sentimentResult.words,
        comparative: sentimentResult.comparative,
        intent: sentimentResult.intent,
        intentConfidence: sentimentResult.intentConfidence,
        mode: sentimentResult.mode || 'nlp'
      };

      console.log(`   📊 Sentiment: ${analyse.sentiment.label} (score: ${sentimentResult.score})`);
    }
    // ========================================
    // 4. CODE (OPTIONS SUPPLÉMENTAIRES)
    // ========================================
    
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
      (analyse.suspect.mots_urgence ? 20 : 0) +
      (analyse.suspect.liens_raccourcis ? 15 : 0),
      100
    );

    // ========================================
    // 5. SAUVEGARDER LE TEXTE
    // ========================================
    const cheminTexte = path.join(DOSSIER_TEXTES, `texte-${id}.json`);
    fs.writeFileSync(cheminTexte, JSON.stringify(mail.text, null, 2));
    console.log(`   ✅ Texte sauvegardé: ${cheminTexte}`);

    // ========================================
    // 6. SAUVEGARDER L'ANALYSE EN JSON
    // ========================================
    const cheminAnalyse = path.join(DOSSIER_ANALYSES, `analysis-${id}.json`);
    fs.writeFileSync(cheminAnalyse, JSON.stringify(analyse, null, 2));
    console.log(`   ✅ Analyse sauvegardée: ${cheminAnalyse}`);

    // Afficher un résumé
    console.log(`   📧 Sujet: ${analyse.sujet}`);
    console.log(`   👤 De: ${analyse.expediteur}`);
    console.log(`   🔗 Liens: ${analyse.liens.length}`);
    console.log(`   📊 Score agressivité: ${analyse.score_agressivite}/100`);

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
    nlp: {
      loaded: modelLoaded,
      modelPath: MODEL_PATH
    },
    dossiers: {
      eml: DOSSIER_EML,
      analyses: DOSSIER_ANALYSES,
      textes: DOSSIER_TEXTES,
      models: DOSSIER_MODELS,
      npmnlp: DOSSIER_NLPJS
    },
    mode_actuel: modelLoaded ? 'ML (node-nlp)' : 'Rule-Based uniquement',
    stats: {
      modele_ml_charge: modelLoaded ? '✅ Oui' : '❌ Non'
    }
  });
});

// ============================================
// ENDPOINT POUR TESTER L'ANALYSE
// ============================================
app.post('/test-analyze', express.json(), async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Paramètre "text" requis' });
  }

  // CORRECTION ICI AUSSI : appeler la fonction d'analyse
  const sentimentResult = await analyzeSentiment(text, 'test');

  res.json({
    text,
    sentiment: sentimentResult,
    label: getSentimentLabel(sentimentResult.score)
  });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
async function startServer() {
  await initializeNLP();

  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║  SERVEUR WEBHOOK DÉMARRÉ                              ║
╠═══════════════════════════════════════════════════════╣
║  📡 URL locale: http://localhost:${PORT}       
║  🧪 Test: http://localhost:${PORT}/test        
║  📥 Webhook: http://localhost:${PORT}/index
║  🔬 Test analyse: POST /test-analyze                  
║                                              
║  🤖 NLP: ${modelLoaded ? '✅ Hybride' : '⚠️ Mode basique'}                      
║  📁 Dossier EML: ${DOSSIER_EML}    
║  📁 Dossier analyses: ${DOSSIER_ANALYSES} 
║  📁 Dossier textes: ${DOSSIER_TEXTES}
║  📁 Dossier models: ${DOSSIER_MODELS}
║  📁 Dossier npm-nlp: ${DOSSIER_NLPJS}
╚═══════════════════════════════════════════════════════╝
    `);
  });
}

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du serveur...');
  process.exit();
});

// Lancer le serveur
startServer();