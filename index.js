import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import OpenAI from "openai";
import fetch from "node-fetch";
import Tesseract from "tesseract.js";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";

dotenv.config();

const MAX_TEXT = 3000;

// --- Client Discord ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// --- OpenAI ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// --- Slash Command ---
const commands = [
  { name: "openaichat", description: "Pornește conversația cu AI" }
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

async function deployCommands() {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("✔ Comanda /openaichat înregistrată!");
  } catch (err) {
    console.error("❌ Eroare la înregistrarea comenzii:", err);
  }
}
deployCommands();

// --- Handle slash command ---
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "openaichat") {
    await interaction.reply("🔵 **AI activat!** Trimite-mi mesaj text, imagine sau PDF.");
  }
});

// --- Handle messages ---
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  let textFromImage = "";
  let textFromPDF = "";

  // --- Procesare fișiere ---
  if (msg.attachments.size > 0) {
    const file = msg.attachments.first();
    const fileExt = file.name.split(".").pop().toLowerCase();

    try {
      const arrayBuffer = await fetch(file.url).then(r => r.arrayBuffer());
      const buffer = Buffer.from(arrayBuffer);

      if (fileExt === "pdf") {
        const data = await pdfParse(buffer);
        textFromPDF = data.text.slice(0, MAX_TEXT);

      } else if (["png", "jpg", "jpeg"].includes(fileExt)) {
        const result = await Tesseract.recognize(buffer, "eng");
        textFromImage = result.data.text.slice(0, MAX_TEXT);
      }

    } catch (err) {
      console.error("❌ Eroare procesare fișier:", err);
      await msg.reply("❌ Nu am putut procesa fișierul trimis.");
      return;
    }
  }

  // --- Text combinat ---
  let combinedText = msg.content || "";
  if (textFromImage) combinedText += `\n\nText extras din imagine:\n${textFromImage}`;
  if (textFromPDF) combinedText += `\n\nText extras din PDF:\n${textFromPDF}`;

  if (!combinedText.trim()) {
    await msg.reply("❌ Nu am găsit text de procesat în mesaj sau fișiere.");
    return;
  }

  // --- Trimitem la OpenAI ---
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Ești un asistent inteligent pe Discord. Analizează orice text primit și răspunde clar și corect."
        },
        {
          role: "user",
          content: combinedText
        }
      ]
    });

    const replyText =
      response?.choices?.[0]?.message?.content ||
      "❌ Nu am primit un răspuns valid de la OpenAI.";

    await msg.reply(replyText);

  } catch (e) {
    console.error("❌ Eroare OpenAI:", e);
    await msg.reply("❌ A apărut o eroare la procesarea cererii.");
  }
});

// --- Login Discord ---
client.login(process.env.DISCORD_TOKEN);
