var canvas;
var surface;
var currentScreen;
var mainGameScreen;
var mouse;
var fullCircle = Math.PI * 2;

function beginLoop() {
    var frameId = 0;
    var lastFrame = Date.now();

    function loop() {
        var thisFrame = Date.now();

        var elapsed = thisFrame - lastFrame;

        frameId = window.requestAnimationFrame(loop);

        currentScreen.update(elapsed);
        currentScreen.draw(surface);

        lastFrame = thisFrame;
    }

    loop();
}

canvas = document.querySelector('canvas#board');
canvas.setAttribute('width', 600);
canvas.setAttribute('height', 300);

surface = canvas.getContext('2d');

mouse = (function (target) {
    var isButtonDown = false;

    target.addEventListener('mousedown', function () {
        isButtonDown = true;
    });
    target.addEventListener('mouseup', function () {
        isButtonDown = false;
    });

    return {
        isButtonDown: function () {
            return isButtonDown;
        }
    };
}(document));


// define the main screen for the game
mainGameScreen = (function () {

    var entities = [];
    var numOfEnemyShips = 10;

    function start() {
        for (var i = 0; i <= numOfEnemyShips; i++) {
            entities.push(makeEnemyShip(i * 10, i, true));
        }
    }

    function draw(ctx) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        var entityIndex = entities.length - 1;
        for (; entityIndex != 0; entityIndex--) {
            entities[entityIndex].draw(ctx);
        }
    }

    function update(elapsed) {
        var entityIndex = entities.length - 1;
        for (; entityIndex != 0; entityIndex--) {
            entities[entityIndex].update(elapsed);
        }
    }

    return {
        draw: draw,
        update: update,
        start: start
    };
}());

// define the start screen
currentScreen = (function (input) {

    var hue = 0;
    var direction = 1;
    var transitioning = false;
    var wasButtonDown = false;
    var title = 'My Awesome Game';

    function centerText(ctx, text, y) {
        var measurement = ctx.measureText(text);
        var x = (ctx.canvas.width - measurement.width) / 2;
        ctx.fillText(text, x, y);
    }

    function draw(ctx) {

        var y = ctx.canvas.height / 2;
        var color = 'rgb(' + hue + ',0,0)';

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px monospace';
        centerText(ctx, title, y);

        ctx.fillStyle = color;
        ctx.font = '24px monospace';
        centerText(ctx, 'click to begin', y + 30);
    }

    function update() {

        hue += 1 * direction;
        if (hue > 255) direction = -1;
        if (hue < 1) direction = 1;

        var isButtonDown = input.isButtonDown();
        var mouseJustClicked = !isButtonDown && wasButtonDown;

        if (mouseJustClicked && !transitioning) {
            transitioning = true;
            currentScreen = mainGameScreen;
            currentScreen.start();
        }

        wasButtonDown = isButtonDown;
    }

    return {
        draw: draw,
        update: update
    };
}(mouse));


beginLoop();