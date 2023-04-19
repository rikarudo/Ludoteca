/**
 * @file Biblioteca de classes que representam os tipos mais comuns de <em>gráficos</em> a desenhar num <code>canvas</code> e também o próprio <code>canvas</code>, bem como os elementos <code>audio</code> e <code>video</code>. O propósito desta biblioteca é facilitar o desenvolvimento de jogos e outras aplicações multimédia num contexto académico, gerando-se algum nível de abstracção relativamente a alguns pormenores do código. Abordam-se apenas os tipos mais frequentes de gráficos e de elementos acessórios, evitando, quando possível, complexidade desnecessária.
 * @version 0.9.3
 * @author Ricardo Rodrigues
 * @date 2023-04-17
 * @copyright Ricardo Rodrigues (2021, 2022, 2023)
 */

//

/**
 * @class
 * @classdesc A classe <code>Grafico</code> é, para todos os efeitos, uma classe <em>abstracta</em>, um esqueleto, servindo apenas de base para as subclasses de <code>Grafico</code>.
 * @property {number} x Abscissa para posicionar o <em>gráfico</em> no <code>canvas</code>
 * @property {number} y Ordenada para posicionar o <em>gráfico</em> no <code>canvas</code>
 * @property {number} deltaX=0 Variação horizontal da posição do <em>gráfico</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>gráfico</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>x</em> em relação à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>y</em> em relação à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>gráfico</em> quando desenhado no <code>canvas</code> &mdash; a rotação é feita tendo como referência o centro do <em>gráfico</em>
 * @property {number} gravidade=0 Força que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>gráfico</em>, actuando como a <em>gravidade</em>
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>gráfico</em>
 * @property {boolean} activo=true Indicação de que o <em>gráfico</em> deve testar colisões, quando chamado o método <code>colide(outro)</code>
 * @property {boolean} rotacao=false Indicação de que o <em>gráfico</em> deve rodar, reflectindo o seu <em>ângulo</em>
 * @property {boolean} visivel=true Indicação de que o <em>gráfico</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
 */
class Grafico {
  /**
   * Construtor da classe <code>Grafico</code>. <em>Este construtor não deve ser usado directamente. Se tal acontecer, é gerada uma excepção (<code>TypeError</code>).</em>
   * @param {number} x Abscissa para posicionar o <em>gráfico</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>gráfico</em> no <code>canvas</code>
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.deltaX = 0;
    this.deltaY = 0;
    this.distX = 0;
    this.distY = 0;
    this.angulo = 0;
    this.gravidade = 0;
    this.velocidade = 0;
    this.activo = true;
    this.rotacao = false;
    this.visivel = true;
    if (this.constructor.name == "Grafico") {
      throw new TypeError("A classe abstracta 'Grafico' não pode ser instanciada directamente, devendo ser implementada através de subclasses (que poderão então ser instanciadas).");
    }
  }

  /**
   * Este método verifica se existe uma colisão entre <em>este gráfico</em> e <em>outro</em>. Tal acontece quando um dos pontos de um <em>gráfico</em> se encontra contido na área de <em>outro</em>. Para o efeito, são usados os pontos que definem o <em>envelope</em> de cada <em>gráfico</em>. Este método também permite, caso se verifique a colisão, reposicionar <em>este gráfico</em>, deixando-o encostado (ou próximo disso, consoante o <em>afastamento</em>) ao <em>outro</em>, evitando a sobreposição de ambos. O <em>reposicionamento</em> depende da posição imediatamente anterior <em>deste gráfico</em> em relação ao <em>outro</em>. <em>[Neste momento, o reposicionamento ainda só funciona devidamente com movimentos definidos pelo <code>deltaX</code>, pelo <code>deltaY</code> e pela <code>gravidade</code>. Note-se também que as colisões são testadas em toda a área do gráfico, e não apenas em áreas específicas, como acontece no caso das caixas de colisão (<em>hitboxes</em>), que ainda não se encontra implementadas.]</em>
   * @param {Grafico} outro Outro <em>gráfico</em> para verificar se existe alguma colisão entre <em>esse</em> e <em>este</em>
   * @param {boolean} reposicionamento=true Indicação de que este <em>gráfico</em> deve ser reposicionado (ou não) quando colide com o outro
   * @param {number} afastamento=0 Afastamento a aplicar entre os dois <em>gráficos</em> no reposicionamento; idealmente, este deve ser compreendido entre zero (<code>0</code>) e um valor inferior aos valores de quaisquer deslocamentos horizontais e verticais
   * @returns {boolean} Se houver colisão, <code>true</code>, ou, no caso de se aplicar resposicionamento, <code>1</code>, <code>2</code>, <code>3</code> ou <code>4</code>, correspondentes às posições <em>cima</em>, <em>baixo</em>, <em>esquerda</em> e <em>direita</em>, respectivamente, e <code>0</code>, se não tiver sido aplicado; senão, <code>false</code>
   */
  colide(outro, reposicionamento = false, afastamento = 0) {
    if (!reposicionamento) {
      return (this.activo && outro.activo && (this.contemPontos(outro.envelope) || outro.contemPontos(this.envelope)));
    }
    else {
      if (this.activo && outro.activo && (this.contemPontos(outro.envelope) || outro.contemPontos(this.envelope))) {
        var posicao = Utilitarios.FALSO;
        // posicão anterior: em cima
        if (this.y + this.alturaEnvelope - Math.abs(this.deltaY + this.gravidade) <= outro.y) {
          this.y = outro.y - this.alturaEnvelope - afastamento;
          posicao = Utilitarios.CIMA;
        }
        // posicão anterior: em baixo
        else if (this.y - outro.alturaEnvelope + Math.abs(this.deltaY + this.gravidade) >= outro.y) {
          this.y = outro.y + outro.alturaEnvelope + afastamento;
          posicao = Utilitarios.BAIXO;
        }
        // posicão anterior: à esquerda
        else if (this.x + this.larguraEnvelope - Math.abs(this.deltaX) <= outro.x) {
          this.x = outro.x - this.larguraEnvelope - afastamento;
          posicao = Utilitarios.ESQUERDA;
        }
        // posicão anterior: à direita
        else if (this.x - outro.larguraEnvelope + Math.abs(this.deltaX) >= outro.x) {
          this.x = outro.x + outro.larguraEnvelope + afastamento;
          posicao = Utilitarios.DIREITA;
        }
        else {
          posicao = Utilitarios.FALSO;
        }
        return posicao;
      }
      else {
        return false;
      }
    }
  }

  /**
   * Este método mais não faz que chamar o método <code>contemPonto(x, y)</code> para cada um dos pontos de um <em>array</em>, verificando se algum deles se encontra dentro da área do <em>gráfico</em>.
   * @param {array} pontos Conjunto de pontos a verificar se estão contidos no <em>gráfico</em>
   * @returns {boolean} Se algum um dos pontos constantes no <em>array</em> estiver contido neste <em>grafico</em>, <code>true</code>; senão, <code>false</code>
   */
  contemPontos(pontos) {
    for (var i = 0; i < pontos.length; i++) {
      if (this.contemPonto(pontos[i].x, pontos[i].y)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Este método verifica se um dado <em>ponto</em> está contido na área do <em>envelope</em> <em>gráfico</em>, assumindo-se que o <em>gráfico</em> é um <em>polígono</em>. Assim, tal acontece quando um segmento de recta com início no ponto especificado intersecta um número ímpar de arestas do <em>polígono</em>.
   * @param {number} x Abscissa do ponto a testar se está contido neste <em>gráfico</em>
   * @param {number} y Ordenada do ponto a testar se está contido neste <em>gráfico</em>
   * @returns {boolean} Se o ponto estiver contido neste <em>gráfico</em>, <code>true</code>; senão, <code>false</code>
   */
  contemPonto(x, y) {
    var contido = 0;
    for (var i = 0, j = this.envelope.length - 1; i < this.envelope.length; j = i++) {
      var pontoI = { x: this.envelope[i].x, y: this.envelope[i].y };
      var pontoJ = { x: this.envelope[j].x, y: this.envelope[j].y };
      if (((pontoI.y > y) != (pontoJ.y > y)) && (x < (pontoJ.x - pontoI.x) * (y - pontoI.y) / (pontoJ.y - pontoI.y) + pontoI.x)) {
        contido++;
      }
    }
    if (contido % 2 == 0) {
      return false;
    }
    return true;
  }

  /**
   * Largura do menor <em>rectângulo imaginário</em> que envolva o <em>gráfico</em>
   * @type {number}
   */
  get largura() {
    throw new Error("O método <em>getter</em> 'largura()' tem de ser implementado nas subclasses da classe 'Grafico'.");
  }

  /**
   * Altura do menor <em>rectângulo imaginário</em> que envolva o <em>gráfico</em>
   * @type {number}
   */
  get altura() {
    throw new Error("O método <em>getter</em> 'altura()' tem de ser implementado nas subclasses da classe 'Grafico'.");
  }

  /**
   * Centróide do <em>gráfico</em> considerando os pontos dos seus vértices
   * @type {PontoCartesiano}
   */
  get centroide() {
    var centroideX = this.largura * 0.5;
    var centroideY = this.altura * 0.5;
    return { x: centroideX, y: centroideY };
  }

  /**
   * Conjunto de pontos que delimitam o <em>gráfico</em>, definindo um <em>envelope</em>
   * @type {array}
   */
  get envelope() {
    var verticesCartesianos = [{ x: 0, y: 0 }, { x: this.largura, y: 0 }, { x: this.largura, y: this.altura }, { x: 0, y: this.altura }];
    // para evitar processamento desnecessário, só se faz a criação do envelope com base na conversão das coordenadas cartesianas dos vertices em coordenadas polares e destas novamente em coordenadas cartesianas quando o ângulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer conversão
    if (this.rotacao && this.angulo != 0) {
      var verticesPolares = new Array(verticesCartesianos.length);
      for (var i = 0; i < verticesPolares.length; i++) {
        verticesPolares[i] = Utilitarios.calculaCoordenadasPolares(verticesCartesianos[i].x - this.centroide.x, verticesCartesianos[i].y - this.centroide.y);
      }
      var envelope = new Array(verticesPolares.length);
      for (var i = 0; i < envelope.length; i++) {
        envelope[i] = { x: Utilitarios.calculaCoordenadasCartesianas(verticesPolares[i].distancia, verticesPolares[i].angulo + this.angulo).x + this.centroide.x + this.x, y: Utilitarios.calculaCoordenadasCartesianas(verticesPolares[i].distancia, verticesPolares[i].angulo + this.angulo).y + this.centroide.y + this.y };
      }
    }
    else {
      var envelope = new Array(verticesCartesianos.length);
      for (var i = 0; i < envelope.length; i++) {
        envelope[i] = { x: verticesCartesianos[i].x + this.x, y: verticesCartesianos[i].y + this.y };
      }
    }
    return envelope;
  }

  /**
   * Largura do menor <em>rectângulo imaginário</em> que envolva o <em>envelope</em> deste <em>gráfico</em> &mdash; sendo definida pela distância entre o <em>x</em>  do ponto mais à esquerda e o <em>x</em> do ponto mais à direita do <em>envelope</em>
   * @type {number}
   */
  get larguraEnvelope() {
    var minX = Number.MAX_VALUE;
    var maxX = Number.MIN_VALUE;
    for (var i = 0, j = this.envelope.length - 1; i < this.envelope.length; j = i++) {
      minX = Math.min(minX, this.envelope[i].x);
      maxX = Math.max(maxX, this.envelope[j].x);
    }
    return maxX - minX;
  }

  /**
   * Altura do menor <em>rectângulo imaginário</em> que envolva o <em>envelope</em> deste <em>gráfico</em> &mdash; sendo definida pela distância entre o <em>y</em> do ponto mais acima e o <em>y</em> do ponto mais abaixo do <em>envelope</em>
   * @type {number}
   */
  get alturaEnvelope() {
    var minY = Number.MAX_VALUE;
    var maxY = Number.MIN_VALUE;
    for (var i = 0, j = this.envelope.length - 1; i < this.envelope.length; j = i++) {
      minY = Math.min(minY, this.envelope[i].y);
      maxY = Math.max(maxY, this.envelope[j].y);
    }
    return maxY - minY;
  }

  /**
   * <em>Este método deve ser implementado nas subclasses de <code>Grafico</code>, respeitando as especificidades de cada forma representada nelas. Se tal não acontecer, é gerada uma excepção (<code>Error</code>).</em>
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhado o <em>gráfico</em>
   */
  desenha(tela) {
    throw new Error("O método 'desenha(tela)' tem de ser implementado nas subclasses da classe 'Grafico'.");
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Circulo</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>círculos</em>. Num nível básico, um <em>círculo</em> é definido por um <em>ponto</em> central e por um <em>raio</em>. Contudo, para que exista uniformidade no posicionamento das formas representadas pelas várias subclasses de <code>Grafico</code>, os círculos são também posicionados usando o canto superior esquerdo (de um <em>quadrado imaginário</em> que o contenha), em vez do seu centro &mdash; assim, o <em>raio</em> é somado ao <em>x</em> e ao <em>y</em> para fazer as devidas compensações de posicionamento, determinando o <em>centro</em>.
 * @property {number} x Abscissa para posicionar o <em>círculo</em> no <code>canvas</code>
 * @property {number} y Ordenada para posicionar o <em>círculo</em> no <code>canvas</code>
 * @property {number} raio Raio do <em>círculo</em>
 * @property {string} preenchimento Cor ou padrão do preenchimento <em>círculo</em> &mdash; se for <code>null</code>, o <em>círculo</em> não é preenchido
 * @property {string} contorno Cor ou padrão do contorno do <em>círculo</em> &mdash; se for <code>null</code>, o contorno não é desenhado
 * @property {number} espessura Espessura do contorno do <em>círculo</em> &mdash; se a espessura tiver um valor igual ou inferior a zero (<code>0</code>), o contorno não é desenhado
 * @property {number} deltaX=0 Variação horizontal da posição do <em>círculo</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>círculo</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>x</em> em relação à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>y</em> em relação à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>círculo</em> quando desenhado no <code>canvas</code> &mdash; dadas as características do <em>círculo</em>, esta propriedade é ignorada no seu desenho no <code>canvas</code>
 * @property {number} gravidade=0 Força que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>cículo</em>, actuando como a <em>gravidade</em>
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>círculo</em>
 * @property {boolean} activo=true Indicação de que o <em>círculo</em> deve testar colisões, quando chamado o método <code>colide(outro)</code>
 * @property {boolean} rotacao=false Indicação de que o <em>círculo</em> deve rodar, reflectindo o seu <em>ângulo</em> &mdash; dadas as características do <em>círculo</em>, esta propriedade é ignorada no seu desenho no <code>canvas</code>
 * @property {boolean} visivel=true Indicação de que o <em>círculo</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
 */
class Circulo extends Grafico {
  /**
   * Construtor para criação de novos objectos do tipo <code>Círculo</code>
   * @param {number} x Abscissa para posicionar o <em>círculo</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>círculo</em> no <code>canvas</code>
   * @param {number} raio Raio do <em>círculo</em>
   * @param {string} preenchimento="black" Cor ou padrão do preenchimento do <em>círculo</em>
   * @param {string} contorno="black" Cor ou padrão do contorno do <em>círculo</em>
   * @param {number} espessura=0 Espessura do contorno do <em>círculo</em>
   */
  constructor(x, y, raio, preenchimento = "black", contorno = "black", espessura = 0) {
    super(x, y);
    this.raio = raio;
    this.preenchimento = preenchimento;
    this.contorno = contorno;
    this.espessura = espessura;
  }

  /**
   * Conjunto de pontos que delimitam o <em>círculo</em>, definindo um <em>envelope</em> &mdash; são usados, arbitrariamente, <em>36</em> pontos igualmente espaçados sobre a circunferência
   * @type {array}
   */
  get envelope() {
    var envelope = new Array(36);
    for (var i = 0; i < envelope.length; i++) {
      envelope[i] = { x: this.raio + this.raio * Math.cos(2 * Math.PI * i / envelope.length + Math.PI) + this.x, y: this.raio + this.raio * Math.sin(2 * Math.PI * i / envelope.length + Math.PI) + this.y };
    }
    return envelope;
  }

  /**
   * Largura do menor <em>quadrado imaginário</em> que envolva este <em>círculo</em> &mdash; na prática, corresponde ao diâmetro
   * @type {number}
   */
  get largura() {
    return this.raio * 2;
  }

  /**
   * Altura do menor <em>quadrado imaginário</em> que envolva este <em>círculo</em> &mdash; na prática, corresponde ao diâmetro
   * @type {number}
   */
  get altura() {
    return this.raio * 2;
  }

  /**
   * Este método verifica se um dado <em>ponto</em> está contido na área deste <em>círculo</em>. Tal acontece quando a distância desse <em>ponto</em> ao centro do <em>círculo</em> é inferior ao <em>raio</em> do <em>círculo</em>.
   * @param {number} x Abscissa do ponto a testar se está contido neste <em>círculo</em>
   * @param {number} y Ordenada do ponto a testar se está contido neste <em>círculo</em>
   * @returns {boolean} Se o ponto estiver contido neste <em>círculo</em>, <code>true</code>; senão, <code>false</code>
   */
  contemPonto(x, y) {
    return (Math.hypot((this.x + this.raio) - x, (this.y + this.raio) - y) < this.raio);
  }

  /**
   * Este método desenha um <em>círculo</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo do menor <em>quadrado imaginário</em> que envolva o <em>círculo</em>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhado o <em>círculo</em>
   */
  desenha(tela) {
    this.x += this.distX;
    this.y += this.distY;
    if (this.visivel) {
      var contexto = tela.contexto;
      contexto.save();
      contexto.beginPath();
      // para evitar processamento desnecessário, só se faz a translação e a rotação do canvas quando o ângulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer rotação
      if (this.rotacao && this.angulo != 0) {
        contexto.translate(Math.floor(this.x + this.centroide.x), Math.floor(this.y + this.centroide.y));
        contexto.rotate(this.angulo * Math.PI / 180);
        contexto.arc(Math.floor(-this.centroide.x + this.raio), Math.floor(-this.centroide.y + this.raio), this.raio, 0, Math.PI * 2);
      }
      else {
        contexto.arc(Math.floor(this.x + this.raio), Math.floor(this.y + this.raio), this.raio, 0, Math.PI * 2);
      }
      contexto.arc(Math.floor(this.x + this.raio), Math.floor(this.y + this.raio), this.raio, 0, Math.PI * 2);
      contexto.closePath();
      contexto.fillStyle = this.preenchimento;
      contexto.strokeStyle = this.contorno;
      contexto.lineWidth = this.espessura;
      if (this.preenchimento != null) {
        contexto.fill();
      }
      if ((this.contorno != null) && (this.espessura > 0)) {
        contexto.stroke();
      }
      contexto.restore();
    }
    this.x += this.deltaX + this.velocidade * Math.cos(this.angulo * Math.PI / 180);
    this.y += this.deltaY + this.velocidade * Math.sin(this.angulo * Math.PI / 180) + this.gravidade * Math.cos(this.angulo * Math.PI / 180);
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Rectangulo</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>rectângulos</em>. Num nível básico, um <em>rectângulo</em> é definido por um <em>ponto</em>, correspondente, regra geral, ao seu canto superior esquerdo e por uma <em>largura</em> e por uma <em>altura</em>.
 * @property {number} x Abscissa para posicionar o <em>rectângulo</em> no <code>canvas</code>
 * @property {number} y Ordenada para posicionar o <em>rectângulo</em> no <code>canvas</code>
 * @property {string} preenchimento Cor ou padrão do preenchimento <em>rectângulo</em> &mdash; se for <code>null</code>, o <em>rectângulo</em> não é preenchido
 * @property {string} contorno Cor ou padrão do contorno do <em>rectângulo</em> &mdash; se for <code>null</code>, o contorno não é desenhado
 * @property {number} espessura Espessura do contorno do <em>rectângulo</em> &mdash; se a espessura tiver um valor igual ou inferior a zero (<code>0</code>), o contorno não é desenhado
 * @property {number} deltaX=0 Variação horizontal da posição do <em>rectângulo</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>rectângulo</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>x</em> em relação à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>y</em> em relação à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>rectângulo</em> quando desenhado no <code>canvas</code> &mdash; a rotação é feita tendo como referência o centro do <em>rectângulo</em>
 * @property {number} gravidade=0 Força que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>rectângulo</em>, actuando como a <em>gravidade</em>
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>rectângulo</em>
 * @property {boolean} activo=true Indicação de que o <em>rectângulo</em> deve testar colisões, quando chamado o método <code>colide(outro)</code>
 * @property {boolean} rotacao=false Indicação de que o <em>rectângulo</em> deve rodar, reflectindo o seu <em>ângulo</em>
 * @property {boolean} visivel=true Indicação de que o <em>rectângulo</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
  */
class Rectangulo extends Grafico {
  #largura;
  #altura;

  /**
   * Construtor para criação de novos objectos do tipo <code>Rectangulo</code>
   * @param {number} x Abscissa para posicionar o <em>rectângulo</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>rectângulo</em> no <code>canvas</code>
   * @param {number} largura Largura do <em>rectângulo</em>
   * @param {number} altura Altura do <em>rectângulo</em>
   * @param {string} preenchimento="black" Cor ou padrão do preenchimento do <em>rectângulo</em>
   * @param {string} contorno="black" Cor ou padrão do contorno do <em>rectângulo</em>
   * @param {number} espessura=0 Espessura do contorno do <em>rectângulo</em>
   */
  constructor(x, y, largura, altura, preenchimento = "black", contorno = "black", espessura = 0) {
    super(x, y);
    this.#largura = largura;
    this.#altura = altura;
    this.preenchimento = preenchimento;
    this.contorno = contorno;
    this.espessura = espessura;
  }

  /**
   * Largura do <em>rectângulo</em> <em>[definição]</em>
   * @type {number}
   */
  set largura(largura) {
    this.#largura = largura;
  }

  /**
   * Largura do <em>rectângulo</em> <em>[obtenção]</em>
   * @type {number}
   */
  get largura() {
    return this.#largura;
  }

  /**
   * Altura do <em>rectângulo</em> <em>[definição]</em>
   * @type {number}
   */
  set altura(altura) {
    this.#altura = altura;
  }

  /**
   * Altura do <em>rectângulo</em> <em>[obtenção]</em>
   * @type {number}
   */
  get altura() {
    return this.#altura;
  }

  /**
   * Este método desenha um <em>rectângulo</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo desse <em>rectângulo</em>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhado o <em>rectângulo</em>
   */
  desenha(tela) {
    this.x += this.distX;
    this.y += this.distY;
    if (this.visivel) {
      var contexto = tela.contexto;
      contexto.save();
      contexto.beginPath();
      // para evitar processamento desnecessário, só se faz a translação e a rotação do canvas quando o ângulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer rotação
      if (this.rotacao && this.angulo != 0) {
        contexto.translate(Math.floor(this.x + this.centroide.x), Math.floor(this.y + this.centroide.y));
        contexto.rotate(this.angulo * Math.PI / 180);
        contexto.rect(Math.floor(-this.centroide.x), Math.floor(-this.centroide.y), this.largura, this.altura);
      }
      else {
        contexto.rect(Math.floor(this.x), Math.floor(this.y), this.largura, this.altura);
      }
      contexto.closePath();
      contexto.fillStyle = this.preenchimento;
      contexto.strokeStyle = this.contorno;
      contexto.lineWidth = this.espessura;
      if (this.preenchimento != null) {
        contexto.fill();
      }
      if ((this.contorno != null) && (this.espessura > 0)) {
        contexto.stroke();
      }
      contexto.restore();
    }
    this.x += this.deltaX + this.velocidade * Math.cos(this.angulo * Math.PI / 180);
    this.y += this.deltaY + this.velocidade * Math.sin(this.angulo * Math.PI / 180) + this.gravidade * Math.cos(this.angulo * Math.PI / 180);
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Poligono</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>polígonos</em>. Num nível básico, um <em>polígono</em> é definido por um <em>ponto</em>, correspondente, regra geral, ao canto superior esquerdo de um <em>rectângulo imaginário</em> que contenha o <em>polígono</em>. Assim, este será o <em>ponto</em> relativamente ao qual todos os pontos do <em>polígono</em> serão posicionados. Aconselha-se que todos os pontos do polígono se encontrem à direita e abaixo desta origem e tão próximos dela quanto possível; caso contrário, aspectos como a rotação do polígono poderão ter resultados diferentes do esperado. Deste modo, há a possibilidade, activada por omissão através do atributo <code>ajuste</code>, de <em>encostar</em> o polígono à origem &mdash; contudo, tal implica a alteração (o referido <em>ajuste</em>) de todos os pontos.
 * @property {number} x Abscissa para posicionar o <em>polígono</em> no <code>canvas</code>
 * @property {number} y Ordenada para posicionar o <em>polígono</em> no <code>canvas</code>
 * @property {array} vertices Conjunto de pontos com os vários vértices do <em>polígono</em>
 * @property {string} preenchimento Cor ou padrão do preenchimento <em>polígono</em> &mdash; se for <code>null</code>, o <em>polígono</em> não é preenchido
 * @property {string} contorno Cor ou padrão do contorno do <em>polígono</em> &mdash; se for <code>null</code>, o contorno não é desenhado
 * @property {number} espessura Espessura do contorno do <em>polígono</em> &mdash; se a espessura tiver um valor igual ou inferior a zero (<code>0</code>), o contorno não é desenhado
 * @property {number} deltaX=0 Variação horizontal da posição do <em>polígono</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>polígono</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>x</em> em relação à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>y</em> em relação à posição <em>y</em> do cursor do rato
 * @property {number} deslocX=0 Deslocamento horizontal do ponto mais à esquerda do polígono até ponto usado para posicionar o <em>polígono</em>, quando se fez o ajuste posicional do polígono &mdash; se o seu valor for zero (<code>0</code>), não foi feito qualquer ajuste
 * @property {number} deslocY=0 Deslocamento vertical do ponto mais à esquerda do polígono até ponto usado para posicionar o <em>polígono</em>, quando se fez o ajuste posicional do polígono &mdash; se o seu valor for zero (<code>0</code>), não foi feito qualquer ajuste
 * @property {number} angulo=0 Ângulo de rotação do <em>polígono</em> quando desenhado no <code>canvas</code> &mdash; a rotação é feita tendo como referência o centro do <em>polígono</em>
 * @property {number} gravidade=0 Força que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>polígono</em>, actuando como a <em>gravidade</em>
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>polígono</em>
 * @property {boolean} activo=true Indicação de que o <em>polígono</em> deve testar colisões, quando chamado o método <code>colide(outro)</code>
 * @property {boolean} rotacao=false Indicação de que o <em>polígono</em> deve rodar, reflectindo o seu <em>ângulo</em>
 * @property {boolean} visivel=true Indicação de que o <em>polígono</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
 */
class Poligono extends Grafico {
  #justo;
  #vertices;

  /**
   * Construtor para criação de novos objectos do tipo <code>Poligono</code>
   * @param {number} x Abscissa para posicionar o <em>polígono</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>polígono</em> no <code>canvas</code>
   * @param {array} vertices Conjunto de pontos com os vários vértices do <em>polígono</em>
   * @param {string} preenchimento="black" Cor ou padrão do preenchimento do <em>polígono</em>
   * @param {string} contorno="black" Cor ou padrão do contorno do <em>polígono</em>
   * @param {number} espessura=0 Espessura do contorno do <em>polígono</em>
   * @param {boolean} justo=true Indicação de que o <em>polígono</em> deve ser reposicionado de forma a ficar <em>encostado</em> ao ponto usado para definir o seu posicionamento no <code>canvas</code>
   */
  constructor(x, y, vertices, preenchimento = "black", contorno = "black", espessura = 0, justo = true) {
    super(x, y);
    this.#vertices = vertices;
    this.preenchimento = preenchimento;
    this.contorno = contorno;
    this.espessura = espessura;
    this.#justo = justo;
    //se ajuste for verdadeiro (true), todo os pontos são alterados de forma a que o polígono seja "encostado" à origem -- o ponto (x, y) do polígono
    if (this.#justo) {
      this.#ajusta();
    }
  }

  /**
   * Conjunto de pontos que delimitam o <em>polígono</em>, definindo um <em>envelope</em>
   * @type {array}
   */
  get envelope() {
    var verticesCartesianos = this.#vertices;
    var verticesPolares = new Array(verticesCartesianos.length);
    for (var i = 0; i < verticesPolares.length; i++) {
      verticesPolares[i] = Utilitarios.calculaCoordenadasPolares(this.#vertices[i].x - this.centroide.x, this.#vertices[i].y - this.centroide.y);
    }
    var envelope = new Array(verticesPolares.length);
    for (var i = 0; i < envelope.length; i++) {
      envelope[i] = { x: Utilitarios.calculaCoordenadasCartesianas(verticesPolares[i].distancia, verticesPolares[i].angulo + this.angulo).x + this.centroide.x + this.x, y: Utilitarios.calculaCoordenadasCartesianas(verticesPolares[i].distancia, verticesPolares[i].angulo + this.angulo).y + this.centroide.y + this.y };

    }
    return envelope;
  }

  // este método privado ajusta o polígono de forma a ficar encostado ao ponto usado para definir o seu posicionamento no canvas
  #ajusta() {
    var deslocX = Number.MAX_VALUE;
    var deslocY = Number.MAX_VALUE;
    for (var i = 0, j = this.#vertices.length - 1; i < this.#vertices.length; j = i++) {
      deslocX = Math.min(deslocX, this.#vertices[i].x);
    }
    for (var i = 0, j = this.#vertices.length - 1; i < this.#vertices.length; j = i++) {
      deslocY = Math.min(deslocY, this.#vertices[i].y);
    }
    for (var i = 0; i < this.#vertices.length; i++) {
      this.#vertices[i].x -= deslocX;
      this.#vertices[i].y -= deslocY;
    }
  }

  /**
   * Conjunto de pontos com os vários vértices do <em>polígono</em> <em>[definição]</em>
   * @type {array}
   */
  set vertices(vertices) {
    this.#vertices = vertices;
    if (this.#justo) {
      this.#ajusta();
    }
    for (var i = 0; i < this.#vertices.length; i++) {
      this.envelope.push({ x: this.#vertices[i].x, y: this.#vertices[i].y });
    }
  }

  /**
   * Conjunto de pontos com os vários vértices do <em>polígono</em> <em>[obtenção]</em>
   * @type {array}
   */
  get vertices() {
    return this.#vertices;
  }

  /**
   * Largura do menor <em>rectângulo imaginário</em> que envolva este <em>polígono</em> &mdash; sendo definida pela distância entre o <em>x</em> do ponto mais à esquerda e o <em>x</em> do ponto mais à direita do <em>polígono</em>
   * @type {number}
   */
  get largura() {
    var minX = Number.MAX_VALUE;
    var maxX = Number.MIN_VALUE;
    for (var i = 0, j = this.#vertices.length - 1; i < this.#vertices.length; j = i++) {
      minX = Math.min(minX, this.#vertices[i].x);
      maxX = Math.max(maxX, this.#vertices[j].x);
    }
    return maxX - minX;
  }

  /**
   * Altura do menor <em>rectângulo imaginário</em> que envolva este <em>polígono</em> &mdash; sendo definida pela distância entre o <em>y</em> do ponto mais acima e o <em>y</em> do ponto mais abaixo do <em>polígono</em>
   * @type {number}
   */
  get altura() {
    var minY = Number.MAX_VALUE;
    var maxY = Number.MIN_VALUE;
    for (var i = 0, j = this.#vertices.length - 1; i < this.#vertices.length; j = i++) {
      minY = Math.min(minY, this.#vertices[i].y);
      maxY = Math.max(maxY, this.#vertices[j].y);
    }
    return maxY - minY;
  }

  /**
   * Centróide do <em>polígono</em> considerando os pontos dos seus vértices
   * @type {PontoCartesiano}
   */
  get centroide() {
    var somaX = 0;
    var somaY = 0;
    for (var i = 0; i < this.#vertices.length; i++) {
      somaX += this.#vertices[i].x;
      somaY += this.#vertices[i].y;
    }
    var centroideX = Math.floor(somaX / this.#vertices.length);
    var centroideY = Math.floor(somaY / this.#vertices.length);
    return { x: centroideX, y: centroideY };
  }

  /**
   * Este método desenha um <em>polígono</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo de um <em>rectângulo imaginário</em> que contenha o <em>polígono</em>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhado o <em>polígono</em>
   */
  desenha(tela) {
    this.x += this.distX;
    this.y += this.distY;
    if (this.visivel) {
      var contexto = tela.contexto;
      contexto.save();
      contexto.beginPath()
      // para evitar processamento desnecessário, só se faz a translação e a rotação quando o ângulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer rotação
      if (this.rotacao && this.angulo != 0) {
        contexto.translate(Math.floor(this.x + this.centroide.x), Math.floor(this.y + this.centroide.y));
        contexto.rotate(this.angulo * Math.PI / 180);
        for (var i = 0; i < this.#vertices.length; i++) {
          if (i == 0) {
            contexto.moveTo(Math.floor(this.#vertices[i].x - this.centroide.x), Math.floor(this.#vertices[i].y - this.centroide.y));
          }
          else {
            contexto.lineTo(Math.floor(this.#vertices[i].x - this.centroide.x), Math.floor(this.#vertices[i].y - this.centroide.y));
          }
        }
      }
      else {
        for (var i = 0; i < this.#vertices.length; i++) {
          if (i == 0) {
            contexto.moveTo(Math.floor(this.#vertices[i].x + this.x), Math.floor(this.#vertices[i].y + this.y));
          }
          else {
            contexto.lineTo(Math.floor(this.#vertices[i].x + this.x), Math.floor(this.#vertices[i].y + this.y));
          }
        }
      }
      contexto.closePath();
      contexto.fillStyle = this.preenchimento;
      contexto.strokeStyle = this.contorno;
      contexto.lineWidth = this.espessura;
      if (this.preenchimento != null) {
        contexto.fill();
      }
      if ((this.contorno != null) && (this.espessura > 0)) {
        contexto.stroke();
      }
      contexto.restore();
    }
    this.x += this.deltaX + this.velocidade * Math.cos(this.angulo * Math.PI / 180);
    this.y += this.deltaY + this.velocidade * Math.sin(this.angulo * Math.PI / 180) + this.gravidade * Math.cos(this.angulo * Math.PI / 180);
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Texto</code> é uma subclasse de <code>Grafico</code>, servindo para representar uma <em>(linha de) texto</em>.
 * @property {number} x Abscissa para posicionar o <em>texto</em> no <code>canvas</code>
 * @property {number} y Ordenada para posicionar o <em>texto</em> no <code>canvas</code>
 * @property {string} preenchimento Cor ou padrão do preenchimento do <em>texto</em> &mdash; se for <code>null</code>, o <em>texto</em> não é preenchido
 * @property {string} contorno Cor ou padrão do contorno do <em>texto</em> &mdash; se for <code>null</code>, o contorno não é desenhado
 * @property {number} espessura Espessura do contorno do <em>texto</em> &mdash; se a espessura tiver um valor igual ou inferior a zero (<code>0</code>), o contorno não é desenhado
 * @property {number} tamanho=16 Tamanho do <em>texto</em> em pontos (<code>pt</code)
 * @property {number} fonte="sans-serif" Fonte do <em>texto</em>
 * @property {number} deltaX=0 Variação horizontal da posição do <em>texto</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>texto</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>x</em> em relação à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>y</em> em relação à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>texto</em> quando desenhado no <code>canvas</code> &mdash; a rotação é feita tendo como referência o centro do <em>texto</em>
 * @property {number} gravidade=0 Força que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>texto</em>, actuando como a <em>gravidade</em>
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>texto</em>
 * @property {boolean} activo=true Indicação de que o <em>texto</em> deve testar colisões, quando chamado o método <code>colide(outro)</code>
 * @property {boolean} rotacao=false Indicação de que o <em>texto</em> deve rodar, reflectindo o seu <em>ângulo</em>
 * @property {boolean} visivel=true Indicação de que o <em>texto</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
 */
class Texto extends Grafico {
  /**
   * Construtor para criação de novos objectos do tipo <code>Texto</code>
   * @param {number} x Abscissa para posicionar o <em>texto</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>texto</em> no <code>canvas</code>
   * @param {string} texto Conteúdo de <em>texto</em> a desenhar no <code>canvas</code>
   * @param {string} preenchimento="black" Cor do preenchimento do <em>texto</em>
   * @param {string} contorno="black" Cor ou padrão do contorno do <em>texto</em>
   * @param {number} espessura=0 Espessura do contorno do <em>texto</em>
   */
  constructor(x, y, texto, preenchimento = "black", contorno = "black", espessura = 0) {
    super(x, y);
    this.texto = texto;
    this.preenchimento = preenchimento;
    this.contorno = contorno;
    this.espessura = espessura;
    this.tamanho = 16;
    this.fonte = "sans-serif";
  }

  /**
   * Largura do <em>texto</em> &mdash; sendo definida pelos píxeis ocupados pelo texto horizontalmente
   * @type {number}
   */
  get largura() {
    var tela = document.createElement("canvas");
    var contexto = tela.getContext("2d");
    contexto.font = this.tamanho + "px " + this.fonte;
    return Math.floor(contexto.measureText(this.texto).width);
  }

  /**
   * Altura do <em>texto</em> &mdash; sendo definida pelo tamanho da fonte
   * @type {number}
   */
  get altura() {
    return this.tamanho;
  }

  /**
   * Este método desenha uma linha de <em>texto</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo de um <em>rectângulo imaginário</em> que contenha o <em>texto</em>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhado o <em>texto</em>
   */
  desenha(tela) {
    this.x += this.distX;
    this.y += this.distY;
    if (this.visivel) {
      var contexto = tela.contexto;
      contexto.save();
      contexto.fillStyle = this.preenchimento;
      contexto.strokeStyle = this.contorno;
      contexto.lineWidth = this.espessura;
      contexto.textBaseline = "top";
      contexto.font = this.tamanho + "px " + this.fonte;
      contexto.fillStyle = this.preenchimento;
      // para evitar processamento desnecessário, só se faz a translação e a rotação quando o ângulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer rotação
      if (this.rotacao && this.angulo != 0) {
        contexto.translate(Math.floor(this.x + this.largura * 0.5), Math.floor(this.y + this.altura * 0.5));
        contexto.rotate(this.angulo * Math.PI / 180);
        if (this.preenchimento != null) {
          contexto.fillText(this.texto, Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5));
        }
        if ((this.contorno != null) && (this.espessura > 0)) {
          contexto.strokeText(this.texto, Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5));
        }
      }
      else {
        if (this.preenchimento != null) {
          contexto.fillText(this.texto, Math.floor(this.x), Math.floor(this.y));
        }
        if ((this.contorno != null) && (this.espessura > 0)) {
          contexto.strokeText(this.texto, Math.floor(this.x), Math.floor(this.y));
        }
      }
      contexto.restore();
    }
    this.x += this.deltaX + this.velocidade * Math.cos(this.angulo * Math.PI / 180);
    this.y += this.deltaY + this.velocidade * Math.sin(this.angulo * Math.PI / 180) + this.gravidade * Math.cos(this.angulo * Math.PI / 180);
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Imagem</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>imagens</em>. Num nível básico, uma <em>imagem</em> é definida por um <em>ponto</em>, correspondente, regra geral, ao seu canto superior esquerdo e pela própria imagem.
 * @property {number} x Abscissa para posicionar a <em>imagem</em> no <code>canvas</code>
 * @property {number} y Ordenada para posicionar a <em>imagem</em> no <code>canvas</code>
 * @property {HTMLElement} imagem Elemento HTML que contém a <em>imagem</em>
 * @property {number} largura Largura da <em>imagem</em>
 * @property {number} altura Altura da <em>imagem</em>
 * @property {number} deltaX=0 Variação horizontal da posição da <em>imagem</em>
 * @property {number} deltaY=0 Variação vertical da posição da <em>imagem</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>x</em> em relação à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>y</em> em relação à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação da <em>imagem</em> quando desenhado no <code>canvas</code> &mdash; a rotação é feita tendo como referência o centro da <em>imagem</em>
 * @property {number} gravidade=0 Força que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação vertical da <em>imagem</em>, actuando como a <em>gravidade</em>
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação horizontal e vertical da <em>imagem</em>
tendo como referência o centro da <em>imagem</em>
 * @property {boolean} activo=true Indicação de que a <em>imagem</em> deve testar colisões, quando chamado o método <code>colide(outro)</code>
 * @property {boolean} rotacao=false Indicação de que a <em>imagem</em> deve rodar, reflectindo o seu <em>ângulo</em>
 * @property {boolean} visivel=true Indicação de que a <em>imagem</em> deve ser desenhada no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
  */
class Imagem extends Grafico {
  /**
   * Construtor para criação de novos objectos do tipo <code>Imagem</code>
   * @param {number} x Abscissa para posicionar a <em>imagem</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar a <em>imagem</em> no <code>canvas</code>
   * @param {HTMLElement} imagem Elemento HTML que contém a <em>imagem</em>
   */
  constructor(x, y, imagem) {
    super(x, y);
    this.imagem = imagem;
  }

  /**
   * Largura da <em>imagem</em>
   * @type {number}
   */
  get largura() {
    return this.imagem.width;
  }

  /**
   * Altura da <em>imagem</em>
   * @type {number}
   */
  get altura() {
    return this.imagem.height;
  }

  /**
   * Este método desenha uma <em>imagem</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo dessa <em>imagem</em>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhada a <em>imagem</em>
   */
  desenha(tela) {
    this.x += this.distX;
    this.y += this.distY;
    if (this.visivel) {
      var contexto = tela.contexto;
      // para evitar processamento desnecessário, só se faz a translação e a rotação quando o ângulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer rotação
      if (this.rotacao && this.angulo != 0) {
        contexto.save();
        contexto.translate(Math.floor(this.x + this.largura * 0.5), Math.floor(this.y + this.altura * 0.5));
        contexto.rotate(this.angulo * Math.PI / 180);
        contexto.drawImage(this.imagem, Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5));
        contexto.restore();
      }
      else {
        contexto.drawImage(this.imagem, Math.floor(this.x), Math.floor(this.y));
      }
    }
    this.x += this.deltaX + this.velocidade * Math.cos(this.angulo * Math.PI / 180);
    this.y += this.deltaY + this.velocidade * Math.sin(this.angulo * Math.PI / 180) + this.gravidade * Math.cos(this.angulo * Math.PI / 180);
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>ImagemAnimada</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>imagens animadas</em> (ou <em>sprites</em>). Num nível básico, uma <em>imagem animada</em> é definida por um <em>ponto</em>, correspondente, regra geral, ao seu canto superior esquerdo, com os vários fotogramas a serem desenhados nessa posição, assumindo-se dimensões idênticas para cada um deles. Assim, os <em>sprites</em> utilizados podem ter uma sequência horizontal (tira) ou várias, desde que os fotogramas tenham as mesmas dimensões.
 * @property {number} x Abscissa para posicionar o <em>sprite</em> no <code>canvas</code>
 * @property {number} y Ordenada para posicionar o <em>sprite</em> no <code>canvas</code>
 * @property {HTMLElement} imagem Elemento HTML que contém o <em>sprite</em>
 * @property {number} fotogramas Número de fotogramas (<em>frames</em>) do <em>sprite</em>
 * @property {number} iteracoes Número de iterações &mdash; na prática, o número de <em>frames</em> a serem gerados por via do método <code>window.requestAnimationFrame()</code> &mdash; antes de se passar ao fotograma seguinte do <em>sprite</em>
 * @property {number} contador=0 Número que vai registando o número de vezes que o <em>sprite</em> foi desenhado, sendo necessário para controlar a transição entre fotogramas de fotogramas
 * @property {number} animado=true Indicação de que o <em>sprite</em> deve ser desenhado <em>animado</em> no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>; caso contrário, ficará parado num dos fotogramas
 * @property {number} indiceFotograma=0 Índice do fotograma a ser mostrado num dado momento; varia, de acordo como o número de <em>iterações</em> definido, entre zero (<code>0</code>) e o número de fotogramas existentes (<em>exclusive</em>)
 * @property {number} indiceTira=0 Índice da tira de fotogramas a ser mostrada num dado momento; varia entre zero (<code>0</code>) e o número de tiras existentes (<em>exclusive</em>)
 * @property {number} tiras=1 Número de tiras existentes no <em>sprite</em>
 * @property {number} largura Largura de um <em>fotograma</em> do <em>sprite</em>
 * @property {number} altura Altura de um <em>fotograma</em> do <em>sprite</em>
 * @property {number} deltaX=0 Variação horizontal da posição do <em>sprite</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>sprite</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>x</em> em relação à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>y</em> em relação à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>sprite</em> quando desenhado no <code>canvas</code> &mdash; a rotação é feita tendo como referência o centro do <em>sprite</em>
 * @property {number} gravidade=0 Força que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>sprite</em>, actuando como a <em>gravidade</em>
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>sprite</em>
 * @property {boolean} activo=true Indicação de que o <em>sprite</em> deve testar colisões, quando chamado o método <code>colide(outro)</code>
 * @property {boolean} rotacao=false Indicação de que o <em>sprite</em> deve rodar, reflectindo o seu <em>ângulo</em>
 * @property {boolean} visivel=true Indicação de que o <em>sprite</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
*/
class ImagemAnimada extends Grafico {
  /**
   * Construtor para criação de novos objectos do tipo <code>ImagemAnimada</code>
   * @param {number} x Abscissa para posicionar o <em>sprite</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>sprite</em> no <code>canvas</code>
   * @param {HTMLElement} imagem Elemento HTML que contém o <em>sprite</em>
   * @param {number} fotogramas Número de fotogramas (<em>frames</em>) do <em>sprite</em>
   * @param {number} iteracoes Número de iterações &mdash; na prática, o número de <em>frames</em> a serem gerados por via do método <code>window.requestAnimationFrame()</code> &mdash; antes de se passar ao fotograma seguinte do <em>sprite</em>
   * @param {number} tiras=1 Número de tiras existentes no <em>sprite</em>
   */
  constructor(x, y, imagem, fotogramas, iteracoes, tiras = 1) {
    super(x, y);
    this.imagem = imagem;
    this.fotogramas = fotogramas;
    this.iteracoes = iteracoes;
    this.contador = 0;
    this.animado = true;
    this.indiceFotograma = 0;
    this.indiceTira = 0;
    this.tiras = tiras;
  }

  /**
   * Altura da <em>imagem animada</em>, considerando o número de tiras presentes e assumindo dimensões idênticas dos mesmos
   * @type {number}
   */
  get largura() {
    return this.imagem.width / this.fotogramas;
  }

  /**
   * Largura da <em>imagem animada</em>, considerando o número de fotogramas presentes e assumindo dimensões idênticas dos mesmos
   * @type {number}
   */
  get altura() {
    return this.imagem.height / this.tiras;
  }

  /**
   * Este método desenha uma <em>imagem animada</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo dessa <em>imagem animada</em>, no caso de uma única tira. Havendo mais que uma tira, usará o <em>ponto</em> correspondente ao canto superior esquerdo dessa tira.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhada a <em>imagem animada</em>
   */
  desenha(tela) {
    this.x += this.distX;
    this.y += this.distY;
    if (this.visivel) {
      var contexto = tela.contexto;
      // para evitar processamento desnecessário, só se faz a translação e a rotação quando o ângulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer rotação
      if (this.rotacao && this.angulo != 0) {
        contexto.save();
        contexto.translate(Math.floor(this.x + this.largura * 0.5), Math.floor(this.y + this.altura * 0.5));
        contexto.rotate(this.angulo * Math.PI / 180);
        contexto.drawImage(this.imagem, this.indiceFotograma * this.largura, this.indiceTira * this.altura, this.largura, this.altura, Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5), this.largura, this.altura);
        contexto.restore();
      }
      else {
        contexto.drawImage(this.imagem, this.indiceFotograma * this.largura, this.indiceTira * this.altura, this.largura, this.altura, Math.floor(this.x), Math.floor(this.y), this.largura, this.altura);
      }
      if ((this.animado) || (this.indiceFotograma > 0)) {
        if (this.contador % this.iteracoes == 0) {
          this.indiceFotograma++;
          if (this.indiceFotograma >= this.fotogramas) {
            this.indiceFotograma = 0;
          }
        }
        this.contador++;
      }
    }
    this.x += this.deltaX + this.velocidade * Math.cos(this.angulo * Math.PI / 180);
    this.y += this.deltaY + this.velocidade * Math.sin(this.angulo * Math.PI / 180) + this.gravidade * Math.cos(this.angulo * Math.PI / 180);
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>ImagemFilme</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>filmes</em> (<em>videos</em>) de forma embutida no <code>canvas</code>. Num nível básico, uma <em>imagem de filme</em> é definida por um <em>ponto</em>, correspondente, regra geral, ao seu canto superior esquerdo e pela própria imagem &mdash; isto é, o filme.
 * @property {number} x Abscissa para posicionar o <em>filme</em> no <code>canvas</code>
 * @property {number} y Ordenada para posicionar o <em>filme</em> no <code>canvas</code>
 * @property {Filme} filme Objecto de <em>vídeo</em> a ser desenhado no <code>canvas</code>
 * @property {number} y Ordenada para posicionar o <em>filme</em> no <code>canvas</code>
 * @property {number} altura Altura do <em>filme</em> (<em>vídeo</em>)
 * @property {number} deltaX=0 Variação horizontal da posição do <em>filme</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>filme</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>x</em> em relação à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>y</em> em relação à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>filme</em> quando desenhado no <code>canvas</code> &mdash; a rotação é feita tendo como referência o centro do <em>filme</em>
 * @property {number} gravidade=0 Força que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>filme</em>, actuando como a <em>gravidade</em>
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>filme</em>
 * @property {boolean} activo=true Indicação de que o <em>filme</em> deve testar colisões, quando chamado o método <code>colide(outro)</code>
 * @property {boolean} rotacao=false Indicação de que o <em>filme</em> deve rodar, reflectindo o seu <em>ângulo</em>
 * @property {boolean} visivel=true Indicação de que o <em>filme</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
*/
class ImagemFilme extends Grafico {
  /**
   * Construtor para criação de novos objectos do tipo <code>ImagemFilme</code>
   * @param {number} x Abscissa para posicionar o <em>filme</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>filme</em> no <code>canvas</code>
   * @param {Filme} filme Objecto que representa o elemento <code>canvas</code> onde será desenhada o <em>filme</em>
   */
  constructor(x, y, filme) {
    super(x, y);
    this.filme = filme;
  }

  /**
   * Altura do <em>filme</em> (<em>vídeo</em>)
   * @type {number}
   */
  get largura() {
    return this.filme.largura;
  }

  /**
   * Largura do <em>filme</em> (<em>vídeo</em>)
   * @type {number}
   */
  get altura() {
    return this.filme.altura;
  }

  /**
   * Este método desenha um <code>video</code> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo desse <em>vídeo</em>. Note-se que o <em>vídeo</em> só é efetivamente reproduzido no <code>canvas</code> se o elemento <code>video</code> associado por via da propriedade <code>filme</code> estiver também a ser reproduzido.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhada o <em>vídeo</em>
   */
  desenha(tela) {
    this.x += this.distX;
    this.y += this.distY;
    if (this.visivel) {
      var contexto = tela.contexto;
      // para evitar processamento desnecessário, só se faz a translação e a rotação quando o ângulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer rotação
      if (this.rotacao && this.angulo != 0) {
        contexto.save();
        contexto.translate(Math.floor(this.x + this.largura * 0.5), Math.floor(this.y + this.altura * 0.5));
        contexto.rotate(this.angulo * Math.PI / 180);
        contexto.drawImage(this.filme.elemento, Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5));
        contexto.restore();
      }
      else {
        contexto.drawImage(this.filme.elemento, Math.floor(this.x), Math.floor(this.y));
      }
    }
    this.x += this.deltaX + this.velocidade * Math.cos(this.angulo * Math.PI / 180);
    this.y += this.deltaY + this.velocidade * Math.sin(this.angulo * Math.PI / 180) + this.gravidade * Math.cos(this.angulo * Math.PI / 180);
  }
}

//

/**
 * @class
 * @classdesc A classe <code>Tela</code> serve essencialmente como um envelope (<em>wrapper</em>) para elementos de <code>canvas</code>.
 * @property {HTMLElement} elemento O <em>elemento</em> HTML do tipo <code>canvas</code> a ser representado
 */
class Tela {
  #ratoX;
  #ratoY;

  /**
   * Construtor da classe <code>Tela</code>.
   * @param {HTMLElement} elemento O <em>elemento</em> HTML do tipo <code>canvas</code> a ser representado
   */
  constructor(elemento) {
    this.elemento = elemento;
    this.#ratoX = 0;
    this.#ratoY = 0;
    this.codigoTecla = null;
    this.elemento.onclick = this.#processaRato.bind(this);
    this.elemento.onmousedown = this.#processaRato.bind(this);
    this.elemento.onmousemove = this.#processaRato.bind(this);
    this.elemento.onmouseup = this.#processaRato.bind(this);
    window.onkeydown = this.#processaTeclado.bind(this);
    window.onkeyup = this.#processaTeclado.bind(this);
  }

  #processaRato(evento) {
    this.ratoX = evento.offsetX;
    this.ratoY = evento.offsetY;
    switch (evento.type) {
      case 'click':
        this.processaClique();
        break;
      case 'mousedown':
        this.processaRatoDescido();
        break;
      case 'mousemove':
        this.processaRatoMovido();
        break;
      case 'mouseup':
        this.processaRatoSubido();
        break;
      default:
        break;
    }
  }

  #processaTeclado(evento) {
    this.codigoTecla = evento.code;
    switch (evento.type) {
      case 'keydown':
        this.processaTeclaDescida();
        break;
      case 'keyup':
        this.processaTeclaSubida();
        break;
      default:
        break;
    }
    this.codigoTecla = null;
  }

  /**
   * Propriedade correspondente ao <em>evento</em> <code>click</code>, a ser posteriormente definida como uma <em>função</em> contendo as intruções a executar decorrentes desse evento, utilizando, se necessário, as propriedades <code>ratoX</code> e <code>ratoY</code>, associadas às coordenadas do <em>rato</em> na <em>tela</em>, já previamente obtidas e prontas a ser usadas
   * @type {function}
   */
  processaClique = function () { };

  /**
   * Propriedade correspondente ao <em>evento</em> <code>mousedown</code>, a ser posteriormente definida como uma <em>função</em> contendo as intruções a executar decorrentes desse evento, utilizando, se necessário, as propriedades <code>ratoX</code> e <code>ratoY</code>, associadas às coordenadas do <em>rato</em> na <em>tela</em>, já previamente obtidas e prontas a ser usadas
   * @type {function}
   */
  processaRatoDescido = function () { };

  /**
   * Propriedade correspondente ao <em>evento</em> <code>mouseup</code>, a ser posteriormente definida como uma <em>função</em> contendo as intruções a executar decorrentes desse evento, utilizando, se necessário, as propriedades <code>ratoX</code> e <code>ratoY</code>, associadas às coordenadas do <em>rato</em> na <em>tela</em>, já previamente obtidas e prontas a ser usadas
   * @type {function}
   */
  processaRatoSubido = function () { };

  /**
   * Propriedade correspondente ao <em>evento</em> <code>mousemove</code>, a ser posteriormente definida como uma <em>função</em> contendo as intruções a executar decorrentes desse evento, utilizando, se necessário, as propriedades <code>ratoX</code> e <code>ratoY</code>, associadas às coordenadas do <em>rato</em> na <em>tela</em>, já previamente obtidas e prontas a ser usadas
   * @type {function}
   */
  processaRatoMovido = function () { };

  /**
   * Propriedade correspondente ao <em>evento</em> <code>keydown</code>, a ser posteriormente definida como uma <em>função</em> contendo as intruções a executar decorrentes desse evento, utilizando, se necessário, a propriedade <code>codigoTecla</code>, associada à <em>tecla</em> seleccionada, já previamente obtida e pronta a ser usada
   * @type {function}
   */
  processaTeclaDescida = function () { };

  /**
   * Propriedade correspondente ao <em>evento</em> <code>keyup</code>, a ser posteriormente definida como uma <em>função</em> contendo as intruções a executar decorrentes desse evento, utilizando, se necessário, a propriedade <code>codigoTecla</code>, associada à <em>tecla</em> seleccionada, já previamente obtida e pronta a ser usada
   * @type {function}
   */
  processaTeclaSubida = function () { };

  /**
   * Contexto <strong>2D</strong> da <em>tela</em>, para acesso aos métodos nativamente disponibilizados pelo <code>canvas</code>
   * @type {number}
   */
  get contexto() {
    return this.elemento.getContext("2d");
  }

  /**
   * Estilo <code>CSS</code> do cursor do rato <em>[definição]</em>
   * @type {string}
   */
  set cursor(cursor) {
    this.elemento.style.cursor = cursor;
  }

  /**
   * Estilo <code>CSS</code> do cursor do rato <em>[obtenção]</em>
   * @type {string}
   */
  get cursor() {
    return this.elemento.style.cursor;
  }

  /**
   * Largura da <em>tela</em> (número de colunas)
   * @type {number}
   */
  get largura() {
    return this.elemento.width;
  }

  /**
   * Altura da <em>tela</em> (número de linhas)
   * @type {number}
   */
  get altura() {
    return this.elemento.height;
  }

  /**
   * Largura final da <em>tela</em>, considerando quaisquer alterações decorrentes da utilização de CSS para modificar a sua representação
   * @type {number}
   */
  get larguraFinal() {
    return this.elemento.offsetWidth;
  }

  /**
   * Altura final da <em>tela</em>, considerando quaisquer alterações decorrentes da utilização de CSS para modificar a sua representação
   * @type {number}
   */
  get alturaFinal() {
    return this.elemento.offsetHeight;
  }

  /**
   * Abscissa do rato na <em>tela</em> <em>[definição]</em>
   * @type {number}
   */
  set ratoX(ratoX) {
    this.#ratoX = Math.floor(ratoX * this.escalaX);
  }

  /**
   * Ordenada do rato na <em>tela</em> <em>[definição]</em>
   * @type {number}
   */
  set ratoY(ratoY) {
    this.#ratoY = Math.floor(ratoY * this.escalaY);
  }

  /**
   * Abscissa do rato na <em>tela</em> <em>[obtenção]</em>
   * @type {number}
   */
  get ratoX() {
    return this.#ratoX;
  }

  /**
   * Ordenada do rato na <em>tela</em> <em>[obtenção]</em>
   * @type {number}
   */
  get ratoY() {
    return this.#ratoY;
  }

  /**
   * Escala resultante do rácio entre a resolução do canvas e a área ocupada pelo mesmo, relativa à largura (<em>x</em>)
   * @type {number}
   */
  get escalaX() {
    return this.largura / this.larguraFinal;
  }

  /**
   * Escala resultante do rácio entre a resolução do canvas e a área ocupada pelo mesmo, relativa à altura (<em>y</em>)
   * @type {number}
   */
  get escalaY() {
    return this.altura / this.alturaFinal;
  }
}

//

/**
 * @class
 * @classdesc A classe <code>Media</code> é, na prática, uma classe <em>abstracta</em>, servindo apenas de base para as subclasses de <code>Media</code>. Para além disso, funcionará essencialmente como um envelope (<em>wrapper</em>) para elementos de <code>audio</code> e de <code>video</code> em eventuais subclasses.
 * @property {HTMLElement} elemento O <em>elemento</em> HTML a ser representado
 */
class Media {
  /**
   * Construtor da classe <code>Media</code>. <em>Este construtor não deve ser usado directamente. Se tal acontecer, é gerada uma excepção (<code>TypeError</code>).</em>
   * @param {HTMLElement} elemento O <em>elemento</em> HTML a ser representado
   */
  constructor(elemento) {
    this.elemento = elemento;
    if (this.constructor.name == "Media") {
      throw new TypeError("A classe abstracta 'Media' não pode ser instanciada directamente, devendo ser implementada através de subclasses (que poderão depois ser instanciadas).");
    }
  }

  /**
   * Fonte (origem) do elemento multimédia <em>[definição]</em>
   * @type {string}
   */
  set fonte(ficheiro) {
    this.elemento.src = ficheiro;
  }

  /**
   * Fonte (origem) do elemento multimédia <em>[obtenção]</em>
   * @type {string}
   */
  get fonte() {
    return this.elemento.src;
  }

  /**
   * Duração da reprodução do elemento multimédia <em>[obtenção]</em>
   * @type {number}
   */
  get duracao() {
    return this.elemento.duration;
  }

  /**
   * Posição de reprodução do elemento multimédia <em>[definição]</em> &mdash; variando entre zero (<code>0</code>) e um (<code>1</code>)
   * @type {number}
   */
  set volume(volume) {
    this.elemento.volume = volume;
  }

  /**
    * Posição de reprodução do elemento multimédia <em>[obtenção]</em> &mdash; variando entre zero (<code>0</code>) e um (<code>1</code>)
    * @type {number}
    */
  get volume() {
    return this.elemento.volume;
  }

  /**
   * Posição de reprodução do elemento multimédia <em>[definição]</em>
   * @type {number}
   */
  set posicao(tempo) {
    this.elemento.currentTime = tempo;
  }

  /**
   * Posição de reprodução do elemento multimédia <em>[obtenção]</em>
   * @type {number}
   */
  get posicao() {
    return this.elemento.currentTime;
  }

  /**
   * Este método inicia ou retoma a reprodução do elemento multimédia
   * @param {boolean} inicio Indicação de que o elemento deve ser reproduzido do início; caso contrário, é reproduzido a partir do momento em que foi interrompida a sua reprodução anterior (ou do momento indicado pelo tempo de reprodução)
   */
  reproduz(inicio = false) {
    if (inicio) {
      this.elemento.currentTime = 0;
    }
    this.elemento.play();
  }

  /**
   * Este método pára a reprodução do elemento multimédia.
   */
  pausa() {
    this.elemento.pause();
  }

  /**
   * Este método pára a reprodução do elemento multimédia, voltando também ao seu início.
   */
  para() {
    this.pausa();
    this.elemento.currentTime = 0;
  }
}

/**
 * @class
 * @extends Media
 * @classdesc A classe <code>Som</code> funciona essencialmente como um envelope (<em>wrapper</em>) para elementos <code>audio</code>, facilitando a sua criação e também uso de métodos mais comuns para, por exemplo, o controlo da sua reprodução.
 * @property {HTMLElement} elemento O <em>elemento</em> HTML do tipo <code>audio</code> a ser representado
 */
class Som extends Media {
  /**
   * Construtor da classe <code>Som</code>
   * @param {HTMLElement} elemento  O <em>elemento</em> HTML do tipo <code>audio</code> a ser representado
   */
  constructor(elemento) {
    super(elemento);
  }
}

//

/**
 * @class
 * @extends Media
 * @classdesc A classe <code>Filme</code> funciona essencialmente como um envelope (<em>wrapper</em>) para elementos <code>video</code>, facilitando a sua criação e também uso de métodos mais comuns para, por exemplo, o controlo da sua reprodução.
 * @property {HTMLElement} elemento O <em>elemento</em> HTML do tipo <code>video</code> a ser representado
 */
class Filme extends Media {
  /**
   * Construtor da classe <code>Filme</code>
   * @param {HTMLElement} elemento O <em>elemento</em> HTML do tipo <code>video</code> a ser representado
   */
  constructor(elemento) {
    super(elemento);
  }

  /**
   * Largura do <em>filme</em> (número de colunas)
   * @type {number}
   */
  get largura() {
    return this.elemento.videoWidth;
  }

  /**
   * Altura do <em>filme</em> (número de linhas)
   * @type {number}
   */
  get altura() {
    return this.elemento.videoHeight;
  }

  /**
  * Largura final do <em>filme</em>, considerando quaisquer alterações decorrentes da utilização de CSS para modificar a sua representação
  * @type {number}
  */
  get larguraFinal() {
    return this.elemento.offsetWidth;
  }

  /**
   * Altura final do <em>filme</em>, considerando quaisquer alterações decorrentes da utilização de CSS para modificar a sua representação
   * @type {number}
   */
  get alturaFinal() {
    return this.elemento.offsetHeight;
  }
}

//

/**
 * @typedef {Object} PontoPolar
 * @property {number} distancia Distância radial do ponto
 * @property {number} angulo Ângulo polar do ponto
 */

/**
 * @typedef {Object} PontoCartesiano
 * @property {number} x Abscissa do ponto cartesiano
 * @property {number} y Ordenada do ponto cartesiano
 */

//

/**
 * @class
 * @classdesc A classe <code>Utilitarios</code> serve apenas como agregador de alguns métodos e propriedades estáticos para uso noutras classes ou blocos de código.
 * @hideconstructor
 */
class Utilitarios {

  /** 
   * Constante que representa a ausência de <em>reposicionamento</em> &mdash; usada no método <code>colide()</code>, com <code>reposicionamento = true</code>, da classe <code>Grafico</code> e respectivas subcasses
   *  @constant
   *  @type {number}
   *  @default
   */
  static FALSO = 0;

  /** 
   * Constante que representa um <em>reposicionamento</em> em <em>cima</em> &mdash; usada no método <code>colide()</code>, com <code>reposicionamento = true</code>, da classe <code>Grafico</code> e respectivas subcasses
   *  @constant
   *  @type {number}
   *  @default
   */
  static CIMA = 1;

  /** 
   * Constante que representa um <em>reposicionamento</em> em <em>baixo</em> &mdash; usada no método <code>colide()</code>, com <code>reposicionamento = true</code>, da classe <code>Grafico</code> e respectivas subcasses
   *  @constant
   *  @type {number}
   *  @default
   */
  static BAIXO = 2;

  /** 
   * Constante que representa um <em>reposicionamento</em> à <em>esquerda</em> &mdash; usada no método <code>colide()</code>, com <code>reposicionamento = true</code>, da classe <code>Grafico</code> e respectivas subcasses
   *  @constant
   *  @type {number}
   *  @default
   */
  static ESQUERDA = 3;

  /** 
   * Constante que representa um <em>reposicionamento</em> à <em>direita</em> &mdash; usada no método <code>colide()</code>, com <code>reposicionamento = true</code>, da classe <code>Grafico</code> e respectivas subcasses
   *  @constant
   *  @type {number}
   *  @default
   */
  static DIREITA = 4;

  /**
   * Este método cálcula as coordenadas polares de um dado ponto cartesiano, devolvendo o <em>ângulo polar</em> e a <em>distância radial</em>.
   * @param {number} x Abscissa do ponto cartesiano
   * @param {number} y Ordenada do ponto cartesiano
   * @returns {PontoPolar} Coordenadas polares (<em>distância</em>, <em>ângulo</em>) do ponto
   */
  static calculaCoordenadasPolares(x, y) {
    var distancia = Math.hypot(x, y);
    var angulo = null;
    if (x > 0) {
      angulo = Math.atan(y / x) * 180 / Math.PI;
    }
    else if (x < 0 && y >= 0) {
      angulo = (Math.atan(y / x) + Math.PI) * 180 / Math.PI;
    }
    else if (x < 0 && y < 0) {
      angulo = (Math.atan(y / x) - Math.PI) * 180 / Math.PI;
    }
    else if (x == 0 && y > 0) {
      angulo = (Math.PI / 2) * 180 / Math.PI;
    }
    else if (x < 0 && y < 0) {
      angulo = -(Math.PI / 2) * 180 / Math.PI;
    }
    else if (x == 0 && y == 0) {
      angulo = null;
    }
    return { distancia: distancia, angulo: angulo };
  }

  /**
   * Este método cálcula as coordenadas cartesianas de um dado ponto polar, devolvendo o <em>x</em> e o <em>y</em>.
   * @param {number} distancia Distância radial do ponto
   * @param {number} angulo Ângulo polar do ponto
   * @returns {PontoCartesiano} Coordenadas cartesianas (<em>x</em>, <em>y</em>) do ponto
   */
  static calculaCoordenadasCartesianas(distancia, angulo) {
    var x = distancia * Math.cos(angulo * Math.PI / 180);
    var y = distancia * Math.sin(angulo * Math.PI / 180);
    return { x: x, y: y };
  }

  /**
   * Este método desenha um <em>gráfico</em> ou percorre um <em>array</em> de <em>gráficos</em> (instâncias ou objectos de subclasses da classe <code>Grafico</code>) e desenha-os no <code>canvas</code> especificado. O método funciona de forma recursiva, pelo que o <em>array</em> pode conter, ele próprio, também <em>arrays</em> em qualquer das suas posições.
   * @param {Grafico} graficos Um <em>array</em> de <em>gráficos</em> ou mesmo apenas um único <em>gráfico</em>
   * @param {Tela} tela O <code>canvas</code> onde vão ser desenhados os <em>gráficos</em>
   */
  static desenhaGraficos(graficos, tela) {
    for (var i = 0; i < graficos.length; i++) {
      if (Array.isArray(graficos[i])) {
        desenhaGraficos(graficos[i], tela);
      } else {
        graficos[i].desenha(tela);
      }
    }
  }
}