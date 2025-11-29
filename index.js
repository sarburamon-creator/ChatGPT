import { Client, GatewayIntentBits, REST, Routes, AttachmentBuilder } from "discord.js";
import OpenAI from "openai";
import fs from "fs";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

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
    await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
    );
    console.log("✔ Comanda /openai înregistrată!");
}
deployCommands();

// --- Handle command ---
client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "openai") {
        await interaction.reply("🔵 **AI activat!** Trimite-mi mesajul tău sau o poză.");
    }
});

// --- Conversație ---
client.on("messageCreate", async msg => {
    // Ignoră mesajele botului
    if (msg.author.bot) return;

    // Răspunde doar dacă a fost pornită sesiunea /openai
    const channel = msg.channel;

    let imageData = null;
    if (msg.attachments.size > 0) {
        const file = msg.attachments.first();
        const buffer = await fetch(file.url).then(r => r.arrayBuffer());
        imageData = {
            filename: file.name,
            bytes: Buffer.from(buffer)
        };
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",  // Poți schimba în "gpt-5.1" dacă ai acces
            messages: [
                { role: "system", content: "Ești un asistent puternic și inteligent pe Discord. Poți analiza texte, poze și fișiere." },
                { role: "user", content: msg.content }
            ],
            ...(imageData && {
                attachments: [imageData]
            })
        });

        await msg.reply(response.choices[0].message.content);

    } catch (e) {
        console.error(e);
        await msg.reply("❌ A apărut o eroare la procesarea cererii.");
    }
});

// --- Login ---
client.login(process.env.DISCORD_TOKEN);
