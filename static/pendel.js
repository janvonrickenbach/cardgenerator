var dt;
var time;
var amp;


var lines;
var messages; 

let font = {
    size: 1000,
    type: undefined
};

function preload() {
  font.type = loadFont('static/inconsolata.ttf');
}  

function setup() {
    var params = getURLParams();

    var canvas_size = min(windowWidth, windowHeight);
    createCanvas(canvas_size, canvas_size).parent('canvasHolder');
    amp = canvas_size /2 
    var line_inputs = [...get_line_inputs(params)];
    
    lines = line_inputs.map(line_input => {
        const new_line = {
            state:{
                alpha:0,
                beta:0
            }
        };
        new_line.speed = line_input.speed;
        new_line.color = line_input.color;
        new_line.start = get_point(amp, new_line.state);
        new_line.end = get_point(amp, new_line.state);

        return new_line;
    });
    dt =get_dt(lines, params);

    var texts = [...get_text_inputs(params)];
    var n_lines = texts.length
    var margin = 0.4*canvas_size
    
    var line_height = (canvas_size- 2*margin)/ n_lines 
    var set_messages  = () => {
        messages = texts
        .map((text, idx) => create_message(text, idx, margin,canvas_size, line_height));
    }

    set_messages();

    while(messages.some(m => is_message_too_big(m, canvas_size, margin, line_height))){
        font.size -= font.size * 0.1
        set_messages();
    }

 
    textFont(font.type)
    textSize(font.size)
    strokeWeight(params.stroke? params.stroke/10: 0.1);
}

function draw() {
    time += dt;
    lines.forEach(loc_line => {
        update_line(loc_line, amp);
        draw_line(loc_line, amp);
    });

    messages.map(message => {
        fill(255)
        stroke(255)
        textAlign(CENTER, BOTTOM);
        text(message.text,message.x, message.y)
    });    
}

function* get_text_inputs(params){
    var idx = 1;
    while(params["text"+idx]){
        yield decodeURIComponent(params["text"+idx]);
        idx++;
    }
}

function* get_line_inputs(params){
    var idx = 1;
    while(params["a"+idx] && params["omega"+idx] && params["color"+idx]){   
        yield {
            speed: {a: int(params["a"+idx]), omega: int(params["omega"+idx])},
            color: decodeURIComponent(params["color"+idx])
        };     
        idx++; 
    }
}

function create_message(text, line_index,margin, canvas_size, line_height){
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

function get_dt(lines, params){
    var speeds = lines.map(loc_line =>  max(abs(loc_line.speed.a),abs(loc_line.speed.omega)));
    var max_speed = Math.max(...speeds);
    if(params.dt < 0){
        return 1/(params.dt* max_speed);
    } else {
        return params.dt/max_speed;
    }

}

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
    };
}

// Good combinations
//http://127.0.0.1:5500/?a=100&omega=10&text1=Happy adf adff asdfasf&text2=New afasf adfdsf adfasf&text3=Year adfafasf&text4=afadfa adfdaf dfaf afdafa&text5=afafasdf&color1=blue&color2=red&dt=13
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
//?dt=129&stroke=3&a1=8&omega1=1&a2=-8&omega2=1&color1=blue&color2=orange