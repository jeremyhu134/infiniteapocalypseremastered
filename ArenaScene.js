class ChooseHeroScene extends Phaser.Scene {
    constructor() {
		super({ key: 'ChooseHeroScene' })
	}
    preload(){
        //this.load.image('menubg','tf2arenaimages/menubg.png');
        
        //this.load.spritesheet('redscout','tf2arenaimages/redscout.png',{frameWidth: 33,frameHeight:53});
    }
    create(){
        
    }
    update(){
        
    }
}

class ArenaScene extends Phaser.Scene {
    constructor() {
		super({ key: 'ArenaScene' })
	}
    preload(){
        //this.load.image('menubg','tf2arenaimages/menubg.png');
        
        //this.load.spritesheet('redscout','tf2arenaimages/redscout.png',{frameWidth: 33,frameHeight:53});
    }
    create(){
        gameState.createBackground(this);
        gameState.globalScene = this;
        gameState.arena = this;
        gameState.money = 250;
        gameState.wave = 0;
        
        /*this.physics.add.collider(gameState.player, gameState.barriers,(hero,barrier)=>{
            
        });*/
        gameState.input=this.input;
        gameState.mouse=this.input.mousePointer;
        //this.input.mouse.disableContextMenu();
        gameState.cursors = this.input.keyboard.createCursorKeys();
        gameState.keys = this.input.keyboard.addKeys('W,S,A,D,R,SPACE,SHIFT,ONE,TWO,THREE,FOUR,FIVE,SIX,SEVEN,EIGHT,ESC');
        gameState.bullets = this.physics.add.group();
        
        gameState.buildings = this.physics.add.group();
        gameState.invisibleTarget = this.physics.add.sprite(-1000,-1000,'bullet');
        
        gameState.zombies = this.physics.add.group();
        gameState.spawnCount = 5;
        gameState.commenceWaves(this);
        gameState.createIcons(this);
        gameState.townhallStats.spawnTower(this,gameState.townhallStats,600,333);
        this.scene.launch('BuildScene');
        //this.physics.add.overlap(gameState.blueprint, gameState.buildings)
        gameState.loadSave();
        this.time.addEvent({
            delay: 1000,
            callback: ()=>{
                gameState.money += 5;
            },  
            startAt: 0,
            timeScale: 1,
            repeat: -1
        }); 
        var arrowB = this.add.image(1170,675-30,'arrowB').setOrigin(0,0).setInteractive();
        arrowB.on('pointerdown', function(pointer){
            gameState.buildScene.scene.bringToTop();
        });
        //gameState.spawnZombies(this,gameState.zombieKingStats,1)
    }
    update(){
        gameState.blueprint.checkControls(this);
        gameState.updateMoney();
    }
}