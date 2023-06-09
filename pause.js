class PauseScene extends Phaser.Scene {
    constructor() {
		super({ key: 'PauseScene' })
	}
    preload(){
        
    }
    create() {
        this.scene.bringToTop();
        var back = this.add.image(10,10,'pauseSign').setOrigin(0,0).setInteractive();
        this.add.image(window.innerWidth/2,window.innerHeight/2,'paused');
        var scene = this;
        var paused = false;
        back.on('pointerup', () => {
            if(paused == false){
                paused = true;
            }
            else {
                scene.scene.stop("PauseScene");
                scene.scene.resume("ArenaScene");
            }
		});
	}
    update(){
        
    }
}


class BuildScene extends Phaser.Scene {
    constructor() {
		super({ key: 'BuildScene' })
	}
    preload(){
        
    }
    create() {
        gameState.buildScene = this;
        function createTowerIcon(scene,i){
            var tower;
            if(gameState.thingsToSave.trophys.overWorld == false){
                tower = scene.physics.add.sprite(10+i*60,565,`${gameState.gameTowers[i].sprite}`).setOrigin(0,0).setInteractive();
            }else if(gameState.thingsToSave.trophys.hellWorld == false){
                tower = scene.physics.add.sprite(10+i*60,565,`${gameState.gameTowers2[i].sprite}`).setOrigin(0,0).setInteractive();
            }
            tower.setScale(50/tower.height);
            tower.setFrame(1);
            tower.id = i;
            tower.on('pointerdown', function(pointer){
                if(gameState.blueprint.active == false){
                    gameState.selected.select = null;
                    if(gameState.thingsToSave.trophys.overWorld == false){
                        gameState.blueprint.create(gameState.arena,gameState.gameTowers[tower.id],);
                    }else if(gameState.thingsToSave.trophys.hellWorld == false){
                        gameState.blueprint.create(gameState.arena,gameState.gameTowers2[tower.id],);
                    }
                }
            });
        }
        this.scene.bringToTop();
        this.add.image(0,675-120,'buyTowersBg').setOrigin(0,0);
        
        if(gameState.thingsToSave.trophys.overWorld == false){
            for (var i = 0; i < gameState.gameTowers.length; i++){
                createTowerIcon(this,i);
            }
        }else if(gameState.thingsToSave.trophys.hellWorld == false){
            for (var i = 0; i < gameState.gameTowers2.length; i++){
                createTowerIcon(this,i);
            }
        }
        gameState.selected.checkLoop(this);
        var arrowB = this.add.image(1200,675-120,'arrowB').setOrigin(0,0).setInteractive();
        arrowB.angle = 180;
        arrowB.on('pointerdown', function(pointer){
            gameState.arena.scene.bringToTop();
        });
	}
    update(){
        
    }
}