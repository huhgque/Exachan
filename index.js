const { Client, Events, Collection , GatewayIntentBits,SlashCommandBuilder } = require("discord.js");
const { token , apiToken , guildId , mcServer,channelId} = require("./config.json");
const fs = require('node:fs');
const path = require('node:path');
const {Client:ExaChanClient} = require("exaroton");
const Exachan = require("./exachan/exachan.js");


global.djsclient = new Client({ intents: [GatewayIntentBits.Guilds],partials:['MESSAGE','CHANNEL'] });
djsclient.commands = new Collection();

// bot online
djsclient.once(Events.ClientReady, c => {
  console.log("Epic");
})


// exa-chan soul injection
Exachan.Init();
Exachan.exachan.Status();

// load command
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		djsclient.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

djsclient.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {		
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

djsclient.login(token);
