import os
#from dotenv import load_dotenv

# Load .env variables
#load_dotenv()

class Settings:
    PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")

    SECRET_KEY = "76c1a422e7deddc96abeec9c3b73b47392e2217494f3c4c91a0e46961dd385e33b29e652e01f85d93c1ea33d6251b7cf47e12aead6dcb8fcc19c90fc880251d9"  # use os.getenv or .env in real app
    ALGORITHM = "HS256"


settings = Settings()