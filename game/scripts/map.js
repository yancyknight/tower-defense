const graphics = require('../../framework/graphics');

var SquareEnum = {
    BLOCK: 1,
    TOWER: 2,
    EMPTY: 3,
};
const rowColSize = 20;

var createMap = function () {
    var that = {};
    
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

    that.update = function () {
    }

    that.render = function () {

    }

    that.setTower = function({x, y}) {
        grid[y][x] = SquareEnum.TOWER;
        grid[y+1][x] = SquareEnum.TOWER;
        grid[y][x+1] = SquareEnum.TOWER;
        grid[y+1][x+1] = SquareEnum.TOWER;
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

    that.shortestPath = function (curPos, goal) {
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
        while (frontier.myLength() > 0) {
            let current = frontier.remove();
            
            if (current.x === goal.x && current.y === goal.y) {
                placesBeen[current.y][current.x] = current;
                break;
            }

            // up
            if (current.y > 0 && grid[current.y - 1][current.x] === SquareEnum.EMPTY && !frontier.isInList({
                    x: current.x,
                    y: current.y - 1
                }) && placesBeen[current.y - 1][current.x] === undefined) {
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
            placesBeen[current.y][current.x] = current;
        }

        let path = [];
        let current = goal;
        while (current.x !== curPos.x || current.y !== curPos.y) {
            path.push({x:Math.floor(current.x*1000/rowColSize+rowColSize/2), y: Math.floor(current.y*1000/rowColSize+rowColSize/2)});
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
                    return path;
                    break;
            }
        }

        return path.reverse();
    }

    return that;
}

var m_map = createMap();

module.exports = {
    map: m_map,
    rowColSize,
    id: 'map'
};
