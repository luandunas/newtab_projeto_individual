const letterPattern = /[^0-9]/;
var letterReplacer = new RegExp(letterPattern, "g");
var totalInput = ""
var formatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

async function formatMoney(e){
	if(letterPattern.test(e.key)){
		//console.log(e.key)
		e.preventDefault();
		return;
	}
	if(!e.target.value) return;

	valor = e.target.value.toString();
	valor = valor.replace(/[\D]+/g, '');
	valor = valor.replace(/([0-9]{1})$/g, ",$1");

	if(valor.length >= 6){
		while(/([0-9]{4})[,|\.]/g.test(valor)){
			valor = valor.replace(/([0-9]{1})$/g, ",$1");
			valor = valor.replace(/([0-9]{3})[,|\.]/g, ".$1");
		}
	}

	e.target.value = valor;
}