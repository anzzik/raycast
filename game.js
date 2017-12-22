function Vector(x, y)
{
	this.x = x;
	this.y = y;

	this.set = function(x, y)
	{
		this.x = x;
		this.y = y;
	};

	this.add = function(v)
	{
		this.x += v.x;
		this.y += v.y;
	};

	this.sub = function(v)
	{
		this.x -= v.x;
		this.y -= v.y;
	};

	this.rotate = function(a)
	{
		var mat = [
			Math.cos(a), Math.sin(a) * -1,
			Math.sin(a), Math.cos(a)
		];	

		var t_x = this.x * mat[0] + this.y * mat[1];
		var t_y = this.x * mat[2] + this.y * mat[3];

		this.x = Math.round(t_x * 100000) / 100000;
		this.y = Math.round(t_y * 100000) / 100000;
	};

	this.mul = function(a)
	{
		this.x *= a;
		this.y *= a;
	};
}

function Texture(id, w, h)
{
	this.id = id;
	this.img = document.getElementById(id);
	this.pixeldata = null;

	this.canvas = document.createElement('canvas');
	this.canvas.width = w;
	this.canvas.height = h;

	var ctx = this.canvas.getContext('2d');
	ctx.drawImage(this.img, 0, 0, 128, 128);

	this.pixeldata = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
}

function Player()
{
	this.pos = new Vector(2.332, 2.6655);
	this.dir = new Vector(1.0, 0);

	this.fwd_speed = 0.03;
	this.side_speed = 0.03;
	this.rot = Math.PI / 100;

	this.tmp = new Vector(0.0, 0.0);

	this.moving = {
		'forward': 0,
		'left': 0,
		'back': 0,
		'right': 0,
	};

	this.rotating = {
		'left': 0,
		'right': 0,
	};

	this.tick = function(g)
	{
		if (this.moving.forward)
		{
			this.tmp.set(this.dir.x, this.dir.y);
			this.tmp.mul(this.fwd_speed);

			if (!g.map.intersect(this.pos.x + this.dir.x + this.tmp.x, this.pos.y + this.dir.y + this.tmp.y))
				this.pos.add(this.tmp);
		}

		if (this.moving.back)
		{
			this.tmp.set(this.dir.x, this.dir.y);
			this.tmp.mul(this.fwd_speed);

			if (!g.map.intersect(this.pos.x - this.dir.x - this.tmp.x, this.pos.y - this.dir.y - this.tmp.y))
				this.pos.sub(this.tmp);

		}

		if (this.moving.left)
		{
			this.tmp.set(this.dir.x, this.dir.y);
			this.tmp.rotate(-Math.PI / 2);
			this.tmp.mul(this.side_speed);

			if (!g.map.intersect(this.pos.x + this.tmp.x * 5, this.pos.y + this.tmp.y * 5))
				this.pos.add(this.tmp);
		}

		if (this.moving.right)
		{
			this.tmp.set(this.dir.x, this.dir.y);
			this.tmp.rotate(Math.PI / 2);
			this.tmp.mul(this.side_speed);

			if (!g.map.intersect(this.pos.x + this.tmp.x * 4, this.pos.y + this.tmp.y * 4))
				this.pos.add(this.tmp);

		}

		if (this.rotating.left)
		{
			this.dir.rotate(-this.rot);
		}

		if (this.rotating.right)
		{
			this.dir.rotate(this.rot);
		}
	};
}

function Map()
{
	this.data = [
		1,1,1,1,1,1,1,1,1,1,1,1,
		1,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,1,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,1,
		1,1,1,0,0,0,0,0,0,0,0,1,
		1,1,1,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,1,
		1,1,1,1,1,0,1,1,1,0,0,1,
		1,1,1,1,1,0,1,1,1,0,0,1,
		1,0,0,1,1,0,1,1,1,0,0,1,
		1,0,0,0,0,0,1,1,0,0,0,1,
		1,0,0,0,0,0,1,1,0,0,0,1,
		1,1,1,1,1,1,1,1,1,1,1,1
	];

	this.tex = new Texture('wall_tex', 16, 16);

	this.w = 12;
	this.h = this.data.length / 12;

	this.intersect = function(x, y)
	{
		var m_x = Math.floor(x);
		var m_y = Math.floor(y);

		if (this.data[m_y * this.w + m_x])
		{
			return true;
		}

		return false;
	};
}

function View()
{
	this.w  = 800;
	this.h  = 600;

	this.map = [
		1,1,1,1,1,1,1,1,1,1,1,1,
		1,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,1,1,0,0,0,1,
		1,0,0,0,0,0,1,1,0,0,0,1,
		1,1,1,0,0,0,1,1,0,0,0,1,
		1,1,1,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,1,
		1,0,0,0,0,0,0,0,0,0,0,1,
		1,1,1,1,1,0,1,1,1,0,0,1,
		1,1,1,1,1,0,1,1,1,0,0,1,
		1,0,0,1,1,0,1,1,1,0,0,1,
		1,0,0,0,0,0,1,1,0,0,0,1,
		1,0,0,0,0,0,1,1,0,0,0,1,
		1,1,1,1,1,1,1,1,1,1,1,1
	];

	this.pp = new Vector(0, 0);

	this.pixels = [];

	this.canvas = document.getElementById('canvas');
	this.canvas.width = this.w;
	this.canvas.height = this.h;
	this.ctx = this.canvas.getContext('2d');

	this.imagecanvas = document.createElement('canvas');
	this.imagecanvas.width = this.w;
	this.imagecanvas.height = this.h;

	this.imgdata = this.ctx.createImageData(this.w, this.h);

	this.render = function(game)
	{
		var pl	  = game.player;
		var v	  = new Vector(0, 0);
		var r	  = new Vector(0, 0);
		var step  = new Vector(0, 0);
		var init_delta = new Vector(0, 0);
		var delta = new Vector(0,0);
		var map = game.map;

		this.pp.set(pl.dir.x, pl.dir.y);
		this.pp.rotate(Math.PI / 2);
		this.pp.mul(0.66);

		for (x = 0; x < this.w; x++)
		{
			var m_pos = new Vector(Math.floor(pl.pos.x), Math.floor(pl.pos.y));
			var c = 2 * x / this.w - 1;

			v.x = this.pp.x;
			v.y = this.pp.y;

			v.mul(c);

			r.set(pl.dir.x, pl.dir.y);
			r.add(v);

			delta.x = Math.sqrt(1 + (r.y * r.y) / (r.x * r.x));
			delta.y = Math.sqrt(1 + (r.x * r.x) / (r.y * r.y));

			if (r.x < 0)
			{
				step.x = -1;
				init_delta.x = (pl.pos.x - m_pos.x) * delta.x;
			}
			else
			{
				step.x = 1;
				init_delta.x = (m_pos.x + 1.0 - pl.pos.x) * delta.x;
			}

			if (r.y < 0)
			{
				step.y = -1;
				init_delta.y = (pl.pos.y - m_pos.y) * delta.y;
			}
			else
			{
				step.y = 1;
				init_delta.y = (m_pos.y + 1.0 - pl.pos.y) * delta.y;
			}

			var hit = 0;
			var side = 0;
			var perpdist = 0;
			var wall_h = 0;
			var c = 0

			while (!hit && c < 50)
			{
				if (init_delta.x < init_delta.y)
				{
					init_delta.x += delta.x;
					m_pos.x += step.x;
					side = 0;
				}
				else
				{
					init_delta.y += delta.y;
					m_pos.y += step.y;
					side = 1;
				}

				if (map.data[m_pos.y * 12 + m_pos.x] > 0)
				{
					hit = 1;
				}

				c++;
			}

			if (side == 0)
			{
				perpdist = (m_pos.x - pl.pos.x + (1 - step.x) / 2) / r.x;
			}
			else
			{
				perpdist = (m_pos.y - pl.pos.y + (1 - step.y) / 2) / r.y;
			}

			wall_h = this.h / perpdist;

			var offset = 0;
			if (wall_h < this.h)
			{
				offset = Math.floor((this.h - wall_h) / 2);
			}

			var tex = game.map.tex;

			var tex_x = 0;
			var tex_y = 0;
			var tex_offset = wall_h / 16;

			var wallX = 0;
			var texX = 0;
			var texY = 0;

			if (side == 0)
				wallX = pl.pos.y + perpdist * r.y;
			else
				wallX = pl.pos.x + perpdist * r.x;

			wallX -= Math.floor(wallX);

			texX = Math.floor(wallX * 16);

			if (side == 0 && r.x > 0)
			{
				texX = 16 - texX - 1;
			}

			if(side == 1 && r.y < 0)
			{
				texX = 16 - texX - 1;
			}

			for (y = 0; y < this.h; y++)
			{
				if (y < offset)
				{
					this.pixels[y * this.w + x] = 0xffffffff;
					continue;
				}

				if (y > (this.h - offset))
				{
					this.pixels[y * this.w + x] = 0xffffffff;
					continue;
				}

				var d = y * 256 - this.h * 128 + wall_h * 128;
				texY = Math.floor(((d * 16) / wall_h) / 256);

				this.pixels[y * this.w + x]  = 0x0; 
				this.pixels[y * this.w + x] |= tex.pixeldata.data[texY * 16 * 4 + texX * 4 + 0] << 24;
				this.pixels[y * this.w + x] |= tex.pixeldata.data[texY * 16 * 4 + texX * 4 + 1] << 16;
				this.pixels[y * this.w + x] |= tex.pixeldata.data[texY * 16 * 4 + texX * 4 + 2] << 8;
				this.pixels[y * this.w + x] |= 0xff; 
			}
		}
	};

	this.draw = function()
	{
		for (i = 0; i < this.pixels.length; i++)
		{
			var p = this.pixels[i];

			this.imgdata.data[i * 4 + 0] = (p >> 24) & 0xff;
			this.imgdata.data[i * 4 + 1] = (p >> 16) & 0xff;
			this.imgdata.data[i * 4 + 2] = (p >> 8) & 0xff;
			this.imgdata.data[i * 4 + 3] = 255; // alpha
		}

		this.imagecanvas.getContext("2d").putImageData(this.imgdata, 0, 0);
		this.ctx.drawImage(this.imagecanvas, 0, 0, this.w, this.h, 0, 0, this.w, this.h);
	};
}

function Game()
{
	this.view = new View();
	this.player = new Player();
	this.map = new Map();

	this.start = function()
	{
		setInterval(this.loop, 20);
	};

	this.onkey = function(e)
	{
		g = e.view.g;

		switch (e.key)
		{
			case 'w':
				if (e.type == 'keydown')
					g.player.moving.forward = 1;
				if (e.type == 'keyup')
					g.player.moving.forward = 0;

				break;

			case 'a':
				if (e.type == 'keydown')
					g.player.moving.left = 1;
				if (e.type == 'keyup')
					g.player.moving.left = 0;
				break;

			case 's':
				if (e.type == 'keydown')
					g.player.moving.back = 1;
				if (e.type == 'keyup')
					g.player.moving.back = 0;

				break;

			case 'd':
				if (e.type == 'keydown')
					g.player.moving.right = 1;
				if (e.type == 'keyup')
					g.player.moving.right = 0;
				break;

			case 'ArrowLeft':
				if (e.type == 'keydown')
					g.player.rotating.left = 1;
				if (e.type == 'keyup')
					g.player.rotating.left = 0;
				break;

			case 'ArrowRight':
				if (e.type == 'keydown')
					g.player.rotating.right = 1;
				if (e.type == 'keyup')
					g.player.rotating.right = 0;

				break;
		}
	};

	this.loop = function()
	{
		this.g.player.tick(this.g);
		this.g.view.render(this.g);
		this.g.view.draw();
	};
}

window.onload = function() {
	g = new Game();
	document.onkeydown = g.onkey;
	document.onkeyup = g.onkey;
	g.start();
};

