const graphics = require('../../framework/graphics');

var createMap = function({
    imageSrc
} = {}) {
    var that = {};

    var m_showGrid = false;

    const rowColSize = 20;
    var image = graphics.Img(imageSrc);
    var grid = [];
    for(let i = 0; i < rowColSize; i++) {
        grid.push([]);
        for(let j = 0; j < rowColSize; j++) {
            grid[i].push({});
        }
    }

    for(let i = 1; i < rowColSize/2 - 2; i++){
        grid[i][1].object = 'block';
        grid[i][rowColSize-2].object = 'block';
        grid[1][i].object = 'block';
        grid[rowColSize-2][i].object = 'block';
        grid[i+11][1].object = 'block';
        grid[i+11][rowColSize-2].object = 'block';
        grid[1][i+11].object = 'block';
        grid[rowColSize-2][i+11].object = 'block';
    }

    grid[0][rowColSize/2 - 3].object = 'block';
    grid[0][rowColSize/2 + 2].object = 'block';
    grid[rowColSize-1][rowColSize/2 - 3].object = 'block';
    grid[rowColSize-1][rowColSize/2 + 2].object = 'block';
    grid[rowColSize/2 - 3][0].object = 'block';
    grid[rowColSize/2 + 2][0].object = 'block';
    grid[rowColSize/2 - 3][rowColSize-1].object = 'block';
    grid[rowColSize/2 + 2][rowColSize-1].object = 'block';

    grid[rowColSize/2][rowColSize-1].object = 'end';
    grid[rowColSize-1][rowColSize/2].object = 'end';

    console.log('creating map');

    that.update = function({showGrid = true} = {}) {
        m_showGrid = showGrid;
        
    }

    that.render = function() {
//        graphics.drawImage({image, dx:0,dy:0,dWidth:1000, dHeight:1000});
        if(m_showGrid === true) {
            // console.log('printing grid');
            for(let i = 1; i < rowColSize; i++) {
                let spot = i * 1000/rowColSize;
                graphics.drawLine({leftx: spot, topy: 0, rightx: spot, bottomy: 1000});
                graphics.drawLine({leftx: 0, topy: spot, rightx: 1000, bottomy: spot});
            }
        }
        for(let i = 0; i < rowColSize; i++) {
            for(let j = 0; j< rowColSize; j++) {
                if(grid[i][j].object === 'block') {
                    graphics.drawRectangle({x:i*1000/rowColSize, y:j*1000/rowColSize, w:1000/rowColSize, h:1000/rowColSize, fill:'#FF0000'});
                }
            }
        }
    }
/*
    that.nearestExit = function(curPos, goal) {
        let frontier = [{x:curPos.x,y:curPos.y, cost:0}];
        var came_from = {};
        var cost_so_far = {};
        came_from[curPos.x*rowColSize + curPos.y] = null;
        cost_so_far[curPos.x*rowColSize + curPos.y] = 0;
        while(frontier.length > 0) {
            var current = frontier.shift();

            if(current.x === goal.x && current.y === goal.y){
                break;
            }

            var new_cost = cost_so_far[current.x*rowColSize + current.y] + 1;
        }*/
/*
   for next in graph.neighbors(current):
      new_cost = cost_so_far[current] + graph.cost(current, next)
      if next not in cost_so_far or new_cost < cost_so_far[next]:
         cost_so_far[next] = new_cost
         priority = new_cost + heuristic(goal, next)
         frontier.put(next, priority)
         came_from[next] = current
         */
    //}

    return that;
}

module.exports = {
	createMap: createMap,
	id: 'map'
};
