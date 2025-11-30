import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import OpenAI from "openai";
import fetch from "node-fetch";
import Tesseract from "tesseract.js";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";

dotenv.config();

const MAX_TEXT = 60000;

// --- Funcție pentru trimiterea mesajelor lungi ---
function sendLongMessage(channel, text) {
  const chunks = text.match(/[\s\S]{1,1900}/g) || [];
  for (const chunk of chunks) {
    channel.send(chunk);
  }
}

// --- Client Discord ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// --- OpenAI SDK nou ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// --- Slash commands ---
const commands = [
  { name: "openaichat", description: "Pornește conversația cu AI" }
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

// Înregistrare comenzi
async function deployCommands() {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("✔ Comanda /openaichat înregistrată!");
  } catch (err) {
    console.error("❌ Eroare la înregistrare:", err);
  }
}
deployCommands();

// --- Handle slash command ---
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "openaichat") {
    await interaction.reply("🔵 **AI activat!** Trimite-mi text, imagine sau PDF.");
  }
});

// --- Handle user messages ---
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  let textFromImage = "";
  let textFromPDF = "";

  // --- Procesăm atașamentele ---
  if (msg.attachments.size > 0) {
    const file = msg.attachments.first();
    const fileExt = file.name.split(".").pop().toLowerCase();

    try {
      const arrayBuffer = await fetch(file.url).then(r => r.arrayBuffer());
      const buffer = Buffer.from(arrayBuffer);

      // PDF
      if (fileExt === "pdf") {
        console.log("📄 PDF detectat, procesare...");
        const data = await pdfParse(buffer);
        textFromPDF = data.text.slice(0, MAX_TEXT);

      // Imagine
      } else if (["png", "jpg", "jpeg"].includes(fileExt)) {
        console.log("🖼 Imagine detectată, OCR...");
        const result = await Tesseract.recognize(buffer, "eng");
        textFromImage = result.data.text.slice(0, MAX_TEXT);
      }

    } catch (err) {
      console.error("❌ Eroare procesare fișier:", err);
      await msg.reply("❌ Nu am putut procesa fișierul trimis.");
      return;
    }
  }

  // Combinăm textul primit
  let combinedText = msg.content || "";

  if (textFromImage) {
    combinedText += `\n\n--- Text extras din imagine ---\n${textFromImage}`;
  }

  if (textFromPDF) {
    combinedText += `\n\n--- Text extras din PDF ---\n${textFromPDF}`;
  }

  if (!combinedText.trim()) {
    await msg.reply("❌ Nu am găsit text de procesat.");
    return;
  }

  // --- Trimitem către OpenAI ---
  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: "Ești un asistent inteligent pe Discord. Analizează textul și oferă răspunsuri clare."
        },
        {
          role: "user",
          content: combinedText
        }
      ]
    });

    const replyText =
      response.output_text ||
      response.output?.[0]?.content?.[0]?.text ||
      "❌ Nu am primit un răspuns valid de la OpenAI.";

    // Trimitem mesajul în bucăți <2000 chars
    sendLongMessage(msg.channel, replyText);

  } catch (err) {
    console.error("❌ Eroare OpenAI:", err);
    await msg.reply("❌ A apărut o eroare la procesarea cererii.");
  }
});

// --- Login ---
client.login(process.env.DISCORD_TOKEN);
