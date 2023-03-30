const validarEntradaDeDados = (lancamento) => {
   const cpf = lancamento.cpf;
   const valor = lancamento.valor;

   const validaCPF = validarCPF(cpf);
   const validaValor = validarValor(valor);

   if (validaCPF) return validaCPF;
   if (validaValor) return validaValor;

   return null
}

const recuperarSaldosPorConta = (lancamentos) => {
   if (lancamentos) {

      const contasESaldos = agruparContasESaldos(lancamentos);

      const saldosPorConta = separarSaldoPorConta(contasESaldos);

      return saldosPorConta;
   }
   return [];
}

const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => {
   if (lancamentos) {
      const maioresMenoresLancamentos = [];

      const maioresLancamentosPorConta = recuperarMaioresLancamentos(lancamentos);
      const menoresLancamentosPorConta = recuperarMenoresLancamentos(lancamentos);

      const maiorLancamentoDaConta = maioresLancamentosPorConta[cpf];
      const menorLancamentoDaConta = menoresLancamentosPorConta[cpf];

      maioresMenoresLancamentos.push({ 'cpf': cpf, 'valor': menorLancamentoDaConta });
      maioresMenoresLancamentos.push({ 'cpf': cpf, 'valor': maiorLancamentoDaConta });

      return maioresMenoresLancamentos;
   }


   return []
}

const recuperarMaioresSaldos = (lancamentos) => {
   if (lancamentos) {
      const contasESaldos = agruparContasESaldos(lancamentos);
      const maioresSaldos = ordenarMaioresSaldos(contasESaldos);

      if (maioresSaldos.length <= 2) {
         return maioresSaldos;
      } else {
         return maioresSaldos.slice(0, 3);
      }
   }
   return []
}

const recuperarMaioresMedias = (lancamentos) => {
   if (lancamentos) {
      const contasESaldos = agruparContasESaldos(lancamentos);

      const quantidadeLancamentosPorConta = recuperarQuantidadeLancamentosPorConta(lancamentos);
      
      const mediasPorConta = recuperarMediaPorConta(contasESaldos, quantidadeLancamentosPorConta);

      const maioresMedias = ordenarMaioresMedias(mediasPorConta);

      if(maioresMedias.length <= 2){
         return maioresMedias;
      } else {
         return maioresMedias.slice(0, 3);
      }
   }
   return []
}

//================================================================================================

//verifica os dois ultimos digitos do CPF e retorna true ou false
const verificarDoisUltimosDigitos = (cpf) => {
   let contador;
   let soma;
   let modulo;
   let resto;

   //calculando o primeiro digito
   const calcularPrimeiroDigito = (cpf) => {
      soma = 0;
      contador = 10;
      for (let i = 0; i <= 8; i++) {
         const digito = Number(cpf[i]);
         soma += digito * (contador - i);
      }
      modulo = soma % 11;
      resto = 11 - modulo;
      const primeiroDigito = resto >= 10 ? 0 : resto;
      return primeiroDigito;
   }

   //calculando o segundo digito
   const calcularSegundoDigito = (cpf) => {
      soma = 0;
      contador = 11;
      for (let i = 0; i <= 9; i++) {
         const digito = Number(cpf[i]);
         soma += digito * (contador - i);
      }
      modulo = soma % 11;
      resto = 11 - modulo;
      const segundoDigito = resto >= 10 ? 0 : resto;
      return segundoDigito;
   }

   const primeiroDigitoVerificador = calcularPrimeiroDigito(cpf);
   const segundoDigitoVerificador = calcularSegundoDigito(cpf);

   //verificando primeiro digito
   const validarPrimeiroDigitoVerificador = primeiroDigitoVerificador == cpf[9];

   //verificando segundo digito
   const validarSegundoDigitoVerificador = segundoDigitoVerificador == cpf[10];

   //retorna true se ambos forem verdadeiros e false caso um deles não seja
   return validarPrimeiroDigitoVerificador && validarSegundoDigitoVerificador
}

const validarCPF = (cpf) => {

   if (!cpf) return 'Digite um CPF valido.';

   const apenasNumeros = new RegExp(/^[0-9]+$/).test(cpf);
   const tamanhoCerto = cpf.length === 11;
   const verificaDigitos = verificarDoisUltimosDigitos(cpf);

   if (!apenasNumeros) return 'Insira apenas os numeros do seu CPF.'

   if (!tamanhoCerto) return 'O CPF deve conter 11 digitos.'

   if (!verificaDigitos) return 'Os digitos verificadores do seu CPF são invalidos.'

   return null;
}

const validarValor = (valor) => {
   const ehNumero = typeof (valor) === 'number';
   const ehValido = valor >= -2000 && valor <= 15000;

   if (!ehNumero) return 'O valor digitado deve ser um numero.';
   if (!ehValido) return 'O valor deve ser no mínino -2000 e no máximo 15000.';

   return null;
}

//retorna um objeto onde cada chave é o cpf de uma conta e seu valor é o saldo acumulado
//{'cpf1': saldo, 'cpf2': saldo, 'cpf3': saldo}
const agruparContasESaldos = (lancamentos) => {
   const contasESaldos = {};

   let soma = 0;
   for (let i = 0; i < lancamentos.length; i++) {
      const lancamento = lancamentos[i];
      const cpf = lancamento.cpf;
      const valor = lancamento.valor;

      if (contasESaldos[cpf]) {
         soma = contasESaldos[cpf] + valor;
         contasESaldos[cpf] = soma;
      } else {
         contasESaldos[cpf] = valor
      }
   }
   return contasESaldos;
}

//retorna um array de objetos onde cada objeto tem o formato {cpf: numero-da-conta , valor: saldo}
//[{cpf: 'cpf1', valor: saldo}, {cpf: 'cpf2', valor: saldo}, {cpf: 'cpf3', valor: saldo}]
const separarSaldoPorConta = (contasESaldos) => {
   const listaDeContas = Object.keys(contasESaldos);
   
   const saldosPorConta = [];

   for (let i = 0; i < listaDeContas.length; i++) {
      const conta = `${listaDeContas[i]}`;
      const saldo = contasESaldos[conta];

      const saldoPorConta = {}

      saldoPorConta['cpf'] = conta;
      saldoPorConta['valor'] = saldo;
      saldosPorConta.push(saldoPorConta);
   }

   return saldosPorConta;
}

//retorna um objeto onde cada chave é o cpf de uma conta e seu valor é o maior lancamento feito
//{'cpf1': maior-lancamento, 'cpf2': maior-lancamento, 'cpf3': maior-lancamento}
const recuperarMaioresLancamentos = (lancamentos) => {
   const maioresLancamentos = {};

   for (let i = 0; i < lancamentos.length; i++) {
      const lancamento = lancamentos[i];
      const conta = lancamento.cpf;
      const valor = lancamento.valor;


      if (!maioresLancamentos[conta]) {
         maioresLancamentos[conta] = valor;
      } else {
         const maiorLancamentoDaConta = maioresLancamentos[conta];
         if (valor > maiorLancamentoDaConta) {
            maioresLancamentos[conta] = valor;
         }
      };
   }

   return maioresLancamentos;
}

//retorna um objeto onde cada chave é o cpf de uma conta e seu valor é o menor lancamento feito
//{'cpf1': menor-lancamento, 'cpf2': menor-lancamento, 'cpf3': menor-lancamento}
const recuperarMenoresLancamentos = (lancamentos) => {
   const menoresLancamentos = {};

   for (let i = 0; i < lancamentos.length; i++) {
      const lancamento = lancamentos[i];
      const conta = lancamento.cpf;
      const valor = lancamento.valor;

      if (!menoresLancamentos[conta]) {
         menoresLancamentos[conta] = valor;
      } else {
         const menorLancamentoDaConta = menoresLancamentos[conta];
         if (valor < menorLancamentoDaConta) {
            menoresLancamentos[conta] = valor;
         }
      };
   }

   return menoresLancamentos;
}

const ordenarMaioresSaldos = (contasESaldos) => {
   const contas = Object.keys(contasESaldos);
   const saldos = Object.values(contasESaldos);

   //criar uma lista de listas, onde cada lista menor contem uma conta e um valor
   const aux = [];
   for (let i = 0; i < contas.length; i++) {
      const conta = contas[i];
      const saldo = saldos[i];

      aux.push([conta, saldo]);
   };

   //ordenas essa lista
   aux.sort((a, b) => b[1] - a[1]);

   //o que eu preciso agora é montar a lista final a partir da lista ordenada
   const maioresSaldosOrdenados = [];
   for (let i = 0; i < aux.length; i++) {
      const conta = aux[i][0];
      const saldo = aux[i][1];

      maioresSaldosOrdenados.push({ 'cpf': conta, 'valor': saldo })
   };

   return maioresSaldosOrdenados;
}

//retorna a quantidade de lançamentos feitos em cada conta
const recuperarQuantidadeLancamentosPorConta = (lancamentos) => {
   const quantidadeLancamentosPorConta = {};
   for (let i = 0; i < lancamentos.length; i++) {
      const lancamento = lancamentos[i];
      const conta = `${lancamento.cpf}`;

      if (!quantidadeLancamentosPorConta[conta]) {
         quantidadeLancamentosPorConta[conta] = 1;
      } else {
         quantidadeLancamentosPorConta[conta] += 1;
      }
   }

   return quantidadeLancamentosPorConta;
}

const recuperarMediaPorConta = (contasESaldos, quantidadeLancamentosPorConta) => {
   const listaDeContas = Object.keys(contasESaldos);

   const mediasPorConta = {};
   
   for (let i = 0; i < listaDeContas.length; i++) {
      const conta = `${listaDeContas[i]}`;
      
      const saldo = contasESaldos[conta];
      
      const quantidade = quantidadeLancamentosPorConta[conta];
   
      const mediaDaConta = (saldo / quantidade).toFixed(2);

      mediasPorConta[conta] = mediaDaConta;
   }

   return mediasPorConta;
}

const ordenarMaioresMedias = (mediasPorConta) => {
   const contas = Object.keys(mediasPorConta);
   const medias = Object.values(mediasPorConta);

   const aux = [];
   for(let i = 0; i < contas.length; i++){
      const conta = contas[i];
      const media = medias[i];

      aux.push([conta, media])
   };

   aux.sort((a, b) => b[1] - a[1]);

   const maioresMedias = [];
   for(let i = 0; i < aux.length; i++){
      const conta = aux[i][0];
      const media = aux[i][1];

      maioresMedias.push({'cpf': conta, 'valor': media});
   }

   return maioresMedias;
}