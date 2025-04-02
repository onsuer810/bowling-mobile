"use strict"
/*if (b4w.module_check("my_project"))
    throw "Failed to register module: my_project_main";*/
// register the application module
import b4w from "blend4web";

var m_app = b4w.app;
var m_cfg = b4w.config;
var m_data = b4w.data;
var m_preloader = b4w.preloader;
var m_ver = b4w.version;
var m_anim = b4w.animation;
var m_cont = b4w.container;
var m_ctl = b4w.controls;
var m_mouse = b4w.mouse;
var m_math = b4w.math;
var m_obj = b4w.objects;
var m_phy = b4w.physics;
var m_scenes = b4w.scenes;
var m_trans = b4w.transform;


var m_main = b4w.main;
var m_quat = b4w.quat;

var m_const = b4w.constraints;
// ЗВУК
//var m_speaker = require("speaker");
//var _strikeSound;
var m_sfx = b4w.sfx;
var m_time = b4w.time;
var m_hmd = b4w.hmd;
var m_cam = b4w.camera;

//b4w.register("my_project_main", function (exports, require) {


var parent_pos = new Float32Array();
var DEBUG = (m_ver.type() == "DEBUG");


var _drag_mode = false;
var _enable_camera_controls = true;

var _first_Click = false;
var _selected_obj = null;
var _moving_obj = null;
var _previev_obj = null;
var _enable_click = false;
var _d_id = 0;

var FLOOR_PLANE_NORMAL = [0, 0, 1];

//var ROT_ANGLE = Math.PI / 4;

var WALL_X_MAX = 1.0;
var WALL_X_MIN = -1.0;//-3.8;
var WALL_Z_MAX = 4.2;
var WALL_Z_MIN = -1.065;//-3.5;    

var _obj_delta_xy = new Float32Array(2);
//var spawner_pos = new Float32Array(3);
var _vec3_tmp = new Float32Array(3);
var _vec3_tmp2 = new Float32Array(3);
var _vec3_tmp3 = new Float32Array(3);
var _vec4_tmp = new Float32Array(4);
var _pline_tmp = m_math.create_pline();

// automatically detect assets path
var APP_ASSETS_PATH = m_cfg.get_assets_path("my_project");


//var _TxBow_X;
// Создаём объект Audio
var audio = new Audio(APP_ASSETS_PATH + "Foul.mp3");
var audioRunBall = new Audio(APP_ASSETS_PATH + "BallRun01.mp3");
var audioKegli = new Audio(APP_ASSETS_PATH + "Kegli.mp3");
var audioFinal = new Audio(APP_ASSETS_PATH + "Final01.mp3");
var audioStrike = new Audio(APP_ASSETS_PATH + "Strike01.mp3");
var audioMusic01 = new Audio(APP_ASSETS_PATH + "Fish.mp3");
var audioMusic02 = new Audio(APP_ASSETS_PATH + "Music02.mp3");
var audioMusic03 = new Audio(APP_ASSETS_PATH + "Music01.mp3");
var audioMusicCUP = new Audio(APP_ASSETS_PATH + "PartFinalCUP.mp3");
var _last_posX_R = 0.0;
var _last_posX_L = 0.0;//1100.0;


var move = false;
var move_2 = false;
var m_Pins_arr1 = [];
var m_Pins_arr2 = [];
var m_Pins_arr3 = [];
var m_Pins_arr4 = [];
var m_Pins_arr5 = [];
var m_Pins_arr6 = [];
var m_Pins_arr7 = [];
var m_Pins_arr8 = [];
var m_Pins_arr9 = [];
var m_Pins_arr10 = [];
var m_pins_onPlos = [];
var numDownPins = [];
var not_select = false;
var prev_positions = {}; // Сохраняет предыдущие позиции объектов
var prev_rotations = {}; // Сохраняет предыдущие ориентации объектов
var all_bowl = ["Bowling Ball", "Bowling Ball02Green", "Bowling Ball03Blue", "Bowling Ball07", "Bowling Ball09"];
var all_znak = ["X", "Tire", "Slash", "F"];
var pos_all_hide_bowl = [5.62, -12.82, -0.63];
var shar_num5 = 0;
var all_shar = [false, false, false, false, false];

var Schet_0 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var Game = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
var _Place = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
var Total = 0;
var LastShot = false;
var BestResult = 50;
var TxName = 0;
var TxFrame = 0;

var tTol = 0;

var Prop_PlaceInFrame = [[11, 12], [21, 22], [31, 32], [41, 42], [51, 52], [61, 62], [71, 72], [81, 82], [91, 92], [101, 102], [111, 0]];
var NumBroska_Player = 0;
var Player_PlaceInFrame = 0;
var Player_NumFrame = 0;
var CountFirst = 0;
var CountSecond10 = 0;
var own_dobavka = 0;
var ResetPins = false;
var FrameTrue = 1;
var TextVisualClasic = true;
var own_countPinPad = null;
var _Break = false;
var EndGame = true;
var GameBegin = false;
var full_screen = false;
var _zvuk = true;
var zvk = 0;

var STRIKE = 0;// Очки за STRIKE 
var SPARE = 0;// Очки за SPARE 

var RATE = 1.76;
var PointTotal = 0;// Очки за весь очередной раунд

var Money = 280.00;// Деньги игрока
var store = [true, false, true, true, true, false];
var _Collection = [true, false, true, true, true, false];
var LAPS = 5;// Кол-во регулярных раундов
var extra_Laps = 3;// Кол-во экстра раундов
var _kol_Clctn = 4;// Кол-во шаров в коллекции
//Стоимость шаров
var _Coll_stoim = [80.0, 99.0, 149.0, 169.0, 189.0, 45.0];

var name_balls = ["Default ball. ", "Fast ball. ", "Accurate ball. ", "The twisted ball. ", "Crazy ball. ", "Extra round. "];

//Возможность запустить новый раунд(кн.'New round'),если есть хоть один регулярный раунд
var availableGame = true;

//var showLeft = true;
//var showRight = true;
var showMenu = false;//для показа-скрытия Правил игры

var buy_avelable = false;//перемена цвета background кнопки Buy
var _sellPereklAvailable = false; //перемена цвета background кнопки Sell 
var _sellAvailable = false; // возможность/Невозможность продажи шара

var CUP_Total = 0; // Кол-во очков для покупки Кубка

// _CUP = true происходит во время покупки 5го шара,все деньги пересч-ся в очки
var _CUP = false;
// если _CUP = true,то после нажатия на кн. Cvt, _cnvrtAvailable = true, и можно конв.шары в очки
var _cnvrtAvailable = false;
//_Final=true наступает после нажатия на кн. Cvt,для того чтобы нажатия на разные кнопки(кроме шаров) перестали реагировать
var _Final = false;

var texts = ["Now you can make purchases in the store.", "Now you can buy Extra-round only.",
    "Not bad, but it could be better.", "Now you can buy last Ball. Attention! After that, you will not be able to buy an extra round.",
    "Now you have one last round.","One Last Extra-round",
    "To win the Cup, you must convert the money into points. Press the Cvt Button, then on the Ball(s).",
    "You've LOST. There are not enough points to take the Cup.", "You can sell any of your balls to buy an extra round.", 
    "You can finish the remaining rounds, or Start the process of getting the Winner's Cup. To do this, press the Cvt button, then on the ball(s). Attention!!After pressing the Cvt button, you will not be able to play the remaining rounds.",
    "Congratulations! You've won the first level!",
    "You've LOST. There is not enough money to continue the game.",
    "You need " + String(1500) + " points. You have " + Number(CUP_Total) + " points.",
    "Now you can buy last Ball."];
    //`You need ` + String(1500) + ` points. You have ` + Number(CUP_Total) + ` points.`];

var showButtLastTx = false; // если true - то видно окно внизу "ShowLastMess"
var _LastText = ""; // это содержание последнего из показанных сообщений
var Time_Wait = false; // это относится к появлению окна "Wait"

/////////////////////////////////////////////

function init() {
    m_app.init({
        canvas_container_id: "main_canvas_container", 
        callback: init_cb,
        //show_fps: DEBUG,
        //console_verbose: DEBUG,
        physics_enabled: true,
        physics_use_wasm: true,
        physics_use_workers: true,
        autoresize: true
    });
}

    /**
     * callback executed when the app is initialized 
     */
function init_cb(canvas_elem, success) {
    //console.log("function init_cb");
    if (!success) {
        //console.log("b4w init failure");
        return;
    }

    m_preloader.create_preloader();

    // ignore right-click on the canvas element
    canvas_elem.oncontextmenu = function (e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    load();
}

    /**
     * load the scene data
     */
function load() {
    //m_data.load(APP_ASSETS_PATH + "my_project.json", load_cb, preloader_cb);
    var preloader_cont = document.getElementById("preloader_cont");
    preloader_cont.style.visibility = "visible";
    if (window.web_page_integration_dry_run)
        m_data.load(APP_ASSETS_PATH + "my_project.json", load_cb, preloader_cb);
    //console.log("function load");
}

    /**
     * update the app's preloader
     */
function preloader_cb(percentage) {
    var prelod_dynamic_path = document.getElementById("prelod_dynamic_path");
    var percantage_num = prelod_dynamic_path.nextElementSibling;

    prelod_dynamic_path.style.width = percentage + "%";
    percantage_num.innerHTML = percentage + "%";
    
    if (percentage == 100) {
        var preloader_cont = document.getElementById("preloader_cont");
        preloader_cont.style.visibility = "hidden";
        m_preloader.update_preloader(percentage);
        return;
    }
}


function init_controls() {

    //Покажем нижний контейнер с эмблемами"Bowling" при первом спуске программы
    var controls_elem = document.getElementById("controls-container");
    controls_elem.style.display = "block";

    //init_buttons();


    //Покажем BestResult при первом спуске программы
    var el = document.getElementById("result");
    if (el) {
        el.textContent = "" + BestResult;
    }
    //Покажем RATE при первом спуске программы
    var elr = document.getElementById("bowlvalue");
    if (elr) {
        elr.textContent = "" + RATE;
    }
    //LAPS = 3;
    var ellL = document.getElementById("laps2");
    if (ellL) {
        ellL.textContent = LAPS +" rounds + "+extra_Laps+" extra";
    }
    
    /*//Покажем exit при первом спуске программы
    var ellexit = document.getElementById("exit");
    if (ellexit)
        //ellexit.style.display = 'block';
        ellexit.style.display = show ? "flex" : "none";*/

    //Открытие всех Menu(left,centr,right)при первом спуске программы
    init_Menu();

    //Покажем "top"-панель при первом спуске программы
    //document.getElementById("top").classList.remove("hidden");
    var top = document.getElementById("top");
    if(top)
        top.style.display = show ? "flex" : "none";

    //Покажем правую панель("right") и кнопку Hide("toggle-store") при первом спуске программы
    var elright = document.getElementById("right");
    if (elright)
        elright.style.display = show ? "flex" : "none";
    var eltog = document.getElementById("toggle-store");
    if (eltog)
        eltog.style.display = show ? "flex" : "none";      

    //Покажем левую панель("left") и кнопку Hide("toggle-storeLeft") при первом спуске программы
    var elleft = document.getElementById("left");
    if (elleft)
        elleft.style.display = show ? "flex" : "none";
    var eltogL = document.getElementById("toggle-storeLeft");
    if (eltogL)
        eltogL.style.display = show ? "flex" : "none";
    //Открытие всех Menu(left,centr,right)при нажатии на кнопку Menu наверху
    document.getElementById("menu").addEventListener("click", function () {
        if (!showMenu) 
            init_Menu();    
    });

    //Закрытие centrMenu при нажатии на кнопку X
    document.getElementById("XMenu").addEventListener("click", function () {
        if (showMenu) {
            var el = document.getElementById("centr");
            el.style.display = 'none';
            showMenu = false;
            //var elemMenu = document.getElementById("menu");
            //elemMenu.style.color = "cyan";
        }
    });


    // Покажем 1й("Bowling Ball") шар
    _showImage();

    // Нажатие на кнопку NewGame
    document.getElementById("load-1").addEventListener("click", function () {
        if (EndGame && !GameBegin && !not_select && !_Final && availableGame) {  // Меняем изображение на новое
            //this.style.backgroundImage = "url('./assets/Balls/SelectBall.png')";

            this.textContent = "Select Ball";
            this.style.backgroundColor = "green";
            GameBegin = true;
            EndGame = false;
            _Game_begin();
            //_showImage();

        }
    });

    // Выбирание Шаров(Default Ball)
    document.getElementById("load-2").addEventListener("click", function (e) {
        //console.log("str 335 EndGame = " + EndGame + "  GameBegin = " + GameBegin);
        //console.log("str 336 not_select = " + not_select + "  _enable_click = " + _enable_click + "  store[0] = " + store[0]);
        if (!EndGame && GameBegin && !not_select && !_enable_click && store[0]) {
            if (!_sellAvailable) {
                selectBall("Bowling Ball", "Bowling BallAction");
                _enable_click = true;
                if (shar_num5 != 0) {
                    shar_5_0();
                    var el = document.getElementById("contr-container");
                    el.style.display = 'none';
                }
            }
        }
        else {
            if (!_CUP) {
                if (EndGame && !GameBegin && store[0]) {
                    if (_sellAvailable && _sellPereklAvailable) {
                        //console.log("str 349 Nazali na shar");
                        var elem = document.getElementById("sell");
                        _changeColorSell(elem, 0);
                        _Ball_Sell(0, 80);
                        _sellAvailable = false;
                    }
                }
            }
            else {
                if (EndGame && !GameBegin && store[0]) {
                    if (_cnvrtAvailable) {
                        _Ball_Convert(0, 80);

                    }
                }
            }

        }
        
    });
   // Fast Ball
    document.getElementById("load-3").addEventListener("click", function (e) {
        if (!EndGame && GameBegin && !not_select && !_enable_click && store[1]) {
            selectBall("Bowling Ball02Green", "Bowling BallAction");
            _enable_click = true;
            if (shar_num5 != 0) {
                shar_5_0();
                var el = document.getElementById("contr-container");
                el.style.display = 'none';
            }
        }
        else {
            if (!_CUP) {
                if (EndGame && !GameBegin && store[1]) {
                    if (_sellAvailable && _sellPereklAvailable) {
                        //console.log("str 349 Nazali na shar");
                        var elem = document.getElementById("sell");
                        _changeColorSell(elem, 0);
                        _Ball_Sell(1, 99);
                        _sellAvailable = false;
                    }
                }
            }
            else {
                if (EndGame && !GameBegin && store[1]) {
                    if (_cnvrtAvailable) {
                        _Ball_Convert(1, 99);
                    }
                }
            }
        }
    });
    // Accurate Ball
    document.getElementById("load-4").addEventListener("click", function (e) {
        if (!EndGame && GameBegin && !not_select && !_enable_click && store[2]) {
            selectBall("Bowling Ball03Blue", "Bowling BallAction");
            _enable_click = true;
            if (shar_num5 != 0) {
                shar_5_0();
                var el = document.getElementById("contr-container");
                el.style.display = 'none';
            }               
        }
        else {
            if (!_CUP) {
                if (EndGame && !GameBegin && store[2]) {
                    if (_sellAvailable && _sellPereklAvailable) {
                        //console.log("str 349 Nazali na shar");
                        var elem = document.getElementById("sell");
                        _changeColorSell(elem, 0);
                        _Ball_Sell(2, 149);
                        _sellAvailable = false;
                    }
                }
            }
            else {
                if (EndGame && !GameBegin && store[2]) {
                    if (_cnvrtAvailable) {
                        _Ball_Convert(2, 149);
                    }
                }
            }
        }
    });
    // The twisted Ball
    document.getElementById("load-5").addEventListener("click", function (e) {
        if (!EndGame && GameBegin && !not_select && !_enable_click && store[3]) {
            selectBall("Bowling Ball07", "Bowling BallAction");
            _enable_click = true;
            var el = document.getElementById("contr-container");            
            el.style.display = 'block';//el.style.display === 'none' ? 'block' : 'none';
        }
        else {
            if (!_CUP) {
                if (EndGame && !GameBegin && store[3]) {
                    if (_sellAvailable && _sellPereklAvailable) {
                        //console.log("str 349 Nazali na shar");
                        var elem = document.getElementById("sell");
                        _changeColorSell(elem, 0);
                        _Ball_Sell(3, 169);
                        _sellAvailable = false;
                    }
                }
            }
            else {
                if (EndGame && !GameBegin && store[3]) {
                    if (_cnvrtAvailable) {
                        _Ball_Convert(3, 169);
                    }
                }
            }
        }
    });
    // Crazy Ball
    document.getElementById("load-6").addEventListener("click", function (e) {
        if (!EndGame && GameBegin && !not_select && !_enable_click && store[4]) {
            selectBall("Bowling Ball09", "Bowling BallAction");
            _enable_click = true;
            if (shar_num5 != 0) {
                shar_5_0();
                var el = document.getElementById("contr-container");
                el.style.display = 'none';
            }
        }
        else {
            if (!_CUP) {
                if (EndGame && !GameBegin && store[4]) {
                    if (_sellAvailable && _sellPereklAvailable) {
                        //console.log("str 349 Nazali na shar");
                        var elem = document.getElementById("sell");
                        _changeColorSell(elem, 0);
                        _Ball_Sell(4, 189);
                        _sellAvailable = false;
                    }
                }
            }
            else {
                if (EndGame && !GameBegin && store[4]) {
                    if (_cnvrtAvailable) {
                        _Ball_Convert(4, 189);
                    }
                }
            }
        }
    });

    //Fullsrceen
    document.getElementById("load-7").addEventListener("click", function (e) {
        var m_screen = b4w.screen;// require("screen");
        if (!full_screen)
            _enable_fullsrc(m_screen, document.body);
        else
            _desable_fullsrc(m_screen);
    });

    //New Game
    document.getElementById("load-8").addEventListener("click", function (e) {
        var elem = document.getElementById("show-wind");
        if (elem) {
            //console.log("elem.style.display=" + elem.style.display);
            if (elem.style.display != 'none') {
                elem.style.display = 'none';
                if (!showButtLastTx && _LastText != "") {
                    var elL = document.getElementById("lastMess");
                    if (elL) {
                        elL.style.display = 'block';
                        showButtLastTx = true;
                    }
                }
            }
        }
        /*var exitGame = document.getElementById("exit-wind");
        if (exitGame) // Показать окно New Game
            exitGame.style.display = "none";*/
        var nextGame = document.getElementById("nextgame-wind");
        if (nextGame) // Показать окно New Game
            nextGame.style.display = show ? "flex" : "none";
    });

    //Exit Game
    /*document.getElementById("load-9").addEventListener("click", function (e) {
        var elem = document.getElementById("show-wind");
        if (elem) {
            console.log("elem.style.display=" + elem.style.display);
            if (elem.style.display != 'none') {
                elem.style.display = 'none';
                if (!showButtLastTx && _LastText != "") {
                    var elL = document.getElementById("lastMess");
                    if (elL) {
                        elL.style.display = 'block';
                        showButtLastTx = true;
                    }
                }
            }
        }
        var nextGame = document.getElementById("nextgame-wind");
        if (nextGame) // Показать окно New Game
            nextGame.style.display = "none";
        var exitGame = document.getElementById("exit-wind");
        if (exitGame) // Показать окно New Game
            exitGame.style.display = show ? "flex" : "none";
    });*/

    // НОВЫЕ(ВНИЗУ) кнопки(серая полоска) для подкрутки розового шара
    document.getElementById("loa-1").addEventListener("click", function () {
        if (shar_num5 != 0) {
            var elem1 = document.getElementById("loa-1");
            shar_5_change(elem1, 0);
        }
    });
    document.getElementById("loa-2").addEventListener("click", function () {
        if (shar_num5 != 0) {
            var elem2 = document.getElementById("loa-2");
            shar_5_change(elem2, 1);
        }
    });
    document.getElementById("loa-3").addEventListener("click", function () {
        if (shar_num5 != 0) {
            var elem3 = document.getElementById("loa-3");
            shar_5_change(elem3, 2);
        }
    });
    document.getElementById("loa-4").addEventListener("click", function () {
        if (shar_num5 != 0) {
            var elem4 = document.getElementById("loa-4");
            shar_5_change(elem4, 3);
        }
    });
    document.getElementById("loa-5").addEventListener("click", function () {
        if (shar_num5 != 0) {
            var elem5 = document.getElementById("loa-5");
            shar_5_change(elem5, 4);
        }
    });

    // Сумма(Money) над кнопкой Buy в левом Меню
    var elmon = document.getElementById("totmoney");
    if (elmon) {
        var mon = (parseFloat(Money).toFixed(2));
        elmon.textContent = mon;
    }
       
    // Нажатие на кнопку Buy в левом Меню
    document.getElementById("buy").addEventListener("click", function (e) {
        if (!GameBegin && !_Final && Money > 0) {// && !not_select && !_enable_click) {
            var elem = document.getElementById("buy");
            if (!buy_avelable)
                _changeColorBuy(elem, 1);
            else
                _changeColorBuy(elem, 0);

        }
    });

    // Нажатие на кнопку Sell в левом Меню
    document.getElementById("sell").addEventListener("click", function (e) {
        if (_sellAvailable) {
            var elem = document.getElementById("sell");
            if (!_sellPereklAvailable)
                _changeColorSell(elem, 1);
            else
                _changeColorSell(elem, 0);
            //console.log("str 473 Nazali na Sell ");
        }
    });

    // Нажатие на кнопку Cnvrt в левом Меню
    document.getElementById("trans").addEventListener("click", function (e) {
        if (_CUP) {
            var elem = document.getElementById("trans");
            if (!_cnvrtAvailable) {
                _changeColorCnvrt(elem, 1);
                
                var elbuy = document.getElementById("buy");
                _changeColorBuy(elbuy, 0);
                var elsell = document.getElementById("sell");
                _changeColorSell(elsell, 0);

                process_buy_CUP();

                //_Final = true;
            }

        }
        //_CONVERT(99.0);
    });

    // Окно извещений:нажатие-закрытие окна
    document.getElementById("myDialog").addEventListener("click", function () {
        var elem = document.getElementById("show-wind");
        if (elem)
            elem.style.display = 'none'; 
        if (!showButtLastTx) {
            var elL = document.getElementById("lastMess");
            if (elL) {
                elL.style.display = 'block';
                showButtLastTx = true;
            }
        }
    });

    // нажатие на кн."ShowLastMess"
    document.getElementById("lastMess").addEventListener("click", function () {
        if (showButtLastTx && _LastText!="") {
            // Окно извещений
            var elSh = document.getElementById("show-wind");
            if (elSh) {
                elSh.style.display = 'block';
                var elD = document.getElementById("myDialog");
                if (elD) {
                    elD.textContent = _LastText;
                }
            }
            var elL = document.getElementById("lastMess");
            if (elL) {
                elL.style.display = 'none';
                showButtLastTx = false;
            }
        }
    });

/*    if (!showButtLastTx) {
        var elL = document.getElementById("lastMess");
        if (elL) {
            elL.style.display = 'block';
    }
    _LastText = txt;*/
    // Извещения выплывающие над правым меню,при нажатии на самые правые кнопки( 80$ buy etc)
    document.getElementById("bowl_01").addEventListener("click", function () {
        if (!_Final) {
            var tooltip = document.getElementById("tooltip_bowl_01");
            _control_tooltip(tooltip, 0, 80);
        }
    });
    document.getElementById("bowl_02").addEventListener("click", function () {
        if (!_Final) {
            var tooltip = document.getElementById("tooltip_bowl_02");
            _control_tooltip(tooltip, 1, 90);
        }
    });
    document.getElementById("bowl_03").addEventListener("click", function () {
        if (!_Final) {
            var tooltip = document.getElementById("tooltip_bowl_03");
            _control_tooltip(tooltip, 2, 145);
        }
    });
    document.getElementById("bowl_04").addEventListener("click", function () {
        if (!_Final) {
            var tooltip = document.getElementById("tooltip_bowl_04");
            _control_tooltip(tooltip, 3, 170);
        }
    });
    document.getElementById("bowl_05").addEventListener("click", function () {
        if (!_Final) {
            var tooltip = document.getElementById("tooltip_bowl_05");
            _control_tooltip(tooltip, 4, 170);
        }
    });
    document.getElementById("newLap").addEventListener("click", function () {
        if (!_Final) {
            var tooltip = document.getElementById("tooltip_newLap");
            _control_tooltip(tooltip, 5, 45);
        }
    });
    document.getElementById("cup_cup").addEventListener("click", function () {
        //if (!_Final) {
            var tooltip = document.getElementById("tooltip_newLap");
            _control_tooltip_CUP(tooltip, 6, 1500);
        //}
    });
    //_movingFireBall();
}

function init_Menu() {
    if (!showMenu) {
        var elC = document.getElementById("centr");
        if (elC) {
            elC.style.display = 'block';

        }
    

        /*if (showLeft) {
            var el = document.getElementById("show-hideLeft");
            el.style.display = 'none';
            var el2 = document.getElementById("left");
            el2.style.display = 'block';
            showLeft = false;
        }
        if (showRight) {
            var el = document.getElementById("show-hideRight");
            el.style.display = 'none';
            var el2 = document.getElementById("right");
            el2.style.display = 'block';
            showRight = false;
        }*/
        var elemMenu = document.getElementById("menu");
        elemMenu.style.color = "gray";
        showMenu = true;
    }
}
function _Ball_Convert(st, summa) { // Конверт. шара в очки
    //console.log("Nacalo function _Ball_Convert(st, summa)");
    store[st] = false;
    var nm = st + 2;
    var elem2 = document.getElementById("load-" + nm);
    // Переключаем класс show-before
    elem2.classList.toggle("show-before");
    _Collection[st] = false;
    _kol_Clctn -= 1;
    //_CONVERT(summa);
    _CONVERT_BALL(summa);
    if (_kol_Clctn == 0) {
        if (CUP_Total < 1500) {
            _windTx_CUP(texts[7],1); //  конец игрыы
            //console.log("function _Ball_Convert(st, summa)");
        }
    }
}

function _Ball_Sell(st, summa) { // Продажа шара из коллекции
    store[st] = false;
    var nm = st + 2;
    var elem2 = document.getElementById("load-" + nm);
    // Переключаем класс show-before
    elem2.classList.toggle("show-before");
    _Collection[st] = false;
    _kol_Clctn -= 1;
    _MONEY(summa);
    if (extra_Laps > 0)
        _windTx(texts[1]); // Можно купить только экстра-круг
}


function _Take_CUP(st) { // Кубок взят
    store[st] = true;
    //var nm = st + 2;
    var elem2 = document.getElementById("cup");

    // Покажем Кубок в коллекции
    elem2.classList.toggle("show-before");
    _Collection[st] = true;
    _kol_Clctn += 1;

    // Уберем окно с текстом
    var elSh = document.getElementById("show-wind");
    elSh.style.display = 'none';



    var girl = document.getElementById("girl");
    var nextLevel = document.getElementById("nextLevel");

    if (girl) // Показать девушку
        girl.style.display = show ? "flex" : "none";
    //girl.style.display = 'block';  // Показать девушку

    var openEyes = 'url("./assets/Balls/Girl_00.png")';
    var closedEyes = 'url("./assets/Balls/Girl_01Z.png")';

    function blink(callback) {
        girl.style.backgroundImage = closedEyes;
        setTimeout(function () {
            girl.style.backgroundImage = openEyes;
            if (callback) callback();
        }, 100);
    }

    function startBlinkingSequence() {
        var count = 0;

        function sequence() {
            if (count >= 3) {
                // Весь ритм закончен → показать следующее окно
                setTimeout(function () {
                    girl.style.display = 'none';  // Убрать девушку
                    nextLevel.style.display = show ? "flex" : "none";
                    //nextLevel.style.display = 'flex';  // Показать финальное окно
                    //console.log("function _Take_CUP(st)");
                }, 1000);  // Пауза перед финалом
                return;
            }

            blink(function () {
                setTimeout(function () {
                    blink(function () {
                        setTimeout(function () {
                            blink(function () {
                                setTimeout(function () {
                                    blink(function () {
                                        count++;
                                        setTimeout(sequence, 800);
                                    });
                                }, 700);
                            });
                        }, 700);
                    });
                }, 700);
            });
        }

        sequence();
    }

    // Стартуем музыку и моргание
    playMusicCUP();
    startBlinkingSequence();
}




function playMusicCUP() {

    audioMusicCUP.loop = false;
    audioMusicCUP.play().catch(function (error) {
        console.error("Ошибка воспроизведения аудио:", error);
    });
}

/*function stop_End_MusicCUP() {
    audioMusicCUP.pause(); // Останавливаем звук
    audioMusicCUP.currentTime = 0; // Сбрасываем время воспроизведения на начало
}*/
function _control_tooltip_CUP(tool_tip, st, summa) {
    if (!GameBegin) {
        if (CUP_Total > 0) {
            if (!store[st]) {
                if (CUP_Total < summa) {
                    _buy_not_buy(tool_tip, "You don't have enough points!");
                }
                else {
                    _buy_not_buy(tool_tip, "The Winner's Cup Is Yours!");
                    _pereschet_CUP(st, summa);
                    _Take_CUP(st);
                }
            }
            else 
                _buy_not_buy(tool_tip, "The CUP is already in your collection.");           
        }
        else
            _buy_not_buy(tool_tip, "You don't have any points!");
    }
    else
        _buy_not_buy(tool_tip, "The Store is closed during the game.");
}
function _control_tooltip(tool_tip, st, summa) {
    if (!GameBegin) {
        if (Money > 0.0) {
            if (!store[st]) {
                if (buy_avelable == true) {
                    if (Money < summa) {
                        _buy_not_buy(tool_tip, "You don't have enough money!");
                    }
                    else {
                        if (st < 5) {
                            _buy_not_buy(tool_tip, "Smart buy!");
                            _pereschet(st, summa);
                        }
                        if (st == 5) {
                            if (extra_Laps > 0) {
                                _buy_not_buy(tool_tip, "Smart buy!");
                                _pereschet_extra_Laps(st, summa);
                            }
                            else
                                _buy_not_buy(tool_tip, "The extra rounds are over!");
                        }

                    }
                }
                else
                    _buy_not_buy(tool_tip, "Click the Left 'Buy' button.");
            }
            else {
                if (st < 5) 
                    _buy_not_buy(tool_tip, "This ball is already in your collection.");
                if (st == 5)
                    _buy_not_buy(tool_tip, "All the extra rounds have been used.");
            }
                
        }
        else
            _buy_not_buy(tool_tip, "You don't have any money!");
    }
    else
        _buy_not_buy(tool_tip, "The Store is closed during the game.");
}
//////////////////////////////////////////////////////////////////////
//_buy_not_buy("You don't have enough money"); The payment has been completed  Smart buy!
function _pereschet(st, summa) {
    store[st] = true;   
    var ms = Money - summa;
    Money = (parseFloat(ms).toFixed(2));
    //console.log("Money=" + Money);
    var el = document.getElementById("totmoney");
    el.textContent = Money;
    _showOneImage(st);
    if (_kol_Clctn < 5) {
        if (Money >= 45.0) {
            //situation_Now();
            if (_kol_Clctn < 4) {
                var tx = "You have purchased " + name_balls[st];
                //console.log("function _pereschet  _kol_Clctn= " + _kol_Clctn);
                situation_2(tx);
            }
        }
        else {
            if (st < 6) {
                var tx = "You have purchased " + name_balls[st];
                if (tx != "")
                    _windTx(tx);
            }
        }
    }
    //_showOneImage(st);
}
function _pereschet_extra_Laps(st, summa) {
    if (extra_Laps > 0) {
        var ms = Money - summa;
        Money = (parseFloat(ms).toFixed(2));
        //console.log("Money=" + Money);
        var el = document.getElementById("totmoney");
        el.textContent = Money;
        LAPS += 1;
        if (LAPS > 0)
            availableGame = true;
        extra_Laps -= 1;
        var ellL = document.getElementById("laps2");
        if (ellL) {
            ellL.textContent = LAPS + " rounds + " + extra_Laps + " extra";
        }
        _sellAvailable = false;
        var elem = document.getElementById("sell");
        _changeColorSell(elem, 0);
        if (extra_Laps == 0)
            store[st] = true;
        if (st < 6) {
            if (Money >= 45.0) {
                //situation_Now();
                var tx = "You have purchased " + name_balls[st];
                situation_2(tx);
            }

            else {
                //if (st < 6) {
                    var tx = "You have purchased " + name_balls[st];
                    if (tx != "")
                        _windTx(tx);
                //}
            }

        }
    }
}

function _pereschet_CUP(st, Mon) {
    //store[st] = true;
    //console.log("function _pereschet_CUP(Mon=) " + Mon);
    //var topo = (parseFloat(Mon * RATE).toFixed(0)); // Перевод денег Игрока в очки
    var mmm = Number(CUP_Total) - Number(Mon);
    //var mmm = (parseFloat(CUP_Total + Number(Mon)).toFixed(0)); //
    CUP_Total = mmm; // Общее кол.очков(самая нижняя строчка)
    //console.log("CUP_Total = " + CUP_Total);
    var elL = document.getElementById("lastpoint");// Текст с Общим кол.очков
    if (elL)
        elL.textContent = CUP_Total;// Выводим текст с Общим кол.очков
    //console.log("function _pereschet_CUP CUP_Total =" + CUP_Total);
    
    //_windTx(txt);
}
function _buy_not_buy(tooltip, tex) {
    tooltip.textContent = tex;

    // Показываем подсказку
    tooltip.classList.add("show");

    // Скрываем подсказку через 2 секунды
    setTimeout(function () {
        tooltip.classList.remove("show");
    }, 2000);

}
///////////////////////////////////////////////////
function _showOneImage(n) { // При покупке шара
    //console.log("function _showOneImage(n) load-" + n);
    if (store[n]) {
        var nm = n + 2;
        var elem2 = document.getElementById("load-" + nm);
        // Переключаем класс show-before
        elem2.classList.toggle("show-before");
        _Collection[n] = true;
        _kol_Clctn += 1;
        //console.log("n= " + n + "  _Collection= " + _Collection + " _kol_Clctn= " + _kol_Clctn);
        if (_kol_Clctn == 5) {// Если это последний(5й) шар
            if (LAPS > 0) {   // Если покупка происходит, когда еще есть недоигранные раунды 

                _CUP = true;
                _CONVERT(Money); // перевести деньги в очки
                var tx = "You have purchased " + name_balls[n];// Название последнего шара
                var txt = tx + texts[9]; //Можно доиграть оставшиеся раунды
                //console.log("txt=" + txt);
                _windTx(txt);

                var ellL = document.getElementById("laps2"); // Текст наверху
                if (ellL)
                    ellL.textContent = LAPS + " rounds"; // После покупки посл.шара, экстра-раунд купить нельзя
            //extra_Laps = 0;
            }
            if (LAPS <= 0) {  // Если покупка происходит, когда НЕТ недоигранных раундов
                var txt = texts[4];//"Now you have one last round.";
                _windTx(txt);
                var ellL = document.getElementById("laps2"); // Текст наверху
                if (ellL)
                    ellL.textContent = "ONE LAST ROUND!";
                availableGame = true;
                _CUP = true;
                _CONVERT(Money); // перевести деньги в очки
            }                    
        }
        
        if (_kol_Clctn < 5 && _kol_Clctn > 1) {// Если это НЕпоследний(5й) купленный шар,но всего шаров больше 1
            if (LAPS == 0 && extra_Laps > 0) { // Если это последний раунд,но есть экстра-раунды
                if (Money < 45.0) {  // Если денег меньше стоимости экстра-раунда 
                    var tx = "You have purchased " + name_balls[n];// Название последнего шара
                    var txt = tx + texts[8]; //Можно продать свой шар,чтобы купить экстра-раунд
                    _windTx(txt);
                    _sellAvailable = true;
                    //console.log("str 692");
                }
                else {  // Если есть денеги на экстра-раунд
                    var txt = "You Need to buy an Extra-round";
                    //var txt = texts[1]; //Нужно купить экстра-круг
                    _windTx(txt);
                }

            }


        }

    }
}
function _CONVERT_BALL(Mon) { //rateval#bowlvalue
    //console.log("function _CONVERT(Mon)");
    var el = document.getElementById("totmoney");// Текст с кол.денег Игрока 
    if (el) {
        el.textContent = "0.00";    // Текст кол.денег Игрока = 0    
        var mmm = (parseFloat(Mon * RATE).toFixed(0)); // Перевод денег Игрока в очки
        //console.log("function _CONVERT(Mon) mmm = " + mmm);
        Money = 0.0; // Денег 0
        var mmm2 = (parseFloat(Number(CUP_Total) + Number(mmm)).toFixed(0));
        CUP_Total = mmm2; // Общее кол.очков(самая нижняя строчка)
        //console.log("mmm2 = " + mmm2);
        var elL = document.getElementById("lastpoint");// Текст с Общим кол.очков
        if (elL)
            elL.textContent = CUP_Total;// Выводим текст с Общим кол.очков
        //console.log("function _CONVERT(Mon) CUP_Total =" + CUP_Total);
        situation_total(5);
        //situation_Now();
        //var txt = "You need " + String(1500) + " points. You have " + Number(CUP_Total) + " points.";
        //_windTx(txt);
    }
}
 function _CONVERT(Mon) { //rateval#bowlvalue
     //console.log("function _CONVERT(Mon)");
    var el = document.getElementById("totmoney");// Текст с кол.денег Игрока 
    if (el) {
        el.textContent = "0.00";    // Текст кол.денег Игрока = 0    
        var mmm = (parseFloat(Mon * RATE).toFixed(0)); // Перевод денег Игрока в очки
        //console.log("function _CONVERT(Mon) mmm = "+mmm);
        Money = 0.0; // Денег 0
        var mmm2 = (parseFloat(Number(CUP_Total) + Number(mmm)).toFixed(0));
        CUP_Total = mmm2; // Общее кол.очков(самая нижняя строчка)
        //console.log("mmm2 = " + mmm2);
        var elL = document.getElementById("lastpoint");// Текст с Общим кол.очков
        if (elL)
            elL.textContent = CUP_Total;// Выводим текст с Общим кол.очков
        //console.log("function _CONVERT(Mon) CUP_Total =" + CUP_Total);
        //situation_total(5);
        
        //console.log("function _CONVERT poslali situation_Now()");
        //situation_Now();

        //var txt = "You need " + String(1500) + " points. You have " + Number(CUP_Total) + " points.";
        //_windTx(txt);
    }
}

function _CONVERT_Point(Mon) { 
    //console.log("function _CONVERT_Point(Mon)");
    //var topo = (parseFloat(Mon * RATE).toFixed(0)); // Перевод денег Игрока в очки
    var mmm = Number(CUP_Total) + Number(Mon);
    //var mmm = (parseFloat(CUP_Total + Number(Mon)).toFixed(0)); //
    CUP_Total = mmm; // Общее кол.очков(самая нижняя строчка)
    //console.log("CUP_Total = " + CUP_Total);
    var elL = document.getElementById("lastpoint");// Текст с Общим кол.очков
    if (elL)
        elL.textContent = CUP_Total;// Выводим текст с Общим кол.очков
}

///////////////////////////////////////////////////
function _changeColorBuy(elem,a) {
    //elem.classList.backgroundColor('back');
    //elem.style.backgroundColor = elem.classList.contains('back') ? '#4a4a4a' : 'Blue';
    if (a == 1) {
        elem.style.backgroundColor = "lawngreen";
        //elem.style.texts.color = "red";
        buy_avelable = true;
        //console.log("buy_avelable=" + buy_avelable);
    }
    if (a == 0) {
        elem.style.backgroundColor = "#4a4a4a";
        
        buy_avelable = false;
        //console.log("buy_avelable=" + buy_avelable);
    }
}
///////////////////////////////////////////////////
function _changeColorSell(elem, a) {
    if (a == 1) {
        elem.style.backgroundColor = "lawngreen";
        _sellPereklAvailable = true;
    }
    if (a == 0) {
        elem.style.backgroundColor = "#4a4a4a";
        _sellPereklAvailable = false;
    }
    //console.log("str 721 _sellPereklAvailable = " + _sellPereklAvailable + "  _sellAvailable = " + _sellAvailable );
}
///////////////////////////////////////////////////
function _changeColorCnvrt(elem, a) {
    if (a == 1) {
        elem.style.backgroundColor = "lawngreen";
        _cnvrtAvailable = true;
    }
    if (a == 0) {
        elem.style.backgroundColor = "#4a4a4a";
        _cnvrtAvailable = false;
    }
    //console.log("str 773 _cnvrtAvailable = " + _cnvrtAvailable);
}
////////////////////////////////////////////////////////
// смена цвета нижних кнопок
function shar_5_change(elem, num) {
    //console.log("elem = " + elem);
    //console.log("Novaja knopka nazata= " + num);
    if (num == 0) {
        if (all_shar[num] == false) {
            if (all_shar[num + 1] == false) {
                el_tru(num + 1);
                if (all_shar[3] == true)
                    el_null(3);
                if (all_shar[4] == true)
                    el_null(4);
            }
            else {
                el_tru(num);
            }
        }
        else
            el_null(num);
    }
    if (num == 1) {
        if (all_shar[num] == false) {
            el_tru(num);
            if (all_shar[3] == true)
                el_null(3);
            if (all_shar[4] == true)
                el_null(4);
        }
        else {
            if (all_shar[0] == true)
                el_null(0);
            else
                el_null(num);
        }
    }
    if (num == 2) {
        for (var i = 0; i < 5; i++) {
            if (i != 2) {
                if (all_shar[i] == true) {
                    var elem0 = document.getElementById("loa-" + (i + 1));
                    elem0.classList.toggle("show-before");
                    all_shar[i] = false;
                }
            }
        }
    }
    if (num == 3) {
        if (all_shar[num] == false) {
            el_tru(num);
            if (all_shar[0] == true)
                el_null(0);
            if (all_shar[1] == true)
                el_null(1);
        }
        else {
            if (all_shar[4] == true)
                el_null(4);
            else
                el_null(num);
        }
    }
    if (num == 4) {
        if (all_shar[num] == false) {
            if (all_shar[num - 1] == false) {
                el_tru(num - 1);
                if (all_shar[0] == true)
                    el_null(0);
                if (all_shar[1] == true)
                    el_null(1);
            }
            else {
                el_tru(num);
            }
        }
        else
            el_null(num);
    }
    function el_tru(n) {
        //console.log("el_tru = " + n);
        var elem0 = document.getElementById("loa-" + (n + 1));
        elem0.classList.toggle("show-before");
        all_shar[n] = true;
    }
    function el_null(n) {
        //console.log("el_null = " + n);
        var elem0 = document.getElementById("loa-" + (n + 1));
        elem0.classList.toggle("show-before");
        all_shar[n] = false;
    }
}
// ВЫКлючаем все красные после нажатия на любой шар кроме розового
function shar_5_0() {
    for (var i = 0; i < 5; i++) {
        if (all_shar[i] == true) {
            var elem = document.getElementById("loa-" + (i + 1));
            elem.classList.toggle("show-before");
            all_shar[i] = false;
        }
    }
    shar_num5 = 0;
}

// ВКЛючаем красную(полоску) среднюю после нажатия на розовый шар
function shar_5() {
    shar_num5 = 1;
    if (all_shar[2] == false) {
        var elem3 = document.getElementById("loa-3");
        elem3.classList.toggle("show-before");
        all_shar[2] = true;
    }
    else {
        for (var i = 0; i < 5; i++) {
            if (i != 2) {
                if (all_shar[i] == true) {
                    var elem = document.getElementById("loa-" + (i + 1));
                    elem.classList.toggle("show-before");
                    all_shar[i] = false;
                }
            }

        }
    }

}

function _showImage() {
    if (store[0]) {
        var elem2 = document.getElementById("load-2");
        // Переключаем класс show-before
        elem2.classList.toggle("show-before");
    }
    if (store[1]) {
        var elem3 = document.getElementById("load-3");
        elem3.classList.toggle("show-before");
    }
    if (store[2]) {
        var elem4 = document.getElementById("load-4");
        elem4.classList.toggle("show-before");
    }
    if (store[3]) {
        var elem5 = document.getElementById("load-5");
        elem5.classList.toggle("show-before");
    }
    if (store[4]) {
        var elem6 = document.getElementById("load-6");
        elem6.classList.toggle("show-before");
    }
}

function _enable_fullsrc(m_screen, db) {
    var elem = document.getElementById("load-7");
    m_screen.request_fullscreen_hmd(db); //_hmd
    elem.style.backgroundImage = "url('./assets/Balls/full_scr_inv.png')";
    full_screen = true;
    //console.log("m_screen = " + m_screen);
}

function _desable_fullsrc(m_screen) {
    if (full_screen) {
        var elem = document.getElementById("load-7");
        elem.style.backgroundImage = "url('./assets/Balls/full_scr.png')";
        m_screen.exit_fullscreen_hmd();
        full_screen = false;
    }
}

function _ShowBestResult(r) {
    var el = document.getElementById("result");
    if (el) {
        el.textContent = "" + r;
    }
     // var el = document.getElementById("strk");
}
function _PlusZaStrike(r) {
    //console.log("_PlusZaStrike(r)");
    var el = document.getElementById("strk");
    if (el) {
        el.textContent = "" + r;

        if (!_CUP) {
            PointTotal += 10;
            _PointTotal(PointTotal);
            _MONEY(10);
        }            
        else
            _CONVERT_Point(10);
    }
}

function _PlusZaSpare(r) {
    //console.log("function _PlusZaSpare");
    var el = document.getElementById("spr");
    if (el) {
        el.textContent = "" + r;

        if (!_CUP) {
            PointTotal += 5;
            _PointTotal(PointTotal);
            _MONEY(5);
        } 
        else
            _CONVERT_Point(5);
    }
}

function _GameScore(r) {
    var el = document.getElementById("gameres");
    if (el) {
        el.textContent = "" + r;

        if (!_CUP) {
            PointTotal += r;
            _PointTotal(PointTotal);
            _MONEY(r);
        }
        else
            _CONVERT_Point(r);

    }
}
function _PointTotal(r) {
    var el = document.getElementById("totall");
    if (el) {
        el.textContent = "" + r;
    }
}

function _ForBestResult(rb) {   
    var elb = document.getElementById("best");
    if (elb) {
        elb.textContent = "" + rb;
    }
    if (!_CUP) {
        _PointTotal(PointTotal + rb);
        _MONEY(rb);
    }
    else
        _CONVERT_Point(rb);
}

function _MONEY(m) { //rateval#bowlvalue
    //console.log("function _MONEY(m) = "+m);
    var el = document.getElementById("totmoney");
    if (el) {
        var mmm = (parseFloat(m / RATE).toFixed(2))*100;
        //console.log("mmm = " + mmm);
        //console.log("Money = " + Money);

        var tmt = Money*100 + mmm;
        //console.log("tmt = " + tmt);
        Money = (parseFloat(tmt / 100).toFixed(2));
        //Money = tmt/100;
        el.textContent = Money;
        //console.log("Money = " + Money);
    }
}
function _NewRate() { //rateval#bowlvalue

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } 
        
    function getRandomFloat() {
        return ((Math.random() - .5) * 2) * 5;
    } 
        
    var yes_no = getRandomInt(0, 5);
    var flo = 0.0;
    //console.log("yes_no=" + yes_no);
    if (yes_no != 0) {
        flo = getRandomFloat();

        if (flo != 0.0) {
            if (RATE <= 1.45) {
                if (flo < 0.0)
                    flo = 3.0;
            }

            if (RATE >= 2.00) {
                if (flo > 0.0)
                    flo = -3.0;
            }

            var ff1 = (parseFloat(flo).toFixed(1)) * 10;
            //console.log("ff1=" + ff1);
            var ff2 = (RATE * 1000) + ff1;
            //console.log("ff2=" + ff2);

            RATE = (parseFloat(((parseFloat(ff2).toFixed(2)) / 1000)).toFixed(2));
            //console.log("RATE=" + RATE);
            var elr = document.getElementById("bowlvalue");
            if (elr)
                elr.textContent = RATE;

        }
    }


}

    function _Game_begin() {

        zvk += 1;
        if (zvk == 4)
            zvk = 1;
        if (_zvuk) {            
            if (zvk == 1) 
                playMusic01();
            if (zvk == 2) 
                playMusic02();
            if (zvk == 3)
                playMusic03();
        }
            
        _begin_first_anim(30, 69);
        for (var j = 1; j < 30; j++) {
            var obname = "Tx" + j;
            //console.log("obname =" + obname);
            if (m_scenes.check_object_by_name(obname, 0)) {
                var lastob = m_scenes.get_object_by_name(obname);
                //console.log("obname =" + lastob);
                m_scenes.remove_object(lastob);
                //m_scenes.hide_object(lastob);
            }
        }
        for (var j1 = 0; j1 < 4; j1++) {
            var obname = "Tx" + all_znak[j1];
            //console.log("obname =" + obname);
            if (m_scenes.check_object_by_name(obname, 0)) {
                var lastob = m_scenes.get_object_by_name(obname);
                //console.log("obname =" + lastob);
                m_scenes.remove_object(lastob);
                //m_scenes.hide_object(lastob);
            }
        }

        for (var j = 1; j < TxFrame + 1; j++) {
            var _new = "TxT" + j;
            //console.log("_new =" + _new);
            if (m_scenes.check_object_by_name(_new, 0)) {
                var lastob = m_scenes.get_object_by_name(_new);
                //console.log("_new =" + lastob);
                m_scenes.remove_object(lastob);
                //m_scenes.hide_object(lastob);
            }
        }
        for (var j = 0; j < tTol + 1; j++) {
            var _newT = "TxTotal" + j;

            if (m_scenes.check_object_by_name(_newT, 0)) {
                var lastob = m_scenes.get_object_by_name(_newT);
                m_scenes.remove_object(lastob);
                //m_scenes.hide_object(lastob);
            }
        }
        // Зеленая точка
        //const TocPosFirst01 = 1.84584;
        var obt = m_scenes.get_object_by_name("OverFrame");//(FrameTrue - 1)
        m_scenes.show_object(obt);
        m_trans.set_translation(obt, 1.84584, -11.11572, 0.877849);

        var obL = m_scenes.get_object_by_name("Over_10_Frame");
        m_scenes.show_object(obL);
        var obT = m_scenes.get_object_by_name("Total");
        m_scenes.hide_object(obT);
        var obS = m_scenes.get_object_by_name("Score");
        m_scenes.hide_object(obS);
        var obG = m_scenes.get_object_by_name("GameOver");
        m_scenes.hide_object(obG);
        _game_over();

        shar_num5 = 0;
        all_shar = [false, false, false, false, false];

        Schet_0 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        Game = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        _Place = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
        Total = 0;
        LastShot = false;
        //BestResult = 0;
        TxName = 0;
        TxFrame = 0;

        tTol = 0;
        Prop_PlaceInFrame = [[11, 12], [21, 22], [31, 32], [41, 42], [51, 52], [61, 62], [71, 72], [81, 82], [91, 92], [101, 102], [111, 0]];
        NumBroska_Player = 0;//16;//16
        Player_PlaceInFrame = 0;
        Player_NumFrame = 0;
        CountFirst = 0;
        CountSecond10 = 0;
        own_dobavka = 0;
        ResetPins = false;
        FrameTrue = 1;//9;//# Когда будет кнопка NewGame, здесь должен быть 0
        TextVisualClasic = true;
        own_countPinPad = null;
        _Break = false;
        _enable_click = false;
        STRIKE = 0;
        SPARE = 0;
        PointTotal = 0;

        var el = document.getElementById("strk");
        if (el)
            el.textContent = "" + 0;
        var el1 = document.getElementById("spr");
        if (el1)
            el1.textContent = "" + 0;

        var el2 = document.getElementById("gameres");
        if (el2)
            el2.textContent = "" + 0;

        var el3 = document.getElementById("gameres");
        if (el3)
            el3.textContent = "" + 0;

        var el4 = document.getElementById("totall");
        if (el4)
            el4.textContent = "" + 0;

        var el5 = document.getElementById("best");
        if (el5)
            el5.textContent = "" + 0;

        if (buy_avelable) {
            var elem = document.getElementById("buy");
            _changeColorBuy(elem, 0);
        }

        if (_sellAvailable || _sellPereklAvailable) {
            var elem = document.getElementById("sell");
            _changeColorSell(elem, 0);
            _sellAvailable = false;
        }

        if (showMenu) {
            var el = document.getElementById("centr");
            el.style.display = 'none';
            var elemMenu = document.getElementById("menu");
            elemMenu.style.color = "cyan";
            showMenu = false;
        }

        var elSh = document.getElementById("show-wind");
        if (elSh)
            elSh.style.display = 'none';
        var elL = document.getElementById("lastMess");
        if (elL) {
            elL.style.display = 'none';
            showButtLastTx = false;
        }        
        if (!full_screen) {
            var m_screen = b4w.screen;
            _enable_fullsrc(m_screen, document.body);
        }
            
    }

function _beginFinal() {

    _begin_first_anim(1, 30);
    var obT = m_scenes.get_object_by_name("Total");
    m_scenes.hide_object(obT);
    var obS = m_scenes.get_object_by_name("Score");
    m_scenes.show_object(obS);
    //console.log("44 GameBegin = " + GameBegin);
    var obG = m_scenes.get_object_by_name("GameOver");
    m_scenes.show_object(obG);
    // Зеленая точка
    var obt = m_scenes.get_object_by_name("OverFrame");
    m_scenes.hide_object(obt);
    if (_zvuk)
        playFinalSound();

    _game_over();

    if (shar_num5 != 0) {
        shar_5_0();
        var el = document.getElementById("contr-container");
        el.style.display = 'none';
    }

    //if (LAPS > 0) {
    /*if (showLeft) {
        //var el = document.getElementById("show-hideLeft");
        //el.style.display = 'none';
        //var el2 = document.getElementById("left");
        //el2.style.display = 'block';
        showLeft = false;
    }
    if (showRight) {
        //var el = document.getElementById("show-hideRight");
        //el.style.display = 'none';
        //var el2 = document.getElementById("right");
        //el2.style.display = 'block';
        showRight = false;
    }*/


    _GameScore(Total);//

    if (Total >= BestResult) {
        BestResult = Total;
        _ShowBestResult(BestResult);
        _ForBestResult(50);
    }

    LAPS -= 1;

    if (!_CUP) {
        var ellL = document.getElementById("laps2");
        if (ellL) {
            if (LAPS > -1)
                ellL.textContent = LAPS + " rounds + " + extra_Laps + " extra";
            if (LAPS == -1)
                ellL.textContent = "0 rounds";
        }
    }

    if (LAPS < 1) 
        availableGame = false;
    //console.log("function _beginFinal() poslali situation_Now()");
    situation_Now();
    //situation_total(0);

}

function _windTx(txt) {
    //console.log("function _windTx(txt)= "+txt);
    var elSh = document.getElementById("show-wind");
    if (elSh) {
        elSh.style.display = 'block';
        var elD = document.getElementById("myDialog");
        if (elD) {
            elD.textContent = txt;
        }
    }
    _LastText = txt;
}

function _windTx_CUP(txt, nm) {
    all_down();
    var elSh = document.getElementById("show-wind");
    if (elSh) {
        elSh.style.display = 'block';
        var elD = document.getElementById("myDialog");
        if (elD) {
            elD.textContent = txt;
        }
    }

    _LastText = txt;
    m_time.set_timeout(function () {
        elSh.style.display = 'none';
        //var elC = document.getElementById("over");
        //if (elC)
        //    elC.style.display = 'block';
        var nextLevel = document.getElementById("nextLevel");
        if (nextLevel)
            nextLevel.style.display = show ? "flex" : "none";
        //console.log("function _windTx_CUP nm= "+nm);
        if (nm == 1) { // Если проигрыш
            var p = document.getElementsByTagName("p")[13];
            p.textContent = "/*/*/*/*/*/*/*/*/*/";
            
        }
    }, 6000);
}
function all_down() {
    _PlusZaStrike(0);
    _PlusZaSpare(0);
    _GameScore(0);
    _ForBestResult(0);
    _PointTotal(0);
    _begin_first_anim(1, 30);
    for (var j = 1; j < 30; j++) {
        var obname = "Tx" + j;
        //console.log("obname =" + obname);
        if (m_scenes.check_object_by_name(obname, 0)) {
            var lastob = m_scenes.get_object_by_name(obname);
            //console.log("obname =" + lastob);
            m_scenes.remove_object(lastob);
            //m_scenes.hide_object(lastob);
        }
    }
    for (var j1 = 0; j1 < 4; j1++) {
        var obname = "Tx" + all_znak[j1];
        //console.log("obname =" + obname);
        if (m_scenes.check_object_by_name(obname, 0)) {
            var lastob = m_scenes.get_object_by_name(obname);
            //console.log("obname =" + lastob);
            m_scenes.remove_object(lastob);
            //m_scenes.hide_object(lastob);
        }
    }

    for (var j = 1; j < TxFrame + 1; j++) {
        var _new = "TxT" + j;
        //console.log("_new =" + _new);
        if (m_scenes.check_object_by_name(_new, 0)) {
            var lastob = m_scenes.get_object_by_name(_new);
            //console.log("_new =" + lastob);
            m_scenes.remove_object(lastob);
            //m_scenes.hide_object(lastob);
        }
    }
    for (var j = 0; j < tTol + 1; j++) {
        var _newT = "TxTotal" + j;

        if (m_scenes.check_object_by_name(_newT, 0)) {
            var lastob = m_scenes.get_object_by_name(_newT);
            m_scenes.remove_object(lastob);
            //m_scenes.hide_object(lastob);
        }
    }
    // Зеленая точка
    //const TocPosFirst01 = 1.84584;
    var obt = m_scenes.get_object_by_name("OverFrame");//(FrameTrue - 1)
    m_scenes.show_object(obt);
    m_trans.set_translation(obt, 1.84584, -11.11572, 0.877849);

    var obL = m_scenes.get_object_by_name("Over_10_Frame");
    m_scenes.show_object(obL);
    var obT = m_scenes.get_object_by_name("Total");
    m_scenes.hide_object(obT);
    var obS = m_scenes.get_object_by_name("Score");
    m_scenes.hide_object(obS);
    var obG = m_scenes.get_object_by_name("GameOver");
    m_scenes.hide_object(obG);
    var ell1 = document.getElementById("load-1"); // New RND
    //m_scenes.hide_object(ell1);
    //ell1.style.backgroundImage = "url('./assets/Balls/SelectBall.png')";
    ell1.textContent = "Select Ball";
    ell1.style.backgroundColor = "green";
    //this.style.backgroundImage = "url('./assets/Balls/SelectBall.png')";
    _Final = true;
    _game_over();
}
function process_buy_CUP() {
    all_down();
    //situation_total(5);
    //situation_Now();
}
function situation_Now() {
    //console.log("Nacalo function situation_Now()");
    var L = LAPS;
    var E = extra_Laps;
    var C = _Coll_stoim;
    var K = _kol_Clctn;
    var M = Money;
    var tx = "";
    if (!_CUP) {
        if (K < 5) { //Если  кол-во шаров в коллекции меньше 5

            if (K < 4) { //Если  кол-во шаров в коллекции меньше 4

                if (L > 0 && E > 0) { //Если регулярных кругов больше 0 и экстра-кругов больше 0
                    if (M >= 45.0) { //Если денег больше/равно стоимости одного экстра-круга
                        var lessPrice = _lessPrice(); //Выясним цену самого дешевого шара
                        if (M >= lessPrice)  //Если денег больше/равно цене самого дешевого шара  
                            tx = texts[0]; //Можешь покупать все,что хочешь(можешь)                                          
                        else
                            tx = texts[1]; //Иначе только Экстра-круг
                    }
                    else
                        tx = texts[2]; //Иначе оценка "Не плохо,но можно лучше"
                }

                if (L == 0 && E > 0) { //Если регулярных кругов НЕТ, а экстра-кругов больше 0
                    if (M >= 45.0) { //Если денег больше/равно стоимости одного экстра-круга
                        var lessPrice = _lessPrice(); //Выясним цену самого дешевого шара
                        if (M >= lessPrice) //Если денег больше/равно цене самого дешевого шара  
                            tx = texts[0]; //Можешь покупать все,что хочешь(можешь)
                        else
                            tx = texts[1]; //Иначе только Экстра-круг
                    }
                    else { //Если денег меньше стоимости одного экстра-круга
                        if (K > 1) { //Если шаров больше одного
                            tx = texts[8]; //Можно продать свой шар,чтобы купить экстра-круг
                            _sellAvailable = true;
                            //console.log("str 1257");
                        }
                        else {
                            //console.log("function situation_Now() 1");
                            _windTx_CUP(texts[11], 1); // Иначе конец игры
                            
                        }
                            //tx = texts[11]; // Иначе конец игры
                    }
                }

                if (L == 0 && E == 0) { //Если регулярных кругов НЕТ и экстра-кругов НЕТ
                    var priceAllBalls = _PriceAllBalls(); //Получим цену всех некупленных шаров
                    if (M >= priceAllBalls) { //Если денег хватает на все
                        tx = texts[0]; //Можешь покупать все,что хочешь(можешь)
                    }
                    else {
                        //console.log("function situation_Now() 2");
                        _windTx_CUP(texts[11], 1); // Иначе конец игры
                        //tx = texts[11]; // Иначе конец игры
                        
                    }

                }
                if (tx != "")
                    _windTx(tx);
            }

            if (K == 4) { //Если в коллекции 4 шара
                if (L > 0 && E > 0) { //Если регулярных кругов больше 0 и экстра-кругов больше 0
                    if (M >= 45.0) { //Если денег больше/равно стоимости одного экстра-круга
                        var lessPrice = _lessPrice(); //Выясним цену последнего шара
                        if (M >= lessPrice) //Если денег больше/равно цене последнего шара  
                            tx = texts[0]; //Можешь покупать все,что хочешь(можешь)
                        else
                            tx = texts[1]; //Иначе только Экстра-круг
                    }
                    else
                        tx = texts[2]; //Иначе оценка "Не плохо,но можно лучше"
                }

                if (L == 0 && E > 0) { //Если регулярных кругов НЕТ, а экстра-кругов больше 0
                    if (M >= 45.0) { //Если денег больше/равно стоимости одного экстра-круга
                        var lessPrice = _lessPrice(); //Выясним цену последнего шара
                        if (M >= lessPrice) //Если денег больше/равно цене последнего шара  
                            tx = texts[3]; //Можешь покупать Последний шар
                        else
                            tx = texts[1]; //Иначе только Экстра-круг
                    }
                    else { //Если денег меньше стоимости одного экстра-круга
                        if (K > 1) { //Если шаров больше одного
                            tx = texts[8]; //Можно продать свой шар,чтобы купить экстра-круг
                            _sellAvailable = true;
                            //console.log("str 1299");
                        }
                        else {
                            //console.log("function situation_Now() 3");
                            _windTx_CUP(texts[11], 1); // Иначе конец игры
                            //tx = texts[11]; // Иначе конец игры
                            
                        }

                    }
                }

                if (L == 0 && E == 0) { //Если регулярных кругов НЕТ и экстра-кругов НЕТ
                    var lessPrice = _lessPrice(); //Выясним цену последнего шара
                    if (M >= lessPrice) //Если денег больше/равно цене последнего шара 
                        tx = texts[3]; //Можешь покупать Последний шар
                    else {
                        //console.log("function situation_Now() 4");
                        _windTx_CUP(texts[11], 1); // Иначе конец игры
                        //tx = texts[11]; // Иначе конец игры
                        
                    }

                }
                if (tx != "")
                    _windTx(tx);
            }
        }
    }
    if (_CUP) {

        if (L > 0) {//Если есть недоигранные круги
            tx = texts[9]; // Можно доиграть оставшиеся круги
            var ellL = document.getElementById("laps2"); // Текст наверху
            if (ellL)
                ellL.textContent = LAPS + " rounds";
        }
        if (L <= 0) {
            tx = texts[6]; // Надо пересчитывать в очки для взятия Кубка
            var ellL = document.getElementById("laps2"); // Текст наверху
            if (ellL)
                ellL.textContent = "0 rounds";
            var elbuy = document.getElementById("buy");
            _changeColorBuy(elbuy, 0);
            var elsell = document.getElementById("sell");
            _changeColorSell(elsell, 0);

            process_buy_CUP();


        }
        if (tx != "")
            _windTx(tx);

    }
}
function situation_2(xt) {
    //console.log("function situation_2(xt)="+xt);
    var L = LAPS;
    var E = extra_Laps;
    var C = _Coll_stoim;
    var K = _kol_Clctn;
    var M = Money;
    var tx = "";
    //console.log("L = " + L + ", E = " + E + ", K= " + K);
    if (!_CUP) {

        if (K < 5) { //Если  кол-во шаров в коллекции меньше 5

            if (K < 4) { //Если  кол-во шаров в коллекции меньше 4

                if (L > 0 && E > 0) { //Если регулярных кругов больше 0 и экстра-кругов больше 0
                    if (M >= 45.0) { //Если денег больше/равно стоимости одного экстра-круга
                        var lessPrice = _lessPrice(); //Выясним цену самого дешевого шара
                        if (M >= lessPrice) {//Если денег больше/равно цене самого дешевого шара
                            if (xt != "")
                                tx = xt + texts[0];
                            else
                                tx = texts[0]; //Можешь покупать все,что хочешь(можешь)
                        }
                        else {
                            if (xt != "")
                                tx = xt + texts[1];
                            else
                                tx = texts[1]; //Иначе только Экстра-круг
                        }

                    }
                    else {
                        if (xt != "")
                            tx = xt + texts[2];
                        else
                            tx = texts[2]; //Иначе оценка "Не плохо,но можно лучше"
                    }

                }

                if (L == 0 && E > 0) { //Если регулярных кругов НЕТ, а экстра-кругов больше 0
                    if (M >= 45.0) { //Если денег больше/равно стоимости одного экстра-круга
                        var lessPrice = _lessPrice(); //Выясним цену самого дешевого шара
                        if (M >= lessPrice) { //Если денег больше/равно цене самого дешевого шара
                            if (xt != "")
                                tx = xt + texts[0];
                            else
                                tx = texts[0]; //Можешь покупать все,что хочешь(можешь)
                        }
                        else {
                            if (xt != "")
                                tx = xt + texts[1];
                            else
                                tx = texts[1]; //Иначе только Экстра-круг
                        }

                    }
                    else { //Если денег меньше стоимости одного экстра-круга
                        if (K > 1) { //Если шаров больше одного
                            tx = texts[8]; //Можно продать свой шар,чтобы купить экстра-круг
                            _sellAvailable = true;
                            //console.log("str 1257");
                        }
                        else {
                            //console.log("function situation_2(xt) 1");
                            _windTx_CUP(texts[11], 1); // Иначе конец игры
                            
                        }
                        //tx = texts[11]; // Иначе конец игры
                    }
                }

                if (L == 0 && E == 0) { //Если регулярных кругов НЕТ и экстра-кругов НЕТ
                    var priceAllBalls = _PriceAllBalls(); //Получим цену всех некупленных шаров
                    if (M >= priceAllBalls) { //Если денег хватает на все
                        if (xt != "")
                            tx = xt + texts[0];
                        else
                            tx = texts[0]; //Можешь покупать все,что хочешь(можешь)
                    }
                    else {
                        //console.log("function situation_2(xt)  2");
                        _windTx_CUP(texts[11], 1); // Иначе конец игры
                        //tx = texts[11]; // Иначе конец игры
                        
                    }

                }
                if (tx != "")
                    _windTx(tx);
            }

            if (K == 4) { //Если в коллекции 4 шара
                if (L > 0 && E > 0) { //Если регулярных кругов больше 0 и экстра-кругов больше 0
                    if (M >= 45.0) { //Если денег больше/равно стоимости одного экстра-круга
                        var lessPrice = _lessPrice(); //Выясним цену последнего шара
                        if (M >= lessPrice) { //Если денег больше/равно цене последнего шара
                            if (xt != "")
                                tx = xt + texts[0];
                            else
                                tx = texts[0]; //Можешь покупать все,что хочешь(можешь)
                        }
                        else {
                            if (xt != "")
                                tx = xt + texts[1];
                            else
                                tx = texts[1]; //Можешь покупать все,что хочешь(можешь)
                        }

                    }
                    else {
                        if (xt != "")
                            tx = xt + texts[2];
                        else
                            tx = texts[2]; //Можешь покупать все,что хочешь(можешь)
                    }

                }

                if (L == 0 && E > 0) { //Если регулярных кругов НЕТ, а экстра-кругов больше 0
                    if (M >= 45.0) { //Если денег больше/равно стоимости одного экстра-круга
                        var lessPrice = _lessPrice(); //Выясним цену последнего шара
                        if (M >= lessPrice) { //Если денег больше/равно цене последнего шара
                            if (xt != "")
                                tx = xt + texts[3];
                            else
                                tx = texts[3]; //Можешь покупать все,что хочешь(можешь)
                        }

                        else {
                            if (xt != "")
                                tx = xt + texts[1];
                            else
                                tx = texts[1]; //Можешь покупать все,что хочешь(можешь)
                        }

                    }
                    else { //Если денег меньше стоимости одного экстра-круга
                        if (K > 1) { //Если шаров больше одного
                            tx = texts[8]; //Можно продать свой шар,чтобы купить экстра-круг
                            _sellAvailable = true;
                            //console.log("str 1299");
                        }
                        else {
                            //console.log("function situation_2(xt)  3");
                            _windTx_CUP(texts[11], 1); // Иначе конец игры
                            //tx = texts[11]; // Иначе конец игры
                            
                        }

                    }
                }

                if (L == 0 && E == 0) { //Если регулярных кругов НЕТ и экстра-кругов НЕТ
                    var lessPrice = _lessPrice(); //Выясним цену последнего шара
                    if (M >= lessPrice) {  //Если денег больше/равно цене последнего шара
                        if (xt != "")
                            tx = xt + texts[3];
                        else
                            tx = texts[3]; //Можешь покупать все,что хочешь(можешь)
                    }

                    else {
                        //console.log("function situation_2(xt)  4 Kol-sharov= "+K);
                        _windTx_CUP(texts[11], 1); // Иначе конец игры
                        //tx = texts[11]; // Иначе конец игры
                        
                    }

                }
                if (tx != "")
                    _windTx(tx);
            }
        }
    }

}

/*var Money = -80.00;// Деньги игрока
var store = [true, false, false, false, false, false];
var _Collection = [true, false, false, false, false, false];
var LAPS = 5;// Кол-во регулярных раундов
var extra_Laps = 3;// Кол-во экстра раундов
var _kol_Clctn = 1;// Кол-во шаров в коллекции
//Стоимость шаров
var _Coll_stoim = [80.0, 99.0, 149.0, 169.0, 189.0, 45.0] */

function mess_1(M, C, K) {//Если  экстра-кругов больше 0
    //console.log("function mess_1 M = " + Money + " C= " + C + " K= " + K);
    var tx = "";
    if (M >= C[5]) { //Если денег больше/равно стоимости одного экстра-круга                        
        //Выясним цену самого дешевого шара из еще Не купленных
        var lessPrice = _lessPrice();
        if (M >= lessPrice)  //Если денег больше/равно цене самого дешевого шара
            if (K < 4)
                tx = texts[0]; //Можешь покупать все,что хочешь(можешь)
            else
                tx = texts[3]; //Можешь купить последний шар и предупрежд.
        else
            tx = texts[1]; //Иначе только Экстра-круг
    }
    else
        tx = texts[2]; //Иначе оценка "Не плохо,но можно лучше"
    return tx;
}
function mess_2(M, C, K) {//Если  экстра-кругов == 0
    var tx = "";
    //Выясним цену самого дешевого шара из еще Не купленных
    var lessPrice = _lessPrice();
    if (M >= lessPrice)  //Если денег больше/равно цене самого дешевого шара
        if (K < 4)
            tx = texts[0]; //Можешь покупать все,что хочешь(можешь)
        else
            tx = texts[13]; //Можешь купить последний шар
    else
        tx = texts[2];//Иначе оценка "Не плохо,но можно лучше"
    return tx;
}
function situation_total(_case) {
   // console.log("function situation_total() Money = " + Money);
    var L = LAPS;
    var E = extra_Laps;
    var C = _Coll_stoim;
    var K = _kol_Clctn;
    var M = Money;
    var tx = "";
    if (_case == 0) { // конец раунда
        //console.log("_case == 0");
        if (!_CUP) { // если еще нет 5ти шаров
            if (L > 0) { // если кол-во регуляр.больше 0
                if (E > 0) { //Если  экстра-кругов больше 0
                    if (K <= 4) { //Если  кол-во шаров в коллекции <= 4
                        tx = mess_1(M, C, K);
                    }
                    if (K == 5) { //Если  кол-во шаров в коллекции == 5
                        tx = mess_1(M, C, K);
                    }
                }
                else {//Если  экстра-кругов == 0
                    if (K <= 4) { //Если  кол-во шаров в коллекции <= 4
                        tx = mess_2(M, C, K);
                    }
                }

            }
            /*if (L <= 0) { // если кол-во регуляр.= 0
                if (K < 4) { //Если  кол-во шаров в коллекции меньше 4
                    console.log("if (K < 4)");
                }
                if (K == 4) { //Если  кол-во шаров == 4
                    console.log("if (K == 4)");
                }
            }*/
        }
        else { // если есть 5 шаров
            if (L > 0) {//Если есть недоигранные круги
                tx = texts[9]; // Можно доиграть оставшиеся круги
                var ellL = document.getElementById("laps2"); // Текст наверху
                if (ellL)
                    ellL.textContent = LAPS + " rounds";
            }
            if (L <= 0) {
                tx = texts[6]; // Надо пересчитывать в очки для взятия Кубка
                var ellL = document.getElementById("laps2"); // Текст наверху
                if (ellL)
                    ellL.textContent = "0 rounds";
                var elbuy = document.getElementById("buy");
                _changeColorBuy(elbuy, 0);
                var elsell = document.getElementById("sell");
                _changeColorSell(elsell, 0);
                //process_buy_CUP();
                all_down();
            }
        }
    }
    /*if (_case == 1) {
        console.log("_case == 1");
    }*/
    if (_case == 5) {
        //console.log("_case == 5");
        if (CUP_Total < 1500)
            tx = "You need " + String(1500) + " points. You have " + Number(CUP_Total) + " points."
        else
            tx = "You can take the Winner's Cup.";
    }
    //console.log("function process_buy_CUP() CUP_Total = "+CUP_Total);
    //var txt = "You need " + String(1500) + " points. You have " + Number(CUP_Total) + " points."
    //_windTx(txt);
    if (tx != "")
        _windTx(tx);
}
function _lessPrice() {
    var lp = 1000.0;
    var C = _Coll_stoim;
    for (var i = 0; i < 5; i++) {
        if (!_Collection[i]) {
            if (C[i] < lp)
                lp = C[i];
        }
    }
    return lp;
}

function _PriceAllBalls() {
    var allp = 0.0;
    var C = _Coll_stoim;
    for (var i = 0; i < 5; i++) {
        if (!_Collection[i]) {
            allp += C[i];
        }
    }
    return allp;
}


function _game_over() {
    var obG = m_scenes.get_object_by_name("GameOver");
    var count = 0;
    // function creation setInterval
    var interval = setInterval(function () {
        if (EndGame == true && _Final==false) {
            count += 1;
            if (count % 2 == 0)
                m_scenes.hide_object(obG);
            else
                m_scenes.show_object(obG);
        }
        else
            clearInterval(interval);
    }, 300);
}
///////////////////////////////////////////


//////////////////////////////////////////////    
function selectBall(_nameOb, _nameAnim) {
    //m_data.load("blend_data/Bowling Ball00.json", loaded_cb, null, null, true);
    var targ = m_scenes.get_object_by_name(_nameOb);
    var m_vec3 = b4w.vec3;//
    var _vec3_tmp = m_vec3.create();
    _d_id++;
    if (_d_id > 1) {
        //m_scenes.hide_object(_previev_obj);
        m_phy.disable_simulation(_previev_obj);
        //console.log("if (_d_id > 1) {");
        m_trans.set_translation_v(_previev_obj, pos_all_hide_bowl);//4.0, -12.0, -0.67);
        m_scenes.hide_object(_previev_obj);
    }
    m_phy.disable_simulation(targ);
    //m_trans.set_rotation_euler(targ, 0, 0, 0);

    //m_scenes.show_object(targ);
    // Применить анимацию "Pin_Down"
    m_anim.apply(targ, _nameAnim, m_anim.SLOT_0);
    // Задать начальный кадр
    m_anim.set_frame(targ, 160);
    _first_Click = false;
    // Воспроизвести анимацию с ограничением диапазона кадров
    function play_animation_with_range(targ, start_frame, end_frame) {
        m_scenes.show_object(targ);
        m_anim.set_frame(targ, start_frame);
        m_anim.play(targ);

        var check_frame = function () {
            var current_frame = m_anim.get_frame(targ);
            if (current_frame == 1)
                current_frame = 190;
            if (current_frame > end_frame) {
                m_anim.stop(targ);

                var translation = m_trans.get_translation(targ, _vec3_tmp);

                m_anim.remove(targ);
                m_anim.remove_slot_animation(targ, m_anim.SLOT_0)
                // Бывший шар уберем
                Ball_TakePlace(_d_id, targ, translation);
                //_enable_click = false;
                if (_nameOb == "Bowling Ball07")
                    shar_5();
                else {
                    if (shar_num5 != 0)
                        shar_5_0();
                }
            } else {
                requestAnimationFrame(check_frame);
            }
        };
        check_frame();
    }

    play_animation_with_range(targ, 160, 189);
}
// Бывший шар уберем
function Ball_TakePlace(_id, ob, translation) {

    _selected_obj = null;
    _moving_obj = null;

    m_trans.set_translation(ob, translation[0], translation[1], translation[2]);
    _previev_obj = ob;
    _enable_click = false;
    var id = m_scenes.get_object_data_id(ob);
    _NewRate();
}
function init_buttons() {
    var ids = ["delete", "rot-ccw", "rot-cw"];

    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];

        document.getElementById(id).addEventListener("mousedown", function (e) {
            var parent = e.target.parentNode;
            parent.classList.add("active");
        });
        document.getElementById(id).addEventListener("mouseup", function (e) {
            var parent = e.target.parentNode;
            parent.classList.remove("active");
        });
        document.getElementById(id).addEventListener("mousemove", function (e) {
            var parent = e.target.parentNode;
            parent.classList.remove("active");
        });
        document.getElementById(id).addEventListener("touchstart", function (e) {
            var parent = e.target.parentNode;
            parent.classList.add("active");
        });

        /*document.addEventListener("touchstart", function (e) {
            console.log("GLOBAL TOUCHSTART");
        }, { passive: false });*/

        document.getElementById(id).addEventListener("touchend", function (e) {
            var parent = e.target.parentNode;
            parent.classList.remove("active");
        });
        document.getElementById(id).addEventListener("touchmove", function (e) {
            var parent = e.target.parentNode;
            parent.classList.remove("active");
        });
    }
    if (document.addEventListener) {
        document.addEventListener('webkitfullscreenchange', exitHandler, { passive: false });
        document.addEventListener('mozfullscreenchange', exitHandler, { passive: false });
        document.addEventListener('fullscreenchange', exitHandler, { passive: false });
        document.addEventListener('MSFullscreenChange', exitHandler, { passive: false });
    }

}
function exitHandler() {
    if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
        //console.log("Нажата Esc – exitFullscreen");
        var m_screen = b4w.full_screen;//require("screen");
        if (full_screen) {
            _desable_fullsrc(m_screen);
        }
    }
}


///////////////////////////////////

/*
 var start = null;
var element = document.getElementById("SomeElementYouWantToAnimate");

function step(timestamp) {
  if (!start) start = timestamp;
  var progress = timestamp - start;
  element.style.transform =
    "translateX(" + Math.min(progress / 10, 200) + "px)";
  if (progress < 2000) {
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step);
 */
//////////////////////////////////////////////

/**
 * callback executed when the scene data is loaded
 */
function load_cb(data_id, success) {
    //console.log("function load_cb");
    if (!success) {
        //console.log("b4w load failure");
        return;
    }

    m_app.enable_camera_controls();
    init_controls();
    // place your code here
    var canvas_elem = m_cont.get_canvas();

        // если игра запущена на мобильном устройстве
//if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    // то добавляем отслеживание события нажатия на экран

    canvas_elem.addEventListener("touchstart", main_canvas_down, { passive: false });
    canvas_elem.addEventListener("touchmove", main_canvas_move, { passive: false });
    canvas_elem.addEventListener("touchend", main_canvas_up, { passive: false });

//} else {
    // иначе, если это ПК, добавляем отслеживание нажатия мыши
    //window.addEventListener("mousedown", eventHandler);
    canvas_elem.addEventListener("mousedown", main_canvas_down);
    canvas_elem.addEventListener("mousemove", main_canvas_move);
    canvas_elem.addEventListener("mouseup", main_canvas_up);
//}

    window.onresize = m_cont.resize_to_container;
    m_cont.resize_to_container();
    //load();

    ////   Позиции пустышек для кеглей
    var m_vec3 = b4w.vec3;
    var _vec3_tmp = m_vec3.create();
    //var translation = m_trans.get_translation(obj, _vec3_tmp);

    var pin1_empty = m_scenes.get_object_by_name("EmptyPin1");
    var EmptyPin1_pos = m_vec3.create();
    var pin1Trans = m_trans.get_translation(pin1_empty, EmptyPin1_pos);
    //console.log("pin1Trans=" + pin1Trans);

    //m_Pins_arr1 = [...m_Pins_arr1, pin1Trans];
    m_Pins_arr1.push(pin1Trans);
    //console.log("m_Pins_arr1=" + m_Pins_arr1);

    var pin2_empty = m_scenes.get_object_by_name("EmptyPin2");
    var EmptyPin2_pos = m_vec3.create();
    var pin2Trans = m_trans.get_translation(pin2_empty, EmptyPin2_pos);
    m_Pins_arr2.push(pin2Trans);

    var pin3_empty = m_scenes.get_object_by_name("EmptyPin3");
    var EmptyPin3_pos = m_vec3.create();
    var pin3Trans = m_trans.get_translation(pin3_empty, EmptyPin3_pos);
    //m_Pins_arr3 = [...m_Pins_arr3, pin3Trans];
    m_Pins_arr3.push(pin3Trans);

    var pin4_empty = m_scenes.get_object_by_name("EmptyPin4");
    var EmptyPin4_pos = m_vec3.create();
    var pin4Trans = m_trans.get_translation(pin4_empty, EmptyPin4_pos);
    //m_Pins_arr4 = [...m_Pins_arr4, pin4Trans];
    m_Pins_arr4.push(pin4Trans);

    var pin5_empty = m_scenes.get_object_by_name("EmptyPin5");
    var EmptyPin5_pos = m_vec3.create();
    var pin5Trans = m_trans.get_translation(pin5_empty, EmptyPin5_pos);
    //m_Pins_arr5 = [...m_Pins_arr5, pin5Trans];
    m_Pins_arr5.push(pin5Trans);

    var pin6_empty = m_scenes.get_object_by_name("EmptyPin6");
    var EmptyPin6_pos = m_vec3.create();
    var pin6Trans = m_trans.get_translation(pin6_empty, EmptyPin6_pos);
    //m_Pins_arr6 = [...m_Pins_arr6, pin6Trans];
    m_Pins_arr6.push(pin6Trans);

    var pin7_empty = m_scenes.get_object_by_name("EmptyPin7");
    var EmptyPin7_pos = m_vec3.create();
    var pin7Trans = m_trans.get_translation(pin7_empty, EmptyPin7_pos);
    //m_Pins_arr7 = [...m_Pins_arr7, pin7Trans];
    m_Pins_arr7.push(pin7Trans);

    var pin8_empty = m_scenes.get_object_by_name("EmptyPin8");
    var EmptyPin8_pos = m_vec3.create();
    var pin8Trans = m_trans.get_translation(pin8_empty, EmptyPin8_pos);
    //m_Pins_arr8 = [...m_Pins_arr8, pin8Trans];
    m_Pins_arr8.push(pin8Trans);

    var pin9_empty = m_scenes.get_object_by_name("EmptyPin9");
    var EmptyPin9_pos = m_vec3.create();
    var pin9Trans = m_trans.get_translation(pin9_empty, EmptyPin9_pos);
    //m_Pins_arr9 = [...m_Pins_arr9, pin9Trans];
    m_Pins_arr9.push(pin9Trans);

    var pin10_empty = m_scenes.get_object_by_name("EmptyPin10");
    var EmptyPin10_pos = m_vec3.create();
    var pin10Trans = m_trans.get_translation(pin10_empty, EmptyPin10_pos);
    //m_Pins_arr10 = [...m_Pins_arr10, pin10Trans];
    m_Pins_arr10.push(pin10Trans);

    // Кегли
    for (var i = 1; i <= 10; i++) {
        var pin_name = 'Pin' + i;
        prev_positions[pin_name] = [0, 0, 0];
        prev_rotations[pin_name] = m_quat.create(); // Используем для кватернионов
    }
    // Находим объект "TxBow_X"
    var _TxBow_X = m_scenes.get_object_by_name("TxBow_X");
    // Прячем "TxBow_X" при загрузке
    m_scenes.hide_object(_TxBow_X, false);
    _begin_first_anim(1, 30);
}


    //#################   звук   ############################################
function show_Strike(num) {
    // Показать Spare или Strike
    var _Spare = "";
    if (num == "Slash") {
        _Spare = m_scenes.get_object_by_name("Spare");
        SPARE += 5;
        _PlusZaSpare(SPARE);
    }

    if (num == "X") {
        _Spare = m_scenes.get_object_by_name("Strike");
        STRIKE += 10;
        _PlusZaStrike(STRIKE);

    }

    m_scenes.show_object(_Spare, false);

    // Через 600 мс  спрятать Spare или Strike
    m_time.set_timeout(function () {

        m_scenes.hide_object(_Spare, false);
    }, 600);
}
// Функции для воспроизведения звука Music01
function playMusic01() {
    if (_zvuk)
        audioMusic01.loop = true;
    audioMusic01.play().catch(function (error) {
        console.error("Ошибка воспроизведения аудио:", error);
    });
}
function stopMusic01() {
    audioMusic01.pause(); // Приостанавливаем звук
}
function stop_End_Music01() {
    audioMusic01.pause(); // Останавливаем звук
    audioMusic01.currentTime = 0; // Сбрасываем время воспроизведения на начало
}
// Функции для воспроизведения звука Music02
function playMusic02() {
    if (_zvuk)
        audioMusic02.loop = true;
    audioMusic02.play().catch(function (error) {
        console.error("Ошибка воспроизведения аудио:", error);
    });
}
function stopMusic02() {
    audioMusic02.pause(); // Приостанавливаем звук
}
function stop_End_Music02() {
    audioMusic02.pause(); // Останавливаем звук
    audioMusic02.currentTime = 0; // Сбрасываем время воспроизведения на начало
}
// Функции для воспроизведения звука Music03
function playMusic03() {
    if (_zvuk)
        audioMusic03.loop = true;
    audioMusic03.play().catch(function (error) {
        console.error("Ошибка воспроизведения аудио:", error);
    });
}
function stopMusic03() {
    audioMusic03.pause(); // Приостанавливаем звук
}
function stop_End_Music03() {
    audioMusic03.pause(); // Останавливаем звук
    audioMusic03.currentTime = 0; // Сбрасываем время воспроизведения на начало
}

// Функции для воспроизведения звука audioFinal audioStrike
function playStrikeSound(num) {
    if (_zvuk)
        audioStrike.play().catch(function (error) {
            console.error("Ошибка воспроизведения аудио:", error);
        });
    show_Strike(num);
}
function playFinalSound() {       
    audioFinal.play().catch(function (error) {
        console.error("Ошибка воспроизведения аудио:", error);
    });
    if (zvk == 1)
        stop_End_Music01();
    if (zvk == 2)
        stop_End_Music02();
    if (zvk == 3)
        stop_End_Music03();
}
function playFoulSound() {
    //if (_zvuk)
    audio.play().catch(function (error) {
        console.error("Ошибка воспроизведения аудио:", error);
    });
}
function playRunBallSound() {
    //if (_zvuk)
    audioRunBall.play().catch(function (error) {
        console.error("Ошибка воспроизведения аудио:", error);
    });
}
function playKegliSound() {
    if (_zvuk) {
        for (var i = 1; i <= 10; i++) {
            var pin_name = 'Pin' + i;
            var ob = m_scenes.get_object_by_name(pin_name);
            var coll_sensor = m_ctl.create_collision_sensor(ob, "", true);
            m_ctl.create_sensor_manifold(ob, "PIN" + i, m_ctl.CT_SHOT, [coll_sensor], null, playKegli);
        }
    }

}

function playKegli() {
    if (_zvuk)
        audioKegli.play().catch(function (error) {
            console.error("Ошибка воспроизведения аудио:", error);
        });
}
/*function stopKegliSound() {
    audioKegli.pause(); // Приостанавливаем звук
    audioKegli.currentTime = 0; // Сбрасываем время воспроизведения на начало
}*/
// Функции для остановки звука
function stopFoulSound() {
    audio.pause(); // Приостанавливаем звук
    audio.currentTime = 0; // Сбрасываем время воспроизведения на начало
}
function stopRunBallSound() {
    audioRunBall.pause(); // Приостанавливаем звук
    audioRunBall.currentTime = 0; // Сбрасываем время воспроизведения на начало
}


    function show_X_WithSound() {
        // Показать _TxBow_X
        var _TxBow_X = m_scenes.get_object_by_name("TxBow_X");
        m_scenes.show_object(_TxBow_X, false);
        if (_zvuk)
            playFoulSound(); // Запускаем звук
        // Через 600 мс остановить звук и спрятать _TxBow_X
        m_time.set_timeout(function () {
            //stopFoulSound();
            m_scenes.hide_object(_TxBow_X, false);
        }, 600);
}

    //#####################   конец звук#################

 // включаем движение, передаем в создание сенсора(init_control_3),а там вкл.контроль над движением
    function main_moving(obj) {

        if (move == true) {
            if (_moving_obj) {
                not_select = true;
               //console.log("_moving_obj");
                var mass = 20.0; // масса шара
                var radius = 0.5; //  радиус шара (из настройки объекта)

                // Момент инерции сферы
                var moment_of_inertia = (2 / 5) * mass * Math.pow(radius, 2);

                // Желаемая угловая скорость (рад/с) и время достижения этой скорости
                var desired_angular_velocity = 25.0; // рад/с Bylo 25.0
                var time_to_reach_velocity = 1.0; // секунды
                var angular_acceleration = desired_angular_velocity / time_to_reach_velocity;

                // Рассчитываем момент силы (торк)
                //var torque = moment_of_inertia * angular_acceleration;          
                // Рассчитываем момент силы (торк) в мировой системе
                var torque_x = moment_of_inertia * angular_acceleration; // вращение вокруг X
                var torque_world = [torque_x, 0.0, 0.0];

                // Получаем ориентацию объекта в виде кватерниона
                var rotation_quat = m_trans.get_rotation(obj);

                // Преобразуем торк в локальную систему координат
                var torque_local = [0, 0, 0];
                var m_vec3 = b4w.vec3;

                m_vec3.transformQuat(torque_world, rotation_quat, torque_local);

                var rnd_transInt2 = ((Math.random() - .5) * 2) * 5;

                var razn = (_last_posX_L - _last_posX_R) / 100;
                //console.log("_last_posX_L=" + _last_posX_L + "  _last_posX_R" + _last_posX_R);
                //console.log("razn=" + razn);
                var torqY = torque_local[1] + rnd_transInt2;

                var nameOb = m_scenes.get_object_name(obj);
                // Применяем линейное движение
                if (nameOb == "Bowling Ball") {
                    m_phy.apply_velocity_world(obj, 0.0 + razn, 12.0, 0.0);
                    m_phy.apply_force_world(obj, 0.0, 12.0, 0.0);// Bylo 12.0
                    //m_phy.apply_torque(obj, -torque_local[0], torque_local[1] + rnd_transInt2, torque_local[2]);
                    m_phy.apply_torque(obj, -torque_local[0], torqY, torque_local[2]);
                }
                if (nameOb == "Bowling Ball02Green") {
                    m_phy.apply_velocity_world(obj, 0.0 + razn, 15.0, 0.0);
                    //console.log("0.0 + razn=" +(0.0 + razn));
                    m_phy.apply_force_world(obj, 0.0, 15.0, 0.0);
                    //m_phy.apply_torque(obj, -torque_local[0], torque_local[1] + rnd_transInt2, torque_local[2]);
                    m_phy.apply_torque(obj, -torque_local[0], torqY, torque_local[2]);
                }                
                if (nameOb == "Bowling Ball03Blue") {
                    m_phy.apply_velocity_world(obj, 0.0, 12.0, 0.0);
                    m_phy.apply_force_world(obj, 0.0, 12.0, 0.0);
                    m_phy.apply_torque(obj, -torque_local[0], torque_local[1], torque_local[2]);
                } 
                if (nameOb == "Bowling Ball07") {
                    razn = (_last_posX_R - _last_posX_L) / 1000;
                    if (all_shar[2] == true) {
                        //var krut = 0.0;
                        if (all_shar[3] == true && all_shar[4] == false)
                            torqY = -5;
                        if (all_shar[4] == true)
                            torqY = -10;
                        if (all_shar[1] == true && all_shar[0] == false)
                            torqY = 5;
                        if (all_shar[0] == true)
                            torqY = 10;
                    }

                    m_phy.apply_velocity_world(obj, 0.0 - razn, 12.0, 0.0);
                    m_phy.apply_force_world(obj, 0.0, 12.0, 0.0);
                    m_phy.apply_torque(obj, -torque_local[0], torqY, torque_local[2]);
                }
                if (nameOb == "Bowling Ball09") {
                    if (razn <= 0) {
                        razn = 2.0;
                        torqY = -10;
                    }
                    else {
                        razn = -2.0;
                        torqY = 10;
                    }
                    m_phy.apply_velocity_world(obj, razn, 12.0, 0.0);
                    m_phy.apply_force_world(obj, razn, 12.0, 0.0);
                    m_phy.apply_torque(obj, -torque_local[0], torqY, torque_local[2]);
                }
                /*var my_camera = m_scenes.get_object_by_name("Camera");
                // камера бежит за шаром
                m_const.append_copy_loc(my_camera, obj, 'XYZ', false, 0.45);*/

                if (_zvuk)
                    playRunBallSound();
                var id = m_scenes.get_object_data_id(obj);
               //console.log("id=" + id);
                init_control_3(obj, id, torque_local[0], torque_local[2]);
            }
        }

        function init_control_3(obj, id, torque_local0, torque_local2) {
           //console.log("function init_control");
            if (move) {
                //create sensor
                var elapsed_sensor = m_ctl.create_elapsed_sensor();//"MAIN"
                m_ctl.create_sensor_manifold(obj, "MAIN", m_ctl.CT_CONTINUOUS, [elapsed_sensor], null, main_cb);
               //console.log("CALL function main_cb");
            }
            else {
                return false;
            }
        }

    }

    //////////// Функция контроля движения шара
function main_cb(obj, id, torque_local0, torque_local2) {
        try {

            if (move) {
                var m_vec3 = b4w.vec3;
                var _vec3_tmp = m_vec3.create();

                // Проверяем положение объекта
                var translation = m_trans.get_translation(obj, _vec3_tmp);
                var nameOb = m_scenes.get_object_name(obj);

                if (translation[1] < -13.0) {

                   //console.log("Error 1");
                    if (_zvuk) 
                        stopRunBallSound();
                    show_X_WithSound();
                    _Break = true;
                    X_anim(obj);
                    move = false;
                    move_2 = false;
                    _selected_obj = m_scenes.get_object_by_name("Empty");

                }
                if (translation[1] >= -10.0 && translation[1] < -8.0) {
                    move_2 = true;
                }
               //console.log("move_2=" + move_2);
                if (move_2) {
                    if (nameOb == "Bowling Ball09" && move_2 == true) {
                        if (translation[0] > 1.0) {
                            m_phy.apply_velocity_world(obj, 0.0-3.0, 15.0, 0.0);
                            m_phy.apply_force_world(obj, 0.0-3.0, 15.0, 0.0);
                            m_phy.apply_torque(obj, -torque_local0, -10, torque_local2);
                        }
                        if (translation[0] < -1.0) {
                            m_phy.apply_velocity_world(obj, 0.0 + 3.0, 15.0, 0.0);
                            m_phy.apply_force_world(obj, 0.0 + 3.0, 15.0, 0.0);
                            m_phy.apply_torque(obj, -torque_local0, 10, torque_local2);
                        }
                    }
                    if (translation[1] > 20.0 && move_2 == true) {
                        if (all_shar[2] == true) {
                            var krut = 0.0;
                            if (all_shar[3] == true && all_shar[4] == false)
                                krut = 1.5;
                            if (all_shar[4] == true)
                                krut = 3.0;
                            if (all_shar[1] == true && all_shar[0] == false)
                                krut = -1.5;
                            if (all_shar[0] == true)
                                krut = -3.0;
                            m_phy.apply_velocity_world(obj, krut, 15.0, 0.0);
                            m_phy.apply_force_world(obj, 150.0, 15.0, 0.0);
                        }
                    }

                    // Если шар укатился за конец дорожки
                    if (translation[1] > 27.0 && move_2 == true) {
                        //console.log("Posle Error-if (translation[1]");
                        if (_zvuk) {
                            stopRunBallSound();
                            playKegliSound();
                        }

                        _Break = false;
                        /*var my_camera = m_scenes.get_object_by_name("Camera");
                        m_const.remove(my_camera);
                        m_phy.disable_simulation(my_camera);
                        m_trans.set_translation(my_camera, 0.0, 16.2, 1.0);*/

                        // Запускаем процесс подсчета
                        first_anim(obj, id, translation);
                        move = false;
                        move_2 = false;
                        _selected_obj = m_scenes.get_object_by_name("Empty");

                    }
                  

                } else {
                    if (translation[1] > 0.0) {
                        //console.log("Error 2 translation[1]"+translation[1]);
                        if (_zvuk) 
                            stopRunBallSound();

                    /*    foule();
                    }
                    function foule() {*/
                        _Break = false;//?????
                        NumBroska_Player -= 1;
                        m_phy.disable_simulation(obj);
                        m_trans.set_translation(obj, 0.0, -11.0, -0.675);
                        m_trans.set_rotation_euler(obj, 0, 0, 0);
                        _selected_obj = m_scenes.get_object_by_name("Empty");
                        _first_Click = true;
                        _enable_click = false;
                        move = false;
                        move_2 = false;
                        /*var my_camera = m_scenes.get_object_by_name("Camera");
                        m_const.remove(my_camera);
                        m_phy.disable_simulation(my_camera);
                        m_trans.set_translation(my_camera, 0.0, -16.2, 1.0);*/
                        /*var my_camera = m_scenes.get_object_by_name("Camera");
                        m_anim.animate_translation(my_camera, [0.0, -16.2, 1.0], 1.0, m_anim.AB_INOUT);*/
                    }
                }
            }
        } catch (e) {
           console.error("Error catch in main_cb:", e);
        }
    }
    // Фол
    function X_anim(obj) {//obj, id, translation) {
        m_phy.apply_velocity_world(obj, 0.0, 0.0, 0.0);
        m_phy.apply_torque(obj, 0.0, 0.0, 0.0);
        m_phy.apply_force_world(obj, 0.0, 0.0, 0.0);
        m_phy.set_angular_velocity(obj, 0.0, 0.0, 0.0);
        camera_onPlace();
        // Установить объект пинспоттера и применить анимацию
        var pin_change = m_scenes.get_object_by_name("Change_Pin");

        // Применить анимацию "Pin_Down"
        m_anim.apply(pin_change, "Pin_Down", m_anim.SLOT_0);

        // Задать начальный кадр
        m_anim.set_frame(pin_change, 1);
        m_anim.play(pin_change);

        own_countPinPad = 0;
        thru_count(own_countPinPad);
       //console.log("X_anim11 FrameTrue=" + FrameTrue + " NumBroska_Player=" + NumBroska_Player);
        if (NumBroska_Player % 2 == 0) {
            // pins_OnPlace();
           //console.log("X_anim22 FrameTrue=" + FrameTrue);
            if (FrameTrue != 11)
                pins_OnPlace();
        if(EndGame)
            for (var i = 0; i < 5; i++) {
                var bal = m_scenes.get_object_by_name(all_bowl[i]);
                m_phy.disable_simulation(bal);
                m_trans.set_translation_v(bal, pos_all_hide_bowl);
                m_scenes.hide_object(bal);
                not_select = false;
            }
        //else if (FrameTrue == 11 && own_countPinPad == 10)
        //    pins_OnPlace();
        }

    }
// Функция спуска пинспоттера в самом начале или конце, или подъема в начале игры
function _begin_first_anim(s_tart, e_nd) {
    // Установить объект пинспоттера и применить анимацию
    var pin_change = m_scenes.get_object_by_name("Change_Pin");

    // Применить анимацию "Pin_Down"
    m_anim.apply(pin_change, "Pin_Down", m_anim.SLOT_0);

    // Задать начальный кадр
    m_anim.set_frame(pin_change, s_tart);
    // Воспроизвести анимацию с ограничением диапазона кадров
    function play_animation_with_range(obj_pin, start_frame, end_frame) {
        // Задать начальный кадр
        m_anim.set_frame(obj_pin, start_frame);
        m_anim.play(obj_pin);

        var check_frame = function () {
            var current_frame = m_anim.get_frame(obj_pin);
            if (current_frame > end_frame) {
                m_anim.stop(obj_pin);
                pins_OnPlace();

            } else {
                requestAnimationFrame(check_frame);
            }
        };
        check_frame();
    }

    play_animation_with_range(pin_change, s_tart, e_nd);
}
/*
    setTimeout(() => {
        tooltip.classList.remove("show");
    }, 2000);
        var interval = setInterval(function () {
        if (EndGame == true && _Final==false) {
            count += 1;
            if (count % 2 == 0)
                m_scenes.hide_object(obG);
            else
                m_scenes.show_object(obG);
        }
        else
            clearInterval(interval);
    }, 300);
  */
function wait_time(t) {
    //var Time_Wait = t;
    var interval = setInterval(function () {
        if (Time_Wait) {
            var elem = document.getElementById("wait");
            if (elem)
                elem.style.display = 'block';
        }
        else {
            var elem = document.getElementById("wait");
            if (elem)
                elem.style.display = 'none';
            clearInterval(interval);
        }
            
    }, 300);
}
    /*setTimeout(() => {
        var elem = document.getElementById("wait");
        if (elem)
            elem.style.display = 'block'; 
    }, 3000);*/

//////////// Функция спуска пинспоттера    
function first_anim(obj, id, translation) {
    // Остановить движение шара
    m_phy.apply_velocity_world(obj, 0.0, 0.0, 0.0);
    m_phy.apply_torque(obj, 0.0, 0.0, 0.0);
    m_phy.apply_force_world(obj, 0.0, 0.0, 0.0);
    m_phy.set_angular_velocity(obj, 0.0, 0.0, 0.0);

    // Установить объект пинспоттера и применить анимацию
    var pin_change = m_scenes.get_object_by_name("Change_Pin");

    // Применить анимацию "Pin_Down"
    m_anim.apply(pin_change, "Pin_Down", m_anim.SLOT_0);

    // Задать начальный кадр
    m_anim.set_frame(pin_change, 1);

    // Воспроизвести анимацию с ограничением диапазона кадров
    function play_animation_with_range(obj_pin, start_frame, end_frame) {
        m_anim.set_frame(obj_pin, start_frame);
        m_anim.play(obj_pin);

        var check_frame = function () {
            var current_frame = m_anim.get_frame(obj_pin);
            if (current_frame > end_frame) {
                m_anim.stop(obj_pin);
                //m_anim.set_frame(obj_pin, start_frame); // Возврат к началу диапазона (опционально)
                // Очистим все предыдущие значения
                m_pins_onPlos = [];
                Time_Wait = true;
                wait_time(0);
                // Вызываем функцию подсчета упавших кеглей
                var result = countPinPad(obj, id);
                //console.log("result=" + result);

            } else {
                requestAnimationFrame(check_frame);
            }
        };
        check_frame();
    }

    play_animation_with_range(pin_change, 1, 30);

}

    ///////// Функция подсчета всех упавших, с переходом в second_anim
    function countPinPad(obj, id) {
        var count = 0; // Сбито, НЕ оставшихся на столе
        var rng = 0;
        var cnt = 0; // Сбито, оставшихся на столе

        // Очищаем массивы
        // numDownPins = [];
        // m_pins_onPlos = [];

        if (rng == 0) {
            for (var step = 1; step < 11; step++) {
                var pin_name = "Pin" + step;
                //console.log(pin_name);

                var _pin1 = m_scenes.get_object_by_name(pin_name);
                var m_vec3 = b4w.vec3;
                var _vec3_tmp = m_vec3.create();
                var translation = m_trans.get_translation(_pin1, _vec3_tmp);

                //console.log("Координаты кегли:", translation);

                if (
                    translation[2] <= -1.06502 ||
                    translation[2] > 0.8 ||
                    translation[1] >= 25.4 ||
                    translation[0] >= 1.725 ||
                    translation[0] <= -1.725
                ) {
                    count++;
                    numDownPins.push(step);
                   //console.log("Кегля НЕ на столе:", step);
                } else {
                    m_pins_onPlos.push(step);
                   //console.log("Кегля на столе:", step);
                }

                if (step == 10) {
                    rng = 1;
                }
            }
        }

        if (rng == 1) {
           //console.log("Начинаем отслеживать кегли на столе:", m_pins_onPlos);

            monitorPins(m_pins_onPlos, function (result) {
               //console.log("Все кегли остановились. Количество упавших кеглей:", result);
                count += result;
                rng = 2;
               //console.log("Общее количество упавших кеглей:", count);
                second_anim(count, numDownPins, m_pins_onPlos);//second_anim(count); // Продолжение после завершения: 
            });
        }
    }


    /////// НОВАЯ Функция подсчета упавших,но оставшихся на столе
    function monitorPins(onPlos, callback) {
        var threshold = 0.005; // Порог для определения остановки
        var m_vec3 = b4w.vec3;
        var m_trans = b4w.transform;//require("transform");
        var m_quat = b4w.quat;//require("quat");

        var allStopped = Array(onPlos.length).fill(false); // Булев массив для отслеживания состояния
        //var numDownPins = []; // Массив для хранения упавших кеглей
        var count = 0; // Количество упавших кеглей

        function checkPins() {
            var allAreStopped = true;

            for (var i = 0; i < onPlos.length; i++) {
                var pinName = "Pin" + onPlos[i];
                var pin = m_scenes.get_object_by_name(pinName);

                if (!pin) {
                   //console.warn("Объект не найден:", pinName);
                    continue;
                }

                // Проверяем скорость для определения остановки
                var currPos = m_trans.get_translation(pin, m_vec3.create());
                var currQuat = m_trans.get_rotation(pin, m_quat.create());
                var velocities = calculate_velocities(pinName, currPos, currQuat);
                var linearSpeed = m_vec3.length(velocities.linear_velocity);
                var angularSpeed = m_vec3.length(velocities.angular_velocity);

                // Если объект остановился
                //if (linearSpeed <= threshold && angularSpeed <= threshold) {
                if (angularSpeed <= threshold) {
                    allStopped[i] = true;
                } else {
                    allStopped[i] = false;
                    allAreStopped = false; // Если хотя бы одна кегля движется, ставим флаг
                }

                // Проверяем наклон кегли, если она остановилась
                if (allStopped[i]) {
                    var eulerAngles = m_trans.get_rotation_euler(pin, m_vec3.create());
                    if ((Math.abs(eulerAngles[0]) > 0.2 || Math.abs(eulerAngles[1]) > 0.2)) {
                        if (!numDownPins.includes(onPlos[i])) {
                            numDownPins.push(onPlos[i]);
                            count++;
                        }
                    }
                }
            }

            // Если все объекты остановились, вызываем callback
            if (allAreStopped) {
               //console.log("Все кегли остановились. Упавшие кегли:", count);
                callback(count); // Возвращаем результат через callback
            } else {
                // Продолжаем проверку на следующем кадре
                requestAnimationFrame(checkPins);
            }
        }

        // Запуск проверки
        checkPins();
    }

    function sum(arr) {
        var result = 0, n = arr.length || 0; //may use >>> 0 to ensure length is Uint32
        while (n--) {
            result += +arr[n]; // unary operator to ensure ToNumber conversion
        }
        return result;
    }

    function frame_Not_10(i, frame_score, CountPins, NumberThrow, NumFrame) {
        //# Если в текущем фрейме Страйк                        
        if (CountPins[i][1] == 10 && NumberThrow[i][1] == 1) { //:# len(CountPins[i]) == 2:
            //#print("Yes Strike")
            //#print("CountPins=", CountPins)
            frame_score = 10;  //# За страйк даем сразу 10 очков

            //# Проверяем следующие два броска для бонуса за страйк
            if (i + 1 < 10) {//: # сл.фрейм НО НЕ 10й                
                //# Если следующий фрейм тоже страйк
                if (CountPins[i + 1][1] == 10 && NumberThrow[i + 1][1] == 1) {
                    frame_score += 10; // # За сл.страйк добавляем 10 очков

                    if (i + 2 < 10) { // # сл.фрейм ЧЕРЕЗ фрейм  НО НЕ 10й

                        //# Если следующий ЧЕРЕЗ фрейм тоже страйк
                        if (CountPins[i + 2][1] == 10 && NumberThrow[i + 2][1] == 1) {
                            //#print("[i+2][0]CountPins")
                            //# Добавим значение 2го броска(10)
                            frame_score += CountPins[i + 2][1];
                        } else {
                            //# Если следующий ЧЕРЕЗ фрейм НЕ страйк
                            if (CountPins[i + 2][0] != 0) {
                                //# Добавим значение 1го броска
                                frame_score += CountPins[i + 2][0];
                            }

                        }

                    }
                }
                else {
                    //## Если следующий фрейм НЕ страйк
                    //#print("2 broska=", sum(CountPins[i + 1][: 2]))
                    //# Берем оба броска следующего фрейма
                    frame_score += (CountPins[i + 1][0] + CountPins[i + 1][1]);
                }

            }
        }
        //# Если в текущем фрейме Спэа
        else {
            if (sum(CountPins[i]) == 10 && NumberThrow[i][1] == 2) {//:#len(CountPins[i]) == 2:
                frame_score = 10; //  # За Спэа даем 10 очков

                if (i + 1 < 10) {//: # сл.фрейм НО НЕ 10й
                    if (NumberThrow[i + 1][0] != 0)//# Добавляем первый бросок следующего фрейма

                        frame_score += CountPins[i + 1][0];

                    if (NumberThrow[i + 1][0] == 0)//# Добавляем второй бросок следующего фрейма

                        frame_score += CountPins[i + 1][1];
                }
            }
        }
        return frame_score
    }// End function frame_Not_10

    function calculate_score(CountPins, NumberThrow, NumFrame) {
        var total_score = 0;
        var frame_scores = []; //  # Для хранения очков по каждому фрейму
       //console.log("CountPins=" + CountPins);
        if (NumFrame != 11) {
            //# Проход по каждому фрейму
            for (var i = 0; i < NumFrame; i++) {
                //# Считаем текущий фрейм как сумму сбитых кеглей
                var frame_score = sum(CountPins[i]);
               //console.log("NumFrame=" + NumFrame + " frame_score=" + frame_score);
                //# Пересчитываем текущий фрейм с учетом след.фреймов
                frame_score = frame_Not_10(i, frame_score, CountPins, NumberThrow, NumFrame);
                //# Добавляем текущий фрейм к общему счету
                total_score += frame_score;
                frame_scores.push(frame_score);
               //console.log("frame_scores=" + frame_scores + "  total_score=" + total_score);
            }
        }
        if (NumFrame == 11) {
            //# Проход по каждому фрейму
            for (var i = 0; i < NumFrame; i++) {
                //# Считаем текущий фрейм как сумму сбитых кеглей
                frame_score = sum(CountPins[i]);
                if (i < 9) { //# Если Это не 10й фрейм
                    //# Пересчитываем текущий фрейм с учетом след.фреймов
                    frame_score = frame_Not_10(i, frame_score, CountPins, NumberThrow, NumFrame);
                }
                if (i == 10) {//: # Если Это 10й фрейм
                    frame_score -= sum(CountPins[i]);
                    frame_score += CountPins[i][0];
                }
                //# Добавляем текущий фрейм к общему счету
                total_score += frame_score;
                frame_scores.push(frame_score);
            }
        }

        return { total_score: total_score, frame_scores: frame_scores };
    }// End function calculate_score

    function Summa(NumFrame, Place, count, NumBroska) {
       //console.log("My v function Summa  NumFrame=" + NumFrame);

        if (count != null) {
            var NB = 0;
            if (NumBroska % 2 == 0) {
                NB = 1;
            }
            else {
                NB = 0;
            }
            if (NB == 1) {
                if (NumFrame < 10)//#Если это не 10й фрейм
                    if (count == 10 && Game[NumFrame - 1][NB - 1] != 0)
                        count = count - Game[NumFrame - 1][NB - 1];
                if (NumFrame == 10 && Game[NumFrame - 1][NB - 1] != 0 && Game[NumFrame - 1][NB - 1] != 10)
                    if (count == 10)
                        count = count - Game[NumFrame - 1][NB - 1];
                //Game[NumFrame - 1][NB] = count;
            }
            if (NumFrame == 11)
                if (CountSecond10 != 0)
                    count = count - CountSecond10;
            if (count <= 0)
                count = 0;

            Game[NumFrame - 1][NB] = count;// ?????? bylo Game[NumFrame - 1][NB] = count;
            _Place[NumFrame - 1][NB] = Place;// ????? bylo _Place[NumFrame - 1][NB] = Place;           

           //console.log("NB=" + NB + " count=" + count);
           //console.log("NumFrame-1=" + (NumFrame - 1));// + " Game=" + Game[NumFrame - 1][NB - 1]);
           //console.log(Game.join("\n") + "\n\n");
            if (NumFrame != 11) {  //#Если это не последний фрейм
                if (NB == 1) {  //#Если Второй бросок  CountPins, NumberThrow, od.Player_NumFrame
                    var all = calculate_score(Game, _Place, NumFrame);
                    //console.log("all=" + all);

                   //console.log("Total Score:", all.total_score);
                   //console.log("Frame Scores:", all.frame_scores);

                    for (var i = 0; i < NumFrame; i++)
                        Schet_0[i + 1] = all.frame_scores[i];//all[1][i];

                    Total = all.total_score;//all[0]; //#str(all[0])
                    if (TextVisualClasic) {
                        for (var i = 1; i < NumFrame; i++)
                            Schet_0[i + 1] = Schet_0[i + 1] + Schet_0[i];
                    }


                    //console.log("all=" + all);
                   //console.log("NumFrame != 11 od.Schet_0=" + Schet_0);
                    //bge.logic.sendMessage("result",str(NumFrame))
                }
            }

            if (NumFrame == 11) {//#Если это последний фрейм
               //console.log("NumFrame == 11");
                if (NB == 0) {  //#Если Первый бросок
                   //console.log("NumFrame == 11 Если Первый бросок");
                    all = calculate_score(Game, _Place, NumFrame);
                    for (var i = 0; i < NumFrame; i++) {
                        Schet_0[i + 1] = all.frame_scores[i];
                       //console.log("all.frame_scores[" + i + "]= " + all.frame_scores[i]);
                    }
                    if (Schet_0.length == 12) {
                        Schet_0[10] += Schet_0[11];
                    }
                        
                    Total = all.total_score;
                   //console.log("NumFrame == 11 Total= " + Total);
                    if (TextVisualClasic) {
                        for (var i = 1; i < NumFrame; i++)
                            Schet_0[i + 1] = Schet_0[i + 1] + Schet_0[i];
                    }
                   //console.log(" 11 od.Schet_0=" + Schet_0);
                    //bge.logic.sendMessage("result", str(NumFrame - 1)) 
                }
            }
        }
        else {
           //console.log("XXXXXXXXXXXXXXXXXXXXXXXX    count = None");
        }
    } // End function Summa
    ///////////////////////////////////////////

    // Все считаем и выводим на монитор
    function thru_count(own_countPinPad) {
        function set_txt(num) {
            if (num <= 0) {
                console.log("Error set_txt:num= " + num);
                return;
            }
            if (num == "X" || num == "Slash") {
                if (_zvuk)
                    playStrikeSound(num);
                else
                    show_Strike(num);
            }


            var TxPosFirst01 = 1.80706;
            TxName += 1;
            var obname = "Orig" + num;
           //console.log("obname=" + obname);
            var ob = m_scenes.get_object_by_name(obname);
            //var rot = m_trans.get_rotation_euler(ob, new Float32Array(3));
            var ob_copy = m_obj.copy(ob, "Tx" + TxName, true);
            //var ob_copy = m_obj.copy(ob, "Tx" + Player_NumFrame + Player_PlaceInFrame, true);
            m_scenes.append_object(ob_copy);
           //console.log("ob_copy=" + ob_copy);
            var copy_name = m_scenes.get_object_name(ob_copy);
           //console.log("copy_name=" + copy_name);
            //m_phy.disable_simulation(ob_copy); 1.84663
            //m_trans.set_translation(ob_copy, 1.84763 + (NumBroska_Player - 1) * 0.098, -11.10742, 0.72512);
            m_trans.set_translation(ob_copy, TxPosFirst01 + (NumBroska_Player - 1) * 0.10367, -11.10742, 0.72512);
            own_dobavka = 0;
            //m_trans.set_rotation_euler(ob_copy, rot[0], rot[1], rot[2]);
            //m_obj.remove_object(ob_copy);
        }
        function _9() {
            //# Если это Страйк(выбито 10 при первом броске Фрейма)
            if (Player_PlaceInFrame == 1) {

                //bge.logic.sendMessage("strike")
                //print("+++++++++++++++++++++++strike")
                //#print("pred od.NumBroska_Player=", od.NumBroska_Player)
                if (own_dobavka == 0) {
                    NumBroska_Player += 1; //# добавим кол.бросков
                    own_dobavka = 1;
                    set_txt("X");
                    //#print("POSLE od.NumBroska_Player=", od.NumBroska_Player)
                }

            }
            //# Если это Спаэр(выбито 10 при втором броске Фрейма)
            if (Player_PlaceInFrame == 2)
                set_txt("Slash");
            //bge.logic.sendMessage("spare")
        }
        function _10_1() {
            //print("def _10_1(ob)")
            //# Если это Страйк(выбито 10 при первом броске Фрейма)
            if (Player_PlaceInFrame == 1) {
                set_txt("X");
                //bge.logic.sendMessage("strike")
                CountFirst = 10;
                LastShot = true;
                var obL = m_scenes.get_object_by_name("Over_10_Frame");
                m_scenes.hide_object(obL);
            }

        }


        function _10_2(ob) {
            //print("def _10_2(ob)")
            //# Если это Спаэр(выбито 10 при втором броске Фрейма)
            if (Player_PlaceInFrame == 2) {
                if (CountFirst == 10)
                    set_txt("X");
                //bge.logic.sendMessage("strike")
                if (CountFirst != 10) {
                    set_txt("Slash");
                    //bge.logic.sendMessage("spare")
                    LastShot = true;
                    var obL = m_scenes.get_object_by_name("Over_10_Frame");
                    m_scenes.hide_object(obL);
                }

            }

        }

        function _11() {
            //# Если это Страйк(выбито 10)
            if (CountSecond10 == 0)
                set_txt("X");
            else {
                var ra_zn = own_countPinPad - CountSecond10;
                set_txt(ra_zn);
            }
        }



        function _9_10_first() {
            CountFirst = own_countPinPad;
            //# Если это 1й бросок фрейма
            if (own_countPinPad != 0) {
                set_txt(own_countPinPad);
            }
            else {
                if (_Break == false)
                    //console.log("Break == False");
                    set_txt("Tire");
                if (_Break == true)
                    //console.log("Break == true");
                    set_txt("F");
            }
        }
        function _9_10_second_11() {
            //if (ob) {
            if (own_countPinPad > 0) {
                //var obname = m_obj.copy(ob, "Tx" + Player_NumFrame + Player_PlaceInFrame, true);
                //console.log("obname=" + obname);
                //console.log("own_countPinPad=" + own_countPinPad);
                set_txt(own_countPinPad);
                //ob[0].text = str(self.own['countPinPad'])
            }


            else {
                if (_Break == false)
                    //console.log("Break == False");
                    set_txt("Tire");
                if (_Break == true)
                    //console.log("Break == true");
                    set_txt("F");
            }

            // }

        }
        function _9_10_second_12() {
           //console.log("poslali Slash");
            set_txt("Slash");
        }

        function _9_10_second_2() {
            if (own_countPinPad != 0)
                set_txt(own_countPinPad);
            else {
                if (_Break == false)
                    set_txt("Tire");
                if (_Break == true)
                    set_txt("F");
            }
            CountSecond10 = own_countPinPad;
        }

        function _9_10_second_3() {
            if (own_countPinPad != 0)
                set_txt(own_countPinPad);
            else {
                if (_Break == false)
                    set_txt("Tire");
                if (_Break == true)
                    set_txt("F");
            }
            CountSecond10 = 0;
        }

        if (own_countPinPad == 10) {
            if (FrameTrue < 10) //# Frames до 10го
                _9();
            if (FrameTrue == 10) {
                //numPlayer = int(str(od.Player_NumFrame) + str(od.Player_PlaceInFrame))
                //ob = [i for i in self.scena.objects if i.name == 'TxBowSchet' and i['NumTx'] == numPlayer]
                //if ob[0]:
                if (Player_PlaceInFrame == 1)
                    _10_1();
                if (Player_PlaceInFrame == 2)
                    _10_2();
            }

            if (FrameTrue == 11)
                //    numPlayer = int(str(od.Player_NumFrame) + str(od.Player_PlaceInFrame))
                //ob = [i for i in self.scena.objects if i.name == 'TxBowSchet' and i['NumTx'] == numPlayer]
                //if ob[0]:
                _11();
        }


        //# Если выбито меньше 10 кеглей
        if (own_countPinPad != 10) {

            if (FrameTrue != 11) {

                //# Если это 1й бросок фрейма
                if (Player_PlaceInFrame == 1)
                    _9_10_first();

                // # Если это 2й бросок фрейма
                if (Player_PlaceInFrame == 2) {
                    //numPlayer = int(str(od.Player_NumFrame) + str(od.Player_PlaceInFrame))
                    //ob = [i for i in self.scena.objects if i.name == 'TxBowSchet' and i['NumTx'] == numPlayer]
                    if (FrameTrue < 10) {
                       //console.log("own_countPinPad=" + own_countPinPad);
                       //console.log("CountFirst=" + CountFirst);
                        own_countPinPad -= CountFirst;

                        if ((own_countPinPad + CountFirst) < 10) 
                            _9_10_second_11();
                        if ((own_countPinPad + CountFirst) == 10)
                            _9_10_second_12();

                    }


                    if (FrameTrue == 10) {
                        if (CountFirst == 10)
                            _9_10_second_2();


                        if (CountFirst != 10) {
                            if (own_countPinPad!=0)
                                own_countPinPad -= CountFirst;
                            //# Если в сумме за 2 броска выбито меньше 10
                            _9_10_second_3();
                        }

                    }

                }
            }//////

            if (FrameTrue == 11) {
                if (own_countPinPad != 0) {
                    if (CountSecond10 == 0) {
                        set_txt(own_countPinPad);
                    }
                    else {
                       //console.log("if (FrameTrue == 11) own_countPinPad=" + own_countPinPad);
                       //console.log("if (FrameTrue == 11) CountSecond10=" + CountSecond10);
                        var T11 = own_countPinPad - CountSecond10;
                        if (T11 <= 0)
                            T11 = "Tire";
                        set_txt(T11);
                    }
                }
                else {
                    if (_Break == false)
                        set_txt("Tire");
                    if (_Break == true)
                        set_txt("F");
                }
            }
        }
        function _total_count(tt) {

            for (var j = 0; j < tTol + 1; j++) {
                var _newT = "TxTotal" + j;

                if (m_scenes.check_object_by_name(_newT, 0)) {
                    var lastob = m_scenes.get_object_by_name(_newT);
                    m_scenes.remove_object(lastob);
                    //m_scenes.hide_object(lastob);
                }
            }

            function _tx_total_count(kol, _L, _C, _R ) {
                var posFr = 2.63;
                function _input_frame_L_txt(kol, _L, _C, _R) {
                    var obname = "OrNew" + _L;
                    var ob = m_scenes.get_object_by_name(obname);
                    var ob_copy = m_obj.copy(ob, "TxTotal" + tTol, true);
                    m_scenes.append_object(ob_copy);
                    m_trans.set_translation(ob_copy, posFr, -11.29191, 0.153);
                    tTol += 1;
                }
                function _input_frame_C_txt(kol, _L, _C, _R) {
                    var obname = "OrNew" + _C;
                    var ob = m_scenes.get_object_by_name(obname);
                    var ob_copy = m_obj.copy(ob, "TxTotal" + tTol, true);
                    m_scenes.append_object(ob_copy);
                    m_trans.set_translation(ob_copy, posFr + 0.05228, -11.29191, 0.153);
                    tTol += 1;
                }
                function _input_frame_R_txt(kol, _L, _C, _R) {
                    var obname = "OrNew" + _R;
                    var ob = m_scenes.get_object_by_name(obname);
                    var ob_copy = m_obj.copy(ob, "TxTotal" + tTol, true);
                    m_scenes.append_object(ob_copy);
                    m_trans.set_translation(ob_copy, posFr + 0.10367, -11.29191, 0.153);
                    tTol += 1;
                }
                if (kol == 1 && _C == -1 && _R == -1) {

                    _input_frame_L_txt(kol, _L, _C, _R);

                } else if (kol == 2 && _R == -1) {

                    _input_frame_L_txt(kol, _L, _C, _R);

                    _input_frame_C_txt(kol, _L, _C, _R);

                } else {
                    _input_frame_L_txt(kol, _L, _C, _R);
                    _input_frame_C_txt(kol, _L, _C, _R);
                    _input_frame_R_txt(kol, _L, _C, _R);
                }
            }
            var cislo = tt;
           //console.log("cislo = " + cislo);
            if (cislo < 10) {
                // Число из одного разряда
                var _first = cislo;
               //console.log("_first = " + _first);
                _tx_total_count(1, _first, -1, -1);

            } else if (cislo < 100) {
                // Число из двух разрядов
                var _second = cislo % 10; // единицы
                var _first = Math.floor(cislo / 10); // десятки
               //console.log("_first = " + _first + ", _second = " + _second);
                _tx_total_count(2, _first, _second, -1);
            } else {
                // Число из трех разрядов
                var _third = cislo % 10; // единицы
                var _second = Math.floor((cislo % 100) / 10); // десятки
                var _first = Math.floor(cislo / 100); // сотни
               //console.log("_first = " + _first + ", _second = " + _second + ", _thrd = " + _third);
                _tx_total_count(3, _first, _second, _third);
            }
        }
        function _every_frame_count() {
            //const posTot = 1.84584;
            if (TxFrame != 0) {
                for (var j = 1; j < TxFrame + 1; j++) {
                    var _new = "TxT" + j;

                    if (m_scenes.check_object_by_name(_new, 0)) {
                        var lastob = m_scenes.get_object_by_name(_new);
                        m_scenes.remove_object(lastob);
                        //m_scenes.hide_object(lastob);
                    }
                }
            }
            function _tx_frame_count(kol, _L, _C, _R, num) {
                var posFr = 1.84811;
                function _input_frame_C_txt(kol, _L, _C, _R, num, TxFr) {
                    var obname = "OrNew" + _C;
                    var ob = m_scenes.get_object_by_name(obname);
                    var ob_copy = m_obj.copy(ob, "TxT" + TxFr, true);
                    m_scenes.append_object(ob_copy);
                    //console.log("ob_copy=" + ob_copy);
                    //var copy_name = m_scenes.get_object_name(ob_copy);
                    //console.log("copy_name=" + copy_name);
                    m_trans.set_translation(ob_copy, posFr + num * (0.10367 * 2), -11.1504, 0.575279);
                }
                function _input_frame_L_txt(kol, _L, _C, _R, num, TxFr, mnoz) {
                    var obname = "OrNew" + _L;
                    var ob = m_scenes.get_object_by_name(obname);
                    var ob_copy = m_obj.copy(ob, "TxT" + TxFr, true);
                    m_scenes.append_object(ob_copy);
                    //console.log("ob_copy=" + ob_copy);
                    //var copy_name = m_scenes.get_object_name(ob_copy);
                    //console.log("copy_name=" + copy_name);
                    m_trans.set_translation(ob_copy, posFr + num * (0.10367 * 2) - (0.02614 * mnoz), -11.1504, 0.575279);
                }
                function _input_frame_R_txt(kol, _L, _C, _R, num, TxFr, mnoz) {
                    var obname = "OrNew" + _R;
                    var ob = m_scenes.get_object_by_name(obname);
                    var ob_copy = m_obj.copy(ob, "TxT" + TxFr, true);
                    m_scenes.append_object(ob_copy);
                    //console.log("ob_copy=" + ob_copy);
                    //var copy_name = m_scenes.get_object_name(ob_copy);
                    //console.log("copy_name=" + copy_name);
                    m_trans.set_translation(ob_copy, posFr + num * (0.10367 * 2) + (0.02614 * mnoz), -11.1504, 0.575279);
                }
                if (kol == 1 && _L == -1 && _R == -1) {

                    TxFrame += 1;
                    _input_frame_C_txt(kol, _L, _C, _R, num, TxFrame);

                } else if (kol == 2 && _C == -1) {
                    TxFrame += 1;
                    _input_frame_L_txt(kol, _L, _C, _R, num, TxFrame, 1);

                    TxFrame += 1;
                    _input_frame_R_txt(kol, _L, _C, _R, num, TxFrame, 1);

                } else {
                    TxFrame += 1;
                    _input_frame_C_txt(kol, _L, _C, _R, num, TxFrame);
                    TxFrame += 1;
                    _input_frame_L_txt(kol, _L, _C, _R, num, TxFrame, 2);
                    TxFrame += 1;
                    _input_frame_R_txt(kol, _L, _C, _R, num, TxFrame, 2);
                }
            }
            var sf = 1;
            if (FrameTrue == 11)
                sf = 0;
            for (var i = 1; i < FrameTrue+sf; i++) {
                var cislo = Schet_0[i];

                if (cislo < 10) {
                    // Число из одного разряда
                    var _centr = cislo;
                   //console.log("_centr = " + _centr);
                    _tx_frame_count(1, -1, _centr, -1, i - 1);

                } else if (cislo < 100) {
                    // Число из двух разрядов
                    var _right = cislo % 10; // единицы
                    var _left = Math.floor(cislo / 10); // десятки
                   //console.log("_left = " + _left + ", _right = " + _right);
                    _tx_frame_count(2, _left, -1, _right, i - 1);
                } else {
                    // Число из трех разрядов
                    var _right = cislo % 10; // единицы
                    var _centr = Math.floor((cislo % 100) / 10); // десятки
                    var _left = Math.floor(cislo / 100); // сотни
                   //console.log("_left = " + _left + ", _centr = " + _centr + ", _right = " + _right);
                    _tx_frame_count(3, _left, _centr, _right, i - 1);
                }
            }
        }
//##### 11 #####
        if (FrameTrue == 11) {
           //console.log("if (FrameTrue == 11) {");

            Summa(Player_NumFrame, Player_PlaceInFrame, own_countPinPad, NumBroska_Player);
            _every_frame_count();
            _total_count(Total);
            EndGame = true;
            //console.log("EndGame = true  bge.logic.sendMessage(hole, str(self.own['countPinPad']))");
            var elem = document.getElementById("load-1");
            //console.log("document.getElementById");
            if (EndGame && GameBegin) { // Возвращаем старое изображение
                //elem.style.backgroundImage = "url('./assets/Balls/New RND.png')";
                elem.textContent = "New round";
                elem.style.backgroundColor = "#2a2a2a";
                GameBegin = false;
                _beginFinal();

            }
            _Break = false;
        }


        if (FrameTrue == 10) {
            //if (LastShot == false && NumBroska_Player % 2 == 0)
            //    EndGame = true;

            Summa(Player_NumFrame, Player_PlaceInFrame, own_countPinPad, NumBroska_Player);
            
            if (LastShot == true) {
                if (own_countPinPad == 10) {
                   //console.log("LastShot = true own_countPinPad = 10");
                    //pin_pos()
                    //Если это 1й бросок фрейма
                    if (NumBroska_Player % 2 != 0) {
                        _total_count(Total + own_countPinPad);
                       //console.log("bge.logic.sendMessage(hole, str(self.own['countPinPad']))");
                    }
                    //Если это 2й бросок фрейма
                    if (NumBroska_Player % 2 == 0) {
                        _every_frame_count();
                        _total_count(Total);
                        FrameTrue += 1;
                    }

                }
                if (own_countPinPad != 10) {
                    //Если это 2й бросок фрейма
                    if (NumBroska_Player % 2 == 0) {
                        _every_frame_count();
                        _total_count(Total);
                        FrameTrue += 1;
                    }
                }
            }
            if (LastShot == false) {
                //Если это 1й бросок фрейма
                if (NumBroska_Player % 2 != 0) {
                   //console.log("bge.logic.sendMessage(hole, str(self.own['countPinPad']))");
                    _total_count(Total+own_countPinPad);
                }
                //Если это 2й бросок фрейма
                if (NumBroska_Player % 2 == 0) {
                    _every_frame_count();
                    _total_count(Total);
                    EndGame = true;

                    //console.log("EndGame = true  bge.logic.sendMessage(hole, str(self.own['countPinPad']))");
                    var elem = document.getElementById("load-1");
                    //console.log("document.getElementById");
                    if (EndGame && GameBegin) { // Возвращаем старое изображение
                        //elem.style.backgroundImage = "url('./assets/Balls/New RND.png')";
                        elem.textContent = "New round";
                        elem.style.backgroundColor = "#2a2a2a";
                        GameBegin = false;
                        _beginFinal();

                    }

                }
            }
            _Break = false;

        }

        if (FrameTrue < 10) {

            Summa(Player_NumFrame, Player_PlaceInFrame, own_countPinPad, NumBroska_Player);
           //console.log("FrameTrue < 10 Total =" + Total + " NumBroska_Player =" + NumBroska_Player);
            if (NumBroska_Player < 3) {
                var obT = m_scenes.get_object_by_name("Total");
                m_scenes.show_object(obT);
            }
            //# Если это 1й бросок фрейма
            if (NumBroska_Player % 2 != 0) { //Schet_0
               //console.log("Schet_0.length=" + Schet_0.length);
               //console.log("Schet_0[FrameTrue]=" + Schet_0[FrameTrue - 1]);
                _total_count(Total + own_countPinPad);


                
            }
            //# Если это 2й бросок фрейма
            if (NumBroska_Player % 2 == 0) {
                _every_frame_count();
                _total_count(Total);
                FrameTrue += 1;
                CountFirst = 0;
                // Зеленая точка
                var TocPosFirst01 = 1.84584;
                var obt = m_scenes.get_object_by_name("OverFrame");//(FrameTrue - 1)

                if (FrameTrue < 10)
                    m_trans.set_translation(obt, TocPosFirst01 + (FrameTrue - 1) * 0.20735, -11.11572, 0.877849);
                if (FrameTrue == 10)
                    m_trans.set_translation(obt, 3.8, -11.11572, 0.877849);
            }
           //console.log("FrameTrue=" + FrameTrue);
           //console.log("Player_NumFrame=" + Player_NumFrame);

        }

    }

///////////////// Функция подъема пинспоттера
//function second_anim(obj, id, res_count) {
function second_anim(res_count, numDownPins, onPlos) {
    //console.log("res_count= " + res_count);

    // Установить объект и применить анимацию
    var pin_change = m_scenes.get_object_by_name("Change_Pin");

    // Применить анимацию "Pin_Down"
    m_anim.apply(pin_change, "Pin_Down", m_anim.SLOT_0);

    // Задать начальный кадр
    m_anim.set_frame(pin_change, 30);
    m_anim.play(pin_change);
    //res_count=second_check(count,numDownPins,m_pins_onPlos);
    for (var i = 0; i < onPlos.length; i++) {
        if (onPlos.includes(onPlos[i])) { // Если кегля среди оставшихся на столе
            var pin_name = 'Pin' + onPlos[i];//i;
            var _pin = m_scenes.get_object_by_name(pin_name);
            var eu = m_trans.get_rotation_euler(_pin, _vec3_tmp);
            if ((eu[0] > 0.8 || eu[0] < -0.8) || (eu[1] > 0.8 || eu[1] < -0.8)) {
                if (!numDownPins.includes(onPlos[i])) {
                    //console.log("if (!numDownPins");
                    numDownPins.push(onPlos[i]);
                    res_count++;
                }
            }
        }
    }
    own_countPinPad = res_count;
    //# Если подсчет упавших произведен
    if (own_countPinPad != null)
        thru_count(own_countPinPad);


    if (own_countPinPad != null && own_countPinPad != 10) {
        //console.log("res_count= " + own_countPinPad);
        if (Player_PlaceInFrame == 1)
            comeback_1(own_countPinPad);
        if (Player_PlaceInFrame == 2)
            //if(FrameTrue!=10)
            comeback_2();//(10);
        //else
        // camera_onPlace();
    }

    if (own_countPinPad != null && own_countPinPad == 10) {
        //console.log("res_count= " + own_countPinPad);
        comeback_2();//(own_countPinPad);
    }

}
///////////////////////////////////
    // Функция для расчета линейной и угловой скоростей
function calculate_velocities(pin_name, curr_pos, curr_quat) {
    var m_vec3 = b4w.vec3;
    var m_quat = b4w.quat;
    // Функция для извлечения оси и угла из кватерниона
    function getAxisAngle(quat) {
        var angle = 2 * Math.acos(quat[3]); // Кватернион обычно представлен как [x, y, z, w]
        var s = Math.sqrt(1 - quat[3] * quat[3]); // s = sin(angle/2)
        var axis = s < 0.001
            ? [1, 0, 0] // Если s близок к 0, ось по умолчанию [1, 0, 0]
            : [quat[0] / s, quat[1] / s, quat[2] / s]; // Нормализация оси
        return [axis, angle];
    }
    // Получаем предыдущие позиции и ориентации
    var prev_pos = prev_positions[pin_name];
    var prev_quat = prev_rotations[pin_name];

    // Рассчитываем линейную скорость (разница позиций)
    var linear_velocity = m_vec3.create();
    m_vec3.subtract(curr_pos, prev_pos, linear_velocity);

    // Рассчитываем угловую скорость (разница кватернионов)
    var delta_quat = m_quat.create();
    m_quat.invert(prev_quat, delta_quat);
    m_quat.multiply(delta_quat, curr_quat, delta_quat);

    // Преобразуем угловую скорость в "угловую скорость в радианах в секунду"
    //var axis = m_vec3.create();
    //var angle = m_quat.get_axis_angle(delta_quat, axis);
    //var { axis, angle } = getAxisAngle(delta_quat);
    var result = getAxisAngle(delta_quat);
    var axis = result[0];
    var angle = result[1];
    var angular_velocity = m_vec3.scale(axis, angle, m_vec3.create());

    // Сохраняем текущие данные для следующего кадра
    prev_positions[pin_name] = curr_pos.slice();
    prev_rotations[pin_name] = curr_quat.slice();

    return {
        linear_velocity: linear_velocity,
        angular_velocity: angular_velocity,
    };
 }


/////////////  Это шар на место
function bowl_onPlace() {

    var obj = _moving_obj;//m_scenes.get_object_by_name("Bowl00");
    var m_vec3 = b4w.vec3;
    var _vec3_tmp = m_vec3.create();
    var translation = m_trans.get_translation(obj, _vec3_tmp);
    m_phy.disable_simulation(obj);

    _moving_obj = null;

    if (!EndGame) {
        var _name = m_scenes.get_object_name(obj);

        selectBall(_name, "Bowling BallAction");
        not_select = false;
    }
    else {
        //EndGame = true;
        for (var i = 0; i < 5; i++) {
            var bal = m_scenes.get_object_by_name(all_bowl[i]);
            m_phy.disable_simulation(bal);
            m_trans.set_translation_v(bal, pos_all_hide_bowl);
            m_scenes.hide_object(bal);
            not_select = false;
        }
    }


}
////////////  Это уже камеру на место
function camera_onPlace() {
    //wait_time(false);
    Time_Wait = false;
    /*var my_camera = m_scenes.get_object_by_name("Camera");
    m_const.remove(my_camera);
    m_phy.disable_simulation(my_camera);
    m_trans.set_translation(my_camera, 0.0, -16.2, 1.0);//-17.0245, 1.0);*/

    //m_phy.enable_simulation(my_camera);
    //m_phy.apply_velocity_world(my_camera, 0.0, 0.0, 0.0);
    //m_phy.apply_torque(my_camera, 0.0, 0.0, 0.0);
    /*var my_camera = m_scenes.get_object_by_name("Camera");
    m_anim.animate_translation(my_camera, [0.0, -16.2, 1.0], 1.0, m_anim.AB_INOUT);*/
    bowl_onPlace();
}

///////////////////// Упавших кеглей меньше 10   
function comeback_1(res_count) {
    //console.log("function comeback_1");
    for (var i = 1; i <= 10; i++) {
        if (numDownPins.includes(i)) { // Если кегля среди упавших
            var pin_name = 'Pin' + i;
            var _pin = m_scenes.get_object_by_name(pin_name);
            // Скроем упавшие
            m_scenes.hide_object(_pin);
            //playKegliSound();
        }
    }
    camera_onPlace();
}

////////////////////// Все 10 кеглей упали
function comeback_2() {//(res_count) {
    //console.log("function comeback_2");
    camera_onPlace();
    //console.log("FrameTrue= " + FrameTrue + "  countPinPad= " + own_countPinPad);
    //pins_OnPlace();
    if (FrameTrue != 11)
        pins_OnPlace();
    else if (FrameTrue == 11 && own_countPinPad == 10)
        pins_OnPlace();
}
//////////////  Возврат кеглей на место 
function pins_OnPlace() {
    for (var i = 1; i <= 10; i++) {
        //if (numDownPins.includes(i)) { // Если кегля среди упавших
        var pin_name = 'Pin' + i;
        var _pin = m_scenes.get_object_by_name(pin_name);
        m_scenes.show_object(_pin);
        m_phy.disable_simulation(_pin);
        m_trans.set_rotation_euler(_pin, 0, 0, 0);

        if (i == 1) {
            m_trans.set_translation_v(_pin, m_Pins_arr1[0], m_Pins_arr1[1], m_Pins_arr1[2]);
            off_moving(_pin);
        }
        if (i == 2) {
            m_trans.set_translation_v(_pin, m_Pins_arr2[0], m_Pins_arr2[1], m_Pins_arr2[2]);
            off_moving(_pin);
        }
        if (i == 3) {
            m_trans.set_translation_v(_pin, m_Pins_arr3[0], m_Pins_arr3[1], m_Pins_arr3[2]);
            off_moving(_pin);
        }
        if (i == 4) {
            m_trans.set_translation_v(_pin, m_Pins_arr4[0], m_Pins_arr4[1], m_Pins_arr4[2]);
            off_moving(_pin);
        }
        if (i == 5) {
            m_trans.set_translation_v(_pin, m_Pins_arr5[0], m_Pins_arr5[1], m_Pins_arr5[2]);
            off_moving(_pin);
        }
        if (i == 6) {
            m_trans.set_translation_v(_pin, m_Pins_arr6[0], m_Pins_arr6[1], m_Pins_arr6[2]);
            off_moving(_pin);
        }
        if (i == 7) {
            m_trans.set_translation_v(_pin, m_Pins_arr7[0], m_Pins_arr7[1], m_Pins_arr7[2]);
            off_moving(_pin);
        }
        if (i == 8) {
            m_trans.set_translation_v(_pin, m_Pins_arr8[0], m_Pins_arr8[1], m_Pins_arr8[2]);
            off_moving(_pin);
        }
        if (i == 9) {
            m_trans.set_translation_v(_pin, m_Pins_arr9[0], m_Pins_arr9[1], m_Pins_arr9[2]);
            off_moving(_pin);
        }
        if (i == 10) {
            m_trans.set_translation_v(_pin, m_Pins_arr10[0], m_Pins_arr10[1], m_Pins_arr10[2]);
            off_moving(_pin);
        }
        //}
    }
}

//////////////  Возврат физики
function off_moving(obj) {
    m_phy.enable_simulation(obj);
    m_phy.apply_velocity_world(obj, 0.0, 0.0, 0.0);
    m_phy.apply_torque(obj, 0.0, 0.0, 0.0);
    m_phy.apply_force_world(obj, 0.0, 0.0, 0.0);
    m_phy.set_angular_velocity(obj, 0.0, 0.0, 0.0);
}

// переключение звука
function perekl_zvuk(n) {
    var obZ1 = m_scenes.get_object_by_name("icon_sound");
    var obZ2 = m_scenes.get_object_by_name("icon_sound_inv");
    if (n == 1) {
        m_scenes.hide_object(obZ1);
        m_scenes.show_object(obZ2);
        _zvuk = false;
        if (zvk == 1)
            stopMusic01();
        if (zvk == 2)
            stopMusic02();
        if (zvk == 3)
            stopMusic03();
        n = 0;
    }
    if (n == 2) {
        m_scenes.hide_object(obZ2);
        m_scenes.show_object(obZ1);
        _zvuk = true;
        if (zvk == 1)
            playMusic01();
        if (zvk == 2)
            playMusic02();
        if (zvk == 3)
            playMusic03();
        n = 0;
    }
}
// Нажали мышь    
function main_canvas_down(e) {
    // если анимация шара закончилась
    if (!_enable_click) {
        // если нет движения шара
        if (!move) {
            //console.log("function main_canvas_down");
            if (e.preventDefault)// Блокируем прокрутку на мобилках
                e.preventDefault();

            //e.preventDefault();  // Блокируем прокрутку на мобилках
          
            // Получаем контейнер canvas
            var canvasContainer = document.getElementById("main_canvas_container");
            var rect = canvasContainer.getBoundingClientRect(); // Положение контейнера
            var x = m_mouse.get_coords_x(e) - rect.left;
            var y = m_mouse.get_coords_y(e) - rect.top;
            //console.log("x=" + x + "  y=" + y);
            var obj = m_scenes.pick_object(x, y);


            var obNew = m_scenes.get_object_name(obj);
            _obj_delta_xy = new Float32Array(2);
            //console.log("obNew=" + obNew);

            if (_selected_obj != obj) {
                _selected_obj = obj;
                // если шар уже стоит на позиции,и шар"взят",убираем видимость курсора и вкл._drag_mode
                if (_first_Click == true) {
                    _drag_mode = true;
                    document.documentElement.style.cursor = 'none';
                }
                //console.log("_first_Click=" + _first_Click);
            }

            // calculate delta in viewport coordinates
            if (_selected_obj) {
                var targ = m_scenes.get_object_name(_selected_obj);
                //console.log("targ=" + targ);
                // если нажали на эмблему звука не перечеркнутую
                if (targ == "icon_sound") {
                    //console.log("icon_sound");
                    // если звук вкл.(_zvuk=true)
                    if (_zvuk)
                        perekl_zvuk(1);//поменяем картинку на перечеркнутую
                }
                // если нажали на эмблему звука перечеркнутую
                if (targ == "icon_sound_inv") {
                    //console.log("icon_sound_inv");
                    // если звук выкл.(_zvuk=false)
                    if (!_zvuk)
                        perekl_zvuk(2);//поменяем картинку на НЕперечеркнутую
                }
                // если нажали на какой-либо шар
                if (targ != "icon_sound" && targ != "icon_sound_inv") {
                    var cam = m_scenes.get_active_camera();

                    var obj_parent = m_obj.get_parent(_selected_obj);
                    if (obj_parent && m_obj.is_armature(obj_parent))
                        // get translation from the parent (armature) of the animated object
                        m_trans.get_translation(obj_parent, _vec3_tmp);
                    else {
                        // выключ.физики шара
                        m_phy.disable_simulation(_selected_obj);
                        m_trans.get_translation(_selected_obj, _vec3_tmp);
                        m_trans.set_rotation_euler(_selected_obj, 0, 0, 0);

                        //если нажали на шар в подающем устройстве,ставим его на позицию
                        if (_first_Click == false) {
                            m_trans.set_translation(_selected_obj, 0.0, -11.0, -0.675);
                            _first_Click = true;// и вкл._first_Click = true
                        }

                    }
                    m_cam.project_point(cam, _vec3_tmp, _obj_delta_xy);

                    /*_obj_delta_xy[0] = x_norm - _obj_delta_xy[0];
                    _obj_delta_xy[1] = y_norm - _obj_delta_xy[1];*/

                    _obj_delta_xy[0] = x - _obj_delta_xy[0];
                    _obj_delta_xy[1] = y - _obj_delta_xy[1];
                    //console.log("_obj_delta_xy[0]=" + _obj_delta_xy[0]);
                    //console.log("_obj_delta_xy[1]=" + _obj_delta_xy[1]);
                }
            }
        }
    }
}

// Отпустили мышь 
function main_canvas_up(e) {
    //console.log("function main_canvas_up");
    e.preventDefault();  // Блокируем прокрутку на мобилках
    if (_selected_obj) {
        // выключаем _drag_mode
        _drag_mode = false;
        // никакой объект не выбран 
        _selected_obj = null;
        // enable camera controls after releasing the object
        if (!_enable_camera_controls) {
            m_app.enable_camera_controls();
            _enable_camera_controls = true;
        }
        //document.documentElement.style.cursor = 'pointer'; это ручка
        document.documentElement.style.cursor = 'default';

    }

}
function get_event_coords(e, rect) {
    var clientX, clientY;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    return [clientX - rect.left, clientY - rect.top];
}


function main_canvas_move(e) {
    e.preventDefault();  // Блокируем прокрутку на мобилках

    if (_drag_mode && !move && _selected_obj) {
        //console.log("function main_canvas_move(e)");

        var canvasContainer = document.getElementById("main_canvas_container");
        var rect = canvasContainer.getBoundingClientRect();
        var canvasWidth = rect.width;
        var canvasHeight = rect.height;

        // Унифицированное получение координат
        //var [x, y] = get_event_coords(e, rect);
        var coords = get_event_coords(e, rect);
        var x = coords[0];
        var y = coords[1];

        var x_norm = x / canvasWidth;
        var y_norm = y / canvasHeight;

        var cam = m_scenes.get_active_camera();
        var m_vec3 = b4w.vec3;
        var _vec3_tmp = m_vec3.create();
        var _vec3_tmp2 = m_vec3.create();
        var _vec3_tmp3 = m_vec3.create();

        var targ = m_scenes.get_object_name(_selected_obj);

        if (all_bowl.includes(targ)) {
            x -= _obj_delta_xy[0];
            y -= _obj_delta_xy[1];

            var pline = m_cam.calc_ray(cam, x, y, _pline_tmp);
            var camera_ray = m_math.get_pline_directional_vec(pline, _vec3_tmp);
            var cam_trans = m_trans.get_translation(cam, _vec3_tmp2);
            m_math.set_pline_initial_point(_pline_tmp, cam_trans);
            m_math.set_pline_directional_vec(_pline_tmp, camera_ray);

            var point = m_math.line_plane_intersect(FLOOR_PLANE_NORMAL, 0, _pline_tmp, _vec3_tmp3);
            var select_trans = m_trans.get_translation(_selected_obj, _vec3_tmp2);

            //console.log("Mouse x,y:", x, y, "Normalized:", x_norm.toFixed(2), y_norm.toFixed(2));
            //console.log("Point[0]", point[0], "Point[1]", point[1]);

            if (point && camera_ray[1] < 0) {
                //console.log("Ray intersects floor plane");
                limit_object_position(_selected_obj);
            }

            if (point[0] > -2.1 && point[0] < 1.9 && point[1] > -14.0) {
                var _posY = Math.max(select_trans[1], -14.0);
                var Z = -0.6;
                //console.log("_posY= ", _posY, "y_norm= ", y_norm);
                if (y_norm > 0.8) {
                    m_trans.set_translation(_selected_obj, point[0], _posY, Z);
                } else {
                    m_trans.set_translation(_selected_obj, point[0], point[1]+2.0, Z);
                }
            }

            if (select_trans[1] > -11.0) {
                var _posX = Math.max(Math.min(select_trans[0], 1.8), -1.8);
                m_trans.set_translation(_selected_obj, _posX, -10.0, -0.5);

                var sel_trans = m_trans.get_translation(_selected_obj, _vec3_tmp2);
                if (sel_trans[1] >= -10.0 && sel_trans[1] < -8.0) {
                    _drag_mode = false;
                    m_phy.enable_simulation(_selected_obj);
                    _moving_obj = _selected_obj;

                    if (!_enable_camera_controls) {
                        m_app.enable_camera_controls();
                        _enable_camera_controls = true;
                    }

                    document.documentElement.style.cursor = 'default';
                    _selected_obj = null;
                    _first_Click = false;
                    _enable_click = true;
                    num_place_frame();
                    move = true;
                    move_2 = false;
                    main_moving(_moving_obj);
                }
            }
        }
    }
}

function num_place_frame() {
    own_countPinPad = null;
    NumBroska_Player += 1;
    numDownPins = [];
    //console.log("NumBroska_Player=" + NumBroska_Player);
    //console.log("NumBroska_Player/2=" + Math.floor(NumBroska_Player / 2));
    //console.log("NumBroska_Player - Math.floor(NumBroska_Player / 2)=" + (NumBroska_Player - Math.floor(NumBroska_Player / 2)));
    /*od.ResetPins = False
    self.own['dobavka'] = 0*/
    if (NumBroska_Player % 2 == 0) {
        Player_PlaceInFrame = 2;
        Player_NumFrame = NumBroska_Player / 2;
    }

    else {
        Player_PlaceInFrame = 1;
        Player_NumFrame = NumBroska_Player - Math.floor(NumBroska_Player / 2);
    }
    //console.log("NumBroska_Player=" + NumBroska_Player);
    //console.log("Player_PlaceInFrame=" + Player_PlaceInFrame);
    //console.log("Player_NumFrame=" + Player_NumFrame);
}



function limit_object_position(obj) {
    var bb = m_trans.get_object_bounding_box(obj);

    var obj_parent = m_obj.get_parent(obj);
    if (obj_parent && m_obj.is_armature(obj_parent))
        // get translation from the parent (armature) of the animated object
        var obj_pos = m_trans.get_translation(obj_parent, _vec3_tmp);
    else
        var obj_pos = m_trans.get_translation(obj, _vec3_tmp);
    //console.log("limit_object_position: obj_pos=" + obj_pos);
    if (bb.max_x > WALL_X_MAX)
        obj_pos[0] -= bb.max_x - WALL_X_MAX;
    else if (bb.min_x < WALL_X_MIN)
        obj_pos[0] += WALL_X_MIN - bb.min_x;

    if (bb.max_z > WALL_Z_MAX)
        obj_pos[2] -= bb.max_z - WALL_Z_MAX;
    else if (bb.min_z < WALL_Z_MIN)
        obj_pos[2] += WALL_Z_MIN - bb.min_z;

    if (obj_parent && m_obj.is_armature(obj_parent))
        // translate the parent (armature) of the animated object
        m_trans.set_translation_v(obj_parent, obj_pos);
    else
        m_trans.set_translation_v(obj, obj_pos);
}
//});

// import the app module and start the app by calling the init method
//b4w.require("my_project_main").init();
init();
