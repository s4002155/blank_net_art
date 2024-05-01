document.body.style.margin   = 0;
document.body.style.overflow = 'hidden';

const cnv = document.getElementById('cnv_element');
cnv.width = innerWidth;
cnv.height = innerHeight;

const ctx = cnv.getContext('2d');

// Function to draw the image on the canvas
const draw_image = () => {
   const scale = Math.min(cnv.width / img.width, cnv.height / img.height);
   const offsetX = (cnv.width - img.width * scale) / 2;
   const offsetY = (cnv.height - img.height * scale) / 2;
   ctx.drawImage(img, offsetX, offsetY, img.width * scale, img.height * scale);
};

// Ensure canvas resizes when window is resized
window.onresize = () => {
   cnv.width = innerWidth;
   cnv.height = innerHeight;
   draw_image();
};

let img_data;

// Load the image and draw it on the canvas
const img = new Image();
img.onload = () => {
   draw_image();
   img_data = cnv.toDataURL('image/jpeg');
   add_glitch();
};
img.src = 'image.jpg';

console.dir(img);

const rand_int = max => Math.floor(Math.random() * max);

const glitchify = (data, chunk_max, repeats) => {
   const chunk_size = rand_int(chunk_max / 4) * 4;
   const i = rand_int(data.length - 24 - chunk_size) + 24;
   const front = data.slice(0, i);
   const back = data.slice(i + chunk_size, data.length);
   const result = front + back;
   return repeats == 0 ? result : glitchify(result, chunk_max, repeats - 1);
};

const glitch_arr = [];

const add_glitch = () => {
   const i = new Image();
   i.onload = () => {
      glitch_arr.push(i);
      if (glitch_arr.length < 12) add_glitch();
      else draw_frame();
   };
   i.src = glitchify(img_data, 96, 6);
};

let is_glitching = false;
let glitch_i = 0;

const draw_frame = () => {
   if (is_glitching) draw(glitch_arr[glitch_i]);
   else draw(img);

   const prob = is_glitching ? 0.05 : 0.02;
   if (Math.random() < prob) {
      glitch_i = rand_int(glitch_arr.length);
      is_glitching = !is_glitching;
   }

   requestAnimationFrame(draw_frame);
};

// Function to draw an image on the canvas with original dimensions
const draw = i => {
   const scale = Math.min(cnv.width / i.width, cnv.height / i.height);
   const offsetX = (cnv.width - i.width * scale) / 2;
   const offsetY = (cnv.height - i.height * scale) / 2;
   ctx.drawImage(i, offsetX, offsetY, i.width * scale, i.height * scale);
};