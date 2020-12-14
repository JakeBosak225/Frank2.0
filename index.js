//Bot Set Up

//Needed Libraries
//Basic Discord 
const Discord = require('discord.js'); // npm install discord.js
//HTTP Client
const axios = require('axios'); // npm i axios
//HTTP For Reddit Client
const snekfetch = require('snekfetch'); // npm i snekfetch


const client = new Discord.Client();

//Set Call Prefix for when needed
const prefix = '!';

//For Command Files Set Up
const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const commandFile of commandFiles){
    const command = require(`./commands/${commandFile}`);
    client.commands.set(command.name, command);
}
//End Command File Set Up

//Triggers when the Bot is Turned on with 'node .' in the command line
client.once('ready', () =>{
    console.log('Frank2.0 Is Online!')
    client.user.setActivity('"!heyFrank" for command List!');
});

//Look for prefix ONE WORD NON-CASE SENSITIVE Commands from the command files
client.on('message', message =>{
    //Check that the message starts with the prefix, and
    //The bot itself did not send the command
    if(!message.content.startsWith(prefix) || message.author.bot){
        return;
    }

    //Splice the command
    const args = message.content.slice(prefix.length).split(/ +/);
    //Set the message to lowercase to match the command
    const command = args.shift().toLowerCase();

    //Commands Triggers 
    if(command === 'fly'){
        client.commands.get('fly').execute(message, args);
    }else if(command === 'smile'){
        //This Message will tag the user who sent it in its reply
        client.commands.get('smile').execute(message, args);
    }else if(command === 'scold'){
        //This message will "scold" a user you tag
        //Get the tagged user
        const user = getUserFromMention(args[0]);

        if(!user){
            //The sender did not tag a user, reply with this message
            return message.reply('Hey knuckle head you gotta tell me who to scold!');
        }else{
            //Sender did tag a user, call that user a knuckle head
            return message.channel.send(`<@` + user.id +`> you knuckle head!`);
        }
    }
});

//Look for prefix ONE WORD CASE SENSITIVE Commands from the command files
client.on('message', message =>{
    //Check that the message starts with the prefix, and
    //The bot itself did not send the command
    if(!message.content.startsWith(prefix) || message.author.bot){
        return;
    }

    //Splice the command
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift();

    //Get Command List
    if(command === 'heyFrank'){
        const embed = new Discord.MessageEmbed()
        .setColor(0x00A2E8)
        .setTitle('Frank 2.0 Command List')
        .addField('!fly' , 'Franks Famous Saying About Teaching Us To Walk')
        .addField('!smile', 'Frank Tells You To Smile When You Code')
        .addField('!scold @USER', 'Frank Will Give The Ultimate Insult To The User You Tag')
        .addField('!memes', 'Frank Shares His Favorite r/ProgrammingHumor Meme')
        .addField('!dadJoke', 'Frank Spews Some Good Old Fashioned Dad Jokes')
        .addField('Message Contains Frank Favorite Drink', 'Frank Chimes In')
        .addField('Message Contains I dont know/Idk(any Variation', 'Frank Tells You To Trust The Process')
        .addField('Message Contains The', '5% Chance Frank Will Correct Your Spelling')

        message.channel.send(embed);
    }
});

//Scan Whole Message for word/phrase
client.on('message', message =>{

    //If Bot Sent the message ignore
    if(message.author.bot){
        return;
    }

    //Split the sent message by space , . ? and !
    const messageSplit = message.content.split(/[ ,.?!]+/);

    //Check for Mnt Dew Command
    let saidDew = false;
    for(let i = 0; i < messageSplit.length; i++){
        if(messageSplit[i].toLowerCase() === 'dew'){
            if(!saidDew){
                saidDew = true;
                message.channel.send('We doing the Diet Dew?');
            }
        }
    }

    //Check for THE command
    let foundThe = false;
    for(let i = 0; i < messageSplit.length; i++){
        if(foundThe){
            return;
        }

        if(messageSplit[i].toLowerCase() === 'the'){
            let randomNumber = Math.floor((Math.random() * 100));

            if(randomNumber >= 95){
                foundThe = true;
                message.channel.send(`<@` + message.author.id +`> dont you mean TEH?!?!`);
            }
        }
    }

    //Create array of possible ways to say IDK
    const idkArray =  [
        "i dont know",
        "i don't know",
        "dont know",
        "don't know",
        "idk",
        "dont even know",
        "don't even know",
        "dont know",
        "don't know"
    ];

    //Check for IDK commands 
        for(let i = 0; i < idkArray.length; i++){
            if(message.content.toLowerCase().includes(idkArray[i].toLowerCase())){
            return message.channel.send('Trust the Process <@' + message.author.id +'>');
            }
        }
});

//ReactionCounter 
client.on('message', async message =>{
    if(!message.content.startsWith(prefix)){
        return;
    }

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    //Emojis This command will use
    //Custom emoji
    const olYes = '<:OlYes:770323355551006782>'

        let sentMessage = await message.channel.send('Gimmie the Ol Yes!');
        sentMessage.react(olYes);

        let reactionCollector = sentMessage.createReactionCollector((sent) => !sent.bot,{
            //Give the users 20 seconds to react
            time: 20000
            //dispose: true
        });

        reactionCount = 0;
        
        reactionCollector.on('collect', (m2, user) =>{
            if(m2.emoji.id == '770323355551006782'){
                console.log(`${user.username} reacted`)
                reactionCount++;
                console.log(`Current Count ${reactionCount}`)
            }
        });

        reactionCollector.on('remove', (m2, user) =>{
            if(m2.emoji.id == '770323355551006782'){
                console.log(`${user.username} UNreacted`)
                reactionCount--;
                console.log(`Current Count ${reactionCount}`)
            }
        })

        setTimeout(()=>{
            message.channel.send(`Looks like i got ${reactionCount} of ya talkin to me, ill settle for 75% visibility`)
        }, 20000);
});

//API Call Commands
client.on('message', async message=>{
    if(message.author.bot){
        return;
    }

    const args = message.content.slice(prefix.length).split(/ + /);
    const command = args.shift().toLowerCase();


    //Check For Dad Joke Command
    if (command === 'dadjoke' || command === 'dadJoke' || command === 'DadJoke') {
        let getJoke = async() =>{
            //Call To API
            let response = await axios.get('https://official-joke-api.appspot.com/random_joke')
            let joke = response.data
            return joke
        }
    
        let jokeValue = await getJoke();
        console.log(jokeValue)
    
        message.reply(`Heres your joke: ${jokeValue.setup} \n\n ${jokeValue.punchline}`)
    }else if(command === 'memes'){
        try{
            const {body} = await snekfetch
            .get('https://www.reddit.com/r/ProgrammerHumor.json?sort=top&t=week')
            .query({limit: 800});
    
            const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
            if(!allowed.length) return message.channel.send('It seems we are out of programming humor! Try again later.');
    
            const randomNumber = Math.floor(Math.random() * allowed.length)
            const embed = new Discord.MessageEmbed()
            .setColor(0x00A2E8)
            .setTitle(allowed[randomNumber].data.title)
            .setDescription("Posted by: " + allowed[randomNumber].data.author)
            .setImage(allowed[randomNumber].data.url)
            .addField("Upvotes: " + allowed[randomNumber].data.ups + " / Comments: " + allowed[randomNumber].data.num_comments)
            .setFooter("Provided by r/ProgrammerHumor")
            message.channel.send(embed)
        }catch(err){
            return console.log(err);
        }
    }
});






/*******************************
 * Utility Functions
*******************************/
function getUserFromMention(mention){
    //No Mention was Given, return empty
    if(!mention){
        return;
    }

    if(mention.startsWith('<@') && mention.endsWith('>')){
        mention = mention.slice(2, -1);
    }

    if(mention.startsWith('!')){
        mention = mention.slice(1);
    }

    return client.users.cache.get(mention);
}



//Private Token Goes Here(Token taken out for privacy)
client.login();