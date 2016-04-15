(function(){
  var _X = window.innerWidth;
  var _Y = window.innerHeight;

  var _Z = ( _X + _Y ) / 2;

  var BRIGHTNESS = 35;
  var MAXDIST = _Z / 2;
  var NODE_COUNT = 75;

  var _COLORS = [ [165,13,46],
              [186,61,90],
              [221,202,137],
              [237,234,213],

              [247,165,192],
              [252,65,171],
              [250,44,4],
              [117,33,57],
              [130,36,227]];

  // Second term clips intensity to 0 at max distance for smooth fade in/out
  var intensity = function( dist ) {
    return Math.min(
      ( 1/Math.pow( dist, 2 ) * BRIGHTNESS * _Z )
    - ( 1/Math.pow( MAXDIST, 2 ) * BRIGHTNESS * _Z ), 1);
  }

  var Node = function( ctx ) {
    var x = Math.random() * _X;
    var y = Math.random() * _Y;
    var z = Math.random() * _Z;
    var xvel = Math.random() * 4 - 2;
    var yvel = Math.random() * 4 - 2;
    var zvel = Math.random() * 4 - 2;
    this.ctx = ctx;
    this.pos = [x, y, z];
    this.offx = 0;
    this.offy = 0;
    this.vel = [xvel, yvel, zvel];
    this.impact = false;
  }

  Node.prototype.draw = function() {
    if ( this.impact ) {
      this.ctx.fillStyle = "white";
      this.impact = false;
    } else {
      this.ctx.fillStyle = "red";
    }
    var radius = 4 - ( this.pos[2] / _Z );

    this.ctx.beginPath();
    this.ctx.arc(
      this.offx, this.offy, radius, 0, 2 * Math.PI, true
    );
    this.ctx.fill();
  }

  Node.prototype.testOutOfBounds = function() {
    var x = this.pos[0];
    var y = this.pos[1];
    var z = this.pos[2];
    if ( x < 0 ) {
      this.pos[0] = 0;
      this.vel[0] = -this.vel[0];
      this.impact = true;
    } else if ( x > _X ) {
      this.pos[0] = _X;
      this.vel[0] = -this.vel[0];
      this.impact = true;
    }
    if ( y < 0 ) {
      this.pos[1] = 0;
      this.vel[1] = -this.vel[1];
      this.impact = true;
    } else if ( y > _Y ) {
      this.pos[1] = _Y;
      this.vel[1] = -this.vel[1];
      this.impact = true;
    }
    if ( z < 0 ) {
      this.pos[2] = 0;
      this.vel[2] = -this.vel[2];
      this.impact = true;
    } else if ( z > _Z ) {
      this.pos[2] = _Z;
      this.vel[2] = -this.vel[2];
      this.impact = true;
    }
  }

  Node.prototype.move = function() {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
    this.pos[2] += this.vel[2];

    this.offx = this.pos[0];
    this.offy = this.pos[1];

    // for fake 3d effect
    // this.offx = ( this.pos[0] + ( ( (_X / 2) - this.pos[0] ) * ( 0.3 * ( this.pos[2]/_X ) ) ) );
    // this.offy = ( this.pos[1] + ( ( (_Y / 2) - this.pos[1] ) * ( 0.3 * ( this.pos[2]/_Y ) ) ) );

    this.testOutOfBounds();
  }

  var Web = function( canvasctx ) {
    this.ctx = canvasctx;
    this.nodes = [];
  }

  Web.prototype.start = function() {
    for (var i = 0; i < NODE_COUNT; i++) {
      this.nodes.push( new Node( this.ctx ) );
    }
    // kick off the show
    this.render();
  }

  Web.prototype.render = function() {
    this.ctx.clearRect(0,0,_X,_Y);
    var dist, x1, y1, z1, x2, y2, z2, r, g, b, alpha, closest;
    for (var f = 0; f < this.nodes.length; f++) {
      x1 = this.nodes[f].pos[0];
      y1 = this.nodes[f].pos[1];
      z1 = this.nodes[f].pos[2];
      for (var s = f+1; s < this.nodes.length; s++) {
        x2 = this.nodes[s].pos[0];
        y2 = this.nodes[s].pos[1];
        z2 = this.nodes[s].pos[2];
        dist = Math.sqrt( Math.pow((x1-x2),2) + Math.pow((y1-y2),2) + Math.pow((z1-z2),2) );
        if ( dist < MAXDIST ) {
          color = _COLORS[ (f + s) % _COLORS.length ];
          alpha = intensity( dist );
          this.ctx.lineWidth = Math.max( 1, alpha * 2 );
          r = color[0];
          g = color[1];
          b = color[2]
          this.ctx.strokeStyle = "rgba(" + r +"," + g + "," + b + "," + alpha + ")";
          this.ctx.beginPath();
          this.ctx.moveTo(this.nodes[f].offx,this.nodes[f].offy);
          this.ctx.lineTo(this.nodes[s].offx,this.nodes[s].offy);
          this.ctx.stroke();
        }
      }
      this.nodes[f].move();
    }
    requestAnimationFrame( this.render.bind(this) );
  };

  Web.prototype.collectNodes = function(x,y) {
    this.nodes.forEach( function( node ) {
      node.vel[0] = Math.random() * 4 - 2;
      node.vel[1] = Math.random() * 4 - 2;
    });
  };

  document.addEventListener( "DOMContentLoaded", function() {
    var canvas = document.getElementById("canvas");
    canvas.width = _X;
    canvas.height = _Y;
    var ctx = canvas.getContext("2d");
    ctx.globalCompositeOperation = "lighter";

    var web = new Web( ctx );
    web.start();

    document.addEventListener("click", function(e) { web.collectNodes(e.pageX, e.pageY) } );
  });

  var resizeWindow = function() {
    _X = window.innerWidth;
    _Y = window.innerHeight;
    _Z = ( _X + _Y ) / 2;

    canvas.width = _X;
    canvas.height = _Y;
  }

  window.onresize = resizeWindow;
})();
