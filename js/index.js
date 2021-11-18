function abrirSideNav() {
	document.getElementsByClassName("menu")[0].classList.add("openMenu")
}

function fecharSideNav() {
	document.getElementsByClassName("menu")[0].classList.remove("openMenu")
}

if(document.body.clientWidth > 1100){
	document.querySelectorAll(".opcao").forEach(function(e){
		e.removeAttribute("href");
	});
}

const formatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2,
});

var transactions = localStorage.getItem("transactions") ? JSON.parse(localStorage.getItem("transactions")) : [];

function focusForm(){
	fecharSideNav()
	document.getElementsByName("nomeMercadoria")[0].focus();
}

function clearTransaction(){
	let userConfirm = confirm("Deseja remover todas as transações?");
	if(userConfirm){
		fecharSideNav();
		localStorage.removeItem("transactions");
		transactions = [];
		drawTable();
	}
}

async function drawTable(){
	let total = 0;

	document.querySelectorAll("#todasTransacoes > * ").forEach((element => {
		element.remove();
	}));

	if(transactions.length == 0){
		document.querySelector("#todasTransacoes").innerHTML =`
		<div class="d-flex" id="nenhumaTransacao" style="justify-content: center;">
		<p>Nenhuma transação cadastrada.</p>
		</div>
		`
	}

	for(item in transactions){

		if(transactions[item].transType == "compra"){
			total -= transactions[item].transCurrency;
		}else{
			total += transactions[item].transCurrency;
		}

		document.getElementById("todasTransacoes").innerHTML += 
		`<div class="d-flex tabelaLinha">
		<div class="linha d-flex">
		<p class="acaoTransacao">${transactions[item].transType == "compra" ? "-" : "+"}</p>
		<p class="textoTabela linhaMercadoria">${transactions[item].transName}</p>
		<p class="textoTabela linhaValor">${formatter.format(transactions[item].transCurrency.toString().replace(/([0-9]{2})$/g, ".$1"))}</p>
		</div>
		</div>`
	}

	if(transactions.length > 0){
		document.getElementById("todasTransacoes").innerHTML += 
		`<div class="d-flex tabelaLinhaTotal">
		<div class="linha d-flex">
		<p class="textoTabela linhaTotal">Total</p>
		<div class="total">
		<p class="textoTabela linhaTotalValor">
		${formatter.format(total.toString().replace(/([0-9]{2})$/g, ".$1"))}
		</p>
		<p class="lucro">[${Math.sign(total) == 1 ? "LUCRO" : "PREJUÍZO"}]</p>
		</div>
		</div>
		</div>
		`
	}
}

function subimitForm(e){
	e.preventDefault();

	transactionCurrency = document.querySelector('input[name="valorInput"]');
	transactionName = document.querySelector('input[name="nomeMercadoria"]');
	transactionType = document.querySelector('select[name="acaoMercadoria"]');

	if(!transactionName.value){
		transactionName.focus();
		return;
	}

	console.log(!transactionCurrency.value && transactionCurrency.value.replace(/[^0-9]/g, "") == "")

	if(transactionCurrency.value.replace(/[^0-9]/g, "") == ""){
		transactionCurrency.focus();
		return;
	}

	currencyNumber = parseInt(transactionCurrency.value.replace(/[^0-9]/g, ""));

	transactions.push({
		transType: transactionType.value,
		transName: transactionName.value,
		transCurrency: currencyNumber  
	})

	transactionName.value = "";
	transactionCurrency.value = "";

	localStorage.setItem("transactions", JSON.stringify(transactions));

	drawTable();
	//Regex para adicionar . após os 2 ultimos números da linha;
	//console.log(currencyNumber.toString().replace(/([0-9]{2})$/g, ".$1"));


}

drawTable();