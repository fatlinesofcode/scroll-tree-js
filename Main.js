$(document).ready(function () {
    new Main($('#canvas-stage'));
});
function Main(canvas) {
    var self = this;
    var stage,branches=[];
    var numOfBranches = 1;
    var FPS=100;

    self.initialize = function () {
        if(!stage){
            stage = new createjs.Stage(canvas.get(0));
            createjs.Ticker.setFPS(FPS);
            self.stageWidth = $(document).width();
            self.stageHeight = $(document).height();
            canvas.attr('width', self.stageWidth);
            canvas.attr('height',self.stageHeight);
        }
        branches = [];
        stage.removeAllChildren();

        // add the trunk
        branches.push(new Branch(stage,self.stageWidth/2,self.stageHeight-50,40,true));

        toggleListeners(true);
    };

    var toggleListeners = function (enable) {
        // remove listeners

        if (!enable)return;
        createjs.Ticker.addEventListener("tick", onTickUpdate);
        $(document).bind("mousewheel", onWheel);
        $(document).bind("DOMMouseScroll", onWheel);
        $("#bt-restart").bind('click', self.initialize)
        // add listeners.

    };
    var onWheel = function() {
        updateBranches();
    }

    var addBranch = function(x,y,radius) {
        branches.push(new Branch(stage,x,y,radius));
    }
    var updateBranches = function() {
        var l = branches.length;
        for (var i = 0; i < l; i++) {
            var b = branches[i];
            b.update();
            if(b.branchable() && l < 30){
                addBranch(b.x, b.y, b.radius)
            }
        }
    }


    var onTickUpdate = function() {
        updateBranches();
        stage.update();
    }


    self.initialize();
    return self;
}
function Branch(stage,x,y,radius, isTrunk) {
    var self = this;
    self.radius = radius;
    self.isTrunk = true;//isTrunk || false;
    var stage;
    var dx,dy, radius,rx,ry,wanderStep,growthRate,scale,shrinkRate;
    var length=0;
    var branchProbability=0.035;
    var minTrunkLength = 5;
    var HALF_PI  = Math.PI / 2;

    self.initialize = function () {
        self.x = dx;
        self.y = dy;
        dx = x;
        dy = y;
        rx=3;
        wanderStep  = rand(0.1, 0.4)//*0.1;
        scale = 0.95;
        shrinkRate = 0.99;
        growthRate = 1;
    };



    self.update = function() {
        if(radius>1)
            addDot();

    }
    self.branchable = function() {
        branchProbability = 0.055//rand(0.25,0.5);
        var result = false;
        if(self.isTrunk){
            if(length>minTrunkLength){
                self.isTrunk=false;
                branchProbability = 0.2
              //  result=true;
            }
        }

        if(Math.random() < branchProbability && !self.isTrunk)result=true;

        return result;

    }

    var addDot = function() {
        var circle = new createjs.Shape();
        var g = circle.graphics
        var color = "rgba(255,255,255,0.97)";
        g.beginFill(color)
        g.setStrokeStyle(1);
        g.beginStroke("rgba(0,0,0,0.97)");
        g.drawCircle(0, 0, radius);
        circle.x = dx
        circle.y = dy;
        self.x = dx;
        self.y = dy;
        self.radius = radius;
        rx += rand(-wanderStep, wanderStep);
        dx += Math.sin(rx) * radius * 1;
        dy += Math.cos(rx) * radius;
        radius*=(scale+(rand(0.001,0.01)));
        length++;
        stage.addChild(circle);

    }

    self.initialize();
    return self;
}