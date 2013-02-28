$(document).ready(function () {
    new App();
});
function App() {
    /* structure hack for intellij structrue panel */
    var self = this;
    var tree;

    self.initialize = function () {
        log("9","App","initialize", "");
        toggleListeners(true);
         tree = new TreeGen('#canvas-stage');


    };

    var toggleListeners = function (enable) {
        // remove listeners

        if (!enable)return;
        // add listeners.
        $(document).bind('mousedown', onStagePress)

    };
    var addBranch = function(x,y) {
        /*
        tree.branch(Math.random()*tree.canvas.WIDTH, //x
                tree.canvas.HEIGHT, //y
                0, //dx
                -Math.random()*3, //dy
                tree.initialWidth*Math.random(), //w
                30, //growth
                0, //lifetime
                tree.newColor(), //color
                tree //obj
        );
        */
        //x,y,dx,dy,w,growthRate,lifetime,branchColor,treeObj
        var dx= 0,
                dy= -rand(0,3),
                w=rand(0,10),
                growthRate=30,
                lifetime= 3,
                branchColor='#fff';

        tree.branch2(x,y,dx,dy,w,growthRate,lifetime,branchColor,tree);

    }
    var onStagePress = function(e) {
        log("36","onStagePress","e", e);
        addBranch(e.pageX, e.pageY);
    }

    self.initialize();
    return self;
}
/// ---- tree generation ---- //



var Branch = new function(){
    var self = this;
}

var TreeGen = function(canvasId){
    // CONFIGURATION
    this.loss = 0.03;		// Width loss per cycle
    this.minSleep = 10;		// Min sleep time (For the animation)
    this.branchLoss = 0.8;	// % width maintained for branches
    this.mainLoss = 0.8;	// % width maintained after branching
    this.speed = 0.3;		// Movement speed
    this.newBranch = 0.8;	// Chance of not starting a new branch
    this.colorful = true;	// Use colors for new trees
    this.fastMode = true;	// Fast growth mode
    this.fadeOut = true;	// Fade slowly to black
    this.fadeAmount = 0.05;	// How much per iteration
    this.autoSpawn = true;	// Automatically create trees
    this.spawnInterval = 250;// Spawn interval in ms
    this.initialWidth = 10;	// Initial branch width
    var self = this;

    self.count = 0;

    // VARS
    this.canvas = {
        ctx : $(canvasId)[0].getContext("2d"),
        WIDTH : $(canvasId).width(),
        HEIGHT : $(canvasId).height(),
        canvasMinX : $(canvasId).offset().left,
        canvasMaxX : this.canvasMinX + this.WIDTH,
        canvasMinY : $(canvasId).offset().top,
        canvasMaxY : this.canvasMinY + this.HEIGHT
    };
    this.mouse = {
        s : {x:0, y:0},	// Mouse speed
        p : {x:0, y:0}	// Mouse position
    }
    var fps = 0, now, lastUpdate = (new Date)*1 - 1,
            fpsFilter = 100;

    this.fade = function() {
        if(!this.fadeOut) return true;
        this.canvas.ctx.fillStyle="rgba(0,0,0,"+this.fadeAmount+")";
        this.canvas.ctx.fillRect(0, 0, this.canvas.WIDTH, this.canvas.HEIGHT);
    }

    this.resizeCanvas = function() {
        this.canvas.WIDTH = window.innerWidth;
        this.canvas.HEIGHT = window.innerHeight;

        $(canvasId).attr('width',this.canvas.WIDTH);
        $(canvasId).attr('height',this.canvas.HEIGHT);
    }

    this.newColor = function(){
        if(!this.colorful) return '#fff';
        return '#'+Math.round(0xffffff * Math.random()).toString(16);
    }

    this.mouseMove = function(e) {
        this.mouse.s.x = Math.max( Math.min( e.pageX - this.mouse.p.x, 40 ), -40 );
        this.mouse.s.y = Math.max( Math.min( e.pageY - this.mouse.p.y, 40 ), -40 );

        this.mouse.p.x = e.pageX - this.canvas.canvasMinX;
        this.mouse.p.y = e.pageY - this.canvas.canvasMinY;
    }

    // Starts a new branch from x,y. w is initial w
    // lifetime is the number of computed cycles
    this.branch = function(x,y,dx,dy,w,growthRate,lifetime,branchColor,treeObj){
        this.canvas.ctx.lineWidth = w-lifetime*this.loss;
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x,y);
        if(this.fastMode) growthRate *= 0.5;
        // Calculate new coords
        x = x+dx;
        y = y+dy;
        // Change dir
        dx = dx+Math.sin(Math.random()+lifetime)*this.speed;
        dy = dy+Math.cos(Math.random()+lifetime)*this.speed;
        // Check if branches are getting too low
        if(w<6 && y > this.canvas.HEIGHT-Math.random()*(0.3*this.canvas.HEIGHT)) w = w*0.8;
        //
        this.canvas.ctx.strokeStyle = branchColor;
        this.canvas.ctx.lineTo(x,y);
        this.canvas.ctx.stroke();
        // Generate new branches
        // they should spawn after a certain lifetime has been met, although depending on the width

        if(lifetime > 5*w+Math.random()*100 && Math.random()>this.newBranch){
            setTimeout(function(){
                treeObj.branch(x,y,2*Math.sin(Math.random()+lifetime),2*Math.cos(Math.random()+lifetime),(w-lifetime*treeObj.loss)*treeObj.branchLoss,growthRate+100*Math.random(),0,branchColor, treeObj);
                // When it branches, it looses a bit of width
                w *= this.mainLoss;
            },2*growthRate*Math.random()+this.minSleep);
        }
        if(w-lifetime*this.loss>=1) {
            setTimeout(function(){
                treeObj.branch(x,y,dx,dy,w,growthRate,++lifetime,branchColor, treeObj);
            },growthRate);
        }
    }


    this.branch2 = function(x,y,dx,dy,w,growthRate,lifetime,branchColor,treeObj){
        this.canvas.ctx.lineWidth = w-lifetime*this.loss;
        this.canvas.ctx.beginPath();
        this.canvas.ctx.moveTo(x,y);
        if(this.fastMode) growthRate *= 0.5;

        var next = false;

        // Calculate new coords
        x = x+dx;
        y = y+dy;
        // Change dir
        dx = dx+Math.sin(Math.random()+lifetime)*this.speed;
        dy = dy+Math.cos(Math.random()+lifetime)*this.speed;
        // Check if branches are getting too low
        if(w<6 && y > this.canvas.HEIGHT-Math.random()*(0.3*this.canvas.HEIGHT)) w = w*0.8;
        //
        this.canvas.ctx.strokeStyle = branchColor;
        this.canvas.ctx.lineTo(x,y);
        this.canvas.ctx.stroke();
        // Generate new branches
        // they should spawn after a certain lifetime has been met, although depending on the width

        if(lifetime > 5*w+Math.random()*100 && Math.random()>this.newBranch){
            next=true;

                treeObj.branch2(x,y,2*Math.sin(Math.random()+lifetime),2*Math.cos(Math.random()+lifetime),(w-lifetime*treeObj.loss)*treeObj.branchLoss,growthRate+100*Math.random(),0,branchColor, treeObj);
                // When it branches, it looses a bit of width
                w *= this.mainLoss;

        }
        if(w-lifetime*this.loss>=1) {
            if(self.count==0){
                next=true;
                    treeObj.branch2(x,y,dx,dy,w,growthRate,++lifetime,branchColor, treeObj);

            }
        }
        self.count++;
        if(self.count >3)
            self.count=0;
        if(next){
            setTimeout(function(){
                treeObj.branch2(x,y,dx,dy,w,growthRate,lifetime,branchColor,treeObj)
            },100)
        }

    }


    this.nextBranch = function(x,y,dx,dy,w,growthRate,lifetime,branchColor,treeObj){

    }
    this.nextBranch2 = function(x,y,dx,dy,w,growthRate,lifetime,branchColor,treeObj){
        var next = false;
        if(lifetime > 5*w+Math.random()*100 && Math.random()>this.newBranch){
            // setTimeout(function(){
            treeObj.branch(x,y,2*Math.sin(Math.random()+lifetime),2*Math.cos(Math.random()+lifetime),(w-lifetime*treeObj.loss)*treeObj.branchLoss,growthRate+100*Math.random(),0,branchColor, treeObj);
            // When it branches, it looses a bit of width
            w *= this.mainLoss;
            // },10);
            next=true;
        }
        if(w-lifetime*this.loss>=1) {
            if(self.count==3){
                next=true;
                treeObj.branch(x,y,dx,dy,w,growthRate,++lifetime,branchColor, treeObj);
            }

        }

        self.count++;
        if(self.count >3)
            self.count=0;
        if(next){
        setTimeout(function(){
            self.nextBranch2(x,y,dx,dy,w,growthRate,lifetime,branchColor,treeObj)
        },50)
        }
    }

    this.resizeCanvas();
}

