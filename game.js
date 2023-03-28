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
    money : 250,
    wave: 0,
    characterStats: {
        speed : 100,
        health: 100
    },
    invisibleTarget : null,
    
    thingsToSave:{
        trophys:{
            overWorld: false,
            hellWorld:false,
            spaceWorld:false,
            aquaWorld:false
        },
    },
    save: function(){
        window.localStorage.setItem("thingsToSave", JSON.stringify(gameState.thingsToSave));
    },
    //loads variable values from localstorage
    loadSave: function(){
        if(JSON.parse(window.localStorage.getItem("thingsToSave")) !== null){
            gameState.thingsToSave = JSON.parse(window.localStorage.getItem("thingsToSave"));
        }
    },
    
    
    createBackground : function (scene){
        var num = Math.ceil(Math.random ()*3);
        if(gameState.thingsToSave.trophys.overWorld == false){
            scene.add.image(0,0, 'grassFieldBackground').setOrigin(0,0).setScale(1);
        }
        else if(gameState.thingsToSave.trophys.hellWorld == false){
            scene.add.image(0,0, 'canyonBackground').setOrigin(0,0).setScale(1);
        }
        else if(gameState.thingsToSave.trophys.spaceWorld == false){
            scene.add.image(0,0, 'caveBackground').setOrigin(0,0).setScale(1);
        }
        else if(gameState.thingsToSave.trophys.aquaWorld == false){
            scene.add.image(0,0, 'caveBackground').setOrigin(0,0).setScale(1);
        }
    },
    
    
    updateMoney:function(){
        gameState.moneyText.setText(`${gameState.money}`);
    },
    
    createIcons: function (scene){
        scene.add.image(1050,10,'moneySign').setOrigin(0,0).setDepth(window.innerHeight+3);
        gameState.moneyText = scene.add.text(1100, 5, `${gameState.money}`, {
            fill: '#OOOOOO', 
            fontSize: '30px',
            fontFamily: 'Qahiri',
            strokeThickness: 10,
        }).setDepth(window.innerHeight+3);
        scene.add.image(900,10,'waveSign').setOrigin(0,0).setDepth(window.innerHeight+3);
        gameState.waveText = scene.add.text(950, 5, `${gameState.wave}`, {
            fill: '#OOOOOO', 
            fontSize: '30px',
            fontFamily: 'Qahiri',
            strokeThickness: 10,
        }).setDepth(window.innerHeight+3);
        var button = scene.add.image(10,10,'pauseSign').setOrigin(0,0).setDepth(window.innerHeight+3).setInteractive();
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
            gameState.blueprint.check.destroy();
        },
        create: function(scene,towerStats){
            gameState.selected.select = null;
            gameState.blueprint.active = true;
            gameState.blueprintSprite = scene.physics.add.sprite(600,335,`${towerStats.sprite}`).setInteractive().setDepth(10000);
            scene.input.setDraggable(gameState.blueprintSprite);
            scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
                gameObject.x = dragX;
                gameObject.y = dragY;
            });
            gameState.blueprintSprite.body.offset.x = towerStats.levels.lvl1.offsetx;
            gameState.blueprintSprite.body.offset.y = towerStats.levels.lvl1.offsety;
            gameState.blueprintSprite.body.width = towerStats.levels.lvl1.width;
            gameState.blueprintSprite.body.height = towerStats.levels.lvl1.height;
            gameState.blueprint.building = towerStats;
            gameState.blueprint.button = gameState.blueprintSprite.on('pointerdown', function(pointer){
                
            });
            var confirmButton = gameState.buildScene.add.image(1050,615,`confirmButton`).setInteractive().setDepth(100);
            confirmButton.on('pointerdown', function(pointer){
                if(gameState.money >= towerStats.levels.lvl1.cost && gameState.blueprint.overLap >5){
                    gameState.money -= towerStats.levels.lvl1.cost;
                    towerStats.spawnTower                                                               (gameState.globalScene,towerStats);
                    gameState.updateMoney();
                    confirmButton.destroy();
                    cancelButton.destroy();
                    gameState.blueprint.toggleOff(gameState.blueprintSprite);
                    gameState.blueprintOverlapCheck.destroy();
                    gameState.blueprintOverlapCheck1.destroy();
                }
            });
            var cancelButton = gameState.buildScene.add.image(1100,615,`cancelButton`).setInteractive().setDepth(100);
            cancelButton.on('pointerdown', function(pointer){
                confirmButton.destroy();
                cancelButton.destroy();
                gameState.blueprint.toggleOff(gameState.blueprintSprite);
                gameState.blueprintOverlapCheck.destroy();
                gameState.blueprintOverlapCheck1.destroy();
            });
                             
            gameState.blueprintOverlapCheck = scene.physics.add.overlap(gameState.blueprintSprite, gameState.buildings,()=>{
                gameState.blueprint.overLap = 0;
            });
            gameState.blueprintOverlapCheck1 = scene.physics.add.overlap(gameState.blueprintSprite, gameState.zombies,()=>{
                gameState.blueprint.overLap = 0;
            });
            gameState.blueprint.check = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(gameState.blueprint.overLap < 5){
                        gameState.blueprintSprite.setTint(0xFF0000, 0xFF0000, 0xFF0000, 0xFF0000);
                    }else{
                        gameState.blueprintSprite.setTint(0xFFFFFF , 0xFFFFFF , 0xFFFFFF , 0xFFFFFF );
                    }       
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        },
        checkControls: function (scene){
            if(gameState.blueprint.active == true){
                gameState.blueprint.overLap += 1;
                /*gameState.blueprintSprite.x = scene.input.x;
                gameState.blueprintSprite.y = scene.input.y;*/
            }
            if(gameState.keys.ESC.isDown && gameState.blueprint.active == true){
                gameState.blueprint.toggleOff(gameState.blueprintSprite);
                gameState.blueprintOverlapCheck.destroy();
                gameState.blueprintOverlapCheck1.destroy();
            }
            if(gameState.keys.ESC.isDown){
                gameState.selected.select = null;
            }
            else if(gameState.keys.ONE.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(gameState.arena,gameState.gameTowers[0],);
            }
            else if(gameState.keys.TWO.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(gameState.arena,gameState.gameTowers[1],);
            }
            else if(gameState.keys.THREE.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(gameState.arena,gameState.gameTowers[2],);
            }
            else if(gameState.keys.FOUR.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(gameState.arena,gameState.gameTowers[3],);
            }
            else if(gameState.keys.FIVE.isDown && gameState.blueprint.active == false){
                gameState.blueprint.create(gameState.arena,gameState.gameTowers[4],);
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
            var upgradeButton = scene.add.sprite(1070,615,'upgradeTowerIcon').setInteractive();
            upgradeButton.on('pointerdown', function(pointer){
                gameState.selected.select.towerStats.upgradeTower(scene,gameState.selected.select);
            });
            var cancelButton = gameState.buildScene.add.image(1150,615,`cancelButton`).setInteractive().setDepth(100);
            cancelButton.on('pointerdown', function(pointer){
                gameState.selected.select = null;
            });
            scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(gameState.blueprint.active == true){
                        text.setText(`${gameState.blueprint.building.levels.lvl1.name}  $${gameState.blueprint.building.levels.lvl1.cost}`);
                        upgradeButton.visible = false;
                        cancelButton.visible = false;
                        icon.setTexture('BLANK');
                    }
                    else if(gameState.selected.select !== null && gameState.selected.select.health > 0){
                        var cost;
                        if(gameState.selected.select.currentLevel.lvl == 1 && gameState.selected.select.towerStats.levels.lvl2.cost){
                           cost = gameState.selected.select.towerStats.levels.lvl2.cost;
                        }else if(gameState.selected.select.currentLevel.lvl == 2 && gameState.selected.select.towerStats.levels.lvl3.cost){
                            cost = gameState.selected.select.towerStats.levels.lvl3.cost;
                        }else{
                            cost = 'MAX';
                        }
                        if(gameState.selected.select.towerStats.buildingType == 'main'){
                            cost = 'MAX';
                        }
                        text.setText(`${gameState.selected.select.currentLevel.name}         ${Math.floor(gameState.selected.select.health)}/${gameState.selected.select.currentLevel.health}          Upgrade Cost : ${cost}`);
                        icon.setTexture(`${gameState.selected.select.towerStats.sprite}`);
                        if(gameState.selected.select.currentLevel.width > gameState.selected.select.currentLevel.height){
                            icon.scale = 50/gameState.selected.select.currentLevel.width;
                        }else{
                            icon.scale = 50/gameState.selected.select.currentLevel.height;  
                        }
                        icon.setFrame(1);
                        if(gameState.selected.select.towerStats.buildingType !== 'main'){
                            upgradeButton.visible = true;
                        }
                        cancelButton.visible = true;
                    }else{
                        text.setText('');
                        icon.setTexture('BLANK');
                        upgradeButton.visible = false;
                        cancelButton.visible = false;
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
                    delay: 40000,
                    callback: ()=>{
                        gameState.wave += 1;
                        gameState.waveText.setText(`${gameState.wave}`);
                        if(gameState.thingsToSave.trophys.overWorld == false){
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
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 29
                                }); 
                            }else if(gameState.wave == 7){
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 9
                                }); 
                            }else if(gameState.wave == 8){
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 9
                                }); 
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 4
                                }); 
                            }
                            else if(gameState.wave == 9){
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 4
                                }); 
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 9
                                }); 
                            }
                            else if(gameState.wave == 10){
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 19
                                }); 
                            }else if(gameState.wave == 11){
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 49
                                }); 
                            }else if(gameState.wave == 12){
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 24
                                }); 
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 14
                                });
                            }else if(gameState.wave == 13){
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieGiantStats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 9
                                }); 
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 4
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
                            }else if(gameState.wave == 16){
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieGiantStats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 19
                                }); 
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieMuskateerStats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 19
                                });
                            }else if(gameState.wave == 17){
                                scene.time.addEvent({
                                    delay: 50,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieDogStats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 19
                                }); 
                                scene.time.addEvent({
                                    delay: 1000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 19
                                });
                            }else if(gameState.wave == 18){
                                scene.time.addEvent({
                                    delay: 30,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieDogStats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 39
                                });
                            }else if(gameState.wave == 19){
                                scene.time.addEvent({
                                    delay: 10,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieDogStats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 49
                                }); 
                                scene.time.addEvent({
                                    delay: 50,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieBomberStats,1);
                                    },  
                                    startAt: 0,
                                    timeScale: 1,
                                    repeat: 4
                                });
                            }else if(gameState.wave == 20){
                                scene.time.addEvent({
                                    delay: 10,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombie1Stats,100);
                                    },  
                                    startAt: 0,
                                    timeScale: 1
                                }); 
                            }else if(gameState.wave == 21){
                                scene.time.addEvent({
                                    delay: 10,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieGiantStats,50);
                                    },  
                                    startAt: 0,
                                    timeScale: 1
                                }); 
                            }
                            else if(gameState.wave == 22){
                                gameState.spawnZombies(scene,gameState.zombieBomberStats,10);
                                gameState.spawnZombies(scene,gameState.zombie1Stats,30);
                                gameState.spawnZombies(scene,gameState.zombieGiantStats,20);
                            }
                            else if(gameState.wave == 23){
                                gameState.spawnZombies(scene,gameState.zombieMuskateerStats,20);
                                gameState.spawnZombies(scene,gameState.zombieGiantStats,30);
                            }
                            else if(gameState.wave == 24){
                                gameState.spawnZombies(scene,gameState.zombieMuskateerStats,10);
                                gameState.spawnZombies(scene,gameState.zombieGiantStats,10);
                                gameState.spawnZombies(scene,gameState.zombie1Stats,10);
                                gameState.spawnZombies(scene,gameState.zombieDogStats,10);
                                gameState.spawnZombies(scene,gameState.zombieBomberStats,10);
                            }else if(gameState.wave == 25){
                                gameState.spawnZombies(scene,gameState.zombieWizardStats,1);
                            }else if(gameState.wave == 26){
                                gameState.spawnZombies(scene,gameState.zombie1Stats,80);
                                gameState.spawnZombies(scene,gameState.zombieGiantStats,10);
                            }else if(gameState.wave == 27){
                                gameState.spawnZombies(scene,gameState.zombieBomberStats,30);
                            }else if(gameState.wave == 28){
                                gameState.spawnZombies(scene,gameState.zombie1Stats,30);
                            }else if(gameState.wave == 29){
                                gameState.spawnZombies(scene,gameState.zombieGiantStats,10);
                            }else if(gameState.wave == 30){
                                gameState.spawnZombies(scene,gameState.zombieWizardStats,3);
                            }else if(gameState.wave == 31){
                                gameState.spawnZombies(scene,gameState.zombieDogStats,20);
                            }else if(gameState.wave == 32){
                                gameState.spawnZombies(scene,gameState.zombieDogStats,150);
                            }else if(gameState.wave == 33){
                                gameState.spawnZombies(scene,gameState.zombieGiantStats,15);
                                gameState.spawnZombies(scene,gameState.zombieMuskateerStats,15);
                                gameState.spawnZombies(scene,gameState.zombieBomberStats,5);
                            }else if(gameState.wave == 34){
                                gameState.spawnZombies(scene,gameState.zombieGiantStats,30);
                            }else if(gameState.wave == 35){
                                gameState.spawnZombies(scene,gameState.zombieWizardStats,2);
                                gameState.spawnZombies(scene,gameState.zombie1Stats,50);
                            }else if(gameState.wave == 36){
                                gameState.spawnZombies(scene,gameState.zombieWizardStats,2);
                                gameState.spawnZombies(scene,gameState.zombie1Stats,50);
                            }else if(gameState.wave == 37){
                                gameState.spawnZombies(scene,gameState.zombie1Stats,1);
                            }else if(gameState.wave == 38){
                                gameState.spawnZombies(scene,gameState.zombieGiantStats,1);
                            }else if(gameState.wave == 39){
                                gameState.spawnZombies(scene,gameState.zombieDogStats,1);
                            }else if(gameState.wave == 40){
                                gameState.spawnZombies(scene,gameState.zombieWizardStats,7);
                            }else if(gameState.wave == 41){
                                gameState.spawnZombies(scene,gameState.zombie1Stats,20);
                                gameState.spawnZombies(scene,gameState.zombieDogStats,20);
                            }else if(gameState.wave == 42){
                                gameState.spawnZombies(scene,gameState.zombie1Stats,20);
                                gameState.spawnZombies(scene,gameState.zombieGiantStats,10);
                            }else if(gameState.wave == 43){
                                gameState.spawnZombies(scene,gameState.zombieBomberStats,20);
                                gameState.spawnZombies(scene,gameState.zombieWizardStats,1);
                            }else if(gameState.wave == 44){
                                gameState.spawnZombies(scene,gameState.zombie1Stats,5);
                            }else if(gameState.wave == 45){
                                gameState.spawnZombies(scene,gameState.zombie1Stats,250);
                                gameState.spawnZombies(scene,gameState.zombie1Stats,250);
                            }else if(gameState.wave == 46){
                                gameState.spawnZombies(scene,gameState.zombieGiantStats,10);
                                gameState.spawnZombies(scene,gameState.zombie1Stats,10);
                                gameState.spawnZombies(scene,gameState.zombieMuskateerStats,40);
                            }else if(gameState.wave == 47){
                                gameState.spawnZombies(scene,gameState.zombieGiantStats,5);
                                gameState.spawnZombies(scene,gameState.zombieMuskateerStats,20);
                            }else if(gameState.wave == 48){
                                gameState.spawnZombies(scene,gameState.zombieDogStats,15);
                                gameState.spawnZombies(scene,gameState.zombieMuskateerStats,5);
                                gameState.spawnZombies(scene,gameState.zombieWizardStats,2);
                            }else if(gameState.wave == 49){
                                gameState.spawnZombies(scene,gameState.zombieDogStats,5);
                                gameState.spawnZombies(scene,gameState.zombieMuskateerStats,5);
                                gameState.spawnZombies(scene,gameState.zombie1Stats,5);
                                gameState.spawnZombies(scene,gameState.zombieBomberStats,5);
                            }else if(gameState.wave == 50){
                                gameState.spawnZombies(scene,gameState.zombieKingStats,1);
                                scene.time.addEvent({
                                    delay: 10000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieWizardStats,3);
                                    },  
                                    startAt: 0,
                                    timeScale: 1
                                });
                                scene.time.addEvent({
                                    delay: 25000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieBomberStats,10);
                                        gameState.spawnZombies(scene,gameState.zombieDogStats,20);
                                    },  
                                    startAt: 0,
                                    timeScale: 1
                                });
                                scene.time.addEvent({
                                    delay: 40000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombie1Stats,100);
                                    },  
                                    startAt: 0,
                                    timeScale: 1
                                });
                                scene.time.addEvent({
                                    delay: 55000,
                                    callback: ()=>{
                                        gameState.spawnZombies(scene,gameState.zombieGiantStats,20);
                                        gameState.spawnZombies(scene,gameState.zombieMuskateerStats,20);
                                    },  
                                    startAt: 0,
                                    timeScale: 1
                                });
                            }
                            else if(gameState.wave == 51){
                                gameState.wave = 50;
                            }
                        }
                        else if(gameState.thingsToSave.trophys.hellWorld == false){
                            if(gameState.wave == 1){
                                gameState.spawnZombies(scene, gameState.demonZombie1Stats,5);
                            }else{
                                gameState.spawnZombies(scene, gameState.demonZombie1Stats,10);
                            }
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
            target.health -= gameState.zombie1Stats.damage;
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
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
            zombie.health = gameState.zombie1Stats.health;
            gameState.createHealthBar(scene,zombie,gameState.zombie1Stats.health);
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
            target.health -= gameState.zombieGiantStats.damage;
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
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
        speed: 60,
        health: 50,
        damage: 85,
        attackRange: 30,
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
            
            zombie.health = 0;
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
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
        speed: 5,
        health: 10,
        damage: 500,
        attackRange: 30,
        attackSpeed: 3000,
        spawnZombie: function(scene,x,y){
            var zombie = gameState.zombies.create(x,y,`zombieKing`).setDepth(0);
            zombie.setDepth(zombie.y);
            zombie.body.offset.y = 100;
            zombie.body.height = 100;
            zombie.anims.play(`zombieKingSpawn`);
            zombie.health = gameState.zombieKingStats.health;
            gameState.createHealthBar(scene,zombie,gameState.zombieKingStats.health)
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
            target.health -= gameState.zombieKingStats.damage;
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
            
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
                                var trophy = scene.physics.add.sprite(zombie.x,zombie.y,'overWorldTrophy').setInteractive().setDepth(10000);
                                trophy.touched = 0;
                                trophy.anims.play('overWorldTrophyA',true);
                                trophy.b = trophy.on('pointerdown', function(pointer){
                                    if(trophy.touched == 0){
                                        scene.scene.stop('BuildScene');
                                        trophy.touched = 1;
                                        var obj = scene.physics.add.sprite(600,337,'BLANK');
                                        scene.physics.moveToObject(trophy,obj,null,3000);
                                         scene.time.addEvent({
                                            delay: 2999,
                                            callback: ()=>{
                                                trophy.body.velocity.x = 0;
                                                trophy.body.velocity.y = 0;
                                            },  
                                            startAt: 0,
                                            timeScale: 1
                                        }); 
                                        trophy.b1 = scene.time.addEvent({
                                            delay: 1,
                                            callback: ()=>{
                                                trophy.scale += 0.01
                                            },  
                                            startAt: 0,
                                            timeScale: 1,
                                            repeat: -1
                                        }); 
                                        trophy.b2 = scene.time.addEvent({
                                            delay: 8000,
                                            callback: ()=>{
                                                trophy.b1.destroy();
                                                scene.scene.start('MenuScene');
                                                gameState.thingsToSave.trophys.overWorld = true;
                                                gameState.save();
                                            },  
                                            startAt: 0,
                                            timeScale: 1
                                        }); 
                                    }
                                });
                                //TROPHYHERE
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
        speed: 20,
        health: 800,
        damage: 20,
        attackRange: 200,
        attackSpeed: 2000,
        spawnZombie: function(scene,x,y){
            var zombie = gameState.zombies.create(Math.random()*11,Math.random()*window.innerHeight-32,`zombieWizard`).setDepth(1);
            zombie.anims.play(`zombieWizardSpawn`);
            zombie.health = gameState.zombieWizardStats.health;
            gameState.createHealthBar(scene,zombie,gameState.zombieWizardStats.health)
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
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
            var target = gameState.zombieWizardStats.findTarget(scene,zombie);
            var dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
            var spawnLoop = scene.time.addEvent({
                delay: 15000,
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
            var bullet = gameState.bullets.create(zombie.x,zombie.y,'bullet').setDepth(1000);
            gameState.angle=Phaser.Math.Angle.Between(zombie.x,zombie.y,target.x,target.y);
            bullet.setRotation(gameState.angle); 
            scene.physics.moveToObject(bullet,target,null,500);
            var bulletLoop = scene.time.addEvent({
                delay: 500,
                callback: ()=>{
                    bullet.destroy();
                    target.health -= gameState.zombieMuskateerStats.damage;
                },  
                startAt: 0,
                timeScale: 1
            });
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
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
        damage: 5,
        attackRange: 20,
        attackSpeed: 300,
        spawnZombie: function(scene,x,y){
            var zombie = gameState.zombies.create(x,y,`zombieDog`).setDepth(1);
            zombie.anims.play(`zombieDogSpawn`);
            zombie.health = gameState.zombieDogStats.health;
            gameState.createHealthBar(scene,zombie,gameState.zombieDogStats.health);
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
            target.health -= gameState.zombieDogStats.damage;
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
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

    
    
    demonZombie1Stats:{
        name: "Zombie Demon",
        speed: 25,
        health: 80,
        damage: 5,
        attackRange: 20,
        attackSpeed: 1000,
        spawnZombie: function(scene,x,y){
            var zombie = gameState.zombies.create(x,y,`demonZombie1`).setDepth(1);
            zombie.anims.play(`demonZombie1Spawn`);
            zombie.health = gameState.demonZombie1Stats.health;
            gameState.createHealthBar(scene,zombie,gameState.demonZombie1Stats.health);
            scene.time.addEvent({
                delay: 1310,
                callback: ()=>{
                    gameState.demonZombie1Stats.behaviourLoop(scene,zombie);
                },  
                startAt: 0,
                timeScale: 1
            }); 
        },
        movement: function (scene,zombie,target){
            scene.physics.moveTo(zombie,target.x, target.y,gameState.demonZombie1Stats.speed);
            zombie.anims.play('demonZombie1Walk',true);
            if(target.x > zombie.x){
                zombie.flipX = false;
            }
            else if(target.x < zombie.x){
                zombie.flipX = true;
            }
        },
        attack: function (scene, target){
            target.health -= gameState.demonZombie1Stats.damage;
        },
        findTarget: function(scene,zombie){
            var dist;
            var closest = 10000;
            var target;
            if( gameState.buildings.getChildren().length >0){
                for (var i = 0; i < gameState.buildings.getChildren().length; i++){ 
                    dist = Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], zombie);
                    if(dist<closest){
                        closest = dist;
                        target = gameState.buildings.getChildren()[i];
                    }
                }
            }
            return target;
        },
        behaviourLoop: function (scene,zombie){
            var target = gameState.demonZombie1Stats.findTarget(scene,zombie);
            var dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
            var loop = scene.time.addEvent({
                delay: gameState.demonZombie1Stats.attackSpeed,
                callback: ()=>{
                    gameState.demonZombie1Stats.attack(scene,target);
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
                        target = gameState.demonZombie1Stats.findTarget(scene,zombie);
                        dist = Phaser.Math.Distance.BetweenPoints(target, zombie);
                        if(dist < gameState.demonZombie1Stats.attackRange){
                            zombie.setVelocityX(0);
                            zombie.setVelocityY(0);
                            loop.paused = false;
                        }
                        else {
                            loop.paused = true;
                            gameState.demonZombie1Stats.movement(scene,zombie,target);
                        }
                    }
                    else {
                        bLoop.destroy();
                        loop.destroy();
                        zombie.anims.play('demonZombie1Death',true);
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
                    offsety: 40,
                    width: 60,
                    height: 30,
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
                    offsety: 40,
                    width: 60,
                    height: 30,
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
                    offsety: 40,
                    width: 60,
                    height: 30,
                    name: 'MachineGunTower III'
                }
            },
            sprite: 'machineGunTower',
            attackType: 'normal',
            buildingType: 'tower',


            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'machineGunTower').setDepth(gameState.blueprintSprite.y).setImmovable().setInteractive();
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
                    cost: 10,
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
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'woodWall').setDepth(gameState.blueprintSprite.y).setImmovable().setInteractive();
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
                    cost: 200,
                    damage: 0,
                    health: 300,
                    attackRange: 0,
                    attackSpeed: 0,
                    offsetx: 0,
                    offsety: 0,
                    width: 50,
                    height: 50,
                    production: 5,
                    name: 'Factory I'
                },
                lvl2:{
                    lvl: 2,
                    cost: 1000,
                    damage: 0,
                    health: 325,
                    attackRange: 0,
                    attackSpeed: 0,
                    offsetx: 0,
                    offsety: 0,
                    width: 50,
                    height: 50,
                    production: 15,
                    name: 'Factory II'
                },
                lvl3:{
                    lvl: 3,
                    cost: 5000,
                    damage: 0,
                    health: 350,
                    attackRange: 0,
                    attackSpeed: 0,
                    offsetx: 0,
                    offsety: 0,
                    width: 50,
                    height: 50,
                    production: 50,
                    name: 'Factory III'
                }
            },
            sprite: 'factory',
            attackType: 'none',
            buildingType: 'producer',
            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'factory').setDepth(gameState.blueprintSprite.y).setImmovable().setInteractive();
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
                            gameState.money += building.currentLevel.production;
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
                    offsety: 20,
                    width: 50,
                    height: 30,
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
                    offsety: 20,
                    width: 50,
                    height: 30,
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
                    offsety: 20,
                    width: 50,
                    height: 30,
                    name: 'RepairTower III'
                }
            },
            sprite: 'repairTower',
            attackType: 'heal',
            buildingType: 'tower',


            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'repairTower').setDepth(gameState.blueprintSprite.y).setImmovable().setInteractive();
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
                        if(gameState.buildings.getChildren()[i].buildingType !== "troop"){
                            if(dist<closest && gameState.buildings.getChildren()[i] !== building && gameState.buildings.getChildren()[i].health < gameState.buildings.getChildren()[i].currentLevel.health){
                                closest = dist;

                                    target = gameState.buildings.getChildren()[i];

                            }
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
                        var bullet = gameState.bullets.create(building.x,building.y,'laser1').setDepth(target.y);
                        gameState.angle=Phaser.Math.Angle.Between(building.x,building.y,target.x,target.y);
                        bullet.setRotation(gameState.angle); 
                        scene.physics.moveToObject(bullet,target,null,400);
                        var bulletLoop = scene.time.addEvent({
                            delay: 400,
                            callback: ()=>{
                                bullet.destroy();
                                target.health += building.currentLevel.damage;
                            },  
                            startAt: 0,
                            timeScale: 1
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
        //FlameThrowerTowerStats
        {
            levels:{
                lvl1:{
                    lvl:1,
                    cost: 100,
                    damage: 0.08,
                    health: 80,
                    attackRange: 100,
                    attackSpeed: 100,
                    offsetx: 0,
                    offsety: 50,
                    width: 80,
                    height: 30,
                    name: 'FlameThrowerTower I'
                },
                lvl2:{
                    lvl:2,
                    cost: 150,
                    damage: 0.1,
                    health: 120,
                    attackRange: 100,
                    attackSpeed: 100,
                    offsetx: 0,
                    offsety: 50,
                    width: 80,
                    height: 30,
                    name: 'FlameThrowerTower II'
                },
                lvl3:{
                    lvl:3,
                    cost: 300,
                    damage: 0.13,
                    health: 160,
                    attackRange: 100,
                    attackSpeed: 100,
                    offsetx: 0,
                    offsety: 50,
                    width: 80,
                    height: 30,
                    name: 'FlameThrowerTower III'
                }
            },
            sprite: 'flameThrowerTower',
            attackType: 'normal',
            buildingType: 'tower',


            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'flameThrowerTower').setDepth(gameState.blueprintSprite.y).setImmovable().setInteractive();
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
                gameState.gameTowers[4].action(scene,tower);
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
                        var bullet = gameState.bullets.create(building.x,building.y,'flame1');
                        gameState.angle=Phaser.Math.Angle.Between(building.x,building.y,target.x,target.y);
                        bullet.setRotation(gameState.angle); 
                        scene.physics.moveTo(bullet,target.x,target.y,100);
                        var bulletGrow = scene.time.addEvent({
                            delay: 10,
                            callback: ()=>{
                                bullet.scale += 0.05;
                            },  
                            startAt: 0,
                            timeScale: 1,
                            repeat: -1,
                        });
                        var bulletLoop = scene.time.addEvent({
                            delay: 1000,
                            callback: ()=>{
                                bullet.destroy();
                                bulletGrow.destroy();
                            },  
                            startAt: 0,
                            timeScale: 1
                        });
                        scene.physics.add.overlap(bullet, gameState.zombies,(bull, targ)=>{
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
                                    building.anims.play(`flameThrowerTower${building.currentLevel.lvl}Action`,true);
                                    building.attackLoop.paused = false;
                                }
                                else {
                                    building.attackLoop.paused = true;
                                    building.anims.play(`flameThrowerTower${building.currentLevel.lvl}Idle`,true);
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
        //BarracksTowerStats
        {
            levels:{
                lvl1:{
                    lvl: 1,
                    cost: 250,
                    damage: 0,
                    health: 250,
                    attackRange: 10000,
                    attackSpeed: 0,
                    offsetx: 0,
                    offsety: 20,
                    width: 50,
                    height: 30,
                    name: 'Barracks I'
                },
                lvl2:{
                    lvl: 2,
                    cost: 300,
                    damage: 0,
                    health: 300,
                    attackRange: 10000,
                    attackSpeed: 0,
                    offsetx: 0,
                    offsety: 20,
                    width: 50,
                    height: 30,
                    name: 'Barracks II'
                },
                lvl3:{
                    lvl: 3,
                    cost: 350,
                    damage: 0,
                    health: 350,
                    attackRange: 10000,
                    attackSpeed: 0,
                    offsetx: 0,
                    offsety: 20,
                    width: 50,
                    height: 30,
                    name: 'Barracks III'
                }
            },
            sprite: 'barracksTower',
            attackType: 'normal',
            buildingType: 'spawner',
            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'barracksTower').setDepth(gameState.blueprintSprite.y).setImmovable().setInteractive();
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
                gameState.gameTowers[5].action(scene,tower);
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
                var loop = scene.time.addEvent({
                    delay: 10000,
                    callback: ()=>{
                        if(building.health >0){
                            gameState.humanGuardStats.spawnHuman(scene, building.x, building.y,building.currentLevel.lvl);
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
                            if(gameState.zombies.getChildren().length > 0){
                                loop.paused = false;
                                building.anims.play(`barracksTower${building.currentLevel.lvl}Action`,true);
                            }else{
                                loop.paused = true;
                                building.anims.play(`barracksTower${building.currentLevel.lvl}Idle`,true);
                            }
                        }
                    },  
                    startAt: 0,
                    timeScale: 1,
                    repeat: -1
                }); 
            }
        },
        //sniperTowerStats
        {
            levels:{
                lvl1:{
                    lvl:1,
                    cost: 100,
                    damage: 50,
                    health: 150,
                    attackRange: 275,
                    attackSpeed: 3500,
                    offsetx: 0,
                    offsety: 30,
                    width: 40,
                    height: 30,
                    name: 'SniperTower I'
                },
                lvl2:{
                    lvl:2,
                    cost: 200,
                    damage: 75,
                    health: 200,
                    attackRange: 275,
                    attackSpeed: 3500,
                    offsetx: 0,
                    offsety: 30,
                    width: 40,
                    height: 30,
                    name: 'SniperTower II'
                },
                lvl3:{
                    lvl:3,
                    cost: 300,
                    damage: 100,
                    health: 250,
                    attackRange: 275,
                    attackSpeed: 3500,
                    offsetx: 0,
                    offsety: 30,
                    width: 40,
                    height: 30,
                    name: 'SniperTower III'
                }
            },
            sprite: 'sniperTower',
            attackType: 'normal',
            buildingType: 'tower',


            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'sniperTower').setDepth(gameState.blueprintSprite.y).setImmovable().setInteractive();
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
                gameState.gameTowers[6].action(scene,tower);
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
                                    building.anims.play(`sniperTower${building.currentLevel.lvl}Action`,true);
                                    building.attackLoop.paused = false;
                                }
                                else {
                                    building.attackLoop.paused = true;
                                    building.anims.play(`sniperTower${building.currentLevel.lvl}Idle`,true);
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
        //pipeMortorTowerStats
        {
            levels:{
                lvl1:{
                    lvl:1,
                    cost: 150,
                    damage: 30,
                    health: 150,
                    attackRange: 350,
                    attackSpeed: 6500,
                    offsetx: 0,
                    offsety: 30,
                    width: 50,
                    height: 20,
                    name: 'PipeMortor I'
                },
                lvl2:{
                    lvl:2,
                    cost: 150,
                    damage: 40,
                    health: 160,
                    attackRange: 350,
                    attackSpeed: 6500,
                    offsetx: 0,
                    offsety: 30,
                    width: 50, 
                    height: 20,
                    name: 'PipeMortor II'
                },
                lvl3:{
                    lvl:3,
                    cost: 300,
                    damage: 50,
                    health: 170,
                    attackRange: 350,
                    attackSpeed: 6500,
                    offsetx: 0,
                    offsety: 30,
                    width: 50,
                    height: 20,
                    name: 'PipeMortor III'
                }
            },
            sprite: 'pipeMortorTower',
            attackType: 'normal',
            buildingType: 'tower',


            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(gameState.blueprintSprite.x,gameState.blueprintSprite.y,'pipeMortorTower').setDepth(gameState.blueprintSprite.y).setImmovable().setInteractive();
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
                gameState.gameTowers[7].action(scene,tower);
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
                        var bullet = gameState.bullets.create(building.x,building.y,'bullet').setScale(2);
                        gameState.angle=Phaser.Math.Angle.Between(building.x,building.y,target.x,target.y);
                        bullet.setRotation(gameState.angle); 
                        bullet.damage = building.currentLevel.damage
                        scene.physics.moveToObject(bullet,target,null,3000);
                        bullet.body.velocity.y -= 400;
                        var bulletLoop2 = scene.time.addEvent({
                            delay: 1,
                            callback: ()=>{
                                bullet.body.velocity.y += 4.4;
                            },  
                            startAt: 0,
                            timeScale: 1,
                            repeat: -1
                        });
                        var bulletLoop = scene.time.addEvent({
                            delay: 3000,
                            callback: ()=>{
                                bulletLoop.destroy();
                                bulletLoop2.destroy();
                                gameState.createExplosion(scene,bullet.x,bullet.y);
                                if(gameState.zombies.getChildren().length > 0){
                                    for (var i = 0; i < gameState.zombies.getChildren().length; i++){
                                        if(Phaser.Math.Distance.BetweenPoints(gameState.zombies.getChildren()[i], bullet) < 75){
                                            gameState.zombies.getChildren()[i].health -= bullet.damage;
                                        }
                                    } 
                                }
                                bullet.destroy();
                            },  
                            startAt: 0,
                            timeScale: 1
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
                                    building.anims.play(`pipeMortorTower${building.currentLevel.lvl}Idle`,true);
                                    building.attackLoop.paused = false;
                                }
                                else {
                                    building.attackLoop.paused = true;
                                    building.anims.play(`pipeMortorTower${building.currentLevel.lvl}Idle`,true);
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
    gameTowers2:[
        //ballistaTowerStats
        {
            levels:{
                lvl1:{
                    lvl:1,
                    cost: 75,
                    damage: 35,
                    health: 60,
                    attackRange: 175,
                    attackSpeed: 2000,
                    offsetx: 0,
                    offsety: 10,
                    width: 50,
                    height: 30,
                    name: 'BallistaTower I'
                },
                lvl2:{
                    lvl:2,
                    cost: 150,
                    damage: 40,
                    health: 100,
                    attackRange: 175,
                    attackSpeed: 1950,
                    offsetx: 0,
                    offsety: 10,
                    width: 50,
                    height: 30,
                    name: 'BallistaTower II'
                },
                lvl3:{
                    lvl:3,
                    cost: 225,
                    damage: 45,
                    health: 150,
                    attackRange: 175,
                    attackSpeed: 1900,
                    offsetx: 0,
                    offsety: 10,
                    width: 50,
                    height: 30,
                    name: 'BallistaTower III'
                }
            },
            sprite: 'ballistaTower',
            attackType: 'normal',
            buildingType: 'tower',


            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(Math.ceil(gameState.blueprintSprite.x),Math.ceil(gameState.blueprintSprite.y),'ballistaTower').setDepth(gameState.blueprintSprite.y).setImmovable().setInteractive();
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
                gameState.gameTowers2[0].action(scene,tower);
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
                        var bullet = gameState.bullets.create(building.x,building.y,'spear');
                        gameState.angle=Phaser.Math.Angle.Between(building.x,building.y,target.x,target.y);
                        bullet.setRotation(gameState.angle); 
                        scene.physics.moveTo(bullet,target.x +(Math.random()*6-10),target.y +(Math.random()*6-10),300);
                        building.anims.play(`ballistaTower${building.currentLevel.lvl}Action`,true);
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
                                    building.attackLoop.paused = false;
                                }
                                else {
                                    building.attackLoop.paused = true;
                                    building.anims.play(`ballistaTower${building.currentLevel.lvl}Idle`,true);
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
        //healingTowerStats
        {
            levels:{
                lvl1:{
                    lvl:1,
                    cost: 50,
                    damage: 1,
                    health: 50,
                    attackRange: 150,
                    attackSpeed: 1000,
                    offsetx: 0,
                    offsety: 20,
                    width: 50,
                    height: 30,
                    name: 'Healing Tower I'
                },
                lvl2:{
                    lvl:2,
                    cost: 70,
                    damage: 2,
                    health: 60,
                    attackRange: 150,
                    attackSpeed: 1000,
                    offsetx: 0,
                    offsety: 20,
                    width: 50,
                    height: 30,
                    name: 'Healing Tower II'
                },
                lvl3:{
                    lvl:3,
                    cost: 100,
                    damage: 3,
                    health: 70,
                    attackRange: 150,
                    attackSpeed: 1000,
                    offsetx: 0,
                    offsety: 20,
                    width: 50,
                    height: 30,
                    name: 'HealingTower III'
                }
            },
            sprite: 'healingTower',
            attackType: 'heal',
            buildingType: 'tower',


            spawnTower: function(scene,towerStats){
                var tower = gameState.buildings.create(Math.ceil(gameState.blueprintSprite.x),Math.ceil(gameState.blueprintSprite.y),'healingTower').setDepth(gameState.blueprintSprite.y).setImmovable().setInteractive();
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
                        if(gameState.buildings.getChildren()[i].buildingType !== "troop"){
                            if(dist<closest && gameState.buildings.getChildren()[i] !== building && gameState.buildings.getChildren()[i].health < gameState.buildings.getChildren()[i].currentLevel.health){
                                closest = dist;

                                    target = gameState.buildings.getChildren()[i];

                            }
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
                        if(gameState.buildings.getChildren().length > 0){
                            for (var i = 0; i < gameState.buildings.getChildren().length; i++){
                                if(Phaser.Math.Distance.BetweenPoints(gameState.buildings.getChildren()[i], building) < building.currentLevel.attackRange && building !== gameState.buildings.getChildren()[i] && gameState.buildings.getChildren()[i].health < gameState.buildings.getChildren()[i].currentLevel.health){
                                    gameState.buildings.getChildren()[i].health += building.currentLevel.damage;
                                }
                            } 
                        }
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
                                    building.anims.play(`healingTower${building.currentLevel.lvl}Action`,true);
                                    building.attackLoop.paused = false;
                                }
                                else {
                                    building.attackLoop.paused = true;
                                    building.anims.play(`healingTower${building.currentLevel.lvl}Idle`,true);
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
    
    
    //townHallStats
    townhallStats:{
        levels:{
            lvl1:{
                lvl: 1,
                cost: 0,
                damage: 0,
                health: 1000,
                attackRange: 0,
                attackSpeed: 0,
                offsetx: 0,
                offsety: 50,
                width: 100,
                height: 50,
                name: 'TownHall'
            },lvl2:{
                lvl: 2,
                cost: 0,
                damage: 0,
                health: 1000,
                attackRange: 0,
                attackSpeed: 0,
                offsetx: 0,
                offsety: 50,
                width: 100,
                height: 50,
                name: 'TownHall'
            }
        },
        sprite: 'townHall',
        attackType: 'none',
        buildingType: 'main',
        spawnTower: function(scene,towerStats,spawnx,spawny){
            var tower = gameState.buildings.create(spawnx,spawny,'townHall').setDepth(spawny).setImmovable().setInteractive();
            gameState.townHall = tower;
            tower.body.offset.y = towerStats.levels.lvl1.offsety;
            tower.body.height = towerStats.levels.lvl1.height;
            tower.health = towerStats.levels.lvl1.health;
            tower.currentLevel = gameState.townhallStats.levels.lvl1;
            tower.towerStats = towerStats;
            tower.anims.play('townHallIdle',true);
            gameState.createHealthBar(scene,tower,gameState.townhallStats.levels.lvl1.health);
            tower.on('pointerdown', function(pointer){
                if(gameState.blueprint.active == false){
                    gameState.selected.setInfo(scene,tower);
                }
            });
            towerStats.action(scene,tower);
        },
        upgradeTower: function(scene,tower){

        },
        action: function(scene,building){
            var loop1 = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(building.health <=0){
                        gameState.createExplosion(scene,building.x,building.y);
                        loop1.destroy();
                        scene.scene.pause('ArenaScene');
                    }
                },  
                startAt: 0,
                timeScale: 1,
                repeat: -1
            }); 
        }
    },
    
    humanGuardStats:{
        lvl1:{
            name: "Human Guard",
            speed: 30,
            health: 50,
            damage: 2,
            attackRange: 150,
        },
        lvl2:{
            name: "Human Guard",
            speed: 35,
            health: 60,
            damage: 3,
            attackRange: 155,
        },
        lvl3:{
            name: "Human Guard",
            speed: 40,
            health: 70,
            damage: 4,
            attackRange: 160,
        },
        buildingType: "troop",
        attackSpeed: 100,
        spawnHuman: function(scene,x,y,lvl){
            var human = gameState.buildings.create(x,y,`humanGuard${lvl}`).setDepth(1);
            human.level = lvl;
            if(lvl == 1){
                human.anims.play(`humanGuardSpawn${human.level}`);
                human.health = gameState.humanGuardStats.lvl1.health;
                gameState.createHealthBar(scene,human,gameState.humanGuardStats.lvl1.health);
            }else if(lvl == 2){
                human.anims.play(`humanGuardSpawn${human.level}`);
                human.health = gameState.humanGuardStats.lvl2.health;
                gameState.createHealthBar(scene,human,gameState.humanGuardStats.lvl2.health);
            }else if(lvl == 3){
                human.anims.play(`humanGuardSpawn${human.level}`);
                human.health = gameState.humanGuardStats.lvl3.health;
                gameState.createHealthBar(scene,human,gameState.humanGuardStats.lvl3.health);
            }
            
            human.buildingType = gameState.humanGuardStats.buildingType;
            scene.time.addEvent({
                delay: 1310,
                callback: ()=>{
                    gameState.humanGuardStats.behaviourLoop(scene,human);
                },  
                startAt: 0,
                timeScale: 1
            }); 
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
            scene.physics.moveToObject(bullet, target, null, 500);
            var bulletLoop = scene.time.addEvent({
                delay: 500,
                callback: ()=>{
                    bullet.destroy();
                    bulletLoop.destroy();
                    if(human.level == 1){
                        target.health -= gameState.humanGuardStats.lvl1.damage;
                    }else if(human.level == 2){
                        target.health -= gameState.humanGuardStats.lvl2.damage;
                    }else if(human.level == 3){
                        target.health -= gameState.humanGuardStats.lvl3.damage;
                    }
                },  
                startAt: 0,
                timeScale: 1
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
        behaviourLoop: function (scene,human){
            human.anims.play(`humanGuardWalk${human.level}`);
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
            loop.paused = true;
            var bLoop = scene.time.addEvent({
                delay: 1,
                callback: ()=>{
                    if(human.health > 0){
                        human.health -= 0.05;
                        human.depth = human.y;
                        target = gameState.humanGuardStats.findTarget(scene,human);
                        dist = Phaser.Math.Distance.BetweenPoints(target, human);
                        var range;
                        if(human.level == 1){
                            range = gameState.humanGuardStats.lvl1.attackRange;
                        }else if(human.level == 2){
                            range = gameState.humanGuardStats.lvl2.attackRange;
                        }else if(human.level == 3){
                            range = gameState.humanGuardStats.lvl3.attackRange;
                        }
                        if(dist < range){
                            human.setVelocityX(0);
                            human.setVelocityY(0);
                            loop.paused = false;
                            human.anims.play(`humanGuardAction${human.level}`,true);
                        }
                        else {
                            if(target.x >= human.x){
                                human.flipX = false;
                            }else{
                                human.flipX = true;
                            }
                            human.anims.play(`humanGuardWalk${human.level}`,true);
                            loop.paused = true;
                            var speed;
                            if(human.level == 1){
                                speed = gameState.humanGuardStats.lvl1.speed;
                            }else if(human.level == 2){
                                speed = gameState.humanGuardStats.lvl2.speed;
                            }else if(human.level == 3){
                                speed = gameState.humanGuardStats.lvl3.speed;
                            }
                            if(target !== gameState.invisibleTarget){
                                scene.physics.moveToObject(human, target, speed);
                            }else{
                                human.setVelocityX(0);
                                human.setVelocityY(0);
                            }
                        }
                    }
                    else {
                        
                        bLoop.destroy();
                        loop.destroy();
                        human.anims.play(`humanGuardDeath${human.level}`,true);
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
