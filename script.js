// ===== DADOS =====
let refs = [];

// ===== THEME =====
function toggleTheme(){
    document.body.classList.toggle("dark");
    localStorage.setItem("dark", document.body.classList.contains("dark"));
}

// ===== LOAD =====
window.onload = () => {
    if(localStorage.getItem("dark") === "true"){
        document.body.classList.add("dark");
    }
    const saved = localStorage.getItem("refs");
    refs = saved ? JSON.parse(saved) : [];
    render();
};

function salvar(){
    localStorage.setItem("refs", JSON.stringify(refs));
}

function salvarReferencia(){
    const nome = refNome.value.trim();
    const min = parseFloat(refMinutos.value) || 0;
    const seg = parseFloat(refSegundos.value) || 0;

    if(!nome || (min === 0 && seg === 0)){
        alert("Preencha o nome e o tempo.");
        return;
    }

    refs.push({
        nome,
        min,
        seg,
        tempo: min + (seg / 60),
        qtd: 0
    });

    salvar();
    render();

    // Limpar campos
    refNome.value = "";
    refMinutos.value = "";
    refSegundos.value = "";
}

function atualizarQtd(index, valor) {
    refs[index].qtd = Number(valor);
    salvar();
    // Em vez de renderizar tudo, atualizamos apenas o total daquela linha para não travar o teclado no iOS
    const totalLinha = document.getElementById(`total-${index}`);
    if(totalLinha) {
        totalLinha.innerText = (refs[index].qtd * refs[index].tempo).toFixed(2);
    }
}

function render(){
    tabela.innerHTML = "";
    refs.forEach((r, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${r.nome}</td>
            <td>${r.min}m ${r.seg}s</td>
            <td>
                <input type="number" inputmode="numeric" value="${r.qtd || ""}"
                oninput="atualizarQtd(${i}, this.value)">
            </td>
            <td id="total-${i}">${((r.qtd || 0) * r.tempo).toFixed(2)}</td>
            <td>
                <button class="btn-del" onclick="excluir(${i})">✖</button>
            </td>
        `;
        tabela.appendChild(row);
    });
}

function excluir(i){
    if(confirm("Excluir referência?")){
        refs.splice(i, 1);
        salvar();
        render();
    }
}

function calcular(){
    const p = Number(pessoas.value);
    const min = Number(minDia.value);

    if(!p || !min){
        alert("Preencha Pessoas e Minutos/Dia");
        return;
    }

    const tempoDisponivel = p * min;
    let tempoUsado = 0;

    refs.forEach(r => {
        tempoUsado += (r.qtd || 0) * r.tempo;
    });

    const eficiencia = tempoDisponivel > 0 ? ((tempoUsado / tempoDisponivel) * 100) : 0;

    disp.innerText = `⏱ Disponível: ${tempoDisponivel.toFixed(1)} min`;
    usado.innerText = `📦 Usado: ${tempoUsado.toFixed(1)} min`;
    ef.innerText = `⚡ Eficiência: ${eficiencia.toFixed(2)}%`;
}