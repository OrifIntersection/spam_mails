const fs = require('fs');
const path = require('path');
// ============================================
// EXPRESS
// ============================================
const express = require('express');
const chalk = require('chalk');

// ============================================
// MODULE NLP POUR ANALYSE DE SENTIMENT
// ============================================
const { NlpManager } = require('node-nlp');

// Scripts
const deepParseJSON = require('./scripts/deepParseJSON')
const languageGuesser = require('./scripts/language-guesser');

// Initialisation express
const app = express();
const PORT = 3000;
let manager = null;

// Dossiers principal
const DOSSIER_ANALYSIS = path.join(__dirname, './analysis');
if (!fs.existsSync(DOSSIER_ANALYSIS)) fs.mkdirSync(DOSSIER_ANALYSIS);

// Sous dossier pour sauvegarder les fichierstextes
const DOSSIERS = {
  eml: path.join(__dirname, './analysis/mails_bruts'),
  textes: path.join(__dirname, './analysis/texts'),
  transfer: path.join(__dirname, './analysis/transfer'),
  models: path.join(__dirname, './models')
};

const DOSSIER_EML = DOSSIERS.eml;
const DOSSIER_TEXTES = DOSSIERS.textes;
const DOSSIER_TRANSFER = DOSSIERS.transfer;
const DOSSIER_MODELS = DOSSIERS.models;

// Créer les dossiers s'ils n'existent pas
if (!fs.existsSync(DOSSIER_EML)) fs.mkdirSync(DOSSIER_EML);
if (!fs.existsSync(DOSSIER_TEXTES)) fs.mkdirSync(DOSSIER_TEXTES);
if (!fs.existsSync(DOSSIER_MODELS)) fs.mkdirSync(DOSSIER_MODELS);
if (!fs.existsSync(DOSSIER_TRANSFER)) fs.mkdirSync(DOSSIER_TRANSFER);

// ============================================l
// CONFIGURATION NLP HYBRIDE
// ============================================
const MODEL_PATH = path.join(DOSSIER_MODELS, 'hybrid-model-multilingual.nlp');
let modelLoaded = false;

const startMessage = `
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║               ███████╗████████╗ █████╗ ██████╗ ████████╗             ║   
║               ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝             ║   
║               ███████╗   ██║   ███████║██████╔╝   ██║                ║   
║               ╚════██║   ██║   ██╔══██║█████╔╝    ██║                ║
║               ███████║   ██║   ██║  ██║██║║███║   ██║                ║       
║               ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═══╝   ╚═╝                ║
║                                                                      ║
║                    [ START INITIALIZING SYSTEM ]                     ║
║                                                                      ║
║        > boot sequence: Lancement du fichier "index.js"              ║
║        > status: ONLINE                                              ║
║        > security: 2xmSD33-sa9Km'sMl_aa                              ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
`
console.log(chalk.hex('#c30051')(startMessage));

// =========================
// Language Guesser
// =========================
// Simulation d'un UseState avec un setters
const textTransfer_obj = {
  _value: null,
  _texteComplet: '',

  set value(v) {
    console.log("✅ Setter exécuté ! Valeur reçue:", v ? v.substring(0, 50) + "..." : "vide");

    if (v && typeof v === 'string' && v.trim() !== '') {
      this._texteComplet = v;
      try {
        const guessedLanguages = languageGuesser(v);
        console.log("🎯 Langues détectées:", guessedLanguages);
        this._value = guessedLanguages;
      } catch (error) {
        console.error("❌ Erreur dans languageGuesser:", error);
        this._value = [];
      }
    } else {
      this._value = [];
    }
  },

  get value() {
    return this._value;
  },

  get detectedLanguages() {
    return this._value;
  }
};

// =========================
// Initialisation du NLP
// =========================
async function initializeNLP() {
  console.log('🔄 Initialisation du module NLP hybride...');

  try {
    manager = new NlpManager({
      languages: ['en', 'fr', 'es'],
      nlu: { useNoneFeature: false }
    });

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

// ============================================
// FONCTION ANALYSE SENTIMENT AVEC DÉTECTION AUTO
// ============================================
async function analyzeSentiment(mail, id) {
  text = mail.text
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
      const guesses = languageGuesser(text);
      const detectedLang = guesses.length > 0 ? guesses[0].alpha2 : 'en'; // fallback anglais
      const result = await manager.process(detectedLang, text);

      // Temps de lecture
      let timeToReadInSeconds = ((result.sentiment?.numWords || 0) / 225) * 60;

      // Analyse de l'objet du mail :  
      if (mail.subject) {
        objectResp = await manager.process(mail.subject);
      }
      else {
        console.log(`❌ Mail doesn't have object`)
      };
      // Résultats à transférer 
      const languages = textTransfer_obj.value.slice(0, 4);

      // L'username sera défini en prenant la chaîne de caractère se trouvant devant le @
      const username = mail.from?.address.split('@')[0];

      // Résultats à transférer
      const resultToTransfer = {
        username: username || 'undefined',
        date: mail.date || null,
        languages: {
          principalLanguage: textTransfer_obj.value[0],
          language: textTransfer_obj.value.slice(0, 3), // top three results
        },
        timetoread: {
          time: timeToReadInSeconds || 0, // in seconds
        },
        object: {
          object: mail.subject || '(aucun sujet)',
          emotions: objectResp?.classifications || [],
          strongerEmotion: objectResp?.intent || 'undefined',
          scoreStrongerEmotion: objectResp?.score || 'undefined',
        },
        mail: {
          strongerEmotion: result.intent || 'undefined',
          scoreStrongerEmotion: result.score || 'undefined',
          emotions: result.classifications || [],
        },

/*
        nlpJS: {
          score: result.sentiment ? result.sentiment.score : 0,
          vote: result.sentiment ? result.sentiment.vote : 'neutral',
          words: result.sentiment && result.sentiment.words ? result.sentiment.words : [],
          comparative: result.sentiment ? result.sentiment.comparative : 0,
          intent: result.intent || 'unknown',
          intentConfidence: result.score || 0
        }
*/
      };

      // Stocker les données dans un fichier pour pouvoir l'envoyer
      const cheminToTransfer = path.join(DOSSIER_TRANSFER, `transfer-${id}.json`);
      fs.writeFileSync(cheminToTransfer, JSON.stringify({ resultToTransfer }, null, 2));
      console.log(`   ✅ Fichier Transfer créé: ${cheminToTransfer}`);
    } else {
      console.log('Erreur analyse sentiment:', error);
    }
  } catch (error) {
    console.error('Erreur analyse sentiment:', error);
  }
}

// Middleware pour recevoir du texte brut (emails)
app.use(express.text({
  type: '*/*',
  limit: '500mb'
}));

// ============================================
// ENDPOINT PRINCIPAL - Réception des emails
// ============================================

app.post('/index', async (req, res) => {
  try {
    const mailBrut = req.body;

    if (!mailBrut) {
      return res.status(400).json({ error: 'Email vide' });
    }

    // ========================= 
    // BARRE DE CHARGEMENT NON BLOQUANTE
    // =========================
    function loadingBar(duration = 3000, steps = 30) {
      return new Promise((resolve) => {
        let current = 0;
        const intervalTime = duration / steps;
        const interval = setInterval(() => {
          current++;

          const progress = Math.floor((current / steps) * 100);
          const bar = "█".repeat(current) + "-".repeat(steps - current);
          process.stdout.write(chalk.hex('#c30051')(`\r[${bar}] ${progress}%`));

          if (current >= steps) {
            clearInterval(interval);
            process.stdout.write("\n");
            resolve(); // FIN → on libère le code
          }
        }, intervalTime);
      });
    }

    await loadingBar();

    // =========================
    // TRAITEMENT EMAIL (NORMAL)
    // =========================
    const timestamp = Date.now();
    const id = `${timestamp}-${Math.random().toString(36).substring(7)}`;

    console.log(`📨 Nouvel email (ID: ${id})`);
    const cheminEML = path.join(DOSSIER_EML, `email-${id}.eml`);
    fs.writeFileSync(cheminEML, mailBrut);
    console.log(`   ✅ Sauvegardé: ${cheminEML}`);

    const mail = deepParseJSON(req.body).rawEmail;

    // Structure des métadonnées concernant le mail
    const analyse = {
      id,
      date_reception: new Date().toISOString(),
      sujet: mail.subject || '(pas de sujet)',
      expediteur: mail.from?.address || 'inconnu',
      destinataires: mail.to?.value?.map(d => d.address) || [],
      date_envoi: mail.date || null,
      message_id: mail.messageId,
      liens: [],
      pieces_jointes: mail.attachments?.map(a => ({
        nom: a.filename,
        type: a.contentType,
        taille: a.size
      })) || []
    };

    const texteComplet = mail.text || mail.html || '';
    console.log("Longueur du texte ", texteComplet.length);
    textTransfer_obj.value = texteComplet;
    console.log("Langue détectée après setter ", textTransfer_obj.value);

    if (mail.html) {
      analyse.liens = mail.html.match(/https?:\/\/[^\s"'<>(){}|\\^`[\]]+/g) || [];
    } else if (mail.text) {
      analyse.liens = mail.text.match(/https?:\/\/[^\s]+/g) || [];
    };

    if (texteComplet) {
      const sentimentResult = await analyzeSentiment(mail, id);
    }

    const cheminTexte = path.join(DOSSIER_TEXTES, `texte-${id}.json`);
    fs.writeFileSync(cheminTexte, JSON.stringify(mail.text, null, 2));


    return res.status(200).json({
      success: true,
      id,
      message: 'Email traité avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    return res.status(500).json({ success: false, error: error.message });
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
      textes: DOSSIER_TEXTES,
      models: DOSSIER_MODELS,
      transfer: DOSSIER_TRANSFER,
    },
    mode_actuel: modelLoaded ? 'ML (node-nlp)' : 'Pas de modèle trouvé',
    stats: {
      modele_ml_charge: modelLoaded ? '✅ Oui' : '❌ Non'
    }
  });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
async function startServer() {
  await initializeNLP();

  const PathEMl = DOSSIER_EML.substring(DOSSIER_EML.indexOf("spamalaxie"));
  const PathTextes = DOSSIER_TEXTES.substring(DOSSIER_TEXTES.indexOf("spamalaxie"));
  const PathModels = DOSSIER_MODELS.substring(DOSSIER_MODELS.indexOf("spamalaxie"));
  const PathTransfer = DOSSIER_TRANSFER.substring(DOSSIER_TRANSFER.indexOf("spamalaxie"))

  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║  SERVEUR WEBHOOK DÉMARRÉ                              ║
╠═══════════════════════════════════════════════════════╣
║  📡 URL locale: http://localhost:${PORT}       
║  🧪 Test: http://localhost:${PORT}/test        
║  📥 Webhook: http://localhost:${PORT}/index              
║                                              
║  🤖 NLP: ${modelLoaded ? '✅ Hybride' : '⚠️ Pas de modèle'}                      
║  📁 Dossier EML: ${PathEMl}    
║  📁 Dossier textes: ${PathTextes}
║  📁 Dossier models: ${PathModels}
║  📁 Dossier analyses :${PathTransfer}
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