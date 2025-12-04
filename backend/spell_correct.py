# spell_correct.py
import re
from symspellpy import SymSpell, Verbosity
import pkg_resources

# ---- INIT SYMSPELL (fast spell-correct) ----
sym_spell = SymSpell(max_dictionary_edit_distance=2, prefix_length=7)

# built-in frequency dictionary from symspellpy
dictionary_path = pkg_resources.resource_filename(
    "symspellpy", "frequency_dictionary_en_82_765.txt"
)

sym_spell.load_dictionary(dictionary_path, term_index=0, count_index=1)

QUESTION_WORDS = {
    "what", "why", "when", "how", "where", "who", "which", "whom", "whose",
    "do", "does", "did", "is", "are", "am", "can", "could", "should", "would",
    "will", "explain", "tell", "give", "help"
}


def normalize_basic(text: str) -> str:
    """
    Trim, collapse spaces, keep only normal spaces.
    """
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text


def correct_sentence(text: str) -> str:
    """
    Spell-correct each token using SymSpell.
    """
    words = text.split()
    corrected_words = []

    for w in words:
        # Ignore tiny tokens like "x", "&", etc.
        if len(w) <= 1:
            corrected_words.append(w)
            continue

        suggestions = sym_spell.lookup(w, Verbosity.CLOSEST, max_edit_distance=2)
        if suggestions:
            corrected_words.append(suggestions[0].term)
        else:
            corrected_words.append(w)

    return " ".join(corrected_words)


def fix_casing_and_punctuation(text: str) -> str:
    """
    Auto-casing first letter + add ? or .
    """
    t = text.strip()
    if not t:
        return t

    # add punctuation if missing
    if t[-1] not in ".?!":
        first_word = t.split()[0].lower()
        if first_word in QUESTION_WORDS:
            t = t + "?"
        else:
            t = t + "."

    # capitalize first character (simple sentence casing)
    t = t[0].upper() + t[1:]
    return t
