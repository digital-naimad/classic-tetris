var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * Boots application
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var Starter = /** @class */ (function () {
    function Starter() {
        GameEventsManager.registerGameEnd(this.onGameEnd, this);
    }
    Starter.prototype.startApplication = function () {
        GameMode.device = DeviceOption.DESKTOP;
        var gameWidth = 800;
        var gameHeight = 600;
        new Game(gameWidth, gameHeight, Phaser.AUTO);
    };
    /**
    * Game End event listener
    */
    Starter.prototype.onGameEnd = function () {
    };
    return Starter;
}());
window.addEventListener('load', function () {
    var webFontConfig = {
        custom: {
            families: [
                FontOption.Emulogic
            ],
            urls: [
                PathOption.ASSETS + '/' + PathOption.FONTS_STYLES + '/' + FontOption.Emulogic + '.' + ExtensionOption.css
            ]
        }
    };
    webFontConfig.loading = new Starter().startApplication;
    WebFont.load(webFontConfig);
});
/**
 * Game's main entry point
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    /**
     * Prepares all needed states (PreloaderState, DebugState, TitleState, GameplayState, GameOverState) and starts with PreloaderState
     * @param width Width of the game
     * @param height Height of the game
     * @param renderer Phaser render mode (Phaser.AUTO | Phaser.CANVAS | Phaser.WEBGL)
     */
    function Game(width, height, renderer) {
        var _this = _super.call(this, width, height, renderer, AssetKey.phaserCanvas) || this;
        /**
         * Setups Game States
         */
        GameEventsManager.registerGoToInitState(_this.initGame, _this);
        GameEventsManager.registerGoToPreloaderState(_this.goToPreloaderState, _this);
        GameEventsManager.registerGoToTitleState(_this.goToTitleState, _this);
        GameEventsManager.registerGoToGameplayState(_this.goToGameplayState, _this);
        GameEventsManager.registerGoToGameOverState(_this.goToGameOverState, _this);
        _this.state.add(GameStateOption.INIT_STATE, InitState, false);
        _this.state.add(GameStateOption.PRELOADER_STATE, PreloaderState, false);
        _this.state.add(GameStateOption.TITLE_STATE, TitleState, false);
        _this.state.add(GameStateOption.GAMEPLAY_STATE, GameplayState, false);
        _this.state.add(GameStateOption.GAME_OVER_STATE, GameOverState, false);
        GameEventsManager.dispatchGoToInitState();
        return _this;
    }
    /**
     * Starts Game
     */
    Game.prototype.initGame = function () {
        this.state.start(GameStateOption.INIT_STATE, false, false);
    };
    /**
     * Preloads Game assets, plugins etc
     */
    Game.prototype.goToPreloaderState = function () {
        this.state.start(GameStateOption.PRELOADER_STATE, true, false);
    };
    /**
     * Goes to Title State
     */
    Game.prototype.goToTitleState = function () {
        this.state.start(GameStateOption.TITLE_STATE, true, false);
    };
    /**
    * Starts Gameplay
    */
    Game.prototype.goToGameplayState = function () {
        this.state.start(GameStateOption.GAMEPLAY_STATE, true, false);
    };
    /**
     * Starts Game
     */
    Game.prototype.goToGameOverState = function (finalScore) {
        this.state.start(GameStateOption.GAME_OVER_STATE, true, false);
    };
    return Game;
}(Phaser.Game));
/**
 * Game Modes management class
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var GameMode = /** @class */ (function () {
    function GameMode() {
    }
    Object.defineProperty(GameMode, "isDebug", {
        /**
         * Debug mode
         */
        get: function () {
            if (!GameMode._debugFlag) {
                GameMode._debugFlag = false;

            }
            return GameMode._debugFlag;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameMode, "isBonusMode", {
        /**
         * Gameplay modes
         */
        get: function () {
            return GameMode._isBonusMode;
        },
        set: function (value) {
            GameMode._isBonusMode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameMode, "isAdrenoGPU", {
        get: function () {
            return GameMode._isAndrenoGPU;
        },
        set: function (value) {
            GameMode._isAndrenoGPU = value;
            if (value == true) {
                GameMode.areShadersSupported = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameMode, "isMobile", {
        get: function () {
            return GameMode.device == DeviceOption.MOBILE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameMode, "isDesktop", {
        get: function () {
            return GameMode.device == DeviceOption.DESKTOP;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameMode, "isTablet", {
        get: function () {
            return GameMode.device == DeviceOption.TABLET;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Input modes
     * isKeyboardDownMode: Keyboard input events should be triggering by down or up state of the key
     */
    GameMode.isKeyboardDownMode = true;
    /**
     * GPU detection
     */
    GameMode.areShadersSupported = true;
    GameMode._isAndrenoGPU = false;
    return GameMode;
}());
/**
 * Game Setting's class of static fields and Device depended getters. The idea: all hardcoded values in one place
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var GameSetting = /** @class */ (function () {
    function GameSetting() {
    }
    Object.defineProperty(GameSetting, "splashLogoScaleBase", {
        // Splash logo scale
        get: function () {
            switch (GameMode.device) {
                case DeviceOption.MOBILE:
                case DeviceOption.DESKTOP:
                case DeviceOption.TABLET:
                default:
                    return .5;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameSetting, "scoreFloaterTextSize", {
        /**
         * Score floaters
         */
        get: function () {
            switch (GameMode.device) {
                case DeviceOption.MOBILE:
                case DeviceOption.DESKTOP:
                case DeviceOption.TABLET:
                default:
                    return 48;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameSetting, "hudButtonIdleScale", {
        get: function () {
            switch (GameMode.device) {
                case DeviceOption.MOBILE:
                case DeviceOption.DESKTOP:
                case DeviceOption.TABLET:
                default:
                    return 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameSetting, "popupMaskAlpha", {
        get: function () {
            return GameMode.device == DeviceOption.MOBILE ? .65 : .35;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameSetting, "tutorialButtonScaleBase", {
        /**
         * Tutorial / Help popup
         */
        get: function () {
            switch (GameMode.device) {
                case DeviceOption.MOBILE:
                case DeviceOption.DESKTOP:
                case DeviceOption.TABLET:
                default:
                    return 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameSetting, "tutorialCheckboxScale", {
        get: function () {
            switch (GameMode.device) {
                case DeviceOption.MOBILE:
                case DeviceOption.DESKTOP:
                case DeviceOption.TABLET:
                default:
                    return 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameSetting, "quitPopupButtonScaleBase", {
        /**
         * Quit popup
         */
        get: function () {
            switch (GameMode.device) {
                case DeviceOption.MOBILE:
                case DeviceOption.DESKTOP:
                case DeviceOption.TABLET:
                default:
                    return 1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameSetting, "gameOverFloaterMaxScale", {
        /**
         * Greetings floaters
         */
        get: function () {
            switch (GameMode.device) {
                case DeviceOption.MOBILE:
                case DeviceOption.DESKTOP:
                case DeviceOption.TABLET:
                default:
                    return .75;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Time
     */
    GameSetting.gameplayDuration = 2 * Phaser.Timer.MINUTE;
    GameSetting.finalCountDownTrigger = 10 * Phaser.Timer.SECOND;
    GameSetting.tileSeriesIncrementTrigger = 10 * Phaser.Timer.SECOND;
    GameSetting.boardLoopInterval = Phaser.Timer.QUARTER;
    /**
     * Score
     */
    GameSetting.scoreLimit = 999999;
    GameSetting.pointsForLines = [
        [40, 100, 300, 1200],
        [80, 200, 600, 2400],
        [120, 300, 900, 3600],
        [400, 1000, 3000, 12000]
    ];
    /**
     * Levels
     */
    GameSetting.startingLevel = 0;
    /**
     * Lives
     */
    GameSetting.startNumberOfLives = 3;
    GameSetting.liveIndicatorOutDuration = Phaser.Timer.SECOND;
    /**
     * Background
     */
    GameSetting.backgroundFill = 0x0;
    /**
     * Title / Splash Screen
     */
    GameSetting.titleStateLifespan = 4 * Phaser.Timer.SECOND;
    GameSetting.splashAnimationInDuration = 2 * Phaser.Timer.SECOND;
    GameSetting.splashAnimationOutDuration = 2 * Phaser.Timer.SECOND;
    GameSetting.splashLogoMaxScale = 1.5;
    /**
     * Game Board logic
     */
    GameSetting.tetrionMatrixSize = new Phaser.Point(10, 20);
    GameSetting.spawnPosition = new Phaser.Point(GameSetting.tetrionMatrixSize.x / 2 - 1, 0);
    /**
     * Game Board animations
     */
    GameSetting.introStepDuration = Phaser.Timer.QUARTER / 4;
    GameSetting.boardOutDuration = Phaser.Timer.HALF;
    GameSetting.boardHighlightAlpha = .25;
    GameSetting.boardHighlightLifespan = Phaser.Timer.QUARTER;
    GameSetting.boardLineClearDuration = Phaser.Timer.HALF;
    /**
     * Blocks
     */
    GameSetting.blockIdleScale = .5;
    /**
     * GUI Labels
     */
    GameSetting.guiLabelIdleScale = 1;
    GameSetting.guiLabelMaxScale = 1.1;
    GameSetting.guiLabelBumpDuration = Phaser.Timer.QUARTER;
    /**
     * GUI Dim/Fade Out
     */
    GameSetting.hudDimDuration = Phaser.Timer.SECOND;
    GameSetting.hudDim = 0x0;
    GameSetting.hudDimAlpha = .65;
    GameSetting.hudDimEasing = Phaser.Easing.Exponential.In;
    /**
     * HUD
     */
    GameSetting.hudInDuration = Phaser.Timer.SECOND;
    GameSetting.hudOutDuration = Phaser.Timer.SECOND;
    GameSetting.timerIdleColor = 'rgb(255, 255, 255)';
    GameSetting.timerFinalColor = 'rgb(255, 55, 55)';
    GameSetting.nextShapePreviewScale = .55;
    /**
     * GUI & Popups Buttons & Checkbox
     */
    GameSetting.guiButtonMinScale = .95;
    GameSetting.guiButtonMaxScale = 1.05;
    GameSetting.guiButtonIdleScale = 1;
    GameSetting.guiButtonScaleDuration = Phaser.Timer.QUARTER;
    /**
     * Popups
     */
    GameSetting.popupTransitionDuration = Phaser.Timer.HALF;
    GameSetting.popupMaskTint = 0x0;
    GameSetting.popupFrameRadius = 10;
    GameSetting.popupFrameAlpha = .65;
    GameSetting.popupFrameTint = 0x0;
    GameSetting.popupBackgroundAlpha = 1;
    /**
    * Quit & Time's Up Greetings
    */
    GameSetting.quitGreetingsLifespan = 3 * Phaser.Timer.SECOND;
    GameSetting.completeGreetingsLifespan = 3 * Phaser.Timer.SECOND;
    GameSetting.gameOverFloaterMinScale = .05;
    /**
     * Game Over
    */
    GameSetting.gameOverDimAlpha = .6;
    GameSetting.gameOverOutDuration = Phaser.Timer.SECOND;
    GameSetting.gameOverAnimationDelay = 3 * Phaser.Timer.SECOND;
    GameSetting.gameOverAnimationDuration = Phaser.Timer.SECOND;
    GameSetting.gameOverAnimationOutDuration = 10 * Phaser.Timer.SECOND;
    /**
     * Sound manager
     */
    GameSetting.backgroundMusicVolume = .2; // range <0.0;1.0>
    GameSetting.randomMinVolume = 0.3;
    GameSetting.randomMaxVolume = 0.9;
    return GameSetting;
}());
/**
 * Board's Signals management class
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var BoardEventsManager = /** @class */ (function () {
    function BoardEventsManager() {
    }
    /**
    * Dispatches Board Lock Event
    */
    BoardEventsManager.lockBoard = function () {
        BoardEventsManager.boardLock.dispatch();
    };
    BoardEventsManager.registerBoardLock = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = false; }
        if (callbackOnce) {
            BoardEventsManager.boardLock.addOnce(callback, callbackContext);
        }
        else {
            BoardEventsManager.boardLock.add(callback, callbackContext);
        }
    };
    BoardEventsManager.unregisterBoardLock = function (callback, callbackContext) {
        BoardEventsManager.boardLock.remove(callback, callbackContext);
    };
    BoardEventsManager.removeBoardLock = function () {
        BoardEventsManager.boardLock.removeAll();
    };
    /**
    * Dispatches Board Unlock Event
    */
    BoardEventsManager.unlockBoard = function (delay) {
        if (delay === void 0) { delay = 0; }
        BoardEventsManager.boardUnlock.dispatch(delay);
    };
    BoardEventsManager.registerBoardUnlock = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = false; }
        if (callbackOnce) {
            BoardEventsManager.boardUnlock.addOnce(callback, callbackContext);
        }
        else {
            BoardEventsManager.boardUnlock.add(callback, callbackContext);
        }
    };
    BoardEventsManager.unregisterBoardUnlock = function (callback, callbackContext) {
        BoardEventsManager.boardUnlock.remove(callback, callbackContext);
    };
    BoardEventsManager.removeBoardUnlock = function () {
        BoardEventsManager.boardUnlock.removeAll();
    };
    BoardEventsManager.boardLock = new Phaser.Signal();
    BoardEventsManager.boardUnlock = new Phaser.Signal();
    return BoardEventsManager;
}());
/**
 * Game flow's signals management class
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var GameEventsManager = /** @class */ (function () {
    function GameEventsManager() {
    }
    /**
    * Dispatches Go to Init State Event
    */
    GameEventsManager.dispatchGoToInitState = function () {
        GameEventsManager.goToInitState.dispatch();
    };
    GameEventsManager.registerGoToInitState = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = true; }
        if (callbackOnce) {
            GameEventsManager.goToInitState.addOnce(callback, callbackContext);
        }
        else {
            GameEventsManager.goToInitState.add(callback, callbackContext);
        }
    };
    /**
    * Dispatches Go to Preloader State Event
    */
    GameEventsManager.dispatchGoToPreloaderState = function () {
        GameEventsManager.goToPreloadState.dispatch();
    };
    GameEventsManager.registerGoToPreloaderState = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = true; }
        if (callbackOnce) {
            GameEventsManager.goToPreloadState.addOnce(callback, callbackContext);
        }
        else {
            GameEventsManager.goToPreloadState.add(callback, callbackContext);
        }
    };
    /**
    * Dispatches Go to Debug State Event
    */
    GameEventsManager.dispatchGoToDebugState = function () {
        GameEventsManager.goToDebugState.dispatch();
    };
    GameEventsManager.registerGoToDebugState = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = true; }
        if (callbackOnce) {
            GameEventsManager.goToDebugState.addOnce(callback, callbackContext);
        }
        else {
            GameEventsManager.goToDebugState.add(callback, callbackContext);
        }
    };
    /**
    * Dispatches Go to Title State Event
    */
    GameEventsManager.dispatchGoToTitleState = function () {
        GameEventsManager.goToTitleState.dispatch();
    };
    GameEventsManager.registerGoToTitleState = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = true; }
        if (callbackOnce) {
            GameEventsManager.goToTitleState.addOnce(callback, callbackContext);
        }
        else {
            GameEventsManager.goToTitleState.add(callback, callbackContext);
        }
    };
    /**
    * Dispatches Go to Gameplay State Event
    */
    GameEventsManager.dispatchGoToGameplayState = function () {
        GameEventsManager.goToGameplayState.dispatch();
    };
    GameEventsManager.registerGoToGameplayState = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = true; }
        if (callbackOnce) {
            GameEventsManager.goToGameplayState.addOnce(callback, callbackContext);
        }
        else {
            GameEventsManager.goToGameplayState.add(callback, callbackContext);
        }
    };
    /**
    * Dispatches Go to Game Over State Event
    */
    GameEventsManager.dispatchGoToGameOverState = function (finalScore) {
        GameEventsManager.goToGameOverState.dispatch(finalScore);
    };
    GameEventsManager.registerGoToGameOverState = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = true; }
        if (callbackOnce) {
            GameEventsManager.goToGameOverState.addOnce(callback, callbackContext);
        }
        else {
            GameEventsManager.goToGameOverState.add(callback, callbackContext);
        }
    };
    /**
     * Notifies about game start
     */
    GameEventsManager.notifyGameStarted = function () {
        GameEventsManager.gameStarted.dispatch();
    };
    GameEventsManager.registerGameStart = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = true; }
        if (callbackOnce) {
            GameEventsManager.gameStarted.addOnce(callback, callbackContext);
        }
        else {
            GameEventsManager.gameStarted.add(callback, callbackContext);
        }
    };
    /**
     * Notifies backend service about game end
     */
    GameEventsManager.notifyGameEnd = function () {
        GameEventsManager.gameEnd.dispatch();
    };
    GameEventsManager.registerGameEnd = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = true; }
        if (callbackOnce) {
            GameEventsManager.gameEnd.addOnce(callback, callbackContext);
        }
        else {
            GameEventsManager.gameEnd.add(callback, callbackContext);
        }
    };
    GameEventsManager.gameStarted = new Phaser.Signal();
    GameEventsManager.gameEnd = new Phaser.Signal();
    GameEventsManager.goToInitState = new Phaser.Signal;
    GameEventsManager.goToPreloadState = new Phaser.Signal;
    GameEventsManager.goToDebugState = new Phaser.Signal;
    GameEventsManager.goToTitleState = new Phaser.Signal;
    GameEventsManager.goToGameplayState = new Phaser.Signal;
    GameEventsManager.goToGameOverState = new Phaser.Signal;
    return GameEventsManager;
}());
/**
 * Gameplay Signals management class
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var GameplayEventsManager = /** @class */ (function () {
    function GameplayEventsManager() {
    }
    /**
   * Starts Gameplay
   */
    GameplayEventsManager.startGameplay = function () {
        GameplayEventsManager._startGameplay.dispatch();
    };
    GameplayEventsManager.registerGameplayStart = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = true; }
        if (callbackOnce) {
            GameplayEventsManager._startGameplay.addOnce(callback, callbackContext);
        }
        else {
            GameplayEventsManager._startGameplay.add(callback, callbackContext);
        }
    };
    GameplayEventsManager.unregisterGameplayStart = function (callback, callbackContext) {
        if (!callback) {
            GameplayEventsManager._startGameplay.removeAll();
        }
        else {
            GameplayEventsManager._startGameplay.remove(callback, callbackContext);
        }
    };
    /**
      * Ends Gameplay
      */
    GameplayEventsManager.endGameplay = function (endOption) {
        GameplayEventsManager._endGameplay.dispatch(endOption);
    };
    GameplayEventsManager.registerGameplayEnd = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = true; }
        if (callbackOnce) {
            GameplayEventsManager._endGameplay.addOnce(callback, callbackContext);
        }
        else {
            GameplayEventsManager._endGameplay.add(callback, callbackContext);
        }
    };
    GameplayEventsManager.unregisterGameplayEnd = function (callback, callbackContext) {
        if (!callback) {
            GameplayEventsManager._endGameplay.removeAll();
        }
        else {
            GameplayEventsManager._endGameplay.remove(callback, callbackContext);
        }
    };
    GameplayEventsManager._startGameplay = new Phaser.Signal();
    GameplayEventsManager._endGameplay = new Phaser.Signal();
    return GameplayEventsManager;
}());
/**
 * Game HUD Signals management class
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
*/
var HUDEventsManager = /** @class */ (function () {
    function HUDEventsManager() {
    }
    /**
    * Button Help click event
    */
    HUDEventsManager.dispatchButtonHelpClick = function () {
        HUDEventsManager.buttonHelp.dispatch();
    };
    HUDEventsManager.registerButtonHelpClick = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = true; }
        if (callbackOnce) {
            HUDEventsManager.buttonHelp.addOnce(callback, callbackContext);
        }
        else {
            HUDEventsManager.buttonHelp.add(callback, callbackContext);
        }
    };
    HUDEventsManager.removeButtonHelpClickListeners = function () {
        HUDEventsManager.buttonHelp.removeAll();
    };
    /**
    * Music Button click Event
    */
    HUDEventsManager.dispatcButtonMusicClick = function () {
        HUDEventsManager.buttonMusic.dispatch();
    };
    HUDEventsManager.registerButtonMusicClick = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = false; }
        if (callbackOnce) {
            HUDEventsManager.buttonMusic.addOnce(callback, callbackContext);
        }
        else {
            HUDEventsManager.buttonMusic.add(callback, callbackContext);
        }
    };
    HUDEventsManager.removeButtonMusicClickListeners = function () {
        HUDEventsManager.buttonMusic.removeAll();
    };
    /**
    * SFX Button Audio click Event
    */
    HUDEventsManager.dispatchButtonSoundClick = function () {
        HUDEventsManager.buttonSound.dispatch();
    };
    HUDEventsManager.registerButtonSoundClick = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = false; }
        if (callbackOnce) {
            HUDEventsManager.buttonSound.addOnce(callback, callbackContext);
        }
        else {
            HUDEventsManager.buttonSound.add(callback, callbackContext);
        }
    };
    HUDEventsManager.removeButtonSoundClickListeners = function () {
        HUDEventsManager.buttonSound.removeAll();
    };
    /**
    * Button Quit click Event
    */
    HUDEventsManager.dispatchButtonQuitClick = function () {
        HUDEventsManager.buttonQuit.dispatch();
    };
    HUDEventsManager.registerButtonQuitClick = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = true; }
        if (callbackOnce) {
            HUDEventsManager.buttonQuit.addOnce(callback, callbackContext);
        }
        else {
            HUDEventsManager.buttonQuit.add(callback, callbackContext);
        }
    };
    HUDEventsManager.removeButtonQuitClickListeners = function () {
        HUDEventsManager.buttonQuit.removeAll();
    };
    HUDEventsManager.buttonHelp = new Phaser.Signal();
    HUDEventsManager.buttonMusic = new Phaser.Signal();
    HUDEventsManager.buttonSound = new Phaser.Signal();
    HUDEventsManager.buttonQuit = new Phaser.Signal();
    return HUDEventsManager;
}());
/**
 * Keyboard events management
 * @author      dsremski <d.sremski@gmail.com>
 * @version     12.05.2021
 * @copyright   2021 Damian Śremski
 */
var KeyboardEventsManager = /** @class */ (function () {
    function KeyboardEventsManager(game) {
        this.game = game;
        this.upKeyClicked = new Phaser.Signal();
        this.downKeyClicked = new Phaser.Signal();
        this.leftKeyClicked = new Phaser.Signal();
        this.rightKeyClicked = new Phaser.Signal();
        this.cursorKeys = this.game.input.keyboard.createCursorKeys();
    }
    /**
     * Enables/disables dispatching of keyboard events
     * @param isOn default: true
     */
    KeyboardEventsManager.prototype.enableEventsDispatching = function (isOn) {
        if (isOn === void 0) { isOn = true; }
        if (isOn) {
            if (GameMode.isKeyboardDownMode) {
                this.addKeyDownCallback();
            }
            else {
                this.addKeyDownCallback();
            }
        }
        else {
            if (GameMode.isKeyboardDownMode) {
                this.removeKeyDownCallback();
            }
            else {
                this.removeKeyUpCallback();
            }
        }
    };
    /**
     * Registers callbacks for a key clicked events with provided context
     * @param keyCode
     * @param onClickedCallback
     * @param callbackContext
     * @param callbackOnce optional: default false
     */
    KeyboardEventsManager.prototype.registerForKeyClicked = function (keyCode, onClickedCallback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = false; }
        var keyClickedSignal = this.getKeyClickedSignal(keyCode);
        if (keyClickedSignal == null) {
            console.log("Cannot register callback for keyCode " + keyCode);
        }
        else {
            if (callbackOnce) {
                keyClickedSignal.addOnce(onClickedCallback, callbackContext);
            }
            else {
                keyClickedSignal.add(onClickedCallback, callbackContext);
            }
        }
    };
    /**
     *
     * @param keyCode
     */
    KeyboardEventsManager.prototype.removeKeyClickedListener = function (keyCode, callback, callbackContext) {
        var keyClickedSignal = this.getKeyClickedSignal(keyCode);
        if (keyClickedSignal == null) {
            console.log("Cannot remove callback for keyCode " + keyCode);
        }
        else {
            if (callback) {
                keyClickedSignal.remove(callback, callbackContext ? callbackContext : undefined);
            }
            else {
                keyClickedSignal.removeAll();
            }
        }
    };
    /**
     *
     * @param keyCode
     * @returns warning: can be null
     */
    KeyboardEventsManager.prototype.getKeyClickedSignal = function (keyCode) {
        switch (keyCode) {
            case Phaser.KeyCode.UP:
                return this.upKeyClicked;
            case Phaser.KeyCode.DOWN:
                return this.downKeyClicked;
            case Phaser.KeyCode.LEFT:
                return this.leftKeyClicked;
            case Phaser.KeyCode.RIGHT:
                return this.rightKeyClicked;
            default:
                return null;
        }
    };
    KeyboardEventsManager.prototype.addKeyUpCallback = function () {
        this.game.input.keyboard.addCallbacks(this, undefined, this.onKeyUp);
    };
    KeyboardEventsManager.prototype.addKeyDownCallback = function () {
        this.game.input.keyboard.addCallbacks(this, undefined, this.onKeyDown);
    };
    KeyboardEventsManager.prototype.removeKeyUpCallback = function () {
        this.game.input.keyboard.onUpCallback = null;
        this.game.input.keyboard.callbackContext = null;
    };
    KeyboardEventsManager.prototype.removeKeyDownCallback = function () {
        this.game.input.keyboard.onDownCallback = null;
        this.game.input.keyboard.callbackContext = null;
    };
    KeyboardEventsManager.prototype.onKeyUp = function () {
        if (this.cursorKeys.left.justUp) {
            this.leftKeyClicked.dispatch();
        }
        if (this.cursorKeys.right.justUp) {
            this.rightKeyClicked.dispatch();
        }
        if (this.cursorKeys.up.justUp) {
            this.upKeyClicked.dispatch();
        }
        if (this.cursorKeys.down.justUp) {
            this.downKeyClicked.dispatch();
        }
    };
    KeyboardEventsManager.prototype.onKeyDown = function () {
        if (!this.cursorKeys) {
            return;
        }
        if (this.cursorKeys.left.justDown) {
            this.leftKeyClicked.dispatch();
        }
        if (this.cursorKeys.right.justDown) {
            this.rightKeyClicked.dispatch();
        }
        if (this.cursorKeys.up.justDown) {
            this.upKeyClicked.dispatch();
        }
        if (this.cursorKeys.down.justDown) {
            this.downKeyClicked.dispatch();
        }
    };
    return KeyboardEventsManager;
}());
/**
 * Score & Lives Events dispatcher
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
*/
var ScoreEventsManager = /** @class */ (function () {
    function ScoreEventsManager() {
    }
    /**
    * Adds given number of points to current score
    * @param pointsToAdd integer: number of points
    */
    ScoreEventsManager.addToScore = function (pointsToAdd) {
        if (pointsToAdd != 0) {
            ScoreEventsManager.addPoints.dispatch(pointsToAdd);
        }
    };
    ScoreEventsManager.registerAddToScore = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = false; }
        if (callbackOnce) {
            ScoreEventsManager.addPoints.addOnce(callback, callbackContext);
        }
        else {
            ScoreEventsManager.addPoints.add(callback, callbackContext);
        }
    };
    ScoreEventsManager.removeAddToScoreListeners = function () {
        ScoreEventsManager.addPoints.removeAll();
    };
    /**
    * Score update Event
    * @param currentScore integer: current number of points
    */
    ScoreEventsManager.dispatchScoreUpdate = function (currentScore) {
        ScoreEventsManager.scoreUpdate.dispatch(currentScore);
    };
    ScoreEventsManager.registerScoreUpdate = function (callback, callbackContext, callbackOnce) {
        if (callbackOnce === void 0) { callbackOnce = false; }
        if (callbackOnce) {
            ScoreEventsManager.scoreUpdate.addOnce(callback, callbackContext);
        }
        else {
            ScoreEventsManager.scoreUpdate.add(callback, callbackContext);
        }
    };
    ScoreEventsManager.removeScoreUpdateListeners = function () {
        ScoreEventsManager.scoreUpdate.removeAll();
    };
    ScoreEventsManager.addPoints = new Phaser.Signal();
    ScoreEventsManager.scoreUpdate = new Phaser.Signal();
    return ScoreEventsManager;
}());
/**
 * Game Area Controller class
 * @author      dsremski <d.sremski@gmail.com>
 * @version     12.05.2021
 * @copyright   2021 Damian Śremski
 */
var BoardController = /** @class */ (function () {
    function BoardController(game, gameplayLayout, hud) {
        this.game = game;
        this.gameplayLayout = gameplayLayout;
        this.hud = hud;
        // TODO: move this to result manager
        this.linesCounter = 0;
        this.levelCounter = 0;
    }
    Object.defineProperty(BoardController.prototype, "nextTetrominoShape", {
        get: function () {
            return this._nextTetrominoShape;
        },
        set: function (shape) {
            this._nextTetrominoShape = shape;
            this.hud.showNextShape(shape);
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    BoardController.prototype.init = function (keyboard) {
        this.keyboard = keyboard;
        this.tetrion = new Tetrion(this.game, this.gameplayLayout.tetrionGroup);
        this.tetromino = new Tetromino(this.game, this.gameplayLayout.tetrominoesGroup);
        this.setupTweens();
        this.registerEventsListeners();
    };
    /**
     *
     */
    BoardController.prototype.startGameplay = function () {
        this.nextTetrominoShape = BoardUtils.randomTetrominoShape;
        this.setupTimerEvent();
        this.throwTetromino();
    };
    BoardController.prototype.pauseGameplay = function () {
        this.removeTimerEvent();
    };
    BoardController.prototype.resumeGameplay = function () {
        this.setupTimerEvent();
    };
    /**
     *
     */
    BoardController.prototype.endGameplay = function () {
        this.removeTimerEvent();
    };
    /**
     * Board's In/Out animations
     * @param duration in miliseconds
     * @param callback onComplete listener
     * @param callbackContext onComplete listener's context
     */
    BoardController.prototype.animate = function (isOut, duration, callback, callbackContext) {
        switch (GameMode.device) {
            case DeviceOption.MOBILE:
            case DeviceOption.DESKTOP:
            case DeviceOption.TABLET:
            default:
                this.fade(isOut, duration, callback, callbackContext);
                break;
        }
    };
    /**
     * Fade In/Out Board animation with alpha
     * @param isOut
     * @param duration
     * @param onCompleteCallback
     * @param callbackContext
     */
    BoardController.prototype.fade = function (isOut, duration, onCompleteCallback, callbackContext) {
        this.gameplayLayout.boardGroup.alpha = isOut ? 1 : 0;
        this.boardFadeAction.to({
            alpha: isOut ? 0 : 1
        }, duration, Phaser.Easing.Linear.None, false);
        if (onCompleteCallback) {
            this.boardFadeAction.onComplete.addOnce(onCompleteCallback, callbackContext);
        }
        this.boardFadeAction.start();
    };
    /**
     *
     * @param delay default: 0
     */
    BoardController.prototype.unlock = function (delay) {
        if (delay === void 0) { delay = 0; }
        this.game.time.events.add(delay, this.attachInputListeners, this);
    };
    /**
     * Lock
     */
    BoardController.prototype.lock = function () {
        this.removeInputListeners();
    };
    /**
     *
     */
    BoardController.prototype.animateIntro = function (onCompleteCallback, callbackContext) {
        var delay = 0;
        this.game.time.events.add(delay + GameSetting.introStepDuration * 4, onCompleteCallback, callbackContext);
    };
    /**
    * Removes Events listeners etc
    */
    BoardController.prototype.dispose = function () {
        this.linesCounter = 0;
        this.levelCounter = 0;
        this.tetrion.clearLinesWithAnimation(Phaser.ArrayUtils.numberArray(0, GameSetting.tetrionMatrixSize.y - 1), function () {
        }, this);
        this.unregisterEventsListeners();
    };
    /**
    *
    */
    BoardController.prototype.attachInputListeners = function () {
        this.keyboard.registerForKeyClicked(Phaser.KeyCode.LEFT, this.performLeftKeyAction, this);
        this.keyboard.registerForKeyClicked(Phaser.KeyCode.RIGHT, this.performRightKeyAction, this);
        this.keyboard.registerForKeyClicked(Phaser.KeyCode.UP, this.performRotationKeyAction, this);
        this.keyboard.registerForKeyClicked(Phaser.KeyCode.DOWN, this.performHardDropKeyAction, this);
    };
    /**
     *
     */
    BoardController.prototype.removeInputListeners = function () {
        this.keyboard.removeKeyClickedListener(Phaser.KeyCode.LEFT, this.performLeftKeyAction, this);
        this.keyboard.removeKeyClickedListener(Phaser.KeyCode.RIGHT, this.performRightKeyAction, this);
        this.keyboard.removeKeyClickedListener(Phaser.KeyCode.UP, this.performRotationKeyAction, this);
        this.keyboard.removeKeyClickedListener(Phaser.KeyCode.DOWN, this.performHardDropKeyAction, this);
    };
    BoardController.prototype.throwTetromino = function () {
        this.tetromino.applyShapeAndRotation(this.nextTetrominoShape);
        this.tetromino.setPosition(BoardUtils.getFixedSpawnPosition(this.tetromino.tetrominoMatrix));
        this.tetromino.changeVisibility(true);
        this.isPending = false;
        this.nextTetrominoShape = BoardUtils.randomTetrominoShape;
    };
    BoardController.prototype.setupTimerEvent = function () {
        this.timerLoopEvent = this.game.time.events.loop(GameSetting.boardLoopInterval, this.update, this);
    };
    BoardController.prototype.removeTimerEvent = function () {
        this.game.time.events.remove(this.timerLoopEvent);
    };
    /**
     * Updates game board with precise time interval given by value of GameSetting.timerLoopInterval field
     */
    BoardController.prototype.update = function () {
        var _this = this;
        if (this.isPending) {
            return;
        }
        if (this.tetrion.checkCollisions(this.tetromino, MoveType.down)) {
            this.tetromino.changeVisibility(false);
            this.tetrion.copyTetrominoBlocksToTetrion(this.tetromino);
            if (this.checkIfGameIsOver()) {
                this.doEndTheGame();
            }
            else {
                var numberOfClearedLines = this.tetrion.checkAndClearLines(this.tetromino, function () {
                    _this.throwTetromino();
                }, this);
                if (numberOfClearedLines > 0) {
                    this.isPending = true;
                    // TODO: lines counting should be moved to results manager and also triggered by an adequate board's event
                    this.linesCounter += numberOfClearedLines;
                    this.hud.updateLinesCounter(this.linesCounter);
                    var cachedLevel = this.levelCounter;
                    this.levelCounter = Math.floor(this.linesCounter / 20);
                    if (this.levelCounter > cachedLevel) {
                        this.hud.updateLevelCounter(this.levelCounter);
                    }
                    // TODO: score calculations should be moved to Score manager and also triggered by an adequate board's event
                    var scoredPoints = ScoreController.getScoreForNumberOfLinesAtGivenLevel(numberOfClearedLines, this.levelCounter);
                    ScoreEventsManager.addToScore(scoredPoints);
                    SoundManager.playClip(numberOfClearedLines == 4 ? SoundOption.TETRIS : SoundOption.LINE);
                }
            }
            this.tetromino.setPosition(BoardUtils.getFixedSpawnPosition(this.tetromino.tetrominoMatrix));
        }
        else {
            this.tetromino.move(MoveType.down);
        }
    };
    BoardController.prototype.checkIfGameIsOver = function () {
        return this.tetromino.positionOnMatrix.y < 0; // ;D
    };
    BoardController.prototype.doEndTheGame = function () {
        this.removeTimerEvent();
        this.tetromino.changeVisibility(false);
        GameplayEventsManager.endGameplay(GameplayEndOption.REASON_GAME_OVER);
    };
    /**
     * Keyboard input listeners
     */
    BoardController.prototype.performLeftKeyAction = function () {
        if (!this.tetrion.checkCollisions(this.tetromino, MoveType.left)) {
            this.tetromino.move(MoveType.left);
        }
    };
    BoardController.prototype.performRightKeyAction = function () {
        if (!this.tetrion.checkCollisions(this.tetromino, MoveType.right)) {
            this.tetromino.move(MoveType.right);
        }
    };
    BoardController.prototype.performHardDropKeyAction = function () {
        while (!this.tetrion.checkCollisions(this.tetromino, MoveType.drop)) {
            this.tetromino.move(MoveType.drop);
        }
        SoundManager.playClip(SoundOption.DROP);
    };
    BoardController.prototype.performRotationKeyAction = function () {
        if (!this.tetrion.checkCollisions(this.tetromino, MoveType.rotate)) {
            this.tetromino.move(MoveType.rotate);
        }
    };
    /**
     * Registers Puzzle Piece Drag Start, Stop & Matched Board Events listeners
     */
    BoardController.prototype.registerEventsListeners = function () {
        BoardEventsManager.registerBoardLock(this.lock, this);
        BoardEventsManager.registerBoardUnlock(this.unlock, this);
    };
    /**
     * Unregisters Card Drag Start, Stop & Matched Board Events listeners
     */
    BoardController.prototype.unregisterEventsListeners = function () {
        BoardEventsManager.unregisterBoardLock(this.lock, this);
        BoardEventsManager.unregisterBoardUnlock(this.unlock, this);
    };
    BoardController.prototype.setupTweens = function () {
        this.boardFadeAction = this.game.add.tween(this.gameplayLayout.boardGroup);
    };
    return BoardController;
}());
/**
 * Contains visuals and controls logic of tetris playfield
 * @author      dsremski <d.sremski@gmail.com>
 * @version     12.05.2021
 * @copyright   2021 Damian Śremski
 */
var Tetrion = /** @class */ (function () {
    function Tetrion(game, tetrionGroup) {
        this.game = game;
        this.tetrionGroup = tetrionGroup;
        this.setupTetrionAndBlockSpritesMatrixes();
    }
    Object.defineProperty(Tetrion.prototype, "tetrionMatrix", {
        get: function () {
            return this._tetrionMatrix;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Checks possible collisions with board's borders and blocks depending on moveType given by a parameter
     * @param tetromino piece to check
     * @param moveType enum: left/right/down/rotate
     * @returns boolean: true if collided
     */
    Tetrion.prototype.checkCollisions = function (tetromino, moveType) {
        var tetrominoMatrix = moveType == MoveType.rotate ? tetromino.rotatedTetrominoMatrix : tetromino.tetrominoMatrix;
        for (var iRow = 0; iRow < tetrominoMatrix.length; iRow++) {
            for (var iColumn = 0; iColumn < tetrominoMatrix[0].length; iColumn++) {
                if (tetrominoMatrix[iRow][iColumn] != TetrominoShape.E) {
                    switch (moveType) {
                        case MoveType.down:
                        case MoveType.drop:
                            {
                                var fixedPosition = new Phaser.Point(tetromino.positionOnMatrix.x + iColumn, tetromino.positionOnMatrix.y + iRow + 1);
                                // collision with board's floor
                                if (fixedPosition.y >= GameSetting.tetrionMatrixSize.y) {
                                    return true;
                                }
                                // collision with block at the bottom
                                if (this.checkCollisionWithBlock(fixedPosition)) {
                                    return true;
                                }
                            }
                            break;
                        case MoveType.left:
                            {
                                var fixedPosition = new Phaser.Point(tetromino.positionOnMatrix.x + iColumn - 1, tetromino.positionOnMatrix.y + iRow);
                                // collision with left side of the board
                                if (fixedPosition.x < 0) {
                                    return true;
                                }
                                // collision with block on the left
                                if (this.checkCollisionWithBlock(fixedPosition)) {
                                    return true;
                                }
                            }
                            break;
                        case MoveType.right:
                            {
                                var fixedPosition = new Phaser.Point(tetromino.positionOnMatrix.x + iColumn + 1, tetromino.positionOnMatrix.y + iRow);
                                // collision with right side of the board
                                if (fixedPosition.x >= GameSetting.tetrionMatrixSize.x) {
                                    return true;
                                }
                                // collision with block on the right
                                if (this.checkCollisionWithBlock(fixedPosition)) {
                                    return true;
                                }
                            }
                            break;
                        case MoveType.rotate:
                            {
                                var fixedPosition = new Phaser.Point(tetromino.positionOnMatrix.x + iColumn, tetromino.positionOnMatrix.y + iRow);
                                // collision with right side of the board
                                if (fixedPosition.x < 0 ||
                                    fixedPosition.x >= GameSetting.tetrionMatrixSize.x ||
                                    fixedPosition.y >= GameSetting.tetrionMatrixSize.y) {
                                    return true;
                                }
                                // collision with block
                                if (this.checkCollisionWithBlock(fixedPosition)) {
                                    return true;
                                }
                            }
                            break;
                    }
                }
            }
        }
        return false;
    };
    /**
     *
     * @param tetromino
     */
    Tetrion.prototype.copyTetrominoBlocksToTetrion = function (tetromino) {
        for (var iRow = 0; iRow < tetromino.tetrominoMatrix.length; iRow++) {
            for (var iColumn = 0; iColumn < tetromino.tetrominoMatrix[0].length; iColumn++) {
                var shapeToAdd = tetromino.tetrominoMatrix[iRow][iColumn];
                if (shapeToAdd != TetrominoShape.E) {
                    var fixedPosition = new Phaser.Point(tetromino.positionOnMatrix.x + iColumn, tetromino.positionOnMatrix.y + iRow);
                    if (fixedPosition.y > 0) {
                        this.tetrionMatrix[fixedPosition.y][fixedPosition.x] = shapeToAdd;
                        this.addBlockSprite(shapeToAdd, fixedPosition);
                    }
                }
            }
        }
    };
    /**
     * @returns number of lines cleared at this call (0-4)
     */
    Tetrion.prototype.checkAndClearLines = function (tetromino, onCompleteCallback, callbackContext) {
        var _this = this;
        var lineIndices = [];
        for (var iRow = tetromino.positionOnMatrix.y; iRow < tetromino.positionOnMatrix.y + tetromino.tetrominoMatrix.length && iRow < this.tetrionMatrix.length; iRow++) {
            var iColumn = 0;
            for (; iColumn < GameSetting.tetrionMatrixSize.x; iColumn++) {
                if (this.tetrionMatrix[iRow][iColumn] == TetrominoShape.E) {
                    break;
                }
            }
            if (iColumn == GameSetting.tetrionMatrixSize.x) {
                lineIndices.push(iRow);
            }
        }
        lineIndices.reverse(); // for using splice method safe
        if (lineIndices.length > 0) {
            this.clearLinesWithAnimation(lineIndices, function () {
                _this.collapse(lineIndices, onCompleteCallback, callbackContext);
            }, this);
        }
        else {
            onCompleteCallback.bind(callbackContext)();
        }
        return lineIndices.length;
    };
    /**
     *
     * @param indices
     * @param onCompleteCallback
     * @param callbackContext
     */
    Tetrion.prototype.clearLinesWithAnimation = function (indices, onCompleteCallback, callbackContext) {
        var _this = this;
        var tweenedObject = {
            counter: 0
        };
        var clearAnimation = this.game.add.tween(tweenedObject);
        clearAnimation.to({
            counter: GameSetting.tetrionMatrixSize.x / 2
        }, GameSetting.boardLineClearDuration, Phaser.Easing.Linear.None, false);
        clearAnimation.onUpdateCallback(function () {
            var snappedCounter = Phaser.Math.snapTo(tweenedObject.counter, 1);
            var indexLeft = Math.max(GameSetting.tetrionMatrixSize.x / 2 - 1 - snappedCounter, 0);
            var indexRight = Math.min(GameSetting.tetrionMatrixSize.x / 2 + snappedCounter, GameSetting.tetrionMatrixSize.x - 1);
            for (var _i = 0, indices_1 = indices; _i < indices_1.length; _i++) {
                var iRow = indices_1[_i];
                if (_this.tetrionMatrix[iRow][indexLeft] != TetrominoShape.E) {
                    _this.tetrionMatrix[iRow][indexLeft] = TetrominoShape.E;
                    _this.blockSprites[iRow][indexLeft].visible = false;
                }
                if (_this.tetrionMatrix[iRow][indexRight] != TetrominoShape.E) {
                    _this.tetrionMatrix[iRow][indexRight] = TetrominoShape.E;
                    _this.blockSprites[iRow][indexRight].visible = false;
                }
            }
        }, this);
        clearAnimation.onComplete.add(function () {
            for (var _i = 0, indices_2 = indices; _i < indices_2.length; _i++) {
                var iRow = indices_2[_i];
                for (var iColumn = 0; iColumn < GameSetting.tetrionMatrixSize.x; iColumn++) {
                    if (_this.blockSprites[iRow][iColumn] != null) {
                        _this.blockSprites[iRow][iColumn].destroy();
                        _this.blockSprites[iRow][iColumn] = null;
                    }
                }
            }
        }, this);
        clearAnimation.onComplete.add(onCompleteCallback, callbackContext);
        clearAnimation.start();
    };
    /**
     * Note: It is safe to do that starting with the highest index values
     * @param indices number[]: values should be in descending order
     * @param onCompleteCallback
     * @param callbackContext
     */
    Tetrion.prototype.collapse = function (indices, onCompleteCallback, callbackContext) {
        for (var _i = 0, indices_3 = indices; _i < indices_3.length; _i++) {
            var iRow = indices_3[_i];
            this.tetrionMatrix.splice(iRow, 1);
            this.blockSprites.splice(iRow, 1);
        }
        for (var _a = 0, indices_4 = indices; _a < indices_4.length; _a++) {
            var index = indices_4[_a];
            this.addEmptyRowOnTop();
        }
        this.updateBlockSpritesPositions();
        onCompleteCallback.bind(callbackContext)();
    };
    /**
     * Adds row fullfilled with empty shape to tetrionMatrix and also null-filled row  on blockSprites array top
     */
    Tetrion.prototype.addEmptyRowOnTop = function () {
        var emptyLogicRow = [];
        var emptySpriteRow = [];
        for (var iColumn = 0; iColumn < GameSetting.tetrionMatrixSize.x; iColumn++) {
            emptyLogicRow[iColumn] = TetrominoShape.E;
            emptySpriteRow[iColumn] = null;
        }
        this.tetrionMatrix.unshift(emptyLogicRow);
        this.blockSprites.unshift(emptySpriteRow);
    };
    Tetrion.prototype.updateBlockSpritesPositions = function () {
        for (var iRow = 0; iRow < GameSetting.tetrionMatrixSize.y; iRow++) {
            for (var iColumn = 0; iColumn < GameSetting.tetrionMatrixSize.x; iColumn++) {
                var positionOnMatrix = new Phaser.Point(iColumn, iRow);
                if (this.tetrionMatrix[iRow][iColumn] != TetrominoShape.E) {
                    var spritePosition = Phaser.Point.multiply(positionOnMatrix, BoardUtils.blockSize);
                    this.blockSprites[iRow][iColumn].position.set(spritePosition.x, spritePosition.y);
                }
            }
        }
    };
    Tetrion.prototype.setupTetrionAndBlockSpritesMatrixes = function () {
        this._tetrionMatrix = [];
        this.blockSprites = [];
        for (var iRow = 0; iRow < GameSetting.tetrionMatrixSize.y; iRow++) {
            this.addEmptyRowOnTop();
        }
    };
    /**
     *
     * @param positionToCheck
     * @returns boolean: true if there is a collision detected
     */
    Tetrion.prototype.checkCollisionWithBlock = function (positionToCheck) {
        if (positionToCheck.x >= 0 && positionToCheck.x < GameSetting.tetrionMatrixSize.x &&
            positionToCheck.y >= 0 && positionToCheck.y < GameSetting.tetrionMatrixSize.y) {
            if (this.tetrionMatrix[positionToCheck.y][positionToCheck.x] != TetrominoShape.E) {
                return true;
            }
        }
        return false;
    };
    Tetrion.prototype.addBlockSprite = function (shapeToAdd, positionOnMatrix) {
        var spritePosition = Phaser.Point.multiply(positionOnMatrix, BoardUtils.blockSize);
        var blockSprite = this.game.add.sprite(spritePosition.x, spritePosition.y, AtlasOption.boardAtlas, BoardUtils.getBlockFrameName(shapeToAdd), this.tetrionGroup);
        blockSprite.scale.set(GameSetting.blockIdleScale);
        this.blockSprites[positionOnMatrix.y][positionOnMatrix.x] = blockSprite;
    };
    return Tetrion;
}());
var TetrominoShape;
(function (TetrominoShape) {
    TetrominoShape[TetrominoShape["I"] = 0] = "I";
    TetrominoShape[TetrominoShape["T"] = 1] = "T";
    TetrominoShape[TetrominoShape["O"] = 2] = "O";
    TetrominoShape[TetrominoShape["L"] = 3] = "L";
    TetrominoShape[TetrominoShape["J"] = 4] = "J";
    TetrominoShape[TetrominoShape["S"] = 5] = "S";
    TetrominoShape[TetrominoShape["Z"] = 6] = "Z";
    /**
     * 'e' like empty
     */
    TetrominoShape[TetrominoShape["E"] = 7] = "E";
})(TetrominoShape || (TetrominoShape = {}));
///  <reference path="../enums/TetrominoShape.ts"/>
/**
 * Contains visuals and controls logic of single tetrimino
 * @author      dsremski <d.sremski@gmail.com>
 * @version     10.05.2021
 * @copyright   2021 Damian Śremski
 */
var Tetromino = /** @class */ (function () {
    /**
     *
     * @param game
     * @param parentGroup
     * @param _currentShape
     * @param _currentRotation
     */
    function Tetromino(game, parentGroup, _currentShape, _currentRotation) {
        if (_currentShape === void 0) { _currentShape = TetrominoShape.E; }
        if (_currentRotation === void 0) { _currentRotation = TetrominoRotation.up; }
        this.game = game;
        this.parentGroup = parentGroup;
        this._currentShape = _currentShape;
        this._currentRotation = _currentRotation;
        this.prepareAllPossibleShapes();
        this._positionOnMatrix = new Phaser.Point();
    }
    Object.defineProperty(Tetromino.prototype, "pieceGroup", {
        // Accessors
        /**
         *
         * @returns Phaser.Group: container depending on currently applied PieceShape and PieceRotation
         */
        get: function () {
            return this._pieceGroups[this._currentShape][this._currentRotation]; //  
            //return this._containerGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tetromino.prototype, "tetrominoMatrix", {
        /**
         *
         * @returns PieceShape[][]: tetrominoMatrix depending on applied PieceShape and PieceRotation
         */
        get: function () {
            return Tetromino.shapes[this._currentShape][this._currentRotation];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tetromino.prototype, "rotatedTetrominoMatrix", {
        /**
         * @returns PieceShape[][]: tetrominoMatrix depending on applied PieceShape with temporary incremented rotation
         */
        get: function () {
            var nextRotation = (this._currentRotation + 1) % 4;
            return Tetromino.shapes[this._currentShape][nextRotation];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Tetromino.prototype, "positionOnMatrix", {
        /**
         *
         */
        get: function () {
            return this._positionOnMatrix;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param isVisible
     */
    Tetromino.prototype.changeVisibility = function (isVisible) {
        this.pieceGroup.visible = isVisible;
    };
    /**
     * Shows current group and hides the others. Also caches future shape and rotation as current
     * @param futureShape
     * @param futureRotation
     */
    Tetromino.prototype.applyShapeAndRotation = function (futureShape, futureRotation) {
        if (futureShape === void 0) { futureShape = this._currentShape; }
        if (futureRotation === void 0) { futureRotation = this._currentRotation; }
        this._pieceGroups[this._currentShape][this._currentRotation].visible = false;
        this._pieceGroups[futureShape][futureRotation].visible = true;
        this._currentShape = futureShape;
        this._currentRotation = futureRotation;
    };
    /**
     *
     * @param positionOnMatrix
     */
    Tetromino.prototype.setPosition = function (positionOnMatrix) {
        this._positionOnMatrix.set(positionOnMatrix.x, positionOnMatrix.y);
        this.pieceGroup.position = positionOnMatrix.multiply(BoardUtils.blockSize.x, BoardUtils.blockSize.y);
    };
    /**
     * Applies logic movement of type given in parameter. Also updates visual representation of tetromino
     * @param moveType
     */
    Tetromino.prototype.move = function (moveType) {
        switch (moveType) {
            case MoveType.left:
                this._positionOnMatrix.x--;
                this.pieceGroup.x = this._positionOnMatrix.x * BoardUtils.blockSize.x;
                break;
            case MoveType.right:
                this._positionOnMatrix.x++;
                this.pieceGroup.x = this._positionOnMatrix.x * BoardUtils.blockSize.x;
                break;
            case MoveType.down:
            case MoveType.drop:
                this._positionOnMatrix.y++;
                this.pieceGroup.y = this._positionOnMatrix.y * BoardUtils.blockSize.y;
                break;
            case MoveType.rotate:
                var nextRotation = (this._currentRotation + 1) % 4;
                this.applyShapeAndRotation(this._currentShape, nextRotation);
                this.pieceGroup.x = this._positionOnMatrix.x * BoardUtils.blockSize.x;
                this.pieceGroup.y = this._positionOnMatrix.y * BoardUtils.blockSize.y;
                break;
            default:
        }
    };
    Tetromino.prototype.prepareAllPossibleShapes = function () {
        this.createPieceGroups();
        this.fullfillPieceGroupsWithSprites();
    };
    Tetromino.prototype.createPieceGroups = function () {
        this._pieceGroups = [];
        for (var iShape = TetrominoShape.I; iShape <= TetrominoShape.E; iShape++) {
            this._pieceGroups[iShape] = [];
            for (var iRotation = TetrominoRotation.up; iRotation <= TetrominoRotation.left; iRotation++) {
                this._pieceGroups[iShape][iRotation] = this.game.add.group(this.parentGroup);
                this._pieceGroups[iShape][iRotation].visible = false;
            }
        }
    };
    Tetromino.prototype.fullfillPieceGroupsWithSprites = function () {
        for (var iShape = TetrominoShape.I; iShape <= TetrominoShape.Z; iShape++) {
            for (var iRotation = TetrominoRotation.up; iRotation <= TetrominoRotation.left; iRotation++) {
                for (var iRow = 0; iRow < Tetromino.shapes[iShape][iRotation].length; iRow++) {
                    for (var iColumn = 0; iColumn < Tetromino.shapes[iShape][iRotation][iRow].length; iColumn++) {
                        if (Tetromino.shapes[iShape][iRotation][iRow][iColumn] != TetrominoShape.E) {
                            var blockSprite = this.game.add.sprite(iColumn * BoardUtils.blockSize.x, iRow * BoardUtils.blockSize.y, AtlasOption.boardAtlas, BoardUtils.getBlockFrameName(iShape), this._pieceGroups[iShape][iRotation]);
                            blockSprite.scale.set(GameSetting.blockIdleScale);
                        }
                    }
                }
            }
        }
    };
    // Static members
    /**
     * Note: indexed by PieceShape enum
     */
    Tetromino.colorNames = [
        "violet",
        "light_blue",
        "orange",
        "blue",
        "pink",
        "green",
        "red",
        "transparent" // 7 = E (empty)
    ];
    /**
     * Note: indexed by PieceShape enum, Rotation enum, matrix rows and columns
     */
    Tetromino.shapes = [
        // PieceShape.I = 0
        [
            // PieceRotation.up
            [
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.I, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.I, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.I, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.I, TetrominoShape.E]
            ],
            // PieceRotation.right
            [
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.I, TetrominoShape.I, TetrominoShape.I, TetrominoShape.I],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E, TetrominoShape.E]
            ],
            // PieceRotation.down
            [
                [TetrominoShape.E, TetrominoShape.I, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.I, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.I, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.I, TetrominoShape.E, TetrominoShape.E]
            ],
            // PieceRotation.left
            [
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.I, TetrominoShape.I, TetrominoShape.I, TetrominoShape.I],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E, TetrominoShape.E]
            ],
        ],
        // PieceShape.T = 1
        [
            // PieceRotation.up
            [
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.T, TetrominoShape.T, TetrominoShape.T],
                [TetrominoShape.E, TetrominoShape.T, TetrominoShape.E]
            ],
            // PieceRotation.right
            [
                [TetrominoShape.E, TetrominoShape.T, TetrominoShape.E],
                [TetrominoShape.T, TetrominoShape.T, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.T, TetrominoShape.E]
            ],
            // PieceRotation.down
            [
                [TetrominoShape.E, TetrominoShape.T, TetrominoShape.E],
                [TetrominoShape.T, TetrominoShape.T, TetrominoShape.T],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E]
            ],
            // PieceRotation.left
            [
                [TetrominoShape.E, TetrominoShape.T, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.T, TetrominoShape.T],
                [TetrominoShape.E, TetrominoShape.T, TetrominoShape.E]
            ]
        ],
        // PieceShape.O = 2
        [
            // PieceRotation.up
            [
                [TetrominoShape.O, TetrominoShape.O],
                [TetrominoShape.O, TetrominoShape.O]
            ],
            // PieceRotation.right
            [
                [TetrominoShape.O, TetrominoShape.O],
                [TetrominoShape.O, TetrominoShape.O]
            ],
            // PieceRotation.down
            [
                [TetrominoShape.O, TetrominoShape.O],
                [TetrominoShape.O, TetrominoShape.O]
            ],
            // PieceRotation.left
            [
                [TetrominoShape.O, TetrominoShape.O],
                [TetrominoShape.O, TetrominoShape.O]
            ]
        ],
        // PieceShape.L = 3
        [
            // PieceRotation.up
            [
                [TetrominoShape.E, TetrominoShape.L, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.L, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.L, TetrominoShape.L]
            ],
            // PieceRotation.right
            [
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.L, TetrominoShape.L, TetrominoShape.L],
                [TetrominoShape.L, TetrominoShape.E, TetrominoShape.E]
            ],
            // PieceRotation.down
            [
                [TetrominoShape.L, TetrominoShape.L, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.L, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.L, TetrominoShape.E]
            ],
            // PieceRotation.left
            [
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.L],
                [TetrominoShape.L, TetrominoShape.L, TetrominoShape.L],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E]
            ]
        ],
        // PieceShape.J = 4
        [
            // PieceRotation.up
            [
                [TetrominoShape.E, TetrominoShape.J, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.J, TetrominoShape.E],
                [TetrominoShape.J, TetrominoShape.J, TetrominoShape.E]
            ],
            // PieceRotation.right
            [
                [TetrominoShape.J, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.J, TetrominoShape.J, TetrominoShape.J],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E]
            ],
            // PieceRotation.down
            [
                [TetrominoShape.E, TetrominoShape.J, TetrominoShape.J],
                [TetrominoShape.E, TetrominoShape.J, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.J, TetrominoShape.E]
            ],
            // PieceRotation.left
            [
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.J, TetrominoShape.J, TetrominoShape.J],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.J]
            ]
        ],
        // PieceShape.S = 5
        [
            // PieceRotation.up
            [
                [TetrominoShape.E, TetrominoShape.S, TetrominoShape.S],
                [TetrominoShape.S, TetrominoShape.S, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E]
            ],
            // PieceRotation.right
            [
                [TetrominoShape.E, TetrominoShape.S, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.S, TetrominoShape.S],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.S]
            ],
            // PieceRotation.down
            [
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.S, TetrominoShape.S],
                [TetrominoShape.S, TetrominoShape.S, TetrominoShape.E]
            ],
            // PieceRotation.left
            [
                [TetrominoShape.S, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.S, TetrominoShape.S, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.S, TetrominoShape.E]
            ]
        ],
        // PieceShape.Z = 6
        [
            // PieceRotation.up
            [
                [TetrominoShape.Z, TetrominoShape.Z, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.Z, TetrominoShape.Z],
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E]
            ],
            // PieceRotation.right
            [
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.Z],
                [TetrominoShape.E, TetrominoShape.Z, TetrominoShape.Z],
                [TetrominoShape.E, TetrominoShape.Z, TetrominoShape.E]
            ],
            // PieceRotation.down
            [
                [TetrominoShape.E, TetrominoShape.E, TetrominoShape.E],
                [TetrominoShape.Z, TetrominoShape.Z, TetrominoShape.E],
                [TetrominoShape.E, TetrominoShape.Z, TetrominoShape.Z]
            ],
            // PieceRotation.left
            [
                [TetrominoShape.E, TetrominoShape.Z, TetrominoShape.E],
                [TetrominoShape.Z, TetrominoShape.Z, TetrominoShape.E],
                [TetrominoShape.Z, TetrominoShape.E, TetrominoShape.E]
            ]
        ],
        // PieceShape.E = 7
        [
            // PieceRotation.up
            [
                [TetrominoShape.E]
            ],
            // PieceRotation.right
            [
                [TetrominoShape.E]
            ],
            // PieceRotation.down
            [
                [TetrominoShape.E]
            ],
            // PieceRotation.left
            [
                [TetrominoShape.E]
            ],
        ],
    ];
    return Tetromino;
}());
/**
 * Game HUD displaying Controller
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var HUDController = /** @class */ (function () {
    function HUDController(game, hudLayout, gameplayLayout) {
        this.game = game;
        this.hudLayout = hudLayout;
        this.gameplayLayout = gameplayLayout;
        this.cachedScore = 0;
        this.cachedNumberOfLines = 0;
        this._tutorialPopup = new TutorialPopup(this.game);
        this._resultsPopup = new ResultsPopup(this.game);
        this._quitPopup = new QuitPopup(this.game);
    }
    Object.defineProperty(HUDController.prototype, "tutorialPopup", {
        /**
        * Tutorial Popup controller
        */
        get: function () {
            return this._tutorialPopup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDController.prototype, "resultsPopup", {
        /**
        * Results Popup controller
        */
        get: function () {
            return this._resultsPopup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDController.prototype, "quitPopup", {
        /**
         * Quit Popup controller
         */
        get: function () {
            return this._quitPopup;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Sets up HUD's Sounds Mute Buttons Frames
     * @param isAudioMuted
     */
    HUDController.prototype.init = function (isMusicMuted, areSfxMuted) {
        this.hudLayout.onSwitchSoundButton(areSfxMuted);
        this.nextShapePreview = new Tetromino(this.game, this.hudLayout.nextShapePreviewGroup);
        this.hudLayout.nextShapePreviewGroup.scale.set(GameSetting.nextShapePreviewScale);
        this.attachMusicAndSFXButtonsListeners();
        this.registerEventsListeners();
    };
    /**
     *
     * @param onCompleteCallback
     * @param callbackContext
     */
    HUDController.prototype.startCountDown = function (onCompleteCallback, callbackContext) {
        var _this = this;
        var countdownStrings = ["3", "2", "1", "Tetris!"];
        var countdownTweens = [];
        this.hudLayout.countdownGroup.scale.set(0, 0);
        var _loop_1 = function (iStep) {
            countdownTweens[iStep] = this_1.game.add.tween(this_1.hudLayout.countdownGroup.scale);
            countdownTweens[iStep].to({
                x: 1,
                y: 1
            }, Phaser.Timer.SECOND, Phaser.Easing.Back.Out, false);
            countdownTweens[iStep].onStart.add(function () {
                //this.hudLayout.countdownGroup.scale.set(0, 0);
                _this.hudLayout.countdownLabel.text = countdownStrings[iStep];
            }, this_1);
            countdownTweens[iStep].onComplete.add(function () {
                _this.hudLayout.countdownGroup.scale.set(0, 0);
            }, this_1);
            if (iStep > 0) {
                countdownTweens[iStep - 1].chain(countdownTweens[iStep]);
            }
        };
        var this_1 = this;
        for (var iStep = 0; iStep < countdownStrings.length; iStep++) {
            _loop_1(iStep);
        }
        countdownTweens[countdownTweens.length - 1].onComplete.addOnce(function () {
            _this.hudLayout.countdownGroup.visible = false;
        });
        countdownTweens[countdownTweens.length - 1].onComplete.addOnce(onCompleteCallback, callbackContext);
        countdownTweens[0].start();
        this.hudLayout.countdownGroup.visible = true;
    };
    /**
     *
     * @param tetrominoShape
     */
    HUDController.prototype.showNextShape = function (tetrominoShape) {
        this.nextShapePreview.applyShapeAndRotation(tetrominoShape);
    };
    /**
     *
     */
    HUDController.prototype.update = function () {
    };
    /**
     * Runs In Animation of HUD's bars
     * @param duration in miliseconds
     * @param onCompleteCallback OnComplete listener
     * @param callbackContext OnComplete listener's context
     */
    HUDController.prototype.animateIn = function (duration, onCompleteCallback, callbackContext) {
        this.hudLayout.animateIn(duration, onCompleteCallback, callbackContext);
    };
    /**
     * Attaches Help, Quit buttons listeners
    */
    HUDController.prototype.attachButtonsListeners = function () {
        this.hudLayout.helpButton.onInputUp.addOnce(HUDEventsManager.dispatchButtonHelpClick, this);
        this.hudLayout.soundButton.onInputUp.add(HUDEventsManager.dispatchButtonSoundClick, this);
        this.hudLayout.quitButton.onInputUp.addOnce(HUDEventsManager.dispatchButtonQuitClick, this);
    };
    /**
     * Detaches Help, Quit buttons listeners
    */
    HUDController.prototype.detachButtonsListeners = function () {
        this.hudLayout.helpButton.onInputUp.removeAll();
        this.hudLayout.quitButton.onInputUp.removeAll();
    };
    /**
     * Detaches Audio button listener
     */
    HUDController.prototype.detachButtonAudioListener = function () {
        //this.layout.audioButton.onInputUp.remove( HUDEventsManager.dispatchButtonAudioClick, this );
    };
    /**
     *
     * @param currentNumberOfLines
     */
    HUDController.prototype.updateLinesCounter = function (currentNumberOfLines) {
        /**
         * Tweens Points amount change
         */
        var _this = this;
        var score = {
            lines: this.cachedNumberOfLines
        };
        var scoreValueAction = this.game.add.tween(score);
        scoreValueAction.to({
            lines: currentNumberOfLines
        }, GameSetting.guiLabelBumpDuration);
        scoreValueAction.onUpdateCallback(function () {
            _this.hudLayout.linesLabel.text = String(Math.ceil(score.lines));
        }, this);
        scoreValueAction.onComplete.addOnce(function () {
            _this.hudLayout.linesLabel.text = String(Math.ceil(score.lines));
            _this.hudLayout.linesLabel.scale.set(GameSetting.guiLabelIdleScale);
        }, this);
        scoreValueAction.start();
        /**
         * Jumps In & Out
         */
        this.hudLayout.linesLabel.scale.set(GameSetting.guiLabelIdleScale);
        var jumpIn = this.game.add.tween(this.hudLayout.linesLabel.scale);
        jumpIn.to({
            x: GameSetting.guiLabelMaxScale,
            y: GameSetting.guiLabelMaxScale
        }, GameSetting.guiLabelBumpDuration / 2, Phaser.Easing.Back.Out, false);
        jumpIn.chain(this.game.add.tween(this.hudLayout.linesLabel.scale).to({
            x: GameSetting.guiLabelIdleScale,
            y: GameSetting.guiLabelIdleScale
        }, GameSetting.guiLabelBumpDuration / 2, Phaser.Easing.Cubic.In));
        jumpIn.start();
        this.cachedNumberOfLines = currentNumberOfLines;
    };
    /**
     *
     * @param currentLevelNumber
     */
    HUDController.prototype.updateLevelCounter = function (currentLevelNumber) {
        this.hudLayout.levelLabel.text = String(currentLevelNumber);
        /**
         * Jumps In & Out
         */
        this.hudLayout.levelLabel.scale.set(GameSetting.guiLabelIdleScale);
        var jumpIn = this.game.add.tween(this.hudLayout.levelLabel.scale);
        jumpIn.to({
            x: GameSetting.guiLabelMaxScale,
            y: GameSetting.guiLabelMaxScale
        }, GameSetting.guiLabelBumpDuration / 2, Phaser.Easing.Back.Out, false);
        jumpIn.chain(this.game.add.tween(this.hudLayout.levelLabel.scale).to({
            x: GameSetting.guiLabelIdleScale,
            y: GameSetting.guiLabelIdleScale
        }, GameSetting.guiLabelBumpDuration / 2, Phaser.Easing.Cubic.In));
        jumpIn.start();
    };
    /**
     * Runs Out Animation of HUD's bars
     * @param duration in miliseconds
     * @param callbackFunction OnComplete listener
     * @param callbackContext OnComplete listener's context
     */
    HUDController.prototype.animateOut = function (duration, callbackFunction, callbackContext) {
        this.hudLayout.animateOut(duration, callbackFunction, callbackContext);
    };
    /**
     * Switches HUD dim ON/OFF
     * @param isDim dim/undim switch
     * @param duration in miliseconds
     * @param callback onComplete Callback
     * @param callbackContext
     */
    HUDController.prototype.switchDim = function (isDim, duration, callback, callbackContext) {
        var dim = this.game.add.tween(this.hudLayout.dimRectangle).to({
            alpha: (isDim ? GameSetting.hudDimAlpha : 0)
        }, duration, Phaser.Easing.Exponential.Out, false);
        dim.onComplete.add(callback, callbackContext);
        dim.start();
    };
    /**
     * Removes Game Events listeners and detaches Music's & SFX's buttons listeners
     */
    HUDController.prototype.dispose = function () {
        this.removeEventsListeners();
        this.detachMusicAndSFXButtonsListeners();
    };
    HUDController.prototype.registerEventsListeners = function () {
        ScoreEventsManager.registerScoreUpdate(this.onScoreUpdate, this);
    };
    HUDController.prototype.removeEventsListeners = function () {
        ScoreEventsManager.removeScoreUpdateListeners();
    };
    /**
    * Updates Score Label
    * @param currentScore integer
    */
    HUDController.prototype.onScoreUpdate = function (currentScore) {
        var _this = this;
        /**
         * Tweens Points amount change
         */
        var score = {
            points: this.cachedScore
        };
        var scoreValueAction = this.game.add.tween(score);
        scoreValueAction.to({
            points: currentScore
        }, GameSetting.guiLabelBumpDuration);
        scoreValueAction.onUpdateCallback(function () {
            _this.hudLayout.updateScoreCounter(score.points);
        }, this);
        scoreValueAction.onComplete.addOnce(function () {
            _this.hudLayout.updateScoreCounter(score.points);
            _this.hudLayout.scoreLabel.scale.set(GameSetting.guiLabelIdleScale);
        }, this);
        scoreValueAction.start();
        /**
         * Jumps In & Out
         */
        this.hudLayout.scoreLabel.scale.set(GameSetting.guiLabelIdleScale);
        var jumpIn = this.game.add.tween(this.hudLayout.scoreLabel.scale);
        jumpIn.to({
            x: GameSetting.guiLabelMaxScale,
            y: GameSetting.guiLabelMaxScale
        }, GameSetting.guiLabelBumpDuration / 2, Phaser.Easing.Back.Out, false);
        jumpIn.chain(this.game.add.tween(this.hudLayout.scoreLabel.scale).to({
            x: GameSetting.guiLabelIdleScale,
            y: GameSetting.guiLabelIdleScale
        }, GameSetting.guiLabelBumpDuration / 2, Phaser.Easing.Cubic.In));
        jumpIn.start();
        this.cachedScore = currentScore;
    };
    /**
    * Button SFX mute/unmute, Switches SFX Mute button's frames
    */
    HUDController.prototype.onSound = function () {
        SoundManager.switchClipsMute();
        this.hudLayout.onSwitchSoundButton(SoundManager.areClipsMuted);
    };
    /**
    * Buttons listeners
    */
    HUDController.prototype.attachMusicAndSFXButtonsListeners = function () {
        HUDEventsManager.registerButtonSoundClick(this.onSound, this);
    };
    HUDController.prototype.detachMusicAndSFXButtonsListeners = function () {
        HUDEventsManager.removeButtonSoundClickListeners();
    };
    return HUDController;
}());
/**
 * Simple score Controller class
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var ScoreController = /** @class */ (function () {
    function ScoreController(game) {
        this.game = game;
    }
    /**
     *
     * @param numberOfLines from range 1-4
     * @param curentLevel
     * @returns
     */
    ScoreController.getScoreForNumberOfLinesAtGivenLevel = function (numberOfLines, currentLevel) {
        return GameSetting.pointsForLines[Math.min(currentLevel, GameSetting.pointsForLines.length - 1)][numberOfLines - 1];
    };
    Object.defineProperty(ScoreController.prototype, "score", {
        /**
         * @returns integer
         */
        get: function () {
            return Math.floor(this._score);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clears Score Points amount and current Completed Counter values
     */
    ScoreController.prototype.init = function () {
        this.clear();
        ScoreEventsManager.registerAddToScore(this.addPoints, this);
    };
    /**
     * Checks if its time to start to descrease Score Multiplier.
     * Updates Score Multiplier
     */
    ScoreController.prototype.update = function () {
    };
    /**
     * Broadcasts current fixed score to registered listeners
     */
    ScoreController.prototype.broadcastScore = function () {
        ScoreEventsManager.dispatchScoreUpdate(this.score);
    };
    /**
     * Clears Current score to zero and Broadcasts Score Update
     */
    ScoreController.prototype.clearScore = function () {
        this.clear();
        this.broadcastScore();
    };
    ScoreController.prototype.addPoints = function (amount) {
        this.addToScore(amount);
    };
    ScoreController.prototype.addToScore = function (amount) {
        if (amount == 0) {
            return;
        }
        this._score = Math.min(Math.max(0, this._score + amount), GameSetting.scoreLimit);
        this.broadcastScore();
    };
    ScoreController.prototype.clear = function () {
        this._score = 0;
    };
    return ScoreController;
}());
var TetrominoRotation;
(function (TetrominoRotation) {
    TetrominoRotation[TetrominoRotation["up"] = 0] = "up";
    TetrominoRotation[TetrominoRotation["right"] = 1] = "right";
    TetrominoRotation[TetrominoRotation["down"] = 2] = "down";
    TetrominoRotation[TetrominoRotation["left"] = 3] = "left";
})(TetrominoRotation || (TetrominoRotation = {}));
/**
 * Game Over Scene Layout container controller
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var GameOverLayout = /** @class */ (function () {
    function GameOverLayout(state) {
        this.state = state;
        this.layout = StarlingLayoutManager.getInstance().fulfillGameLayout(this.state.cache.getJSON(LayoutOption.gameOverLayout));
        this.setup();
    }
    Object.defineProperty(GameOverLayout.prototype, "dimRectangle", {
        /**
         * @returns
         */
        get: function () {
            if (!this._dimRectangle) {
                this._dimRectangle = this.layout.getElementByName("DimRectangle");
            }
            return this._dimRectangle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameOverLayout.prototype, "gameOverFloater", {
        /**
         * @returns Game Over text sprite
         */
        get: function () {
            if (!this._gameOverFloater) {
                this._gameOverFloater = this.layout.getElementByName("GameOverFloater");
            }
            return this._gameOverFloater;
        },
        enumerable: true,
        configurable: true
    });
    GameOverLayout.prototype.setup = function () {
        this.dimRectangle.tint = GameSetting.hudDim;
        this.dimRectangle.alpha = 1;
    };
    /**
     *
     */
    GameOverLayout.prototype.animateOut = function () {
        this.state.add.tween(this.dimRectangle).to({
            alpha: GameSetting.gameOverDimAlpha
        }, GameSetting.gameOverOutDuration, Phaser.Easing.Linear.None, true);
    };
    /**
     *
     * @param callbackFunction
     * @param callbackContext
     */
    GameOverLayout.prototype.setupGreetingsLabel = function (callbackFunction, callbackContext) {
        var _this = this;
        this.gameOverFloater.scale.set(.05, .05);
        this.gameOverFloater.alpha = 0;
        var labelFade = this.state.game.add.tween(this.gameOverFloater).to({
            alpha: 1
        }, GameSetting.gameOverAnimationDuration, Phaser.Easing.Exponential.In, false);
        var labelBouncing = this.state.game.add.tween(this.gameOverFloater.scale).to({
            x: 1.05,
            y: 1.05
        }, GameSetting.gameOverAnimationDuration, Phaser.Easing.Bounce.Out, false);
        labelBouncing.onComplete.addOnce(function () {
            _this.doLoop();
        }, this);
        labelFade.onComplete.addOnce(callbackFunction, callbackContext);
        labelFade.start();
        labelBouncing.start();
    };
    GameOverLayout.prototype.doLoop = function () {
        var targetScale = new Phaser.Point(this.state.rnd.realInRange(.2, 1.2), this.state.game.rnd.realInRange(.2, 2));
        this.state.add.tween(this.gameOverFloater.scale).to({
            x: targetScale.x,
            y: targetScale.y
        }, 2 * Phaser.Timer.SECOND, this.randomEasing, true, 0).onComplete.addOnce(this.doLoop, this);
    };
    Object.defineProperty(GameOverLayout.prototype, "randomEasing", {
        get: function () {
            return this.state.rnd.pick([
                Phaser.Easing.Elastic.In,
                Phaser.Easing.Elastic.InOut,
                Phaser.Easing.Elastic.Out,
                Phaser.Easing.Back.In,
                Phaser.Easing.Back.InOut,
                Phaser.Easing.Back.Out,
                Phaser.Easing.Sinusoidal.InOut,
                Phaser.Easing.Circular.InOut,
                Phaser.Easing.Bounce.InOut,
                Phaser.Easing.Bounce.In
            ]);
        },
        enumerable: true,
        configurable: true
    });
    return GameOverLayout;
}());
/**
 * Gameplay Board and Stuff Layout container controller.
 * Include: full Game Board Group, Grid Container Group, Hint Sprite, dummy Storage Area & Rectangle
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var GameplayLayout = /** @class */ (function () {
    function GameplayLayout(state) {
        this.state = state;
        this.layout = StarlingLayoutManager.getInstance().fulfillGameLayout(this.state.cache.getJSON(LayoutOption.gameplayLayout));
        this.setup();
    }
    Object.defineProperty(GameplayLayout.prototype, "boardGroup", {
        /**
         * Groups
         */
        /**
         * @returns Full Board Group
         */
        get: function () {
            if (!this._boardGroup) {
                this._boardGroup = this.layout.getElementByName("boardGroup");
            }
            return this._boardGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameplayLayout.prototype, "tetrionGroup", {
        /**
         * Contains background block sprites
         * @returns
         */
        get: function () {
            if (!this._tetrionGroup) {
                this._tetrionGroup = this.layout.getElementByName("tetrionGroup");
            }
            return this._tetrionGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameplayLayout.prototype, "tetrominoesGroup", {
        /**
         * Layer containing tetrominoes sprites
         */
        get: function () {
            if (!this._tetrominoesGroup) {
                this._tetrominoesGroup = this.layout.getElementByName("tetrominoesGroup");
            }
            return this._tetrominoesGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameplayLayout.prototype, "tetrionColumnGroups", {
        /**
         *
         */
        get: function () {
            if (!this._tetrionColumnGroups) {
                this._tetrionColumnGroups = [];
                for (var iColumn = 0; iColumn < GameSetting.tetrionMatrixSize.x; iColumn++) {
                    this.tetrionColumnGroups[iColumn] = this.tetrionGroup.getChildAt(iColumn);
                }
            }
            return this._tetrionColumnGroups;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameplayLayout.prototype, "inputMask", {
        /**
         * @returns Input mask for using by Swipe Manager
         */
        get: function () {
            if (!this._inputMask) {
                this._inputMask = this.layout.getElementByName("inputMask");
            }
            return this._inputMask;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param iColumn
     * @param iRow
     * @returns
     */
    GameplayLayout.prototype.getTetrionBackgroundBlock = function (iColumn, iRow) {
        if (!this._tetrionBlocks) {
            this._tetrionBlocks = [];
            for (var iRow_1 = 0; iRow_1 < GameSetting.tetrionMatrixSize.y; iRow_1++) {
                this._tetrionBlocks[iRow_1] = [];
                for (var iColumn_1 = 0; iColumn_1 < GameSetting.tetrionMatrixSize.x; iColumn_1++) {
                    this._tetrionBlocks[iRow_1][iColumn_1] = this.tetrionColumnGroups[iColumn_1].getAt(iRow_1);
                }
            }
        }
        return this._tetrionBlocks[iRow][iColumn];
    };
    GameplayLayout.prototype.setup = function () {
        switch (GameMode.device) {
            case DeviceOption.MOBILE:
            case DeviceOption.DESKTOP:
            case DeviceOption.TABLET:
            default:
                this.boardGroup.alpha = 1;
                this.boardGroup.scale.set(1);
                break;
        }
        this.inputMask.inputEnabled = false;
    };
    GameplayLayout.prototype.setupTetrominoesGroupMask = function () {
        var mask = this.state.add.graphics(0, 100);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, 800, 144);
        this.tetrominoesGroup.mask = mask;
    };
    return GameplayLayout;
}());
/**
 * GUI HUD Layout container controller
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var HUDLayout = /** @class */ (function () {
    function HUDLayout(state) {
        this.state = state;
        this.layout = StarlingLayoutManager.getInstance().fulfillGameLayout(this.state.game.cache.getJSON(LayoutOption.hudLayout));
        this.hudGroup.visible = false;
        this.initialize();
        this.adjust();
        this.applyGUIMute();
        HUDEventsManager.registerButtonSoundClick(this.applyGUIMute, this);
    }
    Object.defineProperty(HUDLayout.prototype, "hudGroup", {
        /**
         * @returns HUD's group
         */
        get: function () {
            if (!this._hudGroup) {
                this._hudGroup = this.layout.getElementByName("hud_group");
            }
            return this._hudGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDLayout.prototype, "dimRectangle", {
        /**
         * @returns HUD's Dim Rectangle Sprite
         */
        get: function () {
            if (!this._dimRectangle) {
                this._dimRectangle = this.layout.getElementByName("dim_rectangle");
                this._dimRectangle.inputEnabled = true;
                this._dimRectangle.input.useHandCursor = false;
            }
            return this._dimRectangle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDLayout.prototype, "topGroup", {
        /**
        * @returns HUD's top bar group
        */
        get: function () {
            if (!this._topGroup) {
                this._topGroup = this.layout.getElementByName("top_group");
            }
            return this._topGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDLayout.prototype, "scoreLabel", {
        /**
        * @returns Scored Points Label
        */
        get: function () {
            if (!this._scoreLabel) {
                this._scoreLabel = this.layout.getElementByName("score_text");
            }
            return this._scoreLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDLayout.prototype, "linesLabel", {
        /**
         *
         */
        get: function () {
            if (!this._linesLabel) {
                this._linesLabel = this.layout.getElementByName("lines_value_label");
            }
            return this._linesLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDLayout.prototype, "levelLabel", {
        /**
         *
         */
        get: function () {
            if (!this._levelLabel) {
                this._levelLabel = this.layout.getElementByName("level_value_label");
            }
            return this._levelLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDLayout.prototype, "nextShapePreviewGroup", {
        /**
         *
         */
        get: function () {
            if (!this._nextShapePreviewGroup) {
                this._nextShapePreviewGroup = this.layout.getElementByName("next_shape_preview_group");
            }
            return this._nextShapePreviewGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDLayout.prototype, "helpButton", {
        /**
        * @returns Help Button
        */
        get: function () {
            if (!this._helpButton) {
                this._helpButton = this.layout.getElementByName(ButtonOption.button + '_' + ButtonOption.help);
            }
            return this._helpButton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDLayout.prototype, "soundButton", {
        /**
        * @returns SFX Mute Button
        */
        get: function () {
            if (!this._soundButton) {
                this._soundButton = this.layout.getElementByName(ButtonOption.button + '_' + ButtonOption.sound);
            }
            return this._soundButton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDLayout.prototype, "quitButton", {
        /**
        * @returns Quit Button
        */
        get: function () {
            if (!this._quitButton) {
                this._quitButton = this.layout.getElementByName(ButtonOption.button + '_' + ButtonOption.exit);
            }
            return this._quitButton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDLayout.prototype, "countdownGroup", {
        // Middle section
        get: function () {
            if (!this._countdownGroup) {
                this._countdownGroup = this.layout.getElementByName("countdown_group");
            }
            return this._countdownGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDLayout.prototype, "countdownLabel", {
        /**
         *
         */
        get: function () {
            if (!this._countdownLabel) {
                this._countdownLabel = this.layout.getElementByName("countdown_label");
            }
            return this._countdownLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HUDLayout.prototype, "bottomGroup", {
        /**
        * @returns bottom Group
        */
        get: function () {
            if (!this._bottomGroup) {
                this._bottomGroup = this.layout.getElementByName("bottom_group");
            }
            return this._bottomGroup;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param pointsToShow
     */
    HUDLayout.prototype.updateScoreCounter = function (pointsToShow) {
        var flooredPoints = Math.floor(pointsToShow);
        this.scoreLabel.text = HUDUtils.pad(flooredPoints, 8);
    };
    /**
     * Sets proper frames of Switch Mute Music Button
     * @param isMuted
     */
    HUDLayout.prototype.onSwitchSoundButton = function (isMuted) {
        var mutedWord = isMuted ? MuteState.OFF : MuteState.ON;
        this.soundButton.setFrames(ButtonOption.button + '_' + ButtonOption.sound + mutedWord + '_' + ButtonFrame.over + ExtensionOption.dotPNG, ButtonOption.button + '_' + ButtonOption.sound + mutedWord + ExtensionOption.dotPNG, ButtonOption.button + '_' + ButtonOption.sound + mutedWord + '_' + ButtonFrame.down + ExtensionOption.dotPNG, ButtonOption.button + '_' + ButtonOption.sound + mutedWord + ExtensionOption.dotPNG);
        this.applyGUIMute();
    };
    /**
     * Moves In HUD's bars from a side of vertival edges of the Game Screen
     * @param duration in miliseconds
     * @param onCompleteCallback OnComplete listener
     * @param callbackContext OnComplete listener's context
     */
    HUDLayout.prototype.animateIn = function (duration, onCompleteCallback, callbackContext) {
        var cachedTopBarY = this.topGroup.y;
        this.topGroup.y -= this.topGroup.height;
        var topBarAction = this.state.game.add.tween(this.topGroup).to({
            y: cachedTopBarY
        }, duration, Phaser.Easing.Back.Out, false);
        var cachedBottomBarY = this.bottomGroup.y;
        this.bottomGroup.y += this.bottomGroup.height / 5;
        this.state.game.add.tween(this.bottomGroup).to({
            y: cachedBottomBarY
        }, duration, Phaser.Easing.Elastic.Out, true).onStart.addOnce(function () {
            SoundManager.playClip(SoundOption.POPUP_SHOW);
        }, this);
        topBarAction.onComplete.addOnce(onCompleteCallback, callbackContext);
        topBarAction.start();
        this.hudGroup.visible = true;
    };
    /**
     * Moves Out HUD's bars from a side of vertival edges of the Game Screen
     * @param duration in miliseconds
     * @param callbackFunction OnComplete listener
     * @param callbackContext OnComplete listener's context
     */
    HUDLayout.prototype.animateOut = function (duration, onCompleteCallback, callbackContext) {
        var bottomGroupAction = this.state.game.add.tween(this.bottomGroup);
        bottomGroupAction.to({
            y: this.bottomGroup.y + this.bottomGroup.height
        }, duration, Phaser.Easing.Back.In, true).onStart.addOnce(function () {
            SoundManager.playClip(SoundOption.POPUP_SHOW);
        }, this);
        this.state.game.add.tween(this.topGroup).to({
            y: this.topGroup.y - this.topGroup.height
        }, duration, Phaser.Easing.Back.In, true);
        bottomGroupAction.onComplete.addOnce(onCompleteCallback, callbackContext);
        bottomGroupAction.start();
    };
    HUDLayout.prototype.initialize = function () {
        this.helpButton.setDownSound(SoundManager.getSound(SoundOption.BUTTON));
        this.soundButton.setDownSound(SoundManager.getSound(SoundOption.BUTTON));
        this.quitButton.setDownSound(SoundManager.getSound(SoundOption.BUTTON));
    };
    HUDLayout.prototype.adjust = function () {
        this.helpButton.scale.set(GameSetting.hudButtonIdleScale);
        this.soundButton.scale.set(GameSetting.hudButtonIdleScale);
        this.quitButton.scale.set(GameSetting.hudButtonIdleScale);
    };
    HUDLayout.prototype.applyGUIMute = function () {
        var buttonSound = SoundManager.getSound(SoundOption.BUTTON);
        this.helpButton.setDownSound(SoundManager.areClipsMuted ? null : buttonSound);
        this.soundButton.setDownSound(SoundManager.areClipsMuted ? null : buttonSound);
        this.quitButton.setDownSound(SoundManager.areClipsMuted ? null : buttonSound);
    };
    return HUDLayout;
}());
/**
 * Quit Popup Layout container controller.
 * Includes: Play Now! Button
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var QuitPopupLayout = /** @class */ (function () {
    function QuitPopupLayout(game) {
        this.game = game;
        this.layout = StarlingLayoutManager.getInstance().fulfillGameLayout(this.game.cache.getJSON(LayoutOption.quitPopup));
        this.initialize();
    }
    Object.defineProperty(QuitPopupLayout.prototype, "popupMask", {
        /**
         * @returns
         */
        get: function () {
            if (!this._popupMask) {
                this._popupMask = this.layout.getElementByName('popup_mask');
                this._popupMask.inputEnabled = true;
                this._popupMask.input.useHandCursor = false;
            }
            return this._popupMask;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuitPopupLayout.prototype, "popupGroup", {
        /**
         * @returns
         */
        get: function () {
            if (!this._popupGroup) {
                this._popupGroup = this.layout.getElementByName('popup_group');
            }
            return this._popupGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuitPopupLayout.prototype, "popupFrame", {
        /**
         * @returns
         */
        get: function () {
            if (!this._popupFrame) {
                this._popupFrame = this.layout.getElementByName('popup_frame');
            }
            return this._popupFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuitPopupLayout.prototype, "popupBackground", {
        /**
        * @return Popup's background Sprite
        */
        get: function () {
            return this._popupBackground;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuitPopupLayout.prototype, "confirmButton", {
        /**
         * @returns Yes Button
         */
        get: function () {
            if (!this._confirmButton) {
                this._confirmButton = this.layout.getElementByName('yes_button');
            }
            return this._confirmButton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuitPopupLayout.prototype, "confirmButtonLabel", {
        /**
        * @returns Yes Button label
        */
        get: function () {
            if (!this._confirmButtonLabel) {
                this._confirmButtonLabel = this.layout.getElementByName('yes_label');
            }
            return this._confirmButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuitPopupLayout.prototype, "cancelButton", {
        /**
         * @returns No Button
         */
        get: function () {
            if (!this._cancelButton) {
                this._cancelButton = this.layout.getElementByName('no_button');
            }
            return this._cancelButton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuitPopupLayout.prototype, "cancelButtonLabel", {
        /**
      * @returns No Button label
      */
        get: function () {
            if (!this._cancelButtonLabel) {
                this._cancelButtonLabel = this.layout.getElementByName('no_label');
            }
            return this._cancelButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    QuitPopupLayout.prototype.initialize = function () {
        this.initBackground();
    };
    QuitPopupLayout.prototype.initBackground = function () {
        this._popupBackground = this.game.add.sprite(0, 0, TextureOption.background, undefined, this.popupGroup);
        this._popupBackground.anchor.set(.5, .5);
        this._popupBackground.position.set(0, 0);
        this._popupBackground.alpha = GameSetting.popupBackgroundAlpha;
        this.popupGroup.sendToBack(this._popupBackground);
    };
    return QuitPopupLayout;
}());
/**
 * Results Popup Layout container controller
 * @author      dsremski <d.sremski@gmail.com>
 * @version     13.05.2021
 * @copyright   2021 Damian Śremski
 */
var ResultsPopupLayout = /** @class */ (function () {
    function ResultsPopupLayout(game) {
        this.game = game;
        this.layout = StarlingLayoutManager.getInstance().fulfillGameLayout(this.game.cache.getJSON(LayoutOption.resultsPopup));
        this.initialize();
    }
    Object.defineProperty(ResultsPopupLayout.prototype, "popupMask", {
        /**
         * @returns
         */
        get: function () {
            if (!this._popupMask) {
                this._popupMask = this.layout.getElementByName('popup_mask');
                this._popupMask.inputEnabled = true;
                this._popupMask.input.useHandCursor = false;
            }
            return this._popupMask;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultsPopupLayout.prototype, "popupGroup", {
        /**
         * @returns
         */
        get: function () {
            if (!this._popupGroup) {
                this._popupGroup = this.layout.getElementByName('popup_group');
            }
            return this._popupGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultsPopupLayout.prototype, "popupFrame", {
        /**
         * @returns
         */
        get: function () {
            if (!this._popupFrame) {
                this._popupFrame = this.layout.getElementByName('popup_frame');
            }
            return this._popupFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultsPopupLayout.prototype, "popupBackground", {
        /**
        * @return Popup's background Sprite
        */
        get: function () {
            return this._popupBackground;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultsPopupLayout.prototype, "scoreLabel", {
        get: function () {
            if (!this._scoreLabel) {
                this._scoreLabel = this.layout.getElementByName('score_label');
            }
            return this._scoreLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultsPopupLayout.prototype, "playAgainButton", {
        /**
         * @returns Yes Button
         */
        get: function () {
            if (!this._playAgainButton) {
                this._playAgainButton = this.layout.getElementByName('play_again_button');
            }
            return this._playAgainButton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultsPopupLayout.prototype, "playAgainButtonLabel", {
        /**
        * @returns Yes Button label
        */
        get: function () {
            if (!this._playAgainButtonLabel) {
                this._playAgainButtonLabel = this.layout.getElementByName('play_again_label');
            }
            return this._playAgainButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultsPopupLayout.prototype, "quitButton", {
        /**
         * @returns No Button
         */
        get: function () {
            if (!this._quitButton) {
                this._quitButton = this.layout.getElementByName('quit_button');
            }
            return this._quitButton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResultsPopupLayout.prototype, "quitButtonLabel", {
        /**
      * @returns No Button label
      */
        get: function () {
            if (!this._quitButtonLabel) {
                this._quitButtonLabel = this.layout.getElementByName('quit_label');
            }
            return this._quitButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    ResultsPopupLayout.prototype.initialize = function () {
        this.initBackground();
    };
    ResultsPopupLayout.prototype.initBackground = function () {
        this._popupBackground = this.game.add.sprite(0, 0, TextureOption.background, undefined, this.popupGroup);
        this._popupBackground.anchor.set(.5, .5);
        this._popupBackground.position.set(0, 0);
        this._popupBackground.alpha = GameSetting.popupBackgroundAlpha;
        this.popupGroup.sendToBack(this._popupBackground);
    };
    return ResultsPopupLayout;
}());
/**
 * Title Scene Layout container container controller: controls elements required to init Logo animation
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var TitleLayout = /** @class */ (function () {
    function TitleLayout(state) {
        this.state = state;
        this.layout = StarlingLayoutManager.getInstance().fulfillGameLayout(this.state.cache.getJSON(LayoutOption.titleLayout));
        this.initialize();
        this.setupTweens();
    }
    Object.defineProperty(TitleLayout.prototype, "logoContainer", {
        /**
         * @returns
         */
        get: function () {
            if (!this._logoContainer) {
                this._logoContainer = this.layout.getElementByName("LogoContainer");
            }
            return this._logoContainer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TitleLayout.prototype, "logoGroup", {
        /**
         * @returns
         */
        get: function () {
            if (!this._logoGroup) {
                this._logoGroup = this.layout.getElementByName('LogoGroup');
            }
            return this._logoGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TitleLayout.prototype, "logo", {
        /**
         * @returns splash logo sprite
         */
        get: function () {
            if (!this._splashLogo) {
                this._splashLogo = this.layout.getElementByName('splashLogo');
            }
            return this._splashLogo;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TitleLayout.prototype, "splashBurst", {
        /**
         * @returns burst effect sprite
         */
        get: function () {
            if (!this._splashBurst) {
                this._splashBurst = this.layout.getElementByName('splashBurst');
            }
            return this._splashBurst;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param onCompleteCallback
     * @param callbackContext
     */
    TitleLayout.prototype.animateIn = function (onCompleteCallback, callbackContext) {
        // Logo animation
        this.logoJumpIn.to({
            x: GameSetting.splashLogoScaleBase,
            y: GameSetting.splashLogoScaleBase
        }, GameSetting.splashAnimationInDuration, Phaser.Easing.Elastic.Out, false, GameSetting.splashAnimationInDuration / 4);
        this.logoJumpIn.onComplete.addOnce(onCompleteCallback, callbackContext);
        return this.logoJumpIn;
    };
    /**
     *
     * @param onCompleteCallback
     * @param callbackContext
     */
    TitleLayout.prototype.animateOut = function (onCompleteCallback, callbackContext) {
        var _this = this;
        // Burst animation
        this.burstFade.to({
            alpha: 1
        }, GameSetting.splashAnimationOutDuration / 2, Phaser.Easing.Exponential.In, false, 0, 0, true);
        this.burstExpansion.to({
            x: 1.2,
            y: 1.2
        }, GameSetting.splashAnimationOutDuration, Phaser.Easing.Linear.None, false);
        // Logo animation
        this.logoJumpOut.to({
            x: GameSetting.splashLogoScaleBase * GameSetting.splashLogoMaxScale,
            y: GameSetting.splashLogoScaleBase * GameSetting.splashLogoMaxScale
        }, GameSetting.splashAnimationOutDuration / 2, Phaser.Easing.Back.In, false, GameSetting.splashAnimationOutDuration / 2);
        var logoFadeAction = this.state.add.tween(this.logo);
        logoFadeAction.to({
            alpha: 0
        }, GameSetting.splashAnimationOutDuration * .66, Phaser.Easing.Linear.None, false, GameSetting.splashAnimationOutDuration / 3);
        this.logoJumpOut.onStart.addOnce(function () {
            logoFadeAction.start();
            _this.burstFade.start();
            _this.burstExpansion.start();
        }, this);
        this.logoJumpOut.onComplete.addOnce(onCompleteCallback, callbackContext);
        return this.logoJumpOut;
    };
    TitleLayout.prototype.initialize = function () {
        switch (GameMode.device) {
            case DeviceOption.MOBILE:
            case DeviceOption.DESKTOP:
            case DeviceOption.TABLET:
            default:
                this.logo.scale.set(0);
                break;
        }
    };
    TitleLayout.prototype.setupTweens = function () {
        this.logoJumpIn = this.state.add.tween(this.logo.scale);
        this.logoJumpOut = this.state.add.tween(this.logo.scale);
        this.burstFade = this.state.add.tween(this.splashBurst);
        this.burstExpansion = this.state.add.tween(this.splashBurst.scale);
    };
    return TitleLayout;
}());
/**
 * Tutorial Popup Layout controller
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var TutorialPopupLayout = /** @class */ (function () {
    function TutorialPopupLayout(game) {
        this.game = game;
        this.layout = StarlingLayoutManager.getInstance().fulfillGameLayout(this.game.cache.getJSON(LayoutOption.tutorialPopup));
        this.initialize();
        this.adjust();
    }
    Object.defineProperty(TutorialPopupLayout.prototype, "popupMask", {
        /**
         * @return Popup's mask Tile Sprite
         */
        get: function () {
            if (!this._popupMask) {
                this._popupMask = this.layout.getElementByName('popup_mask');
                this._popupMask.inputEnabled = true;
                this._popupMask.input.useHandCursor = false;
            }
            return this._popupMask;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "popupGroup", {
        /**
         * @return Popup's group
         */
        get: function () {
            if (!this._popupGroup) {
                this._popupGroup = this.layout.getElementByName('generic_popup_group');
            }
            return this._popupGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "popupFrame", {
        /**
         * @return Popup's frame Sprite
         */
        get: function () {
            if (!this._popupFrame) {
                this._popupFrame = this.layout.getElementByName('popup_frame');
            }
            return this._popupFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "popupBackground", {
        /**
        * @return Popup's background Sprite
        */
        get: function () {
            return this._popupBackground;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "playButton", {
        /**
        * @return Play Now! Button
        */
        get: function () {
            if (!this._playButton) {
                this._playButton = this.layout.getElementByName('play_button');
            }
            return this._playButton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "checkBoxGroup", {
        /**
         * @return Checkbox's Don't Show Again Group
         */
        get: function () {
            if (!this._checkBoxGroup) {
                this._checkBoxGroup = this.layout.getElementByName("popup_checkbox_group");
            }
            return this._checkBoxGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "checkBox", {
        /**
        * @return Checkbox's Don't Show Again Button
        */
        get: function () {
            if (!this._checkBox) {
                this._checkBox = this.layout.getElementByName("dont_show_again_button");
            }
            return this._checkBox;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "checkBoxSquare", {
        /**
        * @return Checkbox's Don't Show Again hollow Square Sprite
        */
        get: function () {
            if (!this._checkBoxSquare) {
                this._checkBoxSquare = this.layout.getElementByName("checkbox_sprite");
            }
            return this._checkBoxSquare;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "checkBoxCheck", {
        /**
        * @return Checkbox's Don't Show Again X-Check's Sprite
        */
        get: function () {
            if (!this._checkBoxCheck) {
                this._checkBoxCheck = this.layout.getElementByName("checkbox_cross_sprite");
            }
            return this._checkBoxCheck;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "checkBoxMask", {
        /**
         * @returns {Phaser.Button}
         */
        get: function () {
            if (!this._checkBoxMask) {
                this._checkBoxMask = this.layout.getElementByName("checkbox_input_mask");
            }
            return this._checkBoxMask;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "headerLabel", {
        /**
         * @returns {Phaser.Text}
         */
        get: function () {
            if (!this._headerLabel) {
                this._headerLabel = this.layout.getElementByName("header_label");
            }
            return this._headerLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "rotationLabel", {
        /**
         * @returns {Phaser.Text}
         */
        get: function () {
            if (!this._rotationLabel) {
                this._rotationLabel = this.layout.getElementByName("rotation_label");
            }
            return this._rotationLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "moveLeftLabel", {
        get: function () {
            if (!this._moveLeftLabel) {
                this._moveLeftLabel = this.layout.getElementByName("move_left_label");
            }
            return this._moveLeftLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "moveRightLabel", {
        get: function () {
            if (!this._moveRightLabel) {
                this._moveRightLabel = this.layout.getElementByName("move_right_label");
            }
            return this._moveRightLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TutorialPopupLayout.prototype, "hardDropLabel", {
        get: function () {
            if (!this._hardDropLabel) {
                this._hardDropLabel = this.layout.getElementByName("hard_drop_label");
            }
            return this._hardDropLabel;
        },
        enumerable: true,
        configurable: true
    });
    TutorialPopupLayout.prototype.initialize = function () {
        this.initBackground();
    };
    TutorialPopupLayout.prototype.initBackground = function () {
        this._popupBackground = this.game.add.sprite(0, 0, TextureOption.background, undefined, this.popupGroup);
        this._popupBackground.anchor.set(.5, .5);
        this._popupBackground.position.set(0, 0);
        this._popupBackground.alpha = GameSetting.popupBackgroundAlpha;
        this.popupGroup.sendToBack(this._popupBackground);
    };
    TutorialPopupLayout.prototype.adjust = function () {
        this.checkBox.pivot.set(0, 25);
        this.moveLeftLabel.lineSpacing = 2;
        this.moveRightLabel.lineSpacing = 2;
        this.hardDropLabel.lineSpacing = 2;
    };
    return TutorialPopupLayout;
}());
/**
 * Welcome Popup Layout container controller with Player Name display string required.
 * Includes: Play now Button, Player Name's TextField
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var WelcomePopupLayout = /** @class */ (function () {
    function WelcomePopupLayout(game) {
        this.game = game;
        this.layout = StarlingLayoutManager.getInstance().fulfillGameLayout(this.game.cache.getJSON(LayoutOption.welcomePopup));
        this.adjust();
    }
    Object.defineProperty(WelcomePopupLayout.prototype, "popupMask", {
        get: function () {
            if (!this._popupMask) {
                this._popupMask = this.layout.getElementByName('popup_mask');
                this._popupMask.inputEnabled = true;
                this._popupMask.input.useHandCursor = false;
            }
            return this._popupMask;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WelcomePopupLayout.prototype, "popupGroup", {
        get: function () {
            if (!this._popupGroup) {
                this._popupGroup = this.layout.getElementByName('popup_group');
            }
            return this._popupGroup;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WelcomePopupLayout.prototype, "popupFrame", {
        get: function () {
            if (!this._popupFrame) {
                this._popupFrame = this.layout.getElementByName('popup_frame');
            }
            return this._popupFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WelcomePopupLayout.prototype, "popupBackground", {
        /**
        * @return Popup's background Sprite
        */
        get: function () {
            return this._popupBackground;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WelcomePopupLayout.prototype, "playerNameText", {
        get: function () {
            return this.layout.getElementByName('name_label');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WelcomePopupLayout.prototype, "descriptionLabel", {
        /**
         * @returns popup description Label
         */
        get: function () {
            if (!this._descriptionLabel) {
                this._descriptionLabel = this.layout.getElementByName('description_label');
            }
            return this._descriptionLabel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WelcomePopupLayout.prototype, "popupCornerRadius", {
        get: function () {
            return this.layout.getElementByName('popup_corner_radius').x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WelcomePopupLayout.prototype, "playButton", {
        /**
         * @returns Button Play Now!
        */
        get: function () {
            if (!this._playButton) {
                this._playButton = this.layout.getElementByName('play_button');
            }
            return this._playButton;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WelcomePopupLayout.prototype, "playButtonLabel", {
        /**
         * @returns Play Now! Button Label
         */
        get: function () {
            if (!this._playButtonLabel) {
                this._playButtonLabel = this.layout.getElementByName('play_label');
            }
            return this._playButtonLabel;
        },
        enumerable: true,
        configurable: true
    });
    WelcomePopupLayout.prototype.adjust = function () {
        this.descriptionLabel.lineSpacing = 2;
    };
    return WelcomePopupLayout;
}());
/**
 * Quit Popup Layout container controller.
 * Includes: layout as implementation of Popup Layout's interface (requires popupMask, popupGroup, popupFrame)
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var Popup = /** @class */ (function () {
    function Popup(game, layout) {
        this.game = game;
        this.layout = layout;
        this.init();
    }
    Popup.prototype.setupInTweens = function () {
        this.popupShow = this.game.add.tween(this.layout.popupGroup);
        this.maskFadeIn = this.game.add.tween(this.layout.popupMask);
    };
    Popup.prototype.setupOutTweens = function () {
        this.popupHide = this.game.add.tween(this.layout.popupGroup);
        this.maskFadeOut = this.game.add.tween(this.layout.popupMask);
    };
    /**
     * Inits Popup's mask and Hides Popup
     */
    Popup.prototype.init = function () {
        this.layout.popupMask.inputEnabled = true;
        this.hide(true);
    };
    /**
     * @param isImmediate is without Tween
     * @param delay Phaser.Timer.SECOND: in miliseconds
     */
    Popup.prototype.show = function (isImmediate, delay, isSilent) {
        if (delay === void 0) { delay = 0; }
        if (isSilent === void 0) { isSilent = false; }
        this.layout.popupGroup.visible = true;
        this.layout.popupGroup.alpha = 0;
        this.layout.popupMask.tint = GameSetting.popupMaskTint;
        this.layout.popupMask.alpha = 0;
        this.layout.popupMask.visible = true;
        if (isImmediate) {
            this.layout.popupGroup.alpha = 1;
            this.layout.popupMask.alpha = GameSetting.popupMaskAlpha;
        }
        else {
            if (!isSilent) {
                SoundManager.playClip(SoundOption.POPUP_SHOW);
            }
            this.setupInTweens();
            this.popupShow.to({
                alpha: 1
            }, GameSetting.popupTransitionDuration, Phaser.Easing.Linear.None, true, delay);
            this.maskFadeIn.to({
                alpha: GameSetting.popupMaskAlpha
            }, GameSetting.popupTransitionDuration, Phaser.Easing.Exponential.InOut, true, delay);
        }
    };
    /**
     * @param isImmediate is without Tween
     */
    Popup.prototype.hide = function (isImmediate, isSilent) {
        var _this = this;
        if (isImmediate === void 0) { isImmediate = false; }
        if (isSilent === void 0) { isSilent = false; }
        this.layout.popupMask.alpha = GameSetting.popupMaskAlpha;
        if (isImmediate) {
            this.layout.popupGroup.visible = false;
            this.layout.popupGroup.alpha = 0;
            this.layout.popupMask.visible = false;
            this.layout.popupMask.alpha = 0;
        }
        else {
            if (!isSilent) {
                SoundManager.playClip(SoundOption.POPUP_HIDE);
            }
            this.setupOutTweens();
            this.popupHide.to({
                alpha: 0
            }, GameSetting.popupTransitionDuration, Phaser.Easing.Exponential.InOut, false);
            this.popupHide.onComplete.addOnce(function () {
                _this.layout.popupGroup.visible = false;
            }, this);
            this.maskFadeOut.to({
                alpha: 0
            }, GameSetting.popupTransitionDuration, Phaser.Easing.Exponential.InOut, false);
            this.maskFadeOut.onComplete.addOnce(function () {
                _this.layout.popupMask.visible = false;
            }, this);
            this.popupHide.start();
            this.maskFadeOut.start();
        }
    };
    /**
     * Sets Popup's Button with SFX and scale effects
     * @param button
     */
    Popup.prototype.setupButton = function (button, baseScale) {
        var _this = this;
        if (baseScale === void 0) { baseScale = 1; }
        button.scale.set(baseScale);
        button.setDownSound(SoundManager.getSound(SoundOption.BUTTON));
        button.onInputOver.add(function () {
            _this.game.add.tween(button.scale).to({
                x: GameSetting.guiButtonMaxScale * baseScale,
                y: GameSetting.guiButtonMaxScale * baseScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Back.Out, true, 0, 0);
        }, this);
        button.onInputOut.add(function () {
            _this.game.add.tween(button.scale).to({
                x: GameSetting.guiButtonIdleScale * baseScale,
                y: GameSetting.guiButtonIdleScale * baseScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Exponential.Out, true, 0, 0);
        }, this);
        button.onInputDown.add(function () {
            _this.game.add.tween(button.scale).to({
                x: GameSetting.guiButtonMinScale * baseScale,
                y: GameSetting.guiButtonMinScale * baseScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Back.Out, true, 0, 0);
        }, this);
        button.onInputUp.add(function () {
            _this.game.add.tween(button.scale).to({
                x: GameSetting.guiButtonMaxScale * baseScale,
                y: GameSetting.guiButtonMaxScale * baseScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Back.Out, true, 0, 0);
        }, this);
    };
    /**
     * Sets Popup's Button with Label, SFX and scale effects
     * @param button
     * @param buttonLabel
     */
    Popup.prototype.setupTextButton = function (button, buttonLabel) {
        var _this = this;
        button.setDownSound(SoundManager.getSound(SoundOption.BUTTON));
        button.onInputOver.add(function () {
            _this.game.add.tween(button.scale).to({
                x: GameSetting.guiButtonMaxScale,
                y: GameSetting.guiButtonMaxScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Back.Out, true, 0, 0);
            _this.game.add.tween(buttonLabel.scale).to({
                x: GameSetting.guiButtonMaxScale,
                y: GameSetting.guiButtonMaxScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Back.Out, true, 0, 0);
        }, this);
        button.onInputOut.add(function () {
            _this.game.add.tween(button.scale).to({
                x: GameSetting.guiButtonIdleScale,
                y: GameSetting.guiButtonIdleScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Exponential.Out, true, 0, 0);
            _this.game.add.tween(buttonLabel.scale).to({
                x: GameSetting.guiButtonIdleScale,
                y: GameSetting.guiButtonIdleScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Exponential.Out, true, 0, 0);
        }, this);
        button.onInputDown.add(function () {
            _this.game.add.tween(button.scale).to({
                x: GameSetting.guiButtonMinScale,
                y: GameSetting.guiButtonMinScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Back.Out, true, 0, 0);
            _this.game.add.tween(buttonLabel.scale).to({
                x: GameSetting.guiButtonMinScale,
                y: GameSetting.guiButtonMinScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Back.Out, true, 0, 0);
        }, this);
        button.onInputUp.add(function () {
            _this.game.add.tween(button.scale).to({
                x: GameSetting.guiButtonMaxScale,
                y: GameSetting.guiButtonMaxScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Back.Out, true, 0, 0);
            _this.game.add.tween(buttonLabel.scale).to({
                x: GameSetting.guiButtonMaxScale,
                y: GameSetting.guiButtonMaxScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Back.Out, true, 0, 0);
        }, this);
    };
    /**
     * Sets Popup's checkbox with SFX and scale effects
     * @param checkbox
     * @param checkboxCheck
     * @param checkboxGroup
     */
    Popup.prototype.setupCheckbox = function (checkbox, checkboxCheck, checkboxGroup) {
        var _this = this;
        checkbox.scale.set(GameSetting.tutorialCheckboxScale);
        checkbox.setDownSound(SoundManager.getSound(SoundOption.CHECKBOX));
        checkbox.onInputOver.add(function () {
            _this.game.add.tween(checkboxGroup.scale).to({
                x: GameSetting.guiButtonMaxScale,
                y: GameSetting.guiButtonMaxScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Back.Out, true, 0, 0);
        }, this);
        checkbox.onInputOut.add(function () {
            _this.game.add.tween(checkboxGroup.scale).to({
                x: GameSetting.guiButtonIdleScale,
                y: GameSetting.guiButtonIdleScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Exponential.Out, true, 0, 0);
        }, this);
        checkbox.onInputDown.add(function () {
            _this.game.add.tween(checkboxGroup.scale).to({
                x: GameSetting.guiButtonMinScale,
                y: GameSetting.guiButtonMinScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Back.Out, true, 0, 0);
        }, this);
        checkbox.onInputUp.add(function () {
            _this.game.add.tween(checkboxGroup.scale).to({
                x: GameSetting.guiButtonMaxScale,
                y: GameSetting.guiButtonMaxScale
            }, GameSetting.guiButtonScaleDuration, Phaser.Easing.Back.Out, true, 0, 0);
            if (checkbox.input.pointerOver()) {
                checkboxCheck.visible = !checkboxCheck.visible;
            }
        }, this);
    };
    return Popup;
}());
/// <reference path="Popup.ts"/>
/**
 * Quit Popup controller
 * Includes Confirm & Cancel Buttons
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var QuitPopup = /** @class */ (function (_super) {
    __extends(QuitPopup, _super);
    function QuitPopup(game) {
        var _this = _super.call(this, game, new QuitPopupLayout(game)) || this;
        _this.game = game;
        /**
        * Yes Button event dispatcher
        */
        _this.onConfirmButtonClick = new Phaser.Signal();
        /**
         * No Button event dispatcher
         */
        _this.onCancelButtonClick = new Phaser.Signal();
        _this.createPopupFrame();
        _this.initializeButtons();
        _this.initializeContent();
        _this.applyGUIMute();
        HUDEventsManager.registerButtonSoundClick(_this.switchGUIMute, _this);
        return _this;
    }
    Object.defineProperty(QuitPopup.prototype, "_layout", {
        get: function () {
            return this.layout;
        },
        enumerable: true,
        configurable: true
    });
    QuitPopup.prototype.createPopupFrame = function () {
        var popupFrame = new Phaser.Graphics(this.game, this.layout.popupFrame.x, this.layout.popupFrame.y);
        popupFrame.beginFill(this.layout.popupFrame.tint);
        popupFrame.drawRoundedRect(0, 0, this.layout.popupFrame.width, this.layout.popupFrame.height, GameSetting.popupFrameRadius);
        popupFrame.alpha = GameSetting.popupFrameAlpha;
        popupFrame.tint = GameSetting.popupFrameTint;
        this._layout.popupGroup.add(popupFrame);
        this._layout.popupGroup.swap(popupFrame, this.layout.popupFrame);
        this._layout.popupFrame.alpha = 0;
    };
    /**
     * Yes & No Buttons
     */
    QuitPopup.prototype.initializeButtons = function () {
        var _this = this;
        this.setupTextButton(this._layout.confirmButton, this._layout.confirmButtonLabel);
        this._layout.confirmButton.onInputUp.add(function () {
            if (_this._layout.confirmButton.input.pointerOver()) {
                _this.hide(false);
                _this.onConfirmButtonClick.dispatch();
            }
        }, this);
        this.setupTextButton(this._layout.cancelButton, this._layout.cancelButtonLabel);
        this._layout.cancelButton.onInputUp.add(function () {
            if (_this._layout.cancelButton.input.pointerOver()) {
                _this.hide(false);
                _this.onCancelButtonClick.dispatch();
            }
        }, this);
    };
    /**
     * Sets scale to popup's buttons
     */
    QuitPopup.prototype.initializeContent = function () {
        if (GameMode.isMobile) {
            this._layout.confirmButton.scale.set(GameSetting.quitPopupButtonScaleBase);
            this._layout.cancelButton.scale.set(GameSetting.quitPopupButtonScaleBase);
            this._layout.confirmButton.anchor.set(.5, .5);
            this._layout.cancelButton.anchor.set(.5, .5);
        }
    };
    QuitPopup.prototype.applyGUIMute = function () {
        this._layout.confirmButton.setDownSound(SoundManager.areClipsMuted ? null : SoundManager.getSound(SoundOption.BUTTON));
        this._layout.cancelButton.setDownSound(SoundManager.areClipsMuted ? null : SoundManager.getSound(SoundOption.BUTTON));
    };
    QuitPopup.prototype.switchGUIMute = function () {
        this._layout.confirmButton.setDownSound(SoundManager.areClipsMuted ? SoundManager.getSound(SoundOption.BUTTON) : null);
        this._layout.cancelButton.setDownSound(SoundManager.areClipsMuted ? SoundManager.getSound(SoundOption.BUTTON) : null);
    };
    return QuitPopup;
}(Popup));
/// <reference path="Popup.ts"/>
/**
 * Results Popup controller
 * Includes Confirm & Cancel Buttons
 * @author      dsremski <d.sremski@gmail.com>
 * @version     13.05.2021
 * @copyright   2021 Damian Śremski
 */
var ResultsPopup = /** @class */ (function (_super) {
    __extends(ResultsPopup, _super);
    function ResultsPopup(game) {
        var _this = _super.call(this, game, new ResultsPopupLayout(game)) || this;
        _this.game = game;
        /**
        * Play Again Button event dispatcher
        */
        _this.onPlayAgainButtonClick = new Phaser.Signal();
        /**
         * Quit Button event dispatcher
         */
        _this.onQuitButtonClick = new Phaser.Signal();
        _this.createPopupFrame();
        _this.initializeButtons();
        _this.initializeContent();
        _this.applyGUIMute();
        HUDEventsManager.registerButtonSoundClick(_this.switchGUIMute, _this);
        return _this;
    }
    Object.defineProperty(ResultsPopup.prototype, "_layout", {
        get: function () {
            return this.layout;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param scoreToDisplay
     */
    ResultsPopup.prototype.setScore = function (scoreToDisplay) {
        this._layout.scoreLabel.text = HUDUtils.pad(scoreToDisplay, 7);
    };
    ResultsPopup.prototype.createPopupFrame = function () {
        var popupFrame = new Phaser.Graphics(this.game, this.layout.popupFrame.x, this.layout.popupFrame.y);
        popupFrame.beginFill(this.layout.popupFrame.tint);
        popupFrame.drawRoundedRect(0, 0, this.layout.popupFrame.width, this.layout.popupFrame.height, GameSetting.popupFrameRadius);
        popupFrame.alpha = GameSetting.popupFrameAlpha;
        popupFrame.tint = GameSetting.popupFrameTint;
        this._layout.popupGroup.add(popupFrame);
        this._layout.popupGroup.swap(popupFrame, this.layout.popupFrame);
        this._layout.popupFrame.alpha = 0;
    };
    /**
     * Yes & No Buttons
     */
    ResultsPopup.prototype.initializeButtons = function () {
        var _this = this;
        this.setupTextButton(this._layout.playAgainButton, this._layout.playAgainButtonLabel);
        this._layout.playAgainButton.onInputUp.add(function () {
            if (_this._layout.playAgainButton.input.pointerOver()) {
                _this.hide(false);
                _this.onPlayAgainButtonClick.dispatch();
            }
        }, this);
        this.setupTextButton(this._layout.quitButton, this._layout.quitButtonLabel);
        this._layout.quitButton.onInputUp.add(function () {
            if (_this._layout.quitButton.input.pointerOver()) {
                _this.hide(false);
                _this.onQuitButtonClick.dispatch();
            }
        }, this);
    };
    /**
     * Sets scale to popup's buttons
     */
    ResultsPopup.prototype.initializeContent = function () {
        this._layout.playAgainButtonLabel.lineSpacing = 2;
        if (GameMode.isMobile) {
            this._layout.playAgainButton.scale.set(GameSetting.quitPopupButtonScaleBase);
            this._layout.quitButton.scale.set(GameSetting.quitPopupButtonScaleBase);
            this._layout.playAgainButtonLabel.anchor.set(.5, .5);
            this._layout.quitButtonLabel.anchor.set(.5, .5);
        }
    };
    ResultsPopup.prototype.applyGUIMute = function () {
        this._layout.playAgainButton.setDownSound(SoundManager.areClipsMuted ? null : SoundManager.getSound(SoundOption.BUTTON));
        this._layout.playAgainButton.setDownSound(SoundManager.areClipsMuted ? null : SoundManager.getSound(SoundOption.BUTTON));
    };
    ResultsPopup.prototype.switchGUIMute = function () {
        this._layout.playAgainButton.setDownSound(SoundManager.areClipsMuted ? SoundManager.getSound(SoundOption.BUTTON) : null);
        this._layout.quitButton.setDownSound(SoundManager.areClipsMuted ? SoundManager.getSound(SoundOption.BUTTON) : null);
    };
    return ResultsPopup;
}(Popup));
/// <reference path="Popup.ts"/>
/**
 * Tutorial Popup controller
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var TutorialPopup = /** @class */ (function (_super) {
    __extends(TutorialPopup, _super);
    function TutorialPopup(game) {
        var _this = _super.call(this, game, new TutorialPopupLayout(game)) || this;
        _this.game = game;
        /**
         * onPlayButtonClick Event
         */
        _this.onPlayButtonClick = new Phaser.Signal();
        _this.initializeButtons();
        _this.initializeCheckBox();
        _this.applyGUIMute();
        HUDEventsManager.registerButtonSoundClick(_this.switchGUIMute, _this);
        return _this;
    }
    Object.defineProperty(TutorialPopup.prototype, "_layout", {
        get: function () {
            return this.layout;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Play & Next buttons
     */
    TutorialPopup.prototype.initializeButtons = function () {
        var _this = this;
        this.setupButton(this._layout.playButton, GameSetting.tutorialButtonScaleBase);
        this._layout.playButton.onInputUp.add(function () {
            if (_this._layout.playButton.input.pointerOver()) {
                _this.hide(false);
                _this.onPlayButtonClick.dispatch();
            }
        }, this);
    };
    /**
     * Checkbox "Don't Show Again"
     */
    TutorialPopup.prototype.initializeCheckBox = function () {
        var _this = this;
        if (this.game.device.localStorage) {
            this._layout.checkBoxCheck.visible = window.localStorage[TutorialPopupOption.DONT_SHOW_AGAIN] === String(true);
        }
        this.setupCheckbox(this._layout.checkBox, this._layout.checkBoxCheck, this._layout.checkBoxGroup);
        this._layout.checkBox.onInputUp.add(function () {
            if (_this._layout.checkBox.input.pointerOver()) {
                if (_this.game.device.localStorage) {
                    window.localStorage[TutorialPopupOption.DONT_SHOW_AGAIN] = String(_this._layout.checkBoxCheck.visible);
                }
            }
        }, this);
    };
    TutorialPopup.prototype.applyGUIMute = function () {
        this._layout.playButton.setDownSound(SoundManager.areClipsMuted ? null : SoundManager.getSound(SoundOption.BUTTON));
        this._layout.checkBox.setDownSound(SoundManager.areClipsMuted ? null : SoundManager.getSound(SoundOption.CHECKBOX));
    };
    TutorialPopup.prototype.switchGUIMute = function () {
        this._layout.playButton.setDownSound(SoundManager.areClipsMuted ? SoundManager.getSound(SoundOption.BUTTON) : null);
        this._layout.checkBox.setDownSound(SoundManager.areClipsMuted ? SoundManager.getSound(SoundOption.CHECKBOX) : null);
    };
    return TutorialPopup;
}(Popup));
/// <reference path="Popup.ts"/>
/**
 * Welcome Popup Layout container controller
 * Includes: Play Now! Button and Player Name's TextField
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var WelcomePopup = /** @class */ (function (_super) {
    __extends(WelcomePopup, _super);
    function WelcomePopup(game) {
        var _this = _super.call(this, game, new WelcomePopupLayout(game)) || this;
        _this.game = game;
        /**
         * Play Now! Button event dispatches
         */
        _this.onPlayButtonClick = new Phaser.Signal();
        _this.createPopupFrame();
        _this.initializeButtons();
        _this.applyGUIMute();
        HUDEventsManager.registerButtonSoundClick(_this.switchGUIMute, _this);
        return _this;
    }
    Object.defineProperty(WelcomePopup.prototype, "_layout", {
        /**
         * Welcome Popup Layout
         */
        get: function () {
            return this.layout;
        },
        enumerable: true,
        configurable: true
    });
    WelcomePopup.prototype.createPopupFrame = function () {
        var popupFrame = new Phaser.Graphics(this.game, this.layout.popupFrame.x, this.layout.popupFrame.y);
        popupFrame.beginFill(this.layout.popupFrame.tint);
        popupFrame.drawRoundedRect(0, 0, this.layout.popupFrame.width, this.layout.popupFrame.height, this._layout.popupCornerRadius);
        this._layout.popupGroup.add(popupFrame);
        this._layout.popupGroup.swap(popupFrame, this.layout.popupFrame);
        this._layout.popupFrame.alpha = 0;
    };
    /**
     * Text Button "Play Now!"
     */
    WelcomePopup.prototype.initializeButtons = function () {
        var _this = this;
        this.setupTextButton(this._layout.playButton, this._layout.playButtonLabel);
        this._layout.playButton.onInputUp.add(function () {
            if (_this._layout.playButton.input.pointerOver()) {
                _this.hide(true);
                _this.onPlayButtonClick.dispatch();
            }
        }, this);
    };
    WelcomePopup.prototype.applyGUIMute = function () {
        this._layout.playButton.setDownSound(SoundManager.areClipsMuted ? null : SoundManager.getSound(SoundOption.BUTTON));
    };
    WelcomePopup.prototype.switchGUIMute = function () {
        this._layout.playButton.setDownSound(SoundManager.areClipsMuted ? SoundManager.getSound(SoundOption.BUTTON) : null);
    };
    return WelcomePopup;
}(Popup));
/**
 * Player's activities register
 * Listens: every player's activities in Game
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var ActivityManager = /** @class */ (function () {
    function ActivityManager(game) {
        this.game = game;
    }
    Object.defineProperty(ActivityManager.prototype, "lastActivityTimestamp", {
        /**
         * @returns Player's last activity Timestamp
         */
        get: function () {
            return this._lastActivityTimestamp;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Setups Updates
     */
    ActivityManager.prototype.init = function () {
        this.reset();
        this.catchLastActivityTimestamp();
        this.setupUpdate();
        this.registerActivities();
    };
    ActivityManager.prototype.reset = function () {
    };
    ActivityManager.prototype.catchLastActivityTimestamp = function () {
        this._lastActivityTimestamp = this.game.time.now;
    };
    ActivityManager.prototype.setupUpdate = function () {
    };
    /**
     * Starts to listening all of player's activities during pure (not paused) gameplay
     */
    ActivityManager.prototype.registerActivities = function () {
        /**
        * Game Events as a consequences of User's activities
        */
        HUDEventsManager.registerButtonHelpClick(this.onActivity, this, false);
        HUDEventsManager.registerButtonMusicClick(this.onActivity, this, false);
        HUDEventsManager.registerButtonSoundClick(this.onActivity, this, false);
        HUDEventsManager.registerButtonQuitClick(this.onActivity, this, false);
    };
    /**
     * @description Universal event listener
     * @param dummy accepts all kind of arguments
     */
    ActivityManager.prototype.onActivity = function (dummy) {
        this.catchLastActivityTimestamp();
        this.reset();
    };
    /**
     * @description Universal event listener; Updates counter for auto actions triggering
     * @param dummy accepts all kind of arguments
     */
    ActivityManager.prototype.update = function (dummy) {
        // let timeToLastActivity: number = this.game.time.now - this.lastActivityTimestamp;
    };
    return ActivityManager;
}());
/**
 * Manager responsible for playing music and clips
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var SoundManager = /** @class */ (function () {
    /**
     * Initializes this SoundManager and loads mute state from localStorage.
     * Use 'getInstance' instead
     * @param game Instance of the game.
     */
    function SoundManager(game) {
        this.game = game;
        this._isMusicMuted = false;
        this._areClipsMuted = false;
        this.musicVolume = 1;
    }
    Object.defineProperty(SoundManager, "isMusicMuted", {
        /**
         * Music Mute State
         */
        get: function () {
            return SoundManager.getInstance().isMusicMuted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundManager, "areClipsMuted", {
        /**
         * Clips Mute State
         */
        get: function () {
            return SoundManager.getInstance().areClipsMuted;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns instance of SoundManager
     * @param game Instance of the game
     */
    SoundManager.getInstance = function (game) {
        if (!SoundManager.instance) {
            if (!game) {
                throw new ReferenceError("You must pass phaser game for the first instance bringing");
            }
            SoundManager.instance = new SoundManager(game);
        }
        return SoundManager.instance;
    };
    /**
     * Plays music with specified volume
     * @param musicToPlay Name of the music to play
     * @param volume Volume in with music should play (0-1 range)
     * @returns
     */
    SoundManager.playMusic = function (musicToPlay, volume) {
        SoundManager.getInstance().playMusic(musicToPlay, volume);
        return SoundManager.getInstance().music;
    };
    /**
     * Static shortcut to stop playing current music
     */
    SoundManager.stopMusic = function () {
        SoundManager.getInstance().stopMusic();
    };
    /**
     * Static shortcut for playing clips
     */
    SoundManager.playClip = function (clipName, volume, loop, autoStopTrigger) {
        if (volume === void 0) { volume = 1; }
        if (loop === void 0) { loop = false; }
        if (autoStopTrigger === void 0) { autoStopTrigger = 420 * 1000; }
        volume = Phaser.Math.clamp(volume, 0, 1); // fix for IE freezing game issue
        return SoundManager.getInstance().playClip(clipName, volume, loop, autoStopTrigger);
    };
    /**
     * Static shortcut to play clips or resume if clip is playing already
     */
    SoundManager.playOrResumeClip = function (clipName, volume, loop, autoStopTrigger) {
        if (volume === void 0) { volume = 1; }
        if (loop === void 0) { loop = false; }
        if (autoStopTrigger === void 0) { autoStopTrigger = 420; }
        if (!SoundManager.getSound(clipName).isPlaying) {
            SoundManager.getInstance().playClip(clipName, volume, loop, autoStopTrigger);
        }
    };
    /**
     * Fades in currently playing music.
     * @param volume Final volume of the music (0-1 range)
     * @param duration Time unlit final volume (in ms)
     */
    SoundManager.fadeInMusic = function (volume, duration) {
        if (duration === void 0) { duration = Phaser.Timer.SECOND; }
        SoundManager.getInstance().fadeInMusic(volume, duration);
    };
    /**
    * Fades out currently playing music
    * @param duration Time unlit volume reaches 0 (in ms)
    */
    SoundManager.fadeOutMusic = function (duration) {
        if (duration === void 0) { duration = Phaser.Timer.SECOND; }
        SoundManager.getInstance().fadeOutMusic(duration);
    };
    /**
     * On visibility of the game changed
     */
    SoundManager.applyMute = function (isMute) {
        SoundManager.getInstance().applyMute(isMute);
    };
    /**
     * Shortcut for Music Mute switching
     */
    SoundManager.switchMusicMute = function () {
        var manager = SoundManager.getInstance();
        if (manager.isMusicMuted) {
            manager.unmuteMusic();
        }
        else {
            manager.muteMusic();
        }
    };
    /**
     * Static shortcut for Sound Clips Mute Switch
     */
    SoundManager.switchClipsMute = function () {
        if (SoundManager.areClipsMuted) {
            SoundManager.getInstance().unmuteClips();
            SoundManager.getInstance().unmuteUI();
        }
        else {
            SoundManager.getInstance().muteClips();
            SoundManager.getInstance().muteUI();
        }
    };
    Object.defineProperty(SoundManager.prototype, "isMusicMuted", {
        /**
         * Non-static members
         */
        get: function () {
            return this._isMusicMuted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundManager.prototype, "areClipsMuted", {
        get: function () {
            return this._areClipsMuted;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundManager.prototype, "music", {
        get: function () {
            return SoundManager._music;
        },
        set: function (value) {
            SoundManager._music = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SoundManager.prototype, "ambient", {
        get: function () {
            return SoundManager._ambient;
        },
        set: function (value) {
            SoundManager._ambient = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Setups Music & SFX Mute States depends on Storage Data
     */
    SoundManager.prototype.init = function () {
        this.initWithStorageData();
    };
    /**
     * Plays music with specified volume
     * @param ambientToPlay Name of the music to play
     * @param volume Volume in with music should play (0-1 range)
     */
    SoundManager.prototype.playAmbient = function (ambientToPlay, volume) {
        if (this.ambient) {
            this.ambient.stop();
        }
        this.ambient = this.game.add.audio(ambientToPlay);
        this.ambient.allowMultiple = true;
        if (this.ambient) {
            this.ambient.loopFull();
            this.ambient.volume = this.isMusicMuted ? 0 : volume;
        }
        return this.ambient;
    };
    /**
     * Stops playing current ambient
     */
    SoundManager.prototype.stopAmbient = function () {
        if (this.ambient) {
            this.ambient.stop();
        }
    };
    /**
     *
     * @param duration
     */
    SoundManager.prototype.fadeOutAmbient = function (duration) {
        if (duration === void 0) { duration = 2 * Phaser.Timer.SECOND; }
        if (this.ambient && this.ambient.volume > 0) {
            if (!this.fadeAmbient) {
                this.fadeAmbient = this.game.add.tween(this.ambient);
            }
            //if ( !this.fadeAmbient.isRunning )
            {
                this.fadeAmbient.to({
                    volume: 0
                }, duration, null, true);
            }
        }
    };
    /**
     * Plays music with specified volume.
     * @param musicToPlay Name of the music to play.
     * @param volume Volume in with music should play (0-1 range).
     */
    SoundManager.prototype.playMusic = function (musicToPlay, volume) {
        if (volume === void 0) { volume = 1; }
        if (this.music) {
            this.music.stop();
        }
        this.music = this.game.add.audio(musicToPlay);
        this.music.allowMultiple = true;
        if (this.music) {
            this.music.loopFull();
            this.music.volume = this.isMusicMuted ? 0 : volume;
        }
        return this.music;
    };
    /**
     * Pauses currently playing music.
     */
    SoundManager.prototype.pauseMusic = function () {
        if (this.music) {
            this.music.pause();
            this.music.mute = true; // workaround for firefox
        }
    };
    /**
     * Resumes playing music
     */
    SoundManager.prototype.resumeMusic = function () {
        if (this.music) {
            this.music.resume();
            this.music.mute = false; // workaround for firefox
        }
    };
    /**
     * Stops playing current music
     */
    SoundManager.prototype.stopMusic = function () {
        if (this.music) {
            this.music.stop();
        }
    };
    /**
     * Fades out currently playing music
     * @param duration Time unlit volume reaches 0 (in ms)
     */
    SoundManager.prototype.fadeOutMusic = function (duration) {
        if (duration === void 0) { duration = Phaser.Timer.SECOND; }
        if (this.music && this.music.volume > 0) {
            if (!this.fadeMusic) {
                this.fadeMusic = this.game.add.tween(this.music);
            }
            if (!this.fadeMusic.isRunning) {
                this.fadeMusic.to({
                    volume: 0
                }, duration, null, true);
            }
        }
    };
    /**
     * Fades in currently playing music.
     * @param volume Final volume of the music (0-1 range).
     * @param duration Time unlit final volume (in ms).
     */
    SoundManager.prototype.fadeInMusic = function (volume, duration) {
        if (duration === void 0) { duration = Phaser.Timer.SECOND; }
        if (this.music && this.music.volume === 0) {
            if (!this.fadeMusic) {
                this.fadeMusic = this.game.add.tween(this.music);
            }
            if (!this.fadeMusic.isRunning) {
                this.fadeMusic.to({
                    volume: volume
                }, duration, null, true);
            }
        }
    };
    /**
     * Mutes music and saves this state to localStorage.
     */
    SoundManager.prototype.muteMusic = function () {
        this._isMusicMuted = true;
        if (this.music) {
            this.musicVolume = this.music.volume;
            this.music.volume = 0;
        }
        if (this.ambient) {
            this.ambient.volume = 0;
        }
        if (this.game.device.localStorage) {
            window.localStorage.setItem(SoundManagerOption.isMusicMuted, String(this.isMusicMuted));
        }
    };
    /**
     *
     */
    SoundManager.prototype.isMusicMutedNow = function () {
        return window.localStorage.getItem(SoundManagerOption.isMusicMuted) == String(true);
    };
    /**
     * Unmutes music and saves this state to localStorage
     */
    SoundManager.prototype.unmuteMusic = function () {
        this._isMusicMuted = false;
        if (this.music) {
            this.music.volume = GameSetting.backgroundMusicVolume; //this.musicVolume;
        }
        if (this.game.device.localStorage) {
            window.localStorage.setItem(SoundManagerOption.isMusicMuted, String(this.isMusicMuted));
        }
    };
    /**
     * Plays clip with specified volume
     * @param clipName Name of clip to play
     * @param volume Volume of the music to play (0-1 range)
     */
    SoundManager.prototype.playClip = function (clipName, volume, loop, autoStopTrigger) {
        if (volume === void 0) { volume = 1; }
        if (loop === void 0) { loop = false; }
        if (autoStopTrigger === void 0) { autoStopTrigger = 420; }
        var sound = this.game.sound.play(clipName, volume, loop);
        sound.volume = this._areClipsMuted ? 0 : volume;
        sound.allowMultiple = true;
        if (loop) {
            this.game.time.events.add(autoStopTrigger, function () {
                sound.stop();
            }, this);
        }
        return sound;
    };
    /**
     * Pauses given clip.
     * @param clip Sound clip to pause.
     */
    SoundManager.prototype.pauseClip = function (clip) {
        if (clip) {
            clip.pause();
            clip.mute = true; // workaround for firefox
        }
    };
    /**
     * Resumes playing given clip.
     * @param clip Sound clip to resume.
     */
    SoundManager.prototype.resumeClip = function (clip) {
        if (clip) {
            clip.resume();
            clip.mute = false; // workaround for firefox
        }
    };
    /**
     * Stops playing given clip.
     * @param clip Sound clip to stop.
     */
    SoundManager.prototype.stopClip = function (clip) {
        if (clip) {
            clip.stop();
        }
    };
    /**
     * Static shortcut for playing Clips
     * @param soundName
     * @param pVolume
     */
    SoundManager.getSound = function (soundName, pVolume) {
        return SoundManager.getInstance().getSound(soundName, pVolume);
    };
    /**
    * Shortcut for Sound Clips Mute Switch
    */
    SoundManager.prototype.switchClipsMute = function () {
        if (this.areClipsMuted) {
            this.unmuteClips();
            this.unmuteUI();
        }
        else {
            this.muteClips();
            this.muteUI();
        }
    };
    /**
     * Mutes all clips and saves this state to localStorage.
     */
    SoundManager.prototype.muteClips = function () {
        this._areClipsMuted = true;
        if (this.game.device.localStorage) {
            window.localStorage.setItem(SoundManagerOption.areClipsMuted, String(this.areClipsMuted));
        }
    };
    /**
     * Mutes Button's and Checkbox's Click SFXs
     */
    SoundManager.prototype.muteUI = function () {
        this.getSound(SoundOption.BUTTON).volume = 0;
        this.getSound(SoundOption.CHECKBOX).volume = 0;
    };
    /**
     * Unmutes all clips and saves this state to localStorage.
     */
    SoundManager.prototype.unmuteClips = function () {
        this._areClipsMuted = false;
        if (this.game.device.localStorage) {
            window.localStorage.setItem(SoundManagerOption.areClipsMuted, String(this.areClipsMuted));
        }
    };
    /**
    * Unmutes GUI Clicks SFXs
    */
    SoundManager.prototype.unmuteUI = function () {
        this.getSound(SoundOption.BUTTON).volume = 1;
        this.getSound(SoundOption.CHECKBOX).volume = 1;
    };
    /**
     * Plays clip sound after delay.
     * @param clipName Name of the clip to play
     * @param delay Delay to start playing given clip (in ms)
     */
    SoundManager.prototype.playSoundWithDelay = function (clipName, delay) {
        var _this = this;
        setTimeout(function () {
            _this.playClip(clipName);
        }, delay);
    };
    /**
     * Util for playing Clips
     * @param soundName
     * @param pVolume
     */
    SoundManager.prototype.getSound = function (soundName, pVolume) {
        return this.game.sound.add(soundName, pVolume);
    };
    SoundManager.prototype.initWithStorageData = function () {
        if (this.game.device.localStorage) {
            if (window.localStorage.getItem(SoundManagerOption.isMusicMuted) === String(false)) {
                this.unmuteMusic();
            }
            else {
                this.muteMusic();
            }
            if (window.localStorage.getItem(SoundManagerOption.areClipsMuted) === String(true)) {
                this.muteClips();
            }
            else {
                this.unmuteClips();
            }
        }
        else {
            this.unmuteMusic();
            this.muteClips();
        }
    };
    SoundManager.prototype.applyMute = function (isMute) {
        this.game.sound.mute = isMute;
    };
    return SoundManager;
}());
/**
 * Visibility Signals management class
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var VisibilityManager = /** @class */ (function () {
    function VisibilityManager(game) {
        this.game = game;
        VisibilityManager.instance = this;
    }
    Object.defineProperty(VisibilityManager, "isGameVisible", {
        /**
         * @returns boolean: game visibility status (true - displays, false - hides)
         */
        get: function () {
            return VisibilityManager._isGameVisible;
        },
        /**
         * Pauses/Resumes Game, Tweens and Switches Sound Manager's Mute state
         * @param isVisible setted at onVisibilityChange listener
         */
        set: function (isVisible) {
            if (isVisible) {
                VisibilityManager.getInstance().resumeActions();
            }
            else {
                VisibilityManager.getInstance().pauseActions();
            }
            VisibilityManager._isGameVisible = isVisible;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns instance of SoundManager
     * @param game Instance of the game
     */
    VisibilityManager.getInstance = function (game) {
        if (!VisibilityManager.instance) {
            if (!game) {
                throw new ReferenceError("You must pass phaser game for the first instance bringing");
            }
            VisibilityManager.instance = new VisibilityManager(game);
        }
        return VisibilityManager.instance;
    };
    /**
    * Registers on Visibility Change Events listener
    */
    VisibilityManager.init = function (game) {
        VisibilityManager.getInstance(game).init();
    };
    /**
     * Registers on Visibility Change Events listener
     */
    VisibilityManager.prototype.init = function () {
        VisibilityManager._isGameVisible = true;
        this.game.stage.visibilityChange = this.onVisibilityChange;
    };
    VisibilityManager.prototype.onVisibilityChange = function (event) {
        var isVisible = document.visibilityState === VisibilityOption.VISIBLE;
        var isHidden = document.visibilityState === VisibilityOption.HIDDEN;
        if (isHidden) {
            VisibilityManager.isGameVisible = false;
        }
        else {
            if (isVisible) {
                VisibilityManager.isGameVisible = true;
            }
        }
    };
    VisibilityManager.prototype.pauseActions = function () {
        this.game.paused = true;
        this.game.tweens.pauseAll();
    };
    VisibilityManager.prototype.resumeActions = function () {
        this.game.paused = false;
        this.game.tweens.resumeAll();
    };
    return VisibilityManager;
}());
/**
 * Game's last state
 * Adds extra text/textures if extra summary screen is needed, otherwise leaves as it is
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var GameOverState = /** @class */ (function (_super) {
    __extends(GameOverState, _super);
    function GameOverState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Fullfills and Animates Game Over Layout
     */
    GameOverState.prototype.init = function () {
        this.fulfillLayout();
    };
    /**
     * Stops Music, Animates Game Over Label
     */
    GameOverState.prototype.create = function () {
        SoundManager.stopMusic();
        SoundManager.fadeInMusic(GameSetting.gameOverAnimationDuration);
        SoundManager.playClip(SoundOption.GAME_OVER);
        SoundManager.fadeOutMusic(GameSetting.gameOverAnimationDuration);
    };
    GameOverState.prototype.fulfillLayout = function () {
        this.add.sprite(0, 0, TextureOption.background);
        this.layout = new GameOverLayout(this);
        this.layout.animateOut();
        StarlingLayoutManager.getInstance().fulfillGameLayout(this.game.cache.getJSON(LayoutOption.gameOverLayout));
        this.layout.setupGreetingsLabel(function () {
            GameEventsManager.notifyGameEnd();
        }, this);
    };
    return GameOverState;
}(Phaser.State));
/**
 * Initializes whole game logic, graphics and all components
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var GameplayState = /** @class */ (function (_super) {
    __extends(GameplayState, _super);
    function GameplayState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Fullfills Gameplay Layout
     */
    GameplayState.prototype.init = function () {
        this.visibility = new VisibilityManager(this.game);
        this.visibility.init();
        this.fulfillLayout();
    };
    /**
    * Inits Gameplay
    */
    GameplayState.prototype.create = function () {
        this.initGameplay();
        this.animateIn();
    };
    /**
     * Updates Timer, Board Controller, Score Controller and HUD Controller
     */
    GameplayState.prototype.update = function () {
        if (VisibilityManager.isGameVisible) {
            this.score.update();
            this.hud.update();
        }
    };
    GameplayState.prototype.fulfillLayout = function () {
        this.add.sprite(0, 0, TextureOption.background);
        var boardLayout = new GameplayLayout(this);
        this.hud = new HUDController(this.game, new HUDLayout(this), boardLayout);
        this.board = new BoardController(this.game, boardLayout, this.hud);
    };
    GameplayState.prototype.initGameplay = function () {
        this.attachGameEventsListeners();
        this.keyboard = new KeyboardEventsManager(this.game);
        this.board.init(this.keyboard);
        this.score = new ScoreController(this.game);
        this.score.init();
        this.activities = new ActivityManager(this.game);
        this.activities.init();
        this.hud.init(SoundManager.isMusicMuted, SoundManager.areClipsMuted);
        GameplayEventsManager.registerGameplayStart(this.startGame, this);
    };
    GameplayState.prototype.animateIn = function () {
        var _this = this;
        this.board.animate(false, GameSetting.boardOutDuration, function () {
            _this.hud.animateIn(GameSetting.hudInDuration, _this.playIntro, _this);
        }, this);
    };
    GameplayState.prototype.playIntro = function () {
        this.board.animateIntro(function () {
            GameplayEventsManager.startGameplay();
        }, this);
    };
    GameplayState.prototype.startGame = function () {
        var _this = this;
        GameplayEventsManager.registerGameplayEnd(this.onGameplayEnds, this, true);
        this.attachButtonClickListeners();
        this.hud.startCountDown(function () {
            _this.keyboard.enableEventsDispatching();
            BoardEventsManager.unlockBoard();
            _this.board.startGameplay();
        }, this);
    };
    GameplayState.prototype.onGameplayEnds = function (reason) {
        switch (reason) {
            case GameplayEndOption.REASON_GAME_OVER:
                this.onGameOver();
                break;
            case GameplayEndOption.REASON_QUIT:
                this.onGameOver();
                break;
            case GameplayEndOption.NO_REASON:
            default:
                this.onQuitGame();
                break;
        }
    };
    GameplayState.prototype.onGameOver = function () {
        this.keyboard.enableEventsDispatching(false);
        this.setupAndShowResultPopup();
    };
    GameplayState.prototype.setupAndShowResultPopup = function () {
        this.hud.resultsPopup.onPlayAgainButtonClick.addOnce(this.onPlayAgain, this);
        this.hud.resultsPopup.onQuitButtonClick.addOnce(this.onQuitGame, this);
        this.hud.resultsPopup.setScore(this.score.score);
        this.hud.resultsPopup.show(false, 0);
    };
    GameplayState.prototype.onPlayAgain = function () {
        this.board.dispose();
        this.score.clearScore();
        this.startGame();
    };
    GameplayState.prototype.onQuitGame = function () {
        this.board.endGameplay();
        this.board.dispose();
        this.detachGameEventsListeners();
        SoundManager.fadeOutMusic(GameSetting.quitGreetingsLifespan);
        BoardEventsManager.lockBoard();
        this.dispose();
    };
    GameplayState.prototype.attachGameEventsListeners = function () {
        this.hud.quitPopup.onConfirmButtonClick.addOnce(function () {
            GameplayEventsManager.endGameplay(GameplayEndOption.REASON_QUIT);
        }, this);
    };
    GameplayState.prototype.detachGameEventsListeners = function () {
    };
    /**
    * HUD's Help button
    */
    GameplayState.prototype.onHelp = function () {
        this.pauseGame();
        this.hud.tutorialPopup.onPlayButtonClick.addOnce(this.resumeGame, this);
        this.hud.tutorialPopup.show(false, 0);
    };
    /**
    * HUD's Quit button
    */
    GameplayState.prototype.onQuit = function () {
        this.pauseGame();
        this.hud.quitPopup.onCancelButtonClick.addOnce(this.resumeGame, this);
        this.hud.quitPopup.show(false, 0);
    };
    GameplayState.prototype.pauseGame = function () {
        this.board.pauseGameplay();
        this.keyboard.enableEventsDispatching(false);
        this.detachButtonClickListeners();
    };
    GameplayState.prototype.resumeGame = function () {
        this.board.resumeGameplay();
        this.keyboard.enableEventsDispatching();
        this.attachButtonClickListeners();
    };
    GameplayState.prototype.attachButtonClickListeners = function () {
        HUDEventsManager.registerButtonHelpClick(this.onHelp, this);
        HUDEventsManager.registerButtonQuitClick(this.onQuit, this);
        this.hud.attachButtonsListeners();
    };
    GameplayState.prototype.detachButtonClickListeners = function () {
        HUDEventsManager.removeButtonHelpClickListeners();
        HUDEventsManager.removeButtonQuitClickListeners();
        this.hud.detachButtonsListeners();
    };
    /**
    * Goes to Game Over State
    */
    GameplayState.prototype.goToGameOverState = function () {
        GameEventsManager.dispatchGoToGameOverState(this.score.score);
    };
    GameplayState.prototype.dispose = function () {
        var _this = this;
        this.hud.animateOut(GameSetting.hudInDuration, this.goToGameOverState, this);
        this.game.time.events.add(Phaser.Timer.QUARTER, function () {
            _this.hud.dispose();
            _this.detachButtonClickListeners();
        }, this);
    };
    return GameplayState;
}(Phaser.State));
/**
 * Loads game options file and configures Phaser engine
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 *
 * @requires assets directory content
 */
var InitState = /** @class */ (function (_super) {
    __extends(InitState, _super);
    function InitState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Setups Game Data Path
     */
    InitState.prototype.init = function () {
        SoundManager.getInstance(this.game).init(); // requires reference to Phaser.Game instance for the first Use
        VisibilityManager.init(this.game);
        BoardUtils.cacheGameReference(this.game);
    };
    /**
     * Loads Game Options
     */
    InitState.prototype.preload = function () {
        this.configurePhaserEngine();
        this.prepareOptionsPath();
        this.loadGameOptions();
    };
    /**
     * Starts Preloader State
     */
    InitState.prototype.create = function () {
        this.startNextState();
    };
    InitState.prototype.configurePhaserEngine = function () {
        this.game.renderer.renderSession.roundPixels = true;
        this.game.stage.backgroundColor = GameSetting.backgroundFill;
        this.game.stage.disableVisibilityChange = true;
        this.game.input.maxPointers = 1;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.disableContextMenu();
    };
    InitState.prototype.disableContextMenu = function () {
        this.game.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
    };
    InitState.prototype.prepareOptionsPath = function () {
        this.GAME_DATA_PATH = PathOption.ASSETS + '/' + String(GameMode.device) + '/' + "gameData" + '.' + ExtensionOption.json;
    };
    InitState.prototype.loadGameOptions = function () {
        this.load.json(AssetKey.gameData, this.GAME_DATA_PATH);
    };
    InitState.prototype.startNextState = function () {
        GameEventsManager.dispatchGoToPreloaderState();
    };
    return InitState;
}(Phaser.State));
/**
 * Loads assets for the game
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 *
 * @requires assets directory content
 */
var PreloaderState = /** @class */ (function (_super) {
    __extends(PreloaderState, _super);
    function PreloaderState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Initializes this state
     */
    PreloaderState.prototype.init = function () {
        this.getGameOptions();
    };
    PreloaderState.prototype.getGameOptions = function () {
        this.gameData = this.cache.getJSON(AssetKey.gameData);
    };
    /**
     * Loads textures, layouts and sounds for game.
     */
    PreloaderState.prototype.preload = function () {
        this.loadManagers();
        this.loadAtlases();
        this.loadTextures();
        this.loadSounds();
        this.loadLayouts();
    };
    /**
     * When assets are loaded it goes to the next state.
     */
    PreloaderState.prototype.create = function () {
        this.startNextState();
    };
    PreloaderState.prototype.loadManagers = function () {
        StarlingLayoutManager.getInstance(this.game);
    };
    PreloaderState.prototype.loadAtlases = function () {
        var atlases = [];
        for (var atlas in this.gameData.atlases.options) {
            this.game.load.atlasJSONHash(atlas, this.gameData.atlases.options[atlas].data.imagePath, this.gameData.atlases.options[atlas].data.configPath);
            atlases.push(atlas);
        }
        StarlingLayoutManager.getInstance().addAtlases(atlases);
    };
    PreloaderState.prototype.loadTextures = function () {
        for (var texture in this.gameData.textures.options) {
            this.game.load.image(texture, this.gameData.textures.options[texture].data.path);
        }
    };
    PreloaderState.prototype.loadSounds = function () {
        for (var sound in this.gameData.sounds.options) {
            this.game.load.audio(sound, this.gameData.sounds.options[sound].data.path);
        }
    };
    PreloaderState.prototype.loadLayouts = function () {
        for (var layout in this.gameData.layouts.options) {
            this.game.load.json(layout, this.gameData.layouts.options[layout].data.path);
        }
    };
    /**
     * Starts Debug or Title State depends on GF Build type
     */
    PreloaderState.prototype.startNextState = function () {
        GameEventsManager.dispatchGoToTitleState();
    };
    return PreloaderState;
}(Phaser.State));
/**
 * Game's intro (play intro and start the game)
 * Includes: Welcome and Tutorial popups and Title Scene Layout
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var TitleState = /** @class */ (function (_super) {
    __extends(TitleState, _super);
    function TitleState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TitleState.prototype.init = function () {
        this.fulfillLayout();
    };
    /**
     * Plays Logo In Animation and background music
     */
    TitleState.prototype.create = function () {
        this.animate();
    };
    TitleState.prototype.animate = function () {
        switch (GameMode.device) {
            case DeviceOption.MOBILE:
            case DeviceOption.DESKTOP:
            case DeviceOption.TABLET:
            default:
                this.animateLogoIn(this.showWelcomePopup, this);
                break;
        }
    };
    /**
     * Fullfills Title Screen and Welcome & Tutorial Popups Layouts
     */
    TitleState.prototype.fulfillLayout = function () {
        this.add.sprite(0, 0, TextureOption.background);
        this.layout = new TitleLayout(this);
        this.welcomePopup = new WelcomePopup(this.game);
        this.tutorialPopup = new TutorialPopup(this.game);
    };
    /**
     * Splash logo's In animation
     */
    TitleState.prototype.animateLogoIn = function (onCompleteCallback, callbackContext) {
        var actionIn = this.layout.animateIn(function () {
        }, this);
        actionIn.onStart.addOnce(function () {
            SoundManager.playClip(SoundOption.POPUP_HIDE);
        }, this);
        actionIn.onComplete.addOnce(onCompleteCallback, callbackContext);
        actionIn.start();
    };
    /**
     * Splash logo's Out animation
     */
    TitleState.prototype.animateLogoOut = function (onCompleteCallback, callbackContext) {
        var actionOut = this.layout.animateOut(onCompleteCallback, callbackContext);
        actionOut.onStart.addOnce(function () {
            SoundManager.playClip(SoundOption.POPUP_SHOW);
        }, this);
        actionOut.start();
    };
    TitleState.prototype.showWelcomePopup = function () {
        this.welcomePopup.onPlayButtonClick.addOnce(this.onWelcomePopupComplete, this);
        this.welcomePopup.show(true, GameSetting.titleStateLifespan / 10, true);
    };
    TitleState.prototype.onWelcomePopupComplete = function () {
        this.welcomePopup.hide(true, true);
        if (this.game.device.localStorage && window.localStorage[TutorialPopupOption.DONT_SHOW_AGAIN] === String(true)) {
            this.animateLogoOut(this.startNextState, this);
        }
        else {
            this.animateLogoOut(this.showTutorialPopup, this);
        }
    };
    TitleState.prototype.showTutorialPopup = function (delay, onCompleteCallback, callbackContext) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        this.tutorialPopup.onPlayButtonClick.addOnce(function () {
            _this.tutorialPopup.hide();
            _this.startNextState();
        }, this);
        this.tutorialPopup.show(false, delay);
    };
    /**
     * Next State
     */
    TitleState.prototype.startNextState = function () {
        GameEventsManager.dispatchGoToGameplayState();
    };
    return TitleState;
}(Phaser.State));
var AlignOption;
(function (AlignOption) {
    AlignOption["LEFT"] = "left";
    AlignOption["CENTER"] = "center";
    AlignOption["RIGHT"] = "right";
    AlignOption["TOP"] = "top";
    AlignOption["MIDDLE"] = "middle";
    AlignOption["BOTTOM"] = "bottom";
})(AlignOption || (AlignOption = {}));
var AssetKey;
(function (AssetKey) {
    AssetKey["gameData"] = "gameData";
    AssetKey["phaserCanvas"] = "phaserCanvasWrapper";
})(AssetKey || (AssetKey = {}));
var AtlasOption;
(function (AtlasOption) {
    AtlasOption["mainAtlas"] = "mainAtlas";
    AtlasOption["boardAtlas"] = "boardAtlas";
    AtlasOption["splashAtlas"] = "splashAtlas";
    AtlasOption["popupAtlas"] = "popupAtlas";
})(AtlasOption || (AtlasOption = {}));
var ButtonFrame;
(function (ButtonFrame) {
    ButtonFrame["over"] = "over";
    ButtonFrame["down"] = "down";
})(ButtonFrame || (ButtonFrame = {}));
var ButtonOption;
(function (ButtonOption) {
    ButtonOption["button"] = "button";
    ButtonOption["help"] = "help";
    ButtonOption["music"] = "music";
    ButtonOption["sound"] = "sound";
    ButtonOption["exit"] = "exit";
})(ButtonOption || (ButtonOption = {}));
var ColourOption;
(function (ColourOption) {
    ColourOption["navy"] = "navy";
    ColourOption["fuchsia"] = "fuchsia";
    ColourOption["slateBlue"] = "slateBlue";
    ColourOption["gold"] = "gold";
    ColourOption["black"] = "black";
    ColourOption["grayHTML"] = "#212121";
    ColourOption["blackHTML"] = "#000";
})(ColourOption || (ColourOption = {}));
var DataFileOption;
(function (DataFileOption) {
    DataFileOption["levels"] = "levels";
    DataFileOption["cubeModel"] = "cubeModel";
})(DataFileOption || (DataFileOption = {}));
var DeviceOption;
(function (DeviceOption) {
    DeviceOption["MOBILE"] = "mobile";
    DeviceOption["DESKTOP"] = "desktop";
    DeviceOption["TABLET"] = "tablet";
})(DeviceOption || (DeviceOption = {}));
var ExtensionOption;
(function (ExtensionOption) {
    ExtensionOption["png"] = "png";
    ExtensionOption["dotPNG"] = ".png";
    ExtensionOption["jpg"] = "jpg";
    ExtensionOption["dotJPG"] = ".jpg";
    ExtensionOption["css"] = "css";
    ExtensionOption["dotCSS"] = ".css";
    ExtensionOption["json"] = "json";
    ExtensionOption["dotJSON"] = ".json";
})(ExtensionOption || (ExtensionOption = {}));
var FontOption;
(function (FontOption) {
    FontOption["Emulogic"] = "Emulogic";
})(FontOption || (FontOption = {}));
var FrameName;
(function (FrameName) {
    FrameName["backgroundBlock"] = "bg_block";
    FrameName["transparentBlock"] = "block_transparent";
    FrameName["block"] = "block";
})(FrameName || (FrameName = {}));
var GameStateOption;
(function (GameStateOption) {
    GameStateOption["INIT_STATE"] = "InitState";
    GameStateOption["PRELOADER_STATE"] = "PreloaderState";
    GameStateOption["DEBUG_STATE"] = "DebugState";
    GameStateOption["TITLE_STATE"] = "TitleState";
    GameStateOption["GAMEPLAY_STATE"] = "GameplayState";
    GameStateOption["GAME_OVER_STATE"] = "GameOverState";
})(GameStateOption || (GameStateOption = {}));
var GameplayEndOption;
(function (GameplayEndOption) {
    GameplayEndOption["REASON_TIMES_UP"] = "Times up!";
    GameplayEndOption["REASON_QUIT"] = "Quit";
    GameplayEndOption["REASON_OUT_OF_LIVES"] = "Out of lives!";
    GameplayEndOption["REASON_GAME_OVER"] = "Game Over";
    GameplayEndOption["NO_REASON"] = "Something gone wrong.";
})(GameplayEndOption || (GameplayEndOption = {}));
var GameplayOption;
(function (GameplayOption) {
    GameplayOption["initialScore"] = "initialScore";
    GameplayOption["gameplayDuration"] = "gameplayDuration";
    GameplayOption["initialSequence"] = "initialSequence";
    GameplayOption["gameDuration"] = "gameDuration";
    GameplayOption["soundsVolume"] = "soundsVolume";
    GameplayOption["musicVolume"] = "musicVolume";
})(GameplayOption || (GameplayOption = {}));
var LayoutOption;
(function (LayoutOption) {
    LayoutOption["titleLayout"] = "titleLayout";
    LayoutOption["gameplayLayout"] = "gameplayLayout";
    LayoutOption["hudLayout"] = "hudLayout";
    LayoutOption["gameOverLayout"] = "gameOverLayout";
    LayoutOption["welcomePopup"] = "welcomePopup";
    LayoutOption["tutorialPopup"] = "tutorialPopup";
    LayoutOption["resultsPopup"] = "resultsPopup";
    LayoutOption["quitPopup"] = "quitPopup";
})(LayoutOption || (LayoutOption = {}));
var MoveType;
(function (MoveType) {
    MoveType["left"] = "left";
    MoveType["right"] = "right";
    MoveType["down"] = "down";
    MoveType["drop"] = "drop";
    MoveType["rotate"] = "rotate";
})(MoveType || (MoveType = {}));
var MuteState;
(function (MuteState) {
    MuteState["ON"] = "ON";
    MuteState["OFF"] = "OFF";
})(MuteState || (MuteState = {}));
var PathOption;
(function (PathOption) {
    PathOption["ASSETS"] = "assets";
    PathOption["FONTS_STYLES"] = "fontsStyles";
    PathOption["BLOCK_"] = "block_";
})(PathOption || (PathOption = {}));
var SoundManagerOption;
(function (SoundManagerOption) {
    SoundManagerOption["isMusicMuted"] = "isMusicMuted";
    SoundManagerOption["areClipsMuted"] = "areClipsMuted";
})(SoundManagerOption || (SoundManagerOption = {}));
var SoundOption;
(function (SoundOption) {
    SoundOption["BUTTON"] = "button";
    SoundOption["CHECKBOX"] = "checkbox";
    SoundOption["POPUP_HIDE"] = "popup_hide";
    SoundOption["POPUP_SHOW"] = "popup_show";
    SoundOption["DROP"] = "drop";
    SoundOption["LINE"] = "line";
    SoundOption["TETRIS"] = "tetris";
    SoundOption["GAME_OVER"] = "game_over";
})(SoundOption || (SoundOption = {}));
var SpritesheetOption;
(function (SpritesheetOption) {
})(SpritesheetOption || (SpritesheetOption = {}));
var TextureOption;
(function (TextureOption) {
    TextureOption["background"] = "background";
    TextureOption["grayRectangle"] = "GrayRectangle";
    TextureOption["whiteRectangle"] = "WhiteRectangle";
    TextureOption["blackRectangle"] = "BlackRectangle";
    TextureOption["circle"] = "circle";
})(TextureOption || (TextureOption = {}));
var TutorialPopupOption;
(function (TutorialPopupOption) {
    TutorialPopupOption["DONT_SHOW_AGAIN"] = "dontShowAgain";
})(TutorialPopupOption || (TutorialPopupOption = {}));
var ValueType;
(function (ValueType) {
    ValueType["integer"] = "integer";
    ValueType["float"] = "float";
    ValueType["string"] = "string";
    ValueType["boolean"] = "boolean";
    ValueType["array_integer"] = "array_integer";
    ValueType["array_float"] = "array_float";
    ValueType["range"] = "range";
    ValueType["sound"] = "sound";
    ValueType["atlas"] = "atlas";
    ValueType["image"] = "image";
    ValueType["tile"] = "tile";
    ValueType["spritesheet"] = "spritesheet";
    ValueType["jsonFile"] = "jsonFile";
})(ValueType || (ValueType = {}));
var VisibilityOption;
(function (VisibilityOption) {
    VisibilityOption["HIDDEN"] = "hidden";
    VisibilityOption["VISIBLE"] = "visible";
})(VisibilityOption || (VisibilityOption = {}));
/**
 * Board Utilities
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var BoardUtils = /** @class */ (function () {
    function BoardUtils() {
    }
    /**
     *
     * @param tetrominoShape
     * @returns string representing frame name at BoardAtlas
     */
    BoardUtils.getBlockFrameName = function (tetrominoShape) {
        return FrameName.block + '_' + Tetromino.colorNames[tetrominoShape] + ExtensionOption.dotPNG;
    };
    Object.defineProperty(BoardUtils, "randomTetrominoShape", {
        /**
         * @returns random one from the set of 7 tetromino shapes
         */
        get: function () {
            //  return GameSetting.debugTetrominoShape;
            return BoardUtils.game.rnd.pick([
                TetrominoShape.I,
                TetrominoShape.J,
                TetrominoShape.L,
                TetrominoShape.O,
                TetrominoShape.S,
                TetrominoShape.T,
                TetrominoShape.Z
            ]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoardUtils, "blockSize", {
        /**
         *
         */
        get: function () {
            if (BoardUtils._blockSize == null) {
                var blockSprite = BoardUtils.game.add.sprite(0, 0, AtlasOption.boardAtlas, FrameName.transparentBlock + ExtensionOption.dotPNG);
                BoardUtils._blockSize = new Phaser.Point(blockSprite.width * GameSetting.blockIdleScale, blockSprite.height * GameSetting.blockIdleScale);
            }
            return BoardUtils._blockSize;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param tetrominoMatrix
     * @returns
     */
    BoardUtils.getFixedSpawnPosition = function (tetrominoMatrix) {
        return new Phaser.Point(GameSetting.spawnPosition.x - Math.floor(tetrominoMatrix[0].length / 2), GameSetting.spawnPosition.y - tetrominoMatrix.length);
    };
    /**
     *
     * @param game
     */
    BoardUtils.cacheGameReference = function (game) {
        BoardUtils.game = game;
    };
    /**
     *
     * @param spriteToClone
     */
    BoardUtils.cloneSprite = function (spriteToClone) {
        var clonedSprite = BoardUtils.game.add.sprite(spriteToClone.x, spriteToClone.y, spriteToClone.key, spriteToClone.frame, spriteToClone.parent);
        clonedSprite.rotation = spriteToClone.rotation;
        clonedSprite.scale.set(spriteToClone.scale.x, spriteToClone.scale.y);
        clonedSprite.anchor.set(spriteToClone.anchor.x, spriteToClone.anchor.y);
        clonedSprite.pivot.set(spriteToClone.pivot.x, spriteToClone.pivot.y);
        return clonedSprite;
    };
    /**
     *
     * @param colorToConvert number: e.g 0xdd0077
     * @return string e.g "#dd0077"
     */
    BoardUtils.colorToHex = function (colorToConvert) {
        return '#' + Phaser.Color.componentToHex(colorToConvert);
    };
    /**
     *
     * @param position
     */
    BoardUtils.snapToGrid = function (position) {
        var cellSize = 1; // BoardUtils.cellSize;
        var fixedPosition;
        if (GameMode.isMobile) {
            fixedPosition = new Phaser.Point(Phaser.Math.snapTo(position.x, cellSize) + cellSize / 2, Phaser.Math.snapTo(position.y, cellSize));
        }
        else {
            fixedPosition = new Phaser.Point(Phaser.Math.snapTo(position.x, cellSize) - cellSize / 2, Phaser.Math.snapTo(position.y, cellSize) + cellSize * 2 - 5);
        }
        return fixedPosition;
    };
    /**
     *
     * @param spriteA
     * @param spriteB
     */
    BoardUtils.checkOverlap = function (spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        var s1 = spriteA;
        var s2 = spriteB;
        return Phaser.Rectangle.intersects(boundsA, boundsB);
    };
    /**
     *
     * @param targetColor
     * @param duration
     */
    BoardUtils.tweenColor = function (game, sprite, targetColor, duration) {
        var baseColor = sprite.tint;
        var colorBlend = {
            progress: 0
        };
        var colorAction = game.add.tween(colorBlend);
        colorAction.to({
            progress: 1000
        }, duration, Phaser.Easing.Exponential.InOut, false);
        colorAction.onUpdateCallback(function () {
            sprite.tint = Phaser.Color.interpolateColor(baseColor, targetColor, 1000, colorBlend.progress);
        }, this);
        colorAction.onComplete.addOnce(function () {
            sprite.tint = targetColor;
        }, this);
        sprite.tint = baseColor;
        colorAction.start();
    };
    BoardUtils._blockSize = null;
    return BoardUtils;
}());
/**
 * HUD Utilities
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var HUDUtils = /** @class */ (function () {
    function HUDUtils() {
    }
    /**
     *
     * @param numberToPad
     * @returns
     */
    HUDUtils.pad = function (numberToPad, requiredNumberOfDigits) {
        var s = String(numberToPad);
        while (s.length < (requiredNumberOfDigits || 2)) {
            s = "0" + s;
        }
        return s;
    };
    return HUDUtils;
}());
/**
 * Created by Krzysztof Stefanowski <krzysztof.stefanowski@gmail.com> on 08/03/17. Copyright (c) 2017 Game Factory
 */
var Gamefactory;
(function (Gamefactory) {
    var StarlingLayoutDescriptionExtensions;
    (function (StarlingLayoutDescriptionExtensions) {
        function getInstance(name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var path = name.split(".");
            var context = window;
            for (var i = 0, imax = path.length; i < imax; i++) {
                context = context[path[i]];
                if (!context) {
                    console.error("Wrong context or class name: " + name);
                    return undefined;
                }
            }
            var instance = Object.create(context.prototype);
            if (!instance) {
                console.error("Can't obtain prototype of " + (context.toString()) + "  (" + name + ")");
                return undefined;
            }
            instance.constructor.apply(instance, args);
            return instance;
        }
        StarlingLayoutDescriptionExtensions.getInstance = getInstance;
    })(StarlingLayoutDescriptionExtensions = Gamefactory.StarlingLayoutDescriptionExtensions || (Gamefactory.StarlingLayoutDescriptionExtensions = {}));
})(Gamefactory || (Gamefactory = {}));
var IClsType;
(function (IClsType) {
    IClsType["Image"] = "starling.display.Image";
    IClsType["Texture"] = "starling.textures.Texture";
    IClsType["Sprite"] = "starling.display.Sprite";
    IClsType["Button"] = "starling.display.Button";
    IClsType["TextField"] = "starling.text.TextField";
    IClsType["LayoutGroup"] = "feathers.controls.LayoutGroup";
})(IClsType || (IClsType = {}));
/**
 * Starling layout parser and description holder.
 * Note: Requires Starling Builder 2 for creating JSON layout descriptions
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var StarlingLayoutDescription = /** @class */ (function () {
    /**
     * Constructs with data, game and main container
     * @param layoutData
     * @param game
     * @param group
     * @param plugins list of plugins names (with full namespace path)
     */
    function StarlingLayoutDescription(game, layoutData, group, plugins) {
        this.elementsByTag = {};
        this.elementsByName = {};
        this.plugins = [];
        this.initPlugins(layoutData, plugins);
        this.onCreateDisplayObject(null); // for root
        this.initWithDescription(game, layoutData.layout.children, group);
    }
    /**
     * Elements can be taken by their tags
     * @param tag
     * @returns {any}
     */
    StarlingLayoutDescription.prototype.getElementByTag = function (tag) {
        return this.elementsByTag[tag];
    };
    /**
     * Allows to return given object stored in layout by its name with proper type.
     * @param name Name of object stored in layout to return.
     * @example let mySprite = this.layout.getElementByName('mySprite');
     * @example let myGroup = this.layout.getElementByName<Phaser.Group>('myGroup');
     */
    StarlingLayoutDescription.prototype.getElementByName = function (name) {
        var arr = this.elementsByName[name];
        return arr && arr.length > 0 ? arr[0] : null;
    };
    /**
     * By default elements can be taken by their names.
     * @param name
     * @returns {any}
     */
    StarlingLayoutDescription.prototype.getAllElementsByName = function (name, output) {
        if (!output) {
            throw new Error('\'output\' argument is null.');
        }
        var arr = this.elementsByName[name];
        if (arr) {
            for (var index in arr) {
                output.push(arr[index]);
            }
        }
    };
    /**
     * Initializes plugins
     * @param layoutData
     * @param plugins
     */
    StarlingLayoutDescription.prototype.initPlugins = function (layoutData, plugins) {
        if (plugins && plugins.length > 0) {
            for (var index in plugins) {
                var plugin = Gamefactory.StarlingLayoutDescriptionExtensions.getInstance(plugins[index]);
                if (plugin) {
                    this.plugins.push(plugin);
                }
                else {
                    throw new Error("Can't create plugin " + plugins[index] + ".");
                }
            }
            for (var index in this.plugins) {
                this.plugins[index].initWithData(layoutData);
            }
        }
    };
    StarlingLayoutDescription.prototype.onCreateDisplayObject = function (object) {
        for (var index in this.plugins) {
            this.plugins[index].onCreateDisplayObject(object);
        }
    };
    /**
     * Inits description with JSON data, game and container
     * Stores references by names and tags. Handles sprites, buttons, text fields and groups.
     * @param game
     * @param childrenData
     * @param group
     */
    StarlingLayoutDescription.prototype.initWithDescription = function (game, childrenData, group) {
        var _this = this;
        childrenData.forEach(function (childData) {
            if (childData.customParams && childData.customParams.forEditor && childData.customParams.forEditor == true) {
                _this.onCreateDisplayObject(null);
                return;
            }
            var layoutObject = null;
            switch (childData.cls) {
                case IClsType.Image:
                    layoutObject = _this.addSprite(game, childData, group);
                    break;
                case IClsType.Button:
                    layoutObject = _this.addButton(game, childData, group);
                    break;
                case IClsType.TextField:
                    layoutObject = _this.addText(game, childData, group);
                    break;
                case IClsType.LayoutGroup:
                    layoutObject = _this.addGroup(game, childData, group);
                    if (childData.children)
                        _this.initWithDescription(game, childData.children, layoutObject);
                    break;
                default:
                    break;
            }
            _this.onCreateDisplayObject(layoutObject);
            _this.tryCacheTagged(layoutObject, childData.customParams);
        }, this);
    };
    /**
     * Checks whether data indicates that element is for editor purposes only (not included in app)
     * @param customParamsData
     * @returns {boolean}
     */
    StarlingLayoutDescription.prototype.isEditorOnly = function (customParamsData) {
        if (!customParamsData)
            return false;
        var value = customParamsData['forEditor'];
        if (value == null)
            return false;
        return value;
    };
    /**
     * Tries to cache element by tag if tags property exists
     * @param object
     * @param customParamsData
     */
    StarlingLayoutDescription.prototype.tryCacheTagged = function (object, customParamsData) {
        if (!customParamsData)
            return;
        var tag = customParamsData['tag'];
        if (tag == null)
            return;
        this.elementsByTag[tag] = object;
    };
    /**
     * Parses data and creates sprite
     * @param childData
     * @param group
     * @returns {any}
     */
    StarlingLayoutDescription.prototype.addSprite = function (game, childData, group) {
        if (this.isEditorOnly(childData.customParams)) {
            return null;
        }
        var starlingSprite = new StarlingObject(childData);
        starlingSprite.setScale(StarlingLayoutDescription.SCALE);
        var sprite;
        if (game.load.cache.checkImageKey(starlingSprite.textureName)) {
            if (starlingSprite.customComponentClass)
                sprite = this.createCustomObject(starlingSprite.customComponentClass, [game, starlingSprite.x, starlingSprite.y, starlingSprite.textureName, null, group]);
            else
                sprite = game.add.sprite(starlingSprite.x, starlingSprite.y, starlingSprite.textureName, null, group);
        }
        else {
            var finalTextureName = starlingSprite.textureName + '.png';
            var atlasName = this.findAtlasNameForFrameName(game, finalTextureName);
            if (starlingSprite.customComponentClass) {
                sprite = this.createCustomObject(starlingSprite.customComponentClass, [game, starlingSprite.x, starlingSprite.y, atlasName, finalTextureName, group]);
            }
            else {
                sprite = game.add.sprite(starlingSprite.x, starlingSprite.y, atlasName, finalTextureName, group);
            }
        }
        this.rememberObject(sprite, starlingSprite.name);
        sprite.anchor.set(starlingSprite.pivotX / sprite.width, starlingSprite.pivotY / sprite.height);
        sprite.rotation = starlingSprite.rotation;
        sprite.scale.set(starlingSprite.scaleX, starlingSprite.scaleY);
        sprite.tint = starlingSprite.color;
        sprite.alpha = starlingSprite.alpha;
        return sprite;
    };
    /**
     * Looking for specific frameName in atlases
     * @param frameName
     */
    StarlingLayoutDescription.prototype.findAtlasNameForFrameName = function (game, frameName) {
        var atlasNames = StarlingLayoutManager.getInstance().atlasNames;
        var frame;
        var currAtlasName;
        for (var i = 0; i < atlasNames.length; i++) {
            currAtlasName = atlasNames[i];
            frame = game.cache.getFrameByName(currAtlasName, frameName);
            if (frame != null) {
                return currAtlasName;
            }
        }
        return null;
    };
    /**
     * Cache object by name
     * @param object
     * @param name
     */
    StarlingLayoutDescription.prototype.rememberObject = function (object, name) {
        object.name = name;
        var arr = this.elementsByName[name];
        if (!arr) {
            this.elementsByName[name] = (arr = []);
        }
        arr.push(object);
    };
    /**
     * Parses data and creates button
     * @param childData
     * @param group
     * @returns {Phaser.Button}
     */
    StarlingLayoutDescription.prototype.addButton = function (game, childData, group) {
        if (this.isEditorOnly(childData.customParams))
            return null;
        var starlingButton = new StarlingObject(childData);
        starlingButton.setScale(StarlingLayoutDescription.SCALE);
        var fullTextureNameOut = starlingButton.textureName + '.' + ExtensionOption.png;
        var fullTextureNameOver = starlingButton.textureName + '_over' + '.' + ExtensionOption.png;
        var fullTextureNameDown = starlingButton.textureName + '_down' + '.' + ExtensionOption.png;
        var fullTextureNameUp = starlingButton.textureName + '_up' + '.' + ExtensionOption.png;
        var atlasNameForOut = this.findAtlasNameForFrameName(game, fullTextureNameOut);
        if (!this.findAtlasNameForFrameName(game, fullTextureNameOver))
            fullTextureNameOver = starlingButton.textureName + '.' + ExtensionOption.png;
        if (!this.findAtlasNameForFrameName(game, fullTextureNameDown))
            fullTextureNameDown = starlingButton.textureName + '.' + ExtensionOption.png;
        if (!this.findAtlasNameForFrameName(game, fullTextureNameUp))
            fullTextureNameUp = starlingButton.textureName + '.' + ExtensionOption.png;
        var button = game.add.button(starlingButton.x, starlingButton.y, atlasNameForOut, null, null, fullTextureNameOver, fullTextureNameOut, fullTextureNameDown, fullTextureNameUp, group);
        this.rememberObject(button, starlingButton.name);
        button.anchor.set(starlingButton.pivotX / button.width, starlingButton.pivotY / button.height);
        button.rotation = starlingButton.rotation;
        button.alpha = starlingButton.alpha;
        return button;
    };
    /**
     * Parses data and creates text
     * @param childData
     * @param group
     * @returns {Phaser.Text}
     */
    StarlingLayoutDescription.prototype.addText = function (game, childData, group) {
        if (this.isEditorOnly(childData.customParams))
            return null;
        var textPaddingLeft = 2;
        var textPaddingTop = 2;
        var textPaddingRight = -3;
        var textPaddingBottom = 1;
        var textLineSpacing = -5;
        var starlingText = new StarlingObject(childData);
        starlingText.setScale(StarlingLayoutDescription.SCALE);
        var textStyle = {
            font: starlingText.format.params.size.toString() + 'px ' + starlingText.format.params.font,
            fill: '#' + starlingText.format.params.color.toString(16),
            align: starlingText.format.params.horizontalAlign
        };
        var text = game.add.text(starlingText.x + textPaddingLeft, starlingText.y + textPaddingTop, starlingText.text, textStyle, group);
        if (starlingText.format.params.bold) {
            text.addFontWeight('bold', 0);
        }
        if (starlingText.format.params.italic) {
            text.addFontStyle('italic', 0);
        }
        if (starlingText.format.params.leading) {
            text.lineSpacing = starlingText.format.params.leading + textLineSpacing;
        }
        else {
            text.lineSpacing = textLineSpacing;
        }
        if (starlingText.autoSize) {
            text.anchor.set(starlingText.pivotX / text.width, starlingText.pivotY / text.height);
        }
        else {
            text.anchor.set(starlingText.pivotX / starlingText.width, starlingText.pivotY / starlingText.height);
        }
        text.rotation = starlingText.rotation;
        text.alpha = starlingText.alpha;
        this.rememberObject(text, starlingText.name);
        return text;
    };
    /**
     * Parses data and crates group
     * @param childData
     * @param group
     * @returns {Phaser.Group}
     */
    StarlingLayoutDescription.prototype.addGroup = function (game, childData, group) {
        if (this.isEditorOnly(childData.customParams)) {
            return null;
        }
        var starlingGroup = new StarlingObject(childData);
        starlingGroup.setScale(StarlingLayoutDescription.SCALE);
        var subGroup;
        if (starlingGroup.customComponentClass) {
            subGroup = this.createCustomObject(starlingGroup.customComponentClass, [game]);
        }
        else {
            subGroup = game.add.group(group);
        }
        this.rememberObject(subGroup, starlingGroup.name);
        subGroup.position.set(starlingGroup.x, starlingGroup.y);
        subGroup.rotation = starlingGroup.rotation;
        return subGroup;
    };
    /**
     * Creates instance of class given by name and with given params
     * @param className
     * @param params
     * @returns {any}
     */
    StarlingLayoutDescription.prototype.createCustomObject = function (className, params) {
        var object = Object.create(window[className].prototype);
        object.constructor.apply(object, params);
        return object;
    };
    StarlingLayoutDescription.SCALE = 1;
    return StarlingLayoutDescription;
}());
/**
 * Simple manager for a Starling layouts
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var StarlingLayoutManager = /** @class */ (function () {
    function StarlingLayoutManager(game) {
        this.game = game;
    }
    Object.defineProperty(StarlingLayoutManager.prototype, "atlasNames", {
        /**
         * Getter for atlas names
         * @returns {string[]}
         */
        get: function () {
            return this._atlasNames;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Gets instance, based on Singleton pattern
     * @param game
     * @returns {StarlingLayoutManager}
     */
    StarlingLayoutManager.getInstance = function (game) {
        if (!this.instance) {
            if (!game) {
                throw new ReferenceError("You must pass phaser game for the first instance bringing");
            }
            this.instance = new StarlingLayoutManager(game);
        }
        return this.instance;
    };
    /**
     * This creates new StarlingLayoutDescription and adds elements to the game world
     * @param layoutData
     * @param container
     * @param plugins
     * @returns {StarlingLayoutDescription}
     */
    StarlingLayoutManager.prototype.fulfillGameLayout = function (layoutData, container, plugins) {
        if (!this._atlasNames) {
            throw new ReferenceError("There is no any atlas names added");
        }
        return new StarlingLayoutDescription(this.game, layoutData, container || this.game.world, plugins);
    };
    /**
     * Adding atlas names to let tool know from where to take frames
     * @param atlasNames
     */
    StarlingLayoutManager.prototype.addAtlases = function (atlasNames) {
        this._atlasNames = atlasNames;
    };
    return StarlingLayoutManager;
}());
/**
 * StarlingObject creator
 * @author      dsremski <d.sremski@gmail.com>
 * @version     09.05.2021
 * @copyright   2021 Damian Śremski
 */
var StarlingObject = /** @class */ (function () {
    function StarlingObject(layoutData) {
        if (layoutData.customParams && layoutData.customParams.customComponentClass) {
            this.customComponentClass = layoutData.customParams.customComponentClass;
        }
        if (layoutData.constructorParams && layoutData.constructorParams[0].textureName) {
            this.textureName = layoutData.constructorParams[0].textureName;
        }
        if (layoutData.params.downState) {
            this.downStateTextureName = layoutData.params.downState.textureName;
        }
        this.alpha = layoutData.params.alpha !== undefined ? layoutData.params.alpha : 1;
        this.color = layoutData.params.color || 16777215;
        this.x = layoutData.params.x || 0;
        this.y = layoutData.params.y || 0;
        this.height = layoutData.params.height || 0;
        this.width = layoutData.params.width || 0;
        this.text = layoutData.params.text || '';
        this.name = layoutData.params.name || '';
        this.pivotX = layoutData.params.pivotX || 0;
        this.pivotY = layoutData.params.pivotY || 0;
        this.rotation = layoutData.params.rotation || 0;
        this.autoSize = layoutData.params.autoSize ? true : false;
        this.scaleX = layoutData.params.scaleX || 1;
        this.scaleY = layoutData.params.scaleY || 1;
        this.parseTextFormat(layoutData.params.format);
    }
    /**
     *
     * @param scaleFactor
     */
    StarlingObject.prototype.setScale = function (scaleFactor) {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        this.pivotX *= scaleFactor;
        this.pivotY *= scaleFactor;
        this.width *= scaleFactor;
        this.height *= scaleFactor;
    };
    StarlingObject.prototype.parseTextFormat = function (format) {
        if (!format) {
            return;
        }
        this.format = format;
        this.format.params.color = format.params.color || 0;
        this.format.params.size = format.params.size || 12;
        this.format.params.leading = format.params.leading || 0;
        this.format.params.horizontalAlign = format.params.horizontalAlign || 'center';
        this.format.params.verticalAlign = format.params.verticalAlign || 'middle';
    };
    return StarlingObject;
}());
//# sourceMappingURL=ts.js.map