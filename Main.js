$(document).ready(function () {
    new Main($('#canvas-stage'));
});
var depth=10000;
function Main(canvas) {
    var self = this;
    var stage,branches=[];
    var numOfBranches = 1;
    var FPS=100;
    var startRadius = 40;
    var oddBranch = true;
    self.initialize = function () {
        if(!stage){
            stage = new createjs.Stage(canvas.get(0));
            createjs.Ticker.setFPS(FPS);
            self.stageWidth = $(document).width();
            self.stageHeight = $(document).height();
            canvas.attr('width', self.stageWidth);
            canvas.attr('height',self.stageHeight);

            depth=1000;
        }
        startRadius = self.stageHeight * 0.0385;
        branches = [];
        stage.removeAllChildren();

        // add the trunk
        branches.push(new Branch(stage,self.stageWidth/2,self.stageHeight-50,startRadius,Math.PI,0.970,true));

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

    var addBranch = function(x,y,radius,randStep,scale) {
        randStep= oddBranch ? 2 : 4;
        oddBranch=!oddBranch;
        radius *= rand(0.75,1);
        branches.push(new Branch(stage,x,y,radius,randStep,scale,false));
    }
    var updateBranches = function() {
        var l = branches.length;
        for (var i = 0; i < l; i++) {
            var b = branches[i];
            b.update();
            if(b.branchable() && l < 30){
                var scale=0.95
                scale= 1 - ((startRadius - b.radius)*0.0019);
                // if(b.radius < (startRadius*0.3))
                scale = 0.96;
                addBranch(b.x, b.y, b.radius, b.randStep,scale )
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
function Branch(stage,x,y,radius, randStep, shrinkRate, isTrunk) {
    var self = this;
    self.radius = radius;
    self.isTrunk = isTrunk;
    self.randStep = randStep;
    self.shrinkRate = shrinkRate;

    var stage;
    var dx,dy, radius,ry,wanderStep,growthRate,scale;
    var length=0;
    var branchProbability=0.035;
    var minTrunkLength = 10
    var HALF_PI  = Math.PI / 2;

    self.initialize = function () {
        self.x = dx;
        self.y = dy;
        dx = x;
        dy = y;

        wanderStep  = isTrunk ? 0.02 : rand(0.1, 0.4)//*0.1;
        scale = shrinkRate;
        // self.randStep= self.randStep || 3;
        growthRate = 1;
    };



    self.update = function() {
        if(radius>1)
            addDot();

    }
    self.branchable = function() {

        var result = false;
        if(self.isTrunk){
            // trunk is long enough, create branch
            if(length==minTrunkLength){
                branchProbability = 1;
            } else if(length > minTrunkLength){
                // branch probability on trunk after the first branch
                branchProbability =  (self.radius * 0.01);
            }else{
                branchProbability=0;
            }
        }else{
            // branch probability on new branches
            branchProbability = length > minTrunkLength*2 ? 0.05 : 0.025;
        }
        if(self.radius > 5)
            if(Math.random() < branchProbability)result=true;



        return result;

    }

    var addDot = function() {
        var circle = new createjs.Shape();
        var g = circle.graphics
        // var color = self.isTrunk ? "rgba(199,199,199,0.97)" : "rgba(255,255,255,0.97)";
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
        dx += Math.sin(self.randStep) * radius;
        dy += Math.cos(self.randStep) * radius;
        var shrink = (isTrunk && (length > minTrunkLength*2)) ? 0.96 : 1
        radius*=(scale*shrink)
        length++;
        self.randStep += rand(-wanderStep, wanderStep);
        //  stage.addChildAt(circle,0);
        stage.addChild(circle);
        // var d = stage.getChildIndex(circle);
        // stage.setChildIndex(circle, depth)
        // depth = d;

    }

    self.initialize();
    return self;
}