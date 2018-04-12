const graphics = require('../../framework/graphics');

var SquareEnum = {
    BLOCK: 1,
    TOWER: 2,
    EMPTY: 3,
};
const rowColSize = 20;

var createMap = function ({
    imageSrc
} = {}) {
    var that = {};

    var m_showGrid = false;

    var image = graphics.Img(imageSrc);
    var grid = [];
    for (let i = 0; i < rowColSize; i++) {
        grid.push([]);
        for (let j = 0; j < rowColSize; j++) {
            grid[i].push(SquareEnum.EMPTY);
        }
    }

    for (let i = 1; i < rowColSize / 2 - 2; i++) {
        grid[i][1] = SquareEnum.BLOCK;
        grid[i][rowColSize - 2] = SquareEnum.BLOCK;
        grid[1][i] = SquareEnum.BLOCK;
        grid[rowColSize - 2][i] = SquareEnum.BLOCK;
        grid[i + 11][1] = SquareEnum.BLOCK;
        grid[i + 11][rowColSize - 2] = SquareEnum.BLOCK;
        grid[1][i + 11] = SquareEnum.BLOCK;
        grid[rowColSize - 2][i + 11] = SquareEnum.BLOCK;
    }

    grid[0][rowColSize / 2 - 3] = SquareEnum.BLOCK;
    grid[0][rowColSize / 2 + 2] = SquareEnum.BLOCK;
    grid[rowColSize - 1][rowColSize / 2 - 3] = SquareEnum.BLOCK;
    grid[rowColSize - 1][rowColSize / 2 + 2] = SquareEnum.BLOCK;
    grid[rowColSize / 2 - 3][0] = SquareEnum.BLOCK;
    grid[rowColSize / 2 + 2][0] = SquareEnum.BLOCK;
    grid[rowColSize / 2 - 3][rowColSize - 1] = SquareEnum.BLOCK;
    grid[rowColSize / 2 + 2][rowColSize - 1] = SquareEnum.BLOCK;

    for(let i = 2 ; i < rowColSize-3; i++){
        grid[i][3] = SquareEnum.TOWER;
        grid[i+1][5] = SquareEnum.TOWER;
        grid[i][7] = SquareEnum.TOWER;
        grid[i+1][9] = SquareEnum.TOWER;
    }

    // console.log('creating map');

    that.update = function ({
        showGrid = true
    } = {}) {
        m_showGrid = showGrid;
    }

    that.render = function () {
        //        graphics.drawImage({image, dx:0,dy:0,dWidth:1000, dHeight:1000});
        if (m_showGrid === true) {
            // console.log('printing grid');
            for (let i = 1; i < rowColSize; i++) {
                let spot = i * 1000 / rowColSize;
                graphics.drawLine({
                    leftx: spot,
                    topy: 0,
                    rightx: spot,
                    bottomy: 1000
                });
                graphics.drawLine({
                    leftx: 0,
                    topy: spot,
                    rightx: 1000,
                    bottomy: spot
                });
            }
        }
        for (let i = 0; i < rowColSize; i++) {
            for (let j = 0; j < rowColSize; j++) {
                if (grid[i][j] === SquareEnum.BLOCK) {
                    graphics.drawRectangle({
                        x: j * 1000 / rowColSize,
                        y: i * 1000 / rowColSize,
                        w: 1000 / rowColSize,
                        h: 1000 / rowColSize,
                        fill: '#FF0000'
                    });
                }
                else if(grid[i][j] === SquareEnum.TOWER) {
                    graphics.drawRectangle({
                        x: j * 1000 / rowColSize,
                        y: i * 1000 / rowColSize,
                        w: 1000 / rowColSize,
                        h: 1000 / rowColSize,
                        fill: '#F0A0F0'
                    });
                }
            }
        }

        var myPath = that.nearestExit({x:0,y:8}, {x:rowColSize-1, y:11});
        // console.log(myPath.length);
        for(let i = 0; i < myPath.length; i++) {
             graphics.drawRectangle({
                 x: myPath[i].x * 1000 / rowColSize,
                 y: myPath[i].y * 1000 / rowColSize,
                 w: 1000 / rowColSize,
                 h: 1000 / rowColSize,
                 fill: '#FFFF00'
             });
        }

        myPath = that.nearestExit({x:8,y:0}, {x:11, y:rowColSize-1});
        // console.log(myPath.length);
        for(let i = 0; i < myPath.length; i++) {
             graphics.drawRectangle({
                 x: myPath[i].x * 1000 / rowColSize,
                 y: myPath[i].y * 1000 / rowColSize,
                 w: 1000 / rowColSize,
                 h: 1000 / rowColSize,
                 fill: '#FF00FF'
             });
        }

    }

    var CameFromEnum = {
        UP: 1,
        DOWN: 2,
        LEFT: 3,
        RIGHT: 4,
        NONE: 5,
    };

    var calcDist = function (a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    var PriorityQueue = function () {
        let that = {};
        let items = [];

        that.addItem = function (element) {
            for (let i = 0; i < items.length; i++) {
                // console.log(element.hEstimate + " vx " + items[i].hEstimate);
                if (element.hEstimate <= items[i].hEstimate) {
                    items.splice(i, 0, element);
                    return;
                }
            }
            items.push(element);
        }

        that.remove = function () {
            var toReturn = items[0];
            items.splice(0, 1);
            return toReturn;
        }

        that.myLength = function () {
            // console.log('my length is ' + items.length);
            return items.length;
        }

        that.isInList = function (element) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].x === element.x && items[i].y === element.y)
                    return true;
            }
            return false;
        }

        that.printList = function() {
            for (let i = 0; i < items.length; i++) {
                console.log('hEstimate: ' + items[i].hEstimate);
            }
        }

        return that;
    }

    that.nearestExit = function (curPos, goal) {
        let dist = calcDist(curPos, goal);
        let frontier = PriorityQueue();
        frontier.addItem({
            x: curPos.x,
            y: curPos.y,
            cost: 0,
            cameFrom: CameFromEnum.NONE,
            distanceToDest: dist,
            hEstimate: dist
        });
        var placesBeen = [];
        for (let i = 0; i < rowColSize; i++) {
            placesBeen.push([]);
            for (let j = 0; j < rowColSize; j++) {
                placesBeen[i][j] = undefined
            }
        }
        // var ttl = 15;
        while (frontier.myLength() > 0) {
            let current = frontier.remove();
            
            // console.log('came from: '  + current.cameFrom);
            // console.log('Cur Spot: ' + current.x + " " + current.y);
            // ttl--;
            if (current.x === goal.x && current.y === goal.y) {
                placesBeen[current.y][current.x] = current;
                // console.log('going to: ' + placesBeen[current.y][current.x].cameFrom);
                
                break;
            }

            // up
            if (current.y > 0 && grid[current.y - 1][current.x] === SquareEnum.EMPTY && !frontier.isInList({
                    x: current.x,
                    y: current.y - 1
                }) && placesBeen[current.y - 1][current.x] === undefined) {
                    // console.log('moving up');
                    dist = calcDist(goal, {
                    x: current.x,
                    y: current.y - 1
                });
                frontier.addItem({
                    x: current.x,
                    y: current.y - 1,
                    cost: current.cost + 1,
                    cameFrom: CameFromEnum.DOWN,
                    distanceToDest: dist,
                    hEstimate: current.cost + 1 + dist
                });
            }
            // down
            if (current.y < rowColSize - 1 && grid[current.y + 1][current.x] === SquareEnum.EMPTY && !frontier.isInList({
                    x: current.x,
                    y: current.y + 1
                }) && placesBeen[current.y + 1][current.x] === undefined) {
                // console.log('moving down');
                    
                dist = calcDist(goal, {
                    x: current.x,
                    y: current.y + 1
                });
                frontier.addItem({
                    x: current.x,
                    y: current.y + 1,
                    cost: current.cost + 1,
                    cameFrom: CameFromEnum.UP,
                    distanceToDest: dist,
                    hEstimate: current.cost + 1 + dist
                });
            }
            // left
            if (current.x > 0 && grid[current.y][current.x - 1] === SquareEnum.EMPTY && !frontier.isInList({
                    x: current.x - 1,
                    y: current.y
                }) && placesBeen[current.y][current.x - 1] === undefined) {
                // console.log('moving left');
                    
                dist = calcDist(goal, {
                    x: current.x - 1,
                    y: current.y
                });
                frontier.addItem({
                    x: current.x - 1,
                    y: current.y,
                    cost: current.cost + 1,
                    cameFrom: CameFromEnum.RIGHT,
                    distanceToDest: dist,
                    hEstimate: current.cost + 1 + dist
                });
            }
            // right
            if (current.x < rowColSize - 1 && grid[current.y][current.x + 1] === SquareEnum.EMPTY && !frontier.isInList({
                    x: current.x + 1,
                    y: current.y
                }) && placesBeen[current.y][current.x + 1] === undefined) {
                // console.log('moving right');
                    
                dist = calcDist(goal, {
                    x: current.x + 1,
                    y: current.y
                });
                frontier.addItem({
                    x: current.x + 1,
                    y: current.y,
                    cost: current.cost + 1,
                    cameFrom: CameFromEnum.LEFT,
                    distanceToDest: dist,
                    hEstimate: current.cost + 1 + dist
                });
            }
            // frontier.printList();
            placesBeen[current.y][current.x] = current;
            // console.log('placing' + current.x + current.y + placesBeen[current.y][current.x].cameFrom);
            
            // graphics.drawRectangle({
            //     x: current.x * 1000 / rowColSize,
            //     y: current.y * 1000 / rowColSize,
            //     w: 1000 / rowColSize,
            //     h: 1000 / rowColSize,
            //     fill: '#FFFF00'
            // });
        }

        // console.log("map");
        // for(let i = 0; i < placesBeen.length; i++) {
        //     for(let j = 0; j < placesBeen.length; j++) {
        //         console.log(placesBeen[i][j].x + " " + placesBeen[i][j].y);
        //     }
        // }

        // console.log('curPos:');
        let path = [];
        let current = goal;
        while (current.x !== curPos.x || current.y !== curPos.y) {
            path.push(current);
            // graphics.drawRectangle({
            //     x: current.x * 1000 / rowColSize,
            //     y: current.y * 1000 / rowColSize,
            //     w: 1000 / rowColSize,
            //     h: 1000 / rowColSize,
            //     fill: '#FF00FF'
            // });
            // console.log('at:' + current.x + current.y +placesBeen[current.y][current.x].cameFrom)
            switch (placesBeen[current.y][current.x].cameFrom) {
                case CameFromEnum.UP:
                    current = {
                        x: current.x,
                        y: current.y - 1
                    };
                    break;
                case CameFromEnum.DOWN:
                    current = {
                        x: current.x,
                        y: current.y + 1
                    };
                    break;
                case CameFromEnum.LEFT:
                    current = {
                        x: current.x - 1,
                        y: current.y
                    };
                    break;
                case CameFromEnum.RIGHT:
                    current = {
                        x: current.x + 1,
                        y: current.y
                    };
                    break;
                default:
                    // console.log('bad...' + current.x + current.y + placesBeen[current.y][current.x].cameFrom);
                    return path;
                    break;
            }
        }

        return path;
    }

    // console.log('made finding algorithm.');
    var myPath = that.nearestExit({
        x: 0,
        y: 8
    }, {
        x: rowColSize - 1,
        y: 11
    });
    for(let i = 0; i < myPath.length; i++) {
        // console.log('nextStep: ' +myPath[i].x + " " + myPath[i].y);
    }

    return that;
}

createMap("  ");

module.exports = {
    createMap: createMap,
    id: 'map'
};
