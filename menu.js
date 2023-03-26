class MenuScene extends Phaser.Scene {
    constructor() {
		super({ key: 'MenuScene' })
	}
    preload(){
        this.load.image('grassFieldBackground', 'images/grassFieldBackground.png');
        this.load.image('caveBackground', 'images/caveBackground.png');
        this.load.image('canyonBackground', 'images/canyonBackground.png');
        
        //buyingTowers
        this.load.image('buyTowersBg','images/buyTowersBg.png');
        
        this.load.spritesheet('character','images/character.png',{frameWidth: 32,frameHeight:32});
        this.load.spritesheet('zombieKing','images/zombieKing.png',{frameWidth: 200,frameHeight:200});
        this.load.spritesheet('zombie1','images/zombie1.png',{frameWidth: 32,frameHeight:32});
        this.load.spritesheet('zombieDog','images/zombieDog.png',{frameWidth: 27,frameHeight:25});
        this.load.spritesheet('zombieWizard','images/zombieWizard.png',{frameWidth: 60,frameHeight:60});
        this.load.spritesheet('zombieBomber','images/zombieBomber.png',{frameWidth: 32,frameHeight:32});
        this.load.spritesheet('zombieMuskateer','images/zombieMuskateer.png',{frameWidth: 38,frameHeight:38});
        this.load.spritesheet('zombieGiant','images/zombieGiant.png',{frameWidth: 40,frameHeight:40});
        this.load.spritesheet('factory','images/factory.png',{frameWidth: 50,frameHeight:50});
        this.load.spritesheet('gatlingTower','images/gatlingTower.png',{frameWidth: 40,frameHeight:40});
        this.load.spritesheet('electroTower','images/electroTower.png',{frameWidth: 40,frameHeight:70});
        this.load.spritesheet('electricWave','images/electricWave.png',{frameWidth: 400,frameHeight:400});
        this.load.spritesheet('barracksTower','images/barracksTower.png',{frameWidth: 50,frameHeight:50});
        this.load.spritesheet('humanGuard','images/humanGuard.png',{frameWidth: 32,frameHeight:32});
        this.load.spritesheet('humanGuard2','images/humanGuard2.png',{frameWidth: 32,frameHeight:32});
        this.load.spritesheet('humanGuard3','images/humanGuard3.png',{frameWidth: 32,frameHeight:32});
        this.load.spritesheet('woodWall','images/woodWall.png',{frameWidth: 18,frameHeight:30});
        this.load.spritesheet('ufo','images/ufo.png',{frameWidth: 70,frameHeight:44});
        this.load.spritesheet('alienTower','images/alienTower.png',{frameWidth: 50,frameHeight:50});
        this.load.spritesheet('buildingExplosion','images/buildingExplosion.png',{frameWidth: 75,frameHeight:75});
        
        this.load.image('bullet','images/bullet.png');
        this.load.image('nothing','images/nothing.png');
        this.load.image('ufoLaser','images/ufoLaser.png');
        this.load.image('zombieWizardBall','images/zombieWizardBall.png');
        this.load.image('title','images/title.png');
        this.load.image('healthSign','images/healthSign.png');
        this.load.image('moneySign','images/moneySign.png');
        this.load.image('pauseSign','images/pauseSign.png');
        this.load.image('paused','images/paused.png');
        this.load.image('waveSign','images/waveSign.png');
        this.load.image('buildSign','images/buildSign.png');
        this.load.image('buildMenuBg','images/buildMenuBg.png');
        this.load.image('confirmButton','images/confirmButton.png');
        this.load.image('cancelButton','images/cancelButton.png');
        this.load.image('startButton','images/startButton.png');
        this.load.image('BLANK','images/BLANK.png');
        this.load.image('upgradeTowerIcon','images/upgradeTowerIcon.png');
        this.load.image('laser1','images/laser1.png');
        this.load.image('flame1','images/flame1.png');
        
        
        this.load.spritesheet('machineGunTower','images/machineGunTower.png',{frameWidth: 80,frameHeight:80});
        this.load.spritesheet('repairTower','images/repairTower.png',{frameWidth: 50,frameHeight:50});
        this.load.spritesheet('flameThrowerTower','images/flameThrowerTower.png',{frameWidth: 80,frameHeight:80});
        this.load.spritesheet('sniperTower','images/sniperTower.png',{frameWidth: 40,frameHeight:60});
        this.load.spritesheet('pipeMortorTower','images/pipeMortorTower.png',{frameWidth: 50,frameHeight:50});
        
        this.load.spritesheet('townHall','images/townHall.png',{frameWidth: 100,frameHeight:100});
        
        
        
        //
        this.load.spritesheet('overWorldTrophy','images/overWorldTrophy.png',{frameWidth: 80,frameHeight:100});
    }
    create() {
        this.scale.lockOrientation('landscape')
        //character Animations
        this.anims.create({
            key: 'characterIdle',
            frameRate: 1,
            repeat: -1,
            frames:this.anims.generateFrameNames('character',{start: 0,end: 0})
        });
        this.anims.create({
            key: 'characterWalk',
            frameRate: 25,
            repeat: -1,
            frames:this.anims.generateFrameNames('character',{start: 0,end: 11})
        });
        
        
        //Trophys
        this.anims.create({
            key: 'overWorldTrophyA',
            frameRate: 8,
            repeat: -1,
            frames:this.anims.generateFrameNames('overWorldTrophy',{start: 0,end: 7})
        });
        
        
        this.anims.create({
            key: 'zombieKingSpawn',
            frameRate: 13,
            frames:this.anims.generateFrameNames('zombieKing',{start: 1,end: 16})
        });
        this.anims.create({
            key: 'zombieKingIdle',
            frameRate: 25,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombieKing',{start: 17,end: 17})
        });
        this.anims.create({
            key: 'zombieKingWalk',
            frameRate: 7,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombieKing',{start: 17,end: 28})
        });
        this.anims.create({
            key: 'zombieKingDeath',
            frameRate: 10,
            frames:this.anims.generateFrameNames('zombieKing',{start: 29,end: 33})
        });
        
        
        
        this.anims.create({
            key: 'zombie1Spawn',
            frameRate: 13,
            frames:this.anims.generateFrameNames('zombie1',{start: 1,end: 16})
        });
        this.anims.create({
            key: 'zombie1Idle',
            frameRate: 25,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombie1',{start: 17,end: 17})
        });
        this.anims.create({
            key: 'zombie1Walk',
            frameRate: 13,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombie1',{start: 17,end: 28})
        });
        this.anims.create({
            key: 'zombie1Death',
            frameRate: 10,
            frames:this.anims.generateFrameNames('zombie1',{start: 29,end: 33})
        });
        
        
        
        this.anims.create({
            key: 'zombieDogSpawn',
            frameRate: 15,
            frames:this.anims.generateFrameNames('zombieDog',{start: 0,end: 3})
        });
        this.anims.create({
            key: 'zombieDogIdle',
            frameRate: 4,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombieDog',{start: 5,end: 5})
        });
        this.anims.create({
            key: 'zombieDogWalk',
            frameRate: 30,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombieDog',{start: 5,end: 16})
        });
        this.anims.create({
            key: 'zombieDogDeath',
            frameRate: 10,
            frames:this.anims.generateFrameNames('zombieDog',{start: 17,end: 21})
        });
        
        
        
        this.anims.create({
            key: 'zombieGiantSpawn',
            frameRate: 13,
            frames:this.anims.generateFrameNames('zombieGiant',{start: 1,end: 16})
        });
        this.anims.create({
            key: 'zombieGiantIdle',
            frameRate: 25,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombieGiant',{start: 17,end: 17})
        });
        this.anims.create({
            key: 'zombieGiantWalk',
            frameRate: 10,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombieGiant',{start: 17,end: 28})
        });
        this.anims.create({
            key: 'zombieGiantDeath',
            frameRate: 10,
            frames:this.anims.generateFrameNames('zombieGiant',{start: 29,end: 33})
        });
        
        
        
        this.anims.create({
            key: 'zombieMuskateerSpawn',
            frameRate: 13,
            frames:this.anims.generateFrameNames('zombieMuskateer',{start: 1,end: 16})
        });
        this.anims.create({
            key: 'zombieMuskateerIdle',
            frameRate: 25,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombieMuskateer',{start: 17,end: 17})
        });
        this.anims.create({
            key: 'zombieMuskateerWalk',
            frameRate: 13,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombieMuskateer',{start: 17,end: 28})
        });
        this.anims.create({
            key: 'zombieMuskateerDeath',
            frameRate: 10,
            frames:this.anims.generateFrameNames('zombieMuskateer',{start: 29,end: 33})
        });
        this.anims.create({
            key: 'zombieMuskateerAction',
            frameRate: 1,
            frames:this.anims.generateFrameNames('zombieMuskateer',{start: 34,end: 34})
        });
        
        
        
        this.anims.create({
            key: 'zombieBomberSpawn',
            frameRate: 13,
            frames:this.anims.generateFrameNames('zombieBomber',{start: 1,end: 16})
        });
        this.anims.create({
            key: 'zombieBomberIdle',
            frameRate: 25,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombieBomber',{start: 17,end: 17})
        });
        this.anims.create({
            key: 'zombieBomberWalk',
            frameRate: 13,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombieBomber',{start: 17,end: 28})
        });
        this.anims.create({
            key: 'zombieBomberDeath',
            frameRate: 10,
            frames:this.anims.generateFrameNames('zombieBomber',{start: 29,end: 33})
        });
        
        
        
        this.anims.create({
            key: 'zombieWizardSpawn',
            frameRate: 13,
            frames:this.anims.generateFrameNames('zombieWizard',{start: 1,end: 16})
        });
        this.anims.create({
            key: 'zombieWizardIdle',
            frameRate: 25,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombieWizard',{start: 17,end: 17})
        });
        this.anims.create({
            key: 'zombieWizardWalk',
            frameRate: 13,
            repeat: -1,
            frames:this.anims.generateFrameNames('zombieWizard',{start: 17,end: 28})
        });
        this.anims.create({
            key: 'zombieWizardDeath',
            frameRate: 10,
            frames:this.anims.generateFrameNames('zombieWizard',{start: 29,end: 33})
        });
        
        
        
        this.anims.create({
            key: 'explode',
            frameRate: 7,
            frames:this.anims.generateFrameNames('buildingExplosion',{start: 0,end: 7})
        });
        
        
        
        this.anims.create({
            key: 'machineGunTower1Idle',
            frameRate: 1,
            repeat: -1,
            frames:this.anims.generateFrameNames('machineGunTower',{start: 1,end: 1})
        });
        this.anims.create({
            key: 'machineGunTower1Action',
            frameRate: 12,
            repeat: -1,
            frames:this.anims.generateFrameNames('machineGunTower',{start: 1,end: 2})
        });
        this.anims.create({
            key: 'machineGunTower2Idle',
            frameRate: 1,
            frames:this.anims.generateFrameNames('machineGunTower',{start: 3,end: 3})
        });
        this.anims.create({
            key: 'machineGunTower2Action',
            frameRate: 12,
            repeat: -1,
            frames:this.anims.generateFrameNames('machineGunTower',{start: 3,end: 4})
        });
        this.anims.create({
            key: 'machineGunTower3Idle',
            frameRate: 1,
            frames:this.anims.generateFrameNames('machineGunTower',{start: 5,end: 5})
        });
        this.anims.create({
            key: 'machineGunTower3Action',
            frameRate: 12,
            repeat: -1,
            frames:this.anims.generateFrameNames('machineGunTower',{start: 6,end: 7})
        });
        
        
        
        this.anims.create({
            key: 'sniperTowerIdle',
            frameRate: 1,
            frames:this.anims.generateFrameNames('sniperTower',{start: 0,end: 0})
        });
        this.anims.create({
            key: 'sniperTowerAction',
            frameRate: 12,
            repeat: -1,
            frames:this.anims.generateFrameNames('sniperTower',{start: 1,end: 1})
        });
        
        
        
        this.anims.create({
            key: 'electroTowerIdle',
            frameRate: 1,
            frames:this.anims.generateFrameNames('electroTower',{start: 0,end: 0})
        });
        this.anims.create({
            key: 'electroTowerAction',
            frameRate: 20,
            repeat: -1,
            frames:this.anims.generateFrameNames('electroTower',{start: 1,end: 2})
        });
        this.anims.create({
            key: 'electricWaveAction',
            frameRate: 15,
            frames:this.anims.generateFrameNames('electricWave',{start: 0,end: 4})
        });
        
        
        
        this.anims.create({
            key: 'humanGuardSpawn',
            frameRate: 13,
            frames:this.anims.generateFrameNames('humanGuard',{start: 1,end: 16})
        });
        this.anims.create({
            key: 'humanGuardIdle1',
            frameRate: 25,
            repeat: -1,
            frames:this.anims.generateFrameNames('humanGuard',{start: 17,end: 17})
        });
        this.anims.create({
            key: 'humanGuardWalk1',
            frameRate: 17,
            repeat: -1,
            frames:this.anims.generateFrameNames('humanGuard',{start: 17,end: 28})
        });
        this.anims.create({
            key: 'humanGuardDeath1',
            frameRate: 10,
            frames:this.anims.generateFrameNames('humanGuard',{start: 29,end: 33})
        });
        this.anims.create({
            key: 'humanGuardAction1',
            frameRate: 1,
            frames:this.anims.generateFrameNames('humanGuard',{start: 34,end: 34})
        });
        
        
        
        this.anims.create({
            key: 'humanGuardSpawn2',
            frameRate: 13,
            frames:this.anims.generateFrameNames('humanGuard2',{start: 1,end: 16})
        });
        this.anims.create({
            key: 'humanGuardIdle2',
            frameRate: 25,
            repeat: -1,
            frames:this.anims.generateFrameNames('humanGuard2',{start: 17,end: 17})
        });
        this.anims.create({
            key: 'humanGuardWalk2',
            frameRate: 17,
            repeat: -1,
            frames:this.anims.generateFrameNames('humanGuard2',{start: 17,end: 28})
        });
        this.anims.create({
            key: 'humanGuardDeath2',
            frameRate: 10,
            frames:this.anims.generateFrameNames('humanGuard2',{start: 29,end: 33})
        });
        this.anims.create({
            key: 'humanGuardAction2',
            frameRate: 1,
            frames:this.anims.generateFrameNames('humanGuard2',{start: 34,end: 34})
        });
        
        
        
        this.anims.create({
            key: 'humanGuardSpawn3',
            frameRate: 13,
            frames:this.anims.generateFrameNames('humanGuard3',{start: 1,end: 16})
        });
        this.anims.create({
            key: 'humanGuardIdle3',
            frameRate: 25,
            repeat: -1,
            frames:this.anims.generateFrameNames('humanGuard3',{start: 17,end: 17})
        });
        this.anims.create({
            key: 'humanGuardWalk3',
            frameRate: 17,
            repeat: -1,
            frames:this.anims.generateFrameNames('humanGuard3',{start: 17,end: 28})
        });
        this.anims.create({
            key: 'humanGuardDeath3',
            frameRate: 10,
            frames:this.anims.generateFrameNames('humanGuard3',{start: 29,end: 33})
        });
        this.anims.create({
            key: 'humanGuardAction3',
            frameRate: 1,
            frames:this.anims.generateFrameNames('humanGuard3',{start: 34,end: 34})
        });
        
        
        
        this.anims.create({
            key: 'barracksTower1Idle',
            frameRate: 10,
            frames:this.anims.generateFrameNames('barracksTower',{start: 1,end: 2})
        });
        this.anims.create({
            key: 'barracksTower1Action',
            frameRate: 10,
            repeat: -1,
            frames:this.anims.generateFrameNames('barracksTower',{start: 3,end: 4})
        });
        this.anims.create({
            key: 'barracksTower2Idle',
            frameRate: 10,
            frames:this.anims.generateFrameNames('barracksTower',{start: 5,end: 6})
        });
        this.anims.create({
            key: 'barracksTower2Action',
            frameRate: 10,
            repeat: -1,
            frames:this.anims.generateFrameNames('barracksTower',{start: 7,end: 8})
        });
        this.anims.create({
            key: 'barracksTower3Idle',
            frameRate: 10,
            frames:this.anims.generateFrameNames('barracksTower',{start: 9,end: 10})
        });
        this.anims.create({
            key: 'barracksTower3Action',
            frameRate: 10,
            repeat: -1,
            frames:this.anims.generateFrameNames('barracksTower',{start: 11,end: 12})
        });
        
        
        
        this.anims.create({
            key: 'sniperTower1Idle',
            frameRate: 10,
            frames:this.anims.generateFrameNames('sniperTower',{start: 1,end: 1})
        });
        this.anims.create({
            key: 'sniperTower1Action',
            frameRate: 10,
            frames:this.anims.generateFrameNames('sniperTower',{start: 2,end: 2})
        });
        this.anims.create({
            key: 'sniperTower2Idle',
            frameRate: 10,
            frames:this.anims.generateFrameNames('sniperTower',{start: 3,end: 3})
        });
        this.anims.create({
            key: 'sniperTower2Action',
            frameRate: 10,
            frames:this.anims.generateFrameNames('sniperTower',{start:4 ,end: 4})
        });
        this.anims.create({
            key: 'sniperTower3Idle',
            frameRate: 10,
            frames:this.anims.generateFrameNames('sniperTower',{start: 5,end: 5})
        });
        this.anims.create({
            key: 'sniperTower3Action',
            frameRate: 10,
            frames:this.anims.generateFrameNames('sniperTower',{start:6 ,end: 6})
        });
        
        
        
        
        this.anims.create({
            key: 'pipeMortorTower1Idle',
            frameRate: 10,
            frames:this.anims.generateFrameNames('pipeMortorTower',{start:1 ,end: 1})
        });
        this.anims.create({
            key: 'pipeMortorTower2Idle',
            frameRate: 10,
            frames:this.anims.generateFrameNames('pipeMortorTower',{start:2 ,end: 2})
        });
        this.anims.create({
            key: 'pipeMortorTower3Idle',
            frameRate: 10,
            frames:this.anims.generateFrameNames('pipeMortorTower',{start:3 ,end: 3})
        });
        
        
        
        
        this.anims.create({
            key: 'ufoActive',
            frameRate: 13,
            repeat: -1,
            frames:this.anims.generateFrameNames('ufo',{start: 0,end: 1})
        });
        
        
        
        this.anims.create({
            key: 'townHallIdle',
            frameRate: 7,
            repeat: -1,
            frames:this.anims.generateFrameNames('townHall',{start: 0,end: 7})
        });
        
        
        
        this.anims.create({
            key: 'factory1Action',
            frameRate: 7,
            repeat: -1,
            frames:this.anims.generateFrameNames('factory',{start: 1,end: 4})
        });
        this.anims.create({
            key: 'factory2Action',
            frameRate: 7,
            repeat: -1,
            frames:this.anims.generateFrameNames('factory',{start: 5,end: 8})
        });
        this.anims.create({
            key: 'factory3Action',
            frameRate: 7,
            repeat: -1,
            frames:this.anims.generateFrameNames('factory',{start: 9,end: 12})
        });
        
        
        
        this.anims.create({
            key: 'repairTower1Idle',
            frameRate: 10,
            repeat: -1,
            frames:this.anims.generateFrameNames('repairTower',{start: 1,end: 6})
        });
        this.anims.create({
            key: 'repairTower1Action',
            frameRate: 10,
            repeat: -1,
            frames:this.anims.generateFrameNames('repairTower',{start: 7,end: 10})
        });
        this.anims.create({
            key: 'repairTower2Idle',
            frameRate: 10,
            repeat: -1,
            frames:this.anims.generateFrameNames('repairTower',{start: 1,end: 6})
        });
        this.anims.create({
            key: 'repairTower2Action',
            frameRate: 10,
            repeat: -1,
            frames:this.anims.generateFrameNames('repairTower',{start: 7,end: 10})
        });
        
        this.anims.create({
            key: 'repairTower3Idle',
            frameRate: 10,
            repeat: -1,
            frames:this.anims.generateFrameNames('repairTower',{start: 1,end: 6})
        });
        this.anims.create({
            key: 'repairTower3Action',
            frameRate: 10,
            repeat: -1,
            frames:this.anims.generateFrameNames('repairTower',{start: 7,end: 10})
        });
        
        
        
        
        this.anims.create({
            key: 'flameThrowerTower1Idle',
            frameRate: 20,
            repeat: -1,
            frames:this.anims.generateFrameNames('flameThrowerTower',{start: 1,end: 1})
        });
        this.anims.create({
            key: 'flameThrowerTower2Idle',
            frameRate: 20,
            repeat: -1,
            frames:this.anims.generateFrameNames('flameThrowerTower',{start: 3,end: 3})
        });
        this.anims.create({
            key: 'flameThrowerTower3Idle',
            frameRate: 20,
            repeat: -1,
            frames:this.anims.generateFrameNames('flameThrowerTower',{start: 5,end: 5})
        });
        this.anims.create({
            key: 'flameThrowerTower1Action',
            frameRate: 20,
            repeat: -1,
            frames:this.anims.generateFrameNames('flameThrowerTower',{start: 1,end: 2})
        });
        this.anims.create({
            key: 'flameThrowerTower2Action',
            frameRate: 20,
            repeat: -1,
            frames:this.anims.generateFrameNames('flameThrowerTower',{start: 3,end: 4})
        });
        this.anims.create({
            key: 'flameThrowerTower3Action',
            frameRate: 20,
            repeat: -1,
            frames:this.anims.generateFrameNames('flameThrowerTower',{start: 5,end: 6})
        });
        
        gameState.createBackground(this);
        this.add.image(window.innerWidth/2,100,'title');
        this.add.image(200,window.innerHeight/2,'zombie1').setScale(10);
        this.add.image(window.innerWidth-200,window.innerHeight/2,'character').setScale(10);
        var button = this.add.image(600,337,'startButton').setInteractive();
        if(gameState.thingsToSave.trophys.overWorld == true){
            var overWorldTrophy = this.add.sprite(400,200,'overWorldTrophy').setScale(0.5);
            overWorldTrophy.anims.play('overWorldTrophyA',true);
        }
        gameState.globalScene = this;
        button.on('pointerdown', function(pointer){
            gameState.globalScene.scene.start('ArenaScene');
        });
	}
    update(){
        
    }
}