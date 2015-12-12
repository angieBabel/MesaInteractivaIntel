
var GP2Y0A_AREF = 5.0;
var SAMPLES_PER_QUERY = 1;

var IRProximity = require('jsupm_gp2y0a');

//Lectura de infrarrojos
var myVolts0 = new IRProximity.GP2Y0A(0);
var myVolts1 = new IRProximity.GP2Y0A(1);
var myVolts2 = new IRProximity.GP2Y0A(2);
var myVolts3 = new IRProximity.GP2Y0A(3);
var myVolts4 = new IRProximity.GP2Y0A(4);
var myVolts5 = new IRProximity.GP2Y0A(5);

//Pantalla
var useUpmVersion = true;//versión
var mraa = require('mraa');
var version = mraa.getVersion();

//valores leidos
var valor0=0;
var valor1=0;
var valor2=0;
var valor3=0;
var valor4=0;
var valor5=0;

//Leds
var led0= new mraa.Gpio(2);
var led1= new mraa.Gpio(3);
var led2= new mraa.Gpio(4);
var led3= new mraa.Gpio(5);
var led4= new mraa.Gpio(6);
var led5= new mraa.Gpio(7);

//Establewcer dirección
led0.dir(mraa.DIR_OUT);
led1.dir(mraa.DIR_OUT);
led2.dir(mraa.DIR_OUT);
led3.dir(mraa.DIR_OUT);
led4.dir(mraa.DIR_OUT);
led5.dir(mraa.DIR_OUT);


var ledState = true; //Boolean to hold the state of Led

periodicActivity(); //call the periodicActivity function

function periodicActivity()
{
    led0.write(ledState?1:0);
    led1.write(ledState?1:0);
    led2.write(ledState?1:0);
    led3.write(ledState?1:0);
    led4.write(ledState?1:0);
    led5.write(ledState?1:0);
  ledState = !ledState; //invert the ledState
  setTimeout(periodicActivity,1000); //call the indicated function after 1 second (1000 milliseconds)
}


if (version >= 'v0.6.1') {
    console.log('mraa version (' + version + ') ok');
}
else {
    console.log('meaa version(' + version + ') is old - this code may not work');
}

if (useUpmVersion) {
    useUpm();
}
else {
    useLcd();
}



//Iniciar lectura
var myInterval = setInterval(function()
{
    valor0=myVolts0.value(GP2Y0A_AREF, SAMPLES_PER_QUERY);
    valor1=myVolts1.value(GP2Y0A_AREF, SAMPLES_PER_QUERY);
    valor2=myVolts2.value(GP2Y0A_AREF, SAMPLES_PER_QUERY);
    valor3=myVolts3.value(GP2Y0A_AREF, SAMPLES_PER_QUERY);
    valor4=myVolts4.value(GP2Y0A_AREF, SAMPLES_PER_QUERY);
    valor5=myVolts5.value(GP2Y0A_AREF, SAMPLES_PER_QUERY);

	console.log("AREF: " + GP2Y0A_AREF + 
                ", Voltage value (higher means closer): " + 
                valor0);
}, 1000);

// Print message when exiting
process.on('SIGINT', function()
{
	clearInterval(myInterval);
	myVolts = null;
	IRProximity.cleanUp();
	IRProximity = null;
	console.log("Exiting...");
	process.exit(0);
});

function rotateColors(display) {
    var red = 0;
    var green = 128;
    var blue = 64;
    display.setColor(red, green, blue);
    setInterval(function() {
        display.setColor(red, green, blue);
  // extra padding clears out previous text
    }, 1000);
}

/**
 * Use the upm library to drive the two line display
 *
 * Note that this does not use the "lcd.js" code at all
 */
function useUpm() {
    var lcd = require('jsupm_i2clcd');
    var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);
    display.setCursor(0, 3);
    display.write('Bienvenido');
    display.setCursor(1,0);
    display.write('Comienza a jugar');
    rotateColors(display);
}

