/**
 * @file Biblioteca de classes que representam os tipos mais comuns de <em>gráficos</em> a desenhar num <code>canvas</code> e também o próprio <code>canvas</code>, bem como os elementos <code>audio</code> e <code>video</code>. O propósito desta biblioteca é facilitar o desenvolvimento de jogos e outras aplicações multimédia num contexto académico, gerando-se algum nível de abstracção relativamente a pormenores de implementação no código. Abordam-se apenas os tipos mais frequentes de gráficos e de elementos acessórios, evitando, quando possível, complexidade desnecessária.
 * @version 0.9.5
 * @author Ricardo Rodrigues
 * @date 2025-05-19
 * @copyright Ricardo Rodrigues (2021, 2022, 2023, 2024, 2025)
 */

//

/**
 * @class
 * @abstract
 * @classdesc A classe <code>Grafico</code> é, para todos os efeitos, uma classe <em>abstracta</em>, um esqueleto, servindo apenas de base (i.e., superclasse) para as subclasses de <code>Grafico</code>.
 * @property {number} x Abscissa para posicionar o <em>gráfico</em> no <code>canvas</code>.
 * @property {number} y Ordenada para posicionar o <em>gráfico</em> no <code>canvas</code>.
 * @property {number} deltaX=0 Variação horizontal da posição do <em>gráfico</em>, após cada iteração de desenho.
 * @property {number} deltaY=0 Variação vertical da posição do <em>gráfico</em>, após cada iteração de desenho.
 * @property {number} distX=0 Distância horizontal do <em>gráfico</em> até um dado ponto.
 * @property {number} distY=0 Distância vertical do <em>gráfico</em> até um dado ponto.
 * @property {number} gravidade=0 Força que, quando usada em conjunto com um <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>gráfico</em>, actuando como a <em>gravidade</em>.
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com um <em>ângulo (de rotação)</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>gráfico</em>.
 * @property {number} atrito=0.0 Força que reduz o movimento (sejam os <em>deltas</em> ou a <em>velocidade</em>) do <em>gráfico</em>. O valor deve estar compreendido entre <code>0</code> (sem atrito) e <code>1</code> (movimento totalmente travado). Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {number} anguloRotacao=0 Ângulo de rotação do <em>gráfico</em> quando desenhado no <code>canvas</code>, usado também em conjunto com a <em>velocidade</em>, compreendido entre <code>0</code> e <code>360</code> &mdash; independentemente do valor atribuído, é sempre usado o <em>resto</em> da sua divisão por <code>360</code>. A rotação é feita tendo como referência o centro do <em>gráfico</em>.
 * @property {number} deltaRotacao=0 Variação do ângulo de rotação do <em>gráfico</em>, após cada iteração de desenho.
 * @property {number} anguloGravidade=0 Ângulo cujo co-seno afecta a aplicação do sentido da <em>gravidade</em> ao <em>gráfico</em>, compreendido entre <code>0</code> e <code>180</code>. Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0</code>, se inferior, ou para <code>360</code>, se superior.
 * @property {number} deltaGravidade=0 Variação do ângulo aplicado à <em>gravidade</em>, após cada iteração de desenho.
 * @property {number} opacidade=1.0 Valor da opacidade do <em>gráfico</em> &mdash; pode variar entre <code>0.0</code> (completamente transparente) e <code>1.0</code> (completamente opaco). Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {boolean} activo=true Indicação de que o <em>gráfico</em> deve testar colisões, quando chamado o método <code>colide()</code>. Será útil quando os <em>gráficos</em> são processados em bloco, por exemplo, num <em>array</em>, e nem todos devem ser testados para colisões, ou mesmo para quando há momentos em que o <em>gráfico</em> deve reagir a colisões e noutros não.
 * @property {boolean} visivel=true Indicação de que o <em>gráfico</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha()</code>.
 * @property {boolean} actualiza=true Indicação de que o <em>gráfico</em> deve ter o seu posicionamento actualizado após o seu <em>desenho</em> na <em>tela</em>.
 */
class Grafico {
  #anguloGravidade;
  #deltaGravidade;
  #anguloRotacao;
  #deltaRotacao;
  #totalDeltaX;
  #totalDeltaY;
  #velocidade;
  #gravidade;
  #opacidade;
  #actualiza;
  #capturado;
  #contador;
  #visivel;
  #atrito;
  #activo;
  #deltaX;
  #deltaY;
  #distX;
  #distY;
  #x;
  #y;

  /**
   * Construtor da classe <code>Grafico</code> &mdash; <em>este construtor não pode ser usado directamente; caso tal aconteça, é gerada uma excepção (<code>TypeError</code>)</em>.
   * @param {number} x Abscissa para posicionar o <em>gráfico</em> no <code>canvas</code>.
   * @param {number} y Ordenada para posicionar o <em>gráfico</em> no <code>canvas</code>.
   * @throws {Error} Se a classe for instanciada directamente &mdash; não permitido.
   * @throws {TypeError} Se <code>x</code> ou <code>y</code> não forem números finitos.
   */
  constructor(x, y) {
    if (this.constructor.name === 'Grafico') {
      throw new Error('A classe abstracta "Grafico" não pode ser instanciada directamente, devendo ser implementada através de subclasses (que poderão então ser instanciadas).');
    }
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError('O parâmetro "x" deve ser um número finito.');
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      throw new TypeError('O parâmetro "y" deve ser um número finito.');
    }
    this.#x = x;
    this.#y = y;
    this.#deltaX = 0;
    this.#deltaY = 0;
    this.#distX = 0;
    this.#distY = 0;
    this.#gravidade = 0;
    this.#velocidade = 0;
    this.#atrito = 1.0;
    this.#totalDeltaX = 0;
    this.#totalDeltaY = 0;
    this.#anguloRotacao = 0;
    this.#deltaRotacao = 0;
    this.#anguloGravidade = 0;
    this.#deltaGravidade = 0;
    this.#activo = true;
    this.#visivel = true;
    this.#actualiza = true;
    this.#capturado = false;
    this.#opacidade = 1.0;
    this.#contador = 0;
  }

  set x(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "x" deve ser um número finito.');
    }
    this.#x = valor;
  }

  get x() {
    return this.#x;
  }

  set y(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "y" deve ser um número finito.');
    }
    this.#y = valor;
  }

  get y() {
    return this.#y;
  }

  set deltaX(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "deltaX" deve ser um número finito.');
    }
    this.#deltaX = valor;
  }

  get deltaX() {
    return this.#deltaX;
  }

  set deltaY(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "deltaX" deve ser um número finito.');
    }
    this.#deltaY = valor;
  }

  get deltaY() {
    return this.#deltaY;
  }

  set distX(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "distX" deve ser um número finito.');
    }
    this.#distX = valor;
  }

  get distX() {
    return this.#distX;
  }

  set distY(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "distY" deve ser um número finito.');
    }
    this.#distY = valor;
  }

  get distY() {
    return this.#distY;
  }

  set activo(valor) {
    if (typeof valor !== 'boolean') {
      throw new TypeError('O valor de "activo" deve ser booleano ("true" ou "false").');
    }
    this.#activo = valor;
  }

  get activo() {
    return this.#activo;
  }

  set visivel(valor) {
    if (typeof valor !== 'boolean') {
      throw new TypeError('O valor de "visivel" deve ser booleano ("true" ou "false").');
    }
    this.#visivel = valor;
  }

  get visivel() {
    return this.#visivel;
  }

  set actualiza(valor) {
    if (typeof valor !== 'boolean') {
      throw new TypeError('O valor de "actualiza" deve ser booleano ("true" ou "false").');
    }
    this.#actualiza = valor;
  }

  get actualiza() {
    return this.#actualiza;
  }

  set deltaGravidade(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "deltaGravidade" deve ser um número finito.');
    }
    this.#deltaGravidade = valor;
  }

  get deltaGravidade() {
    return this.#deltaGravidade;
  }

  set deltaRotacao(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "deltaRotacao" deve ser um número finito.');
    }
    this.#deltaRotacao = valor;
  }

  get deltaRotacao() {
    return this.#deltaRotacao;
  }

  set gravidade(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "gravidade" deve ser um número finito.');
    }
    if (valor < 0) {
      throw new RangeError('O valor de "gravidade" não pode ser um número negativo.');
    }
    this.#gravidade = valor;
  }

  get gravidade() {
    return this.#gravidade;
  }

  set anguloGravidade(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "anguloGravidade" deve ser um número finito.');
    }
    this.#anguloGravidade = Math.min(180, Math.max(0, valor));
  }

  get anguloGravidade() {
    return this.#anguloGravidade;
  }

  set anguloRotacao(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "anguloRotacao" deve ser um número finito.');
    }
    this.#anguloRotacao = valor % 360;
  }

  get anguloRotacao() {
    return this.#anguloRotacao;
  }

  set velocidade(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "velocidade" deve ser um número finito.');
    }
    this.#velocidade = valor;
  }

  get velocidade() {
    return this.#velocidade;
  }

  set opacidade(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "opacidade" deve ser um número finito, idealmente entre 0.0 e 1.0.');
    }
    this.#opacidade = Math.min(1, Math.max(0, valor));
  }

  get opacidade() {
    return this.#opacidade;
  }

  set atrito(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "atrito" deve ser um número finito, idealmente entre 0.0 e 1.0.');
    }
    this.#atrito = 1.0 - Math.min(1, Math.max(0, valor));
  }

  get atrito() {
    return this.#atrito;
  }

  /**
   * Largura do <em>gráfico</em>. Este método deve ser obrigatoriamente implementado em subclasses concretas.
   * @abstract
   * @readonly
   * @type {number}
   * @throws {Error} Método não implementado na subclasse.
   */
  get largura() {
    throw new Error('O método <em>getter</em> "largura()" tem de ser implementado nas subclasses de "Grafico".');
  }

  /**
   * Altura do <em>gráfico</em>. Este método deve ser obrigatoriamente implementado em subclasses concretas.
   * @abstract
   * @readonly
   * @type {number}
   * @throws {Error} Método não implementado na subclasse.
   */
  get altura() {
    throw new Error('O método <em>getter</em> "altura()" tem de ser implementado nas subclasses de "Grafico".');
  }

  /**
   * Centróide do <em>gráfico</em>, considerando a sua largura e a sua altura. Por omissão, corresponde ao centro do menor <em>rectângulo imaginário</em> que envolva o <em>gráfico</em>.
   * @readonly
   * @returns {{x: number, y: number}} Objecto representando o centróide, com propriedades <code>x</code> e <code>y</code>.
   */
  get centroide() {
    let centroideX = this.largura * 0.5;
    let centroideY = this.altura * 0.5;
    return { x: centroideX, y: centroideY };
  }

  /**
   * Conjunto de pontos que delimitam o <em>gráfico</em>, definindo o seu <em>invólucro</em>. Os pontos correspondem aos vértices do menor <em>rectângulo imaginário</em> que envolva o <em>gráfico</em>, considerando a rotação actual. Cada ponto é um objecto com as propriedades <code>x</code> e <code>y</code>.
   * @type {Array<{x: number, y: number}>}
   * @readonly
   */
  get involucro() {
    let involucro = new Array();
    let verticesCartesianos = [{ x: 0, y: 0 }, { x: this.largura, y: 0 }, { x: this.largura, y: this.altura }, { x: 0, y: this.altura }];
    // para evitar processamento desnecessário, só se faz a criação do involucro com base na conversão das coordenadas cartesianas dos vertices em coordenadas polares e destas novamente em coordenadas cartesianas quando o ângulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer conversão
    if (this.anguloRotacao !== 0) {
      let verticesPolares = new Array(verticesCartesianos.length);
      for (let i = 0; i < verticesPolares.length; i++) {
        verticesPolares[i] = Grafico.calculaCoordenadasPolares(verticesCartesianos[i].x - this.centroide.x, verticesCartesianos[i].y - this.centroide.y);
      }
      involucro = new Array(verticesPolares.length);
      for (let i = 0; i < involucro.length; i++) {
        involucro[i] = { x: Grafico.calculaCoordenadasCartesianas(verticesPolares[i].distancia, verticesPolares[i].angulo + this.anguloRotacao).x + this.centroide.x + this.#x, y: Grafico.calculaCoordenadasCartesianas(verticesPolares[i].distancia, verticesPolares[i].angulo + this.anguloRotacao).y + this.centroide.y + this.#y };
      }
    }
    else {
      involucro = new Array(verticesCartesianos.length);
      for (let i = 0; i < involucro.length; i++) {
        involucro[i] = { x: verticesCartesianos[i].x + this.#x, y: verticesCartesianos[i].y + this.#y };
      }
    }
    return involucro;
  }

  /**
   * Largura do menor <em>rectângulo imaginário</em> que envolva o <em>invólucro</em> deste <em>gráfico</em>, sendo definida pela distância entre o <em>x</em> do ponto mais à esquerda e o <em>x</em> do ponto mais à direita do <em>invólucro</em>.
   * @type {number}
   * @readonly
   */
  get largurainvolucro() {
    if (this.involucro.length === 0) {
      return 0;
    }
    else {
      let minX = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      for (let ponto of this.involucro) {
        minX = Math.min(minX, ponto.x);
        maxX = Math.max(maxX, ponto.x);
      }
      return maxX - minX;
    }
  }

  /**
   * Altura do menor <em>rectângulo imaginário</em> que envolva o <em>invólucro</em> deste <em>gráfico</em>, sendo definida pela distância entre o <em>x</em> do ponto mais acima e o <em>x</em> do ponto mais abaixo do <em>invólucro</em>.
   * @type {number}
   * @readonly
   */
  get alturainvolucro() {
    if (this.involucro.length === 0) {
      return 0;
    }
    else {
      let minY = Number.POSITIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;
      for (let ponto of involucro) {
        minY = Math.min(minY, ponto.y);
        maxY = Math.max(maxY, ponto.y);
      }
      return maxY - minY;
    }
  }

  /**
   * Indicação de que o <em>gráfico</em> se encontra (ou não) <em>preso</em> às coordenadas do rato, seguindo o seu movimento e adoptando as suas coordenadas, quando chamado o método <code>desenha()</code>.
   * @type {boolean}
   * @readonly
   */
  get capturado() {
    return this.#capturado;
  }

  /**
   * Deslocamento total no eixo dos <em>xx</em>, considerando o <code>deltaX</code>, a <code>velocidade</code>, o <code>anguloRotacao</code> e o <code>deltaTempo</code>.
   * @type {number}
   * @readonly
   */
  get totalDeltaX() {
    return this.#totalDeltaX;
  }

  /**
   * Deslocamento total no eixo dos <em>yy</em>, considerando o <code>deltaY</code>, a <code>velocidade</code>, o <code>anguloRotacao</code>, a <code>gravidade</code>, o <code>anguloGravidade</code> e o <code>deltaTempo</code>.
   * @type {number}
   * @readonly
   */
  get totalDeltaY() {
    return this.#totalDeltaY;
  }

  /**
   * Verifica se existe uma colisão entre <em>este gráfico</em> e <em>outro</em>. Tal ocorre quando um dos pontos de um <em>gráfico</em> se encontra contido na área de <em>outro</em>. Para o efeito, são usados os pontos que definem o <em>invólucro</em> de cada <em>gráfico</em>. Também permite, caso se verifique a colisão, reposicionar <em>este gráfico</em>, deixando-o encostado (ou próximo disso, consoante o valor do <em>afastamento</em>) ao <em>outro</em>, evitando a sobreposição de ambos. O <em>reposicionamento</em> depende da posição imediatamente anterior <em>deste gráfico</em> em relação ao <em>outro</em>.
   * @param {Grafico} outro Outro <em>gráfico</em> para verificar se existe alguma colisão entre <em>esse</em> e <em>este</em>.
   * @param {boolean} [reposiciona=true] Indicação de que este <em>gráfico</em> deve ser reposicionado (ou não) quando colide com o <em>outro</em>.
   * @param {number} [afastamento=0] Afastamento a aplicar entre os dois <em>gráficos</em> no reposicionamento; idealmente, este deve ser compreendido entre zero (<code>0</code>) e um valor inferior aos valores de quaisquer deslocamentos horizontais e verticais.
   * @param {number} [omissoes=0] Número de <em>omissoes</em> em chamadas consecutivas &mdash; pode ser útil definir um número de <em>omissoes</em> superior a zero (<code>0</code>) em situações com verificações de colisões entre muitos <em>gráficos</em> em simultâneo, de forma a diminuir a exigência computacional.
   * @returns {boolean} Se houver colisão, <code>true</code>, ou, no caso de se aplicar reposicionamento, <code>1</code>, <code>2</code>, <code>3</code>, <code>4</code> ou <code>5</code>, correspondentes às posições <em>cima</em>, <em>baixo</em>, <em>esquerda</em>, <em>direita</em> ou <em>indeterminada</em>, respectivamente &mdash; valores também representados, respectivamente, pelas constantes <code>Grafico.CIMA</code>, <code>Grafico.BAIXO</code>, <code>Grafico.ESQUERDA</code>, <code>Grafico.DIREITA</code> e <code>Grafico.INDETERMINADO</code>; senão, <code>false</code>.
   * @throws {TypeError} Se o parâmetro <code>outro</code> não for uma instância de uma subclasse de <code>Grafico</code>.
   * @throws {TypeError} Se o parâmetro <code>reposiciona</code> não for do tipo booleano.
   * @throws {TypeError} Se o parâmetro <code>afastamento</code> não for um número finito e não negativo.
   * @throws {RangeError} Se o parâmetro <code>afastamento</code> não for um número não negativo.
   * @throws {TypeError} Se o parâmetro <code>omissoes</code> não for um número inteiro.
   * @throws {RangeError} Se o parâmetro <code>omissoes</code> não for um número não negativo.
   */
  colide(outro, reposiciona = false, afastamento = 0, omissoes = 0) {
    if (!(outro instanceof Grafico)) {
      throw new TypeError('O parâmetro "outro" deve ser uma instância de uma subclasse de "Grafico".');
    }
    if (typeof reposiciona !== 'boolean') {
      throw new TypeError('O parâmetro "reposiciona" deve ser do tipo booleano.');
    }
    if (typeof afastamento !== 'number' || !Number.isFinite(afastamento)) {
      throw new TypeError('O parâmetro "afastamento" deve ser um número finito.');
    }
    if (afastamento < 0) {
      throw new RangeError('O parâmetro "afastamento" não pode ser um número negativo.');
    }
    if (typeof omissoes !== 'number' || !Number.isInteger(omissoes)) {
      throw new TypeError('O parâmetro "omissoes" deve ser um número inteiro');
    }
    if (omissoes < 0) {
      throw new RangeError('O parâmetro "omissoes" não pode ser um número negativo.');
    }
    this.#contador++;
    if (!reposiciona) {
      return (((this.#contador % (omissoes + 1)) === 0) && this.#activo && outro.activo && (this.contemPontos(outro.involucro) || outro.contemPontos(this.involucro)));
    }
    else {
      if (((this.#contador % (omissoes + 1)) === 0) && this.#activo && outro.activo && (this.contemPontos(outro.involucro) || outro.contemPontos(this.involucro))) {
        let sobreposicaoX = Math.min(this.#x + this.largura - outro.x, outro.x + outro.largura - this.#x);
        let sobreposicaoY = Math.min(this.#y + this.altura - outro.y, outro.y + outro.altura - this.#y);
        let posicao = Grafico.INDETERMINADA;
        if (sobreposicaoX < sobreposicaoY) {        // colisão: horizontal
          if (this.#x < outro.x) {
            this.#x -= sobreposicaoX + afastamento; // posição: esquerda
            posicao = Grafico.ESQUERDA;
          }
          else {
            this.#x += sobreposicaoX + afastamento; // posição: direita
            posicao = Grafico.DIREITA;
          }
        }
        else {                                      // colisão: vertical
          if (this.#y < outro.y) {
            this.#y -= sobreposicaoY + afastamento; // posição: cima
            posicao = Grafico.CIMA;
          }
          else {
            this.#y += sobreposicaoY + afastamento; // posição: baixo
            posicao = Grafico.BAIXO;
          }
        }
        return posicao;
      }
      else {
        return false;
      }
    }
  }

  /**
   * Verifica se algum dos pontos de um <em>array</em> está contido na área deste <em>gráfico</em>, chamando o método <code>contemPonto()</code> para cada elemento do <em>array</em>.
   * @param {Array<{x: number, y: number}>} pontos Conjunto de pontos a verificar (coordenadas <code>x</code> e <code>y</code> numéricas).
   * @returns {boolean} Se algum um dos pontos constantes no <em>array</em> estiver contido neste <em>gráfico</em>, <code>true</code>; caso contrário, <code>false</code>.
   * @throws {TypeError} Se o parâmetro <code>pontos</code> não for um <em>array</em>.
   * @throws {TypeError} Se algum elemento do <em>array</em> não for um objecto com propriedades numéricas <code>x</code> e <code>y</code>.
   */
  contemPontos(pontos) {
    if (!Array.isArray(pontos)) {
      throw new TypeError('O parâmetro "pontos" deve ser um "array" de objectos com as propriedades numéricas "x" e "y".');
    }
    for (let ponto of pontos) {
      if (typeof ponto !== 'object' || typeof ponto.x !== 'number' || typeof ponto.y !== 'number') {
        throw new TypeError('Cada um dos elementos do "array" pontos deve ser um objecto com propriedades numéricas "x" e "y".');
      }
      if (this.contemPonto(ponto.x, ponto.y)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Verifica se um dado <em>ponto</em> está contido área do <em>invólucro</em> rectangular que envolve este <em>gráfico</em>. Tal acontece quando esse <em>ponto</em> está compreendido entre <em>x</em> e <em>x mais a largura</em> e entre <em>y</em> e <em>y mais altura</em> desse <em>invólucro</em>. O teste é realizado utilizando o algoritmo do número de intersecções, verificando a sua paridade &mdash:  conhecido como <em>ray casting</em>.
   * @param {number} x Abscissa do ponto a testar se está contido neste <em>gráfico</em>.
   * @param {number} y Ordenada do ponto a testar se está contido neste <em>gráfico</em>.
   * @returns {boolean} Se o ponto estiver contido neste <em>gráfico</em>, <code>true</code>; senão, <code>false</code>.
   * @throws {TypeError} Se <code>x</code> ou <code>y</code> não forem números finitos.
   */
  contemPonto(x, y) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError('O parâmetro "x" deve ser um número finito.');
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      throw new TypeError('O parâmetro "y" deve ser um número finito.');
    }
    let interseccoes = 0;
    for (let i = 0, j = this.involucro.length - 1; i < this.involucro.length; j = i++) {
      let xi = this.involucro[i].x, yi = this.involucro[i].y;
      let xj = this.involucro[j].x, yj = this.involucro[j].y;
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        interseccoes++;
      }
    }
    if (interseccoes % 2 === 0) {
      return false;
    }
    return true;
  }

  /**
   * Faz com que o <em>gráfico</em> fique <em>preso</em> às coordenadas do rato, seguindo o seu movimento e adoptando as suas coordenadas. O <em>gráfico</em> passa a acompanhar o rato, ajustando a sua posição com base na diferença inicial entre as suas coordenadas e as do rato.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code>, do qual se vai obter as coordenados do rato, que o <em>gráfico</em> irá seguir e adoptar (fazendo as necessárias compensações posicionais).
   * @throws {TypeError} Se o parâmetro <code>tela</code> não for uma instância de <code>Tela</code>.
   */
  captura(tela) {
    if (!(tela instanceof Tela)) {
      throw new TypeError('O parâmetro "tela" deve ser uma instância de "Tela".');
    }
    if (!this.#capturado) {
      this.#capturado = true;
      this.#distX = this.#x - tela.ratoX;
      this.#distY = this.#y - tela.ratoY;
    }
  }

  /**
   * Faz com que o <em>gráfico</em> deixe de ficar <em>preso</em> às coordenadas do rato. Após a chamada deste método, o <em>gráfico</em> deixa de acompanhar o movimento do rato.
   */
  liberta() {
    if (this.#capturado) {
      this.#capturado = false;
      this.#distX = 0;
      this.#distY = 0;
    }
  }

  /**
   * Inverte o sentido da força da gravidade aplicada sobre o <em>gráfico</em>, desde que esta seja diferente de zero, colocando o valor interno de <code>anguloGravidade</code> em <code>180</code> graus (cujo co-seno é usado). Se <code>deltaGravidade</code> estiver definido e for um número negativo, a inversão será temporária, voltando-se posteriormente ao sentido inicialmente definido.
   */
  inverteGravidade() {
    this.#anguloGravidade = 180;
  }

  /**
   * Repõe o sentido inicial da força da gravidade aplicada sobre o <em>gráfico</em>, contanto esta seja diferente de zero, colocando o valor interno de <code>anguloGravidade</code> de volta a <code>0</code> graus (cujo co-seno é usado).
   */
  repoeGravidade() {
    this.#anguloGravidade = 0;
  }

  /**
   * <em>Este método abstracto deve ser terminado de implementar nas subclasses de <code>Grafico</code>, respeitando as especificidades de cada <em>gráfico</em> representado nelas. Contém já um conjunto de instruções transversais a qualquer subclasse, como a rotação, a opacidade ou a actualização das coordenadas após o desenho, sendo esperado que os métodos das subclasses especifiquem apenas as instruções para desenho do respectivo <em>gráfico</em>, passando uma função com essas instruções como argumento deste método (para além da <em>tela</em>). Para além disso, opcionalmente, também recebe como argumento um <em>delta tempo</em>, de modo a garantir uma uniformização das animações e dos movimentos entre diferentes dispositivos. Se este argumento for usado, as <em>variações</em> das coordenadas devem ser expressas em função de um segundo &mdash; i.e., <em>pixels</em> por segundo; caso contrário, assume-se que a <em>variação</em> é definida em função de cada iteração &mdash; i.e., <em>pixels</em> por chamada ao método <code>desenha()</code>.</em>.
   * @abstract
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhado o <em>gráfico</em>
   * @param {function} desenhaGrafico Instruções que especificam e desenham o <em>gráfico</em> no <em>canvas</em>
   * @param {number} [deltaTempo=1] Variação temporal entre chamadas (para sincronização de animações); se não for fornecido, assume-se o valor <code>1</code> &mdash; isto é, que a actualização posicional decorrente do desenho está a ser feita em função do número de iterações e não do tempo.
   * @throws {TypeError} Se o parâmetro <code>tela</code> não for uma instância de <code>Tela</code>.
   * @throws {TypeError} Se o parâmetro <code>desenhaGrafico</code> não for uma função.
   * @throws {TypeError} Se o parâmetro <code>deltaTempo</code> não for um número finito.
   * @throws {RangeError} Se o parâmetro <code>deltaTempo</code> for um número negativo.
   * @throws {Error} Se o método for chamado directamente na classe abstracta <code>Grafico</code>.
   */
  desenha(tela, desenhaGrafico, deltaTempo = 1) {
    if (!tela instanceof Tela) {
      throw new TypeError('O parâmetro "tela" deve ser uma instância de "Tela".');
    }
    if (typeof desenhaGrafico !== 'function') {
      throw new TypeError('O parâmetro "desenhaGrafico" deve ser uma função.');
    }
    if (typeof deltaTempo !== 'number' || !Number.isFinite(deltaTempo)) {
      throw new TypeError('O parâmetro "deltaTempo" deve ser um número finito.');
    }
    if (deltaTempo < 0) {
      throw new RangeError('O parâmetro "deltaTempo" não pode ser um número negativo.');
    }
    if (this.constructor === Grafico) {
      throw new Error('O método abstracto "desenha()" deve ser implementado nas subclasses de "Grafico".');
    }
    if (this.#visivel) {
      const contexto = tela.contexto;
      contexto.save();
      contexto.translate(Math.floor(this.#x + this.centroide.x), Math.floor(this.#y + this.centroide.y));
      contexto.rotate(this.#anguloRotacao * Math.PI / 180);
      contexto.globalAlpha = this.#opacidade;
      desenhaGrafico();
      contexto.restore();
    }
    if (this.#capturado) {
      this.#x = tela.ratoX + this.#distX;
      this.#y = tela.ratoY + this.#distY;
    }
    else if (this.#actualiza) {
      this.#totalDeltaX = (this.#deltaX + this.#velocidade * Math.cos(this.#anguloRotacao * Math.PI / 180)) * this.#atrito * deltaTempo;
      this.#totalDeltaY = ((this.#deltaY + this.#velocidade * Math.sin(this.#anguloRotacao * Math.PI / 180)) * this.#atrito + this.#gravidade * Math.cos(this.#anguloGravidade * Math.PI / 180)) * deltaTempo;
      this.#x += this.#totalDeltaX;
      this.#y += this.#totalDeltaY;
      this.anguloRotacao += this.#deltaRotacao * deltaTempo;
      this.anguloGravidade += this.#deltaGravidade * deltaTempo;
    }
  }

  /**
   * Constante que representa um <em>reposicionamento</em> em <em>cima</em> &mdash; usada no método <code>colide()</code>, com <code>reposiciona=true</code>, da classe <code>Grafico</code> e respectivas subclasses.
   * @constant
   * @type {number}
   * @default 1
   */
  static CIMA = 1;

  /**
   * Constante que representa um <em>reposicionamento</em> em <em>baixo</em> &mdash; usada no método <code>colide()</code>, com <code>reposiciona=true</code>, da classe <code>Grafico</code> e respectivas subclasses.
   * @constant
   * @type {number}
   * @default 2
   */
  static BAIXO = 2;

  /**
   * Constante que representa um <em>reposicionamento</em> à <em>esquerda</em> &mdash; usada no método <code>colide()</code>, com <code>reposiciona=true</code>, da classe <code>Grafico</code> e respectivas subclasses.
   * @constant
   * @type {number}
   * @default 3
   */
  static ESQUERDA = 3;

  /**
   * Constante que representa um <em>reposicionamento</em> à <em>direita</em> &mdash; usada no método <code>colide()</code>, com <code>reposiciona=true</code>, da classe <code>Grafico</code> e respectivas subclasses.
   * @constant
   * @type {number}
   * @default 4
   */
  static DIREITA = 4;

  /**
   * Constante que representa o caso em que há uma <em>colisão</em>, mas, por algum caso extremo, não foi possível determinar a posição anterior do gráfico antes da colisão e realizar o devido <em>reposicionamento</em>; usada no método <code>colide()</code>, com <code>reposiciona=true</code>, da classe <code>Grafico</code> e respectivas subclasses.
   * @constant
   * @type {number}
   * @default 5
   */
  static INDETERMINADA = 5;

  /**
   * Calcula as coordenadas polares de um dado ponto cartesiano, devolvendo o <em>ângulo polar</em> (em graus, no intervalo [0, 360[) e a <em>distância radial</em>.
   * @param {number} x Abscissa do ponto cartesiano.
   * @param {number} y Ordenada do ponto cartesiano.
   * @returns {{distancia: number, angulo: number|undefined}} Objecto com as coordenadas polares do ponto:
   * <ul>
   *   <li><code>distancia</code> - distância radial ao ponto de origem</li>
   *   <li><code>angulo</code> - ângulo polar em graus (no intervalo [0, 360[), ou <code>undefined</code> se a distância for zero</li>
   * </ul>
   * @throws {TypeError} Se <code>x</code> ou <code>y</code> não forem números finitos.
   */
  static calculaCoordenadasPolares(x, y) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError('O parâmetro "x" deve ser um número finito.');
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      throw new TypeError('O parâmetro "y" deve ser um número finito.');
    }
    let distancia = Math.hypot(x, y);
    let angulo = undefined;
    if (distancia !== 0) {
      angulo = Math.atan2(y, x) * 180 / Math.PI;
      if (angulo < 0) {
        angulo += 360;
      }
    }
    return { distancia, angulo };
  }

  /**
   * Cálcula as coordenadas cartesianas de um dado ponto polar, devolvendo o <em>x</em> e o <em>y</em>.
   * @param {number} distancia Distância radial do ponto.
   * @param {number} angulo Ângulo polar (em graus) do ponto.
   * @returns {{x: number, y: number}} Coordenadas cartesianas do ponto: <em>x</em> e <em>y</em>.
   * @throws {TypeError} Se <code>distancia</code> ou <code>angulo</code> não forem números finitos.
   */
  static calculaCoordenadasCartesianas(distancia, angulo = 0) {
    if (typeof distancia !== 'number' || !Number.isFinite(distancia)) {
      throw new TypeError('O parâmetro "distancia" deve ser um número finito.');
    }
    if (typeof angulo !== 'number' || !Number.isFinite(angulo)) {
      throw new TypeError('O parâmetro "angulo" deve ser um número finito.');
    }
    let x = distancia * Math.cos(angulo * Math.PI / 180);
    let y = distancia * Math.sin(angulo * Math.PI / 180);
    return { x, y };
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Circulo</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>círculos</em>. Num nível básico, um <em>círculo</em> é definido por um <em>ponto</em> central e por um <em>raio</em>. Contudo, para que exista uniformidade no posicionamento das formas representadas pelas várias subclasses de <code>Grafico</code>, os círculos são também posicionados usando o canto superior esquerdo (de um <em>quadrado imaginário</em> que o contenha), em vez do seu centro &mdash; assim, o <em>raio</em> é somado ao <em>x</em> e ao <em>y</em> para fazer as devidas compensações de posicionamento, determinando o <em>centro</em>.
 * @property {number} x Abscissa para posicionar o <em>círculo</em> no <code>canvas</code>.
 * @property {number} y Ordenada para posicionar o <em>círculo</em> no <code>canvas</code>.
 * @property {number} raio Raio do <em>círculo</em>.
 * @property {string} preenchimento Cor ou padrão do preenchimento <em>círculo</em>.
 * @property {string} contorno Cor ou padrão do contorno do <em>círculo</em>.
 * @property {number} espessura Espessura do contorno do <em>círculo</em> &mdash. Se a <em>espessura</em> tiver um valor igual a zero (<code>0</code>), o contorno não é desenhado.
 * @property {number} deltaX=0 Variação horizontal da posição do <em>círculo</em>, após cada iteração de desenho.
 * @property {number} deltaY=0 Variação vertical da posição do <em>círculo</em>, após cada iteração de desenho.
 * @property {number} distX=0 Distância horizontal do <em>círculo</em> até um dado ponto.
 * @property {number} distY=0 Distância vertical do <em>círculo</em> até um dado ponto.
 * @property {number} gravidade=0 Força que, quando usada em conjunto com um <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>círculo</em>, actuando como a <em>gravidade</em>.
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com um <em>ângulo (de rotação)</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>círculo</em>.
 * @property {number} atrito=0.0 Força que reduz o movimento (sejam os <em>deltas</em> ou a <em>velocidade</em>) do <em>círculo</em>. O valor deve estar compreendido entre <code>0</code> (sem atrito) e <code>1</code> (movimento totalmente travado). Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {number} anguloRotacao=0 Ângulo de rotação do <em>círculo</em> quando desenhado no <code>canvas</code>, usado também em conjunto com a <em>velocidade</em>, compreendido entre <code>0</code> e <code>360</code> &mdash; independentemente do valor atribuído, é sempre usado o <em>resto</em> da sua divisão por <code>360</code>. A rotação é feita tendo como referência o centro do <em>círculo</em>.
 * @property {number} deltaRotacao=0 Variação do ângulo de rotação do <em>círculo</em>, após cada iteração de desenho.
 * @property {number} anguloGravidade=0 Ângulo cujo co-seno afecta a aplicação do sentido da <em>gravidade</em> ao <em>círculo</em>, compreendido entre <code>0</code> e <code>180</code>. Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0</code>, se inferior, ou para <code>360</code>, se superior.
 * @property {number} deltaGravidade=0 Variação do ângulo aplicado à <em>gravidade</em>, após cada iteração de desenho.
 * @property {number} opacidade=1.0 Valor da opacidade do <em>círculo</em> &mdash; pode variar entre <code>0.0</code> (completamente transparente) e <code>1.0</code> (completamente opaco). Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {boolean} activo=true Indicação de que o <em>círculo</em> deve testar colisões, quando chamado o método <code>colide()</code>. Será útil quando os <em>círculo</em> são processados em bloco, por exemplo, num <em>array</em>, e nem todos devem ser testados para colisões, ou mesmo para quando há momentos em que o <em>círculo</em> deve reagir a colisões e noutros não.
 * @property {boolean} visivel=true Indicação de que o <em>círculo</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha()</code>.
 * @property {boolean} actualiza=true Indicação de que o <em>círculo</em> deve ter o seu posicionamento actualizado após o seu <em>desenho</em> na <em>tela</em>.
*/
class Circulo extends Grafico {
  #preenchimento;
  #espessura;
  #resolucao;
  #contorno;
  #raio;

  /**
   * Construtor para criação de novos objectos do tipo <code>Círculo</code>.
   * @param {number} x Abscissa para posicionar o <em>círculo</em> no <code>canvas</code>.
   * @param {number} y Ordenada para posicionar o <em>círculo</em> no <code>canvas</code>.
   * @param {number} raio Raio do <em>círculo</em>.
   * @param {string|CanvasPattern} [preenchimento='black'] Cor ou padrão do preenchimento do <em>círculo</em>.
   * @param {string|CanvasPattern} [contorno='black'] Cor ou padrão do contorno do <em>círculo</em>.
   * @param {number} [espessura=0] Espessura do contorno do <em>círculo</em>.
   * @throws {TypeError} Se <code>x</code> ou <code>y</code> não forem números finitos.
   * @throws {TypeError} Se <code>raio</code> não for um número finito.
   * @throws {RangeError} Se <code>raio</code> não for um número positivo.
   * @throws {TypeError} Se <code>preenchimento</code> ou <code>contorno</code> não forem cadeias de caracteres.
   * @throws {TypeError} Se <code>espessura</code> não for um número finito.
   * @throws {RangeError} Se <code>espessura</code> for um número negativo.
   */
  constructor(x, y, raio, preenchimento = 'black', contorno = 'black', espessura = 0) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError('O parâmetro "x" deve ser um número finito.');
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      throw new TypeError('O parâmetro "y" deve ser um número finito.');
    }
    if (typeof raio !== 'number' || !Number.isFinite(raio)) {
      throw new TypeError('O parâmetro "raio" deve ser um número finito.');
    }
    if (raio <= 0) {
      throw new RangeError('O parâmetro "raio" deve ser um número positivo.');
    }
    if (typeof preenchimento !== 'string' && !(preenchimento instanceof CanvasPattern)) {
      throw new TypeError('O parâmetro "preenchimento" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    if (typeof contorno !== 'string' && !(contorno instanceof CanvasPattern)) {
      throw new TypeError('O parâmetro "contorno" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    if (typeof espessura !== 'number' || !Number.isFinite(espessura)) {
      throw new TypeError('O parâmetro "espessura" deve ser um número finito.');
    }
    if (espessura < 0) {
      throw new RangeError('O parâmetro "espessura" não pode ser um número negativo.');
    }
    super(x, y);
    this.#raio = raio;
    this.#preenchimento = preenchimento;
    this.#contorno = contorno;
    this.#espessura = espessura;
    this.#resolucao = 36;
  }

  get raio() {
    return this.#raio;
  }

  set raio(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "raio" deve ser um número finito.');
    }
    if (valor <= 0) {
      throw new TypeError('O valor de "raio" deve ser um número positivo.');
    }
    this.#raio = valor;
  }

  set preenchimento(valor) {
    if (typeof valor !== 'string' && typeof valor !== 'CanvasPattern') {
      throw new TypeError('O valor de "preenchimento" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    this.#preenchimento = valor;
  }

  get preenchimento() {
    return this.#preenchimento;
  }

  set espessura(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "espessura" deve ser um número finito.');
    }
    if (valor < 0) {
      throw new RangeError('O valor de "espessura" não pode ser um número negativo.');
    }
    this.#espessura = valor;
  }

  get espessura() {
    return this.#espessura;
  }

  set contorno(valor) {
    if (typeof valor !== 'string' && typeof valor !== 'CanvasPattern') {
      throw new TypeError('O valor de "preenchimento" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    this.#contorno = valor;
  }

  get contorno() {
    return this.#contorno;
  }

  /**
   * Conjunto de pontos que delimitam o <em>círculo</em>, definindo um <em>invólucro</em>.
   * @type {Array<{x: number, y: number}>}
   * @readonly
   */
  get involucro() {
    let involucro = new Array(this.#resolucao);
    for (let i = 0; i < involucro.length; i++) {
      involucro[i] = { x: this.#raio + this.#raio * Math.cos(2 * Math.PI * i / involucro.length + Math.PI) + this.x, y: this.#raio + this.#raio * Math.sin(2 * Math.PI * i / involucro.length + Math.PI) + this.y };
    }
    return involucro;
  }

  /**
   * Largura do menor <em>quadrado imaginário</em> que envolva este <em>círculo</em> &mdash; na prática, corresponde ao diâmetro.
   * @type {number}
   * @readonly
   */
  get largura() {
    return this.#raio * 2;
  }

  /**
   * Altura do menor <em>quadrado imaginário</em> que envolva este <em>círculo</em> &mdash; na prática, corresponde ao diâmetro.
   * @type {number}
   * @readonly
   */
  get altura() {
    return this.#raio * 2;
  }

  /**
   * Verifica se um dado <em>ponto</em> está contido na área deste <em>círculo</em>. Tal acontece quando a distância desse <em>ponto</em> ao centro do <em>círculo</em> é inferior ao <em>raio</em> do <em>círculo</em>.
   * @param {number} x Abscissa do ponto a testar se está contido neste <em>círculo</em>.
   * @param {number} y Ordenada do ponto a testar se está contido neste <em>círculo</em>.
   * @returns {boolean} Se o ponto estiver contido neste <em>círculo</em>, <code>true</code>; senão, <code>false</code>.
   * @throws {TypeError} Se <code>x</code> ou <code>y</code> não forem números finitos.
   */
  contemPonto(x, y) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError('O parâmetro "x" deve ser um número finito.');
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      throw new TypeError('O parâmetro "y" deve ser um número finito.');
    }
    return (Math.hypot((this.x + this.#raio) - x, (this.y + this.#raio) - y) < this.#raio);
  }

  /**
   * Desenha um <em>círculo</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo do menor <em>quadrado imaginário</em> que envolva o <em>círculo</em>. Opcionalmente, também recebe como argumento um <em>delta tempo</em>, de modo a garantir uma uniformização das animações e dos movimentos entre diferentes dispositivos. Se este argumento for usado, as <em>variações</em> das coordenadas devem ser expressas em função de um segundo &mdash; i.e., <em>pixels</em> por segundo; caso contrário, assume-se que a <em>variação</em> é definida em função de cada iteração &mdash; i.e., <em>pixels</em> por chamada ao método <code>desenha()</code>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhado o <em>círculo</em>
   * @param {number} [deltaTempo=1] Variação temporal entre chamadas (para sincronização de animações); se não for fornecido, assume-se o valor <code>1</code>.
   * @throws {TypeError} Se <code>tela</code> não for uma instância de <code>Tela</code>.
   * @throws {TypeError} Se <code>deltaTempo</code> não for um número finito.
   * @throws {RangeError} Se o parâmetro <code>deltaTempo</code> for um número negativo.
   */
  desenha(tela, deltaTempo = 1) {
    if (!(tela instanceof Tela)) {
      throw new TypeError('O parâmetro "tela" deve ser uma instância de "Tela".');
    }
    if (typeof deltaTempo !== 'number' || !Number.isFinite(deltaTempo)) {
      throw new TypeError('O parâmetro "deltaTempo" deve ser um número finito.');
    }
    if (deltaTempo < 0) {
      throw new RangeError('O parâmetro "deltaTempo" não pode ser um número negativo.');
    }
    super.desenha(tela, () => {
      const contexto = tela.contexto;
      contexto.fillStyle = this.#preenchimento;
      contexto.strokeStyle = this.#contorno;
      contexto.lineWidth = this.#espessura;
      contexto.beginPath();
      contexto.arc(Math.floor(-this.centroide.x + this.#raio), Math.floor(-this.centroide.y + this.#raio), this.#raio, 0, Math.PI * 2);
      contexto.closePath();
      // ajuste translacional para que o padrão de preenchimento, quando usado, use como referência o canto superior do círculo
      contexto.translate(Math.floor(-this.centroide.x), Math.floor(-this.centroide.y));
      contexto.fill();
      if (this.#espessura > 0) {
        contexto.stroke();
      }
    }, deltaTempo);
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Rectangulo</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>rectângulos</em>. Num nível básico, um <em>rectângulo</em> é definido por um <em>ponto</em>, correspondente, regra geral, ao seu canto superior esquerdo e por uma <em>largura</em> e por uma <em>altura</em>.
 * @property {number} x Abscissa para posicionar o <em>rectângulo</em> no <code>canvas</code>.
 * @property {number} y Ordenada para posicionar o <em>rectângulo</em> no <code>canvas</code>.
 * @property {number} largura Largura do <em>rectângulo</em>.
 * @property {number} altrura Altura do <em>rectângulo</em>.
 * @property {string} preenchimento Cor ou padrão do preenchimento <em>rectângulo</em>.
 * @property {string} contorno Cor ou padrão do contorno do <em>rectângulo</em>.
 * @property {number} espessura Espessura do contorno do <em>rectângulo</em> &mdash. Se a <em>espessura</em> tiver um valor igual a zero (<code>0</code>), o contorno não é desenhado.
 * @property {number} deltaX=0 Variação horizontal da posição do <em>rectângulo</em>, após cada iteração de desenho.
 * @property {number} deltaY=0 Variação vertical da posição do <em>rectângulo</em>, após cada iteração de desenho.
 * @property {number} distX=0 Distância horizontal do <em>rectângulo</em> até um dado ponto.
 * @property {number} distY=0 Distância vertical do <em>rectângulo</em> até um dado ponto.
 * @property {number} gravidade=0 Força que, quando usada em conjunto com um <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>rectângulo</em>, actuando como a <em>gravidade</em>.
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com um <em>ângulo (de rotação)</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>rectângulo</em>.
 * @property {number} atrito=0.0 Força que reduz o movimento (sejam os <em>deltas</em> ou a <em>velocidade</em>) do <em>rectângulo</em>. O valor deve estar compreendido entre <code>0</code> (sem atrito) e <code>1</code> (movimento totalmente travado). Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {number} anguloRotacao=0 Ângulo de rotação do <em>rectângulo</em> quando desenhado no <code>canvas</code>, usado também em conjunto com a <em>velocidade</em>, compreendido entre <code>0</code> e <code>360</code> &mdash; independentemente do valor atribuído, é sempre usado o <em>resto</em> da sua divisão por <code>360</code>. A rotação é feita tendo como referência o centro do <em>rectângulo</em>.
 * @property {number} deltaRotacao=0 Variação do ângulo de rotação do <em>rectângulo</em>, após cada iteração de desenho.
 * @property {number} anguloGravidade=0 Ângulo cujo co-seno afecta a aplicação do sentido da <em>gravidade</em> ao <em>rectângulo</em>, compreendido entre <code>0</code> e <code>180</code>. Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0</code>, se inferior, ou para <code>360</code>, se superior.
 * @property {number} deltaGravidade=0 Variação do ângulo aplicado à <em>gravidade</em>, após cada iteração de desenho.
 * @property {number} opacidade=1.0 Valor da opacidade do <em>rectângulo</em> &mdash; pode variar entre <code>0.0</code> (completamente transparente) e <code>1.0</code> (completamente opaco). Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {boolean} activo=true Indicação de que o <em>rectângulo</em> deve testar colisões, quando chamado o método <code>colide()</code>. Será útil quando os <em>rectângulo</em> são processados em bloco, por exemplo, num <em>array</em>, e nem todos devem ser testados para colisões, ou mesmo para quando há momentos em que o <em>rectângulo</em> deve reagir a colisões e noutros não.
 * @property {boolean} visivel=true Indicação de que o <em>rectângulo</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha()</code>.
 * @property {boolean} actualiza=true Indicação de que o <em>rectângulo</em> deve ter o seu posicionamento actualizado após o seu <em>desenho</em> na <em>tela</em>.
 */
class Rectangulo extends Grafico {
  #preenchimento;
  #espessura;
  #contorno;
  #largura;
  #altura;

  /**
   * Construtor para criação de novos objectos do tipo <code>Rectangulo</code>.
   * @param {number} x Abscissa para posicionar o <em>rectângulo</em> no <code>canvas</code>.
   * @param {number} y Ordenada para posicionar o <em>rectângulo</em> no <code>canvas</code>.
   * @param {number} largura Largura do <em>rectângulo</em>.
   * @param {number} altura Altura do <em>rectângulo</em>.
   * @param {string|CanvasPattern} [preenchimento='black'] Cor ou padrão do preenchimento do <em>rectângulo</em>.
   * @param {string|CanvasPattern} [contorno='black'] Cor ou padrão do contorno do <em>rectângulo</em>.
   * @param {number} [espessura=0] Espessura do contorno do <em>rectângulo</em>.
   * @throws {TypeError} Se <code>x</code> ou <code>y</code> não forem números finitos.
   * @throws {TypeError} Se <code>largura</code> ou <code>altura</code> não forem números finitos e positivos.
   * @throws {TypeError} Se <code>preenchimento</code> ou <code>contorno</code> não forem <em>strings</em> ou objectos do tipo <code>CanvasPattern</code>.
   * @throws {TypeError} Se <code>espessura</code> não for um número finito.
   * @throws {RangeError} Se <code>espessura</code> for um número negativo.
   */
  constructor(x, y, largura, altura, preenchimento = 'black', contorno = 'black', espessura = 0) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError('O parâmetro "x" deve ser um número finito.');
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      throw new TypeError('O parâmetro "y" deve ser um número finito.');
    }
    if (typeof largura !== 'number' || !Number.isFinite(largura)) {
      throw new TypeError('O parâmetro "largura" deve ser um número finito.');
    }
    if (largura <= 0) {
      throw new RangeError('O parâmetro "largura" deve ser um número positivo.');
    }
    if (typeof altura !== 'number' || !Number.isFinite(altura)) {
      throw new TypeError('O parâmetro "altura" deve ser um número finito.');
    }
    if (altura <= 0) {
      throw new RangeError('O parâmetro "altura" deve ser um número positivo.');
    }
    if (typeof preenchimento !== 'string' && !(preenchimento instanceof CanvasPattern)) {
      console.log(preenchimento)
      throw new TypeError('O parâmetro "preenchimento" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    if (typeof contorno !== 'string' && !(contorno instanceof CanvasPattern)) {
      throw new TypeError('O parâmetro "contorno" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    if (typeof espessura !== 'number' || !Number.isFinite(espessura)) {
      throw new TypeError('O parâmetro "espessura" deve ser um número finito.');
    }
    if (espessura < 0) {
      throw new RangeError('O parâmetro "espessura" não pode ser um número negativo.');
    }
    super(x, y);
    this.#largura = largura;
    this.#altura = altura;
    this.#preenchimento = preenchimento;
    this.#contorno = contorno;
    this.#espessura = espessura;
  }

  set largura(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "largura" deve ser um número finito.');
    }
    if (valor <= 0) {
      throw new TypeError('O valor de "largura" deve ser um número positivo.');
    }
    this.#largura = valor;
  }

  get largura() {
    return this.#largura;
  }

  set altura(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "altura" deve ser um número finito.');
    }
    if (valor <= 0) {
      throw new TypeError('O valor de "altura" deve ser um número positivo.');
    }
    this.#altura = valor;
  }

  get altura() {
    return this.#altura;
  }

  set preenchimento(valor) {
    if (typeof valor !== 'string' && typeof valor !== 'CanvasPattern') {
      throw new TypeError('O valor de "preenchimento" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    this.#preenchimento = valor;
  }

  get preenchimento() {
    return this.#preenchimento;
  }

  set espessura(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "espessura" deve ser um número finito.');
    }
    if (valor < 0) {
      throw new RangeError('O valor de "espessura" não pode ser um número negativo.');
    }
    this.#espessura = valor;
  }

  get espessura() {
    return this.#espessura;
  }

  set contorno(valor) {
    if (typeof valor !== 'string' && typeof valor !== 'CanvasPattern') {
      throw new TypeError('O valor de "preenchimento" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    this.#contorno = valor;
  }

  get contorno() {
    return this.#contorno;
  }

  /**
   * Verifica se um dado <em>ponto</em> está contido área do <em>invólucro</em> rectangular que envolve este <em>gráfico</em>. Tal acontece quando esse <em>ponto</em> está compreendido entre <em>x</em> e <em>x mais a largura</em> e entre <em>y</em> e <em>y mais altura</em> desse <em>invólucro</em>.
   * @param {number} x Abscissa do ponto a testar se está contido neste <em>gráfico</em>.
   * @param {number} y Ordenada do ponto a testar se está contido neste <em>gráfico</em>.
   * @returns {boolean} Se o ponto estiver contido neste <em>gráfico</em>, <code>true</code>; senão, <code>false</code>.
   * @throws {TypeError} Se <code>x</code> ou <code>y</code> não forem números finitos.
   */
  contemPonto(x, y) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError('O parâmetro "x" deve ser um número finito.');
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      throw new TypeError('O parâmetro "y" deve ser um número finito.');
    }
    if (this.anguloRotacao !== 0) {
      return super.contemPonto(x, y);
    }
    else {
      return (x > this.x && x <= this.x + this.largura && y > this.y && y <= this.y + this.altura);
    }
  }

  /**
   * Desenha um <em>rectângulo</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo desse <em>rectângulo</em>. Opcionalmente, também recebe como argumento um <em>delta tempo</em>, de modo a garantir uma uniformização das animações e dos movimentos entre diferentes dispositivos. Se este argumento for usado, as <em>variações</em> das coordenadas devem ser expressas em função de um segundo &mdash; i.e., <em>pixels</em> por segundo; caso contrário, assume-se que a <em>variação</em> é definida em função de cada iteração &mdash; i.e., <em>pixels</em> por chamada ao método <code>desenha()</code>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhado o <em>rectângulo</em>
   * @param {number} [deltaTempo=1] Variação temporal entre chamadas (para sincronização de animações); se não for fornecido, assume-se o valor <code>1</code>.
   * @throws {TypeError} Se <code>tela</code> não for uma instância de <code>Tela</code>.
   * @throws {TypeError} Se <code>deltaTempo</code> não for um número finito e positivo.
   * @throws {RangeError} Se o parâmetro <code>deltaTempo</code> for um número negativo.
   */
  desenha(tela, deltaTempo = 1) {
    if (!(tela instanceof Tela)) {
      throw new TypeError('O parâmetro "tela" deve ser uma instância de "Tela".');
    }
    if (typeof deltaTempo !== 'number' || !Number.isFinite(deltaTempo)) {
      throw new TypeError('O parâmetro "deltaTempo" deve ser um número finito.');
    }
    if (deltaTempo < 0) {
      throw new RangeError('O parâmetro "deltaTempo" não pode ser um número negativo.');
    }
    super.desenha(tela, () => {
      const contexto = tela.contexto;
      contexto.fillStyle = this.preenchimento;
      contexto.strokeStyle = this.contorno;
      contexto.lineWidth = this.espessura;
      contexto.beginPath();
      contexto.rect(Math.floor(-this.centroide.x), Math.floor(-this.centroide.y), this.largura, this.altura);
      contexto.closePath();
      // ajuste translacional para que o padrão de preenchimento, quando usado, use como referência o canto superior do rectângulo
      contexto.translate(Math.floor(-this.centroide.x), Math.floor(-this.centroide.y));
      contexto.fill();
      if (this.espessura > 0) {
        contexto.stroke();
      }
    }, deltaTempo);
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Poligono</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>polígonos</em>. Num nível básico, um <em>polígono</em> é definido por um <em>ponto</em>, correspondente, regra geral, ao canto superior esquerdo de um <em>rectângulo imaginário</em> que contenha o <em>polígono</em>. Assim, este será o <em>ponto</em> relativamente ao qual todos os pontos do <em>polígono</em> serão posicionados. Aconselha-se que todos os pontos do polígono se encontrem à direita e abaixo desta origem e tão próximos dela quanto possível; caso contrário, aspectos como a rotação do polígono poderão ter resultados diferentes do esperado. Deste modo, há a possibilidade, activada por omissão, através do atributo <code>justo</code>, de <em>encostar</em> o polígono à origem &mdash; contudo, tal implica a alteração (o <em>ajuste</em>) de todos os pontos.
 * @property {number} x Abscissa para posicionar o <em>polígono</em> no <code>canvas</code>.
 * @property {number} y Ordenada para posicionar o <em>polígono</em> no <code>canvas</code>.
 * @property {array} vertices Conjunto de pontos com os vários vértices do <em>polígono</em>
 * @property {string} preenchimento Cor ou padrão do preenchimento <em>polígono</em>.
 * @property {string} contorno Cor ou padrão do contorno do <em>polígono</em>.
 * @property {number} espessura Espessura do contorno do <em>polígono</em> &mdash. Se a <em>espessura</em> tiver um valor igual a zero (<code>0</code>), o contorno não é desenhado.
 * @property {number} deltaX=0 Variação horizontal da posição do <em>polígono</em>, após cada iteração de desenho.
 * @property {number} deltaY=0 Variação vertical da posição do <em>polígono</em>, após cada iteração de desenho.
 * @property {number} distX=0 Distância horizontal do <em>polígono</em> até um dado ponto.
 * @property {number} distY=0 Distância vertical do <em>polígono</em> até um dado ponto.
 * @property {number} gravidade=0 Força que, quando usada em conjunto com um <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>polígono</em>, actuando como a <em>gravidade</em>.
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com um <em>ângulo (de rotação)</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>polígono</em>.
 * @property {number} atrito=0.0 Força que reduz o movimento (sejam os <em>deltas</em> ou a <em>velocidade</em>) do <em>polígono</em>. O valor deve estar compreendido entre <code>0</code> (sem atrito) e <code>1</code> (movimento totalmente travado). Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {number} anguloRotacao=0 Ângulo de rotação do <em>polígono</em> quando desenhado no <code>canvas</code>, usado também em conjunto com a <em>velocidade</em>, compreendido entre <code>0</code> e <code>360</code> &mdash; independentemente do valor atribuído, é sempre usado o <em>resto</em> da sua divisão por <code>360</code>. A rotação é feita tendo como referência o centro do <em>polígono</em>.
 * @property {number} deltaRotacao=0 Variação do ângulo de rotação do <em>polígono</em>, após cada iteração de desenho.
 * @property {number} anguloGravidade=0 Ângulo cujo co-seno afecta a aplicação do sentido da <em>gravidade</em> ao <em>polígono</em>, compreendido entre <code>0</code> e <code>180</code>. Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0</code>, se inferior, ou para <code>360</code>, se superior.
 * @property {number} deltaGravidade=0 Variação do ângulo aplicado à <em>gravidade</em>, após cada iteração de desenho.
 * @property {number} opacidade=1.0 Valor da opacidade do <em>polígono</em> &mdash; pode variar entre <code>0.0</code> (completamente transparente) e <code>1.0</code> (completamente opaco). Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {boolean} activo=true Indicação de que o <em>polígono</em> deve testar colisões, quando chamado o método <code>colide()</code>. Será útil quando os <em>polígono</em> são processados em bloco, por exemplo, num <em>array</em>, e nem todos devem ser testados para colisões, ou mesmo para quando há momentos em que o <em>polígono</em> deve reagir a colisões e noutros não.
 * @property {boolean} visivel=true Indicação de que o <em>polígono</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha()</code>.
 * @property {boolean} actualiza=true Indicação de que o <em>polígono</em> deve ter o seu posicionamento actualizado após o seu <em>desenho</em> na <em>tela</em>.
 */
class Poligono extends Grafico {
  #preenchimento;
  #espessura;
  #contorno;
  #vertices;
  #deslocX;
  #deslocY;
  #justo;

  /**
   * Construtor para criação de novos objectos do tipo <code>Poligono</code>.
   * @param {number} x Abscissa para posicionar o <em>polígono</em> no <code>canvas</code>.
   * @param {number} y Ordenada para posicionar o <em>polígono</em> no <code>canvas</code>.
   * @param {Array<{x: number, y: number}>} vertices Conjunto de pontos com os vários vértices do <em>polígono</em>.
   * @param {string|CanvasPattern} [preenchimento='black'] Cor ou padrão do preenchimento do <em>polígono</em>.
   * @param {string|CanvasPattern} [contorno='black'] Cor ou padrão do contorno do <em>polígono</em>.
   * @param {number} [espessura=0] Espessura do contorno do <em>polígono</em>.
   * @param {boolean} [justo=true] Indicação de que o <em>polígono</em> deve ser reposicionado de forma a ficar <em>encostado</em> ao ponto usado para definir o seu posicionamento no <code>canvas</code>.
   * @throws {TypeError} Se <code>x</code> ou <code>y</code> não forem números finitos.
   * @throws {TypeError} Se <code>vertices</code> não for um "array" com pelo menos 3 pontos válidos.
   * @throws {TypeError} Se cada vértice não for um objecto com propriedades numéricas <code>x</code> e <code>y</code>.
   * @throws {TypeError} Se <code>preenchimento</code> ou <code>contorno</code> não forem <em>strings</em> ou objectos do tipo <code>CanvasPattern</code>.
   * @throws {TypeError} Se <code>espessura</code> não for um número finito.
   * @throws {RangeError} Se <code>espessura</code> for um número negativo.
   * @throws {TypeError} Se <code>justo</code> não for um valor booleano.
   */
  constructor(x, y, vertices, preenchimento = 'black', contorno = 'black', espessura = 0, justo = true) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError('O parâmetro "x" deve ser um número finito.');
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      throw new TypeError('O parâmetro "y" deve ser um número finito.');
    }
    if (!Array.isArray(vertices) || vertices.length < 3) {
      throw new TypeError('O parâmetro "vertices" deve ser um "array" com pelo menos 3 pontos.');
    }
    for (const vertice of vertices) {
      if (typeof vertice !== 'object' || typeof vertice.x !== 'number' || !Number.isFinite(vertice.x) || typeof vertice.y !== 'number' || !Number.isFinite(vertice.y)) {
        throw new TypeError('Cada elemento de "vertices" deve ser um objecto com propriedades numéricas "x" e "y".');
      }
    }
    if (typeof preenchimento !== 'string' && !(preenchimento instanceof CanvasPattern)) {
      console.log(preenchimento)
      throw new TypeError('O parâmetro "preenchimento" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    if (typeof contorno !== 'string' && !(contorno instanceof CanvasPattern)) {
      throw new TypeError('O parâmetro "contorno" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    if (typeof espessura !== 'number' || !Number.isFinite(espessura)) {
      throw new TypeError('O parâmetro "espessura" deve ser um número finito.');
    }
    if (espessura < 0) {
      throw new RangeError('O parâmetro "espessura" não pode ser um número negativo.');
    }
    if (typeof justo !== 'boolean') {
      throw new TypeError('O parâmetro "justo" deve ser um valor booleano.');
    }
    super(x, y);
    this.#vertices = vertices.map(vertice => ({ x: vertice.x, y: vertice.y }));
    this.#preenchimento = preenchimento;
    this.#contorno = contorno;
    this.#espessura = espessura;
    this.#justo = justo;
    this.#deslocX = 0;
    this.#deslocY = 0;
    // se justo for verdadeiro (true), todo os pontos são alterados de forma a que o polígono seja 'encostado' à origem: o ponto (x, y) do polígono
    this.#ajusta();
  }

  set preenchimento(valor) {
    if (typeof valor !== 'string' && typeof valor !== 'CanvasPattern') {
      throw new TypeError('O valor de "preenchimento" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    this.#preenchimento = valor;
  }

  get preenchimento() {
    return this.#preenchimento;
  }

  set espessura(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "espessura" deve ser um número finito.');
    }
    if (valor < 0) {
      throw new RangeError('O valor de "espessura" não pode ser um número negativo.');
    }
    this.#espessura = valor;
  }

  get espessura() {
    return this.#espessura;
  }

  set contorno(valor) {
    if (typeof valor !== 'string' && typeof valor !== 'CanvasPattern') {
      throw new TypeError('O valor de "preenchimento" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    this.#contorno = valor;
  }

  get contorno() {
    return this.#contorno;
  }

  set justo(valor) {
    if (typeof valor !== 'boolean') {
      throw new TypeError('O valor de "justo" deve booleano.');
    }
    this.#justo = valor;
    this.#ajusta();
  }

  get justo() {
    return this.#justo;
  }

  set vertices(valor) {
    if (!Array.isArray(valor) || valor.length < 3) {
      throw new TypeError('O valor de "vertices" deve ser um "array" com pelo menos 3 pontos.');
    }
    for (const vertice of valor) {
      if (typeof vertice !== 'object' || typeof vertice.x !== 'number' || !Number.isFinite(vertice.x) || typeof vertice.y !== 'number' || !Number.isFinite(vertice.y)) {
      }
    }
    this.#vertices = valor.map(vertice => ({ x: vertice.x, y: vertice.y }));
    if (this.#justo) {
      this.#ajusta();
    }
  }

  get vertices() {
    return this.#vertices;
  }

  /**
   * Conjunto de pontos que delimitam o <em>polígono</em>, definindo o seu <em>invólucro</em> actual (já com rotação e translação aplicadas).
   * @type {Array<{x: number, y: number}>}
   * @readonly
   */
  get involucro() {
    let verticesCartesianos = this.#vertices;
    let verticesPolares = new Array(verticesCartesianos.length);
    for (let i = 0; i < verticesPolares.length; i++) {
      verticesPolares[i] = Grafico.calculaCoordenadasPolares(this.#vertices[i].x - this.centroide.x, this.#vertices[i].y - this.centroide.y);
    }
    let involucro = new Array(verticesPolares.length);
    for (let i = 0; i < involucro.length; i++) {
      involucro[i] = { x: Grafico.calculaCoordenadasCartesianas(verticesPolares[i].distancia, verticesPolares[i].angulo + this.anguloRotacao).x + this.centroide.x + this.x, y: Grafico.calculaCoordenadasCartesianas(verticesPolares[i].distancia, verticesPolares[i].angulo + this.anguloRotacao).y + this.centroide.y + this.y };
    }
    return involucro;
  }

  // este método privado ajusta o polígono de forma a ficar encostado ao ponto usado para definir o seu posicionamento no canvas (ou desfaz o ajuste que lhe possa ter sido aplicado, revertendo-o ao seu posicionamento original)
  #ajusta() {
    if (this.justo) {
      let deslocX = Number.POSITIVE_INFINITY;
      let deslocY = Number.POSITIVE_INFINITY;
      for (let i = 0; i < this.#vertices.length; i++) {
        deslocX = Math.min(deslocX, this.#vertices[i].x);
        deslocY = Math.min(deslocY, this.#vertices[i].y);
      }
      this.#deslocX = deslocX;
      this.#deslocY = deslocY;
      for (let i = 0; i < this.#vertices.length; i++) {
        this.#vertices[i].x -= deslocX;
        this.#vertices[i].y -= deslocY;
      }
    }
    else {
      for (let i = 0; i < this.#vertices.length; i++) {
        this.#vertices[i].x += this.#deslocX;
        this.#vertices[i].y += this.#deslocY;
      }
      this.#deslocX = 0;
      this.#deslocY = 0;
    }
  }

  /**
   * Largura do menor <em>rectângulo imaginário</em> que envolve este <em>polígono</em>. É definida pela distância entre o <em>x</em> do ponto mais à esquerda e o <em>x</em> do ponto mais à direita do <em>polígono</em>.
   * @type {number}
   * @readonly
   */
  get largura() {
    if (this.#vertices.length === 0) {
      return 0;
    }
    else {
      let minX = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      for (let ponto of this.#vertices) {
        minX = Math.min(minX, ponto.x);
        maxX = Math.max(maxX, ponto.x);
      }
      return maxX - minX;
    }
  }

  /**
   * Altura do menor <em>rectângulo imaginário</em> que envolva este <em>polígono</em>. É definida pela distância entre o <em>y</em> do ponto mais acima e o <em>y</em> do ponto mais abaixo do <em>polígono</em>.
   * @type {number}
   * @readonly
   */
  get altura() {
    if (this.#vertices.length === 0) {
      return 0;
    }
    else {
      let minY = Number.POSITIVE_INFINITY;
      let maxY = Number.NEGATIVE_INFINITY;
      for (let ponto of this.#vertices) {
        minY = Math.min(minY, ponto.y);
        maxY = Math.max(maxY, ponto.y);
      }
      return maxY - minY;
    }
  }

  /**
   * Centróide do <em>polígono</em>, calculado a partir dos seus vértices usando a fórmula da área de Gauss.
   * @type {{x: number, y: number}}
   * @readonly
   */
  get centroide() {
    let somatorioArea = 0, somatorioCentroideX = 0, somatorioCentroideY = 0;
    let area = 0, centroideX = 0, centroideY = 0;
    if (this.#vertices.length > 2) {
      for (let i = 0, j = this.#vertices.length - 1; i < this.#vertices.length; j = i++) {
        let xi = this.#vertices[i].x, yi = this.#vertices[i].y;
        let xj = this.#vertices[j].x, yj = this.#vertices[j].y;
        let produtoCruzado = xi * yj - xj * yi;
        somatorioArea += produtoCruzado;
        somatorioCentroideX += (xi + xj) * produtoCruzado;
        somatorioCentroideY += (yi + yj) * produtoCruzado;
      }
      area = (1 / 2) * somatorioArea;
    }
    if (area !== 0) {
      centroideX = (1 / (6 * area)) * somatorioCentroideX;
      centroideY = (1 / (6 * area)) * somatorioCentroideY;
    }
    return { x: centroideX, y: centroideY };
  }

  /**
   * Desenha um <em>polígono</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo de um <em>rectângulo imaginário</em> que contenha o <em>polígono</em>. Opcionalmente, também recebe como argumento um <em>delta tempo</em>, de modo a garantir uma uniformização das animações e dos movimentos entre diferentes dispositivos. Se este argumento for usado, as <em>variações</em> das coordenadas devem ser expressas em função de um segundo &mdash; i.e., <em>pixels</em> por segundo; caso contrário, assume-se que a <em>variação</em> é definida em função de cada iteração &mdash; i.e., <em>pixels</em> por chamada ao método <code>desenha()</code>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhado o <em>polígono</em>
   * @param {number} [deltaTempo=1] Variação temporal entre chamadas (para sincronização de animações); se não for fornecido, assume-se o valor <code>1</code>.
   * @throws {TypeError} Se <code>tela</code> não for uma instância de <code>Tela</code>.
   * @throws {TypeError} Se <code>deltaTempo</code> não for um número finito e positivo.
   * @throws {RangeError} Se o parâmetro <code>deltaTempo</code> for um número negativo.
   */
  desenha(tela, deltaTempo = 1) {
    if (!(tela instanceof Tela)) {
      throw new TypeError('O parâmetro "tela" deve ser uma instância de "Tela".');
    }
    if (typeof deltaTempo !== 'number' || !Number.isFinite(deltaTempo)) {
      throw new TypeError('O parâmetro "deltaTempo" deve ser um número finito.');
    }
    if (deltaTempo < 0) {
      throw new RangeError('O parâmetro "deltaTempo" não pode ser um número negativo.');
    }
    super.desenha(tela, () => {
      const contexto = tela.contexto;
      contexto.fillStyle = this.#preenchimento;
      contexto.strokeStyle = this.#contorno;
      contexto.lineWidth = this.#espessura;
      contexto.beginPath();
      for (let i = 0; i < this.#vertices.length; i++) {
        if (i === 0) {
          contexto.moveTo(Math.floor(this.#vertices[i].x - this.centroide.x), Math.floor(this.#vertices[i].y - this.centroide.y));
        }
        else {
          contexto.lineTo(Math.floor(this.#vertices[i].x - this.centroide.x), Math.floor(this.#vertices[i].y - this.centroide.y));
        }
      }
      contexto.closePath();
      // ajuste translacional para que o padrão de preenchimento, quando usado, use como referência o canto superior do polígono
      contexto.translate(Math.floor(-this.centroide.x), Math.floor(-this.centroide.y));
      contexto.fill();
      if (this.#espessura > 0) {
        contexto.stroke();
      }
    }, deltaTempo);
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Texto</code> é uma subclasse de <code>Grafico</code>, servindo para representar uma ou mais linhas de <em>texto</em>. Se o <em>texto</em> tiver mais que uma linha, estes devem estar separadas por <code>/n</code>.
 * @property {number} x Abscissa para posicionar o <em>texto</em> no <code>canvas</code>.
 * @property {number} y Ordenada para posicionar o <em>texto</em> no <code>canvas</code>.
 * @property {number} tamanho=16 Tamanho do <em>texto</em> em pontos (<code>pt</code)
 * @property {number} fonte='sans-serif' Fonte do <em>texto</em>.
 * @property {string} preenchimento Cor ou padrão do preenchimento <em>texto</em>.
 * @property {string} contorno Cor ou padrão do contorno do <em>texto</em>.
 * @property {number} espessura Espessura do contorno do <em>texto</em> &mdash. Se a <em>espessura</em> tiver um valor igual a zero (<code>0</code>), o contorno não é desenhado.
 * @property {number} deltaX=0 Variação horizontal da posição do <em>texto</em>, após cada iteração de desenho.
 * @property {number} deltaY=0 Variação vertical da posição do <em>texto</em>, após cada iteração de desenho.
 * @property {number} distX=0 Distância horizontal do <em>texto</em> até um dado ponto.
 * @property {number} distY=0 Distância vertical do <em>texto</em> até um dado ponto.
 * @property {number} gravidade=0 Força que, quando usada em conjunto com um <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>texto</em>, actuando como a <em>gravidade</em>.
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com um <em>ângulo (de rotação)</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>texto</em>.
 * @property {number} atrito=0.0 Força que reduz o movimento (sejam os <em>deltas</em> ou a <em>velocidade</em>) do <em>texto</em>. O valor deve estar compreendido entre <code>0</code> (sem atrito) e <code>1</code> (movimento totalmente travado). Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {number} anguloRotacao=0 Ângulo de rotação do <em>texto</em> quando desenhado no <code>canvas</code>, usado também em conjunto com a <em>velocidade</em>, compreendido entre <code>0</code> e <code>360</code> &mdash; independentemente do valor atribuído, é sempre usado o <em>resto</em> da sua divisão por <code>360</code>. A rotação é feita tendo como referência o centro do <em>texto</em>.
 * @property {number} deltaRotacao=0 Variação do ângulo de rotação do <em>texto</em>, após cada iteração de desenho.
 * @property {number} anguloGravidade=0 Ângulo cujo co-seno afecta a aplicação do sentido da <em>gravidade</em> ao <em>texto</em>, compreendido entre <code>0</code> e <code>180</code>. Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0</code>, se inferior, ou para <code>360</code>, se superior.
 * @property {number} deltaGravidade=0 Variação do ângulo aplicado à <em>gravidade</em>, após cada iteração de desenho.
 * @property {number} opacidade=1.0 Valor da opacidade do <em>texto</em> &mdash; pode variar entre <code>0.0</code> (completamente transparente) e <code>1.0</code> (completamente opaco). Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {boolean} activo=true Indicação de que o <em>texto</em> deve testar colisões, quando chamado o método <code>colide()</code>. Será útil quando os <em>texto</em> são processados em bloco, por exemplo, num <em>array</em>, e nem todos devem ser testados para colisões, ou mesmo para quando há momentos em que o <em>texto</em> deve reagir a colisões e noutros não.
 * @property {boolean} visivel=true Indicação de que o <em>texto</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha()</code>.
 * @property {boolean} actualiza=true Indicação de que o <em>texto</em> deve ter o seu posicionamento actualizado após o seu <em>desenho</em> na <em>tela</em>.
 */
class Texto extends Grafico {
  #tamanho;
  #texto;
  #fonte;
  #preenchimento;
  #contorno;
  #espessura;

  /**
   * Construtor para criação de novos objectos do tipo <code>Texto</code>.
   * @param {number} x Abscissa para posicionar o <em>texto</em> no <code>canvas</code>.
   * @param {number} y Ordenada para posicionar o <em>texto</em> no <code>canvas</code>.
   * @param {string} texto Conteúdo de <em>texto</em> a desenhar no <code>canvas</code>.
   * @param {string|CanvasPattern} [preenchimento='black'] Cor ou padrão do preenchimento do <em>texto</em>.
   * @param {string|CanvasPattern} [contorno='black'] Cor ou padrão do contorno do <em>texto</em>.
   * @param {number} [espessura=0] Espessura do contorno do <em>texto</em>.
   * @param {number} [tamanho=16] Tamanho da fonte do <em>texto</em> (em <em>pixels</em>).
   * @param {string} [fonte='sans-serif'] Nome da fonte a utilizar para o <em>texto</em>.
   * @throws {TypeError} Se <code>x</code> ou <code>y</code> não forem números finitos.
   * @throws {TypeError} Se <code>texto</code> não for uma <em>string</em>.
   * @throws {TypeError} Se <code>preenchimento</code> ou <code>contorno</code> não forem <em>strings</em> ou objectos do tipo <code>CanvasPattern</code>.
   * @throws {TypeError} Se <code>espessura</code> não for um número finito.
   * @throws {RangeError} Se <code>espessura</code> for um número negativo.
   * @throws {TypeError} Se <code>tamanho</code> não for um número finito.
   * @throws {RangeError} Se <code>tamanho</code> não for positivo.
   * @throws {TypeError} Se <code>fonte</code> não for uma <em>string</em> não vazia.
   */
  constructor(x, y, texto, preenchimento = 'black', contorno = 'black', espessura = 0, tamanho = 16, fonte = 'sans-serif') {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError('O parâmetro "x" deve ser um número finito.');
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      throw new TypeError('O parâmetro "y" deve ser um número finito.');
    }
    if (typeof texto !== 'string') {
      throw new TypeError('O parâmetro "texto" deve ser uma "string".');
    }
    if (typeof preenchimento !== 'string' && !(preenchimento instanceof CanvasPattern)) {
      console.log(preenchimento)
      throw new TypeError('O parâmetro "preenchimento" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    if (typeof contorno !== 'string' && !(contorno instanceof CanvasPattern)) {
      throw new TypeError('O parâmetro "contorno" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    if (typeof espessura !== 'number' || !Number.isFinite(espessura)) {
      throw new TypeError('O parâmetro "espessura" deve ser um número finito.');
    }
    if (espessura < 0) {
      throw new RangeError('O parâmetro "espessura" não pode ser um número negativo.');
    }
    if (typeof tamanho !== 'number' || !Number.isFinite(tamanho)) {
      throw new TypeError('O parâmetro "tamanho" deve ser um número finito.');
    }
    if (tamanho <= 0) {
      throw new RangeError('O parâmetro "tamanho" deve ser um número positivo.');
    }
    if (typeof fonte !== 'string' || fonte.trim() === '') {
      throw new TypeError('O parâmetro "fonte" deve ser uma "string" não vazia.');
    }
    super(x, y);
    this.#texto = texto;
    this.#preenchimento = preenchimento;
    this.#contorno = contorno;
    this.#espessura = espessura;
    this.#tamanho = tamanho;
    this.#fonte = fonte;
  }

  set texto(valor) {
    if (typeof valor !== 'string') {
      throw new TypeError('O valor de "texto" deve ser uma "string".');
    }
    this.#texto = valor;
  }

  get texto() {
    return this.#texto;
  }

  set tamanho(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "tamanho" deve ser um número finito.');
    }
    if (valor <= 0) {
      throw new RangeError('O valor de "tamanho" deve ser um número positivo.');
    }
    this.#tamanho = valor;
  }

  get tamanho() {
    return this.#tamanho;
  }

  set fonte(valor) {
    if (typeof valor !== 'string' || valor.trim() === '') {
      throw new TypeError('O valor de "fonte" deve ser uma "string" não vazia.');
    }
    this.#fonte = valor;
  }

  get fonte() {
    return this.#fonte;
  }

  set preenchimento(valor) {
    if (typeof valor !== 'string' && typeof valor !== 'CanvasPattern') {
      throw new TypeError('O valor de "preenchimento" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    this.#preenchimento = valor;
  }

  get preenchimento() {
    return this.#preenchimento;
  }

  set espessura(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "espessura" deve ser um número finito.');
    }
    if (valor < 0) {
      throw new RangeError('O valor de "espessura" de ser um número não negativo.');
    }
    this.#espessura = valor;
  }

  get espessura() {
    return this.#espessura;
  }

  set contorno(valor) {
    if (typeof valor !== 'string' && typeof valor !== 'CanvasPattern') {
      throw new TypeError('O valor de "preenchimento" deve ser uma "string" ou um objecto do tipo "CanvasPattern".');
    }
    this.#contorno = valor;
  }

  get contorno() {
    return this.#contorno;
  }

  /**
   * Largura do <em>texto</em>, definida pelo número de <em>pixels</em> ocupados horizontalmente.
   * @type {number}
   * @readonly
   */
  get largura() {
    let tela = document.createElement('canvas');
    let contexto = tela.getContext('2d');
    contexto.font = this.#tamanho + 'px ' + this.#fonte;
    return contexto.measureText(this.#texto).width;
  }

  /**
   * Altura do <em>texto</em>, definida pelo tamanho da fonte (em <em>pixels</em>).
   * @type {number}
   * @readonly
   */
  get altura() {
    return this.#tamanho;
  }

  /**
   * Desenha uma ou mais linhas de <em>texto</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo de um <em>rectângulo imaginário</em> que contenha o <em>texto</em>. Opcionalmente, também recebe como argumento um <em>delta tempo</em>, de modo a garantir uma uniformização das animações e dos movimentos entre diferentes dispositivos. Se este argumento for usado, as <em>variações</em> das coordenadas devem ser expressas em função de um segundo &mdash; i.e., <em>pixels</em> por segundo; caso contrário, assume-se que a <em>variação</em> é definida em função de cada iteração &mdash; i.e., <em>pixels</em> por chamada ao método <code>desenha()</code>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhado o <em>texto</em>
   * @param {number} [deltaTempo=1] Variação temporal entre chamadas (para sincronização de animações); se não for fornecido, assume-se o valor <code>1</code>.
   * @throws {TypeError} Se <code>tela</code> não for uma instância de <code>Tela</code>.
   * @throws {TypeError} Se <code>deltaTempo</code> não for um número finito e positivo.
   * @throws {RangeError} Se o parâmetro <code>deltaTempo</code> for um número negativo.
   */
  desenha(tela, deltaTempo = 1) {
    if (!(tela instanceof Tela)) {
      throw new TypeError('O parâmetro "tela" deve ser uma instância de "Tela".');
    }
    if (typeof deltaTempo !== 'number' || !Number.isFinite(deltaTempo)) {
      throw new TypeError('O parâmetro "deltaTempo" deve ser um número finito.');
    }
    if (deltaTempo < 0) {
      throw new RangeError('O parâmetro "deltaTempo" não pode ser um número negativo.');
    }
    super.desenha(tela, () => {
      const contexto = tela.contexto;
      contexto.fillStyle = this.#preenchimento;
      contexto.strokeStyle = this.#contorno;
      contexto.lineWidth = this.espessura;
      contexto.textBaseline = 'top';
      contexto.font = this.#tamanho + 'px ' + this.#fonte;
      let linhas = this.#texto.split('\n');
      for (let i = 0; i < linhas.length; i++) {
        contexto.fillText(linhas[i], Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5 + i * this.#tamanho));
        if (this.espessura > 0) {
          contexto.strokeText(linhas[i], Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5 + i * this.#tamanho));
        }
      }
    }, deltaTempo);
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>Imagem</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>imagens</em>. Num nível básico, uma <em>imagem</em> é definida por um <em>ponto</em>, correspondente, regra geral, ao seu canto superior esquerdo e pela própria imagem.
 * @property {number} x Abscissa para posicionar a <em>imagem</em> no <code>canvas</code>.
 * @property {number} y Ordenada para posicionar a <em>imagem</em> no <code>canvas</code>.
 * @property {HTMLImageElement} imagem Elemento HTML que contém a <em>imagem</em>
 * @property {number} deltaX=0 Variação horizontal da posição da <em>imagem</em>, após cada iteração de desenho.
 * @property {number} deltaY=0 Variação vertical da posição da <em>imagem</em>, após cada iteração de desenho.
 * @property {number} distX=0 Distância horizontal da <em>imagem</em> até um dado ponto.
 * @property {number} distY=0 Distância vertical da <em>imagem</em> até um dado ponto.
 * @property {number} gravidade=0 Força que, quando usada em conjunto com um <em>ângulo</em>, pode ser utilizada para definir a variação vertical da <em>imagem</em>, actuando como a <em>gravidade</em>.
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com um <em>ângulo (de rotação)</em>, pode ser utilizada para definir a variação horizontal e vertical da <em>imagem</em>.
 * @property {number} atrito=0.0 Força que reduz o movimento (sejam os <em>deltas</em> ou a <em>velocidade</em>) da <em>imagem</em>. O valor deve estar compreendido entre <code>0</code> (sem atrito) e <code>1</code> (movimento totalmente travado). Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {number} anguloRotacao=0 Ângulo de rotação da <em>imagem</em> quando desenhado no <code>canvas</code>, usado também em conjunto com a <em>velocidade</em>, compreendido entre <code>0</code> e <code>360</code> &mdash; independentemente do valor atribuído, é sempre usado o <em>resto</em> da sua divisão por <code>360</code>. A rotação é feita tendo como referência o centro da <em>imagem</em>.
 * @property {number} deltaRotacao=0 Variação do ângulo de rotação da <em>imagem</em>, após cada iteração de desenho.
 * @property {number} anguloGravidade=0 Ângulo cujo co-seno afecta a aplicação do sentido da <em>gravidade</em> à <em>imagem</em>, compreendido entre <code>0</code> e <code>180</code>. Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0</code>, se inferior, ou para <code>360</code>, se superior.
 * @property {number} deltaGravidade=0 Variação do ângulo aplicado à <em>gravidade</em>, após cada iteração de desenho.
 * @property {number} opacidade=1.0 Valor da opacidade da <em>imagem</em> &mdash; pode variar entre <code>0.0</code> (completamente transparente) e <code>1.0</code> (completamente opaco). Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {boolean} activo=true Indicação de que a <em>imagem</em> deve testar colisões, quando chamado o método <code>colide()</code>. Será útil quando os <em>texto</em> são processados em bloco, por exemplo, num <em>array</em>, e nem todos devem ser testados para colisões, ou mesmo para quando há momentos em que a <em>imagem</em> deve reagir a colisões e noutros não.
 * @property {boolean} visivel=true Indicação de que a <em>imagem</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha()</code>.
 * @property {boolean} actualiza=true Indicação de que a <em>imagem</em> deve ter o seu posicionamento actualizado após o seu <em>desenho</em> na <em>tela</em>.
 */
class Imagem extends Grafico {
  #imagem;

  /**
   * Construtor para criação de novos objectos do tipo <code>Imagem</code>.
   * @param {number} x Abscissa para posicionar a <em>imagem</em> no <code>canvas</code>.
   * @param {number} y Ordenada para posicionar a <em>imagem</em> no <code>canvas</code>.
   * @param {HTMLImageElement} imagem Elemento HTML que contém a <em>imagem</em>.
   * @throws {TypeError} Se <code>x</code> ou <code>y</code> não forem números finitos.
   * @throws {TypeError} Se <code>imagem</code> não for um objecto do tipo <code>HTMLImageElement</code>
   */
  constructor(x, y, imagem, largura, altura) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError('O parâmetro "x" deve ser um número finito.');
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      throw new TypeError('O parâmetro "y" deve ser um número finito.');
    }
    if (!(imagem instanceof HTMLImageElement)) {
      throw new TypeError('O parâmetro "imagem" deve ser um objecto do tipo "HTMLImageElement".');
    }
    super(x, y);
    this.#imagem = imagem;
  }

  set imagem(valor) {
    if (!(valor instanceof HTMLImageElement)) {
      throw new TypeError('O valor "imagem" eve ser um objecto do tipo "HTMLImageElement".');
    }
    this.#imagem = valor;
  }

  get imagem() {
    return this.#imagem;
  }

  /**
   * Largura da <em>imagem</em>, em <em>pixels</em>.
   * @type {number}
   * @readonly
   */
  get largura() {
    return this.#imagem.width;
  }

  /**
   * Altura da <em>imagem</em>, em <em>pixels</em>.
   * @type {number}
   * @readonly
   */
  get altura() {
    return this.#imagem.height;
  }

  /**
   * Desenha uma <em>imagem</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo dessa <em>imagem</em>. Opcionalmente, também recebe como argumento um <em>delta tempo</em>, de modo a garantir uma uniformização das animações e dos movimentos entre diferentes dispositivos. Se este argumento for usado, as <em>variações</em> das coordenadas devem ser expressas em função de um segundo &mdash; i.e., <em>pixels</em> por segundo; caso contrário, assume-se que a <em>variação</em> é definida em função de cada iteração &mdash; i.e., <em>pixels</em> por chamada ao método <code>desenha()</code>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhada a <em>imagem</em>
   * @param {number} [deltaTempo=1] Variação temporal entre chamadas (para sincronização de animações); se não for fornecido, assume-se o valor <code>1</code>.
   * @throws {TypeError} Se <code>tela</code> não for uma instância de <code>Tela</code>.
   * @throws {TypeError} Se <code>deltaTempo</code> não for um número finito e positivo.
   * @throws {RangeError} Se o parâmetro <code>deltaTempo</code> for um número negativo.
   */
  desenha(tela, deltaTempo = 1) {
    if (!(tela instanceof Tela)) {
      throw new TypeError('O parâmetro "tela" deve ser uma instância de "Tela".');
    }
    if (typeof deltaTempo !== 'number' || !Number.isFinite(deltaTempo)) {
      throw new TypeError('O parâmetro "deltaTempo" deve ser um número finito.');
    }
    if (deltaTempo < 0) {
      throw new RangeError('O parâmetro "deltaTempo" não pode ser um número negativo.');
    }
    super.desenha(tela, () => {
      const contexto = tela.contexto;
      contexto.drawImage(this.#imagem, Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5), this.largura, this.altura);
    }, deltaTempo);
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>ImagemAnimada</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>imagens animadas</em> (ou <em>sprites</em>). Num nível básico, uma <em>imagem animada</em> é definida por um <em>ponto</em>, correspondente, regra geral, ao seu canto superior esquerdo, com os vários fotogramas a serem desenhados nessa posição, assumindo-se dimensões idênticas para cada um deles. Assim, os <em>sprites</em> utilizados podem ter uma sequência horizontal (tira) ou várias, desde que os fotogramas tenham as mesmas dimensões.
 * @property {number} x Abscissa para posicionar o <em>sprite</em> no <code>canvas</code>.
 * @property {number} y Ordenada para posicionar o <em>sprite</em> no <code>canvas</code>.
 * @property {HTMLImageElement} imagem Elemento HTML que contém o <em>sprite</em>
 * @property {number} fotogramas Número de fotogramas (<em>frames</em>) do <em>sprite</em>
 * @property {number} iteracoes Número de iterações &mdash; na prática, o número de <em>frames</em> ou de chamadas ao método <code>desenha()</code> &mdash; antes de se passar ao fotograma seguinte do <em>sprite</em>
 * @property {number} animado=true Indicação de que o <em>sprite</em> deve ser desenhado <em>animado</em> no <code>canvas</code>, quando chamado o método <code>desenha()</code>; caso contrário, ficará parado num dos fotogramas
 * @property {number} fotograma=0 Índice do fotograma a ser mostrado num dado momento; varia, de acordo como o número de <em>iterações</em> definido, entre zero (<code>0</code>) e o número de fotogramas existentes (<em>exclusive</em>)
 * @property {number} tira=0 Índice da tira de fotogramas a ser mostrada num dado momento; varia entre zero (<code>0</code>) e o número de tiras existentes (<em>exclusive</em>).
 * @property {number} tiras=1 Número de tiras existentes no <em>spritesheet</em>.
 * @property {number} deltaX=0 Variação horizontal da posição da <em>imagem animada</em>, após cada iteração de desenho.
 * @property {number} deltaY=0 Variação vertical da posição da <em>imagem animada</em>, após cada iteração de desenho.
 * @property {number} distX=0 Distância horizontal da <em>imagem animada</em> até um dado ponto.
 * @property {number} distY=0 Distância vertical da <em>imagem animada</em> até um dado ponto.
 * @property {number} gravidade=0 Força que, quando usada em conjunto com um <em>ângulo</em>, pode ser utilizada para definir a variação vertical da <em>imagem animada</em>, actuando como a <em>gravidade</em>.
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com um <em>ângulo (de rotação)</em>, pode ser utilizada para definir a variação horizontal e vertical da <em>imagem animada</em>.
 * @property {number} atrito=0.0 Força que reduz o movimento (sejam os <em>deltas</em> ou a <em>velocidade</em>) da <em>imagem animada</em>. O valor deve estar compreendido entre <code>0</code> (sem atrito) e <code>1</code> (movimento totalmente travado). Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {number} anguloRotacao=0 Ângulo de rotação da <em>imagem animada</em> quando desenhado no <code>canvas</code>, usado também em conjunto com a <em>velocidade</em>, compreendido entre <code>0</code> e <code>360</code> &mdash; independentemente do valor atribuído, é sempre usado o <em>resto</em> da sua divisão por <code>360</code>. A rotação é feita tendo como referência o centro da <em>imagem animada</em>.
 * @property {number} deltaRotacao=0 Variação do ângulo de rotação da <em>imagem animada</em>, após cada iteração de desenho.
 * @property {number} anguloGravidade=0 Ângulo cujo co-seno afecta a aplicação do sentido da <em>gravidade</em> à <em>imagem animada</em>, compreendido entre <code>0</code> e <code>180</code>. Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0</code>, se inferior, ou para <code>360</code>, se superior.
 * @property {number} deltaGravidade=0 Variação do ângulo aplicado à <em>gravidade</em>, após cada iteração de desenho.
 * @property {number} opacidade=1.0 Valor da opacidade da <em>imagem animada</em> &mdash; pode variar entre <code>0.0</code> (completamente transparente) e <code>1.0</code> (completamente opaco). Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {boolean} activo=true Indicação de que a <em>imagem animada</em> deve testar colisões, quando chamado o método <code>colide()</code>. Será útil quando os <em>texto</em> são processados em bloco, por exemplo, num <em>array</em>, e nem todos devem ser testados para colisões, ou mesmo para quando há momentos em que a <em>imagem animada</em> deve reagir a colisões e noutros não.
 * @property {boolean} visivel=true Indicação de que a <em>imagem animada</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha()</code>.
 * @property {boolean} actualiza=true Indicação de que a <em>imagem animada</em> deve ter o seu posicionamento actualizado após o seu <em>desenho</em> na <em>tela</em>.
 */
class ImagemAnimada extends Grafico {
  #tempoAcumulado;
  #fotogramas;
  #fotograma;
  #animado;
  #imagem;
  #tiras;
  #tira;
  #fps;

  /**
   * Construtor para criação de novos objectos do tipo <code>ImagemAnimada</code>
   * @param {number} x Abscissa para posicionar o <em>sprite</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>sprite</em> no <code>canvas</code>
   * @param {HTMLImageElement} imagem Elemento HTML que contém o <em>spritesheet</em>
   * @param {number} fotogramas Número de fotogramas (<em>frames</em>) do <em>sprite</em>
   * @param {number} fotograma Fotograma (<em>frame</em>) actual do <em>sprite</em>
   * @param {number} fps Número de fotogramas por segundo (fps), para definir a transição entre os fotogramas do <em>sprite</em>.
   * @param {number} [tiras=1] Número de tiras existentes no <em>spritesheet</em>.
   * @param {number} tira Tira actual do <em>spritesheet</em>.
   * @param {boolean} animado Indicação de que o <em>sprite</em> se deve encontrar em movimento.
   * @throws {TypeError} Se o parâmetro x não for um número finito.
   * @throws {TypeError} Se o parâmetro y não for um número finito.
   * @throws {TypeError} Se o parâmetro imagem não for um objeto do tipo <code>HTMLImageElement</code>.
   * @throws {TypeError} Se o parâmetro fotogramas não for um número finito.
   * @throws {RangeError} Se o parâmetro fotogramas} não for um número positivo.
   * @throws {TypeError} Se o parâmetro fps não for um número finito.
   * @throws {RangeError} Se o parâmetro fps não for um número positivo.
   * @throws {TypeError} Se o parâmetro tiras não for um número finito.
   * @throws {RangeError} Se o parâmetro tiras não for um número positivo.
   */
  constructor(x, y, imagem, fotogramas, fps, tiras = 1) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError('O parâmetro "x" deve ser um número finito.');
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      throw new TypeError('O parâmetro "y" deve ser um número finito.');
    }
    if (!(typeof imagem === 'object' && imagem instanceof HTMLImageElement)) {
      throw new TypeError('O parâmetro "imagem" deve ser um objecto do tipo "HTMLImageElement".');
    }
    if (typeof fotogramas !== 'number' || !Number.isFinite(fotogramas)) {
      throw new TypeError('O parâmetro "fotogramas" deve ser um número finito.');
    }
    if (fotogramas <= 0) {
      throw new RangeError('O parâmetro "fotogramas" deve ser um número positivo.');
    }
    if (typeof fps !== 'number' || !Number.isFinite(fps)) {
      throw new TypeError('O parâmetro "fps" deve ser um número finito.');
    }
    if (fps <= 0) {
      throw new RangeError('O parâmetro "fps" deve ser um número positivo.');
    }
    if (typeof tiras !== 'number' || !Number.isFinite(tiras)) {
      throw new TypeError('O parâmetro "tiras" deve ser um número finito.');
    }
    if (tiras <= 0) {
      throw new RangeError('O parâmetro "tiras" deve ser um número positivo.');
    }
    super(x, y);
    this.#imagem = imagem;
    this.#fotogramas = fotogramas;
    this.#fps = fps;
    this.#tiras = tiras;
    this.#fotograma = 0;
    this.#tira = 0;
    this.#animado = true;
    this.#tempoAcumulado = 0;
  }

  set imagem(valor) {
    if (valor == null || !(valor instanceof HTMLImageElement)) {
      throw new TypeError('O valor "imagem" deve ser um objecto do tipo "HTMLImageElement".');
    }
    this.#imagem = valor;
  }

  get imagem() {
    return this.#imagem;
  }

  set animado(valor) {
    if (typeof valor !== 'boolean') {
      throw new TypeError('O valor de "animado" deve ser booleano ("true" ou "false").');
    }
    this.#animado = valor;
  }

  get animado() {
    return this.#animado;
  }

  set fotogramas(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "fotogramas" deve ser um número finito.');
    }
    if (valor <= 0) {
      throw new RangeError('O valor de "fotogramas" deve ser um número positivo.');
    }
    this.#fotogramas = valor;
  }

  get fotogramas() {
    return this.#fotogramas;
  }

  set fps(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "fps" deve ser um número finito.');
    }
    if (valor <= 0) {
      throw new RangeError('O valor de "fps" deve ser um número positivo.');
    }
    this.#fps = valor;
  }

  get fps() {
    return this.#fps;
  }

  set tiras(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "tiras" deve ser um número finito.');
    }
    if (valor <= 0) {
      throw new RangeError('O valor de "tiras" deve ser um número positivo.');
    }
    this.#tiras = valor;
  }
  get tiras() {
    return this.#tiras;
  }

  set fotograma(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "fotograma" deve ser um número finito.');
    }
    if (valor < 0 || valor >= this.fotogramas) {
      throw new RangeError('O valor de "fotograma" deve ser um número entre 0 e fotogramas-1.');
    }
    this.#fotograma = valor;
  }

  get fotograma() {
    return this.#fotograma;
  }

  set tira(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "tira" deve ser um número positivo.');
    }
    if (valor < 0 || valor >= this.tiras) {
      throw new RangeError('O valor de "tira" deve ser um número entre 0 e tiras-1.');
    }
    this.#tira = valor;
  }

  get tira() {
    return this.#tira;
  }

  /**
   * Altura da <em>imagem animada</em>, considerando o número de tiras presentes e assumindo dimensões idênticas das mesmas
   * @type {number}
   * @readonly
   */
  get largura() {
    return this.#imagem.width / this.#fotogramas;
  }

  /**
   * Largura da <em>imagem animada</em>, considerando o número de fotogramas presentes e assumindo dimensões idênticas dos mesmos
   * @type {number}
   * @readonly
   */
  get altura() {
    return this.#imagem.height / this.#tiras;
  }

  /**
   * Desenha uma <em>imagem animada</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo dessa <em>imagem animada</em>, no caso de uma única tira. Havendo mais que uma tira, usará o <em>ponto</em> correspondente ao canto superior esquerdo dessa tira. Opcionalmente, também recebe como argumento um <em>delta tempo</em>, de modo a garantir uma uniformização das animações e dos movimentos entre diferentes dispositivos. Se este argumento for usado, as <em>variações</em> das coordenadas devem ser expressas em função de um segundo &mdash; i.e., <em>pixels</em> por segundo; caso contrário, assume-se que a <em>variação</em> é definida em função de cada iteração &mdash; i.e., <em>pixels</em> por chamada ao método <code>desenha()</code>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhada a <em>imagem animada</em>
   * @param {number} [deltaTempo=1] Variação temporal entre chamadas (para sincronização de animações); se não for fornecido, assume-se o valor <code>1</code>.
   * @throws {TypeError} Se <code>tela</code> não for uma instância de <code>Tela</code>.
   * @throws {TypeError} Se <code>deltaTempo</code> não for um número finito e positivo.
   * @throws {RangeError} Se o parâmetro <code>deltaTempo</code> for um número negativo.
   */
  desenha(tela, deltaTempo = 1) {
    if (!(tela instanceof Tela)) {
      throw new TypeError('O parâmetro "tela" deve ser uma instância de "Tela".');
    }
    if (typeof deltaTempo !== 'number' || !Number.isFinite(deltaTempo)) {
      throw new TypeError('O parâmetro "deltaTempo" deve ser um número finito.');
    }
    if (deltaTempo < 0) {
      throw new RangeError('O parâmetro "deltaTempo" não pode ser um número negativo.');
    }
    super.desenha(tela, () => {
      const contexto = tela.contexto;
      const intervaloTempo = 1 / this.#fps;
      const maxAvancos = this.#fotogramas - this.#fotograma;
      contexto.drawImage(this.#imagem, this.#fotograma * this.largura, this.#tira * this.altura, this.largura, this.altura, Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5), this.largura, this.altura);
      if ((this.#animado) || (this.#fotograma > 0)) {
        this.#tempoAcumulado += deltaTempo;
        let avancos = 0;
        if (this.#tempoAcumulado >= intervaloTempo) {
          this.#fotograma++;
          if (this.#fotograma >= this.fotogramas) {
            this.#fotograma = 0;
          }
          this.#tempoAcumulado -= intervaloTempo;
          avancos++;
        }
        if (avancos >= maxAvancos) {
          this.#tempoAcumulado = 0;
        }
      }
    }, deltaTempo);
  }
}

//

/**
 * @class
 * @extends Grafico
 * @classdesc A classe <code>ImagemFilme</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>filmes</em> (<em>vídeos</em>) de forma embutida no <code>canvas</code>. Num nível básico, uma <em>imagem de filme</em> é definida por um <em>ponto</em>, correspondente, regra geral, ao seu canto superior esquerdo e pela própria imagem &mdash; i.e., o filme.
 * @property {number} x Abscissa para posicionar o <em>filme</em> no <code>canvas</code>.
 * @property {number} y Ordenada para posicionar o <em>filme</em> no <code>canvas</code>.
 * @property {HTMLVideoElement} filme Objecto de <em>vídeo</em> a ser desenhado no <code>canvas</code>
 * @property {number} deltaX=0 Variação horizontal da posição do <em>filme</em>, após cada iteração de desenho.
 * @property {number} deltaY=0 Variação vertical da posição do <em>filme</em>, após cada iteração de desenho.
 * @property {number} distX=0 Distância horizontal do <em>filme</em> até um dado ponto.
 * @property {number} distY=0 Distância vertical do <em>filme</em> até um dado ponto.
 * @property {number} gravidade=0 Força que, quando usada em conjunto com um <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>filme</em>, actuando como a <em>gravidade</em>.
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com um <em>ângulo (de rotação)</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>filme</em>.
 * @property {number} atrito=0.0 Força que reduz o movimento (sejam os <em>deltas</em> ou a <em>velocidade</em>) do <em>filme</em>. O valor deve estar compreendido entre <code>0</code> (sem atrito) e <code>1</code> (movimento totalmente travado). Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {number} anguloRotacao=0 Ângulo de rotação do <em>filme</em> quando desenhado no <code>canvas</code>, usado também em conjunto com a <em>velocidade</em>, compreendido entre <code>0</code> e <code>360</code> &mdash; independentemente do valor atribuído, é sempre usado o <em>resto</em> da sua divisão por <code>360</code>. A rotação é feita tendo como referência o centro do <em>filme</em>.
 * @property {number} deltaRotacao=0 Variação do ângulo de rotação do <em>filme</em>, após cada iteração de desenho.
 * @property {number} anguloGravidade=0 Ângulo cujo co-seno afecta a aplicação do sentido da <em>gravidade</em> ao <em>filme</em>, compreendido entre <code>0</code> e <code>180</code>. Se o valor indicado estiver fora deste intervalo, será corrigido para <code>0</code>, se inferior, ou para <code>360</code>, se superior.
 * @property {number} deltaGravidade=0 Variação do ângulo aplicado à <em>gravidade</em>, após cada iteração de desenho.
 * @property {number} opacidade=1.0 Valor da opacidade do <em>filme</em> &mdash; pode variar entre <code>0.0</code> (completamente transparente) e <code>1.0</code> (completamente opaco). Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code>, se inferior, ou para <code>1.0</code>, se superior.
 * @property {boolean} activo=true Indicação de que o <em>filme</em> deve testar colisões, quando chamado o método <code>colide()</code>. Será útil quando os <em>filme</em> são processados em bloco, por exemplo, num <em>array</em>, e nem todos devem ser testados para colisões, ou mesmo para quando há momentos em que o <em>filme</em> deve reagir a colisões e noutros não.
 * @property {boolean} visivel=true Indicação de que o <em>filme</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha()</code>.
 * @property {boolean} actualiza=true Indicação de que o <em>filme</em> deve ter o seu posicionamento actualizado após o seu <em>desenho</em> na <em>tela</em>.
 */
class ImagemFilme extends Grafico {
  #filme;

  /**
   * Construtor para criação de novos objectos do tipo <code>ImagemFilme</code>
   * @param {number} x Abscissa para posicionar o <em>filme</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>filme</em> no <code>canvas</code>
   * @param {Filme} filme Objecto de <em>vídeo</em> a ser desenhado no <code>canvas</code>
   * @throws {TypeError} Se <code>filme</code> não for uma instância de <code>Filme</code>.
   */
  constructor(x, y, filme) {
    super(x, y);
    if (!(filme instanceof Filme)) {
      throw new TypeError('O argumento "filme" deve ser uma instância de "Filme".');
    }
    this.#filme = filme;
  }

  set filme(valor) {
    if (!(valor instanceof Filme)) {
      throw new TypeError('O valor de "filme" deve ser uma instância de "Filme".');
    }
    this.#filme = novoFilme;
  }

  get filme() {
    return this.#filme;
  }

  /**
   * Largura do <em>filme</em> (<em>vídeo</em>).
   * @type {number}
   */
  get largura() {
    return this.#filme.largura;
  }

  /**
   * Altura do <em>filme</em> (<em>vídeo</em>).
   * @type {number}
   */
  get altura() {
    return this.#filme.altura;
  }

  /**
   * Verifica se um dado <em>ponto</em> está contido área do <em>invólucro</em> rectangular que envolve este <em>gráfico</em>. Tal acontece quando esse <em>ponto</em> está compreendido entre <em>x</em> e <em>x mais a largura</em> e entre <em>y</em> e <em>y mais altura</em> desse <em>invólucro</em>.
   * @param {number} x Abscissa do ponto a testar se está contido neste <em>gráfico</em>
   * @param {number} y Ordenada do ponto a testar se está contido neste <em>gráfico</em>
   * @returns {boolean} Se o ponto estiver contido neste <em>gráfico</em>, <code>true</code>; senão, <code>false</code>
   * @throws {TypeError} Se <code>x</code> ou <code>y</code> não forem números finitos.
   */
  contemPonto(x, y) {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError('O parâmetro "x" deve ser um número finito.');
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      throw new TypeError('O parâmetro "y" deve ser um número finito.');
    }
    if (this.anguloRotacao !== 0) {
      return super.contemPonto(x, y);
    }
    else {
      return (x > this.x && x <= this.x + this.largura && y > this.y && y <= this.y + this.altura);
    }
  }

  /**
   * Desenha um <code>video</code> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo desse <em>vídeo</em>. Note-se que o <em>vídeo</em> só é efetivamente reproduzido no <code>canvas</code> se o elemento <code>video</code> associado por via da propriedade <code>filme</code> estiver também a ser reproduzido. Opcionalmente, também recebe como argumento um <em>delta tempo</em>, de modo a garantir uma uniformização das animações e dos movimentos entre diferentes dispositivos. Se este argumento for usado, as <em>variações</em> das coordenadas devem ser expressas em função de um segundo &mdash; i.e., <em>pixels</em> por segundo; caso contrário, assume-se que a <em>variação</em> é definida em função de cada iteração &mdash; i.e., <em>pixels</em> por chamada ao método <code>desenha()</code>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhado o <em>vídeo</em>
   * @param {number} [deltaTempo=1] Variação temporal entre chamadas (para sincronização de animações); se não for fornecido, assume-se o valor <code>1</code>.
   * @throws {TypeError} Se <code>tela</code> não for uma instância de <code>Tela</code>.
   * @throws {TypeError} Se <code>deltaTempo</code> não for um número finito.
   * @throws {RangeError} Se o parâmetro <code>deltaTempo</code> for um número negativo.
   */
  desenha(tela, deltaTempo = 1) {
    if (!(tela instanceof Tela)) {
      throw new TypeError('O parâmetro "tela" deve ser uma instância de "Tela".');
    }
    if (typeof deltaTempo !== 'number' || !Number.isFinite(deltaTempo)) {
      throw new TypeError('O parâmetro "deltaTempo" deve ser um número finito.');
    }
    if (deltaTempo < 0) {
      throw new RangeError('O parâmetro "deltaTempo" não pode ser um número negativo.');
    }
    super.desenha(tela, () => {
      const contexto = tela.contexto;
      contexto.drawImage(this.#filme.media, Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5));
    }, deltaTempo);
  }
}

//

/**
 * @class
 * @classdesc A classe <code>Padrao</code> é utilizada para representar a criação de <em>padrões</em> gráficos, que podem ser posteriormente aplicados como preenchimento ou contorno de <em>gráficos</em> em elementos <code>canvas</code>.
 * @property {HTMLImageElement} imagem Elemento HTML que contém a <em>imagem</em> utilizada no <em>padrão</em>, ou <code>null</code> se o padrão foi criado directamente a partir de um <code>CanvasPattern</code>.
 * @property {CanvasPattern} padrao O <em>padrão</em> propriamente dito, pronto a ser utilizado para preenchimento e contorno.
 * @property {string} repeticao Tipo de repetição a aplicar na criação do <em>padrão</em> (<code>repeat</code> | <code>repeat-x</code> | <code>repeat-y</code> | <code>no-repeat</code>).
 */
class PadraoImagem {
  #repeticao;
  #imagem;
  #padrao;

  /**
   * Construtor para criação de novos objectos do tipo <code>Padrao</code> com base em imagens e um tipo de repetição especificado.
   * @param {HTMLImageElement} imagem Elemento de imagem (<code>HTMLImageElement</code>) a usar no <em>padrão</em>.
   * @param {string} [repeticao='repeat'] Tipo de repetição a aplicar na criação do <em>padrão</em> (<code>repeat</code> | <code>repeat-x</code> | <code>repeat-y</code> | <code>no-repeat</code>).
   * @throws {TypeError} Se a imagem for nula, não estiver definida ou não for do tipo correcto.
   * @throws {TypeError} Se o tipo de repetição indicado não for válido.
   */
  constructor(imagem, repeticao = 'repeat') {
    if (!(imagem instanceof HTMLImageElement)) {
      throw new TypeError('O parâmetro "imagem" deve ser um objecto do tipo "HTMLImageElement".');
    }
    if (!PadraoImagem.REPETICOES.includes(repeticao)) {
      throw new TypeError('O parâmetro "repeticao" não tem um valor válido.');
    }
    this.#repeticao = repeticao;
    this.#imagem = imagem;
    const tela = document.createElement('canvas');
    const contexto = tela.getContext('2d');
    this.#padrao = contexto.createPattern(this.#imagem, this.#repeticao);
  }

  set imagem(valor) {
    if (!(valor instanceof HTMLImageElement)) {
      throw new TypeError('O valor de "imagem" não é um elemento do tipo "HTMLImageElement".');
    }
    this.#imagem = valor;
    let tela = document.createElement('canvas');
    let contexto = tela.getContext('2d');
    this.#padrao = contexto.createPattern(this.#imagem, this.#repeticao);
  }

  get imagem() {
    return this.#imagem;
  }

  set repeticao(valor) {
    if (!PadraoImagem.REPETICOES.includes(valor)) {
      throw new TypeError('O valor de "repeticao" não é válido.');
    }
    this.#repeticao = valor;
    let tela = document.createElement('canvas');
    let contexto = tela.getContext('2d');
    this.#padrao = contexto.createPattern(this.#imagem, this.#repeticao);
  }

  get repeticao() {
    return this.#repeticao;
  }

  /**
   * O <em>padrão</em> propriamente dito, a ser utilizado para preenchimento e contorno de <em>gráficos</em>.
   * @type {CanvasPattern}
   * @readonly
   */
  get padrao() {
    return this.#padrao;
  }

  /**
   * Lista dos modos de repetição válidos para padrões de preenchimento ou contorno de <em>gráficos</em> no <em>canvas</em>.
   * @type {string[]}
   * @static
   * @const
   */
  static REPETICOES = ['repeat', 'repeat-x', 'repeat-y', 'no-repeat'];
}

//

/**
 * @class
 * @classdesc A classe <code>Tela</code> serve essencialmente como um <em>invólucro</em> para elementos do tipo <code>canvas</code>. Permite gerir facilmente o desenho, a ordem e a interacção de <em>gráficos</em> sobre o <em>canvas</em>, bem como o tratamento de eventos de rato e teclado.
 * @property {HTMLCanvasElement} canvas O <em>elemento</em> HTML do tipo <code>canvas</code> a ser representado.
 * @property {CanvasRenderingContext2D} contexto O contexto <strong>2D</strong> do <em>canvas</em> associado.
 * @property {number} largura A largura actual da <em>tela</em> (em <em>pixels</em>).
 * @property {number} altura A altura actual da <em>tela</em> (em <em>pixels</em>).
 * @property {number} ratoX Coordenada <em>x</em> actual do rato na <em>tela</em>.
 * @property {number} ratoY Coordenada <em>y</em> actual do rato na <em>tela</em>.
 * @property {string|undefined} tecla Código da tecla actualmente pressionada, se existir.
 * @property {string} cursor Tipo de cursor actualmente definido para o <em>canvas</em> (e.g.: <code>pointer</code>, <code>crosshair</code>, <code>default</code>, etc.).
 */
class Tela {
  #ratoX;
  #ratoY;
  #tecla;
  #canvas;
  #contexto;
  #graficos;
  #tempoAnterior;

  /**
   * Construtor para criação de novos objectos do tipo <code>Tela</code>. Inicializa uma nova instância associada a um elemento HTML do tipo <code>canvas</code>, preparando todos os campos internos necessários ao funcionamento da <em>tela</em> e associando os <em>eventos</em> de rato e teclado relevantes.
   * @param {HTMLCanvasElement} canvas O <em>elemento</em> do tipo <code>HTMLCanvasElement</code> a ser representado.
   * @throws {TypeError} Se o parâmetro <code>canvas</code> for nulo, não estiver definido ou não for um elemento <code>canvas</code> válido.
   */
  constructor(canvas) {
    if (!(canvas instanceof HTMLCanvasElement)) {
      throw new TypeError('O parâmetro "canvas" deve ser um objecto do tipo "HTMLCanvasElement".');
    }
    this.#canvas = canvas;
    this.#ratoX = 0;
    this.#ratoY = 0;
    this.#graficos = new Array();
    this.#tecla = undefined;
    this.#tempoAnterior = undefined;
    this.#contexto = this.#canvas.getContext('2d');
    const tiposEventosRato = ['click', 'dblclick', 'contextmenu', 'mousedown', 'mousemove', 'mouseup', 'mouseenter', 'mouseleave'];
    for (const tipoEventoRato of tiposEventosRato) {
      this.#canvas.addEventListener(tipoEventoRato, (evento) => this.#processaRato(evento));
    }
    const tiposEventosTeclado = ['keydown', 'keyup'];
    for (const tipoEventoTeclado of tiposEventosTeclado) {
      window.addEventListener(tipoEventoTeclado, (evento) => this.#processaTeclado(evento));
    }
  }

  #processaRato(evento) {
    this.ratoX = evento.offsetX;
    this.ratoY = evento.offsetY;
    switch (evento.type) {
      case 'click':
        this.processaClique(evento);
        break;
      case 'dblclick':
        this.processaDuploClique(evento);
        break;
      case 'contextmenu':
        this.processaMenuContexto(evento);
        break;
      case 'mousedown':
        this.processaRatoDescido(evento);
        break;
      case 'mousemove':
        this.processaRatoMovido(evento);
        break;
      case 'mouseup':
        this.processaRatoSubido(evento);
        break;
      case 'mouseenter':
        this.processaRatoDentro(evento);
        break;
      case 'mouseleave':
        this.processaRatoFora(evento);
        break;
      default:
        break;
    }
  }

  #processaTeclado(evento) {
    this.#tecla = evento.code;
    switch (evento.type) {
      case 'keydown':
        this.processaTeclaDescida(evento);
        break;
      case 'keyup':
        this.processaTeclaSubida(evento);
        break;
      default:
        break;
    }
    this.#tecla = undefined;
  }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>click</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento, podendo, se necessário, utilizar as propriedades <code>ratoX</code> e <code>ratoY</code>, associadas às coordenadas do <em>rato</em> na <em>tela</em>, já previamente obtidas e prontas a ser usadas.
   * @param {MouseEvent} evento Objecto correspondente ao evento <code>click</code>.
   */
  processaClique(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>dblclick</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento, podendo, se necessário, utilizar as propriedades <code>ratoX</code> e <code>ratoY</code>, associadas às coordenadas do <em>rato</em> na <em>tela</em>, já previamente obtidas e prontas a ser usadas.
   * @param {MouseEvent} evento Objecto correspondente ao evento <code>dblclick</code>.
   */
  processaDuploClique(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>contextmenu</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento, podendo, se necessário, utilizar as propriedades <code>ratoX</code> e <code>ratoY</code>, associadas às coordenadas do <em>rato</em> na <em>tela</em>, já previamente obtidas e prontas a ser usadas.
   * @param {MouseEvent} evento Objecto correspondente ao evento <code>contextmenu</code>.
   */
  processaMenuContexto(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>mousedown</code>, a ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento, utilizando, se necessário, as propriedades <code>ratoX</code> e <code>ratoY</code>, associadas às coordenadas do <em>rato</em> na <em>tela</em>, já previamente obtidas e prontas a ser usadas
   * @param {MouseEvent} evento Objecto correspondente ao evento <code>mousedown</code>.
   */
  processaRatoDescido(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>mousemove</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento, podendo, se necessário, utilizar as propriedades <code>ratoX</code> e <code>ratoY</code>, associadas às coordenadas do <em>rato</em> na <em>tela</em>, já previamente obtidas e prontas a ser usadas.
   * @param {MouseEvent} evento Objecto correspondente ao evento <code>mousemove</code>.
   */
  processaRatoMovido(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>mouseup</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento, podendo, se necessário, utilizar as propriedades <code>ratoX</code> e <code>ratoY</code>, associadas às coordenadas do <em>rato</em> na <em>tela</em>, já previamente obtidas e prontas a ser usadas.
   * @param {MouseEvent} evento Objecto correspondente ao evento <code>mouseup</code>.
   */
  processaRatoSubido(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>mouseenter</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento, podendo, se necessário, utilizar as propriedades <code>ratoX</code> e <code>ratoY</code>, associadas às coordenadas do <em>rato</em> na <em>tela</em>, já previamente obtidas e prontas a ser usadas.
   * @param {MouseEvent} evento Objecto correspondente ao evento <code>mouseenter</code>.
   */
  processaRatoDentro(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>mouseleave</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento, podendo, se necessário, utilizar as propriedades <code>ratoX</code> e <code>ratoY</code>, associadas às coordenadas do <em>rato</em> na <em>tela</em>, já previamente obtidas e prontas a ser usadas.
   * @param {MouseEvent} evento Objecto correspondente ao evento <code>mouseleave</code>.
   */
  processaRatoFora(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>keydown</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento, podendo, se necessário, utilizar a propriedade <code>codigoTecla</code>, associada à <em>tecla</em> seleccionada, já previamente obtida e pronta a ser usada.
   * @param {KeyboardEvent} evento Objecto correspondente ao evento <code>keydown</code>.
   */
  processaTeclaDescida(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>keyup</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento, podendo, se necessário, utilizar a propriedade <code>codigoTecla</code>, associada à <em>tecla</em> seleccionada, já previamente obtida e pronta a ser usada.
   * @param {KeyboardEvent} evento Objecto correspondente ao evento <code>keyup</code>.
   */
  processaTeclaSubida(evento) { }

  set canvas(valor) {
    if (!(valor instanceof HTMLCanvasElement)) {
      throw new TypeError('O valor de "canvas" deve ser um objecto do tipo "HTMLCanvasElement".');
    }
    this.#canvas = valor;
    this.#contexto = this.#canvas.getContext('2d');
  }

  get canvas() {
    return this.#canvas;
  }

  set cursor(valor) {
    if (!Tela.CURSORES.includes(valor)) {
      throw new TypeError('O valor de "cursor" não é válido.');
    }
    this.#canvas.style.cursor = valor;
  }

  get cursor() {
    return this.#canvas.style.cursor;
  }

  set largura(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "largura" deve ser um número finito.');
    }
    if (valor < 0) {
      throw new TypeError('O valor de "largura" deve ser um número não negativo.');
    }
    this.#canvas.width = valor;
  }

  get largura() {
    return this.#canvas.width;
  }

  set altura(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "altura" deve ser um número finito.');
    }
    if (valor < 0) {
      throw new TypeError('O valor de "altura" deve ser um número não negativo.');
    }
    this.#canvas.height = valor;
  }

  get altura() {
    return this.#canvas.height;
  }

  set ratoX(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "ratoX" deve ser um número finito.');
    }
    this.#ratoX = valor * this.escalaX;
  }

  get ratoX() {
    return this.#ratoX;
  }

  set ratoY(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "ratoY" deve ser um número finito.');
    }
    this.#ratoY = valor * this.escalaY;
  }

  get ratoY() {
    return this.#ratoY;
  }

  /**
  * Contexto <strong>2D</strong> da <em>tela</em>, para acesso aos métodos nativamente disponibilizados pelo elemento <code>canvas</code>, correspondente ao objecto <code>CanvasRenderingContext2D</code> associado ao <code>canvas</code> actualmente utilizado.
  * @type {CanvasRenderingContext2D}
  * @readonly
  */
  get contexto() {
    return this.#contexto;
  }

  /**
   * Código da tecla actualmente pressionada e <em>identificada</em> através das propriedades <code>processaTeclaDescida</code> e <code>processaTeclaSubida</code>. Devolve <code>undefined</code> quando nenhuma tecla se encontra pressionada ou identificada.
   * @type {string}
   * @readonly
   */
  get tecla() {
    return this.#tecla;
  }

  /**
   * Largura final da <em>tela</em>, considerando quaisquer alterações decorrentes da utilização de <em>CSS</em> para modificar a sua representação. Corresponde ao valor actual da propriedade <code>offsetWidth</code> do elemento <code>canvas</code>.
   * @type {number}
   * @readonly
   */
  get larguraFinal() {
    return this.#canvas.offsetWidth;
  }

  /**
   * Altura final da <em>tela</em>, considerando quaisquer alterações decorrentes da utilização de <em>CSS</em> para modificar a sua representação. Corresponde ao valor actual da propriedade <code>offsetHeight</code> do elemento <code>canvas</code>.
   * @type {number}
   * @readonly
   */
  get alturaFinal() {
    return this.#canvas.offsetHeight;
  }

  /**
   * Escala resultante do rácio entre a resolução do <code>canvas</code> e a área ocupada pelo mesmo, relativa à largura (<em>x</em>). Corresponde ao valor actual do quociente entre a largura do <em>canvas</em> e a largura final ocupada pelo mesmo. Se a largura final for igual a zero, devolve <code>1</code>.
   * @type {number}
   * @readonly
   */
  get escalaX() {
    let ratio = 1;
    if (this.larguraFinal !== 0) {
      ratio = this.largura / this.larguraFinal;
    }
    return ratio;
  }

  /**
   * Escala resultante do rácio entre a resolução do <code>canvas</code> e a área ocupada pelo mesmo, relativa à altura (<em>y</em>. Corresponde ao valor actual do quociente entre a altura do <em>canvas</em> e a altura final ocupada pelo mesmo. Se a altura final for igual a zero, devolve <code>1</code>.
   * @type {number}
   * @readonly
   */
  get escalaY() {
    let racio = 1;
    if (this.alturaFinal !== 0) {
      racio = this.altura / this.alturaFinal;
    }
    return racio;
  }

  /**
   * Adiciona um <em>gráfico</em> (ou um <em>array</em> de <em>gráficos</em>) ao <em>array</em> interno de <em>gráficos</em> da <em>tela</em>, associando uma ordem, para que seja posteriormente desenhado.
   * O argumento pode ser um único <em>gráfico</em> ou um <em>array</em> de <em>gráficos</em> a adicionar. Cada <em>gráfico</em> será adicionado com a ordem especificada.
   *
   * @param {Grafico|Grafico[]} grafico Um único <em>gráfico</em> ou um <em>array</em> de <em>gráficos</em> a adicionar.
   * @param {number} [ordem=0] Ordem de desenho do(s) <em>gráfico(s)</em> em relação aos outros.
   * @returns {number} O novo tamanho do <em>array</em> interno de <em>gráficos</em> após a adição.
   * @throws {TypeError} Se o parâmetro <code>grafico</code> não for um objecto. Na prática, aceita qualquer objecto, ainda que depois não possa ser desenhado no método <code>desenha()</code>.
   * @throws {TypeError} Se o parâmetro <code>ordem</code> não for um número finito.
   */
  adiciona(grafico, ordem = 0) {
    if (typeof grafico !== 'object') {
      throw new TypeError('O parâmetro "grafico" deve ser um objecto não nulo: idealmente um objecto do tipo "Grafico" ou um "array".');
    }
    if (typeof ordem !== 'number' || !Number.isFinite(ordem)) {
      throw new TypeError('O parâmetro "ordem" deve ser um número finito.');
    }
    let tamanho = this.#graficos.push({ grafico, ordem });
    this.#graficos.sort((a, b) => a.ordem - b.ordem);
    return tamanho;
  }

  /**
   * Obtém a ordem associada a um <em>gráfico</em> armazenado no <em>array</em> interno de <em>gráficos</em> da <em>tela</em>. Devolve o valor da ordem do <em>gráfico</em>, se este for encontrado; caso contrário, devolve <code>undefined</code>.
   * @param {Grafico} grafico O <em>gráfico</em> cuja ordem se pretende obter.
   * @returns {number|undefined} O valor da ordem do <em>gráfico</em>, se for encontrado; caso contrário, <code>undefined</code>.
   * @throws {TypeError} Se o parâmetro <code>grafico</code> não for um objecto. Na prática, aceita qualquer objecto, ainda que depois não possa ser desenhado no método <code>desenha()</code>.
   */
  obtemOrdem(grafico) {
    if (typeof grafico !== 'object') {
      throw new TypeError('O parâmetro "grafico" deve ser um objecto não nulo: idealmente um objecto do tipo "Grafico" ou um "array".');
    }
    let involucro = this.#graficos.find(elemento => elemento.grafico === grafico);
    if (involucro) {
      return involucro.ordem;
    }
    else {
      return undefined;
    }
  }

  /**
   * Altera a ordem de um <em>gráfico</em> já adicionado ao <em>array</em> interno de <em>gráficos</em> da <em>tela</em>. Se o <em>gráfico</em> for encontrado, a sua ordem é actualizada e o <em>array</em> interno de <em>gráficos</em> é reordenado de acordo com o novo valor.
   * @param {Grafico} grafico O <em>gráfico</em> cuja ordem se pretende alterar.
   * @param {number} [ordem=0] O valor da ordem do <em>gráfico</em>.
   * @returns {boolean} Se o <em>gráfico</em> foi encontrado e a ordem alterada, <code>true</code>; caso contrário, <code>false</code>.
   * @throws {TypeError} Se o parâmetro <code>grafico</code> não for um objecto. Na prática, aceita qualquer objecto, ainda que depois não possa ser desenhado no método <code>desenha()</code>.
   * @throws {TypeError} Se o parâmetro <code>ordem</code> não for um número finito.
   */
  alteraOrdem(grafico, ordem = 0) {
    if (typeof grafico !== 'object') {
      throw new TypeError('O parâmetro "grafico" deve ser um objecto não nulo: idealmente um objecto do tipo "Grafico" ou um "array".');
    }
    if (typeof ordem !== 'number' || !Number.isFinite(ordem)) {
      throw new TypeError('O parâmetro "ordem" deve ser um número finito.');
    }
    let involucro = this.#graficos.find(elemento => elemento.grafico === grafico);
    if (!involucro) {
      return false;
    }
    else {
      involucro.ordem = ordem;
      this.#graficos.sort((a, b) => a.ordem - b.ordem);
      return true;
    }
  }

  /**
   * Remove <em>gráficos</em> (ou <em>arrays</em> de gráficos) do <em>array</em> interno de <em>gráficos</em> a serem desenhados na <em>tela</em>. O argumento pode ser um único <em>gráfico</em> ou um <em>array</em> de <em>gráficos</em> a remover.
   * @param {Grafico|Grafico[]} grafico Um único <em>gráfico</em> ou um <em>array</em> de <em>gráficos</em> a remover.
   * @returns {boolean} Se algum <em>gráfico</em> foi removido, <code>true</code>; caso contrário, <code>false</code>.
   * @throws {TypeError} Se o parâmetro <code>grafico</code> não for um objecto. Na prática, aceita qualquer objecto, ainda que depois não possa ser desenhado no método <code>desenha()</code>.
   */
  remove(grafico) {
    if (typeof grafico !== 'object') {
      throw new TypeError('O parâmetro "grafico" deve ser um objecto não nulo: idealmente um objecto do tipo "Grafico" ou um "array".');
    }
    let tamanhoAnterior = this.#graficos.length;
    this.#graficos = this.#graficos.filter(elemento => elemento.grafico !== grafico);
    return this.#graficos.length < tamanhoAnterior;
  }

  /**
   * Limpa a tela, sendo especialmente útil na criação de animações, para evitar o efeito de arrastamento. Este método apaga todo o conteúdo actualmente desenhado no <code>canvas</code>, preparando-o para uma nova iteração de desenho.
   */
  limpa() {
    this.contexto.clearRect(0, 0, this.largura, this.altura);
  }

  /**
   * Desenha todos os <em>gráficos</em> (instâncias ou objectos de subclasses da classe <code>Grafico</code>) que tenham sido adicionados a esta <em>tela</em>. Opcionalmente, pode receber como argumento o <em>tempo</em> referente ao momento da chamada, permitindo a uniformização das animações e dos movimentos entre diferentes dispositivos. Se este argumento for usado, as <em>variações</em> das coordenadas dos <em>gráficos</em> devem ser expressas em função de um segundo &mdash; i.e., <em>pixels</em> por segundo; caso contrário, assume-se que a <em>variação</em> é definida em função de cada iteração &mdash; i.e., <em>pixels</em> por chamada ao método <code>desenha()</code> dos <em>gráficos</em>.
   * @param {number} [tempoActual] <em>Tempo</em> referente ao momento da chamada (em milissegundos, idealmente obtido via <code>performance.now()</code>).
   * @throws {TypeError} Se o parâmetro <code>tempoActual</code> não for um número finito e não negativo.
   * @throws {RangeError} Se o parâmetro <code>tempoActual</code> for um número negativo.
   */
  desenha(tempoActual) {
    if (tempoActual != null && (typeof tempoActual !== 'number' || !Number.isFinite(tempoActual))) {
      throw new TypeError('O parâmetro "tempoActual", se não for nulo, deve ser um número finito.');
    }
    if (tempoActual < 0) {
      throw new RangeError('O parâmetro "tempoActual" deve ser um número não negativo.');
    }
    let deltaTempo = 1 / 60;  // valor por omissão, para 60 fps
    if (tempoActual) {
      if (this.#tempoAnterior === undefined) {
        this.#tempoAnterior = tempoActual;
      }
      deltaTempo = (tempoActual - this.#tempoAnterior) / 1000;
      this.#tempoAnterior = tempoActual;
    }
    deltaTempo = Math.min(Tela.MAX_DELTA_TEMPO, Math.max(0, deltaTempo));
    this.#desenha(this.#graficos, deltaTempo);

  }

  #desenha(graficos, deltaTempo = 1) {
    for (let elemento of graficos) {
      if (Array.isArray(elemento.grafico)) {
        this.#desenha(elemento.grafico, deltaTempo);
      }
      else if (elemento.grafico) {
        elemento.grafico.desenha(this, deltaTempo);
      }
      else if (Array.isArray(elemento)) {
        this.#desenha(elemento, deltaTempo);
      }
      else {
        elemento.desenha(this, deltaTempo);
      }
    }
  }

  /**
   * Lista dos valores válidos para a propriedade <code>cursor</code> em elementos de <em>canvas</em> ou <em>gráficos</em>, seguindo as especificações CSS e permitindo controlar a aparência do cursor do rato.
   * @type {string[]}
   * @static
   * @const
   * */
  static CURSORES = ['default', 'pointer', 'grab', 'grabbing', 'move', 'crosshair', 'wait', 'progress', 'not-allowed', 'zoom-in', 'zoom-out'];

  /**
   * Valor máximo permitido para o parâmetro <code>deltaTempo</code> em actualizações e animações de <em>gráficos</em>, sendo usado para limitar o intervalo de tempo entre fotogramas e garantir estabilidade nas animações nos momentos em que estas possam ser interrompidas.
   * @type {number}
   * @static
   * @const
   */
  static MAX_DELTA_TEMPO = 1 / 30;  // valor máximo, para um pior cenário de 30 fps -- ajustar se houver suspeitas de que, mesmo assim, deveria ser maior
}

//

/**
 * @class
 * @abstract
 * @classdesc A classe <code>Media</code> é, na prática, uma classe <em>abstracta</em>, servindo apenas de base para as subclasses de <code>Media</code>. Para além disso, funcionará essencialmente como um <em>invólucro</em> para elementos de <code>audio</code> e de <code>video</code> em eventuais subclasses.
 * @property {HTMLMediaElement} media O <em>elemento</em> HTML <em>media</em> a ser representado.
 * @property {number} posicao O tempo actual de reprodução (em segundos) do elemento de <em>media</em>. Pode variar entre <code>0.0</code> e <code>duracao</code>. Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code> (se inferior) ou <code>duracao</code> (se superior).
 * @property {number} duracao A duração total do elemento de <em>media</em> (em segundos).
 * @property {number} volume O volume actual do elemento de <em>media</em>. Pode variar entre <code>0.0</code> e <code>1.0</code>. Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code> (se inferior) ou <code>1.0</code> (se superior).
 */
class Media {
  #media;

  /**
   * Construtor da classe <code>Media</code> &mdash; <em>este construtor não deve ser usado directamente; se tal acontecer, é gerada uma excepção (<code>TypeError</code>)</em>.
   * @param {HTMLMediaElement} media O <em>elemento</em> <code>HTMLMediaElement</code> a ser representado.
   * @throws {TypeError} Caso a classe seja instanciada directamente &mdash; não permitido (classe abstracta).
   * @throws {TypeError} Caso <code>media</code> não seja do tipo <code>HTMLMediaElement</code>.
   */
  constructor(media) {
    if (this.constructor.name === 'Media') {
      throw new TypeError('A classe abstracta "Media" não pode ser instanciada directamente, devendo ser implementada através de subclasses (que poderão depois ser instanciadas).');
    }
    if (!(media instanceof HTMLMediaElement)) {
      throw new TypeError('O parâmetro "media" deve ser um objecto do tipo "HTMLMediaElement".');
    }
    this.#media = media;
    const tiposEventosMedia = ['play', 'playing', 'pause', 'ended', 'timeupdate', 'volumechange'];
    for (const tipoEventoMedia of tiposEventosMedia) {
      this.#media.addEventListener(tipoEventoMedia, (evento) => this.#processaMedia(evento));
    }
  }

  #processaMedia(evento) {
    switch (evento.type) {
      case 'play':
        this.processaReproducaoIniciada(evento);
        break;
      case 'playing':
        this.processaReproducaoContinuada(evento);
        break;
      case 'pause':
        this.processaReproducaoPausada(evento);
        break;
      case 'ended':
        this.processaReproducaoTerminada(evento);
        break;
      case 'timeupdate':
        this.processaTempoActualizado(evento);
        break;
      case 'volumechange':
        this.processaVolumeAlterado(evento);
        break;
      default:
        break;
    }
  }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>play</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento.
   * @param {Event} evento Objecto correspondente ao evento <code>play</code> que foi desencadeado.
   */
  processaReproducaoIniciada(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>playing</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento.
   * @param {Event} evento Objecto correspondente ao evento <code>playing</code> que foi desencadeado.
   */
  processaReproducaoContinuada(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>pause</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento.
   * @param {Event} evento Objecto correspondente ao evento <code>pause</code> que foi desencadeado.
   */
  processaReproducaoPausada(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>ended</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento.
   * @param {Event} evento Objecto correspondente ao evento <code>ended</code> que foi desencadeado.
   */
  processaReproducaoTerminada(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>timeupdate</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento.
   * @param {Event} evento Objecto correspondente ao evento <code>timeupdate</code> que foi desencadeado.
   */
  processaTempoActualizado(evento) { }

  /**
   * Método chamado quando ocorre o <em>evento</em> <code>volumechange</code>, que deverá ser posteriormente definido como uma <em>função</em> contendo as instruções a executar decorrentes desse evento.
   * @param {Event} evento Objecto correspondente ao evento <code>volumechange</code> que foi desencadeado.
   */
  processaVolumeAlterado(evento) { }

  set media(valor) {
    if (!(valor instanceof HTMLMediaElement)) {
      throw new TypeError('O valor de "media" deve ser um objecto do tipo "HTMLMediaElement".');
    }
    this.#media = valor;
  }

  get media() {
    return this.#media;
  }

  set volume(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "volume" deve ser um número finito, idealmente entre 0.0 e 1.0.');
    }
    this.#media.volume = Math.min(1, Math.max(0, valor));
  }

  get volume() {
    return this.#media.volume;
  }

  set posicao(valor) {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      throw new TypeError('O valor de "posicao" deve ser um número finito, idealmente entre 0.0 e a duração do elemento de media.');
    }
    this.#media.currentTime = Math.min(this.media.duration, Math.max(0, valor))
  }

  get posicao() {
    return this.#media.currentTime;
  }

  /**
   * Duração da reprodução do elemento multimédia, correspondente ao valor actual da propriedade <code>duration</code> do elemento associado. Se a duração não estiver disponível, devolve <code>NaN</code>.
   * @type {number}
   * @readonly
   */
  get duracao() {
    return this.#media.duration;
  }

  /**
   * Inicia ou retoma a reprodução do elemento multimédia. Caso o parâmetro <code>inicio</code> seja <code>true</code>, a reprodução é iniciada desde o início; caso contrário, é retomada a partir do momento em que foi interrompida anteriormente (ou do momento indicado pelo tempo de reprodução), ou continua a sua reprodução (se já estava a ser reproduzido).
   * @param {boolean} [inicio=false] Indicação de que o elemento deve ser reproduzido do início; caso contrário, é reproduzido a partir do momento em que foi interrompida a sua reprodução anterior (ou do momento indicado pelo tempo de reprodução), ou continua a sua reprodução (se já estava a ser reproduzido).
   * @throws {TypeError} Se o parâmetro <code>inicio</code> não for do tipo booleano.
   */
  reproduz(inicio = false) {
    if (typeof inicio !== 'boolean') {
      throw new TypeError('O parâmetro "inicio" deve ser do tipo booleano.');
    }
    if (inicio) {
      this.#media.currentTime = 0;
    }
    this.#media.play();
  }

  /**
   * Pára a reprodução do elemento multimédia. Este método interrompe temporariamente a reprodução, podendo esta ser retomada posteriormente a partir do ponto onde foi interrompida.
   */
  pausa() {
    this.#media.pause();
  }

  /**
   * Pára a reprodução do elemento multimédia, voltando também ao seu início. Este método interrompe a reprodução (caso esteja a decorrer) e repõe o tempo actual de reprodução no início (<code>0</code>).
   */
  para() {
    this.pausa();
    this.#media.currentTime = 0;
  }
}

/**
 * @class
 * @extends Media
 * @classdesc A classe <code>Som</code> funciona essencialmente como um <em>invólucro</em> para elementos <code>HTMLAudioElement</code>, facilitando a sua referenciação e também o uso dos métodos mais comuns para, por exemplo, o controlo da sua reprodução.
 * @property {HTMLAudioElement} som O <em>elemento</em> do tipo <code>HTMLAudioElement</code> a ser representado.
 * @property {number} posicao O tempo actual de reprodução (em segundos) do <em>som</em>. Pode variar entre <code>0.0</code> e <code>duracao</code>. Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code> (se inferior) ou <code>duracao</code> (se superior).
 * @property {number} duracao A duração total do <em>som</em> (em segundos).
 * @property {number} volume O volume actual do <em>som</em>. Pode variar entre <code>0.0</code> e <code>1.0</code>. Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code> (se inferior) ou <code>1.0</code> (se superior).
 */
class Som extends Media {

  /**
   * Construtor para criação de novos objectos do tipo <code>Som</code>. Inicializa a instância com o elemento HTML do tipo <code>audio</code> a ser representado.
   * @param {HTMLAudioElement} som O <em>elemento</em> do tipo <code>HTMLAudioElement</code> a ser representado.
   * @throws {TypeError} Se o parâmetro <code>audio</code> não for um objecto do tipo <code>HTMLAudioElement</code>.
   */
  constructor(som) {
    super(som);
    if (!(som instanceof HTMLAudioElement)) {
      throw new TypeError('O parâmetro "som" deve ser um objecto do tipo "HTMLAudioElement".');
    }
  }

  set som(valor) {
    if (!(valor instanceof HTMLAudioElement)) {
      throw new TypeError('O valor de "som" deve ser um objecto do tipo "HTMLAudioElement".');
    }
    super.media = valor;
  }

  get som() {
    return super.media;
  }
}

//

/**
 * @class
 * @extends Media
 * @classdesc A classe <code>Filme</code> funciona essencialmente como um <em>invólucro</em> para elementos <code>HTMLVideoElement</code>, facilitando a sua referenciação e também uso de métodos mais comuns para, por exemplo, o controlo da sua reprodução.
 * @property {HTMLVideoElement} video O <em>elemento</em> do tipo <code>HTMLVideoElement</code> a ser representado.
 * @property {number} posicao O tempo actual de reprodução (em segundos) do <em>filme</em>. Pode variar entre <code>0.0</code> e <code>duracao</code>. Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code> (se inferior) ou <code>duracao</code> (se superior).
 * @property {number} duracao A duração total do <em>filme</em> (em segundos).
 * @property {number} volume O volume actual do <em>filme</em>. Pode variar entre <code>0.0</code> e <code>1.0</code>. Se o valor atribuído estiver fora deste intervalo, será corrigido para <code>0.0</code> (se inferior) ou <code>1.0</code> (se superior).
 */
class Filme extends Media {

  /**
   * Construtor para a criação de novos objectos do tipo <code>Filme</code>. Inicializa a instância com o elemento HTML do tipo <code>video</code> a ser representado.
   * @param {HTMLVideoElement} filme O <em>elemento</em> do tipo <code>HTMLVideoElement</code> a ser representado.
   * @throws {TypeError} Se o parâmetro <code>video</code> não for um objecto do tipo <code>HTMLVideoElement</code>.
   */
  constructor(filme) {
    super(filme);
    if (!(filme instanceof HTMLVideoElement)) {
      throw new TypeError('O parâmetro "filme" deve ser um objecto do tipo "HTMLVideoElement".');
    }
  }

  set filme(valor) {
    if (!(valor instanceof HTMLVideoElement)) {
      throw new TypeError('O valor de "filme" deve ser um objecto do tipo "HTMLVideoElement".');
    }
    super.media = valor;
  }

  get filme() {
    return super.media;
  }

  /**
   * Largura do <em>filme</em> (número de colunas), correspondente ao valor actual da propriedade <code>videoWidth</code> do elemento associado ao <em>filme</em>.
   * @type {number}
   * @readonly
   */
  get largura() {
    return this.media.videoWidth;
  }

  /**
   * Altura do <em>filme</em> (número de linhas), correspondente ao valor actual da propriedade <code>videoHeight</code> do elemento associado ao <em>filme</em>.
   * @type {number}
   * @readonly
   */
  get altura() {
    return this.media.videoHeight;
  }
}

//

/**
 * @class
 * @classdesc A classe <code>Cronometro</code> permite obter o tempo (decorrido ou parado) entre quaisquer dois momentos no tempo, facilitando a medição de intervalos temporais.
 * @property {boolean} parado Indica se o <em>cronómetro</em> está parado (<code>true</code>) ou em funcionamento (<code>false</code>).
 * @property {number} tempoInicial Instante (em milissegundos) em que o <em>cronómetro</em> foi criado ou reiniciado pela última vez.
 * @property {number} tempoDecorrido Tempo, em milissegundos, efectivamente contado pelo <em>cronómetro</em> desde a sua criação ou último reinício.
 * @property {number} tempoParado Tempo, em milissegundos, durante o qual o <em>cronómetro</em> esteve parado desde a sua criação ou último reinício.
 */
class Cronometro {
  #tempoReferencia;
  #tempoDecorrido;
  #tempoInicial;
  #parado;

  /**
   * Construtor para criação de novos objectos do tipo <code>Cronometro</code>. Inicializa o <em>cronómetro</em>, definindo o instante de referência e o tempo inicial como o momento actual, com o tempo decorrido a zero e o <em>cronómetro</em> em funcionamento.
   */
  constructor() {
    this.#tempoInicial = performance.now();
    this.#tempoReferencia = this.#tempoInicial;
    this.#tempoDecorrido = 0;
    this.#parado = false;
  }

  /**
   * Estado actual do <em>cronómetro</em>: parado (<code>true</code>) ou a contar o tempo (<code>false</code>).
   * @type {boolean}
   * @readonly
   */
  get parado() {
    return this.#parado;
  }

  /**
  * Instante (em milissegundos) em que o <em>cronómetro</em> foi criado ou reiniciado pela última vez.
  * @type {number}
  * @readonly
  */
  get tempoInicial() {
    return this.#tempoInicial;
  }

  /**
   * Tempo decorrido, em milissegundos, desde que o <em>cronómetro</em> foi criado ou reiniciado. Se o <em>cronómetro</em> estiver parado, o tempo decorrido mantém-se inalterado enquanto essa situação se verificar. Caso esteja a contar, devolve o tempo total acumulado até ao momento actual.
   * @type {number}
   * @readonly
   */
  get tempoDecorrido() {
    if (this.#parado) {
      return this.#tempoDecorrido;
    }
    else {
      return performance.now() - this.#tempoReferencia + this.#tempoDecorrido;
    }
  }

  /**
   * Tempo, em milissegundos, durante o qual o <em>cronómetro</em> esteve parado desde que foi criado ou reiniciado, correspondendo à diferença entre o tempo total decorrido e o tempo efectivamente contado pelo <em>cronómetro</em>.
   * @type {number}
   * @readonly
   */
  get tempoParado() {
    return performance.now() - this.#tempoInicial - this.tempoDecorrido;
  }

  /**
   * Faz com que o <em>cronómetro</em> volte a contar o tempo decorrido desde que foi criado ou reiniciado, deixando de contar o tempo durante o qual esteve parado.
   * @param {number} [agora=performance.now()] Instante (em milissegundos) a considerar como momento de retoma da contagem do tempo decorrido. Se não for fornecido, será usado o tempo actual do sistema.
   * @throws {TypeError} Se o parâmetro <code>agora</code> não for um número finito.
   * @throws {RangeError} Se o parâmetro <code>agora</code> for um número negativo.
   */
  continua(agora = performance.now()) {
    if (typeof agora !== 'number' || !Number.isFinite(agora)) {
      throw new TypeError('O parâmetro "agora" deve ser um número finito.');
    }
    if (agora < 0) {
      throw new RangeError('O parâmetro "agora" deve ser um número não negativo.');
    }
    if (this.#parado) {
      this.#tempoReferencia = agora;
      this.#parado = false;
    }
  }

  /**
   * Pára o <em>cronómetro</em>, interrompendo a contagem do tempo decorrido desde que foi criado ou reiniciado. O tempo decorrido mantém-se inalterado enquanto o <em>cronómetro</em> estiver parado, ao passo que o tempo parado vai aumenta.
   * @param {number} [agora=performance.now()] Instante (em milissegundos) a considerar como momento da paragem. Se não for fornecido, será usado o tempo actual do sistema.
   * @throws {TypeError} Se o parâmetro <code>agora</code> não for um número finito.
   * @throws {RangeError} Se o parâmetro <code>agora</code> for um número negativo.
   */
  para(agora = performance.now()) {
    if (typeof agora !== 'number' || !Number.isFinite(agora)) {
      throw new TypeError('O parâmetro "agora" deve ser um número finito.');
    }
    if (agora < 0) {
      throw new RangeError('O parâmetro "agora" deve ser um número não negativo.');
    }
    if (!this.#parado) {
      this.#tempoDecorrido += agora - this.#tempoReferencia;
      this.#parado = true;
    }
  }

  /**
   * Reinicia o <em>cronómetro</em>, definindo o instante actual (ou o valor fornecido) como novo tempo inicial e de referência, colocando o tempo decorrido e o tempo parado a zero, e iniciando imediatamente a contagem do tempo.
   * @param {number} [agora=performance.now()] Instante (em milissegundos) a considerar como novo tempo inicial e de referência. Se não for fornecido, será usado o tempo actual do sistema.
   * @throws {TypeError} Se o parâmetro <code>agora</code> não for um número finito.
   * @throws {RangeError} Se o parâmetro <code>agora</code> for um número negativo.
   */
  reinicia(agora = performance.now()) {
    if (typeof agora !== 'number' || !Number.isFinite(agora)) {
      throw new TypeError('O parâmetro "agora" deve ser um número finito.');
    }
    if (agora < 0) {
      throw new RangeError('O parâmetro "agora" deve ser um número não negativo.');
    }
    this.#tempoInicial = agora;
    this.#tempoReferencia = agora;
    this.#tempoDecorrido = 0;
    this.#parado = false;
  }
}
