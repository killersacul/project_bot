const Discord = require('discord.js');
const client = new Discord.Client();
const blizzard = require('blizzard.js').initialize({ apikey: "bkg8dut5nm4j8zt4nv3xe5qqee8jhfxn" });
const fs = require('fs');
const { prefix, token } = require('./config.json');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log('Connected and Ready!');
});

const realm = "Khaz Modan";
const region = "eu";

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

function log(message){
    var channel = message.channel;
    var member = message.member;
    var message = message.content;
    var logMessage = "in " + channel + member +  " wrote" + message;
    fs.writeFile("/logs/test.log", logMessage, function(err){
	if(err){
	    return console.log(err);
	}
    });
}

function character(name, message){
    var temp;
    console.log(name);
    blizzard.wow.character(['profile', 'items'], { origin: region, realm: realm, name: name }).then(response => {
        temp = response.data;
	message.channel.send("average ilvl : " + response.data['items']['averageItemLevelEquipped']);
	console.log("average ilvl : " + response.data['items']['averageItemLevelEquipped']);
    });
    return temp;
}

function guild(){
    console.log(realm)
    blizzard.wow.guild(['profile', 'members'], { realm: realm, name: 'Ordre', origin: region }).then(response => {
        console.log(response.data);
  });
}

client.login(token);
