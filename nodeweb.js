(function(){
  var _X = 600;
  var _Y = 600;

  _X = window.innerWidth;
  _Y = window.innerHeight;

  var _Z = ( _X + _Y ) / 2;

  var Node = function( ctx ) {
    var x = Math.random() * _X;
    var y = Math.random() * _X;
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

    // fake 3d
    this.offx = ( this.pos[0] + ( ( (_X / 2) - this.pos[0] ) * ( 0.3 * ( this.pos[2]/_X ) ) ) );
    this.offy = ( this.pos[1] + ( ( (_Y / 2) - this.pos[1] ) * ( 0.3 * ( this.pos[2]/_Y ) ) ) );

    this.testOutOfBounds();
  }

  var Web = function( canvasctx ) {
    this.ctx = canvasctx;
    this.nodes = [];
  }

  Web.prototype.start = function() {
    // this.ctx.fillStyle = "blue";
    // this.ctx.fillRect(20,20,150,100);
    for (var i = 0; i < 40; i++) {
      this.nodes.push( new Node( this.ctx ) );
    }
    // kick off the show
    this.render();
  }

  Web.prototype.render = function() {
    this.ctx.clearRect(0,0,_X,_Y);
    var dist, x1, y1, z1, x2, y2, z2, color;
    for (var f = 0; f < this.nodes.length; f++) {
      for (var s = f+1; s < this.nodes.length; s++) {
        x1 = this.nodes[f].pos[0];
        y1 = this.nodes[f].pos[1];
        z1 = this.nodes[f].pos[2];
        x2 = this.nodes[s].pos[0];
        y2 = this.nodes[s].pos[1];
        z2 = this.nodes[s].pos[2];
        dist = Math.sqrt( Math.pow((x1-x2),2) + Math.pow((y1-y2),2) + Math.pow((z1-z2),2) );
        if ( dist < _Z * 2 ) {
          color = 1/Math.pow(dist,2) * 30 * _Z;
          this.ctx.strokeStyle = "rgba(255,255,255," + color + ")";
          this.ctx.beginPath();
          this.ctx.moveTo(this.nodes[f].offx,this.nodes[f].offy);
          this.ctx.lineTo(this.nodes[s].offx,this.nodes[s].offy);
          this.ctx.stroke();
      }
      }
      // this.nodes[f].draw();
      this.nodes[f].move();
    }
    requestAnimationFrame( this.render.bind(this) );
  }

  document.addEventListener( "DOMContentLoaded", function() {
    var canvas = document.getElementById("canvas");
    canvas.width = _X;
    canvas.height = _Y;
    var ctx = canvas.getContext("2d");

    var web = new Web( ctx );
    web.start();
  });

  var resizeWindow = function() {
    _X = window.innerWidth;
    _Y = window.innerHeight;
    _Z = ( _X + _Y ) / 2;

    canvas.width = _X;
    canvas.height = _Y;
  }

  window.onresize = resizeWindow;

  // var projectedX = function( x, z ) {
  //   console.log(x,z);
  //   var projx = ( x + ( (200-x) * 0.3 ) );
  //   console.log(projx);
  // }
  //
  // projectedX( 0, 400 );
  // projectedX( 400, 400);
})();
