var time = 0;
var dt  
//http://127.0.0.1:5500/?a=100&omega=10&text1=Happy&text2=New&text3=Year&color1=blue&color2=red&dt=13
//http://127.0.0.1:5500/?a=100&omega=10&text1=Happy&text2=New&text3=Year&color1=blue&color2=orange&dt=20000
//http://127.0.0.1:5500/?dt=1000&a=1&omega=5&text1=Happy&text2=New&text3=Year&color1=blue&color2=orange&
//http://127.0.0.1:5500/?dt=1000&a=1&omega=1&text1=Happy&text2=New&text3=Year&color1=blue&color2=orange&
//http://127.0.0.1:5500/?dt=1000&a=1&omega=10&text1=Happy&text2=New&text3=Year&color1=blue&color2=orange&
//http://127.0.0.1:5500/?dt=2000&a=1&omega=100&text1=Happy&text2=New&text3=Year&color1=blue&color2=orange&
//http://127.0.0.1:5500/?dt=2000&a=100&omega=1&text1=Happy&text2=New&text3=Year&color1=blue&color2=orange&
//http://127.0.0.1:5500/?dt=12345480&a=2&omega=1&text1=Happy&text2=New&text3=Year&color1=blue&color2=orange&
//http://127.0.0.1:5500/?dt=1100001&a=2&omega=1&text1=Happy&text2=New&text3=Year&color1=blue&color2=orange&
//http://127.0.0.1:5500/?dt=1100000&a=2&omega=1&text1=Happy&text2=New&text3=Year&color1=blue&color2=orange&
//http://127.0.0.1:5500/?dt=70000000&a=7&omega=1&text1=Happy&text2=New&text3=Year&color1=blue&color2=orange&
//http://127.0.0.1:5500/?dt=1290000000&a=8&omega=1&text1=Happy&text2=New&text3=Year&color1=blue&color2=orange&
//http://127.0.0.1:5500/?dt=129&a=8&omega=1&text1=Happy&text2=New&text3=Year&color1=blue&color2=orange&
var x1
var x2
var y1
var y2

var prev_x1
var prev_x2
var prev_y2
var prev_y1

var a
var b = 1
var omega
var beta = 0

var canvas_size = 500
var amp = canvas_size/2
var text_w = []
var text_h = []
var text_x
var text_y
var fontsize = 100
var messages 

var dt_fac

var points
var params
let font;
function preload() {

  font = loadFont('static/inconsolata.ttf');
}  

function setup() {
    params = getURLParams();
    a = params.a
    omega = params.omega
    if(params.dt < 0){
        dt = 1/(params.dt* max(a,omega))
    } else {
        dt = params.dt/(max(a,omega))
    }
    messages = [params.text1, params.text2, params.text3]
    createCanvas(canvas_size, canvas_size).parent('canvasHolder');
    prev_x1 = get_x(0)
    prev_y1 = get_y(0)
    x1 = get_x(0)
    y1 = get_y(0)

    prev_x2 = get_x(0)
    prev_y2 = get_y(0)
    x2 = get_x(0)
    y2 = get_y(0)
    
    let bboxes = messages.map(message => font.textBounds(message, 10, 10, fontsize));
    text_w = bboxes.map(bbox => bbox.w)
    text_h = bboxes.map(bbox => bbox.h)
    var lines = 3
    line_height = canvas_size / lines
    line_heights = [0.3, 1,1.7]
    text_y = text_h.map((height, idx) => line_heights[idx]*line_height + height + (line_height-height) /2 )
    text_x = text_w.map(width => (canvas_size - width)/2)
    textFont(font)
    textSize(fontsize)

    strokeWeight(0.4);
    fill(255);
}


function draw() {
    time += dt;
    beta +=omega*dt
    prev_x1 = x1
    prev_y1 = y1
    x1 = get_x(time)
    y1 = get_y(time)
    prev_x2 = x2
    prev_y2 = y2
    x2 = get_x(-time)
    y2 = get_y(-time)
    stroke(params.color1);

    line(prev_x1,prev_y1, x1,y1)
    stroke(params.color2);
    line(prev_x2,prev_y2, x2,y2)
    stroke(255)

    messages.map((message,idx) => text(message, text_x[idx], text_y[idx]));    
}

function get_x(loc_t){
    return sin(a*loc_t) * cos(beta) * amp + amp
}

function get_y(loc_t){
    return  sin(a*loc_t) * sin(b*beta) * amp + amp
}