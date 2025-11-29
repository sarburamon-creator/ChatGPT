import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import OpenAI from "openai";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

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

// --- Slash Command /openai ---
const commands = [
  {
    name: "openai",
    description: "Pornește o conversație cu AI"
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

async function deployCommands() {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("✔ Comanda /openai înregistrată!");
  } catch (err) {
    console.error("❌ Eroare la înregistrarea comenzii:", err);
  }
}
deployCommands();

// --- Handle slash command ---
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "openai") {
    await interaction.reply("🔵 **AI activat!** Trimite-mi mesajul tău sau o poză.");
  }
});

// --- Handle messages ---
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  let imageData = null;
  if (msg.attachments.size > 0) {
    const file = msg.attachments.first();
    const buffer = await fetch(file.url).then(res => res.arrayBuffer());
    imageData = {
      filename: file.name,
      bytes: Buffer.from(buffer)
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Ești un asistent inteligent pe Discord care poate analiza texte și poze." },
        { role: "user", content: msg.content }
      ]
      // momentan nu trimitem imagini direct în chat completions
    });

    await msg.reply(response.choices[0].message.content);

  } catch (e) {
    console.error("❌ Eroare OpenAI:", e);
    await msg.reply("❌ A apărut o eroare la procesarea cererii.");
  }
});

// --- Login Discord ---
client.login(process.env.DISCORD_TOKEN);
