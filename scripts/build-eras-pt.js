import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const ERAS_FILE = path.join(rootDir, 'data', 'eras.json');
const EVENTS_FILE = path.join(rootDir, 'data', 'events.json');
const ERAS_PT_FILE = path.join(rootDir, 'data', 'eras_pt.json');
const EVENTS_PT_FILE = path.join(rootDir, 'data', 'events_pt.json');

const erasEn = JSON.parse(fs.readFileSync(ERAS_FILE, 'utf8'));
const eventsEn = JSON.parse(fs.readFileSync(EVENTS_FILE, 'utf8'));

// Portuguese translations for Eras
const erasPtMap = {
  'dragon-sovereigns': {
    name: 'Mundo Antigo (Sete Soberanos)',
    shortName: 'Mundo Antigo',
    yearRange: '>7.000 Anos Atrás',
    description: 'A era pré-gênese quando o primordial Reino da Luz era governado exclusivamente pelos Sete Soberanos Dragões sob o Rei Dragão Nibelung, antes da chegada dos deuses ou da humanidade.',
    longDescription: 'Antes de o firmamento ser forjado e os céus lançarem sua luz sobre Teyvat, o mundo pertencia ao Reino da Luz. Sete dragões elementais detinham o domínio supremo sobre Pyro, Hydro, Anemo, Electro, Dendro, Cryo e Geo. Guiadas pelo Rei Dragão Nibelung, as antigas civilizações dos vishaps prosperavam em harmonia elemental pura. Quando ameaças cósmicas surgiram, Nibelung aventurou-se no Mar Escuro além das fronteiras de Teyvat, retornando com um poder proibido de fora deste mundo para resistir às forças celestiais que logo desceriam.',
    keyFigures: [
      'Rei Dragão Nibelung',
      'Apep (Soberana Dendro)',
      'Scylla (Soberano Hydro)',
      'Vishaps das Profundezas'
    ],
    dominantFactions: [
      'Sete Soberanos Dragões',
      'Vishaps do Reino da Luz'
    ]
  },
  'primordial-one': {
    name: 'O Primeiro Que Veio',
    shortName: 'O Primeiro Que Veio',
    yearRange: '~6.000 – 5.000 AA',
    description: 'A chegada de Phanes (O Primeiro Que Veio), criação das Quatro Sombras, quarenta anos de guerra para destronar os dragões e o alvorecer da Civilização Humana Unificada.',
    longDescription: 'O Primeiro Que Veio (Phanes), o Primeiro Descendente, chegou do cosmos há mais de 6.000 anos. Acompanhado por quatro sombras radiantes — incluindo Istaroth, a Sombra do Tempo — Phanes travou uma guerra apocalíptica de quarenta anos contra os Sete Soberanos Dragões. Ao quebrar o domínio dos dragões, Phanes terraformou as duras paisagens elementais, criou os primeiros humanos e estabeleceu uma civilização global singular. Nesta era de ouro, a humanidade compartilhava um único idioma, erguia megálitos subterrâneos por todo o globo e recebia revelações diretamente de enviados celestiais.',
    keyFigures: [
      'Phanes (O Primeiro Que Veio)',
      'Istaroth (Kairos)',
      'As Quatro Sombras',
      'Ancestrais Seelie',
      'Morax'
    ],
    dominantFactions: [
      'Celestia',
      'As Quatro Sombras',
      'Civilização Humana Unificada'
    ]
  },
  'second-who-came': {
    name: 'Guerra da Chama Funerária',
    shortName: 'Guerra da Chama Funerária',
    yearRange: '~5.000 – 4.000 AA',
    description: 'O Segundo Que Veio descende; céus e terra despedaçam-se em guerra; Enkanomiya afunda no mar escuro; e Pregos Celestiais atingem Teyvat.',
    longDescription: 'A paz da Civilização Unificada foi violentamente despedaçada cerca de 5.000 anos atrás quando "O Segundo Que Veio" chegou de além dos céus. Uma guerra sem precedentes rasgou a cúpula celestial, quebrando placas continentais. O reino de Byakuyakoku (Enkanomiya) separou-se e afundou nas profundezas abissais do oceano, enquanto Celestia lançou Pregos Celestiais dos céus — atingindo Sal Vindagnyr (Espinha do Dragão), o Despenhadeiro e o deserto de Sumeru para conter fendas dimensionais e suprimir a corrupção abissal. A raça Seelie foi amaldiçoada a regredir em espíritos errantes após uma união proibida.',
    keyFigures: [
      'O Segundo Que Veio',
      'Phanes',
      'Istaroth',
      'Abe Yoshihisa'
    ],
    dominantFactions: [
      'Celestia',
      'Byakuyakoku (Enkanomiya)',
      'Remanescentes Seelie'
    ]
  },
  'interim-period': {
    name: 'A Era dos Antigos Reinos',
    shortName: 'Antigos Reinos',
    yearRange: '~4.000 – 3.000 AA',
    description: 'A ascensão de civilizações humanas fragmentadas: Sal Vindagnyr, o Império Remuriano de Fontaine, Gurabad no deserto e a Assembleia Guili.',
    longDescription: 'Após a queda da Civilização Unificada, a humanidade espalhou-se e fundou reinos regionais lendários. Em Fontaine, o Rei-Deus Remus governou a vasta civilização musical de Remuria antes de sua trágica queda profetizada. Em Mondstadt, Decarabian e Andrius disputavam as terras gélidas. Nas planícies de Liyue, Morax e Guizhong formaram a Assembleia Guili, cultivando a agricultura e o comércio pacífico. No deserto de Sumeru, os Três Deuses-Reis (Rei Deshret, Rukkhadevata e Nabu Malikata) governaram em harmonia antes de a ambição de Deshret pelo Conhecimento Proibido trazer calamidade.',
    keyFigures: [
      'Morax',
      'Guizhong',
      'Rei Deshret',
      'Maior Lorde Rukkhadevata',
      'Nabu Malikata (Deusa das Flores)',
      'Rei-Deus Remus'
    ],
    dominantFactions: [
      'Assembleia Guili',
      'Império Remuriano',
      'Civilização de Sal Vindagnyr',
      'Três Deuses-Reis de Sumeru'
    ]
  },
  'archon-war': {
    name: 'A Guerra dos Arcontes',
    shortName: 'Guerra dos Arcontes',
    yearRange: '~3.700 – 2.000 AA',
    description: 'Conflito divino por toda Teyvat pelos Sete Tronos Divinos. Fundação dos Sete Países e ascensão dos primeiros Arcontes.',
    longDescription: 'Incitados pela determinação de Celestia de estabelecer uma ordem estável governada por apenas sete deuses, divindades por toda Teyvat entraram em séculos de guerras sangrentas. Em Mondstadt, Barbatos ascendeu com a rebelião que derrubou Decarabian. Em Liyue, Morax selou divindades como Osial e fundou o Porto de Liyue ao lado dos Adepti. Em Inazuma, Makoto e Ei unificaram as ilhas após derrotar Orobashi. Em Sumeru, Rukkhadevata estabeleceu a Academia após o sacrifício de Deshret. Ao término da guerra, os primeiros Sete Arcontes reuniram-se em Liyue para celebrar a nova ordem mundial.',
    keyFigures: [
      'Morax (Rex Lapis)',
      'Barbatos (Venti)',
      'Raiden Ei & Raiden Makoto',
      'Maior Lorde Rukkhadevata',
      'Egeria',
      'Decarabian',
      'Osial',
      'Orobashi'
    ],
    dominantFactions: [
      'Adepti de Liyue',
      'Os Sete Arcontes',
      'Millelith',
      'Povo Livre de Mondstadt'
    ]
  },
  'post-archon-war': {
    name: 'A Paz dos Sete & Eras Mortais',
    shortName: 'Paz dos Sete',
    yearRange: '~2.000 – 500 AA',
    description: 'Consolidação das culturas nacionais, a Rebelião de Vennessa em Mondstadt, a ascensão dos Cavaleiros de Favonius e o surgimento das Sete Nações modernas.',
    longDescription: 'Com os Sete Tronos estabelecidos, Teyvat desfrutou de séculos de relativa estabilidade. Em Mondstadt, a tirania da aristocracia Lawrence foi derrubada por Vennessa com o auxílio de Barbatos, fundando os Cavaleiros de Favonius e a Igreja de Favonius cerca de 1.000 anos atrás. Em Liyue, o Qixing e as guildas mercantis assumiram a governança civil sob o Pacto com Rex Lapis. Em Fontaine, Egeria e as Lochfolk (Oceânidas) mantinham as águas prístinas, enquanto a nação sem deuses de Khaenri\'ah no subterrâneo avançava sua ciência de artifício mecânico (Khemia) a patamares espantosos.',
    keyFigures: [
      'Vennessa',
      'Rex Lapis',
      'Egeria',
      'Dainsleif',
      'Rhinedottir (Ouro)'
    ],
    dominantFactions: [
      'Cavaleiros de Favonius',
      'Liyue Qixing',
      'Igreja de Favonius',
      'Reino de Khaenri\'ah'
    ]
  },
  'cataclysm': {
    name: 'O Cataclismo de Khaenri\'ah',
    shortName: 'O Cataclismo',
    yearRange: '500 Anos Atrás',
    description: 'A queda do reino subterrâneo de Khaenri\'ah, invasão de monstros abissais em escala global, a morte de múltiplos Arcontes e a maldição da imortalidade e bestialidade.',
    longDescription: 'Quinhentos anos atrás, a alquimista de Khaenri\'ah, Rhinedottir (Ouro), e os Cinco Pecadores abriram os portões do Abismo, liberando uma onda de criaturas monstruosas (como Durin e os Cães da Fenda) que inundaram todas as nações de Teyvat. Celestia e os Arcontes desceram para erradicar Khaenri\'ah, resultando na morte de Makoto em Khaenri\'ah, a queda de Egeria em Tunigi Hollow, e a contaminação de Rukkhadevata pelo Conhecimento Proibido. Os habitantes de sangue puro de Khaenri\'ah foram amaldiçoados com imortalidade eterna, enquanto os povos não-puros foram transformados em Hilichurls. O viajante gêmeo despertou em meio às chamas antes de ser selado pela Deusa Desconhecida.',
    keyFigures: [
      'Dainsleif',
      'Rhinedottir (Ouro)',
      'Rei Irmin',
      'Raiden Makoto',
      'Egeria',
      'Maior Lorde Rukkhadevata',
      'O Viajante Gêmeo'
    ],
    dominantFactions: [
      'Ordem do Abismo',
      'Os Sete Arcontes',
      'Guarda Real de Khaenri\'ah',
      'Millelith & Adepti'
    ]
  },
  'modern': {
    name: 'Era Moderna & Jornada dos Viajantes',
    shortName: 'Era Moderna',
    yearRange: 'Presente (Ano 0)',
    description: 'O Viajante desperta na praia de Starfell, pesca Paimon e viaja pelas Sete Nações enquanto os Onze Mensageiros dos Fatui coletam as Gnosis sob o comando da Tsaritsa.',
    longDescription: 'Quinhentos anos após serem separados pela Guardiã dos Princípios Celestiais, o Viajante desperta em Teyvat e resgata Paimon na Costa das Estrelas. Juntos, embarcam em uma odisseia épica pelas sete nações: purificando Dvalin em Mondstadt; testemunhando a "morte" simulada de Rex Lapis e a transição para a era dos mortais em Liyue; abolindo o Decreto de Caça às Visões em Inazuma; resgatando Nahida e erradicando o Conhecimento Proibido do Irminsul em Sumeru; testemunhando o julgamento de Focalors e a devolução da Autoridade Elemental do Dragão em Fontaine; e marchando em direção a Natlan e à glacial Snezhnaya da Tsaritsa, onde os Fatui reúnem as Sete Gnosis para desafiar as ordens divinas de Celestia.',
    keyFigures: [
      'O Viajante (Aether/Lumine)',
      'Paimon',
      'Zhongli',
      'Venti',
      'Raiden Shogun',
      'Nahida',
      'Furina & Neuvillette',
      'Tsaritsa & Os Fatui Harbingers'
    ],
    dominantFactions: [
      'Os Onze Mensageiros dos Fatui',
      'Ordem do Abismo',
      'Cavaleiros de Favonius',
      'Liyue Qixing',
      'Corte de Fontaine'
    ]
  }
};

const erasPt = erasEn.map(era => {
  const ptData = erasPtMap[era.id] || {};
  return {
    ...era,
    ...ptData
  };
});

fs.writeFileSync(ERAS_PT_FILE, JSON.stringify(erasPt, null, 2), 'utf8');
console.log(`✅ Saved ${erasPt.length} translated eras to ${ERAS_PT_FILE}`);
