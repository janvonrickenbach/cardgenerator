var dt;
var time;
var amp;

function create_line(){
    return {
        state: {
            alpha:0,
            beta:0
        },
        speed: {
            a:0,
            omega:0
        },
        color: undefined,
        start: {x: 0, y:0},
        end: {x: 0, y:0}
    }
};

var line1;
var line2;

var messages; 

let font = {
    size: 1000,
    type: undefined
};

function preload() {
  font.type = loadFont('static/inconsolata.ttf');
}  

function setup() {
    line1= create_line();
    line2= create_line();
    var params = getURLParams();
    line1.speed.a = params.a;
    line2.speed.a = -params.a;

    line1.speed.omega = params.omega;
    line2.speed.omega = params.omega;

    dt =get_dt(params);

    line1.color = params.color1;
    line2.color = params.color2;

    var canvas_size = min(windowWidth, windowHeight);
    createCanvas(canvas_size, canvas_size).parent('canvasHolder');
    amp = canvas_size /2 

    line1.start= get_point(amp, line1.state)
    line1.end = get_point( amp, line1.state)

    line2.start= get_point(amp, line2.state)
    line2.end = get_point( amp, line2.state)

    var texts = [params.text1, params.text2, params.text3]
    var lines = texts.length
    var margin = 0.25*canvas_size
    
    line_height = (canvas_size- 2*margin)/ lines 
    var set_messages  = () => {
        messages = texts
        .map((text, idx) => create_message(text, idx, margin,canvas_size))
    }

    set_messages();

    while(messages.some(m => is_message_too_big(m, canvas_size, margin, line_height))){
        font.size -= font.size * 0.1
        set_messages();
    }
 
    textFont(font.type)
    textSize(font.size)
    strokeWeight(0.4);
}

function draw() {
    time += dt;
    update_line(line1, amp)
    update_line(line2, amp)

    draw_line(line1)
    draw_line(line2)

    messages.map(message => {
        fill(255)
        stroke(255)
        textAlign(CENTER, BOTTOM);
        text(message.text,message.x, message.y)
    });    
}

function create_message(text, line_index,margin, canvas_size){
    var bbox = font.type.textBounds(text, 200, 200, font.size)
    var y= margin+ (line_index+1)*line_height
    return {
        text:text,
        w: bbox.w,
        h: bbox.h,
        y:y,
        x:canvas_size/2
    }
}

function get_point( amp, state){
    return {
        x: get_x(amp, state),
        y: get_y(amp, state)
    }
}

function get_x(amp, state){
    return sin(state.alpha) * cos(state.beta) * 0.9*amp + amp
}

function get_y(amp, state){
    return  sin(state.alpha) * sin(state.beta) * 0.9*amp + amp
}

function update_line(line, amp){
    update_state(line)
    line.start = line.end
    line.end = get_point(amp, line.state)
}

function draw_line(line_input){
    stroke(line_input.color);
    line(line_input.start.x, line_input.start.y, line_input.end.x,line_input.end.y)
}

function update_state(line){
    line.state.alpha += line.speed.a*dt
    line.state.beta +=line.speed.omega*dt
}

function is_message_too_big(message, canvas_size, margin, line_height){
    return message.w > (canvas_size - margin) || message.h > line_height
}

function get_dt(params){
    var max_speed = max(params.a,params.omega)
    if(params.dt < 0){
        return 1/(params.dt* max_speed)
    } else {
        return params.dt/(max_speed)
    }

}


// Good combinations
//http://127.0.0.1:5500/?a=100&omega=10&text1=Happy&text2=New&text3=Year&color1=blue&color2=red&dt=13
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