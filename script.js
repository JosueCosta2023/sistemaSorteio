function exibirFeedback(mensagem, tipo = 'sucesso') {
    const feedback = document.getElementById('feedback');
    feedback.textContent = mensagem;
    feedback.className = `feedback ${tipo}`;
    
    if (tipo === 'sucesso') {
        setTimeout(() => {
            feedback.classList.remove(tipo);
        }, 5000);
    }
}

// Listas de dados
const dados = {
    aberturaOps: [],
    fechamentoOps: [],
    aberturaPdvs: [],
    fechamentoPdvs: [],
    operadoresGeral: [],
    pdvsGeral: []
};

let tipoDiaAtual = 'util'; // 'util' ou 'feriado'
let temSorteioRealizado = false; // Controla se há dados sorteados

function adicionarItem(event, tipo) {
    console.log('=== adicionarItem chamado ===');
    console.log('Evento:', event);
    console.log('Tipo:', tipo);
    console.log('Objeto dados no momento:', dados);
    console.log('dados[tipo]:', dados[tipo]);
    console.log('typeof dados[tipo]:', typeof dados[tipo]);
    
    // Se foi pressionada uma tecla (event.key), verifica se é Enter
    if (event && event.key && event.key !== 'Enter') {
        console.log('Tecla não é Enter, retornando');
        return;
    }
    if (event && event.preventDefault) event.preventDefault();

    // Mapear os tipos para os IDs corretos
    const mapaTipos = {
        'aberturaOps': 'inputAberturaOps',
        'fechamentoOps': 'inputFechamentoOps',
        'aberturaPdvs': 'inputAberturaPdvs',
        'fechamentoPdvs': 'inputFechamentoPdvs',
        'operadoresGeral': 'inputOperadoresGeral',
        'pdvsGeral': 'inputPdvsGeral'
    };

    const inputId = mapaTipos[tipo];
    console.log('Procurando input com ID:', inputId);
    
    const input = document.getElementById(inputId);
    console.log('Input encontrado:', input);
    
    if (!input) {
        console.error(`❌ Input não encontrado com ID: ${inputId}`);
        alert(`❌ Input não encontrado com ID: ${inputId}`);
        return;
    }
    
    const valor = input.value.trim();
    console.log('Valor digitado:', valor);

    if (!valor) {
        console.warn('Valor vazio');
        exibirFeedback('⚠️ Digite um valor antes de adicionar!', 'aviso');
        return;
    }

    // Verificar se dados[tipo] é um array
    if (!Array.isArray(dados[tipo])) {
        console.error('ERRO: dados[tipo] não é um array!', dados[tipo]);
        // Força a criação como array
        dados[tipo] = [];
    }

    console.log('Adicionando item:', valor, 'ao tipo:', tipo);
    
    // Adiciona à lista
    dados[tipo].push(valor);
    console.log('Dados após adicionar:', dados);
    
    input.value = '';
    input.focus();

    // Atualiza a visualização
    console.log('Renderizando lista...');
    renderizarLista(tipo);
    salvarDadosNoStorage();
    exibirFeedback('✅ Item adicionado!', 'sucesso');
    console.log('=== Fim adicionarItem ===');
}

function removerItem(tipo, index) {
    dados[tipo].splice(index, 1);
    renderizarLista(tipo);
    salvarDadosNoStorage();
}

function renderizarLista(tipo) {
    const listId = `lista${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`;
    const listElement = document.getElementById(listId);
    
    console.log('Renderizando lista:', listId);
    
    listElement.innerHTML = '';

    dados[tipo].forEach((item, index) => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = `
            <p class="chip-text">${item}</p>
            <button class="chip-remove" onclick="removerItem('${tipo}', ${index})" title="Remover">🗑️</button>
        `;
        listElement.appendChild(chip);
    });
}

function validarListas(aberturaOps, fechamentoOps, aberturaPdvs, fechamentoPdvs) {
    let erros = [];
    let avisos = [];

    if (aberturaOps.length === 0 || fechamentoOps.length === 0) {
        erros.push('Lista de operadores não pode estar vazia');
    }
    if (aberturaPdvs.length === 0 || fechamentoPdvs.length === 0) {
        erros.push('Lista de PDVs não pode estar vazia');
    }

    if (aberturaOps.length !== aberturaPdvs.length) {
        avisos.push(`Abertura: ${aberturaOps.length} operador(es) vs ${aberturaPdvs.length} PDV(s)`);
    }
    if (fechamentoOps.length !== fechamentoPdvs.length) {
        avisos.push(`Fechamento: ${fechamentoOps.length} operador(es) vs ${fechamentoPdvs.length} PDV(s)`);
    }

    return { erros, avisos };
}

function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function ordenarPdvsNumericamente(pdvs) {
    // Extrai números dos PDVs e ordena numericamente
    return pdvs.sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
    });
}

function salvarDadosNoStorage() {
    const dadosComTimestamp = {
        ...dados,
        timestamp: Date.now()
    };
    localStorage.setItem('sorteio_dados', JSON.stringify(dadosComTimestamp));
    atualizarVisibilidadeBotaoLimpar(); // Atualiza visibilidade do botão
}

function restaurarDadosDoStorage() {
    const dadosArmazenados = localStorage.getItem('sorteio_dados');
    
    if (dadosArmazenados) {
        const dadosRecuperados = JSON.parse(dadosArmazenados);
        const agora = Date.now();
        const umaHora = 3600000; // 1 hora em milissegundos
        
        // Verifica se os dados ainda estão válidos (1 hora)
        if (agora - dadosRecuperados.timestamp < umaHora) {
            dados.aberturaOps = dadosRecuperados.aberturaOps || [];
            dados.fechamentoOps = dadosRecuperados.fechamentoOps || [];
            dados.aberturaPdvs = dadosRecuperados.aberturaPdvs || [];
            dados.fechamentoPdvs = dadosRecuperados.fechamentoPdvs || [];
            dados.operadoresGeral = dadosRecuperados.operadoresGeral || [];
            dados.pdvsGeral = dadosRecuperados.pdvsGeral || [];

            // Renderiza as listas
            renderizarLista('aberturaOps');
            renderizarLista('fechamentoOps');
            renderizarLista('aberturaPdvs');
            renderizarLista('fechamentoPdvs');
            renderizarLista('operadoresGeral');
            renderizarLista('pdvsGeral');
            return true;
        } else {
            // Remove dados expirados
            localStorage.removeItem('sorteio_dados');
            return false;
        }
    }
    return false;
}

function limparDados() {
    dados.aberturaOps = [];
    dados.fechamentoOps = [];
    dados.aberturaPdvs = [];
    dados.fechamentoPdvs = [];
    dados.operadoresGeral = [];
    dados.pdvsGeral = [];
    
    document.getElementById('inputAberturaOps').value = '';
    document.getElementById('inputFechamentoOps').value = '';
    document.getElementById('inputAberturaPdvs').value = '';
    document.getElementById('inputFechamentoPdvs').value = '';
    document.getElementById('inputOperadoresGeral').value = '';
    document.getElementById('inputPdvsGeral').value = '';

    renderizarLista('aberturaOps');
    renderizarLista('fechamentoOps');
    renderizarLista('aberturaPdvs');
    renderizarLista('fechamentoPdvs');
    renderizarLista('operadoresGeral');
    renderizarLista('pdvsGeral');

    localStorage.removeItem('sorteio_dados');
    limparObservacao();
    desabilitarBotaoImprimir();
    ocultarSecaoObservacoes();
    exibirFeedback('🗑️ Dados limpos com sucesso! Recarregando página...', 'sucesso');
    
    // Recarrega a página após 1.5 segundos
    setTimeout(() => {
        location.reload();
    }, 1500);
}

function preencherTabela(tabelaId, pdvs, operadores) {
    const tbody = document.querySelector(`#${tabelaId} tbody`);
    tbody.innerHTML = "";

    for (let i = 0; i < pdvs.length; i++) {
        const tr = document.createElement("tr");

        const tdPdv = document.createElement("td");
        tdPdv.textContent = pdvs[i] || "-";

        const tdOp = document.createElement("td");
        tdOp.textContent = operadores[i] || "SEM OPERADOR";

        tr.appendChild(tdPdv);
        tr.appendChild(tdOp);
        tbody.appendChild(tr);
    }
}

function gerarDistribuicaoSemRepetir(pdvs, operadores, chaveStorage) {
    let tentativa = 0;
    const maxTentativas = 200;

    const anterior = JSON.parse(localStorage.getItem(chaveStorage) || "{}");

    while (tentativa < maxTentativas) {
        tentativa++;

        let opsEmbaralhados = embaralhar([...operadores]);
        let valido = true;

        for (let i = 0; i < pdvs.length; i++) {
            const pdv = pdvs[i];
            const op = opsEmbaralhados[i];

            if (anterior[pdv] && anterior[pdv] === op) {
                valido = false;
                break;
            }
        }

        if (valido) {
            const novoRegistro = {};
            for (let i = 0; i < pdvs.length; i++) {
                novoRegistro[pdvs[i]] = opsEmbaralhados[i] || null;
            }

            localStorage.setItem(chaveStorage, JSON.stringify(novoRegistro));
            return opsEmbaralhados;
        }

    }

    alert("Não foi possível evitar repetição com a lista atual. Resultado normal será usado.");
    return embaralhar([...operadores]);
}

function sortear() {
    // Validar dados de acordo com o tipo de dia
    if (tipoDiaAtual === 'util') {
        sortearDiaUtil();
    } else {
        sortearFeriado();
    }
}

function sortearDiaUtil() {
    const btnSortear = document.querySelector('.btn-sortear');
    btnSortear.disabled = true;
    document.getElementById('loading').classList.add('ativo');
    document.getElementById('printArea').classList.remove('visivel');

    let tempoRestante = 5;
    const contadorElement = document.getElementById('contador');

    const intervalo = setInterval(() => {
        tempoRestante--;
        contadorElement.textContent = tempoRestante;
    }, 1000);

    setTimeout(() => {
        clearInterval(intervalo);

        let aberturaOps = dados.aberturaOps;
        let fechamentoOps = dados.fechamentoOps;
        let aberturaPdvs = ordenarPdvsNumericamente([...dados.aberturaPdvs]);
        let fechamentoPdvs = ordenarPdvsNumericamente([...dados.fechamentoPdvs]);

        const validacao = validarListas(aberturaOps, fechamentoOps, aberturaPdvs, fechamentoPdvs);

        if (validacao.erros.length > 0) {
            exibirFeedback('❌ ' + validacao.erros.join('; '), 'erro');
            document.getElementById('loading').classList.remove('ativo');
            btnSortear.disabled = false;
            contadorElement.textContent = '5';
            return;
        }

        const aberturaFinal = gerarDistribuicaoSemRepetir(
            aberturaPdvs,
            aberturaOps,
            "ultimoSorteioAbertura"
        );

        const fechamentoFinal = gerarDistribuicaoSemRepetir(
            fechamentoPdvs,
            fechamentoOps,
            "ultimoSorteioFechamento"
        );

        preencherTabela("resultadoAbertura", aberturaPdvs, aberturaFinal);
        preencherTabela("resultadoFechamento", fechamentoPdvs, fechamentoFinal);

        const agora = new Date();
        const dataFormatada = agora.toLocaleString('pt-BR');
        document.getElementById('dataSorteio').textContent = `Sorteado em: ${dataFormatada}`;

        // Mostrar seção de Dia Útil
        document.getElementById('resultadoDiaUtil').style.display = 'block';
        document.getElementById('resultadoFeriado').style.display = 'none';

        let mensagem = '✅ Sorteio (Dia Útil) realizado com sucesso!';
        if (validacao.avisos.length > 0) {
            mensagem += ` ⚠️ ${validacao.avisos.join('; ')}`;
            exibirFeedback(mensagem, 'aviso');
        } else {
            exibirFeedback(mensagem, 'sucesso');
        }

        document.getElementById('loading').classList.remove('ativo');
        document.getElementById('printArea').classList.add('visivel');
        habilitarBotaoImprimir();
        mostrarSecaoObservacoes();
        
        // Scroll suave para os resultados
        document.getElementById('printArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        btnSortear.disabled = false;
        contadorElement.textContent = '5';
    }, 5000);
}

function sortearFeriado() {
    const btnSortear = document.querySelector('.btn-sortear');
    btnSortear.disabled = true;
    document.getElementById('loading').classList.add('ativo');
    document.getElementById('printArea').classList.remove('visivel');

    let tempoRestante = 5;
    const contadorElement = document.getElementById('contador');

    const intervalo = setInterval(() => {
        tempoRestante--;
        contadorElement.textContent = tempoRestante;
    }, 1000);

    setTimeout(() => {
        clearInterval(intervalo);

        let operadores = dados.operadoresGeral;
        let pdvs = ordenarPdvsNumericamente([...dados.pdvsGeral]);

        if (operadores.length === 0 || pdvs.length === 0) {
            exibirFeedback('❌ Preencha Operadores e PDVs antes de sortear!', 'erro');
            document.getElementById('loading').classList.remove('ativo');
            btnSortear.disabled = false;
            contadorElement.textContent = '5';
            return;
        }

        if (operadores.length !== pdvs.length) {
            exibirFeedback('❌ O número de operadores deve ser igual ao número de PDVs!', 'erro');
            document.getElementById('loading').classList.remove('ativo');
            btnSortear.disabled = false;
            contadorElement.textContent = '5';
            return;
        }

        const operadoresFinal = gerarDistribuicaoSemRepetir(
            pdvs,
            operadores,
            "ultimoSorteioFeriado"
        );

        preencherTabela("resultadoGeral", pdvs, operadoresFinal);

        const agora = new Date();
        const dataFormatada = agora.toLocaleString('pt-BR');
        document.getElementById('dataSorteio').textContent = `Sorteado em: ${dataFormatada}`;

        // Mostrar seção de Feriado
        document.getElementById('resultadoDiaUtil').style.display = 'none';
        document.getElementById('resultadoFeriado').style.display = 'block';

        exibirFeedback('✅ Sorteio (Feriado) realizado com sucesso!', 'sucesso');

        document.getElementById('loading').classList.remove('ativo');
        document.getElementById('printArea').classList.add('visivel');
        habilitarBotaoImprimir();
        mostrarSecaoObservacoes();
        
        // Scroll suave para os resultados
        document.getElementById('printArea').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        btnSortear.disabled = false;
        contadorElement.textContent = '5';
    }, 5000);
}

function imprimirResultado() {
    if (!temSorteioRealizado) {
        exibirFeedback('❌ Realize um sorteio antes de imprimir!', 'erro');
        return;
    }
    
    const campoObs = document.getElementById('campoObservacoes');
    const secaoObs = document.getElementById('secaoObservacoes');
    const temObservacao = campoObs && campoObs.value.trim() !== '';
    
    // Remover a classe primeiro para garantir estado limpo
    secaoObs.classList.remove('com-observacao');
    
    // Adicionar classe apenas se houver conteúdo
    if (temObservacao) {
        secaoObs.classList.add('com-observacao');
    }
    
    // Pequeno delay para garantir que o DOM foi atualizado
    setTimeout(() => {
        window.print();
    }, 50);
}


// ===== CONTROLAR BOTÃO DE IMPRESSÃO =====
function habilitarBotaoImprimir() {
    temSorteioRealizado = true;
}

function desabilitarBotaoImprimir() {
    temSorteioRealizado = false;
}

// ===== CONTROLAR VISIBILIDADE BOTÃO LIMPAR =====
function atualizarVisibilidadeBotaoLimpar() {
    const btnLimpar = document.querySelector('.btn-limpar');
    const temDados = localStorage.getItem('sorteio_dados') !== null;
    
    if (temDados) {
        btnLimpar.style.display = 'inline-block';
        btnLimpar.style.visibility = 'visible';
    } else {
        btnLimpar.style.display = 'none';
        btnLimpar.style.visibility = 'hidden';
    }
}

// ===== ALTERNAR TIPO DE DIA =====
function alternarTipoDia(tipo) {
    tipoDiaAtual = tipo;
    
    const camposDiaUtil = document.getElementById('camposDiaUtil');
    const camposFeriado = document.getElementById('camposFeriado');
    
    if (tipo === 'util') {
        camposDiaUtil.style.display = 'block';
        camposFeriado.style.display = 'none';
    } else {
        camposDiaUtil.style.display = 'none';
        camposFeriado.style.display = 'block';
    }
    
    // Limpar feedback
    document.getElementById('feedback').className = 'feedback';
    exibirFeedback(`Modo: ${tipo === 'util' ? '📅 Dia Útil' : '🎉 Feriado'}`, 'sucesso');
}

// ===== FUNÇÕES DE CONTATO =====
function abrirContato() {
    const modal = document.getElementById('modalContato');
    modal.classList.add('ativo');
}

function fecharContato() {
    const modal = document.getElementById('modalContato');
    modal.classList.remove('ativo');
}

function fecharContatoAoClicarFora() {
    const modal = document.getElementById('modalContato');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharContato();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                fecharContato();
            }
        });
    }
}

// ===== FUNÇÕES DE OBSERVAÇÕES =====
function mostrarSecaoObservacoes() {
    const secao = document.getElementById('secaoObservacoes');
    secao.style.display = 'block';
    restaurarObservacao();
}

function ocultarSecaoObservacoes() {
    const secao = document.getElementById('secaoObservacoes');
    secao.style.display = 'none';
}

function salvarObservacao() {
    const campoObs = document.getElementById('campoObservacoes');
    const observacao = campoObs.value.trim();
    
    if (observacao === '') {
        exibirFeedback('⚠️ Digite uma observação antes de salvar!', 'aviso');
        return;
    }

    const dadosObs = {
        observacao: observacao,
        timestamp: Date.now()
    };

    localStorage.setItem('sorteio_observacao', JSON.stringify(dadosObs));
    exibirFeedback('✅ Observação salva com sucesso!', 'sucesso');
}

function restaurarObservacao() {
    const dadosObs = localStorage.getItem('sorteio_observacao');
    const campoObs = document.getElementById('campoObservacoes');
    
    if (dadosObs) {
        const obs = JSON.parse(dadosObs);
        campoObs.value = obs.observacao;
        atualizarContadorCaracteres();
    } else {
        campoObs.value = '';
        atualizarContadorCaracteres();
    }
}

function atualizarContadorCaracteres() {
    const campoObs = document.getElementById('campoObservacoes');
    const contador = document.getElementById('contadorCaracteres');
    const tamanho = campoObs.value.length;
    contador.textContent = `${tamanho}/500`;
}

function limparObservacao() {
    const campoObs = document.getElementById('campoObservacoes');
    campoObs.value = '';
    atualizarContadorCaracteres();
    localStorage.removeItem('sorteio_observacao');
}

// Restaura dados ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    desabilitarBotaoImprimir(); // Desabilita o botão por padrão
    atualizarVisibilidadeBotaoLimpar(); // Verifica visibilidade do botão limpar
    const dadosRestaurados = restaurarDadosDoStorage();
    if (dadosRestaurados) {
        exibirFeedback('📂 Dados recuperados do armazenamento (válido por 1 hora)', 'sucesso');
        atualizarVisibilidadeBotaoLimpar(); // Mostra o botão se houver dados
    }
    fecharContatoAoClicarFora();
    
    // Adicionar evento ao campo de observações para contar caracteres
    const campoObs = document.getElementById('campoObservacoes');
    if (campoObs) {
        campoObs.addEventListener('input', atualizarContadorCaracteres);
    }
});
