const config = {
    type: Phaser.AUTO,
    width : 1200,
    height: 675,
    backgroundColor: "#999999",
    audio: {
        disableWebAudio: true
      },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            enableBody: true,
            //debug: true
        }
    },
    scene:[MenuScene,PauseScene,ArenaScene,BuildScene],
    scale: {
        zoom: 1,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

let gameState = {
    money : 200,
    wave: 0,
    characterStats: {
        speed : 100,
        health: 100
    },
    invisibleTarget : null,
    
    createBackground : function (scene){
        var num = Math.ceil(Math.random ()*3);
        if(num == 1){
            scene.add.image(0,0, 'grassFieldBackground').setOrigin(0,0).setScale((window.innerHeight-10)/675);
        }
        else if(num == 2){
            scene.add.image(0,0, 'caveBackground').setOrigin(0,0).setScale((window.innerHeight-10)/675);
        }
        else if(num == 3){
            scene.add.image(0,0, 'canyonBackground').setOrigin(0,0).setScale((window.innerHeight-10)/675);
        }
    },
    
    chracterControls : function(scene){
        if(gameState.characterStats.health > 0){
            gameState.healthText.setText(`${gameState.characterStats.health}`);
            gameState.character.depth = gameState.character.y+16;
            gameState.character.body.checkWorldBounds();
            if(gameState.character.body.velocity.x == 0){
                gameState.character.anims.play('characterIdle',true);
            }
            if(gameState.keys.W.isDown){
                gameState.character.anims.play('characterWalk',true);
                gameState.character.setVelocityY(-gameState.characterStats.speed);
            }
            else if(gameState.keys.S.isDown){
                gameState.character.anims.play('characterWalk',true);
                gameState.character.setVelocityY(gameState.characterStats.speed);
            }
            else {
                gameState.character.setVelocityY(0);
            }
            if(gameState.keys.A.isDown){
                gameState.character.flipX = true;
                gameState.character.anims.play('characterWalk',true);
                gameState.character.setVelocityX(-gameState.characterStats.speed);
            }
            else if(gameState.keys.D.isDown){
                gameState.character.flipX = false;
                gameState.character.anims.play('characterWalk',true);
                gameState.character.setVelocityX(gameState.characterStats.speed);
            }
            else {
                gameState.character.setVelocityX(0);
            }
            
        }
        else {
            gameState.character.destroy();
            scene.physics.pause();
            scene.time.addEvent({
                delay: 3000,
                callback: ()=>{
                    location.reload();
                    /*scene.scene.stop('ArenaScene');
                    scene.scene.start('MenuScene');*/
                },  
                startAt: 0,
                timeScale: 1
            });
        }
    },
    
    updateMoney:function(){
        gameState.moneyText.setText(`${gameState.money}`);
    },
    
    createIcons: function (scene){
        scene.add.image(window.innerWidth-200,10,'moneySign').setOrigin(0,0).setDepth(window.innerHeight+3);
        gameState.moneyText = scene.add.text( window.innerWidth - 160, 5, `${gameState.money}`, {
            fill: '#OOOOOO', 
            fontSize: '30px',
            fontFamily: 'Qahiri',
            strokeThickness: 10,
        }).setDepth(window.innerHeight+3);
        scene.add.image(window.innerWidth-320,10,'healthSign').setOrigin(0,0).setDepth(window.innerHeight+3);
        gameState.healthText = scene.add.text( window.innerWidth - 285, 5, `${gameState.characterStats.health}`, {
            fill: '#OOOOOO', 
            fontSize: '30px',
            fontFamily: 'Qahiri',
            strokeThickness: 10,
        }).setDepth(window.innerHeight+3);
        scene.add.image(window.innerWidth-440,10,'waveSign').setOrigin(0,0).setDepth(window.innerHeight+3);
        gameState.waveText = scene.add.text( window.innerWidth - 390, 5, `${gameState.wave}`, {
            fill: '#OOOOOO', 
            fontSize: '30px',
            fontFamily: 'Qahiri',
            strokeThickness: 10,
        }).setDepth(window.innerHeight+3);
        var button = scene.add.image(window.innerWidth-75,10,'pauseSign').setOrigin(0,0).setDepth(window.innerHeight+3).setInteractive();
        button.on('pointerdown', function(pointer){
            scene.scene.pause('ArenaScene');
            scene.scene.launch('PauseScene');
        });
    },
    
    
    blueprint:{
        active: false,
        button: null,
        building: null,
        overLap: 1,
        toggleOff:function(blueprintSprite){
            gameState.blueprint.active = false;
            gameState.blueprintSprite.destroy();
            gameState.blueprint.button.destroy();
        },
        create: function(scene,towerStats){
            gameState.blueprint.active = true;
            gameState.blueprintSprite = scene.physics.add.sprite(scene.input.x,scene.input.y,`${towerStats.sprite}`).setInteractive().setDepth(10000);
            gameState.blueprintSprite.body.offset.x = towerStats.levels.lvl1.offsetx;
            gameState.blueprintSprite.body.offset.y = towerStats.levels.lvl1.offsety;
            gameState.blueprintSprite.body.width = towerStats.levels.lvl1.width;
            gameState.blueprintSprite.body.height = towerStats.levels.lvl1.height;
            gameState.blueprint.building = towerStats;
            gameState.blueprint.button = gameState.blueprintSprite.on('pointerdown', function(pointer){
                if(gameState.money >= towerStats.levels.lvl1.cost && gameState.blueprint.overLap >5){
                    gameState.money -= towerStats.levels.lvl1.cost;
                    towerStats.spawnTower                                                               (gameState.globalScene,towerStats);
                    gameState.updateMoney();
                }
                else if(gameState.blueprintSprite.x <= 100 && gameState.blueprintSprite.x >= window.innerWidth-100){
                    gameState.createTempText(scene,10,window.innerHeight/2,"!!!CANT BUILD INSIDE THE SPAWN ZONE!!!",2500,18);
                }
                else if(gameState.money < towerStats.cost){
                    gameState.createTempText(scene,10,10,`Building Costs : $${gameState.blueprint.building.cost}`,3000,25);
                }
            });
            gameState.blueprintOverlapCheck = scene.physics.add.overlap(gameState.blueprintSprite, gameState.buildings,()=>{
                gameState.blueprint.overLap = 0;
            });
            gameState.blueprintOverlapCheck1 = scene.physics.add.overlap(gameState.blueprintSprite, gameState.zombies,()=>{
                gameState.blueprint.overLap = 0;
            });
            gameState.blueprintOverlapCheck2 = scene.physics.add.overlap(gameState.blueprintSprite, gameState.character,()=>{
                gameState.blueprint.overLap = 0;
            });
        },
        checkControls: function (scene){
            if(gameState.blueprint.active == true){
                gameState.blueprint.overLap += 1;
                gameState.blueprintSprite.x = scene.input.x;
                gameState.blueprintSprite.y = scene.input.y;
                
            }
            if(gameState.keys.ESC.isDown && gameState.blueprint.active == true){
                gameState.blueprint.toggleOff(gameState.blueprintSprite);
                gameState.blueprintOverlapCheck.destroy();
                gameState.blueprintOverlapCheck1.destroy();
                gameState.blueprintOverlapCheck2.destroy();
            }
            if(gameState.keys.ESC.isDown){
                gameState.selected.select = null;
            }
            else if(gameState.keys.ONE.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(scene,'factory',gameState.factoryStats);
            }
            else if(gameState.keys.TWO.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(scene,'woodWall',gameState.woodWallStats);
                gameState.blueprintSprite.body.offset.y = 15;
                gameState.blueprintSprite.body.height = 15;
            }
            else if(gameState.keys.THREE.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(scene,'gatlingTower',gameState.gatlingTowerStats);
            }
            else if(gameState.keys.FOUR.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(scene,'electroTower',gameState.electroTowerStats);
                gameState.blueprintSprite.body.offset.y = 30;
                gameState.blueprintSprite.body.height = 40;
            }
            else if(gameState.keys.FIVE.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(scene,'barracks',gameState.barrackStats);
            }
            else if(gameState.keys.SIX.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(scene,'sniperTower',gameState.sniperTowerStats);
                gameState.blueprintSprite.body.offset.y = 85;
                gameState.blueprintSprite.body.height = 50;
            }
            else if(gameState.keys.SEVEN.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(scene,'alienTower',gameState.alienTowerStats);
            }
        }
    },
    
    selected:{
        select: null,
        image: null,
        upgradeButton: null,
        sellButton: null,
        setInfo: function(scene, selected){
            gameState.selected.select = selected;
        },
        checkLoop: function(scene){
            var icon = scene.add.sprite(700,615,'');
            var text = scene.add.text(750, 615, '', {
                fill: '#000000', 
                fontSize: `20px`,
                fontFamily: 'Qahiri',
                strokeThickness: 2,
                wordWrap: { width: 300 }
            }).setDepth(2).setOrigin(0,0.5);
            var upgradeButton = scene.add.sprite(1100,615,'upgradeTowerIcon').setInteractive();
            upgradeButton.on('pointerdown', function(pointer){
                gameState.selected.select.towerStats.upgradeTower(scene,gameState.selected.select);
            });
            scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(gameState.selected.select !== null && gameState.selected.select.health > 0){
                        text.setText(`${gameState.selected.select.currentLevel.name}         ${gameState.selected.select.health}/${gameState.selected.select.currentLevel.health}`);
                        icon.setTexture(`${gameState.selected.select.towerStats.sprite}`);
                        if(gameState.selected.select.currentLevel.width > gameState.selected.select.currentLevel.height){
                            icon.scale = 50/gameState.selected.select.currentLevel.width;
                        }else{
                            icon.scale = 50/gameState.selected.select.currentLevel.height;  
                        }
                        icon.setFrame(1);
                    }else{
                        text.setText('');
                        icon.setTexture('');
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });
        },
    },
    
    
    spawnZombies: function(scene,stats,count){
        if(count > 0){
            scene.time.addEvent({
                delay: 100,
                callback: ()=>{
                    var random = Math.ceil(Math.random()*2);
                    if(random == 1){
                        stats.spawnZombie(scene,Math.random()*50+50,Math.random()*window.innerHeight);
                    }
                    else {
                        stats.spawnZombie(scene,window.innerWidth-(Math.random()*50+50),Math.random()*window.innerHeight);
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: count-1
            });
        }
    },
    commenceWaves: function (scene){
        scene.time.addEvent({
            delay: 0,
            callback: ()=>{
                gameState.waveLoop = scene.time.addEvent({
                    delay: 30000,
                    callback: ()=>{
                        gameState.wave += 1;
                        gameState.waveText.setText(`${gameState.wave}`);
                        if(gameState.wave == 1){
                            scene.time.addEvent({
                                delay: 1000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 4
                            }); 
                        }else if(gameState.wave == 2){
                            scene.time.addEvent({
                                delay: 1000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 9
                            }); 
                        }else if(gameState.wave == 3){
                            scene.time.addEvent({
                                delay: 1000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 19
                            }); 
                        }else if(gameState.wave == 4){
                            scene.time.addEvent({
                                delay: 1000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 24
                            }); 
                        }
                        else if(gameState.wave == 5){
                            scene.time.addEvent({
                                delay: 1000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 29
                            }); 
                        }else if(gameState.wave == 6){
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 29
                            }); 
                        }else if(gameState.wave == 7){
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 9
                            }); 
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 4
                            }); 
                        }else if(gameState.wave == 8){
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 9
                            }); 
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 9
                            }); 
                        }
                        else if(gameState.wave == 9){
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 4
                            }); 
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 14
                            }); 
                        }
                        else if(gameState.wave == 10){
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 24
                            }); 
                        }else if(gameState.wave == 11){
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 49
                            }); 
                        }else if(gameState.wave == 12){
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 24
                            }); 
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 24
                            });
                        }else if(gameState.wave == 13){
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombieGiantStats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 9
                            }); 
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 9
                            });
                        }else if(gameState.wave == 14){
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombieGiantStats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 9
                            }); 
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 19
                            });
                        }else if(gameState.wave == 15){
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombieGiantStats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 9
                            }); 
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: 9
                            });
                        }else if(gameState.wave > 15){
                            scene.time.addEvent({
                                delay: 2000,
                                callback: ()=>{
                                    gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                },  
                                startAt: 0,
                                timeScale: 1,
                                repeat: gameState.wave
                            }); 
                        }
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: -1
                }); 
            },  
            startAt: 0,
            timeScale: 1
        }); 
    },
    
    zombie1Stats:{
        name: "Zombie",
        speed: 20,
        health: 100,
        damage: 5,
        attackRange: 20,
        attackSpeed: 1000,
        spawnZombie: function(scene,x,y){
            var zombie = gameState.zombies.create(x,y,`zombie1`).setDepth(1);
            zombie.anims.play(`zombie1Spawn`);
            zombie.health = gameState.zombie1Stats.health;
            gameState.createHealthBar(scene,zombie,gameState.zombie1Stats.health);
            scene.time.addEvent({
                delay: 1310,
                callback: ()=>{
                    gameState.zombie1Stats.behaviourLoop(scene,zombie);
                },  
                startAt: 0,
                timeScale: 1
            }); 
        },
        movement: function (scene,zombie,target){
            scene.physics.moveTo(zombie,target.x, target.y,gameState.zombie1Stats.speed);
            zombie.anims.play('zombie1Walk',true);
            if(target.x > zombie.x){
                zombie.flipX = false;
            }
            else if(target.x < zombie.x){
                zombie.flipX = true;
            }
        },
        attack: function (scene, target){
            if(target == gameState.character){
                gameState.characterStats.health -= gameState.zombie1Stats.damage;
            }
            else {
                target.health -= gameState.zombie1Stats.damage;
            }
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target = gameState.character;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            if(Phaser.Math.Distance.BetweenPoints(gameState.character, zombie) < closest){
                //target = gameState.character;
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
            var target = gameState.zombie1Stats.findTarget(scene,zombie);
            var dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
            var loop = scene.time.addEvent({
                delay: gameState.zombie1Stats.attackSpeed,
                callback: ()=>{
                    gameState.zombie1Stats.attack(scene,target);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loop.paused = true;
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(zombie.health > 0){
                        target = gameState.zombie1Stats.findTarget(scene,zombie);
                        dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
                        if(dist < gameState.zombie1Stats.attackRange){
                            zombie.setVelocityX(0);
                            zombie.setVelocityY(0);
                            loop.paused = false;
                        }
                        else {
                            loop.paused = true;
                            gameState.zombie1Stats.movement(scene,zombie,target);
                        }
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        zombie.anims.play('zombie1Death',true);
                        zombie.setVelocityX(0);
                        zombie.setVelocityY(0);
                        scene.time.addEvent({
                            delay: 400,
                            callback: ()=>{
                            zombie.destroy(); 
                            },  
                            startAt: 0,
                            timeScale: 1
                        }); 
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    
    zombieGiantStats:{
        name: "Zombie Giant",
        speed: 20,
        health: 600,
        damage: 25,
        attackRange: 30,
        attackSpeed: 3000,
        spawnZombie: function(scene,x,y){
            var zombie = gameState.zombies.create(x,y,`zombieGiant`).setDepth(1);
            zombie.anims.play(`zombieGiantSpawn`);
            scene.time.addEvent({
                delay: 1310,
                callback: ()=>{
                    gameState.zombieGiantStats.behaviourLoop(scene,zombie);
                },  
                startAt: 0,
                timeScale: 1
            }); 
        },
        movement: function (scene,zombie,target){
            scene.physics.moveTo(zombie,target.x, target.y,gameState.zombieGiantStats.speed);
            zombie.anims.play('zombieGiantWalk',true);
            if(target.x > zombie.x){
                zombie.flipX = false;
            }
            else if(target.x < zombie.x){
                zombie.flipX = true;
            }
        },
        attack: function (scene, target){
            if(target == gameState.character){
                gameState.characterStats.health -= gameState.zombieGiantStats.damage;
            }
            else {
                target.health -= gameState.zombieGiantStats.damage;
            }
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target = gameState.character;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            if(Phaser.Math.Distance.BetweenPoints(gameState.character, zombie) < closest){
                target = gameState.character;
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
            zombie.health = gameState.zombieGiantStats.health;
            var target = gameState.zombieGiantStats.findTarget(scene,zombie);
            var dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
            var loop = scene.time.addEvent({
                delay: gameState.zombieGiantStats.attackSpeed,
                callback: ()=>{
                    gameState.zombieGiantStats.attack(scene,target);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loop.paused = true;
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(zombie.health > 0){
                        target = gameState.zombieGiantStats.findTarget(scene,zombie);
                        dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
                        if(dist < gameState.zombieGiantStats.attackRange){
                            zombie.setVelocityX(0);
                            zombie.setVelocityY(0);
                            loop.paused = false;
                        }
                        else {
                            loop.paused = true;
                            gameState.zombieGiantStats.movement(scene,zombie,target);
                        }
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        zombie.anims.play('zombieGiantDeath',true);
                        zombie.setVelocityX(0);
                        zombie.setVelocityY(0);
                        scene.time.addEvent({
                            delay: 400,
                            callback: ()=>{
                            zombie.destroy(); 
                            },  
                            startAt: 0,
                            timeScale: 1
                        }); 
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    
    zombieBomberStats:{
        name: "Zombie Bomber",
        speed: 100,
        health: 75,
        damage: 100,
        attackRange: 100,
        attackSpeed: 1,
        spawnZombie: function(scene,x,y){
            var zombie = gameState.zombies.create(x,y,`zombieBomber`).setDepth(1);
            zombie.anims.play(`zombieBomberSpawn`);
            scene.time.addEvent({
                delay: 1310,
                callback: ()=>{
                    gameState.zombieBomberStats.behaviourLoop(scene,zombie);
                },  
                startAt: 0,
                timeScale: 1
            }); 
        },
        movement: function (scene,zombie,target){
            scene.physics.moveTo(zombie,target.x, target.y,gameState.zombieBomberStats.speed);
            zombie.anims.play('zombieBomberWalk',true);
            if(target.x > zombie.x){
                zombie.flipX = false;
            }
            else if(target.x < zombie.x){
                zombie.flipX = true;
            }
        },
        attack: function (scene, target,zombie){
            for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                var dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                if(dist<gameState.zombieBomberStats.attackRange){
                    gameState.buildings.getChildren()[i].health -= gameState.zombieBomberStats.damage;
                }
            }
            var dist = Phaser.Math.Distance.BetweenPoints(gameState.character, zombie);
            if(dist<50){
                gameState.characterStats.health -= gameState.zombieBomberStats.damage;
            }
            zombie.health = 0;
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target = gameState.character;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            if(Phaser.Math.Distance.BetweenPoints(gameState.character, zombie) < closest){
                //target = gameState.character;
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
            zombie.health = gameState.zombieBomberStats.health;
            var target = gameState.zombieBomberStats.findTarget(scene,zombie);
            var dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
            var loop = scene.time.addEvent({
                delay: gameState.zombieBomberStats.attackSpeed,
                callback: ()=>{
                    gameState.zombieBomberStats.attack(scene,target,zombie);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loop.paused = true;
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(zombie.health > 0){
                        target = gameState.zombieBomberStats.findTarget(scene,zombie);
                        dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
                        if(dist < gameState.zombieBomberStats.attackRange){
                            zombie.setVelocityX(0);
                            zombie.setVelocityY(0);
                            loop.paused = false;
                        }
                        else {
                            loop.paused = true;
                            gameState.zombieBomberStats.movement(scene,zombie,target);
                        }
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        gameState.createExplosion(scene, zombie.x,zombie.y);
                        zombie.destroy();
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    
    zombieKingStats:{
        name: "Zombie King",
        speed: 10,
        health: 50000,
        damage: 500,
        attackRange: 100,
        attackSpeed: 3000,
        spawnZombie: function(scene,x,y){
            var zombie = gameState.zombies.create(x,y,`zombieKing`).setDepth(0);
            zombie.setDepth(zombie.y);
            zombie.body.offset.y = 100;
            zombie.body.height = 100;
            zombie.anims.play(`zombieKingSpawn`);
            scene.time.addEvent({
                delay: 1310,
                callback: ()=>{
                    gameState.zombieKingStats.behaviourLoop(scene,zombie);
                },  
                startAt: 0,
                timeScale: 1
            }); 
        },
        movement: function (scene,zombie,target){
            scene.physics.moveTo(zombie,target.x, target.y,gameState.zombieKingStats.speed);
            zombie.anims.play('zombieKingWalk',true);
            if(target.x > zombie.x){
                zombie.flipX = false;
            }
            else if(target.x < zombie.x){
                zombie.flipX = true;
            }
        },
        attack: function (scene, target){
            if(target == gameState.character){
                gameState.characterStats.health -= gameState.zombieKingStats.damage;
            }
            else {
                target.health -= gameState.zombieKingStats.damage;
            }
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target = gameState.character;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            if(Phaser.Math.Distance.BetweenPoints(gameState.character, zombie) < closest){
                target = gameState.character;
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
            zombie.health = gameState.zombieKingStats.health;
            zombie.setDepth(zombie.y);
            var target = gameState.zombieKingStats.findTarget(scene,zombie);
            var dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
            var loop = scene.time.addEvent({
                delay: gameState.zombieKingStats.attackSpeed,
                callback: ()=>{
                    gameState.zombieKingStats.attack(scene,target);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loop.paused = true;
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(zombie.health > 0){
                        target = gameState.zombieKingStats.findTarget(scene,zombie);
                        dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
                        if(dist < gameState.zombieKingStats.attackRange){
                            zombie.setVelocityX(0);
                            zombie.setVelocityY(0);
                            loop.paused = false;
                        }
                        else {
                            loop.paused = true;
                            gameState.zombieKingStats.movement(scene,zombie,target);
                        }
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        zombie.anims.play('zombieKingDeath',true);
                        zombie.setVelocityX(0);
                        zombie.setVelocityY(0);
                        scene.time.addEvent({
                            delay: 400,
                            callback: ()=>{
                            zombie.destroy(); 
                            },  
                            startAt: 0,
                            timeScale: 1
                        }); 
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    
    zombieWizardStats:{
        name: "Zombie Wizard",
        speed: 25,
        health: 1500,
        damage: 25,
        attackRange: 200,
        attackSpeed: 1500,
        spawnZombie: function(scene,x,y){
            var zombie = gameState.zombies.create(Math.random()*11,Math.random()*window.innerHeight-32,`zombieWizard`).setDepth(1);
            zombie.anims.play(`zombieWizardSpawn`);
            scene.time.addEvent({
                delay: 1310,
                callback: ()=>{
                    gameState.zombieWizardStats.behaviourLoop(scene,zombie);
                },  
                startAt: 0,
                timeScale: 1
            }); 
        },
        movement: function (scene,zombie,target){
            scene.physics.moveTo(zombie,target.x, target.y,gameState.zombieWizardStats.speed);
            zombie.anims.play('zombieWizardWalk',true);
            if(target.x > zombie.x){
                zombie.flipX = false;
            }
            else if(target.x < zombie.x){
                zombie.flipX = true;
            }
        },
        attack: function (scene, target,zombie){
            var bullet = gameState.bullets.create(zombie.x,zombie.y,'zombieWizardBall');
            gameState.angle=Phaser.Math.Angle.Between(zombie.x,zombie.y,target.x,target.y);
            bullet.setRotation(gameState.angle); 
            scene.physics.moveTo(bullet,target.x,target.y,300);
            var bulletLoop = scene.time.addEvent({
                delay: 10000,
                callback: ()=>{
                    bullet.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            scene.physics.add.overlap(bullet, gameState.buildings,(bull, targ)=>{
                bulletLoop.destroy();
                bull.destroy();
                targ.health -= gameState.zombieWizardStats.damage;
            });
            scene.physics.add.overlap(bullet, gameState.character,(bull, targ)=>{
                bulletLoop.destroy();
                bull.destroy();
                gameState.characterStats.health -= gameState.zombieWizardStats.damage;
            });
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target = gameState.character;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            if(Phaser.Math.Distance.BetweenPoints(gameState.character, zombie) < closest){
                target = gameState.character;
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
            zombie.health = gameState.zombieWizardStats.health;
            var target = gameState.zombieWizardStats.findTarget(scene,zombie);
            var dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
            var spawnLoop = scene.time.addEvent({
                delay: 10000,
                callback: ()=>{
                    scene.time.addEvent({
                        delay: 1,
                        callback: ()=>{
                            gameState.zombie1Stats.spawnZombie(scene,zombie.x+(Math.random()*200-100),zombie.y+(Math.random()*200-100));
                        },  
                        startAt: 0,
                        timeScale: 1,
                        repeat: 3
                    });
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            var loop = scene.time.addEvent({
                delay: gameState.zombieWizardStats.attackSpeed,
                callback: ()=>{
                    gameState.zombieWizardStats.attack(scene,target,zombie);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loop.paused = true;
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(zombie.health > 0){
                        target = gameState.zombieWizardStats.findTarget(scene,zombie);
                        dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
                        if(dist < gameState.zombieWizardStats.attackRange){
                            zombie.setVelocityX(0);
                            zombie.setVelocityY(0);
                            loop.paused = false;
                        }
                        else {
                            loop.paused = true;
                            gameState.zombieWizardStats.movement(scene,zombie,target);
                        }
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        spawnLoop.destroy();
                        zombie.anims.play('zombieWizardDeath',true);
                        zombie.setVelocityX(0);
                        zombie.setVelocityY(0);
                        scene.time.addEvent({
                            delay: 400,
                            callback: ()=>{
                            zombie.destroy(); 
                            },  
                            startAt: 0,
                            timeScale: 1
                        }); 
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
        
    zombieMuskateerStats:{
        name: "Zombie Muskateer",
        speed: 30,
        health: 100,
        damage: 5,
        attackRange: 150,
        attackSpeed: 2000,
        spawnZombie: function(scene,x,y){
            var zombie = gameState.zombies.create(x,y,`zombieMuskateer`).setDepth(1);
            zombie.anims.play(`zombieMuskateerSpawn`);
            zombie.health = gameState.zombieMuskateerStats.health;
            gameState.createHealthBar(scene,zombie,gameState.zombieMuskateerStats.health);
            scene.time.addEvent({
                delay: 1310,
                callback: ()=>{
                    gameState.zombieMuskateerStats.behaviourLoop(scene,zombie);
                },  
                startAt: 0,
                timeScale: 1
            }); 
        },
        movement: function (scene,zombie,target){
            scene.physics.moveTo(zombie,target.x, target.y,gameState.zombieMuskateerStats.speed);
            zombie.anims.play('zombieMuskateerWalk',true);
            if(target.x > zombie.x){
                zombie.flipX = false;
            }
            else if(target.x < zombie.x){
                zombie.flipX = true;
            }
        },
        attack: function (scene, target,zombie){
            var bullet = gameState.bullets.create(zombie.x,zombie.y,'bullet');
            gameState.angle=Phaser.Math.Angle.Between(zombie.x,zombie.y,target.x,target.y);
            bullet.setRotation(gameState.angle); 
            scene.physics.moveTo(bullet,target.x+target.currentLevel.offsetx ,target.y+target.currentLevel.offsety- target.currentLevel.height,300);
            var bulletLoop = scene.time.addEvent({
                delay: 10000,
                callback: ()=>{
                    bullet.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            scene.physics.add.overlap(bullet, gameState.buildings,(bull, targ)=>{
                bulletLoop.destroy();
                bull.destroy();
                targ.health -= gameState.zombieMuskateerStats.damage;
            });
            scene.physics.add.overlap(bullet, gameState.character,(bull, targ)=>{
                bulletLoop.destroy();
                bull.destroy();
                gameState.characterStats.health -= gameState.zombieMuskateerStats.damage;
            });
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target = gameState.character;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            if(Phaser.Math.Distance.BetweenPoints(gameState.character, zombie) < closest){
                //target = gameState.character;
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
            var target = gameState.zombieMuskateerStats.findTarget(scene,zombie);
            var dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
            var loop = scene.time.addEvent({
                delay: gameState.zombieMuskateerStats.attackSpeed,
                callback: ()=>{
                    gameState.zombieMuskateerStats.attack(scene,target,zombie);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loop.paused = true;
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(zombie.health > 0){
                        target = gameState.zombieMuskateerStats.findTarget(scene,zombie);
                        dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
                        if(dist < gameState.zombieMuskateerStats.attackRange){
                            zombie.setVelocityX(0);
                            zombie.setVelocityY(0);
                            loop.paused = false;
                            zombie.anims.play('zombieMuskateerAction',true);
                        }
                        else {
                            loop.paused = true;
                            gameState.zombieMuskateerStats.movement(scene,zombie,target);
                        }
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        zombie.anims.play('zombieMuskateerDeath',true);
                        zombie.setVelocityX(0);
                        zombie.setVelocityY(0);
                        scene.time.addEvent({
                            delay: 400,
                            callback: ()=>{
                            zombie.destroy(); 
                            },  
                            startAt: 0,
                            timeScale: 1
                        }); 
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    
    zombieDogStats:{
        name: "Zombie Dog",
        speed: 125,
        health: 50,
        damage: 10,
        attackRange: 20,
        attackSpeed: 500,
        spawnZombie: function(scene,x,y){
            var zombie = gameState.zombies.create(x,y,`zombieDog`).setDepth(1);
            zombie.anims.play(`zombieDogSpawn`);
            scene.time.addEvent({
                delay: 300,
                callback: ()=>{
                    gameState.zombieDogStats.behaviourLoop(scene,zombie);
                },  
                startAt: 0,
                timeScale: 1
            }); 
        },
        movement: function (scene,zombie,target){
            scene.physics.moveTo(zombie,target.x, target.y,gameState.zombieDogStats.speed);
            zombie.anims.play('zombieDogWalk',true);
            if(target.x > zombie.x){
                zombie.flipX = false;
            }
            else if(target.x < zombie.x){
                zombie.flipX = true;
            }
        },
        attack: function (scene, target){
            if(target == gameState.character){
                gameState.characterStats.health -= gameState.zombieDogStats.damage;
            }
            else {
                target.health -= gameState.zombieDogStats.damage;
            }
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target = gameState.character;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            if(Phaser.Math.Distance.BetweenPoints(gameState.character, zombie) < closest){
                target = gameState.character;
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
            zombie.health = gameState.zombieDogStats.health;
            var target = gameState.zombieDogStats.findTarget(scene,zombie);
            var dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
            var loop = scene.time.addEvent({
                delay: gameState.zombieDogStats.attackSpeed,
                callback: ()=>{
                    gameState.zombieDogStats.attack(scene,target);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loop.paused = true;
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(zombie.health > 0){
                        target = gameState.zombieDogStats.findTarget(scene,zombie);
                        dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
                        if(dist < gameState.zombieDogStats.attackRange){
                            zombie.setVelocityX(0);
                            zombie.setVelocityY(0);
                            loop.paused = false;
                        }
                        else {
                            loop.paused = true;
                            gameState.zombieDogStats.movement(scene,zombie,target);
                        }
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        zombie.anims.play('zombieDogDeath',true);
                        zombie.setVelocityX(0);
                        zombie.setVelocityY(0);
                        scene.time.addEvent({
                            delay: 400,
                            callback: ()=>{
                            zombie.destroy(); 
                            },  
                            startAt: 0,
                            timeScale: 1
                        }); 
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },

    
    
    createExplosion: function(scene,x,y){
        var explode = scene.physics.add.sprite(x,y,`buildingExplosion`);
        explode.anims.play('explode',true);
        scene.time.addEvent({
            delay: 1000,
            callback: ()=>{
                explode.destroy();
            },  
            startAt: 0,
            timeScale: 1
        }); 
    },
    
    
    gameTowers:[
        //machineGunStats
        {
            levels:{
                lvl1:{
                    lvl:1,
                    cost: 50,
                    damage: 5,
                    health: 50,
                    attackRange: 150,
                    attackSpeed: 200,
                    offsetx: 10,
                    offsety: 50,
                    width: 60,
                    height: 20,
                    name: 'MachineGunTower I'
                },
                lvl2:{
                    lvl:2,
                    cost: 100,
                    damage: 6,
                    health: 90,
                    attackRange: 160,
                    attackSpeed: 175,
                    offsetx: 10,
                    offsety: 50,
                    width: 60,
                    height: 20,
                    name: 'MachineGunTower II'
                },
                lvl3:{
                    lvl:3,
                    cost: 200,
                    damage: 7,
                    health: 130,
                    attackRange: 170,
                    attackSpeed: 125,
                    offsetx: 10,
                    offsety: 50,
                    width: 60,
                    height: 20,
                    name: 'MachineGunTower III'
                }
            },
            sprite: 'machineGunTower',
            attackType: 'normal',
            buildingType: 'tower',


            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'machineGunTower').setDepth(scene.input.y).setImmovable().setInteractive();
                tower.setFrame(1);
                tower.health = towerStats.levels.lvl1.health;
                tower.active = true;
                tower.towerStats = towerStats;
                tower.body.offset.x = towerStats.levels.lvl1.offsetx;
                tower.body.offset.y = towerStats.levels.lvl1.offsety;
                tower.body.width = towerStats.levels.lvl1.width;
                tower.body.height = towerStats.levels.lvl1.height;
                tower.currentLevel = towerStats.levels.lvl1;
                tower.on('pointerdown', function(pointer){
                    if(gameState.blueprint.active == false){
                        gameState.selected.setInfo(scene,tower);
                    }
                });
                gameState.createHealthBar(scene,tower,towerStats.levels.lvl1.health);
                gameState.gameTowers[0].action(scene,tower);
            },
            upgradeTower: function(scene,tower){
               if(tower.currentLevel.lvl == 1 && gameState.money >= tower.towerStats.levels.lvl2.cost){
                   gameState.money -= tower.towerStats.levels.lvl2.cost;
                    tower.destroyHB();
                    tower.health = tower.towerStats.levels.lvl2.health;
                    tower.currentLevel = tower.towerStats.levels.lvl2;
                    gameState.createHealthBar(scene,tower,tower.currentLevel.health);
                    tower.attackLoop.delay = tower.currentLevel.attackSpeed;
                }else if(tower.currentLevel.lvl == 2 && gameState.money >= tower.towerStats.levels.lvl3.cost){
                    gameState.money -= tower.towerStats.levels.lvl3.cost;
                    tower.destroyHB();
                    tower.health = tower.towerStats.levels.lvl3.health;
                    tower.currentLevel = tower.towerStats.levels.lvl3;
                    gameState.createHealthBar(scene,tower,tower.currentLevel.health);
                    tower.attackLoop.delay = tower.currentLevel.attackSpeed;
                } 
            },
            findTarget: function(scene,building){
                var dist;
                var closest = 10000;
                var target = gameState.invisibleTarget;
                if(gameState.zombies.getChildren().length > 0){
                    for (var i = 0; i < gameState.zombies.getChildren().length; i++){ 
                        dist = Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], building);
                        if(dist<closest){
                            closest = dist;
                            target = gameState.zombies.getChildren()[i];
                        }
                    }
                }
                return target;
            },
            action: function(scene,building){
                var target = building.towerStats.findTarget(scene,building);
                var dist = Phaser.Math.Distance.BetweenPoints(target, building);
                building.attackLoop = scene.time.addEvent({
                    delay: building.currentLevel.attackSpeed,
                    callback: ()=>{
                        var bullet = gameState.bullets.create(building.x,building.y,'bullet');
                        gameState.angle=Phaser.Math.Angle.Between(building.x,building.y,target.x,target.y);
                        bullet.setRotation(gameState.angle); 
                        scene.physics.moveTo(bullet,target.x +(Math.random()*6-10),target.y +(Math.random()*6-10),300);
                        var bulletLoop = scene.time.addEvent({
                            delay: 8000,
                            callback: ()=>{
                                bullet.destroy();
                            },  
                            startAt: 0,
                            timeScale: 1
                        });
                        scene.physics.add.overlap(bullet, gameState.zombies,(bull, targ)=>{
                            bulletLoop.destroy();
                            bull.destroy();
                            targ.health -= building.currentLevel.damage;
                        });
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: -1
                }); 
                building.attackLoop.paused = true;
                var bLoop = scene.time.addEvent({
                    delay: 1,
                    callback: ()=>{
                        if(building.health > 0){
                            if(building.active == true){
                                target = building.towerStats.findTarget(scene,building);
                                dist = Phaser.Math.Distance.BetweenPoints(target, building);
                                if(dist <= building.currentLevel.attackRange){
                                    if(target.x < building.x){
                                        building.flipX = true;
                                    }else {
                                        building.flipX = false;
                                    }
                                    building.anims.play(`machineGunTower${building.currentLevel.lvl}Action`,true);
                                    building.attackLoop.paused = false;
                                }
                                else {
                                    building.attackLoop.paused = true;
                                    building.anims.play(`machineGunTower${building.currentLevel.lvl}Idle`,true);
                                }
                            }
                        }
                        else {
                            gameState.createExplosion(scene,building.x,building.y);
                            bLoop.destroy();
                            building.attackLoop.destroy();
                            building.destroy(); 
                        }
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: -1
                });  
            }
        },
        //woodWallStats
        {
            levels:{
                lvl1:{
                    lvl: 1,
                    cost: 25,
                    damage: 0,
                    health: 50,
                    attackRange: 0,
                    attackSpeed: 0,
                    offsetx: 0,
                    offsety: 15,
                    width: 18,
                    height: 15,
                    name: 'WoodWall I'
                },
                lvl2:{
                    lvl: 2,
                    cost: 30,
                    damage: 0,
                    health: 65,
                    attackRange: 0,
                    attackSpeed: 0,
                    offsetx: 0,
                    offsety: 15,
                    width: 18,
                    height: 15,
                    name: 'WoodWall II'
                },
                lvl3:{
                    lvl: 3,
                    cost: 40,
                    damage: 0,
                    health: 80,
                    attackRange: 0,
                    attackSpeed: 0,
                    offsetx: 0,
                    offsety: 15,
                    width: 18,
                    height: 15,
                    name: 'WoodWall III'
                }
            },
            sprite: 'woodWall',
            attackType: 'none',
            buildingType: 'wall',
            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'woodWall').setDepth(scene.input.y).setImmovable().setInteractive();
                tower.body.offset.y = towerStats.levels.lvl1.offsety;
                tower.body.height = towerStats.levels.lvl1.height;
                tower.health = towerStats.levels.lvl1.health;
                tower.currentLevel = towerStats.levels.lvl1;
                tower.towerStats = towerStats;
                tower.setFrame(1);
                tower.on('pointerdown', function(pointer){
                    if(gameState.blueprint.active == false){
                        gameState.selected.setInfo(scene,tower);
                    }
                });
                towerStats.action(scene,tower);
            },
            upgradeTower: function(scene,tower){
               if(tower.currentLevel.lvl == 1 && gameState.money >= tower.towerStats.levels.lvl2.cost){
                    gameState.money -= tower.towerStats.levels.lvl2.cost;
                    tower.health = tower.towerStats.levels.lvl2.health;
                    tower.currentLevel = tower.towerStats.levels.lvl2;
                }else if(tower.currentLevel.lvl == 2 && gameState.money >= tower.towerStats.levels.lvl3.cost){
                    gameState.money -= tower.towerStats.levels.lvl3.cost;
                    tower.health = tower.towerStats.levels.lvl3.health;
                    tower.currentLevel = tower.towerStats.levels.lvl3;
                } 
            },
            action: function(scene,building){
                var loop1 = scene.time.addEvent({
                    delay: 1,
                    callback: ()=>{
                        if(building.health <=0){
                            gameState.createExplosion(scene,building.x,building.y);
                            building.destroy();
                            loop1.destroy();
                        }else {
                            building.setFrame(building.currentLevel.lvl);
                        }
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: -1
                }); 
            }
        },
        //FactoryStats
        {
            levels:{
                lvl1:{
                    lvl: 1,
                    cost: 100,
                    damage: 0,
                    health: 30,
                    attackRange: 0,
                    attackSpeed: 0,
                    offsetx: 0,
                    offsety: 0,
                    width: 50,
                    height: 50,
                    name: 'Factory I'
                },
                lvl2:{
                    lvl: 2,
                    cost: 500,
                    damage: 0,
                    health: 400,
                    attackRange: 0,
                    attackSpeed: 0,
                    offsetx: 0,
                    offsety: 0,
                    width: 50,
                    height: 50,
                    name: 'Factory II'
                },
                lvl3:{
                    lvl: 3,
                    cost: 1000,
                    damage: 0,
                    health: 500,
                    attackRange: 0,
                    attackSpeed: 0,
                    offsetx: 0,
                    offsety: 0,
                    width: 50,
                    height: 50,
                    name: 'Factory III'
                }
            },
            sprite: 'factory',
            attackType: 'none',
            buildingType: 'producer',
            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'factory').setDepth(scene.input.y).setImmovable().setInteractive();
                tower.setFrame(1);
                tower.health = towerStats.levels.lvl1.health;
                tower.active = true;
                tower.towerStats = towerStats;
                tower.body.offset.x = towerStats.levels.lvl1.offsetx;
                tower.body.offset.y = towerStats.levels.lvl1.offsety;
                tower.body.width = towerStats.levels.lvl1.width;
                tower.body.height = towerStats.levels.lvl1.height;
                tower.currentLevel = towerStats.levels.lvl1;
                gameState.createHealthBar(scene,tower,tower.currentLevel.health);
                tower.on('pointerdown', function(pointer){
                    if(gameState.blueprint.active == false){
                        gameState.selected.setInfo(scene,tower);
                    }
                });
                gameState.gameTowers[2].action(scene,tower);
            },
            upgradeTower: function(scene,tower){
               if(tower.currentLevel.lvl == 1 && gameState.money >= tower.towerStats.levels.lvl2.cost){
                   gameState.money -= tower.towerStats.levels.lvl2.cost;
                    tower.destroyHB();
                    tower.health = tower.towerStats.levels.lvl2.health;
                    tower.currentLevel = tower.towerStats.levels.lvl2;
                    gameState.createHealthBar(scene,tower,tower.currentLevel.health);
                }else if(tower.currentLevel.lvl == 2 && gameState.money >= tower.towerStats.levels.lvl3.cost){
                    gameState.money -= tower.towerStats.levels.lvl3.cost;
                    tower.destroyHB();
                    tower.health = tower.towerStats.levels.lvl3.health;
                    tower.currentLevel = tower.towerStats.levels.lvl3;
                    gameState.createHealthBar(scene,tower,tower.currentLevel.health);
                } 
            },
            
            action: function(scene,building){
                var loop = scene.time.addEvent({
                    delay: 5000,
                    callback: ()=>{
                        if(building.health >0){
                            if(building.currentLevel.lvl == 1){
                                gameState.money += 10;
                            }else if(building.currentLevel.lvl == 2){
                                gameState.money += 20;
                            }else if(building.currentLevel.lvl == 3){
                                gameState.money += 30;
                            }
                            
                            gameState.updateMoney();
                        }
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: -1
                }); 
                var loop1 = scene.time.addEvent({
                    delay: 1,
                    callback: ()=>{
                        if(building.health <= 0){
                            gameState.createExplosion(scene,building.x,building.y);
                            building.destroy();
                            loop.destroy();
                            loop1.destroy();
                            building.destroyHB();
                        }else{
                            building.anims.play(`factory${building.currentLevel.lvl}Action`,true);
                        }
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: -1
                }); 
            }
        },
        //repairTowerStats
        {
            levels:{
                lvl1:{
                    lvl:1,
                    cost: 100,
                    damage: 0.1,
                    health: 80,
                    attackRange: 150,
                    attackSpeed: 10,
                    offsetx: 0,
                    offsety: 0,
                    width: 50,
                    height: 50,
                    name: 'Repair Tower I'
                },
                lvl2:{
                    lvl:2,
                    cost: 100,
                    damage: 0.15,
                    health: 85,
                    attackRange: 150,
                    attackSpeed: 10,
                    offsetx: 0,
                    offsety: 0,
                    width: 50,
                    height: 50,
                    name: 'Repair Tower II'
                },
                lvl3:{
                    lvl:3,
                    cost: 100,
                    damage: 0.2,
                    health: 90,
                    attackRange: 150,
                    attackSpeed: 125,
                    offsetx: 0,
                    offsety: 0,
                    width: 50,
                    height: 50,
                    name: 'RepairTower III'
                }
            },
            sprite: 'repairTower',
            attackType: 'heal',
            buildingType: 'tower',


            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'repairTower').setDepth(scene.input.y).setImmovable().setInteractive();
                tower.setFrame(1);
                tower.health = towerStats.levels.lvl1.health;
                tower.active = true;
                tower.towerStats = towerStats;
                tower.body.offset.x = towerStats.levels.lvl1.offsetx;
                tower.body.offset.y = towerStats.levels.lvl1.offsety;
                tower.body.width = towerStats.levels.lvl1.width;
                tower.body.height = towerStats.levels.lvl1.height;
                tower.currentLevel = towerStats.levels.lvl1;
                tower.on('pointerdown', function(pointer){
                    if(gameState.blueprint.active == false){
                        gameState.selected.setInfo(scene,tower);
                    }
                });
                gameState.createHealthBar(scene,tower,towerStats.levels.lvl1.health);
                towerStats.action(scene,tower);
            },
            upgradeTower: function(scene,tower){
               if(tower.currentLevel.lvl == 1 && gameState.money >= tower.towerStats.levels.lvl2.cost){
                   gameState.money -= tower.towerStats.levels.lvl2.cost;
                    tower.destroyHB();
                    tower.health = tower.towerStats.levels.lvl2.health;
                    tower.currentLevel = tower.towerStats.levels.lvl2;
                    gameState.createHealthBar(scene,tower,tower.currentLevel.health);
                    tower.attackLoop.delay = tower.currentLevel.attackSpeed;
                }else if(tower.currentLevel.lvl == 2 && gameState.money >= tower.towerStats.levels.lvl3.cost){
                    gameState.money -= tower.towerStats.levels.lvl3.cost;
                    tower.destroyHB();
                    tower.health = tower.towerStats.levels.lvl3.health;
                    tower.currentLevel = tower.towerStats.levels.lvl3;
                    gameState.createHealthBar(scene,tower,tower.currentLevel.health);
                    tower.attackLoop.delay = tower.currentLevel.attackSpeed;
                } 
            },
            findTarget: function(scene,building){
                var dist;
                var closest = 10000;
                var target = gameState.invisibleTarget;
                if(gameState.buildings.getChildren().length > 0){
                    for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                        dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], building);
                        if(dist<closest && gameState.buildings.getChildren()[i] !== building && gameState.buildings.getChildren()[i].health < gameState.buildings.getChildren()[i].currentLevel.health){
                            closest = dist;
                            target = gameState.buildings.getChildren()[i];
                        }
                    }
                }
                return target;
            },
            action: function(scene,building){
                var target = building.towerStats.findTarget(scene,building);
                var dist = Phaser.Math.Distance.BetweenPoints(target, building);
                building.attackLoop = scene.time.addEvent({
                    delay: building.currentLevel.attackSpeed,
                    callback: ()=>{
                        var bullet = gameState.bullets.create(building.x,building.y,'laser1');
                        gameState.angle=Phaser.Math.Angle.Between(building.x,building.y,target.x,target.y);
                        bullet.setRotation(gameState.angle); 
                        scene.physics.moveTo(bullet,target.x, target.y,600);
                        var bulletLoop = scene.time.addEvent({
                            delay: 8000,
                            callback: ()=>{
                                bullet.destroy();
                            },  
                            startAt: 0,
                            timeScale: 1
                        });
                        scene.physics.add.overlap(bullet, target,(bull, targ)=>{
                            bulletLoop.destroy();
                            bull.destroy();
                            targ.health += building.currentLevel.damage;
                        });
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: -1
                }); 
                building.attackLoop.paused = true;
                var bLoop = scene.time.addEvent({
                    delay: 1,
                    callback: ()=>{
                        if(building.health > 0){
                            if(building.active == true){
                                target = building.towerStats.findTarget(scene,building);
                                dist = Phaser.Math.Distance.BetweenPoints(target, building);
                                if(dist <= building.currentLevel.attackRange){
                                    if(target.x < building.x){
                                        building.flipX = true;
                                    }else {
                                        building.flipX = false;
                                    }
                                    building.anims.play(`repairTower${building.currentLevel.lvl}Action`,true);
                                    building.attackLoop.paused = false;
                                }
                                else {
                                    building.attackLoop.paused = true;
                                    building.anims.play(`repairTower${building.currentLevel.lvl}Idle`,true);
                                }
                            }
                        }
                        else {
                            gameState.createExplosion(scene,building.x,building.y);
                            bLoop.destroy();
                            building.attackLoop.destroy();
                            building.destroy(); 
                        }
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: -1
                });  
            }
        },
    ],
    
    
    sniperTowerStats:{
        cost: 100,
        damage: 50,
        health: 100,
        attackRange: 300,
        attackSpeed: 4000,
        spawnTower: function(scene){
            var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'sniperTower').setDepth(scene.input.y+20).setImmovable();
            tower.health = gameState.sniperTowerStats.health;
            tower.body.offset.y = 85;
            tower.body.height = 50;
            gameState.sniperTowerStats.action(scene,tower);
        },
        findTarget: function(scene,building){
            var dist;
            var closest = 10000;
            var target = gameState.invisibleTarget;
            if(gameState.zombies.getChildren().length > 0){
                for (var i = 0; i < gameState.zombies.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], building);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.zombies.getChildren()[i];
                    }
                }
            }
            return target;
        },
        action: function(scene,building){
            var target = gameState.sniperTowerStats.findTarget(scene,building);
            var dist = Phaser.Math.Distance.BetweenPoints(target, building);
            var loop = scene.time.addEvent({
                delay: gameState.sniperTowerStats.attackSpeed,
                callback: ()=>{
                    var bullet = gameState.bullets.create(building.x,building.y,'bullet');
                    gameState.angle=Phaser.Math.Angle.Between(building.x,building.y,target.x,target.y);
                    bullet.setRotation(gameState.angle); 
                    scene.physics.moveTo(bullet,target.x +(Math.random()*6-10),target.y +(Math.random()*6-10),800);
                    var bulletLoop = scene.time.addEvent({
                        delay: 8000,
                        callback: ()=>{
                            bullet.destroy();
                        },  
                        startAt: 0,
                        timeScale: 1
                    });
                    scene.physics.add.overlap(bullet, gameState.zombies,(bull, targ)=>{
                        bulletLoop.destroy();
                        bull.destroy();
                        targ.health -= gameState.sniperTowerStats.damage;
                    });
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loop.paused = true;
            var loop1 = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(building.health <=0){
                        gameState.createExplosion(scene,building.x,building.y);
                        building.destroy();
                        loop.destroy();
                        loop1.destroy();
                    }
                    else {
                        gameState.sniperTowerStats.findTarget(scene,building)
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(building.health > 0){
                        target = gameState.sniperTowerStats.findTarget(scene,building);
                        dist = Phaser.Math.Distance.BetweenPoints(target, building);
                        if(dist < gameState.sniperTowerStats.attackRange){
                            if(target.x < building.x){
                                building.flipX = true;
                            }else {
                                building.flipX = false;
                            }
                            building.anims.play('sniperTowerAction',true);
                            loop.paused = false;
                        }
                        else {
                            loop.paused = true;
                            building.anims.play('sniperTowerIdle',true);
                        }
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        loop1.destroy();
                        building.destroy(); 
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });  
        }
    },
    
    electroTowerStats:{
        cost: 300,
        damage: 25,
        health: 150,
        attackRange: 175,
        attackSpeed: 4000,
        spawnTower: function(scene){
            var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'electroTower').setDepth(scene.input.y).setImmovable();
            tower.body.offset.y = 30;
            tower.body.height = 40;
            tower.health = gameState.electroTowerStats.health;
            gameState.electroTowerStats.action(scene,tower);
        },
        
        createElectricWave: function(scene,x,y){
            var wave = scene.physics.add.sprite(x,y,`electricWave`);
            wave.anims.play('electricWaveAction',true);
            scene.time.addEvent({
                delay: 333,
                callback: ()=>{
                    wave.destroy();
                },  
                startAt: 0,
                timeScale: 1
            }); 
        },
        findTarget: function(scene,building){
            var dist;
            var closest = 10000;
            var target = gameState.invisibleTarget;
            if(gameState.zombies.getChildren().length > 0){
                for (var i = 0; i < gameState.zombies.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], building);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.zombies.getChildren()[i];
                    }
                }
            }
            return target;
        },
        action: function(scene,building){
            var target = gameState.electroTowerStats.findTarget(scene,building);
            var dist = Phaser.Math.Distance.BetweenPoints(target, building);
            var loop = scene.time.addEvent({
                delay: gameState.electroTowerStats.attackSpeed,
                callback: ()=>{
                    gameState.electroTowerStats.createElectricWave(scene,building.x,building.y);
                    var closest = 10000;
                    for (var i = 0; i < gameState.zombies.getChildren().length; i++){ 
                        dist = Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], building);
                        if(dist<gameState.electroTowerStats.attackRange){
                            gameState.zombies.getChildren()[i].health -= gameState.electroTowerStats.damage;
                        }
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            loop.paused = true;
            var loop1 = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(building.health <=0){
                        gameState.createExplosion(scene,building.x,building.y);
                        building.destroy();
                        loop.destroy();
                        loop1.destroy();
                    }
                    else {
                        gameState.electroTowerStats.findTarget(scene,building)
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(building.health > 0){
                        target = gameState.electroTowerStats.findTarget(scene,building);
                        dist = Phaser.Math.Distance.BetweenPoints(target, building);
                        if(dist < gameState.electroTowerStats.attackRange){
                            if(target.x < building.x){
                                building.flipX = true;
                            }else {
                                building.flipX = false;
                            }
                            building.anims.play('electroTowerAction',true);
                            loop.paused = false;
                        }
                        else {
                            loop.paused = true;
                            building.anims.play('electroTowerIdle',true);
                        }
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        loop1.destroy();
                        building.destroy(); 
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });  
        }
    },
    
    woodWallStats:{
        cost: 25,
        health: 50,
        count: 0,
        spawnTower: function(scene){
            var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'woodWall').setDepth(scene.input.y).setImmovable();
            tower.body.offset.y = 15;
            tower.body.height = 15;
            tower.health = gameState.woodWallStats.health;
            gameState.woodWallStats.action(scene,tower);
        },
        action: function(scene,building){
            var loop1 = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(building.health <=0){
                        gameState.createExplosion(scene,building.x,building.y);
                        building.destroy();
                        loop1.destroy();
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    
    barrackStats:{
        cost: 500,
        damage: 0,
        health: 500,
        attackRange: 0,
        guardCount: 3,
        guardRadius: 150,
        attackSpeed: 0,
        count: 0,
        spawnTower: function(scene){
            var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'barracks').setDepth(scene.input.y).setImmovable();
            tower.health = gameState.barrackStats.health;
            tower.guardCount = 0;
            gameState.barrackStats.action(scene,tower);
        },
        action: function(scene,building){
            building.anims.play('barracksAction',true);
            var loop = scene.time.addEvent({
                delay: 7500,
                callback: ()=>{
                    if(building.guardCount <gameState.barrackStats.guardCount){
                        building.guardCount += 1;
                        gameState.humanGuardStats.spawnHuman(scene,building.x+Math.random()*gameState.barrackStats.guardRadius*2-gameState.barrackStats.guardRadius,building.y+Math.random()*gameState.barrackStats.guardRadius*2-gameState.barrackStats.guardRadius,building);
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            var loop1 = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(building.health <=0){
                        gameState.createExplosion(scene,building.x,building.y);
                        building.destroy();
                        loop.destroy();
                        loop1.destroy();
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    humanGuardStats:{
        name: "Human Guard",
        speed: 30,
        health: 100,
        damage: 10,
        attackRange: 150,
        attackSpeed: 200,
        spawnHuman: function(scene,x,y,barracks){
            var human = gameState.buildings.create(x,y,`humanGuard`).setDepth(1);
            human.anims.play(`humanGuardSpawn`);
            scene.time.addEvent({
                delay: 1310,
                callback: ()=>{
                    gameState.humanGuardStats.behaviourLoop(scene,human,barracks);
                },  
                startAt: 0,
                timeScale: 1
            }); 
        },
        movement: function (scene,human,target,barracks){
            var x = barracks.x+Math.random()*gameState.barrackStats.guardRadius*2-gameState.barrackStats.guardRadius;
            var y = barracks.y+Math.random()*gameState.barrackStats.guardRadius*2-gameState.barrackStats.guardRadius;
            scene.physics.moveTo(human,x,y,gameState.humanGuardStats.speed);
            human.anims.play('humanGuardWalk',true);
            if(human.x < x){
                human.flipX = false;
            }
            else if(human.x > x){
                human.flipX = true;
            }
        },
        attack: function (scene, target,human){
            if(human.x < target){
                human.flipX = false;
            }
            else if(human.x > target){
                human.flipX = true;
            }
            var bullet = gameState.bullets.create(human.x,human.y,'bullet');
            gameState.angle=Phaser.Math.Angle.Between(human.x,human.y,target.x,target.y);
            bullet.setRotation(gameState.angle); 
            scene.physics.moveTo(bullet,target.x,target.y,300);
            var bulletLoop = scene.time.addEvent({
                delay: 10000,
                callback: ()=>{
                    bullet.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            scene.physics.add.overlap(bullet, gameState.zombies,(bull, targ)=>{
                bulletLoop.destroy();
                bull.destroy();
                targ.health -= gameState.humanGuardStats.damage;
            });
        },
        findTarget: function(scene,human){
            var dist;
            var closest = 10000;
            var target = gameState.invisibleTarget;
            if( gameState.zombies.getChildren().length >0){
                for (var i = 0; i < gameState.zombies.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], human);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.zombies.getChildren()[i];
                    }
                }
            }
            return target;
        },
        behaviourLoop: function (scene,human,barracks){
            human.anims.play(`humanGuardWalk`);
            human.health = gameState.humanGuardStats.health;
            var target = gameState.humanGuardStats.findTarget(scene,human);
            var dist = Phaser.Math.Distance.BetweenPoints(target, human);
            var loop = scene.time.addEvent({
                delay: gameState.humanGuardStats.attackSpeed,
                callback: ()=>{
                    gameState.humanGuardStats.attack(scene,target,human);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            var moveLoop = scene.time.addEvent({
                delay: 3000,
                callback: ()=>{
                    if(loop.paused == true){
                        gameState.humanGuardStats.movement(scene,human,target,barracks);
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat:-1
            }); 
            loop.paused = true;
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(barracks.health <= 0){
                        bLoop.destroy();
                        loop.destroy();
                        moveLoop.destroy();
                        human.anims.play('humanGuardDeath',true);
                        human.setVelocityX(0);
                        human.setVelocityY(0);
                        scene.time.addEvent({
                            delay: 400,
                            callback: ()=>{
                            human.destroy(); 
                            },  
                            startAt: 0,
                            timeScale: 1
                        }); 
                    }
                    if(human.health > 0){
                        human.depth = human.y;
                        target = gameState.humanGuardStats.findTarget(scene,human);
                        dist = Phaser.Math.Distance.BetweenPoints(target, human);
                        if(dist < gameState.humanGuardStats.attackRange){
                            human.setVelocityX(0);
                            human.setVelocityY(0);
                            loop.paused = false;
                            human.anims.play('humanGuardAction',true);
                        }
                        else {
                            loop.paused = true;
                        }
                    }
                    else {
                        barracks.guardCount -= 1;
                        bLoop.destroy();
                        loop.destroy();
                        moveLoop.destroy();
                        human.anims.play('humanGuardDeath',true);
                        human.setVelocityX(0);
                        human.setVelocityY(0);
                        scene.time.addEvent({
                            delay: 400,
                            callback: ()=>{
                            human.destroy(); 
                            },  
                            startAt: 0,
                            timeScale: 1
                        }); 
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    
    
    alienTowerStats:{
        cost: 1500,
        damage: 0,
        health: 450,
        attackRange: 300,
        attackSpeed: 1,
        spawnTower: function(scene){
            var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'alienTower').setDepth(scene.input.y).setImmovable();
            tower.health = gameState.alienTowerStats.health;
            gameState.alienTowerStats.action(scene,tower);
        },
        action: function(scene,tower){
            gameState.ufoStats.spawnUfo(scene,tower.x,tower.y,tower);
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(tower.health > 0){
                        
                    }
                    else {
                        gameState.createExplosion(scene,tower.x,tower.y);
                        tower.destroy();
                        bLoop.destroy();
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            });  
        }
    },
    ufoStats:{
        name: "Ufo",
        speed: 0,
        health: 0,
        damage: 4,
        attackRange: 0,
        attackSpeed: 25,
        spawnUfo: function(scene,x,y,tower){
            var ufo = scene.physics.add.sprite(x,y,'ufo').setDepth(window.innerHeight+1);
            ufo.anims.play('ufoActive',true);
            gameState.ufoStats.behaviourLoop(scene,ufo,tower);
        },
        movement: function (scene,ufo,target,trueTarget){
            scene.physics.moveToObject(ufo, trueTarget, 0, 1000);
        },
        attack: function (scene, target,ufo){
            var bullet = gameState.bullets.create(ufo.x,ufo.y,'ufoLaser');
            gameState.angle=Phaser.Math.Angle.Between(ufo.x,ufo.y,target.x,target.y);
            bullet.setRotation(gameState.angle); 
            scene.physics.moveToObject(bullet,target,2000,250);
            var bulletLoop = scene.time.addEvent({
                delay: 250,
                callback: ()=>{
                    bullet.destroy();
                },  
                startAt: 0,
                timeScale: 1
            });
            scene.physics.add.overlap(bullet, target,(bull, targ)=>{
                bulletLoop.destroy();
                bull.destroy();
                targ.health -= gameState.ufoStats.damage;
            });
        },
        findTarget: function(scene,tower){
            var dist;
            var closest = 10000;
            var target = gameState.invisibleTarget;
            if( gameState.zombies.getChildren().length >0){
                for (var i = 0; i < gameState.zombies.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], tower);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.zombies.getChildren()[i];
                    }
                }
            }
            return target;
        },
        behaviourLoop: function (scene,ufo,tower){
            var trueTarget = scene.add.sprite(0,0,'nothing');
            var target = gameState.ufoStats.findTarget(scene,tower);
            var dist = Phaser.Math.Distance.BetweenPoints(target, ufo);
            var loop = scene.time.addEvent({
                delay: gameState.ufoStats.attackSpeed,
                callback: ()=>{
                    gameState.ufoStats.attack(scene,target,ufo);
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
            var moveLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(loop.paused == true){
                        gameState.ufoStats.movement(scene,ufo,target,trueTarget);
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat:-1
            }); 
            loop.paused = true;
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(tower.health <= 0){
                        bLoop.destroy();
                        loop.destroy();
                        moveLoop.destroy();
                        gameState.createExplosion(scene,ufo.x,ufo.y);
                        ufo.destroy();
                    }
                    if(tower.health > 0){
                        target = gameState.ufoStats.findTarget(scene,tower);
                        dist = Phaser.Math.Distance.BetweenPoints(target, ufo);
                        if(dist < gameState.alienTowerStats.attackRange){
                            trueTarget.x = target.x;
                            trueTarget.y = target.y -100;
                            scene.physics.moveToObject(ufo, trueTarget, 0, 1000);
                            loop.paused = false;
                        }
                        else {
                            trueTarget.x = tower.x;
                            trueTarget.y = tower.y -50;
                            loop.paused = true;
                        }
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    
    
    createHealthBar: function(scene, object,maxHP){
        object.hbBG = scene.add.rectangle(object.x,(object.y-object.body.height/2)-20,100,10,0xff0000).setScale(object.body.width/100).setDepth(window.innerHeight);  
        object.hb = scene.add.rectangle(object.x,(object.y-object.body.height/2)-20,100,10,0x2ecc71).setScale(object.body.width/100).setDepth(window.innerHeight);
        object.checkHealth = scene.time.addEvent({
            delay: 1,
            callback: ()=>{
                
                if(object.health > 0){
                    object.hbBG.x = object.x;
                    object.hbBG.y = (object.y-object.body.height/2)-10;
                    object.hb.x = object.x;
                    object.hb.y = (object.y-object.body.height/2)-10;
                    object.hb.width = object.health/maxHP*100;
                } else {
                    object.hbBG.destroy();
                    object.hb.destroy();
                    object.checkHealth.destroy();
                }
                if(object.health == maxHP){
                    object.hb.visible = false;
                    object.hbBG.visible = false;
                }else{
                    object.hb.visible = true;
                    object.hbBG.visible = true;
                }
                if(object.health > maxHP){
                    object.health = maxHP;
                }
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        });
        object.destroyHB = function(){
            object.hbBG.destroy();
            object.hb.destroy();
            object.checkHealth.destroy();
        }
    },
}

let save = gameState