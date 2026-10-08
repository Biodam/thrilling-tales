import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const EVENTS_FILE = path.join(rootDir, 'data', 'events.json');
const EVENTS_PT_FILE = path.join(rootDir, 'data', 'events_pt.json');

const eventsEn = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));

const eventsPtMap = {
  'reign-of-sovereigns': {
    title: 'O Reinado dos Sete Soberanos Dragões',
    yearsAgoDisplay: '~7.000+ AA',
    dateDisplay: '~7.000+ Anos Atrás • O Reino Primordial da Luz',
    eraName: 'Mundo Antigo (Sete Soberanos)',
    summary: 'Antes da chegada de deuses ou da humanidade, Teyvat era um reino elemental indomado governado exclusivamente por sete colossais dragões soberanos.',
    description: 'Na era antiga do Reino da Luz, os Sete Soberanos Dragões exerciam domínio supremo sobre os elementos primordiais de Teyvat. Sob a liderança do Rei Dragão Nibelung, civilizações de vishaps e dragões floresciam pelo globo sem interferência celestial ou tronos divinos.',
    tags: {
      region: 'Teyvat Primordial',
      factions: ['Sete Soberanos Dragões', 'Vishaps das Profundezas'],
      characters: ['Rei Dragão Nibelung', 'Apep', 'Scylla'],
      spoilerLevel: 'Missões do Mundo de Fontaine'
    }
  },
  'nibelung-voyage': {
    title: 'A Jornada Cósmica de Nibelung & O Poder do Além',
    yearsAgoDisplay: '~6.500+ AA',
    dateDisplay: '~6.500+ Anos Atrás • Incursão Cósmica',
    eraName: 'Mundo Antigo (Sete Soberanos)',
    summary: 'O Rei Dragão Nibelung viaja além do firmamento de Teyvat, retornando com um poder proibido e sombrio para combater invasores celestiais.',
    description: 'Prevendo a chegada de poderes extraterrestres, o Rei Dragão Nibelung aventurou-se além das fronteiras de Teyvat no Mar Escuro e no cosmos. Ele adquiriu um poder negro como breu de além deste mundo para enfrentar os invasores celestiais, plantando as primeiras sementes do conhecimento proibido que mais tarde assolaria o mundo.',
    tags: {
      region: 'O Mar Escuro',
      factions: ['Sete Soberanos Dragões'],
      characters: ['Rei Dragão Nibelung', 'Apep'],
      spoilerLevel: 'Missões do Deserto de Sumeru'
    }
  },
  'morax-genesis': {
    title: 'A Gênese de Morax (Rex Lapis)',
    yearsAgoDisplay: '~6.000 AA',
    dateDisplay: 'Mais de 6.000 Anos Atrás • O Alvorecer de Liyue',
    eraName: 'O Primeiro Que Veio',
    summary: 'Morax (Rex Lapis), o mais antigo dos Sete Arcontes, nasce ou desce à terra em Teyvat.',
    description: 'Há mais de seis milênios, Morax surgiu na terra de Liyue. Antes mesmo de receber a Gnosis Geo ou o título de Arconte, ele caminhou entre os primeiros povos como o Deus dos Contratos e o Deus do Ouro, esculpindo as montanhas com lanças de pedra e estabelecendo as tradições fundamentais do comércio.',
    tags: {
      region: 'Liyue',
      factions: ['Adepti de Liyue'],
      characters: ['Morax', 'Rex Lapis'],
      spoilerLevel: 'Missão do Arconte Capítulo I'
    }
  },
  'phanes-arrives': {
    title: 'A Chegada de Phanes & Criação das Quatro Sombras',
    yearsAgoDisplay: '~6.000 AA',
    dateDisplay: '~6.000 Anos Atrás • A Descida Celestial',
    eraName: 'O Primeiro Que Veio',
    summary: 'O Primeiro Que Veio (Phanes) desce dos céus, gera quatro sombras luminosas e prepara a conquista de Teyvat.',
    description: 'Nascido de um ovo cósmico, Phanes — O Primeiro Que Veio e o Primeiro Descendente — chegou a Teyvat acompanhado por suas quatro sombras resplandecentes, incluindo Istaroth, a Sombra do Tempo. Ele iniciou a criação de um novo firmamento para proteger o mundo das trevas cósmicas externas.',
    tags: {
      region: 'Celestia',
      factions: ['Celestia', 'As Quatro Sombras'],
      characters: ['Phanes', 'Istaroth'],
      spoilerLevel: 'Missões do Mundo de Enkanomiya'
    }
  },
  'great-war-forty-years': {
    title: 'A Guerra dos Quarenta Anos: A Queda dos Soberanos Dragões',
    yearsAgoDisplay: '~5.960 AA',
    dateDisplay: '~5.960 Anos Atrás • A Guerra da Criação',
    eraName: 'O Primeiro Que Veio',
    summary: 'Phanes e as Quatro Sombras travam uma guerra devastadora de 40 anos, derrotando os Sete Soberanos Dragões e tomando a autoridade elemental.',
    description: 'Por quarenta longos anos, céu e terra colidiram enquanto Phanes e suas sombras lutavam contra o Rei Dragão Nibelung e os Sete Soberanos. Os dragões foram decisivamente derrotados e destituídos de sua autoridade primordial sobre os elementos. Os sobreviventes fugiram para as profundezas oceânicas ou desertos esquecidos.',
    tags: {
      region: 'Teyvat Global',
      factions: ['Celestia', 'Sete Soberanos Dragões'],
      characters: ['Phanes', 'Rei Dragão Nibelung', 'Apep', 'Scylla'],
      spoilerLevel: 'Missões do Mundo de Fontaine'
    }
  },
  'unified-human-civilization': {
    title: 'A Civilização Humana Unificada & Enviados Celestiais',
    yearsAgoDisplay: '~5.500 AA',
    dateDisplay: '~5.500 Anos Atrás • A Era Dourada da Humanidade',
    eraName: 'O Primeiro Que Veio',
    summary: 'A humanidade é criada por Phanes; uma civilização global unificada floresce com uma língua compartilhada e orientação celestial direta.',
    description: 'Após reordenar o mundo, Phanes criou os primeiros humanos. A humanidade floresceu em uma Civilização Unificada pacífica abrangendo todo o globo, unida por uma língua e cultura comuns. Megálitos colossais foram construídos no subterrâneo e emissários celestiais desciam para conferir sabedoria, prosperidade e colheitas eternas aos mortais.',
    tags: {
      region: 'Celestia & Teyvat Global',
      factions: ['Civilização Humana Unificada', 'Celestia', 'Ancestrais Seelie'],
      characters: ['Phanes', 'Ancestrais Seelie'],
      spoilerLevel: 'Missões de Enkanomiya / Sumeru'
    }
  },
  'second-who-came-invasion': {
    title: 'A Invasão do Segundo Que Veio & Céus Despedaçados',
    yearsAgoDisplay: '~5.000 AA',
    dateDisplay: '~5.000 Anos Atrás • A Segunda Descida Cósmica',
    eraName: 'Guerra da Chama Funerária',
    summary: 'O Segundo Que Veio chega a Teyvat, iniciando a terrível Guerra da Chama Funerária que parte os céus e devasta o mundo.',
    description: 'Um invasor extraterrestre conhecido como "O Segundo Que Veio" chegou além do céu, desencadeando um conflito cataclísmico contra Celestia. O firmamento foi perfurado, montanhas tombaram nos oceanos e as fundações da Civilização Humana Unificada foram reduzidas a cinzas.',
    tags: {
      region: 'Teyvat Global',
      factions: ['Celestia', 'O Segundo Que Veio'],
      characters: ['Phanes', 'O Segundo Que Veio'],
      spoilerLevel: 'Missões do Mundo de Enkanomiya'
    }
  },
  'sinking-of-enkanomiya': {
    title: 'O Afundamento de Byakuyakoku (Enkanomiya)',
    yearsAgoDisplay: '~5.000 AA',
    dateDisplay: '~5.000 Anos Atrás • A Noite Eterna Subterrânea',
    eraName: 'Guerra da Chama Funerária',
    summary: 'Durante a grande guerra, a terra de Byakuyakoku desaba nas profundezas do oceano escuro, isolando seus habitantes da luz solar.',
    description: 'Em meio às convulsões da Guerra da Chama Funerária, a massa continental de Byakuyakoku (posteriormente chamada Enkanomiya) desprendeu-se da superfície e afundou no mar abissal. No escuro absoluto, os humanos sobreviventes enfrentaram o terror dos Vishaps das Profundezas até que o sábio Abe Yoshihisa construiu o Helios (o Dainichi Mikoshi) com o auxílio de Istaroth.',
    tags: {
      region: 'Enkanomiya',
      factions: ['Povo de Byakuyakoku', 'Vishaps das Profundezas'],
      characters: ['Abe Yoshihisa', 'Istaroth'],
      spoilerLevel: 'Do Entardecer ao Alvorecer em Byakuyakoku'
    }
  },
  'fall-of-seelie-race': {
    title: 'A Queda e a Maldição da Raça Seelie',
    yearsAgoDisplay: '~5.000 AA',
    dateDisplay: '~5.000 Anos Atrás • A Punição Celestial',
    eraName: 'Guerra da Chama Funerária',
    summary: 'Os nobres Seelie ancestrais são amaldiçoados após uma união proibida com um viajante das estrelas, regredindo em espíritos sem memória.',
    description: 'Outrora uma das mais belas e sábias raças de Teyvat que guiavam a humanidade, os Seelies sofreram uma punição divina após um de seus ancestrais celebrar um matrimônio proibido com um viajante das estrelas. Privados de sua forma corpórea e memórias, foram condenados a definhar eternamente como pequenos espíritos flutuantes que buscam seus antigos lares.',
    tags: {
      region: 'Teyvat Global',
      factions: ['A Raça Seelie', 'Celestia'],
      characters: ['Ancestrais Seelie', 'Nabu Malikata'],
      spoilerLevel: 'Missões do Mundo de Aramani / Aranyaka'
    }
  },
  'skyfrost-nail-sal-vindagnyr': {
    title: 'O Prego Congelado Atinge Sal Vindagnyr (Espinha do Dragão)',
    yearsAgoDisplay: '~4.500 AA',
    dateDisplay: '~4.500 Anos Atrás • O Inverno Eterno da Montanha',
    eraName: 'Guerra da Chama Funerária',
    summary: 'Um Prego Celestial despenca do céu sobre a montanha verdejante de Sal Vindagnyr, congelando a civilização e destruindo a Árvore Branca.',
    description: 'Celestia lançou um Prego Celestial sobre a próspera civilização montanhosa de Sal Vindagnyr. O impacto partiu a montanha, destruiu a Árvore Branca Irminsul e transformou a verdejante cordilheira na desolada e gélida Espinha do Dragão, aniquilando seus habitantes sob nevascas perpétuas.',
    tags: {
      region: 'Mondstadt',
      factions: ['Celestia', 'Sal Vindagnyr'],
      characters: ['Princesa de Sal Vindagnyr', 'Imunlaukr'],
      spoilerLevel: 'Entalhes Antigos da Espinha do Dragão'
    }
  },
  'chasm-nail-impact': {
    title: 'Prego Celestial Atinge o Despenhadeiro',
    yearsAgoDisplay: '~4.500 AA',
    dateDisplay: '~4.500 Anos Atrás • O Fragmento Estelar das Profundezas',
    eraName: 'Guerra da Chama Funerária',
    summary: 'Um meteoro celestial e um Prego Divino caem na cratera de Liyue, criando as minas cavernosas do Despenhadeiro.',
    description: 'Durante a purgação divina do Abismo, um Prego Celestial despencou no oeste de Liyue, escavando o abismo monumental que se tornaria o Despenhadeiro. O poder do prego conteve a corrupção do Reino Escuro nas entranhas da terra, criando os minérios luminosos reverenciados por mineradores milênios depois.',
    tags: {
      region: 'Liyue',
      factions: ['Celestia', 'Mineradores Antigos de Liyue'],
      characters: ['Morax'],
      spoilerLevel: 'Missão do Mundo: Os Exploradores do Despenhadeiro'
    }
  },
  'chenyu-vale-settlement': {
    title: 'Os Ancestrais do Jade Estabelecem-se no Vale Chenyu',
    yearsAgoDisplay: '~4.000 AA',
    dateDisplay: '~4.000 Anos Atrás • A Dádiva das Águas do Jade',
    eraName: 'A Era dos Antigos Reinos',
    summary: 'Refugiados da guerra do Despenhadeiro migram para o norte e estabelecem as tradições de jade e chá no Vale Chenyu.',
    description: 'Fugindo da turbulência celestial no Despenhadeiro, clãs humanos migraram para o noroeste de Liyue, fundando o Vale Chenyu. Sob a orientação dos Adepti locais (incluindo Fujin e Lingyuan), desenvolveram a arte espiritual do cultivo de jade e a cura pelas águas termais.',
    tags: {
      region: 'Liyue',
      factions: ['Clãs do Vale Chenyu', 'Adepti de Chenyu'],
      characters: ['Fujin', 'Lingyuan', 'Morax'],
      spoilerLevel: 'Bênçãos do Jade Submerso de Chenyu'
    }
  },
  'three-god-alliance-sumeru': {
    title: 'A Aliança Tripartite de Sumeru (Ay-Khanoum)',
    yearsAgoDisplay: '~3.800 AA',
    dateDisplay: '~3.800 Anos Atrás • A Cidade das Luas e Flores',
    eraName: 'A Era dos Antigos Reinos',
    summary: 'Rei Deshret, a Maior Lorde Rukkhadevata e Nabu Malikata unem forças para criar a cidade-oásis de Ay-Khanoum.',
    description: 'No deserto ensolarado de Sumeru, três deuses lendários selaram um pacto de fraternidade pura. O Rei Deshret (Al-Ahmar), a Maior Lorde Rukkhadevata e Nabu Malikata (a Deusa das Flores) governaram em harmonia mútua, estabelecendo Ay-Khanoum ("Cidade das Luas"), uma era dourada de filosofia e florescimento cultural.',
    tags: {
      region: 'Sumeru',
      factions: ['Aliança Tripartite', 'Pari do Oásis', 'Sumeru Antigo'],
      characters: ['Rei Deshret', 'Maior Lorde Rukkhadevata', 'Nabu Malikata'],
      spoilerLevel: 'Sono Dourado / Cântico de Bilqis'
    }
  },
  'passing-of-goddess-of-flowers': {
    title: 'O Sacrifício de Nabu Malikata',
    yearsAgoDisplay: '~3.600 AA',
    dateDisplay: '~3.600 Anos Atrás • O Lamento do Oásis Eterno',
    eraName: 'A Era dos Antigos Reinos',
    summary: 'A Deusa das Flores sacrifica-se voluntariamente para conceder a Deshret a visão dos segredos celestiais e do Abismo.',
    description: 'Consciente das leis inflexíveis de Celestia, a Deusa das Flores orquestrou sua própria morte nas dunas. De seu sacrifício nasceram os Padisarahs e o Oásis Eterno. Sua partida deixou o Rei Deshret desolado, mergulhando-o na busca obsessiva por uma sabedoria que pudesse transcender a mortalidade e o destino divino.',
    tags: {
      region: 'Sumeru',
      factions: ['Aliança Tripartite'],
      characters: ['Nabu Malikata', 'Rei Deshret', 'Maior Lorde Rukkhadevata'],
      spoilerLevel: 'Cântico de Bilqis'
    }
  },
  'rise-of-remuria': {
    title: 'O Rei-Deus Remus & A Grande Sinfonia de Remuria',
    yearsAgoDisplay: '~3.600 AA',
    dateDisplay: '~3.600 Anos Atrás • O Reino de Ouro e Canções',
    eraName: 'A Era dos Antigos Reinos',
    summary: 'O Rei-Deus Remus unifica o mar de Fontaine com a música mágica da "Sinfonia", erguendo a magnífica Remuria.',
    description: 'A bordo do navio dourado Fortuna, o Deus Remus chegou às águas de Fontaine e fundou o Império Remuriano. Remus compôs a "Grande Sinfonia" para conectar as almas de seu povo ao Ichor espiritual, acreditando que a harmonia da música poderia repelir a profecia de extinção anunciada pelo dragão Scylla.',
    tags: {
      region: 'Fontaine',
      factions: ['Império de Remuria', 'Soberano Vishap da Água'],
      characters: ['Rei-Deus Remus', 'Scylla', 'Boethius'],
      spoilerLevel: 'Missão do Mundo: Mar de Eras Passadas'
    }
  },
  'fall-of-gurabad': {
    title: 'A Tirania e a Queda de Gurabad',
    yearsAgoDisplay: '~3.400 AA',
    dateDisplay: '~3.400 Anos Atrás • O Voo dos Jinns no Deserto',
    eraName: 'A Era dos Antigos Reinos',
    summary: 'A cidade humana de Gurabad, erguida por Ormazd e a Jinn Liloupar, desaba em fratricídio, loucura e pragas.',
    description: 'Criada nas areias sob a bênção do Rei Deshret, Gurabad ascendeu sob o pastor Ormazd e a Jinn Liloupar. Contudo, traições amargas, conspirações familiares e a vingança implacável de Liloupar conduziram a dinastia a uma espiral de parricídio e devastação total, deixando apenas ruínas assombradas pelas areias do tempo.',
    tags: {
      region: 'Sumeru',
      factions: ['Gurabad', 'Os Jinns'],
      characters: ['Liloupar', 'Ormazd', 'Shiruyeh'],
      spoilerLevel: 'Cântico de Bilqis'
    }
  },
  'guili-assembly-founding': {
    title: 'Morax e Guizhong Fundam a Assembleia Guili',
    yearsAgoDisplay: '~3.700 AA',
    dateDisplay: '~3.700 Anos Atrás • A Aliança nas Planícies',
    eraName: 'A Guerra dos Arcontes',
    summary: 'Morax e a sábia Deusa da Poeira, Guizhong, unem seus povos nas Planícies de Guili sob proteção e prosperidade mútua.',
    description: 'Unidos por respeito e estima mútua, Morax (possuidor de força marcial inigualável) e Guizhong (mestra de genialidade mecânica e sabedoria) uniram seus povos nas Planícies de Guili. Juntos, criaram as Balistas de Guizhong, ensinaram a agricultura aos mortais e forjaram o Halteres de Memória.',
    tags: {
      region: 'Liyue',
      factions: ['Assembleia Guili', 'Adepti de Liyue'],
      characters: ['Morax', 'Guizhong', 'Marchosius'],
      spoilerLevel: 'Missões de Evento do Ritual das Lanternas'
    }
  },
  'passing-of-guizhong': {
    title: 'A Queda de Guizhong & Fundação do Porto de Liyue',
    yearsAgoDisplay: '~3.000 AA',
    dateDisplay: '~3.000 Anos Atrás • A Poeira Assenta no Mar',
    eraName: 'A Guerra dos Arcontes',
    summary: 'Guizhong perece em batalha feroz durante a Guerra dos Arcontes; Morax conduz o povo sobrevivente para o sul até o Porto de Liyue.',
    description: 'Quando a Guerra dos Arcontes incendiou as terras de Liyue, as Planícies de Guili foram devastadas por deuses rivais. Guizhong tombou em batalha entre as Flores de Seda. Em profunda tristeza, Morax e os Adepti guiaram o povo para o sul através do Monte Tianheng, fundando o Porto de Liyue às margens do Mar das Nuvens.',
    tags: {
      region: 'Liyue',
      factions: ['Assembleia Guili', 'Adepti de Liyue'],
      characters: ['Guizhong', 'Morax', 'Retentora das Nuvens'],
      spoilerLevel: 'Missões de Evento do Ritual das Lanternas'
    }
  },
  'fall-of-decarabian': {
    title: 'A Rebelião em Velha Mondstadt & Ascensão de Barbatos',
    yearsAgoDisplay: '~2.600 AA',
    dateDisplay: '~2.600 Anos Atrás • A Canção da Liberdade',
    eraName: 'A Guerra dos Arcontes',
    summary: 'Um bardo sem nome, Gunnhildr, o cavaleiro Ragnvindr e um pequeno espírito do vento derrubam o tirano Decarabian.',
    description: 'Enclausurada pelas tempestades intransponíveis do Deus das Tempestades Decarabian na Velha Mondstadt, a população rebelou-se pela liberdade guiada por um jovem bardo, Amos, o clã Gunnhildr e um humilde espírito dos ventos. Com a queda de Decarabian e a morte do bardo, o espírito ascendeu como o Deus Anemo Barbatos, assumindo a forma do amigo falecido para soprar liberdade sobre a terra.',
    tags: {
      region: 'Mondstadt',
      factions: ['Rebeldes da Velha Mondstadt', 'Clã Gunnhildr'],
      characters: ['Barbatos', 'O Bardo Sem Nome', 'Decarabian', 'Amos'],
      spoilerLevel: 'Prólogo da Missão do Arconte'
    }
  },
  'andrius-surrenders': {
    title: 'Andrius Cede o Trono Anemo a Barbatos',
    yearsAgoDisplay: '~2.600 AA',
    dateDisplay: '~2.600 Anos Atrás • O Vento Dispersa a Neve',
    eraName: 'A Guerra dos Arcontes',
    summary: 'Andrius percebe que seus ventos congelantes não podem nutrir a vida humana e escolhe ceder a autoridade Anemo a Barbatos.',
    description: 'Reconhecendo que suas nevascas glaciais eram incompatíveis com a felicidade e o cultivo da humanidade, o grande lobo Andrius recusou o Trono Celestial de Anemo. Ele permitiu que sua forma física se dissolvesse na terra para enriquecê-la, tornando-se o espírito guardião Reino dos Lobos e deixando o governo do vento para Barbatos, que derreteu as neves de Mondstadt com brisas quentes.',
    tags: {
      region: 'Mondstadt',
      factions: ['Quatro Ventos de Mondstadt', 'Lobos de Wolvendom'],
      characters: ['Andrius', 'Barbatos'],
      spoilerLevel: 'Missão Lendária de Razor / Prólogo'
    }
  },
  'orobashi-watatsumi': {
    title: 'Orobashi Resgata Enkanomiya e Erguer Watatsumi',
    yearsAgoDisplay: '~2.500 AA',
    dateDisplay: '~2.500 Anos Atrás • A Serpente e os Corais',
    eraName: 'A Guerra dos Arcontes',
    summary: 'A grande serpente Orobashi descobre o povo de Enkanomiya no abismo e cria a Ilha Watatsumi com seus corais luminosos.',
    description: 'Fugindo da Guerra dos Arcontes nas terras continentais, a colossal serpente Orobashi caiu nas trevas de Enkanomiya. Comovido pelo sofrimento dos humanos encurralados pelos Vishaps, Orobashi quebrou seus próprios ramos de coral radiantes para criar escadarias até a superfície, erguendo a paradisíaca Ilha Watatsumi no oceano de Inazuma.',
    tags: {
      region: 'Enkanomiya & Inazuma',
      factions: ['Clã Sangonomiya', 'Enkanomiya'],
      characters: ['Orobashi'],
      spoilerLevel: 'Missões do Mundo da Ilha Watatsumi'
    }
  },
  'xbalanque-tollan': {
    title: 'Libertação de Tollan & Primeiro Arconte Pyro Xbalanque',
    yearsAgoDisplay: '~2.500 AA',
    dateDisplay: '~2.500 Anos Atrás • As Chamas do Renascimento',
    eraName: 'A Guerra dos Arcontes',
    summary: 'Xbalanque liberta a humanidade da tirania do Dragão das Chamas Primordiais e torna-se o primeiro Arconte Pyro de Natlan.',
    description: 'Nas terras vulcânicas de Natlan, o lendário herói Xbalanque enfrentou o tirânico dragão Soberano de Fogo que escravizava as tribos mortais. Com a bênção da Chama Sagrada e o poder do Reino da Noite, Xbalanque derrotou o tirano em Tollan, fundou o sistema das tribos unificadas e ascendeu como o Primeiro Arconte Pyro sob a proteção do Ode da Ressurreição.',
    tags: {
      region: 'Natlan',
      factions: ['Tribos de Natlan', 'Ancestrais Wayob'],
      characters: ['Xbalanque', 'Habitantes da Noite'],
      spoilerLevel: 'Missão do Arconte de Natlan Capítulo V'
    }
  },
  'slaying-of-orobashi': {
    title: 'Raiden Ei Derrota Orobashi na Ilha Yashiori',
    yearsAgoDisplay: '~2.000 AA',
    dateDisplay: '~2.000 Anos Atrás • O Corte do Musou no Hitotachi',
    eraName: 'A Guerra dos Arcontes',
    summary: 'Orobashi invade o território do Xogunato após ler um livro proibido; Raiden Ei desfere o Musou no Hitotachi na Ilha Yashiori.',
    description: 'Condenado à morte por Celestia após ler acidentalmente o livro proibido "Antes do Sol e da Lua" em Enkanomiya, Orobashi liderou uma invasão deliberada contra a Ilha Yashiori para garantir o futuro de Watatsumi. Raiden Ei desferiu o supremo Musou no Hitotachi, partindo a serpente e a ilha ao meio no Desfiladeiro Musoujin, deixando o legado eterno da Tatarigami.',
    tags: {
      region: 'Inazuma',
      factions: ['Xogunato de Inazuma', 'Ilha Watatsumi'],
      characters: ['Raiden Ei', 'Raiden Makoto', 'Orobashi', 'Sasayuri'],
      spoilerLevel: 'Missão do Arconte Capítulo II'
    }
  },
  'deshret-sacrifice': {
    title: 'O Sacrifício do Conhecimento Proibido do Rei Deshret',
    yearsAgoDisplay: '~2.000 AA',
    dateDisplay: '~2.000 Anos Atrás • A Punição das Areias',
    eraName: 'A Guerra dos Arcontes',
    summary: 'O Rei Deshret desencadeia acidentalmente o Conhecimento Proibido; Rukkhadevata e os espíritos do oásis contêm a praga enquanto Deshret se sacrifica.',
    description: 'Buscando desafiar as leis de Celestia, o Rei Deshret abriu os caminhos para o Conhecimento Proibido do Abismo. A corrupção enlouqueceu seus súditos e gerou a doença do Eleazar. Reconhecendo seu erro trágico, Deshret sacrificou sua própria vida enquanto a Maior Lorde Rukkhadevata encolheu seu corpo divino para purificar as areias com templos de cura.',
    tags: {
      region: 'Sumeru',
      factions: ['Império do Rei Deshret', 'Seguidores da Arconte Dendro'],
      characters: ['Rei Deshret', 'Maior Lorde Rukkhadevata', 'Kasala'],
      spoilerLevel: 'Missão do Arconte Capítulo III: Ato IV'
    }
  },
  'fall-of-remuria-fontaine': {
    title: 'Queda de Remuria & Ascensão de Egeria',
    yearsAgoDisplay: '~2.000 AA',
    dateDisplay: '~2.000 Anos Atrás • A Aliança das Águas Claras',
    eraName: 'A Paz dos Sete & Eras Mortais',
    summary: 'O Império Remuriano entra em colapso; Egeria é libertada e assume o Trono Hydro de Fontaine ao lado das Oceânidas.',
    description: 'A corrupção do Ichor e a revolta dos escravos humanos e Vishaps culminaram no afundamento cataclísmico da capital Remuria. Celestia libertou Egeria, a criação pura de Phanes feita de águas primordiais, para reinar como a primeira Arconte Hydro, pacificando os conflitos e criando a Corte de Fontaine.',
    tags: {
      region: 'Fontaine',
      factions: ['Remuria', 'Corte de Fontaine'],
      characters: ['Egeria', 'Rei-Deus Remus', 'Cassiodor'],
      spoilerLevel: 'Missões do Mundo do Mar de Eras Passadas'
    }
  },
  'mondstadt-aristocracy-rebellion': {
    title: 'A Rebelião de Vennessa & Fundação dos Cavaleiros de Favonius',
    yearsAgoDisplay: '~1.000 AA',
    dateDisplay: '~1.000 Anos Atrás • O Levantar da Leoa Dourada',
    eraName: 'A Paz dos Sete & Eras Mortais',
    summary: 'A gladiadora Vennessa alia-se a Barbatos para derrubar a tirânica aristocracia Lawrence e fundar os Cavaleiros de Favonius.',
    description: 'Sob o domínio decadente e opressor dos nobres do clã Lawrence, Mondstadt perdeu sua liberdade. A escrava guerreira Vennessa, das tribos de Natlan, desafiou o dragão Ursa o Devastador na arena com o auxílio do bardo Venti. Com o povo inspirado, a aristocracia foi deposta e os Cavaleiros de Favonius foram instituídos para proteger a liberdade de Mondstadt.',
    tags: {
      region: 'Mondstadt',
      factions: ['Cavaleiros de Favonius', 'Aristocracia de Mondstadt'],
      characters: ['Vennessa', 'Barbatos', 'Ragnvindr'],
      spoilerLevel: 'Mangá de Genshin Impact / Missão Lendária de Venti'
    }
  },
  'ascension-of-vennessa': {
    title: 'Vennessa Ascende a Celestia como o Falcão do Oeste',
    yearsAgoDisplay: '~950 AA',
    dateDisplay: '~950 Anos Atrás • As Asas da Ascensão',
    eraName: 'A Paz dos Sete & Eras Mortais',
    summary: 'Após governar Mondstadt com justiça, Vennessa ascende a Celestia na Árvore de Windrise, tornando-se o Falcão dos Quatro Ventos.',
    description: 'Ao concluir seus anos de liderança benevolente, Vennessa viajou até a grande planície de Windrise. Diante do carvalho colossal, ela ascendeu às ilhas celestiais de Celestia em forma de falcão, passando a vigiar a cidade como o Falcão do Oeste entre os Quatro Ventos de Mondstadt.',
    tags: {
      region: 'Mondstadt',
      factions: ['Quatro Ventos de Mondstadt', 'Cavaleiros de Favonius'],
      characters: ['Vennessa', 'Barbatos'],
      spoilerLevel: 'Missão Lendária de Venti: Carmen Dei'
    }
  },
  'guhua-ascension': {
    title: 'A Lenda e Ascensão do Mestre Guhua',
    yearsAgoDisplay: '~800 AA',
    dateDisplay: '~800 Anos Atrás • A Espada e a Chuva de Pétalas',
    eraName: 'A Paz dos Sete & Eras Mortais',
    summary: 'O lendário espadachim Guhua alcança o ápice das artes marciais em Liyue e ascende aos céus no Salão Wangshan.',
    description: 'Em Liyue, o venerado mestre Guhua unificou as artes marciais de espadas e lanças na Fraternidade Guhua. Após realizar inúmeros feitos de justiça sem jamais tirar a vida de inocentes, diz-se que Guhua atingiu a iluminação marcial máxima e ascendeu em uma chuva de flores roxas no Salão Wangshan.',
    tags: {
      region: 'Liyue',
      factions: ['Fraternidade Guhua'],
      characters: ['Mestre Guhua'],
      spoilerLevel: 'Missão Lendária de Xingqiu / Salão Wangshan'
    }
  },
  'khaenriah-cataclysm-outbreak': {
    title: 'O Cataclismo: Rhinedottir & Os Cinco Pecadores',
    yearsAgoDisplay: '500 AA',
    dateDisplay: '500 Anos Atrás • A Fenda Abissal de Khaenri\'ah',
    eraName: 'O Cataclismo de Khaenri\'ah',
    summary: 'A alquimista de Khaenri\'ah, Rhinedottir, e os Cinco Pecadores quebram as fronteiras do Abismo, liberando horrores pelo mundo.',
    description: 'Nas entranhas da dinastia Eclipse em Khaenri\'ah, os maiores mestres da Khemia violaram os limites cósmicos. Rhinedottir (Ouro) criou monstros das trevas como Durin e os Cães da Fenda. As forças do Abismo rasgaram as barreiras dimensionais, desencadeando um dilúvio de escuridão corrosiva em todas as nações de Teyvat.',
    tags: {
      region: 'Khaenri\'ah',
      factions: ['Dinastia Eclipse', 'Os Cinco Pecadores', 'Ordem do Abismo'],
      characters: ['Rhinedottir', 'Rei Irmin', 'Dainsleif', 'Surtalogi'],
      spoilerLevel: 'Missão do Arconte Capítulo IV / Caribert'
    }
  },
  'destruction-of-khaenriah': {
    title: 'Destruição de Khaenri\'ah & A Maldição da Selvageria',
    yearsAgoDisplay: '500 AA',
    dateDisplay: '500 Anos Atrás • A Punição dos Princípios Celestiais',
    eraName: 'O Cataclismo de Khaenri\'ah',
    summary: 'Celestia e os Arcontes destroem Khaenri\'ah; os mortais são afligidos com a maldição da imortalidade e da transformação em monstros.',
    description: 'Celestia interveio com fúria implacável para aniquilar Khaenri\'ah. A civilização milenar foi reduzida a escombros flamejantes. Os deuses impuseram a Maldição da Imortalidade aos cidadãos puros de Khaenri\'ah (como Dainsleif), enquanto o restante dos habitantes foi amaldiçoado a perder sua humanidade, regredindo em Hilichurls e criaturas monstruosas.',
    tags: {
      region: 'Khaenri\'ah',
      factions: ['Dinastia de Khaenri\'ah', 'Celestia'],
      characters: ['Dainsleif', 'Guardiã dos Princípios Celestiais', 'O Viajante Gêmeo'],
      spoilerLevel: 'Missão do Arconte: Réquiem dos Profundos Ecos / Caribert'
    }
  },
  'fall-of-durin-dragonspine': {
    title: 'A Queda de Durin na Espinha do Dragão',
    yearsAgoDisplay: '500 AA',
    dateDisplay: '500 Anos Atrás • O Sangue Corrompido na Neve',
    eraName: 'O Cataclismo de Khaenri\'ah',
    summary: 'O dragão corrompido Durin invade Mondstadt; Dvalin e Barbatos enfrentam o monstro e o derrubam nos picos nevados.',
    description: 'Criado por Rhinedottir com a ilusão inocente de uma canção pacífica, o colossal dragão sombrio Durin sobrevoou Mondstadt com veneno cáustico. Atendendo às preces do povo, Barbatos convocou o dragão Dvalin. Em uma batalha nos céus sobre a Espinha do Dragão, Dvalin dilacerou a garganta de Durin, caindo nas neves onde o coração venenoso do monstro ainda pulsa.',
    tags: {
      region: 'Mondstadt',
      factions: ['Quatro Ventos de Mondstadt', 'Ordem do Abismo'],
      characters: ['Dvalin', 'Barbatos', 'Durin', 'Rhinedottir'],
      spoilerLevel: 'O Príncipe de Giz e o Dragão / Prólogo'
    }
  },
  'chasm-sacrifice-bosacius': {
    title: 'Bosacius e Boyang Selam a Brecha Abissal no Despenhadeiro',
    yearsAgoDisplay: '500 AA',
    dateDisplay: '500 Anos Atrás • A Última Batalha nas Profundezas',
    eraName: 'O Cataclismo de Khaenri\'ah',
    summary: 'O Yaksha Bosacius e o taumaturgo Boyang sacrificam-se selando a fenda abissal nas entranhas do Despenhadeiro.',
    description: 'Quando as hordas abissais irromperam pelas galerias inferiores do Despenhadeiro, o Millelith travou uma defesa desesperada. O Yaksha Bosacius, atormentado pelo débito cármico mas lembrando-se de seu dever protetor, desceu ao espaço místico ao lado do mago Boyang, selando o Compasso Fantástico por dentro para deter os monstros à custa de suas próprias vidas.',
    tags: {
      region: 'Liyue',
      factions: ['Millelith', 'Cinco Yakshas'],
      characters: ['Bosacius', 'Boyang', 'Yelan (Ancestrais)', 'Morax'],
      spoilerLevel: 'Missão do Arconte Interlúdio: Trilha Perigosa'
    }
  },
  'deaths-of-the-archons': {
    title: 'Os Sacrifícios de Makoto, Rukkhadevata & Egeria',
    yearsAgoDisplay: '500 AA',
    dateDisplay: '500 Anos Atrás • O Luto dos Sete Tronos',
    eraName: 'O Cataclismo de Khaenri\'ah',
    summary: 'Vários Arcontes originais perecem durante o Cataclismo: Makoto em Khaenri\'ah, Egeria em Tunigi Hollow, e Rukkhadevata em Irminsul.',
    description: 'O Cataclismo dizimou a primeira geração dos Sete Arcontes. Raiden Makoto viajou secretamente para Khaenri\'ah e faleceu nos braços de Ei. Egeria morreu no deserto de Sumeru, seu corpo transformando-se nas águas de Amrita. A Maior Lorde Rukkhadevata esgotou seu poder divino salvando a Árvore Irminsul da contaminação abissal, nascendo de seu ramo mais puro a jovem Nahida.',
    tags: {
      region: 'Inazuma / Sumeru / Fontaine',
      factions: ['Os Sete Arcontes'],
      characters: ['Raiden Makoto', 'Raiden Ei', 'Egeria', 'Maior Lorde Rukkhadevata', 'Nahida'],
      spoilerLevel: 'Missões do Arconte de Sumeru / Fontaine'
    }
  },
  'founding-of-abyss-order': {
    title: 'Chlothar Alberich Funda a Ordem do Abismo',
    yearsAgoDisplay: '~400 AA',
    dateDisplay: '~400 Anos Atrás • O Tecelão do Destino',
    eraName: 'Era Moderna & Jornada dos Viajantes',
    summary: 'O nobre de Khaenri\'ah Chlothar Alberich descobre o poder do Pecador e funda a Ordem do Abismo ao lado do Viajante Gêmeo.',
    description: 'Consumido pela dor ao testemunhar seu filho Caribert transformado em Hilichurl pela maldição divina, Chlothar encontrou um cristal abissal reverberando com a voz de um "Pecador". Renovado com fé fanática nas forças do Abismo, Chlothar abandonou sua humanidade e fundou a Ordem do Abismo, acolhendo o Viajante Gêmeo como seu líder soberano.',
    tags: {
      region: 'Sumeru & Khaenri\'ah',
      factions: ['Ordem do Abismo', 'Clã Alberich'],
      characters: ['Chlothar Alberich', 'Caribert', 'O Viajante Gêmeo', 'Dainsleif'],
      spoilerLevel: 'Missão do Arconte Capítulo III: Ato VI - Caribert'
    }
  },
  'focalors-furina-masquerade': {
    title: 'Focalors Divide Sua Divindade & Início do Baile de Furina',
    yearsAgoDisplay: '~500 AA',
    dateDisplay: '~500 Anos Atrás • O Julgamento de 500 Anos',
    eraName: 'Era Moderna & Jornada dos Viajantes',
    summary: 'A Arconte Hydro Focalors separa sua divindade de seu corpo humano, encarregando Furina de interpretar a Arconte por 500 anos.',
    description: 'Para enganar os Princípios Celestiais e evitar a dissolução profetizada do povo de Fontaine, a Arconte Focalors separou seu espírito divino em Oratrice Mecanique d\'Analyse Cardinale, deixando seu corpo humano como Furina. Por meio milênio de solidão agoniante, Furina atuou perante o público como uma deusa confiante para acumular Indemnitium suficiente para sacrificar o próprio Trono Divino de Hydro.',
    tags: {
      region: 'Fontaine',
      factions: ['Corte de Fontaine'],
      characters: ['Focalors', 'Furina', 'Neuvillette', 'Egeria'],
      spoilerLevel: 'Missão do Arconte Capítulo IV: Ato V - Máscara dos Culpados'
    }
  },
  'rosalyne-crimson-witch': {
    title: 'Rosalyne Torna-se a Bruxa Carmesim das Chamas',
    yearsAgoDisplay: '~480 AA',
    dateDisplay: '~480 Anos Atrás • As Cinzas do Luto',
    eraName: 'Era Moderna & Jornada dos Viajantes',
    summary: 'Após a morte de seu amado Rostam no Cataclismo, a donzela de Mondstadt Rosalyne queima seu corpo com chamas líquidas.',
    description: 'Ao retornar de seus estudos na Academia de Sumeru, a jovem cantora Rosalyne-Kruzchka Lohefalter descobriu que seu amado cavaleiro Rostam havia morrido enfrentando os monstros do Cataclismo. Em desespero incandescente, ela converteu seu próprio corpo em fogo líquido carmesim, vagando pelo mundo para purificar monstros antes de ser recrutada por Pierro como a Harbinger La Signora.',
    tags: {
      region: 'Mondstadt / Snezhnaya',
      factions: ['Mensageiros dos Fatui'],
      characters: ['Rosalyne (La Signora)', 'Rostam', 'Pierro'],
      spoilerLevel: 'Bruxa Carmesim das Chamas / Missão do Arconte de Inazuma'
    }
  },
  'neuvillette-iudex': {
    title: 'Neuvillette é Nomeado Iudex de Fontaine',
    yearsAgoDisplay: '~400 AA',
    dateDisplay: '~400 Anos Atrás • A Justiça das Águas',
    eraName: 'Era Moderna & Jornada dos Viajantes',
    summary: 'Focalors convida a reencarnação do Soberano Hydro, Neuvillette, para atuar como Juiz Supremo na Corte de Fontaine.',
    description: 'Buscando reconectar o Dragão Soberano da Água com a humanidade e prepará-lo para herdar a autoridade elemental plena após o julgamento celestial, Focalors convidou Neuvillette para Fontaine. Durante quatrocentos anos como Iudex no Palais Mermonia, Neuvillette aprendeu sobre os sentimentos e lágrimas mortais, tornando-se o pilar inabalável da justiça da nação.',
    tags: {
      region: 'Fontaine',
      factions: ['Corte de Fontaine', 'Marechaussee Phantom'],
      characters: ['Neuvillette', 'Furina', 'Focalors'],
      spoilerLevel: 'Missão Lendária de Neuvillette: Capítulo Diluvies'
    }
  },
  'tatarasuna-incident': {
    title: 'O Incidente da Forja de Tatarasuna & A Traição de Scaramouche',
    yearsAgoDisplay: '~400 AA',
    dateDisplay: '~400 Anos Atrás • O Fogo Negro da Forja Mikage',
    eraName: 'Era Moderna & Jornada dos Viajantes',
    summary: 'O agente Fatui Dottore sabota a Forja Mikage em Tatarasuna, manipulando o jovem Kabukimono (Scaramouche).',
    description: 'Criado e adormecido por Raiden Ei como um protótipo de marionete, o jovem Kabukimono viveu pacificamente entre os ferreiros de Tatarasuna. O diplomata Fatui "Escher" (Il Dottore disfarçado) sabotou a forja com energia de Tatarigami e enganou a marionete, fazendo-a crer que fora traída por seu amigo humano Niwa, semeando o ódio ardente que o levou a juntar-se aos Fatui.',
    tags: {
      region: 'Inazuma',
      factions: ['Artesãos de Tatarasuna', 'Fatui'],
      characters: ['Kabukimono (Scaramouche)', 'Niwa Nagamitsu', 'Dottore (Escher)'],
      spoilerLevel: 'Missão do Arconte Interlúdio: Inversão da Gênese'
    }
  },
  'raiden-gokaden-fall': {
    title: 'A Vingança de Scaramouche & Queda da Raiden Gokaden',
    yearsAgoDisplay: '~100 AA',
    dateDisplay: '~100 Anos Atrás • O Fim dos Mestres Ferreiros',
    eraName: 'Era Moderna & Jornada dos Viajantes',
    summary: 'Scaramouche sabota os diagramas de forjamento das cinco grandes escolas de forja de Inazuma, destruindo as linhagens dos ferreiros.',
    description: 'Em vingança contra o Xogunato e a linhagem dos ferreiros de Tatarasuna, Scaramouche (Kunukuzushi) infiltrou-se nas cinco lendárias escolas da Raiden Gokaden. Ele corrompeu os diagramas de forjamento do Xogum, provocando a ruína e execução de mestres de renome (incluindo os ancestrais de Kaedehara Kazuha e do clã Kamisato), antes de poupar a família Isshin em homenagem a Niwa.',
    tags: {
      region: 'Inazuma',
      factions: ['Raiden Gokaden', 'Clã Kaedehara', 'Clã Kamisato'],
      characters: ['Scaramouche', 'Kaedehara Yoshinori'],
      spoilerLevel: 'Missão de Evento Cores do Jardim Violeta'
    }
  },
  'crepus-delusion-incident': {
    title: 'O Incidente do Olho da Corrupção de Crepus & A Partida de Diluc',
    yearsAgoDisplay: '~4 AA',
    dateDisplay: '4 Anos Atrás • O Julgamento do Vinhedo',
    eraName: 'Era Moderna & Jornada dos Viajantes',
    summary: 'O Mestre Crepus morre usando um Olho da Corrupção para salvar Diluc do monstro Ursa; Diluc renuncia aos Cavaleiros de Favonius.',
    description: 'No aniversário de 18 anos de Diluc Ragnvindr, a carruagem de seu pai foi emboscada pelo monstro Ursa o Devastador. Para proteger o filho, Crepus utilizou um Olho da Corrupção dos Fatui, sofrendo ferimentos fatais pelo recuo do poder das trevas. Desiludido pela tentativa do Inspetor Eroch dos Cavaleiros de Favonius de encobrir o ocorrido, Diluc entregou sua Visão Pyro e viajou sozinho pelas sete nações caçando os Fatui.',
    tags: {
      region: 'Mondstadt',
      factions: ['Cavaleiros de Favonius', 'Fatui', 'Clã Ragnvindr'],
      characters: ['Diluc Ragnvindr', 'Crepus Ragnvindr', 'Kaeya'],
      spoilerLevel: 'Mangá de Genshin Impact / História 4 de Diluc'
    }
  },
  'traveler-awakens': {
    title: 'O Despertar do Viajante: A Praia de Starfell',
    yearsAgoDisplay: 'Ano 0 (Presente)',
    dateDisplay: 'O Início da Jornada • Praia de Starfell, Mondstadt',
    eraName: 'Era Moderna & Jornada dos Viajantes',
    summary: 'O Viajante desperta após 500 anos de sono, resgata Paimon no mar e dá início à sua jornada pelas Sete Nações de Teyvat.',
    description: 'Após cinco séculos de sono selado pela Guardiã dos Princípios Celestiais, o Viajante acorda na costa deserta de Mondstadt. Ao lançar uma vara de pesca, resgata a pequena Paimon de morrer afogada. Como sua nova guia e companheira inseparável, Paimon conduz o Viajante até a Estátua dos Sete no Lago Estelar, ressoando com o elemento Anemo e dando início à grande odisseia por Teyvat em busca do gêmeo perdido.',
    tags: {
      region: 'Mondstadt',
      factions: ['Viajante & Paimon'],
      characters: ['O Viajante', 'Paimon'],
      spoilerLevel: 'Prólogo da Missão do Arconte: Ato I'
    }
  }
};

const eventsPt = eventsEn.map(ev => {
  const ptData = eventsPtMap[ev.id] || {};
  return {
    ...ev,
    ...ptData,
    tags: {
      ...ev.tags,
      ...(ptData.tags || {})
    }
  };
});

fs.writeFileSync(EVENTS_PT_FILE, JSON.stringify(eventsPt, null, 2), 'utf8');
console.log(`✅ Saved ${eventsPt.length} translated events to ${EVENTS_PT_FILE}`);
