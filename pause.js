class PauseScene extends Phaser.Scene {
    constructor() {
		super({ key: 'PauseScene' })
	}
    preload(){
        
    }
    create() {
        this.scene.bringToTop();
        var back = this.add.image(window.innerWidth-75,10,'pauseSign').setOrigin(0,0).setInteractive();
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
        
        function createTowerIcon(scene,i){
            var tower = scene.physics.add.sprite(10+i*60,565,`${gameState.gameTowers[i].sprite}`).setOrigin(0,0).setInteractive();
            tower.setScale(50/tower.height);
            tower.setFrame(1);
            tower.id = i;
            tower.on('pointerdown', function(pointer){
                if(gameState.blueprint.active == false){
                    gameState.blueprint.create(gameState.arena,gameState.gameTowers[tower.id],);
                }
            });
        }
        this.scene.bringToTop();
        this.add.image(0,675-120,'buyTowersBg').setOrigin(0,0);
        for (var i = 0; i < gameState.gameTowers.length; i++){
            createTowerIcon(this,i);
        }
        gameState.selected.checkLoop(this);
	}
    update(){
        
    }
}