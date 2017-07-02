"use strict";

/** @global */
const btns = document.getElementsByTagName('button');
const form = document.getElementById('unipart-calc');
const operators = ['/', 'x', '-', '+'];

for (let i = 0; i < btns.length; i++){
	btns[i].addEventListener('click', function(){
		const val = this.value;

		if (form.input.value.indexOf('=') > -1){
			clear();
		}

		if (!isNaN(parseFloat(val))){
			addToInput(val);
		} else if (val === '.'){
			if (validate(val, 'decimal')){
				addToInput(val);
			}
		} else if (operators.indexOf(val) > -1){
			validate(val, 'operator');
		} else {
			window[val]();
		}
	});
}

/** @function addToInput */
function addToInput(val){ 
	if (form.input.value === '0' || form.input.value === ''){
		form.input.value = val;
	} else {
		form.input.value = form.input.value + val;
	}
}

/** @function sign */
function sign(){
	let splitEquation = splitLastNb(form.input.value);

	if (splitEquation[1].charAt(0) === '-'){
		splitEquation[1] = splitEquation[1].substring(1);
	} else {
		splitEquation[1] = '-' + splitEquation[1]; 
	}

	form.input.value = splitEquation[0] + ' ' + splitEquation[1];
}

/** @function powerOf */
function powerOf(){
	form.input.value += '^';
}

/** @function sqrt */
function sqrt(){
	if (validate(form.input.value, 'sqrt')){
		form.input.value += '√';
	}
}

/** @function percent */
function percent(){
	form.input.value += '%';
}

/** @function clear */
function clear(){
	form.reset();
}

/** @function equal 
 * Evaluate the equation. Loop through each entries and look for SQRT and PowerOf, evaluation those before the whole equation.
 * @throws {SyntaxError}
 */
function equal(){
	let val = form.input.value.replace(/x/g,'*');
	let valArr =  val.split(' ');

	if (validate('=', 'empty')){
		for (let i = 0; i < valArr.length; i++) {
			if (valArr[i].indexOf('^') > -1){
				const valArrSplit = valArr[i].split('^');
				valArr[i] = Math.pow(valArrSplit[0], valArrSplit[1]);
			} else if (valArr[i].indexOf('√') > -1){
				valArr[i] = Math.sqrt(valArr[i].split('√')[0]);
			} else if (valArr[i].indexOf('%') > -1){
				let prevVal = '';

				if (i === 0){
					prevVal = 1;
				} else {
					for (let j = 0; j < i - 1; j++) {
						prevVal += valArr[j];
					}
				}

				valArr[i] = (eval(prevVal) / 100) * 50;
			}
		}

		val = valArr.join(' ');

		try {
		    form.output.value = eval(val);
		} catch (e) {
		    if (e instanceof SyntaxError) {
		        alert(e.message);
		        return false;
		    }
		}

		addToInput(' =');
	}
}

/** @function lastChar
 * Return the last character from the equation
 * @param {string} str - The whole equation
 * @returns {string}
 */
function lastChar(str){
	str = str.replace(/ /g,'');
	return str.charAt(str.length - 1);
}

/** @function splitLastNb
 * Return an array containing the last entry and the rest of the equation
 * @param {string} str - The whole equation
 * @returns {array} - Key [0] is the rest of the equation and [1] is the last entry
 */
function splitLastNb(str){
	const lastIndex = str.lastIndexOf(' ');
	return [str.substring(0, lastIndex), str.substr(lastIndex + 1)];
}

/** @function validate
 * Validate several use cases
 * @param {string} oper - The operator used
 * @param {string} type - The name of the validation we need
 * @returns {boolean}
 */
function validate(oper, type){
	let valid = true;
	const lastNb = splitLastNb(form.input.value)[1];

	if (type === 'operator'){
		let inputLastChar = lastChar(form.input.value);
		
		if (oper !== inputLastChar && isNaN(parseFloat(inputLastChar)) && inputLastChar !== '√' && inputLastChar !== '^'){
			form.input.value = form.input.value.trim().slice(0, -2);
			inputLastChar = lastChar(form.input.value);
		}

		if (operators.indexOf(inputLastChar) === -1 && inputLastChar !== ''){
			addToInput(' ' + oper + ' ');
		}
	} else if (type === 'sqrt'){

		if (lastNb.indexOf('-') > -1){
			alert('Negative square root number cannot be evaluated.')
			valid = false;
		}
	} else if (type === 'empty'){
		if (form.input.value === ''){
			alert('Please type an equation.');
			valid = false;
		}
	} else if (type === 'decimal'){
		if (form.input.value === '' || isNaN(parseFloat(lastNb)) || lastNb.indexOf('.') > -1){
			valid = false;
		} 
	}

	return valid;
}