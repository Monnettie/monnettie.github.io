/**
 * Game View - Handles all rendering and visual presentation
 */
import { Camera } from './Camera.js';
import { PlatformRenderer } from './renderers/PlatformRenderer.js';

export class GameView {
    constructor(gameModel) {
        this.gameModel = gameModel;
        this.canvas = null;
        this.spriteSheet = null;
        this.newSpriteSheet = null; 
        this.numbersSpriteSheet = null;
        this.titleArtwork = null; 
        this.levelCompleteSound = null; 
        this.coinSound = null; 
        this.jumpSound = null;
        this.cloneSound = null;
        this.backgroundColor = "#000000"; // Default background color
        // Initialize camera with canvas dimensions
        this.canvasDimensions = this.gameModel.getCanvasDimensions();
        this.camera = new Camera(this.canvasDimensions.width, this.canvasDimensions.height);

        // Initialize platform renderer (will be set up in init())
        this.platformRenderer = null;
        
        // FPS tracking
        this.frameCount = 0;
        this.lastFPSUpdate = Date.now();
        this.currentFPS = 0;
        this.fpsUpdateInterval = 150;
        
        // Debug settings
        this.showDebugBounds = false; // Default to hiding debug bounds 
    }

    /**
     * Initialize the view with p5.js
     */
    init() {
        const canvasDimensions = this.gameModel.getCanvasDimensions();
        // Create canvas and attach to game-container
        this.canvas = createCanvas(canvasDimensions.width, canvasDimensions.height);
        this.canvas.parent('game-container');
        
        // Force pixel density to 1 (prevents high-DPI scaling issues)
        pixelDensity(1);

        //this.spriteSheet = loadImage('assets/ssheetT.png');
        this.newSpriteSheet = loadImage('assets/BunSpriteSheetalt.png');
        this.numbersSpriteSheet = loadImage('assets/Numbers.png'); 
        this.titleArtwork = loadImage('assets/TitleArtwork.gif');
        // FROM https://freesound.org/people/Jofae/sounds/368651/
        this.levelCompleteSound = loadSound('assets/368651__jofae__game-powerup.mp3');
        this.levelCompleteSound.setVolume(0.3); 
        // FROM https://freesound.org/people/Jofae/sounds/353624/
        this.coinSound = loadSound('assets/CollectSnowflake.mp3');
        this.coinSound.setVolume(1); 
        //FROM  https://freesound.org/people/Jofae/sounds/362328/
        //362328__jofae__platform-jump
        this.jumpSound = loadSound('assets/Jump.wav'); 
        this.jumpSound.setVolume(1.25); 

        this.cloneSound = loadSound('assets/CreateClone.mp3'); 
        this.cloneSound.setVolume(0.5); 

        this.restartSound = loadSound('assets/RepeatLoop.mp3'); 
        this.destroyCloneSound = loadSound('assets/DestroyClone.wav');
        
        this.mainMusic = loadSound('assets/MainTheme_2.wav',() => {
            this.gameModel.setMainMusic(this.mainMusic);
        });
        this.mainMusic.setVolume(0.35); 

        this.introMusic = loadSound('assets/Intro.wav',() => {
            this.gameModel.setIntroMusic(this.introMusic);
            this.gameModel.playIntroMusic();
        }); // Intro music for title/end screens
        this.introMusic.setVolume(0.50); 

        //FROM https://vrtxrry.itch.io/dungeonfont/download/eyJleHBpcmVzIjoxNzU0MTUxNjQ1LCJpZCI6NzQxOTk3fQ%3d%3d%2evEOdC%2bEdlmF6YehP3Va61KZOf5s%3d
        textFont(loadFont('assets/DungeonFont.ttf')); // Load custom font for text rendering
        // Initialize platform renderer with tile sheet and matching tile size
        this.platformRenderer = new PlatformRenderer({mainTileSheet: this.newSpriteSheet, numbersSheet: this.numbersSpriteSheet}, 50);

        // Initialize camera to follow the player
        this.camera.init(this.gameModel.getPlayer());

        // Pass the level complete sound to the game model
        this.gameModel.setLevelCompleteSound(this.levelCompleteSound);
        this.gameModel.setCoinSound(this.coinSound);
        this.gameModel.setJumpSound(this.jumpSound);
        this.gameModel.setCloneSound(this.cloneSound);
        this.gameModel.setRestartSound(this.restartSound);
        this.gameModel.setDestroyCloneSound(this.destroyCloneSound);
        //this.gameModel.music.main.loop();
        console.log('GameView initialized');
    }
    playSound(s){

    }
    /**
     * Render the entire game frame
     */
    render() {
        // Update FPS tracking
        this.updateFPS();
        
        const gameState = this.gameModel.getGameState();
        
        if (gameState === 'TITLE') {
            this.drawTitleScreen();
            return;
        }
        
        if (gameState === 'END') {
            this.drawEndScreen();
            return;
        }
        
        // Normal game rendering (PLAYING state)
        // Update camera to follow the player
        this.camera.followTarget(this.gameModel.getPlayer());
        
        // Update viewport bounds for culling based on camera position
        const cameraOffset = this.camera.getOffset();
        this.gameModel.updateViewport(cameraOffset.x, cameraOffset.y);
        
        // Draw background BEFORE camera translation so it can have its own parallax movement
        this.drawBackground();
        
        // Apply camera transformation for all game objects
        this.camera.applyTransform();
        this.drawPlatforms();
        this.drawDecals();
        this.drawMessages();
        this.drawFrozenClones();
        this.drawPlayer();
        this.drawCoins();
        this.drawEnemies();
        if (this.showDebugBounds) {
            this.drawDebugBounds();
        }
        
        // Handle level reset animation
        const animationState = this.gameModel.getLevelResetAnimationState();
        if (animationState.isPlaying) {
            this.drawLevelResetAnimation(animationState);
        }
        
        this.drawUI();
    }

    /**
     * Update FPS tracking
     */
    updateFPS() {
        this.frameCount++;
        const currentTime = Date.now();
        const timeDelta = currentTime - this.lastFPSUpdate;
        
        // Update FPS display every fpsUpdateInterval milliseconds
        if (timeDelta >= this.fpsUpdateInterval) {
            this.currentFPS = Math.round((this.frameCount / timeDelta) * 1000);
            this.frameCount = 0;
            this.lastFPSUpdate = currentTime;
            if (this.currentFPS < 59) {
                console.warn(`Low FPS detected: ${this.currentFPS}`);
            }
        }
    }

    /**
     * Draw the background
     */
    drawBackground() {
        background(this.backgroundColor);
        
        // Draw parallax layers - furthest to nearest (more visible speeds for testing)
        //this.drawParallaxLayer(0.1, 200, 250, 100, 0, color( "#0B0B0F")); // Far mountains - slow but visible
        //this.drawParallaxLayer(0.2, 100, 225, 75, 0, color("#14141C")); // Mid mountains
        //this.drawParallaxLayer(0.3, 150, 200, 50, 0, color("#1E1F2B")); // Near hills - medium speed
        //this.drawParallaxLayer(0.7, 100, 100, 50, 50, color(100, 150, 255, 255)); // Foreground elements
    }

    /**
     * Draw a parallax layer with rectangles
     * @param {number} parallaxSpeed - Speed multiplier for parallax (0-1, where 1 moves with camera)
     * @param {number} spacing - Distance between rectangles
     * @param {number} height - Height of rectangles
     * @param {number} width - Width of rectangles
     * @param {number} yOffset - Vertical offset from bottom
     * @param {color} rectColor - Color of the rectangles
     */
    drawParallaxLayer(parallaxSpeed, spacing, height, width, yOffset, rectColor) {
        // Get camera offset for parallax calculations
        const cameraOffset = this.camera.getOffset();
        
        // Calculate parallax offset (preserve floating-point precision)
        const parallaxOffset = cameraOffset.x * parallaxSpeed;
        
        
        // Calculate visible range with floating-point precision
        const screenWidth = this.gameModel.canvasWidth;
        const leftEdge = -parallaxOffset - screenWidth;
        const rightEdge = -parallaxOffset + screenWidth * 2;
        
        // Calculate first rectangle index (allow floating-point precision)
        const firstIndex = Math.floor(leftEdge / spacing);
        const lastIndex = Math.ceil(rightEdge / spacing);
        
        fill(rectColor);
        noStroke();
        
        // Draw rectangles with precise floating-point positioning
        for (let i = firstIndex; i <= lastIndex; i++) {
            const rectX = i * spacing + parallaxOffset;
            const rectY = this.gameModel.canvasHeight - height - yOffset;
            rect(rectX, rectY, width, height);
        }
    }
    
    drawFrozenClones() {
        const frozenClones = this.gameModel.frozenClones;
        for (const clone of frozenClones) {
            // Check if frozen clone is within viewport before rendering
            if (this.gameModel.isEntityInViewport(clone)) {
                // Draw frozen clone as a player frame with a blue tint
                const position = clone.getPosition();
               
                
                // Set blue tint for frozen clones
                // Draw the animated sprite
                image(this.newSpriteSheet, position.x , position.y , this.gameModel.player.getSize(), this.gameModel.player.getSize(), 16*4, 16*7, 16, 16);
                
                
                const frame = clone.getAnimationFrame();
                const frameXPositions = [16*1,16*2,16*3,16*4,16*5,16*6]; // X coordinates for frames 0-5
                const spriteX = frameXPositions[frame];

                image(this.newSpriteSheet, position.x , position.y, this.gameModel.player.getSize(), this.gameModel.player.getSize(), spriteX, 16*2, 16, 16);
                

            }
        }
    }

    /**
     * Draw all platforms using tile-based rendering
     */
    drawPlatforms() {
        const platforms = this.gameModel.getPlatforms();
        for (const platform of platforms) {
            // Check if platform is within viewport before rendering
            if (this.gameModel.isEntityInViewport(platform)) {
                // Use tile-based platform renderer with all platforms for adjacency checking
                this.platformRenderer.drawPlatform(platform, platforms);
            }
        }
    }

    /**
     * Draw the player 
     */
    drawPlayer() {
        const player = this.gameModel.getPlayer();
        const position = player.getPosition();
    
        noSmooth(); // Disable anti-aliasing for pixel art look
        
        // Get current animation frame
        const frame = player.getAnimationFrame();
        
        // Calculate sprite sheet coordinates for each frame
        const frameXPositions = [16, 32, 48, 64]; // X coordinates for frames 0-3
        let spriteX = null;
        let spriteY = null;
        
        let destinationX = position.x ; // Center player on x
        let destinationY = position.y ; // Center player on y
        // Draw the animated sprite
        // image(this.spriteSheet, position.x, position.y, player.getSize(), player.getSize(), spriteX, spriteY, 16, 16);
        push();
        if( player.facingDirection === 'left') {
            scale(-1, 1);
            destinationX = -destinationX - player.getSize(); // Flip horizontally
        }

        if(player.physics.onGround){
            spriteX = player.isRunning? frameXPositions[frame] : frameXPositions[0];
            spriteY = 16*6;
        }else{
            spriteX = frameXPositions[frame];
            spriteY = 16*7;
        }
        image(this.newSpriteSheet,  destinationX, destinationY, player.getSize(), player.getSize(), spriteX, spriteY, 16, 16);
        pop();
    }
    drawCoins() {
        const coins = this.gameModel.getCoins();
        for (const coin of coins) {
            // Check if coin is within viewport before rendering
            if (this.gameModel.isEntityInViewport(coin)) {
                const position = { x: coin.x, y: coin.y };
                const size = coin.size;

                const frame = coin.getAnimationFrame();
                if (coin.isPlayingCustomAnimation) {                
                    const spriteX = 16*3;
                    const spriteY = 16*4; // Y coordinate for the player sprite rowd
                    
                    // Set blue tint for frozen clones
                    //tint(100, 100, 255, 200); // Light blue with some transparency
                    // Draw the animated sprite
                    image(this.newSpriteSheet, position.x , position.y , size, size, spriteX, spriteY, 16, 16);
                }else{
                    // Calculate sprite sheet coordinates for each frame
                    const frameXPositions = [16, 32, 48]; // X coordinates for frames 0-2
                    const spriteX = frameXPositions[frame];
                    const spriteY = 16*4; // Y coordinate for the player sprite rowd
                    
                    // Set blue tint for frozen clones
                    //tint(100, 100, 255, 200); // Light blue with some transparency
                    // Draw the animated sprite
                    image(this.newSpriteSheet, position.x , position.y , size, size, spriteX, spriteY, 16, 16);
                }
            }
        }
    }
    drawEnemies() {
        const enemies = this.gameModel.getEnemies();
        for (const enemy of enemies) {
            // Check if enemy is within viewport before rendering
            if (this.gameModel.isEntityInViewport(enemy)) {
                const position = { x: enemy.x, y: enemy.y };
                const size = enemy.size;

                // Draw the enemy as a star
                fill(255, 0, 0); // Red color
                stroke(0);
                strokeWeight(1);
                beginShape();
                for (let i = 0; i < 10; i++) {
                    const angle = TWO_PI / 10 * i - HALF_PI; // 10 points for star (5 outer + 5 inner)
                    const radius = (i % 2 === 0) ? size / 2 : size / 4; // Alternate between outer and inner radius
                    const x = position.x + size / 2 + cos(angle) * radius;
                    const y = position.y + size / 2 + sin(angle) * radius;
                    vertex(x, y);
                }
                endShape(CLOSE);
            }
        }
    }

    /**
     * Draw message overlays
     */
    drawMessages() {
        const messages = this.gameModel.getMessages();
        for (const message of messages) {
            // Check if message is within viewport before rendering
            if (this.gameModel.isEntityInViewport(message)) {
                // Set text properties
                fill(color(255, 255, 255,128));
                noStroke();
                textAlign(CENTER);
                textSize(23);
                
                // Draw the message text centered on the message tile
                const centerX = message.x + message.width / 2;
                const centerY = message.y + message.height / 2 + 5; 
                
                text(message.text, centerX, centerY);
                
                // Reset stroke for other drawings
                noStroke();
            }
        }
    }

    /**
     * Draw decal tiles (decorative elements with no collision)
     */
    drawDecals() {
        const decals = this.gameModel.getDecals();
        for (const decal of decals) {
            // Check if decal is within viewport before rendering
            if (this.gameModel.isEntityInViewport(decal)) {
                // Only draw if decal has source information
                if (decal.decalSource) {
                    const source = decal.decalSource;
                    
                    // Draw the decal sprite
                    image(
                        this.newSpriteSheet,
                        decal.x,
                        decal.y,
                        decal.width,
                        decal.height,
                        source.x, source.y, source.width, source.height
                    );
                }
            }
        }
    }

    /**
     * Draw debug bounds for all entities with collision boxes
     */
    drawDebugBounds() {
        // Draw player debug information
        const debugPlayer = this.gameModel.getPlayer();
        const position = debugPlayer.getPosition();
        const velocity = debugPlayer.getVelocity();
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        
        // Get camera offset for UI positioning
        const cameraOffset = this.camera.getOffset();
        const offsetX = 10 - cameraOffset.x;
        
        fill(0, 0, 255); // Blue color for debug info
        noStroke();
        textAlign(LEFT);
        textSize(12);
        let debugY = 200 - cameraOffset.y;
        text(`FPS: ${this.currentFPS}`, offsetX, debugY);
        debugY += 15;
        text(`Position: (${position.x.toFixed(1)}, ${position.y.toFixed(1)})`, offsetX, debugY);
        debugY += 15;
        text(`Velocity: (${velocity.x.toFixed(1)}, ${velocity.y.toFixed(1)})`, offsetX, debugY);
        debugY += 15;
        text(`Speed: ${speed.toFixed(1)} / ${debugPlayer.maxSpeed}`, offsetX, debugY);
        debugY += 15;
        text(`Size: ${debugPlayer.getSize()}`, offsetX, debugY);
        debugY += 15;
        
        // Draw placement cooldown info
        const placeCooldown = this.gameModel.getPlaceCooldown ? this.gameModel.getPlaceCooldown() : 0;
 
        if (placeCooldown > 0) {
            text(`Place Cooldown: ${(placeCooldown / 1000).toFixed(1)}s`, offsetX, debugY);
        } else {
            text(`Place: Ready`, offsetX, debugY);
        }
        debugY += 15;
        
        // Draw viewport info
        const viewport = this.gameModel.getViewport();
        text(`Viewport: L:${viewport.left.toFixed(0)} R:${viewport.right.toFixed(0)} T:${viewport.top.toFixed(0)} B:${viewport.bottom.toFixed(0)}`, offsetX, debugY);
        debugY += 15;
        
        // Count visible entities for culling debug info
        const totalEntities = this.gameModel.getPlatforms().length + this.gameModel.getCoins().length + 
                             this.gameModel.getEnemies().length + this.gameModel.getFrozenClones().length;
        const visibleEntities = this.gameModel.getPlatforms().filter(p => this.gameModel.isEntityInViewport(p)).length +
                               this.gameModel.getCoins().filter(c => this.gameModel.isEntityInViewport(c)).length +
                               this.gameModel.getEnemies().filter(e => this.gameModel.isEntityInViewport(e)).length +
                               this.gameModel.getFrozenClones().filter(f => this.gameModel.isEntityInViewport(f)).length;
        text(`Entities: ${visibleEntities}/${totalEntities} visible (${((1 - visibleEntities/totalEntities) * 100).toFixed(1)}% culled)`, offsetX, debugY);

        // Set light gray color for debug bounds
        stroke(180, 180, 180); // Light gray
        strokeWeight(1);
        noFill();

        // Draw player bounds and position
        const player = debugPlayer;
        if (player.bounds) {
            const playerBox = player.bounds.getCollisionBox(player);
            stroke(255, 0, 0, 128); 
            rect(playerBox.x, playerBox.y, playerBox.width, playerBox.height);
            
            
            stroke(255, 0, 0, 128); 
            strokeWeight(1);
            noFill();
            rect(player.x, player.y, player.getSize(), player.getSize());
        }

        // Draw coin bounds and positions
        const coins = this.gameModel.getCoins();
        for (const coin of coins) {
            if (coin.bounds && this.gameModel.isEntityInViewport(coin)) {
                // Draw bounds
                stroke(180, 180, 180);
                strokeWeight(1);
                noFill();
                const coinBox = coin.bounds.getCollisionBox(coin);
                rect(coinBox.x, coinBox.y, coinBox.width, coinBox.height);
                
                // Draw black border around entity
                stroke(0, 0, 0); // Black
                strokeWeight(1);
                noFill();
                rect(coin.x, coin.y, coin.size, coin.size);
            }
        }

        // Draw enemy bounds and positions
        const enemies = this.gameModel.getEnemies();
        for (const enemy of enemies) {
            if (enemy.bounds && this.gameModel.isEntityInViewport(enemy)) {
                // Draw bounds
                stroke(180, 180, 180);
                strokeWeight(1);
                noFill();
                const enemyBox = enemy.bounds.getCollisionBox(enemy);
                rect(enemyBox.x, enemyBox.y, enemyBox.width, enemyBox.height);
                
                // Draw black border around entity
                stroke(0, 0, 0); // Black
                strokeWeight(1);
                noFill();
                rect(enemy.x, enemy.y, enemy.size, enemy.size);
            }
        }

        // Draw platform bounds and positions
        const platforms = this.gameModel.getPlatforms();
        for (const platform of platforms) {
            if (platform.bounds && this.gameModel.isEntityInViewport(platform)) {
                // Draw bounds
                stroke(240, 230, 230);
                strokeWeight(1);
                noFill();
                const platformBox = platform.bounds.getCollisionBox(platform);
                rect(platformBox.x, platformBox.y, platformBox.width, platformBox.height);
                
                // Draw black border around entity
                stroke(0, 0, 0); // Black
                strokeWeight(1);
                noFill();
                rect(platform.x, platform.y, platform.width, platform.height);
            }
        }

        // Draw frozen clone bounds and positions
        const frozenClones = this.gameModel.frozenClones;
        for (const clone of frozenClones) {
            if (clone.bounds && this.gameModel.isEntityInViewport(clone)) {
                // Draw bounds
                stroke(0, 0, 255,128);
                strokeWeight(1);
                noFill();
                const cloneBox = clone.bounds.getCollisionBox(clone);
                rect(cloneBox.x, cloneBox.y, cloneBox.width, cloneBox.height);
                
                // Draw black border around entity
                stroke(0, 0, 255,128);
                strokeWeight(1);
                noFill();
                rect(clone.x, clone.y, clone.width, clone.height);
            }
        }

        // Draw anchor bounds and positions (grey boxes)
        const anchors = this.gameModel.getAnchors();
        for (const anchor of anchors) {
            // Draw anchor as a filled grey box
            fill(128, 128, 128, 150); // Semi-transparent grey
            stroke(100, 100, 100); // Darker grey border
            strokeWeight(2);
            rect(anchor.x, anchor.y, anchor.width, anchor.height);
            
            // Add a small "A" label for identification
            fill(255); // White text
            noStroke();
            textAlign(CENTER);
            textSize(12);
            text("A", anchor.x + anchor.width/2, anchor.y + anchor.height/2 + 4);
        }
        
        // Draw camera dead zone debug
        if (this.camera.showDeadZone) {
            // Calculate dead zone boundaries in world space
            const deadZoneLeft = (this.camera.canvasWidth - this.camera.deadZoneWidth) / 2 - this.camera.offsetX;
            const deadZoneRight = (this.camera.canvasWidth + this.camera.deadZoneWidth) / 2 - this.camera.offsetX;
            const deadZoneTop = (this.camera.canvasHeight - this.camera.deadZoneHeight) / 2 - this.camera.offsetY;
            const deadZoneBottom = (this.camera.canvasHeight + this.camera.deadZoneHeight) / 2 - this.camera.offsetY;
            
            // Draw dead zone rectangle
            stroke(255, 0, 255, 150); // Magenta with transparency
            strokeWeight(2);
            noFill();
            rect(deadZoneLeft, deadZoneTop, this.camera.deadZoneWidth, this.camera.deadZoneHeight);
            
            // Draw center crosshairs
            stroke(255, 0, 255, 100);
            strokeWeight(1);
            const centerX = this.camera.canvasWidth / 2 - this.camera.offsetX;
            const centerY = this.camera.canvasHeight / 2 - this.camera.offsetY;
            
            // Horizontal center line
            line(deadZoneLeft - 20, centerY, deadZoneRight + 20, centerY);
            // Vertical center line
            line(centerX, deadZoneTop - 20, centerX, deadZoneBottom + 20);
            
            // Reset stroke for other drawings
            strokeWeight(1);
            stroke(0);
        }
    }



    /**
     * Draw UI elements (score, instructions, etc.)
     */
    drawUI() {
        // Draw score and level
        fill(color(255, 255, 255,128));
        noStroke();
        textAlign(LEFT);
        textSize(26);
        
        // Get camera offset for UI positioning
        const cameraOffset = this.camera.getOffset();
        const uiOrigin = {x: -cameraOffset.x + 20, y:-cameraOffset.y + 20};
        const offsetX = uiOrigin.x + 20;
        let offsetY = uiOrigin.y + 40;
        
        
        
        fill(0, 0, 0, 128);
        image(this.newSpriteSheet, uiOrigin.x + 32*0, uiOrigin.y, 32, 32, 16*8, 16*5, 16, 16);
        image(this.newSpriteSheet, uiOrigin.x + 32*1, uiOrigin.y, 32, 32, 16*9, 16*5, 16, 16);
        image(this.newSpriteSheet, uiOrigin.x + 32*2, uiOrigin.y, 32, 32, 16*9, 16*5, 16, 16);
        image(this.newSpriteSheet, uiOrigin.x + 32*3, uiOrigin.y, 32, 32, 16*9, 16*5, 16, 16);
        image(this.newSpriteSheet, uiOrigin.x + 32*4, uiOrigin.y, 32, 32, 16*9, 16*5, 16, 16);
        image(this.newSpriteSheet, uiOrigin.x + 32*5, uiOrigin.y, 32, 32, 16*9, 16*5, 16, 16);
        image(this.newSpriteSheet, uiOrigin.x + 32*6, uiOrigin.y, 32, 32, 16*10, 16*5, 16, 16);
        rect(uiOrigin.x, uiOrigin.y , 32*7, 32);
        
        
        fill(0, 0, 0, 128);
        image(this.newSpriteSheet, uiOrigin.x , uiOrigin.y +32 , 32, 32, 16*8, 16*6, 16, 16);
        rect(uiOrigin.x , uiOrigin.y +32 , 32, 32);

        image(this.newSpriteSheet, uiOrigin.x + 32*6, uiOrigin.y +32 , 32, 32, 16*10, 16*6, 16, 16);
        fill(0, 0, 0, 128);
        rect(uiOrigin.x + 32*6, uiOrigin.y +32 , 32, 32);

        
        fill(0, 0, 0, 128);
        image(this.newSpriteSheet, uiOrigin.x + 32*0, uiOrigin.y +32*2, 32, 32, 16*8, 16*7, 16, 16);
        image(this.newSpriteSheet, uiOrigin.x + 32*1, uiOrigin.y +32*2, 32, 32, 16*9, 16*7, 16, 16);
        image(this.newSpriteSheet, uiOrigin.x + 32*2, uiOrigin.y +32*2, 32, 32, 16*9, 16*7, 16, 16);
        image(this.newSpriteSheet, uiOrigin.x + 32*3, uiOrigin.y +32*2, 32, 32, 16*9, 16*7, 16, 16);
        image(this.newSpriteSheet, uiOrigin.x + 32*4, uiOrigin.y +32*2, 32, 32, 16*9, 16*7, 16, 16);
        image(this.newSpriteSheet, uiOrigin.x + 32*5, uiOrigin.y +32*2, 32, 32, 16*9, 16*7, 16, 16);
        image(this.newSpriteSheet, uiOrigin.x + 32*6, uiOrigin.y +32*2, 32, 32, 16*10,16*7, 16, 16);
        rect(uiOrigin.x, uiOrigin.y+32*2 , 32*7, 32);

        //draw trasparent black rectangle behind text
        fill(0, 0, 0, 190);
        rect(uiOrigin.x +8 , uiOrigin.y +8 , 208, 80);

        // Draw score with cooldown color transition
        const placeCooldown = this.gameModel.getPlaceCooldown ? this.gameModel.getPlaceCooldown() : 0;
        const totalCooldownTime = this.gameModel.getPlaceCooldownTime ? this.gameModel.getPlaceCooldownTime() : 1000;

        const defaultColor = color(255, 255, 255, 128);
        if (placeCooldown > 0) {
            // 0 = just started cooldown, 1 = cooldown finished
            const cooldownProgress = 1 - (placeCooldown / totalCooldownTime); 
            const startColor = color(135, 183, 224);
            const interpolatedColor = lerpColor(startColor, defaultColor, cooldownProgress);
            fill(interpolatedColor);
        } else {
            // Default white color when no cooldown
            fill(defaultColor);
        }
        
       
        offsetY = uiOrigin.y + 28; // Reset offsetY to start position
        // Draw level info
        text(`Loop: ${this.gameModel.getCurrentLevel()}/${this.gameModel.getMaxLevel()}`, offsetX, offsetY);
        
        
        text(`Snowflakes: ${this.gameModel.getScore()} / ${this.gameModel.getTotalCoins() }`, offsetX, offsetY+=20);

        // Draw frozen clone statistics
        const stats = this.gameModel.getStats();
        text(`Active Clones: ${this.gameModel.getFrozenClones().length}/${this.gameModel.getCloneLimit()}`, offsetX, offsetY+=20);

        /*
        // Draw game status
        if (!this.gameModel.isRunning()) {
            fill(255, 0, 0);
            textAlign(CENTER);
            textSize(32);
            text('PAUSED', width / 2, height / 2);
        }
        */
        fill(defaultColor);

    }

    /**
     * Handle window resize
     */
    onResize() {
        // Keep canvas size consistent
        const canvasDimensions = this.gameModel.getCanvasDimensions();
        resizeCanvas(canvasDimensions.width, canvasDimensions.height);
        
        // Update camera with new canvas dimensions
        this.camera.canvasWidth = canvasDimensions.width;
        this.camera.canvasHeight = canvasDimensions.height;
    }

    /**
     * Get camera instance for external access
     * @returns {Camera} Camera instance
     */
    getCamera() {
        return this.camera;
    }

    /**
     * Set debug bounds visibility
     * @param {boolean} show - Whether to show debug bounds
     */
    setShowDebugBounds(show) {
        this.showDebugBounds = show;
    }

    /**
     * Draw level reset animation overlay
     * @param {Object} animationState - Animation state from GameModel
     */
    drawLevelResetAnimation(animationState) {
        const progress = animationState.progress;
        const alpha = Math.sin(progress * Math.PI) * 255; 
        
        push();
        resetMatrix();
        
        // Draw dark overlay covering the entire screen
        fill(0, 0, 0, alpha); 
        noStroke();
        rect(0, 0, width, height);
        /*
        if (progress > 0.25 && progress < 0.75) {
            const textAlpha = map(progress, 0.25, 0.75, 0, 128);
            fill(255, 255, 255, 128); // Light blue-white text
            textAlign(CENTER, CENTER);
            textSize(24);
            textStyle(BOLD);
            text("Bending spacetime", width / 2, height / 2);
        }
        */
        // Add square particle effects for visual flair
  
            const particleCount = 16;
            for (let i = 0; i < particleCount; i++) {
                const angle = (TWO_PI / particleCount) * i + (progress * TWO_PI);
                const radius = map(progress, 0.1, 0.9, 50, 100);
                const x = width / 2 + cos(angle) * radius;
                const y = height / 2 + sin(angle) * radius;
                
                fill(77, 83, 103, alpha ); 
                noStroke();
                rect(x - 2, y - 2, 4, 4); // 4x4 square particles
            }
        
        
        pop();
    }

    /**
     * Draw title screen
     */
    drawTitleScreen() {
        background(0); // Black background
        
        
        image(this.titleArtwork, 0, 0, width, height); // Draw title artwork

        // Add some animated particles for visual flair
        const time = millis() * 0.0004;
        const particleCount = 24;
        if(!this.randomOffsets){
            this.randomOffsets = [];
            for (let i = 0; i < particleCount; i++) this.randomOffsets.push(Math.random() ); 
        }
        for (let i = 0; i < particleCount; i++) {
            const x = width  / 2 + cos(time + i) * 230 - 16 + 32*this.randomOffsets[i] ; // Randomize position slightly
            const y = height / 2 + sin(time + i) * 190      + 32*this.randomOffsets[i]; // Randomize position slightly

            //image(this.newSpriteSheet, x, y, 32, 32, 16*2, 16*2, 16, 16);
                fill(255, 255, 255, 128 ); 
                noStroke();
                rect(x - 2, y - 2, 4, 4); // 4x4 square particles
        }
        
        
        fill(255, 255, 255,128);
        textAlign(CENTER, CENTER);
        
        // Game title
        textSize(48);
        text("CRYSTALLIZED", width / 2, height / 2 - 160);
        
        // Subtitle or instruction
        textSize(24);
        textStyle(NORMAL);
        text("Press SPACEBAR to start", width / 2, height / 2 + 160);
    }

    /**
     * Draw end screen with statistics
     */
    drawEndScreen() {
        background(0); // Black background
        
        fill(255, 255, 255,128);
        textAlign(CENTER, CENTER);
        
        // Congratulations title
        textSize(48);
        text("CONGRATULATIONS!", width / 2, height / 2 - 120);
        
        textSize(24);
        textStyle(NORMAL);
        text("You completed all levels!", width / 2, height / 2 - 80);
        
        // Display statistics
        const stats = this.gameModel.getStats();
        textSize(24);
        textAlign(LEFT, CENTER);
        
        const startX = width / 2 - 150;
        let currentY = height / 2 - 30;
        const lineHeight = 25;
        
        text(`Total Clones Created: ${stats.frozenClonesPlaced}`, startX, currentY);
        currentY += lineHeight;
        text(`Total Clones Destroyed: ${stats.frozenClonesDestroyed}`, startX, currentY);
        currentY += lineHeight;
        text(`Loop restart: ${stats.loopRestarts}`, startX, currentY);
        currentY += lineHeight;
        text(`Loop rewind: ${stats.levelBackwards}`, startX, currentY);
        currentY += lineHeight;

        // Instruction to continue
        textAlign(CENTER, CENTER);
        textSize(24);
        text("Press SPACEBAR to return to title", width / 2, height / 2 + 120);
        
   
    }

    /**
     * Clean up view resources
     */
    destroy() {
        if (this.canvas) {
            this.canvas.remove();
        }
    }
}
