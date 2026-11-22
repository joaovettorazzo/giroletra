'use strict';

const Giro = (() => {
  const limites = {1: 6, 2: 7, 4: 9};
  const respostas = `
    abade abalo abano abril abrir abuso adega adiar adubo afeto ágeis agora agudo ajuda álbum
    alçar aldeã algas algoz aliar altar aluno amada ameno amigo amora amplo andar anéis anexo
    anjos antes anzol aorta apelo ápice aptos aquém arado arame arara arcar arcos ardor areia
    arena armas aroma arroz artes asilo astro atlas atriz atual atuar áurea autor aveia avelã
    avião aviso azedo bacia baile baixa baixo balão balde balsa bamba bambu banal banca banco
    banda bando banho banjo barão barba barco barra barro basta batel bater batom beber beijo
    beira belas belga belos berço bicho bicos biela bingo bocal bocas boiar boina bolar bolha
    bolos bolsa bolso bomba bônus borda bordo botão botar botas braço brado brasa brava bravo
    brejo breve briga brisa broca broto bruma bruta bruto bucal bucha búzio caber cabos cabra
    cacho cacto cafés caixa calça calda calha calmo calor calos calva camas campo canal canja
    canoa canos cansa canto capaz capim capuz cardo carga cargo carne carro carta casal casar
    casas casca casco casos casta catar cauda causa cavas ceder cedro cegos censo cento cerca
    cerco cerne certa certo cesta cesto cetim chave cheia cheio chiar chuva ciclo cidra cifra
    cinco cinto cinza circo cisão citar civil clara claro clero clima clone clube cobra cobre
    coeso cofre coisa colar cólon comer comum conde conta conto copas copos coral corar corda
    cores coroa corpo corre corvo costa couve covas coxas cozer cravo credo creme crime crina
    crise crivo cromo cruza cubos cueca cuíca culpa culto cunha cupim curar curva curvo custo
    dados damas dança danos dardo datas davam dedos deduz deita deixa densa denso dente depor
    desde deter deusa dever dicas digam digno diodo disco ditar ditos dizer doado dobra dobro
    docas doido dólar domar donos dopar dores dorso dosar dotar dotes douto draga drama dreno
    dueto dunas duplo durar duras dutos dúzia ecoar edema edita eixos elite emite enche entra
    envia época ereto ergue ermos errar ervas essas estas estou etapa ético etnia exata exato
    exibe exijo êxito expor extra façam facas faces fácil fadas fados faixa falam falar falas
    falha falho falsa falso falta fardo farol farpa farra farsa farta farto fases fatal fator
    fatos fauna favor fazer febre fecha fecho feias feira feito feliz fêmea fenda feras ferir
    feroz ferro festa fetal fetos fibra ficar ficha fiéis figos filão filas filha filho filme
    final finca finda firma firme fisga fitas fixar fixos floco flora fluxo focar focas focos
    fogão fogos foice folga folha folia fomes fones fonte força forma forno forte fórum fossa
    fosso fotos fraca fraco frade fraga frase frear freio frete frios frisa frita frito frota
    fruta fruto fugaz fugir fumar funda fundo fungo funil furar furor furos furto fusão fusos
    fútil gabar gaita galão galgo galho galos gambá gamos ganso garça garfo garoa garra gases
    gasta gasto gatas gatos geada gelar gelos gemas gêmeo gemer gênio gente gerar germe gesso
    gesto girar giros gleba globo goles golfo golpe gomas gomos gorro gotas gozar grade grama
    grana grãos graxa grego grife grilo grito grupo gruta gueto guiar guias guizo gumes hábil
    harpa haste haver herói hiato hiena hífen hinos honra horas horta hotel humor ícone ideal
    ideia ídolo idosa idoso igual ileso ilhas ímpar impor inata inato índio infra inibe invés
    irado irmão irmãs irmos iscas isola istmo janta jarda jarra jarro jatos jaula jazer jeito
    jejum jogar jogos joias jovem julga julho junho junta junto jurar juras juros justa justo
    laços lacre lados ladra lagoa lagos laica laico lajes lambe lança lanço larga largo larva
    lasca latas latim latir laudo lavar lavra lazer lebre legal legar leigo leito lemes lenço
    lenda lenha lenta lento leões lerda lesão lesar lesma letra levar leves lhama liame libra
    lidar lidas líder ligam ligar lilás limão limar limbo limpa limpo linda lindo linha lírio
    lisas lista livro lixar lixas lobas lobos local locar lojas lombo longa longe longo lotar
    lotes louca louco lousa louva lucra lucro lugar lunar lupas lutar lutas luvas luzes luzir
    maçãs macia macio macro magos magra magro maior malas males malha mamão mamar manga mansa
    manso manto mapas marca março marés marra massa matar matas matiz matos média médio medir
    medos meias meigo meios melão menor menos menta mente menus mercê mesas meses mesma mesmo
    metal metas meter metro mexer minar minas minha míope mirar mirra missa mista misto mitos
    miúda miúdo moças moços modas modos moeda moela mofar moita molar molas molde molha molho
    monge monte morar morna morno morro morte mosca motel motor motos móvel mover mudar mudas
    mudez mudos muita muito mulas multa mundo mural muros musas museu musgo mútua mútuo nação
    nadar naipe nariz narra natal natas naval naves navio negar negra negro nelas neném nervo
    netas netos nevar névoa ninar ninfa ninho nisto nível nobre noção noite noiva noivo nomes
    norma norte nossa nosso notar notas novas novos nozes nunca nuvem oásis obras obter óbvia
    óbvio odeio odiar oeste ogiva olhar olhas olhos ombro omite ondas ontem opaca opaco opção
    ópera opina optar orais ordem órfão órgão orlas ornar ossos ostra ótica ótico ótima ótimo
    ousar outra outro ouvir ovais óvulo padre pagão pagar pagos palco palha palmo pampa panda
    panos papel papos parar parca parco parda pardo pares parir parte parto parvo passo pasta
    pasto patas patim pátio patos pausa pauta pavão pavio pazes pecar peças pedir pedra pegar
    peito peixe pelar pelas peles pelos penar penas penca pensa pente peões peras perca perda
    perde perna persa perto pesar pesca pesos peste piano picar picos pilar pilha pingo pinha
    pinos pinta pinto pipas pique pirão pisar pista pivôs placa plano platô plebe plena pleno
    pluma pneus pobre poção poços poder pódio poeta polar polca polir polpa polvo pomar pombo
    pomos ponta ponte ponto porão porca porco poros porta porte porto posar poses posse posta
    poste posto pouca pouco pouso povão povos prado praga praia prata prato prazo prece preço
    prega prego presa preso preta preto prima primo prosa prova prumo pudim pudor pular pulga
    pulos pulso pumas punho punir puras puros puxar quais quase queda quilo quina quite quota
    radar rádio raiar raios raiva ralar ralos ramos rampa ranço range rapar rapaz raras raros
    rasas rasga rasgo rasos rasto ratos razão reais reata recai recém recuo redes redor refém
    regar regem regra régua reino reles relva remar remos renda rende rente repor resma resta
    resto retas retém retos rever revés rezar ricas ricos rifas rigor rimar rimas rindo riram
    risca risco risos ritmo ritos rival roçar rocha rodar rodas rodei rogar rolar rolha rolos
    romãs rombo ronca ronco ronda roque rosas rosca rosto rotas rotos rouba roubo rouca rouco
    roupa roxas roxos rubis rudes ruela rugas rugir ruído ruína ruiva ruivo rumar rumos rural
    russa russo saber sábia sábio sabor sacar sacas sacos sacro sagas sagaz saias saída saído
    salão salas saldo salga salmo salsa salta salto salva salvo samba sanha santa santo sapos
    sarda sarna saúda saúde sauna seara secar secas secos sedas sedes selar selos selva senão
    sendo senha senso senta sente séria série sério serra servo sexta sexto sigla signo silvo
    sinal sinos sinta sítio sobra sobre sobro sócia sócio sódio sogra sogro solar solas solda
    solos solta solto somar sonda sonho sonsa sopas sopro soros sorte sósia sótão soube sovar
    suave subir sucos suína suíno sujar sujas sujos sulco sumir super supor surda surdo surge
    surra surto sutil tábua taças tacha tacho tacos talco talha talho talos tampa tanga tanto
    tapar tapas tarde tarja tecer tecla tédio teias telas temas temer temos tempo tenaz tenda
    tendo tenha tênis tenor tensa tenso tenta tento terço terna terno terra teses testa teste
    tetas tetos texto tiara tigre timão times tinir tinta tinto tipos tirar tiras tiros titãs
    toada tocar tocas tocha todas todos toldo tomar tomba tombo tonta tonto topam topar topos
    topou toque toras torce torta torto tosar tosse total totem touca touro traço trago traía
    trair traje trama trapo trata trato trava trave travo treco trema treme trena trens treta
    treva trevo tribo trigo trina trios tripa troca troco trono tropa trote truco trufa tubos
    tufão tumba tumor túnel turma turno turva turvo tutor ufano ultra úmida úmido unção ungir
    unhas união única único unida unido untar urnas urrar urros urubu usado usina usual úteis
    útero vácuo vagão vagar vagas vagos vaiar vaias valas valer vales valia valor valsa vamos
    vapor varar varas varia vasos vasta vasto vazão vazar vazia vazio vazou veado vedar vedes
    veias velar velas velha velho veloz vemos venal venda vende venha vento verão verba verbo
    verde verga verme versa verso vesga vesgo veste vetar vetor vezes vibra vício vidas vídeo
    vidro viela vigas vigia vigor vilão vilas vinco vinda vindo vinha vinho viola virai virar
    viril vírus visão visar vista visto vital viúva viúvo vivas viver vivos voado voará voava
    vodca vogal vôlei volta volto votar votos vozes vulgo vulto xales xerox zanga zebra zelar
    zerar zeros zinco zíper zonas zumba zumbi
  `.trim().split(/\s+/);
  const normalizar = palavra => palavra.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  const vocabulario = new Map();
  for (const palavra of DICIONARIO) {
    const chave = normalizar(palavra);
    if (!vocabulario.has(chave) || palavra === chave) vocabulario.set(chave, palavra);
  }
  const banco = new Map(respostas.map(palavra => [normalizar(palavra), palavra]));
  function sortear(modo, anteriores = []) {
    const opcoes = [...banco.values()].filter(p => !anteriores.includes(p));
    for (let i = 0; i < modo; i++) {
      const j = i + Math.floor(Math.random() * (opcoes.length - i));
      [opcoes[i], opcoes[j]] = [opcoes[j], opcoes[i]];
    }
    return {alvos: opcoes.slice(0, modo), palpites: []};
  }
  function avaliar(palpite, alvo) {
    const letras = [...normalizar(alvo)];
    const jogada = [...normalizar(palpite)];
    const pistas = Array(5).fill('fora');
    for (let i = 0; i < 5; i++) {
      if (jogada[i] === letras[i]) {
        pistas[i] = 'certa';
        letras[i] = null;
      }
    }
    for (let i = 0; i < 5; i++) {
      if (pistas[i] === 'certa') continue;
      const j = letras.indexOf(jogada[i]);
      if (j !== -1) {
        pistas[i] = 'perto';
        letras[j] = null;
      }
    }
    return pistas;
  }
  function resultado(rodada) {
    const acertos = rodada.alvos.filter(p => rodada.palpites.includes(normalizar(p))).length;
    if (acertos === rodada.alvos.length) return 'ganhou';
    if (rodada.palpites.length >= limites[rodada.alvos.length]) return 'perdeu';
    return '';
  }
  return {limites, banco, normalizar, vocabulario, sortear, avaliar, resultado};
})();
