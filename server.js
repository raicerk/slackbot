var SlackBot = require('slackbots');
var moment = require('moment');
var ajax = require('./status-server');
var cmd = require('./shell-terminal');

moment.locale('es');

async function Status() {
    var response = ``

    var api1 = await ajax.statusApi('http://192.168.0.2')
    response += `Auth : ${api1} \n`
    var api2 = await ajax.statusApi('http://192.168.0.3')
    response += `Data : ${api2} \n`

    return response
}

var bot = new SlackBot({
    token: '',
    name: 'AutoBot Slack'
});

bot.on('start', function() {
	var params = {
        icon_emoji: ':nerd_face:'
    };
	
	bot.postMessageToGroup('informatica', `acabo de resucitar! a las ${moment().format("HH:mm")} :tada::confetti_ball:`, params);
	bot.postMessageToGroup('agile', `acabo de resucitar! a las ${moment().format("HH:mm")} :tada::confetti_ball:`, params);
	
	setInterval(function(){
		var hora = moment().format("HH:mm:ss");
		if(hora == "12:00:00") {
			bot.postMessageToGroup('informatica', `reunion de apoderados! <!here>`, params);
			bot.postMessageToGroup('agile', `reunion de apoderados! <!channel>`, params);
		}
		
		if(hora == "13:30:00") {
			bot.postMessageToGroup('informatica', `Hora de almuerzo!`, params);
		}
	}, 1000);
});

bot.on('message', async function(data) {
	
    var params = {
        icon_emoji: ':nerd_face:'
    };

    if(data.type == 'message'){

        if(data.user == 'U94JJ1ZD0'){
            data.user = 'LuchoParker';
        }

        if(data.text){

            if(data.text.toLowerCase().search('holiwis') != -1){
                bot.postMessage(data.channel,`Holis! <@${data.user}>`, params);
            }

            if(data.text.toLowerCase().search('hoy es viernes') != -1){
                bot.postMessage(data.channel,`<@${data.user}> y tu cuerpo lo sabe!`, params);
            }

            if(data.text.toLowerCase().search('hola') != -1){
                bot.postMessage(data.channel,`Te saludo :spock-hand: <@${data.user}>`, params);
            }

            if(data.text.toLowerCase().search('adios') != -1){
                bot.postMessage(data.channel,`Adiowis :wave: <@${data.user}> nos vemos pronto! Un gusto tenerte en el Slack de GL Group`, params);
            }

            if(data.text.toLowerCase().search('que hora es') != -1){
                bot.postMessage(data.channel,`<@${data.user}> Son exactamente las ${moment().format("HH:mm")}`, params);
            }

            if(data.text.toLowerCase().search('que dia es hoy') !=-1){
                var dia=moment().format("dddd");
                bot.postMessage(data.channel,`<@${data.user}> Hoy es `+dia, params);
            }
			// if(data.text.toLowerCase().search('gerardo') != -1){
			// 	bot.postMessage(data.channel,` :pig_nose: `, params);
			// }
			// if(data.text.search('mei') != -1){
			// 	bot.postMessage(data.channel,` MEI@MEI te saluda :woman-tipping-hand: `, params);
			// }
			// if(data.text.toLowerCase().search('claudio') != -1){
			// 	bot.postMessage(data.channel,` Cuidado ahí viene OCExt!!!!! :scream: `, params);
			// }
			// if(data.text.toLowerCase().search('rigoberto') != -1){
			// 	bot.postMessage(data.channel,` https://gph.is/1hEMHNx `, params);
			// }
			// if(data.text.toLowerCase().search('manuel') != -1){
			// 	bot.postMessage(data.channel,`Manueel levantando una api recursiva! https://giphy.com/gifs/terminal-cybernetics-windows-JmJMzlXOiI0dq `, params);
			// }

            if(data.text.toLowerCase().search('apisbot') != -1){
                var statusapi = await Status();
				bot.postMessage(data.channel, statusapi, params);
            }
            if(data.text.toLowerCase().search('cmdbot') != -1){
                var attr = data.text.toLowerCase().replace('cmdbot', '');
                var command = await cmd.run(attr.trim());
				bot.postMessage(data.channel, command, params);
			}
        }
    }
});