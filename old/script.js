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

    function lerLista(id) {
        return document.getElementById(id).value
            .split('\n')
            .map(x => x.trim())
            .filter(x => x.length > 0);
    }

    function salvarDadosNoStorage() {
        const dados = {
            aberturaOps: document.getElementById('aberturaOps').value,
            fechamentoOps: document.getElementById('fechamentoOps').value,
            aberturaPdvs: document.getElementById('aberturaPdvs').value,
            fechamentoPdvs: document.getElementById('fechamentoPdvs').value,
            timestamp: Date.now() // Timestamp em ms
        };
        localStorage.setItem('sorteio_dados', JSON.stringify(dados));
    }

    function restaurarDadosDoStorage() {
        const dadosArmazenados = localStorage.getItem('sorteio_dados');
        
        if (dadosArmazenados) {
            const dados = JSON.parse(dadosArmazenados);
            const agora = Date.now();
            const umaHora = 3600000; // 1 hora em milissegundos
            
            // Verifica se os dados ainda estão válidos (1 hora)
            if (agora - dados.timestamp < umaHora) {
                document.getElementById('aberturaOps').value = dados.aberturaOps;
                document.getElementById('fechamentoOps').value = dados.fechamentoOps;
                document.getElementById('aberturaPdvs').value = dados.aberturaPdvs;
                document.getElementById('fechamentoPdvs').value = dados.fechamentoPdvs;
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
        document.getElementById('aberturaOps').value = '';
        document.getElementById('fechamentoOps').value = '';
        document.getElementById('aberturaPdvs').value = '';
        document.getElementById('fechamentoPdvs').value = '';
        localStorage.removeItem('sorteio_dados');
        exibirFeedback('🗑️ Dados limpos com sucesso!', 'sucesso');
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
        // Desativa o botão e mostra loading
        const btnSortear = document.querySelector('.btn-sortear');
        btnSortear.disabled = true;
        document.getElementById('loading').classList.add('ativo');
        document.getElementById('printArea').classList.remove('visivel');

        let tempoRestante = 5;
        const contadorElement = document.getElementById('contador');

        // Atualiza o contador a cada segundo
        const intervalo = setInterval(() => {
            tempoRestante--;
            contadorElement.textContent = tempoRestante;
        }, 1000);

        // Simula o processamento com 5 segundos
        setTimeout(() => {
            clearInterval(intervalo);

            let aberturaOps = lerLista("aberturaOps");
            let fechamentoOps = lerLista("fechamentoOps");
            let aberturaPdvs = lerLista("aberturaPdvs");
            let fechamentoPdvs = lerLista("fechamentoPdvs");

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

            let mensagem = '✅ Sorteio realizado com sucesso!';
            if (validacao.avisos.length > 0) {
                mensagem += ` ⚠️ ${validacao.avisos.join('; ')}`;
                exibirFeedback(mensagem, 'aviso');
            } else {
                exibirFeedback(mensagem, 'sucesso');
            }

            // Remove loading, mostra resultado e reativa o botão
            document.getElementById('loading').classList.remove('ativo');
            document.getElementById('printArea').classList.add('visivel');
            btnSortear.disabled = false;
            contadorElement.textContent = '5';
        }, 5000);
    }

    function imprimirResultado() {
        window.print();
    }

    // Restaura dados ao carregar a página
    window.addEventListener('DOMContentLoaded', () => {
        const dadosRestaurados = restaurarDadosDoStorage();
        if (dadosRestaurados) {
            exibirFeedback('📂 Dados recuperados do armazenamento (válido por 1 hora)', 'sucesso');
        }
    });

    // Salva dados a cada mudança nas textareas
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('dados-input') || 
            e.target.id === 'aberturaOps' || 
            e.target.id === 'fechamentoOps' || 
            e.target.id === 'aberturaPdvs' || 
            e.target.id === 'fechamentoPdvs') {
            salvarDadosNoStorage();
        }
    });