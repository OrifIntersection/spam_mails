import subprocess
import time
import sys
import os

def main():
    print("🚀 Démarrage du serveur webhook...")
    
    # Utiliser subprocess au lieu de os.system (plus propre)
    subprocess.run("taskkill /f /im node.exe 2>nul", shell=True, capture_output=True)
    subprocess.run("taskkill /f /im ngrok.exe 2>nul", shell=True, capture_output=True)
    time.sleep(1)
    
    # Ouvre un nouveau terminal pour le serveur webhook
    print("📟 Ouverture du terminal serveur...")
    subprocess.Popen(
        ["start", "cmd", "/k", "node index.js"], 
        shell=True
    )
    
    time.sleep(3)
    
    # Ouvre un nouveau terminal pour ngrok
    print("📡 Connexion ngrok...")
    subprocess.Popen(
        ["start", "cmd", "/k", "ngrok http 3000"], 
        shell=True
    )
    
    print("\n✅ Terminaux ouverts dans des fenêtres séparées !")
    print("📌 Ce terminal de contrôle reste actif")
    print("👉 Appuie sur Ctrl+C pour tout arrêter\n")
    
    try:
        while True:
            time.sleep(1)  # ✅ CORRIGÉ : on met 1 seconde
    except KeyboardInterrupt:
        print("\n👋 Arrêt demandé...")
        
        # Utiliser subprocess partout
        print("🧹 Fermeture du serveur webhook...")
        subprocess.run("taskkill /f /im node.exe 2>nul", shell=True)
        
        print("🧹 Fermeture de ngrok...")
        subprocess.run("taskkill /f /im ngrok.exe 2>nul", shell=True)
        
        print("🧹 Fermeture des fenêtres...")
        subprocess.run('taskkill /f /fi "WINDOWTITLE eq node ./index.js" 2>nul', shell=True)
        subprocess.run('taskkill /f /fi "WINDOWTITLE eq ngrok http 3000" 2>nul', shell=True)
        
        print("✅ Toutes les fenêtres sont fermées")
        sys.exit(0)

if __name__ == "__main__":
    main()