import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import fs from "fs-extra";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const REGULAMENT_FILE = "./regulament.txt";
let REGULAMENT_TEXT = "";

// Încarcă regulamentul din fișier dacă există
if (fs.existsSync(REGULAMENT_FILE)) {
  REGULAMENT_TEXT = fs.readFileSync(REGULAMENT_FILE, "utf8");
  console.log("✅ Regulamentul a fost încărcat din fișier!");
}

// Funcție pentru a descărca și analiza PDF-ul
async function analyzePDF(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const data = await pdfParse(response.data);
  REGULAMENT_TEXT = data.text;
  fs.writeFileSync(REGULAMENT_FILE, REGULAMENT_TEXT);
  return "📄 PDF analizat și salvat permanent!";
}

// Funcție pentru OCR pe imagini
async function analyzeImage(url) {
  const result = await Tesseract.recognize(url, "ron");
  return result.data.text;
}

// Funcție pentru căutare în regulament
function searchRegulament(query) {
  if (!REGULAMENT_TEXT) return "❌ Regulamentul nu este încărcat.";
  if (REGULAMENT_TEXT.toLowerCase().includes(query.toLowerCase())) {
    return "✅ Am găsit în regulament:\n" + query;
  } else {
    return "❌ Nu am găsit răspunsul exact.";
  }
}

// Înregistrare slash command
const commands = [
  new SlashCommandBuilder()
    .setName("openchatgpt")
    .setDescription("Analizează PDF/imagini și răspunde la întrebări din regulament")
    .addStringOption(option =>
      option.setName("intrebare")
        .setDescription("Întrebarea ta legată de regulament")
        .setRequired(false)
    )
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("🔄 Înregistrare comenzi slash...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("✅ Comanda /openchatgpt a fost înregistrată!");
  } catch (error) {
    console.error(error);
  }
})();

// Când botul pornește
client.once("ready", () => {
  console.log(`Bot online ca ${client.user.tag}`);
});

// Handler pentru slash command
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "openchatgpt") {
    const question = interaction.options.getString("intrebare");

    if (question) {
      const answer = searchRegulament(question);
      await interaction.reply(answer);
    } else {
      await interaction.reply("ℹ️ Trimite un PDF sau o imagine ca attachment, apoi folosește /openchatgpt cu întrebarea ta.");
    }
  }
});

// Ascultă mesaje pentru PDF/imagini
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.attachments.size > 0) {
    for (const attachment of message.attachments.values()) {
      if (attachment.name.endsWith(".pdf")) {
        const reply = await analyzePDF(attachment.url);
        message.reply(reply);
      } else if (attachment.name.match(/\.(png|jpg|jpeg)$/i)) {
        const text = await analyzeImage(attachment.url);
        message.reply("📄 Text extras din imagine:\n" + text);

        const answer = searchRegulament(text.trim());
        message.reply(answer);
      }
    }
  }
});

client.login(process.env.TOKEN);
