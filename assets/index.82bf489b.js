import{R as e,P as t,g as s,T as i}from"./vendor.cc49dbcf.js";!function(e=".",t="__import__"){try{self[t]=new Function("u","return import(u)")}catch(s){const i=new URL(e,location),a=e=>{URL.revokeObjectURL(e.src),e.remove()};self[t]=e=>new Promise(((s,o)=>{const n=new URL(e,i);if(self[t].moduleMap[n])return s(self[t].moduleMap[n]);const r=new Blob([`import * as m from '${n}';`,`${t}.moduleMap['${n}']=m;`],{type:"text/javascript"}),l=Object.assign(document.createElement("script"),{type:"module",src:URL.createObjectURL(r),onerror(){o(new Error(`Failed to import: ${e}`)),a(l)},onload(){s(self[t].moduleMap[n]),a(l)}});document.head.appendChild(l)})),self[t].moduleMap={}}}("assets/");var a="./assets/particle-poop-gas.dc46b703.png",o="./assets/test.62dfcf0d.mp3",n="./assets/tilemap.61735487.png",r="./assets/fly.0506edf4.png",l="./assets/ant-top.4dfd34b0.png";var h={compressionlevel:-1,height:10,infinite:!1,layers:[{data:[93,0,0,0,0,0,0,0,0,93,0,0,0,0,0,0,0,0,0,0,0,0,0,92,0,0,0,0,94,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,93,0,0,0,0,91,0,0,0,0,0,0,0,0,0,0,0,91,0,0,0,0,0,0,0,0,93],height:10,id:1,name:"Tile Layer 1",opacity:1,type:"tilelayer",visible:!0,width:10,x:0,y:0}],nextlayerid:2,nextobjectid:1,orientation:"orthogonal",renderorder:"right-down",tiledversion:"1.6.0",tileheight:64,tilesets:[{columns:10,firstgid:1,image:"tilemap.png",imageheight:640,imagewidth:640,margin:0,name:"bob-the-ant",spacing:0,tilecount:100,tileheight:64,tiles:[{id:90,type:"left"},{id:91,type:"right"},{id:92,type:"up"}],tilewidth:64}],tilewidth:64,type:"map",version:"1.6",width:10};function d(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e+1))+e}function c(e){return new Promise((t=>setTimeout(t,e)))}function p(e,t){return new Promise((s=>{t.onComplete=s,e.tweens.add(t)}))}window.toggleFullScreen=function(e){!function(){const e=window.document;return e.fullscreenElement&&null!==e.fullscreenElement||e.webkitFullscreenElement&&null!==e.webkitFullscreenElement||e.mozFullScreenElement&&null!==e.mozFullScreenElement||e.msFullscreenElement&&null!==e.msFullscreenElement}()?function(e){e.requestFullscreen?e.requestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullScreen?e.webkitRequestFullScreen():e.msRequestFullscreen?e.msRequestFullscreen():console.warn("Did not find request full screen method",e)}(e||document.body):function(){const e=window.document;e.exitFullscreen?e.exitFullscreen():e.webkitExitFullscreen?e.webkitExitFullscreen():e.mozCancelFullScreen?e.mozCancelFullScreen():e.msExitFullscreen&&e.msExitFullscreen()}()};const m=new e({wet:1,decay:5,preDelay:.01}).toDestination(),g=new t({velocities:1}).connect(m).toDestination();g.load().then((()=>{console.log("piano loaded!")}));const u=["C2B3E3G3","D2C3F3A4","E2D3G3B4","F2E3A3C4","G2F3B3D4","C3E3G3C4"];async function y(e,t){const s=e.match(/.{2}/g)||[];for(const i of s)g.keyDown({note:i,velocity:.5});await c(1e3*t);for(const i of s)g.keyUp({note:i}),await c(.3*Math.random());return c(1e3*t+100)}document.addEventListener("visibilitychange",(e=>{"visible"==document.visibilityState?s().mute=!1:s().mute=!0}));class f extends Phaser.Scene{constructor(){super({key:"MenuScene"}),this.sprites=[]}preload(){this.startKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),this.startKey.isDown=!1,this.load.image("particle",a),this.load.audio("overture",o),this.load.image("tiles",n),this.load.image("fly",r),this.load.image("ant-top",l),this.load.image("splashScreen","./assets/splashScreen.b7ddfea1.png"),this.load.tilemapTiledJSON("map",h)}create(){this.add.image(this.cameras.main.width/2,this.cameras.main.height/2,"splashScreen");for(let e=0;e<30;e++){const e=Phaser.Math.Between(200,400),t=Phaser.Math.Between(-64,600),s=this.add.image(e,t,"particle");s.setBlendMode(Phaser.BlendModes.NORMAL),this.sprites.push({s:s,r:2+6*Math.random()})}this.input.once("pointerup",(e=>{this.exitMenu()}))}exitMenu(){!async function(){y(u[0],.8)}(),this.scene.start("DigScene")}update(){this.startKey.isDown&&this.exitMenu();for(let e=0;e<this.sprites.length;e++){const t=this.sprites[e].s;t.y-=this.sprites[e].r,t.y<-256&&(t.y=700)}}}class b extends Phaser.Physics.Arcade.Sprite{constructor(e,t,s){super(e,t,s,"player",0),this.isAlive=!1,this.target=new Phaser.Math.Vector2,this.speed=100,this.lastX=0,this.lastY=0,this.distanceMoved=0,e.add.existing(this),e.physics.add.existing(this),this.lastX=t,this.lastY=s}start(){this.isAlive=!0}preUpdate(e,t){super.preUpdate(e,t);const s=Phaser.Math.Distance.BetweenPoints(this,{x:this.lastX,y:this.lastY});if(s>0?this.anims.play("player-run",!0):this.anims.play("player-idle",!0),this.distanceMoved+=s,this.lastX=this.x,this.lastY=this.y,this.isAlive){const e=this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);this.target.x=e.x,this.target.y=e.y,this.rotation=this.scene.physics.moveToObject(this,this.target,this.speed)+Math.PI/2}(!this.isAlive||Phaser.Math.Distance.Between(this.x,this.y,this.target.x,this.target.y)<20)&&this.body.reset(this.x,this.y)}}class w{constructor(e){this.targetText="",this.resolver=null,this.promise=null,this.scene=e;const t=+e.sys.game.config.width,s=t-40,i=+e.sys.game.config.height-150-20,a=e.add.graphics();this.graphics=a,a.fillStyle(3618615,.8),a.fillRect(21,i+1,s-1,149),a.lineStyle(3,4212632,1),a.strokeRect(20,i,s,150),a.setScrollFactor(0),this.targetText="";const o=e.make.text({x:30,y:i+10,text:"",style:{wordWrap:{width:t-40-25},fontSize:"26px"}});o.setScrollFactor(0),this.sceneText=o,o.depth=9,a.depth=9}moveToTop(){const e=+this.scene.sys.game.config.height;this.sceneText.y=30,this.graphics.y=150-e+20+20}moveToBottom(){const e=+this.scene.sys.game.config.height-150-20;this.sceneText.y=e+10,this.graphics.y=0}setText(e){const t=this.sceneText;return this.targetText=e,t.setText(""),this.promise=new Promise((s=>{this.resolver=s;const i=()=>{a.remove()},a=this.scene.time.addEvent({delay:10,callback:()=>{const s=t.text.length;if(this.targetText!==e)return console.log("DUPLICATE DIALOG SET TEXT NO BUENO",e,this.targetText),void i();s>=e.length?i():t.setText(t.text+e[s])},loop:!0})})),this.promise}skipClick(){return this.targetText===this.sceneText.text?(this.resolver&&this.resolver(),this.resolver=null):this.sceneText.setText(this.targetText),this.promise?this.promise:Promise.resolve()}isVisible(){return this.graphics.visible}hide(){this.sceneText.visible=!1,this.graphics.visible=!1}show(){this.sceneText.visible=!0,this.graphics.visible=!0}}const v=[["Why do you keep getting in deeper and deeper sh-","It's only game, why you heff to be mad?"],["I missed you Bob!","I'm flushing, I mean, blushing 😊"],["What is it, do you like the smell?","Nope, I just like the elephants."],["Mom is going to be worried","Crap! We should go home."],["That's it! We're going home right now!","Yeah, I'm all pooped out."],["Is this game some sort of black comedy?","More like brown comedy..."],["How deep does it go?","I don't think the dude gave this game a limit..."],["What's brown and sounds like a bell?","Dung!"],["What kind of webapp do you make in the toilet?","CRUD!"],["Is diarrhea hereditary?","It does run in jeans..."],["Bob, what's a palindrome?","It's like poop..."],['This is the "end" of the game',"Congratulations! You can keep going if you like..."],["Can I ask for a favor?","Could you leave a comment on the Ludum Dare page with which level you made it to?"]],T=[5320725,5583136,5780261,7095062];class x extends Phaser.Scene{constructor(){super({key:"DigScene"}),this.sprites=[],this.level=1,this.lastDistanceUpdateTime=0,this.startDistance=1e9,this.distanceHelpTipSeen=!1,this.timeHelpTipSeen=!1,this.distanceUpdatesCount=0,this.started=!1,this.lastDistance=0}init(e){this.level=e.level||1,this.distanceUpdatesCount=0,this.started=!1}preload(){this.startKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),this.startKey.isDown=!1,this.load.image("particle",a),this.load.audio("overture",o),this.load.image("tiles",n),this.load.image("fly",r),this.load.image("digTrail","./assets/digTrail.3333ade9.png"),this.load.image("foundBob","./assets/foundBob.c84f872f.png"),this.load.image("poopFalafel","./assets/poopFalafel.a3d83b62.png"),this.load.image("ant-top",l),this.load.tilemapTiledJSON("map",h),this.load.image("ground","./assets/ground.4566660e.png"),this.load.image("elephant","./assets/elephant.8461404c.png"),this.load.spritesheet("sprite-sheet",n,{frameWidth:64,frameHeight:64,margin:0,spacing:0})}createMap(){const e=this.make.tilemap({key:"map"}),t=e.addTilesetImage("bob-the-ant","tiles");this.groundLayer=e.createLayer("Tile Layer 1",t),this.marker=this.add.graphics(),this.marker.lineStyle(5,16777215,1),this.marker.strokeRect(0,0,e.tileWidth,e.tileHeight),this.marker.lineStyle(3,16732024,1),this.marker.strokeRect(0,0,e.tileWidth,e.tileHeight)}createAnims(){const e=this.anims;e.create({key:"player-idle",frames:e.generateFrameNumbers("sprite-sheet",{start:4,end:7}),frameRate:3,repeat:-1}),e.create({key:"player-run",frames:e.generateFrameNumbers("sprite-sheet",{start:8,end:9}),frameRate:8,repeat:-1}),e.create({key:"bob-celebrate",frames:e.generateFrameNumbers("sprite-sheet",{start:10,end:13}),frameRate:4,repeat:-1})}generatePoopMap(e){const t=100;let s=e,i=0,a=0;const o=[];for(;s>0;){for(let e=0;e<s;e++){const s=120+e*t+12.5*Math.random()+a*t,l=-80-80*i+10*Math.random(),h=this.add.image(s,l,"poopFalafel");h.tint=T[Math.floor(Math.random()*T.length)],h.scale=(n=.9,r=1.1,Math.random()*(r-n)+n),o.push(h)}s-=1,Math.random()>.5&&(s-=1),i+=1,s>1&&(a+=d(-1,1))}var n,r;let l=d(0,o.length-1);o.length>1&&0==l&&(l=1),this.bobTarget=o[l],this.startDistance=Phaser.Math.Distance.BetweenPoints(this.player,this.bobTarget),this.physics.add.existing(this.bobTarget),this.physics.add.overlap(this.player,this.bobTarget,this.levelEnd,void 0,this),this.poopRegion=this.getBoundingRect(o),console.log("poop region",this.poopRegion)}getBoundingRect(e){let t=e[0].x,s=e[0].y,i=t,a=s;for(const o of e)t=Math.min(o.x,t),s=Math.min(o.y,s),i=Math.max(o.x,i),a=Math.max(o.y,a);return{x:t,y:s,width:i-t,height:a-s}}async levelEnd(e,t){const s=e,a=t;if(!s.isAlive)return;let o=null;this.level-1<v.length&&(o=this.dialog.setText(v[this.level-1][0]),this.dialog.show()),s.isAlive=!1,console.log("Found bob!",s,a),i.stop(),y("C3E5G5C5",1.6),p(this,{targets:a,scale:1.3,duration:300}),await c(200),a.depth=1;const n=this.add.sprite(a.x,a.y,"bob",0);n.anims.play("bob-celebrate",!0),n.alpha=0,n.depth=3,p(this,{targets:n,duration:300,alpha:1}),await p(this,{targets:n,duration:600,y:"+=40",ease:"Bounce.easeOut"}),o&&(await o,this.dialog.moveToTop(),await this.dialog.setText(v[this.level-1][1])),this.scene.restart({level:this.level+1})}createBackground(){this.cameras.main.backgroundColor=Phaser.Display.Color.HexStringToColor("#4499ee");const e=this.add.image(0,-90,"ground");e.setOrigin(.5,0),e.displayWidth=4e3,e.displayHeight=600;const t=this.add.image(-100,0,"elephant");t.setOrigin(1,1),t.scale=2}createUIText(){this.instructions=this.add.text(-100,0,"Tap/click to start",{fontSize:"60px",fontFamily:"Helvetica"});this.add.text(10,10,"Level "+this.level,{fontSize:"30px",fontFamily:"Helvetica"}).setScrollFactor(0)}create(){this.createBackground(),this.createAnims(),this.dialog=new w(this),1===this.level?(this.dialog.setText("I can't believe Bob got lost in the poop. Conveniently, the piano 🎹 plays a higher note ♯🎵 when I get closer to Bob 🐜."),this.dialog.moveToBottom()):this.dialog.hide(),this.player=new b(this,0,0),this.add.image(100,100,"particle"),this.generatePoopMap(this.level+5),this.createUIText(),this.input.on("pointerup",(async()=>{await this.dialog.skipClick(),this.started||this.start()})),this.player.depth=2,this.cameras.main.startFollow(this.player),this.createTrailFollowPlayer()}start(){this.started=!0,this.player.start(),this.instructions.setVisible(!1),this.giveDistanceUpdate(),this.dialog.hide()}giveDistanceUpdate(){this.distanceUpdatesCount+=1,this.lastDistanceUpdateTime=(new Date).getTime();!async function(e){e>.99&&(e=.99),e<0&&(e=0);const t=u.length-Math.floor(u.length*e)-1;y(u[t],.8)}(Phaser.Math.Distance.BetweenPoints(this.player,this.bobTarget)/this.startDistance)}maybeShowHelpDialog(){Phaser.Math.Distance.BetweenPoints(this.player,this.bobTarget)>1e3&&this.level<8&&!this.distanceHelpTipSeen&&(console.log("You need some distance help"),this.dialog.setText("You're pretty far off... Go find Bob 🐜 in the poop 💩!"),this.dialog.show(),this.distanceHelpTipSeen=!0),this.distanceUpdatesCount>8&&this.level<8&&!this.timeHelpTipSeen&&(console.log("You need some piano help"),this.dialog.setText("The piano 🎹 plays a higher note when you're close."),this.dialog.show(),this.timeHelpTipSeen=!0)}createTrailFollowPlayer(){this.trail=[],this.lastDistance=0;for(let e=0;e<20;e++){const e=this.add.image(-2e3,-2e3,"digTrail");e.scale=.5,e.setBlendMode(Phaser.BlendModes.MULTIPLY),this.trail.push(e)}}updateTrail(){if(this.player.distanceMoved-this.lastDistance>10){this.lastDistance=this.player.distanceMoved;const e=this.trail.shift();e.x=this.player.x,e.y=this.player.y,this.trail.push(e)}}update(){this.maybeShowHelpDialog(),this.updateTrail();if(this.player.isAlive){(new Date).getTime()-this.lastDistanceUpdateTime>3e3&&(this.lastDistanceUpdateTime=0,this.giveDistanceUpdate())}this.startKey.isDown&&this.scene.start(this);for(let e=0;e<this.sprites.length;e++){const t=this.sprites[e].s;t.y-=this.sprites[e].r,t.y<-256&&(t.y=700)}if(this.marker){const e=this.input.activePointer.positionToCamera(this.cameras.main),t=this.groundLayer.worldToTileXY(e.x,e.y),s=this.groundLayer.tileToWorldXY(t.x,t.y);this.marker.setPosition(s.x,s.y)}}}const k={title:"Where is Bob",url:"https://yuvalg.com",version:"2.0",width:800,height:600,type:Phaser.AUTO,parent:"app",scene:[f,x],input:{keyboard:!0},physics:{default:"arcade",arcade:{gravity:{y:0},debug:!1}},backgroundColor:"#000000",render:{pixelArt:!1,antialias:!0},audio:{disableWebAudio:!1},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH}};class M extends Phaser.Game{constructor(e){super(e)}}window.addEventListener("load",(()=>{window._game=new M(k)}));
