const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.set('views',__dirname + 'public');

const currentGame = {
    game:null,
    questions:[]
}

var participants = new Map();

const currentQuestion = {
    question:null,
    options:[],
    voters:[]
};

app.get('/', function(req, res){ 
    res.sendFile('home.html',{root:__dirname+'/public'});
});

app.get('/game', function(req, res){ 
    res.sendFile('game.html',{root:__dirname+'/public'});
});

app.get('/manage', function(req, res){ 
    res.sendFile('manage.html',{root:__dirname+'/public'});
});

app.get('/result', function(req, res){ 
    res.sendFile('result.html',{root:__dirname+'/public'});
});

//Whenever someone connects this gets executed
io.on('connection', function(socket){
   console.log('A user connected');
   
   //Whenever someone disconnects this piece of code executed
   socket.on('disconnect', function () {
      console.log('A user disconnected');
   });

   socket.on('create-game',(data)=>{
       currentGame.game = data.game;
   })

   socket.on('join-game',(data)=>{
       participants.set(data.participantName, 0);
   })

   socket.on('end-game',()=>{
       currentGame.game = null;
       currentGame.questions = [];
       participants.clear();
   })

   socket.on('publish-question',(data)=>{
       console.log("question===",data);
       currentGame.questions.push(data);
       currentQuestion.question = data.name;
       currentQuestion.options = data.options;
       currentQuestion.voters = [];
       io.sockets.emit('broadcast-question',data);
   })

   socket.on('question-answer',(data)=>{
       console.log(data);
       currentQuestion.voters.push(data);
   })

   socket.on('reveal-answer',(data)=>{
       data = Number(data)
       console.log("HERE===========",data);
        io.sockets.emit('broadcast-answer',data);
        console.log("REVEAL ANSWER",currentQuestion,data)
        currentQuestion.voters.forEach((voter)=>{
            if(voter.optionSelected == data){
                const voterName = String(voter.userName);
                console.log("VOTER",voter,participants.get(voterName));
                participants.set(voterName,participants.get(voterName)+1);
                console.log("PARTICIPANTS",participants);
            }
        })
        currentQuestion.question = null;
        currentQuestion.voters = [];
        currentQuestion.options = [];
   })

   socket.on('clear-question',()=>{
       io.sockets.emit('broadcast-clear');
   })

   socket.on('fetch-results',()=>{
       const res = [];
       console.log(participants.entries())
       participants.forEach((value,key)=>{
           res.push({
               name:key,
               score:value
           })
           console.log(key,value);
       });
       console.log(participants,res);
       io.sockets.emit('get-results',res);
   })
});

http.listen(process.env.PORT || 3000, function(){
   console.log('listening on *:3000');
});