import sys
from argostranslate import package, translate

def main():
    # Chargez le modèle de traduction (selon ce que vous avez téléchargé)
    installed_languages = translate.get_installed_languages()
    translation = None

    for lang in installed_languages:
        if lang.code == "en":
            for target_lang in lang.targets:
                if target_lang.code == "fr":  # exemple de traduction de l'anglais vers le français
                    translation = lang.get_translation(target_lang)

    if translation:
        text_to_translate = sys.argv[1]
        translated_text = translation.translate(text_to_translate)
        print(translated_text)
    else:
        print("Modèle de traduction non trouvé.")

if __name__ == "__main__":
    main()
