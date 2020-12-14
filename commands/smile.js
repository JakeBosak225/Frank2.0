module.exports ={
    name: 'smile',
    description: 'Smile When You Code Command',
    execute(message, args){
        //Message.Author.Id will tag the user who sent the message
        message.channel.send("<@" + message.author.id +">" + " dont forget to smile when you code!");
    }
}