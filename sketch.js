var seedDim = 25;

var grid;
var next;

var dA = 1.0;
var dB = .5;
var feed = .055;
var kill = .062;
// foreground & bacground colors
var fgR = 183;
var fgG = 155;
var fgB = 159;
var bgR = 58;
var bgG = 65;
var bgB = 71;

var cvn;

function setup() {
  cnv = createCanvas(400,400);
  cnv.parent("#centralImage");
  //frameRate(12);
  grid = [];
  next = [];
  for (var x = 0; x < width; x++) {
  	grid[x] = [];
  	next[x] = [];
  	for (var y = 0; y < height; y++) {
  		grid[x][y] = { a: 1, b: 0 };
  		next[x][y] = { a: 1, b: 0 };
  	}
  }

  // seed an area with B chemical
  for (var i = floor(((width/2) - (seedDim/2))); i < floor(((width/2) + (seedDim/2))); i++) {
	for (var j = floor(((height/2) - (seedDim/2))); j < floor(((height/2) + (seedDim/2))); j++) {
		grid[i][j].b = 1;
  	}
  }
}

function draw() {
  background(bgR,bgG,bgB);

  // the Algorithm
  for (var x = 1; x < width-1; x++) {
  	for (var y = 1; y < height-1; y++) {
  		var a = grid[x][y].a;
  		var b = grid[x][y].b;
  		next[x][y].a = a +
  						(dA * laplaceA(x,y)) -
  						(a * b * b) +
  						(feed * (1 - a));
  		next[x][y].b = b +
  						(dB * laplaceB(x,y)) +
  						(a * b * b) -
  						((kill + feed) * b);

  		next[x][y].a = constrain(next[x][y].a, 0, 1 );
  		next[x][y].b = constrain(next[x][y].b, 0, 1 );
  	}
  }

  loadPixels();
  for (var x = 0; x < width; x++) {
  	for (var y = 0; y < height; y++) {
  		var pix = (x + y * width) * 4;
  		var a = grid[x][y].a;
  		var b = grid[x][y].b
  		var c = a-b;
  		//var c = floor((a-b) * 255);
  		// c = constrain(c, 0, 255);
  		
  		pixels[pix + 0] = lerp(fgR,bgR,c);
  		pixels[pix + 1] = lerp(fgG,bgG,c);
  		pixels[pix + 2] = lerp(fgB,bgB,c);
  		pixels[pix + 3] = 255;
  	}
  }

  updatePixels();

  swap();

}

function swap()
{
	var temp = grid;
	grid = next
	next = temp;
}

function laplaceA(x,y)
{
	var sumA = 0;
	var center = -1;
	var adj = 0.2;
	var diag = 0.05;

	sumA += grid[x][y].a * center;
	sumA += grid[x-1][y].a * adj;
	sumA += grid[x+1][y].a * adj;
	sumA += grid[x][y-1].a * adj;
	sumA += grid[x][y+1].a * adj;
	sumA += grid[x+1][y+1].a * diag;
	sumA += grid[x+1][y-1].a * diag;
	sumA += grid[x-1][y-1].a * diag;
	sumA += grid[x-1][y+1].a * diag;
	return sumA;
}

function laplaceB(x,y)
{
	var sumB = 0;
	var center = -1;
	var adj = 0.2;
	var diag = 0.05;

	sumB += grid[x][y].b * center;
	sumB += grid[x-1][y].b * adj;
	sumB += grid[x+1][y].b * adj;
	sumB += grid[x][y-1].b * adj;
	sumB += grid[x][y+1].b * adj;
	sumB += grid[x+1][y+1].b * diag;
	sumB += grid[x+1][y-1].b * diag;
	sumB += grid[x-1][y-1].b * diag;
	sumB += grid[x-1][y+1].b * diag;
	return sumB;
}