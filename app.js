const Discord = require('discord.js');
const fs = require("fs")
const client = new Discord.Client();
const discordemoji = require('discord-emoji');
var config = require("./config.json");
var prefix = config.prefix
const Pokemon = require('pokemon.js');
Pokemon.setLanguage('english');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', member => {
    var data = {
        "name": member.username,
        "partiesJouer": 0,
        "partiesGagner": 0,
        "points": 0,
        "MVP": 0,
    }
    var joueurClassement = {
        "name": "<@"+member.id+">",
        "points" : 0
    }
    var path = "joueurs/" + member.id + ".json"
    var classement = "classement.json"
    fs.access(path, (err) => {
        if (err) {
            writeFile(path, data)
            writeFile(classement, joueurClassement)
        }
    })
})

client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.emoji.name === discordemoji.activity.video_game) {
        // On v�rifie la reaction et le role de la personne
        console.log(reaction.count)
            // Si il as le role joueur d�ja on ne fait rien
            if (reaction.message.guild.member(user).roles.cache.get('746439995669348442')) {
                return
            }
            // Si il as le role spectateur, on lui retire pour lui mettre le role joueur
            else if (reaction.message.guild.member(user).roles.cache.get('746439996357214269')) {
                reaction.message.guild.member(user).roles.remove('746439996357214269')
                reaction.message.guild.member(user).roles.add('746439995669348442')
                var data = {
                    "name": user.username,
                    "partiesJouer": 0,
                    "partiesGagner": 0,
                    "points": 0,
                    "MVP": 0,
                }
                var joueurClassement = {
                    "name": "<@"+user.id+">",
                    "points" : 0
                }
                var path = "joueurs/" + user.id + ".json"
                var classement = "classement.json"
                fs.access(path, (err) => {
                    if (err) {
                        writeFile(path, data)
                        writeFile(classement, joueurClassement)
                    }
                })
            }
            // Si il n'as rien on met le role joueur
            else {
                reaction.message.guild.member(user).roles.add('746439995669348442')
                var data = {
                    "name": user.username,
                    "partiesJouer": 0,
                    "partiesGagner": 0,
                    "points": 0,
                    "MVP": 0,
                }
                var joueurClassement = {
                    "name": "<@"+user.id+">",
                    "points" : 0
                }
                var path = "joueurs/" + user.id + ".json"
                var classement = "classement.json"
                fs.access(path, (err) => {
                    if (err) {
                        writeFile(path, data)
                        writeFile(classement, joueurClassement)
                    }
                })

                
            }
                // Pour les deux derniers on v�rifie si un compte est d�ja creer, sinon on lui creer son compte/profil
    }
    if (reaction.emoji.name === discordemoji.people.eyes) {
        // On v�rifie la reaction et le role de la personne
        console.log(reaction.count)
            // Si il as le role spectateur d�ja on ne fait rien
            if (reaction.message.guild.member(user).roles.cache.get('746439996357214269')) {
                return
            }
            // Si il as le role joueur, on lui retire pour lui mettre le role spectateur
            else if (reaction.message.guild.member(user).roles.cache.get('746439995669348442')) {
                reaction.message.guild.member(user).roles.remove('746439995669348442')
                reaction.message.guild.member(user).roles.add('746439996357214269')
            }
            // Si il n'as rien on met le role spectateur
            else {
                reaction.message.guild.member(user).roles.add('746439996357214269')
            }
            // Pour les deux derniers on v�rifie si un compte est d�ja creer, sinon on lui creer son compte/profil
    }
})

client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    var reactionpoll = [discordemoji.symbols.one, discordemoji.symbols.two, discordemoji.symbols.three,discordemoji.symbols.four,discordemoji.symbols.five,discordemoji.symbols.six,discordemoji.symbols.seven,discordemoji.symbols.eight,discordemoji.symbols.nine,discordemoji.symbols.zero,discordemoji.symbols.a,discordemoji.symbols.b,discordemoji.symbols.cancer,discordemoji.symbols.diamonds,discordemoji.symbols.end,discordemoji.symbols.fast_forward,discordemoji.symbols.gemini, discordemoji.symbols.hash,discordemoji.symbols.infinity,discordemoji.symbols.black_joker,discordemoji.symbols.koko,discordemoji.symbols.leo,discordemoji.symbols.m, discordemoji.symbols.new, discordemoji.symbols.o, discordemoji.symbols.parking, discordemoji.symbols.question, discordemoji.symbols.radioactive, discordemoji.symbols.sagittarius, discordemoji.symbols.taurus, discordemoji.symbols.underage, discordemoji.symbols.virgo, discordemoji.symbols.warning, discordemoji.symbols.x, discordemoji.symbols.yellow_circle, discordemoji.symbols.zzz];

    if(message.member.roles.cache.get('822621585403805728')){
        if (command === "creategame") {
            message.channel.send('Bonjour a tous \n Le maire de Thiercellieux vous convie a une chasse aux Loup-Garou ! Rejoignez nous ! \n' + discordemoji.activity.video_game + ' = Joueur \n' + discordemoji.people.eyes + " = Spectateurs").then(sendMessage => {
                sendMessage.react(discordemoji.activity.video_game)
                sendMessage.react(discordemoji.people.eyes)
            })
        }
        else if (command === 'addpoint') {
            const taggedUser = message.mentions.users.first();
            if (!args.length) {
                return message.channel.send("Le format doit être !addpoint mention nombreDePoint");
            }
            else if (args[0] && !args[1]) {
                return message.channel.send("Manque le deuxieme argument")
            }
            else {
                // message.channel.send(`arguments: ${taggedUser.id} ${args[1]}`);
                var path = "joueurs/" + taggedUser.id + ".json"
                fs.access(path, (err) => {
                    if (err) {
                        message.channel.send("Vous n\'avez pas de compte a votre nom, votre compte peut-etre créer en s\'inscrivant a une partie")
                    }
                    else {
                        var playerstat = readFile(path)
                        playerstat.points = parseInt(playerstat.points) + parseInt(args[1])
                        writeFile(path, playerstat)
                    }
                })
            }
        }
        else if (command === 'removepoint') {
            const taggedUser = message.mentions.users.first();
            if (!args.length) {
                return message.channel.send("Le format doit être !removepoint mention nombreDePoint");
            }
            else if (taggedUser && !args[1]) {
                return message.channel.send("Manque le deuxieme argument")
            }
            else {
                // message.channel.send(`arguments: ${taggedUser.id} ${args[1]}`);
                var path = "joueurs/" + taggedUser.id + ".json"
                fs.access(path, (err) => {
                    if (err) {
                        message.channel.send("Vous n\'avez pas de compte a votre nom, votre compte peut-etre créer en s\'inscrivant a une partie")
                    }
                    else {
                        var playerstat = readFile(path)
                        playerstat.points = parseInt(playerstat.points) - parseInt(args[1])
                        writeFile(path, playerstat)
                    }
                })
            }
        }
        else if (command === "test"){
            // le tableau à trier
            var liste = readFile("./classement.json");
            // Création d'objet temporaire qui contient les positions
            // et les valeurs en minuscules
            var mapped = liste.map(function(e, i) {
                return { index: i, value: e };
            })
            // on trie l'objet temporaire avec les valeurs réduites
            mapped.sort(function(a, b) {
            if (a.value > b.value) {
                return 1;
            }
            if (a.value < b.value) {
                return -1;
            }
            return 0;
            });
            // on utilise un objet final pour les résultats
            message.channel.send(mapped.map((e) => {
                return liste[e.index];
            }))
        }
        else if(command === "random"){
            function getRandomIntInclusive(min, max) {
                min = Math.ceil(parseInt(min));
                max = Math.floor(parseInt(max));
                return Math.floor(Math.random() * (max - min +1)) + min;
            }
            message.channel.send(getRandomIntInclusive(args[0], args[1]))
        }
        else if(command === 'setspec'){
            var playerlist = []
            message.guild.members.cache.forEach(member => {
                playerlist.push(member)
            })
            for (let index = 0; index < playerlist.length; index++) {
                var joueur = playerlist[index]
                joueur.roles.add("746439996357214269")
                joueur.roles.remove('813185755228667915')
                joueur.roles.remove('746439995669348442')
                joueur.roles.remove('746470377282207815')
                joueur.roles.remove('813210586162135051')
            }
        }
        else if(command === "poll"){
            let str = ""
            for (let index = 0; index < args.length; index++) {
                str = str + `${reactionpoll[index]} : ${args[index]}\n`
            }
            const msg = await message.channel.send(str)

            for (let index = 0; index < args.length; index++) {
                msg.react(reactionpoll[index])
            }
            message.delete()
        }
        else if(command === "players"){
            message.guild.members.cache.forEach(member => {
                console.log(member.user.username)
            })
        }
        else if(command === "clear"){
            (await message.channel.messages.fetch()).map(chanmessage => {
                chanmessage.delete()
            })
        }
    }
    if (command === "profil") {
        var paths = String("joueurs/" + message.author.id + ".json");
        var data = {
            "name": message.author.username,
            "partiesJouer": 0,
            "partiesGagner": 0,
            "points": 0,
            "MVP": 0,
        }
        var joueurClassement = {
            "name": "<@"+message.author.id+">",
            "points" : 0
        }
        var classement = "classement.json"
        fs.access(paths, (err) => {
            if (err) {
                message.channel.send("Votre profil a été créé")
                writeFile(paths, data)
                writeFile(classement, joueurClassement)
            }
            else {
                var joueur = readFile("joueurs/" + message.author.id + ".json");
                const embed = new Discord.MessageEmbed()
                    .setAuthor("Statistiques de " + message.author.username)
                    .setColor("DARK_RED")
                    .addField("Parties jouees", joueur.partiesJouer)
                    .addField("Parties gagnees", joueur.partiesGagner)
                    .addField("Points", joueur.points)
                    .addField("MVP", joueur.MVP)
                message.channel.send(embed)
            }
        })
    }
    if (command === "charlie") {
        message.channel.send("**CHARLIE**")
        message.channel.send("https://tenor.com/view/charlie-demon-hazbin-hotel-scary-gif-12666062")
    }
    if (command === "cheh") {
        message.channel.send("https://tenor.com/view/train-seum-ta-le-cheh-gif-20542776")
    }
});

function writeFile(file, data) {
    data = JSON.stringify(data);
    fs.writeFile(file, data, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    })
}
function readFile(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}



client.login(config.token);