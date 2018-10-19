function makeEnemyShip(x, y, isDefense) {
    var position = {
        x: x,
        y: y
    };

    var width = 25;
    var height = 25;

    var turnSpeed = fullCircle / 200;
    var speed = 2;
    var orientation = 0;
    var target = findNewTarget();
    var color = isDefense ? 'yellow' : 'blue';

    function draw(ctx) {
        ctx.save();
        ctx.translate(position.x, position.y);
        ctx.rotate(orientation);
        ctx.fillStyle = color;
        //        ctx.fillRect(-3, -1, 6, 2);
        ctx.fillRect(-5, -5, 5, 5);
        ctx.restore();

        //ctx.beginPath();
        //ctx.fillStyle = 'yellow';
        //ctx.moveTo(50, 50);
        //ctx.lineTo(75, 75);
        //ctx.stroke();
    }

    function update(elapsed) {
        var y = target.y - position.y;
        var x = target.x - position.x;
        var d2 = Math.pow(x, 2) + Math.pow(y, 2);
        if (d2 < 16) {
            target = findNewTarget();
        } else {

            var angle = Math.atan2(y, x);
            var delta = angle - orientation;
            var delta_abs = Math.abs(delta);

            if (delta_abs > Math.PI) {
                delta = delta_abs - fullCircle;
            }

            if (delta !== 0) {
                var direction = delta / delta_abs;
                orientation += (direction * Math.min(turnSpeed, delta_abs));
            }
            orientation %= fullCircle;

            position.x += Math.cos(orientation) * speed;
            position.y += Math.sin(orientation) * speed;
        }

    }

    function findNewTarget() {
        var target = {
            x: Math.round(Math.random() * 600),
            y: Math.round(Math.random() * 300)
        };

        return target;
    }

    return {
        draw: draw,
        update: update
    }
}
