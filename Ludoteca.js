/**
 * @file Biblioteca de classes que representam vários tipos de <em>gráficos</em> a desenhar num <code>canvas</code>, o próprio <code>canvas</code>, e também os elementos <code>audio</code> e <code>video</code>. O propósito desta biblioteca é facilitar o desenvolvimento de jogos e outras aplicações multimédia num contexto académico. Procura-se que esta aborde apenas os casos mais comuns, evitando complexidade desnecessária, se bem que algumas classes contenham algumas propriedades suplementares para facilitar a caracterização dos objectos criados para casos habituais, ainda que fora do estritamente necessário.
 * @version 0.9.2
 * @author Ricardo Rodrigues
 * @date 2022-06-21
 * @copyright Ricardo Rodrigues (2021, 2022)
 */

/**
 * @class
 * @classdesc A classe <code>Grafico</code> é, para todos os efeitos, uma classe <em>abstracta</em>, servindo apenas de base para as subclasses de <code>Grafico</code>.
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
 * @property {boolean} rotacao=false Indicação de que o <em>círculo</em> deve rodar, reflectindo o  seu <em>ângulo</em>
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
   * Este método encontra-se implementado na superclasse <code>Grafico</code>, assumindo que todas as formas definidas nas suas subclasses são limitadas, de um modo genérico, por um rectângulo imaginário que engloba a totalidade do <em>gráfico</em>. <em>Se este método, tal como se encontra definido, não for o mais apropriado para uma dada subclasse, pode ser sempre redefinido (<em>overrided</em>) nessa mesma subclasse.</em>
   * @param {Grafico} outro Outro <em>gráfico</em> para verificar se existe alguma colisão entre <em>esse</em> e <em>este</em>
   * @returns {boolean} Se houver colisão, <code>true</code>; senão, <code>false</code>
   */
  colide(outro) {
    return (this.activo && outro.activo && (this.contemPonto(outro.x, outro.y) || this.contemPonto(outro.x + outro.largura, outro.y) || this.contemPonto(outro.x, outro.y + outro.altura) || this.contemPonto(outro.x + outro.largura, outro.y + outro.altura) || outro.contemPonto(this.x, this.y) || outro.contemPonto(this.x + this.largura, this.y) || outro.contemPonto(this.x, this.y + this.altura) || outro.contemPonto(this.x + this.largura, this.y + this.altura)));
  }

  /**
   * Este método testa a colisão entre <em>este objecto gráfico</em> e <em>outro objecto gráfico</em> e, quando tal se verifica, reposiciona <em>este objecto gráfico</em>, deixando-o encostado (ou próximo disso, consoante o <em>afastamento</em>) ao <em>outro</em>, evitando a sobreposição de ambos. O reposicionamento depende da posição imediatamente anterior <em>deste objecto gráfico</em> em relação ao <em>outro</em>. <em>Neste momento, ainda só funciona devidamente com movimentos definidos pelo <code>deltaX</code>, pelo <code>deltaY</code> e pela <code>gravidade</code>.</em>
   * @param {Grafico} outro Outro <em>gráfico</em> para verificar se existe alguma colisão entre <em>esse</em> e <em>este</em>, efectuando o subsequente reposicionamento <em>deste</em>
   * @param {number} afastamento=0 Afastamento a aplicar entre os dois <em>objectos gráficos</em> no reposicionamento; idealmente, este deve ser compreendido entre zero (<code>0</code>) e um valor inferior aos valores de quaisquer deslocamentos horizontais e verticais
   * @returns {boolean} Se houver colisão e o correspondente reposicionamento, <code>true</code>; senão, <code>false</code>
   */
  reposicionaContra(outro, afastamento = 0) {
    if (this.colide(outro)) {
      // posicão anterior: em cima
      if (this.y + this.altura - Math.abs(this.deltaY + this.gravidade) <= outro.y) {
        this.y = outro.y - this.altura - afastamento;
        this.angulo = 0;
      }
      // posicão anterior: em baixo
      else if (this.y - outro.altura + Math.abs(this.deltaY + this.gravidade) >= outro.y) {
        this.y = outro.y + outro.altura + afastamento;
        this.angulo = 0;
      }
      // posicão anterior: à esquerda
      else if (this.x + this.largura - Math.abs(this.deltaX) <= outro.x) {
        this.x = outro.x - this.largura - afastamento;
      }
      // posicão anterior: à direita
      else if (this.x - outro.largura + Math.abs(this.deltaX) >= outro.x) {
        this.x = outro.x + outro.largura + afastamento;
      }
      else {
        return false;
      }
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * <em>Este método deve ser implementado nas subclasses de <code>Grafico</code>, respeitando as especificidades de cada forma representada nelas. Se tal não acontecer, é gerada uma excepção (<code>Error</code>).</em>
   * @param {number} x Abscissa do ponto a testar se está contido no <em>gráfico</em>
   * @param {number} y Ordenada do ponto a testar se está contido no <em>gráfico</em>
   * @returns {boolean} Se o ponto estiver contido neste <em>grafico</em>, <code>true</code>; senão, <code>false</code>
   */
  contemPonto(x, y) {
    throw new Error("O método 'contemPonto(x, y)' tem de ser implementado nas subclasses da classe 'Grafico'.");
  }

  /**
   * Este método mais não faz que chamar o método <code>contemPonto(x, y)</code> para cada um dos pontos do <em>array</em>, verificando se algum deles se encontra dentro do <em>gráfico</em>.
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
 * @classdesc A classe <code>Circulo</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>círculos</em>. Num nível básico, um <em>círculo</em> é definido por um <em>ponto</em> central e por um <em>raio</em>. Contudo, para que exista uniformidade no posicionamento das formas representadas pelas várias subclasses de <code>Grafico</code>, os círculos são também posicionados usando o canto superior esquerdo (de um <em>quadrado</em> imaginário que o contenha), em vez do seu centro &mdash; assim, o <em>raio</em> é somado ao <em>x</em> e ao <em>y</em> para fazer as devidas compensações de posicionamento, determinando o <em>centro</em>.
 * @property {number} x Abscissa para posicionar o <em>círculo</em> no <code>canvas</code>
 * @property {number} y Ordenada para posicionar o <em>círculo</em> no <code>canvas</code>
 * @property {number} raio Raio do <em>círculo</em>
 * @property {string} preenchimento Cor do preenchimento <em>círculo</em> &mdash; se a cor for especificada como <code>null</code>, o <em>círculo</em> não é preenchido
 * @property {string} contorno Cor do contorno do <em>círculo</em> &mdash; se a cor for especificada como <code>null</code>, o contorno não é desenhado
 * @property {number} espessura Espessura do contorno do <em>círculo</em> &mdash; se a espessura tiver um valor igual ou inferior a zero (<code>0</code>), o contorno não é desenhado
 * @property {number} deltaX=0 Variação horizontal da posição do <em>círculo</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>círculo</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>x</em> em relação à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>y</em> em relação à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>círculo</em> quando desenhado no <code>canvas</code> &mdash; dadas as características do <em>círculo</em>, esta propriedade é ignorada no seu desenho no <code>canvas</code>
 * @property {number} gravidade=0 Força que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>cículo</em>, actuando como a <em>gravidade</em>
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>círculo</em>
 * @property {boolean} activo=true Indicação de que o <em>círculo</em> deve testar colisões, quando chamado o método <code>colide(outro)</code>
 * @property {boolean} rotacao=false Indicação de que o <em>círculo</em> deve rodar, reflectindo o  seu <em>ângulo</em> &mdash; dadas as características do <em>círculo</em>, esta propriedade é ignorada no seu desenho no <code>canvas</code>
 * @property {boolean} visivel=true Indicação de que o <em>círculo</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
 */
class Circulo extends Grafico {
  /**
   * Construtor para criação de novos objectos do tipo <code>Círculo</code>
   * @param {number} x Abscissa para posicionar o <em>círculo</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>círculo</em> no <code>canvas</code>
   * @param {number} raio Raio do <em>círculo</em>
   * @param {string} preenchimento="black" Cor do preenchimento <em>círculo</em>
   * @param {string} contorno="black" Cor do contorno do <em>círculo</em>
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
   * Largura de um <em>quadrado</em> imaginário que envolva este <em>círculo</em> &mdash; na prática, corresponde ao diâmetro
   * @type {number}
   */
  get largura() {
    return this.raio * 2;
  }

  /**
   * Altura de um <em>quadrado</em> imaginário que envolva este <em>círculo</em> &mdash; na prática, corresponde ao diâmetro
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
   * Este método desenha um <em>círculo</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo de um <em>quadrado</em> imaginário que envolva o <em>círculo</em>.
   * @param {Tela} tela Objecto que representa o elemento <code>canvas</code> onde será desenhado o <em>círculo</em>
   */
  desenha(tela) {
    this.x += this.distX;
    this.y += this.distY;
    if (this.visivel) {
      // no caso do círculo, definir um ângulo de rotação é irrelevante, pelo que não se implementa, até para evitar processamento desnecessário
      var contexto = tela.contexto;
      contexto.save();
      contexto.beginPath();
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
 * @property {number} largura Largura do <em>rectângulo</em>
 * @property {number} altura Altura do <em>rectângulo</em>
 * @property {string} preenchimento Cor do preenchimento <em>rectângulo</em> &mdash; se a cor for especificada como <code>null</code>, o <em>rectângulo</em> não é preenchido
 * @property {string} contorno Cor do contorno do <em>rectângulo</em> &mdash; se a cor for especificada como <code>null</code>, o contorno não é desenhado
 * @property {number} espessura Espessura do contorno do <em>rectângulo</em> &mdash; se a espessura tiver um valor igual ou inferior a zero (<code>0</code>), o contorno não é desenhado
 * @property {number} deltaX=0 Variação horizontal da posição do <em>rectângulo</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>rectângulo</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>x</em> em relação à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>y</em> em relação à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>rectângulo</em> quando desenhado no <code>canvas</code> &mdash; a rotação é feita tendo como referência o centro do <em>rectângulo</em>
 * @property {number} gravidade=0 Força que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>rectângulo</em>, actuando como a <em>gravidade</em>
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>rectângulo</em>
 * @property {boolean} activo=true Indicação de que o <em>rectângulo</em> deve testar colisões, quando chamado o método <code>colide(outro)</code>
 * @property {boolean} rotacao=false Indicação de que o <em>círculo</em> deve rodar, reflectindo o  seu <em>ângulo</em>
 * @property {boolean} visivel=true Indicação de que o <em>rectângulo</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
  */
class Rectangulo extends Grafico {
  /**
   * Construtor para criação de novos objectos do tipo <code>Rectangulo</code>
   * @param {number} x Abscissa para posicionar o <em>rectângulo</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>rectângulo</em> no <code>canvas</code>
   * @param {number} largura Largura do <em>rectângulo</em>
   * @param {number} altura Altura do <em>rectângulo</em>
   * @param {string} preenchimento="black" Cor do preenchimento <em>rectângulo</em>
   * @param {string} contorno="black" Cor do contorno do <em>rectângulo</em>
   * @param {number} espessura=0 Espessura do contorno do <em>rectângulo</em>
   */
  constructor(x, y, largura, altura, preenchimento = "black", contorno = "black", espessura = 0) {
    super(x, y);
    this.largura = largura;
    this.altura = altura;
    this.preenchimento = preenchimento;
    this.contorno = contorno;
    this.espessura = espessura;
  }

  /**
   * Este método verifica se um dado <em>ponto</em> está contido na área deste <em>rectângulo</em>. Tal acontece quando o <em>x</em> do ponto se encontra compreendido entre o <em>x</em> do <em>rectângulo</em> e <em>x</em> mais a <em>largura</em> do <em>rectângulo</em>, e o <em>y</em> do ponto se encontra compreendido entre o <em>y</em> do <em>rectângulo</em> e <em>y</em> mais a <em>altura</em> do <em>rectângulo</em>.
   * @param {number} x Abscissa do ponto a testar se está contido neste <em>rectângulo</em>
   * @param {number} y Ordenada do ponto a testar se está contido neste <em>rectângulo</em>
   * @returns {boolean} Se o ponto estiver contido neste <em>rectângulo</em>, <code>true</code>; senão, <code>false</code>
   */
  contemPonto(x, y) {
    return ((this.x <= x) && (this.x + this.largura > x) && (this.y <= y) && (this.y + this.altura > y));
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
      // para evitar processamento desnecessário, só se faz a translação e a rotação do canvas quando o ângulo é diferente de zero (0), já que, quando o ângulo tem esse valor, o resultado é idêntico a quando não se faz qualquer translação e rotação
      if (this.rotacao && this.angulo != 0) {
        contexto.translate(Math.floor(this.x + this.largura * 0.5), Math.floor(this.y + this.altura * 0.5));
        contexto.rotate(this.angulo * Math.PI / 180);
        contexto.rect(Math.floor(-this.largura * 0.5), Math.floor(-this.altura * 0.5), this.largura, this.altura);
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
 * @classdesc A classe <code>Poligono</code> é uma subclasse de <code>Grafico</code>, servindo para representar <em>polígonos</em>. Num nível básico, um <em>polígono</em> é definido por um <em>ponto</em>, correspondente, regra geral, ao seu canto superior esquerdo de um <em>rectângulo</em> imaginário que contenha o <em>polígono</em>. Assim, este será o <em>ponto</em> relativamente ao qual todos os pontos do <em>polígono</em> serão posicionados. Aconselha-se que todos os pontos do polígono se encontrem à direita e abaixo desta origem e tão próximos dela quanto possível; caso contrário, aspectos como a rotação do polígono poderão ter resultados diferentes do esperado, o mesmo acontecendo com as colisões baseadas nesse rectângulo imaginário. Deste modo, há a possibilidade, activada por omissão através do atributo <code>ajuste</code>, de <em>encostar</em> o polígono à origem &mdash; contudo, tal implica a alteração (o referido <em>ajuste</em>) de todos os pontos.
 * @property {number} x Abscissa para posicionar o <em>polígono</em> no <code>canvas</code>
 * @property {number} y Ordenada para posicionar o <em>polígono</em> no <code>canvas</code>
 * @property {array} pontos Conjunto de pontos com os vários vértices do <em>polígono</em>
 * @property {string} preenchimento Cor do preenchimento <em>polígono</em> &mdash; se a cor for especificada como <code>null</code>, o <em>polígono</em> não é preenchido
 * @property {string} contorno Cor do contorno do <em>polígono</em> &mdash; se a cor for especificada como <code>null</code>, o contorno não é desenhado
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
 * @property {boolean} rotacao=false Indicação de que o <em>círculo</em> deve rodar, reflectindo o  seu <em>ângulo</em>
 * @property {boolean} visivel=true Indicação de que o <em>polígono</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
 */
class Poligono extends Grafico {
  /**
   * Construtor para criação de novos objectos do tipo <code>Rectangulo</code>
   * @param {number} x Abscissa para posicionar o <em>polígono</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>polígono</em> no <code>canvas</code>
   * @param {array} pontos Conjunto de pontos com os vários vértices do <em>polígono</em>
   * @param {string} preenchimento="black" Cor do preenchimento <em>polígono</em>
   * @param {string} contorno="black" Cor do contorno do <em>polígono</em>
   * @param {number} espessura=0 Espessura do contorno do <em>polígono</em>
   * @param {boolean} ajuste=true Indicação de que o <em>polígono</em> deve ser reposicionado de forma a ficar <em>encostado</em> ao ponto usado para definir o seu posicionamento no <code>canvas</code>
   */
  constructor(x, y, pontos, preenchimento = "black", contorno = "black", espessura = 0, ajuste = true) {
    super(x, y);
    this.pontos = pontos;
    this.preenchimento = preenchimento;
    this.contorno = contorno;
    this.espessura = espessura;
    //se ajuste for verdadeiro (true), todo os pontos são alterados de forma a que o polígono seja "encostado" à origem -- o ponto (x, y) do polígono; se for necessário recuperar os pontos originais, tal pode ser feito com auxílio das propriedades deslocX e deslocY; se ajuste for verdadeiro, desaconselha-se a alteração do atributo pontos depois de criada a instância da classe -- ou, se tal acontecer, a chamar explicitamente o método ajusta()
    this.deslocX = 0;
    this.deslocY = 0;
    if (ajuste) {
      this.ajusta();
    }
  }

  /**
  * Este método ajusta o <em>polígono</em> de forma a ficar <em>encostado</em> ao ponto usado para definir o seu posicionamento no <code>canvas</code>. Se os pontos do <em>polígono</em> forem alterados após a criação do objecto, deve ser ponderada a chamada a este método.
  */
  ajusta() {
    this.deslocX = Number.MAX_VALUE;
    for (var i = 0, j = this.pontos.length - 1; i < this.pontos.length; j = i++) {
      this.deslocX = Math.min(this.deslocX, this.pontos[i].x);
    }
    this.deslocY = Number.MAX_VALUE;
    for (var i = 0, j = this.pontos.length - 1; i < this.pontos.length; j = i++) {
      this.deslocY = Math.min(this.deslocY, this.pontos[i].y);
    }
    for (var i = 0; i < this.pontos.length; i++) {
      this.pontos[i].x -= this.deslocX;
      this.pontos[i].y -= this.deslocY;
    }
  }

  /**
   * Largura de um <em>rectângulo</em> imaginário que envolva este <em>polígono</em> &mdash; sendo definida pela distância entre o <em>x</em> do ponto mais à esquerda e o <em>x</em> do ponto mais à direita do <em>polígono</em>
   * @type {number}
   */
  get largura() {
    var minX = Number.MAX_VALUE;
    var maxX = Number.MIN_VALUE;
    for (var i = 0, j = this.pontos.length - 1; i < this.pontos.length; j = i++) {
      minX = Math.min(minX, this.pontos[i].x);
      maxX = Math.max(maxX, this.pontos[j].x);
    }
    return maxX - minX;
  }

  /**
   * Altura de um <em>rectângulo</em> imaginário que envolva este <em>polígono</em> &mdash; sendo definida pela distância entre o <em>y</em> do ponto mais acima e o <em>y</em> do ponto mais abaixo do <em>polígono</em>
   * @type {number}
   */
  get altura() {
    var minY = Number.MAX_VALUE;
    var maxY = Number.MIN_VALUE;
    for (var i = 0, j = this.pontos.length - 1; i < this.pontos.length; j = i++) {
      minY = Math.min(minY, this.pontos[i].y);
      maxY = Math.max(maxY, this.pontos[j].y);
    }
    return maxY - minY;
  }

  /**
    * Este método verifica se um dado <em>ponto</em> está contido na área deste <em>polígono</em>. Tal acontece quando um segmento de recta com início no ponto especificado intersecta um número ímpar de arestas do <em>polígono</em>.
    * @param {number} x Abscissa do ponto a testar se está contido neste <em>polígono</em>
    * @param {number} y Ordenada do ponto a testar se está contido neste <em>polígono</em>
    * @returns {boolean} Se o ponto estiver contido neste <em>polígono</em>, <code>true</code>; senão, <code>false</code>
    */
  contemPonto(x, y) {
    var contido = false;
    for (var i = 0, j = this.pontos.length - 1; i < this.pontos.length; j = i++) {
      var pontoI = { x: this.pontos[i].x + this.x, y: this.pontos[i].y + this.y };
      var pontoJ = { x: this.pontos[j].x + this.x, y: this.pontos[j].y + this.y };
      if (((pontoI.y > y) != (pontoJ.y > y)) && (x < (pontoJ.x - pontoI.x) * (y - pontoI.y) / (pontoJ.y - pontoI.y) + pontoI.x)) {
        contido = !contido;
      }
    }
    return contido;
  }

  /**
   * Centróide (<em>x</em> e <em>y</em>) deste <em>polígono</em>, tendo em conta apenas os pontos dos seus vértices &mdash; útil para o seu desenho com rotação
   * @type {{x: number, y: number}}
   */
  get centroide() {
    var somaX = 0;
    var somaY = 0;
    for (var i = 0; i < this.pontos.length; i++) {
      somaX += this.pontos[i].x;
      somaY += this.pontos[i].y;
    }
    var centroideX = Math.floor(somaX / this.pontos.length);
    var centroideY = Math.floor(somaY / this.pontos.length);
    return { x: centroideX, y: centroideY };
  }

  /**
   * Este método desenha um <em>polígono</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo de um <em>rectângulo</em> imaginário que contenha o <em>polígono</em>.
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
        for (var i = 0; i < this.pontos.length; i++) {
          if (i == 0) {
            contexto.moveTo(Math.floor(this.pontos[i].x - this.centroide.x), Math.floor(this.pontos[i].y - this.centroide.y));
          }
          else {
            contexto.lineTo(Math.floor(this.pontos[i].x - this.centroide.x), Math.floor(this.pontos[i].y - this.centroide.y));
          }
        }
      }
      else {
        for (var i = 0; i < this.pontos.length; i++) {
          if (i == 0) {
            contexto.moveTo(Math.floor(this.pontos[i].x + this.x), Math.floor(this.pontos[i].y + this.y));
          }
          else {
            contexto.lineTo(Math.floor(this.pontos[i].x + this.x), Math.floor(this.pontos[i].y + this.y));
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
 * @property {string} preenchimento Cor do preenchimento do <em>texto</em> &mdash; se a cor for especificada como <code>null</code>, o <em>texto</em> não é preenchido
 * @property {string} contorno Cor do contorno do <em>texto</em> &mdash; se a cor for especificada como <code>null</code>, o contorno não é desenhado
 * @property {number} espessura Espessura do contorno do <em>texto</em> &mdash; se a espessura tiver um valor igual ou inferior a zero (<code>0</code>), o contorno não é desenhado
 * @property {number} tamanho=16 Tamanho do <em>texto</em> em pontos (<code>pt</code)
 * @property {number} fonte="sans-serif" Fonte do <em>texto</em>
 * @property {number} alinhamento="left" Alinhamento horizontal do <em>texto</em>
 * @property {number} base="top" Alinhamento vertical do <em>texto</em>
 * @property {number} deltaX=0 Variação horizontal da posição do <em>texto</em>
 * @property {number} deltaY=0 Variação vertical da posição do <em>texto</em>
 * @property {number} distX=0 Distância horizontal até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>x</em> em relação à posição <em>x</em> do cursor do rato
 * @property {number} distY=0 Distância vertical até um dado ponto &mdash; pode ser usada, por exemplo, para guardar o <em>offset</em> do <em>y</em> em relação à posição <em>y</em> do cursor do rato
 * @property {number} angulo=0 Ângulo de rotação do <em>texto</em> quando desenhado no <code>canvas</code> &mdash; a rotação é feita tendo como referência o centro do <em>texto</em>
 * @property {number} gravidade=0 Força que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação vertical do <em>texto</em>, actuando como a <em>gravidade</em>
 * @property {number} velocidade=0 Velocidade que, quando usada em conjunto com o <em>ângulo</em>, pode ser utilizada para definir a variação horizontal e vertical do <em>texto</em>
 * @property {boolean} activo=true Indicação de que o <em>texto</em> deve testar colisões, quando chamado o método <code>colide(outro)</code>
 * @property {boolean} rotacao=false Indicação de que o <em>círculo</em> deve rodar, reflectindo o  seu <em>ângulo</em>
 * @property {boolean} visivel=true Indicação de que o <em>texto</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
 */
class Texto extends Grafico {
  /**
   * Construtor para criação de novos objectos do tipo <code>texto</code>
   * @param {number} x Abscissa para posicionar o <em>texto</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>texto</em> no <code>canvas</code>
   * @param {string} texto Conteúdo de <em>texto</em> a desenhar no <code>canvas</code>
   * @param {string} preenchimento="black" Cor do preenchimento do <em>texto</em>
   * @param {string} contorno="black" Cor do contorno do <em>texto</em>
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
    this.alinhamento = "left";
    this.base = "top";
  }

  /**
   * Largura do <em>texto</em> &mdash; sendo definida pelos píxeis ocupados pelo texto horizontalmente
   * @type {number}
   */
  get largura() {
    var tela = document.createElement("canvas");
    var contexto = tela.getContext("2d");
    contexto.font = this.altura + "px " + this.fonte;
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
   * Este método verifica se um dado <em>ponto</em> está contido na área de <em>rectângulo</em> que envolva o <em>texto</em>, definito pelo <em>ponto</em> que posiciona o texto e pela largura e pela altura do texto. Tal acontece quando o <em>x</em> do ponto se encontra compreendido entre o <em>x</em> do <em>rectângulo</em> e <em>x</em> mais a <em>largura</em> do <em>rectângulo</em>, e o <em>y</em> do ponto se encontra compreendido entre o <em>y</em> do <em>rectângulo</em> e <em>y</em> mais a <em>altura</em> do <em>rectângulo</em>.
   * @param {number} x Abscissa do ponto a testar se está contido neste <em>texto</em>
   * @param {number} y Ordenada do ponto a testar se está contido neste <em>texto</em>
   * @returns {boolean} Se o ponto estiver contido neste <em>texto</em>, <code>true</code>; senão, <code>false</code>
   */
  contemPonto(x, y) {
    return ((this.x <= x) && (this.x + this.largura > x) && (this.y <= y) && (this.y + this.altura > y));
  }

  /**
   * Este método desenha uma linha de <em>texto</em> no <code>canvas</code>, usando como referência de posicionamento o <em>ponto</em> correspondente ao canto superior esquerdo de um <em>rectângulo</em> imaginário que contenha o <em>texto</em>, assumindo um alinhamento horizontal à esquerda e verticalmente ao topo. Alterações no alinhamento implicarão uma outra referência no posicionamento.
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
      contexto.textAlign = this.alinhamento;
      contexto.textBaseline = this.base;
      contexto.font = this.tamanho + "pt " + this.fonte;
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
 * @property {boolean} rotacao=false Indicação de que o <em>círculo</em> deve rodar, reflectindo o  seu <em>ângulo</em>
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
   * Este método verifica se um dado <em>ponto</em> está contido na área ocupada por esta <em>imagem</em>. Tal acontece quando o <em>x</em> do ponto se encontra compreendido entre o <em>x</em> da <em>imagem</em> e <em>x</em> mais a <em>largura</em> da <em>imagem</em>, e o <em>y</em> do ponto se encontra compreendido entre o <em>y</em> da <em>imagem</em> e <em>y</em> mais a <em>altura</em> da <em>imagem</em>.
   * @param {number} x Abscissa do ponto a testar se está contido nesta <em>imagem</em>
   * @param {number} y Ordenada do ponto a testar se está contido nesta <em>imagem</em>
   * @returns {boolean} Se o ponto estiver contido nesta <em>imagem</em>, <code>true</code>; senão, <code>false</code>
   */
  contemPonto(x, y) {
    return ((this.x <= x) && (this.x + this.largura > x) && (this.y <= y) && (this.y + this.altura > y));
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
 * @extends Imagem
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
 * @property {boolean} rotacao=false Indicação de que o <em>círculo</em> deve rodar, reflectindo o  seu <em>ângulo</em>
 * @property {boolean} visivel=true Indicação de que o <em>sprite</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
  */class ImagemAnimada extends Imagem {
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
    super(x, y, imagem);
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
 * @extends Imagem
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
 * @property {boolean} rotacao=false Indicação de que o <em>círculo</em> deve rodar, reflectindo o  seu <em>ângulo</em>
 * @property {boolean} visivel=true Indicação de que o <em>filme</em> deve ser desenhado no <code>canvas</code>, quando chamado o método <code>desenha(tela)</code>
  */class ImagemFilme extends Imagem {
  /**
   * Construtor para criação de novos objectos do tipo <code>ImagemFilme</code>
   * @param {number} x Abscissa para posicionar o <em>filme</em> no <code>canvas</code>
   * @param {number} y Ordenada para posicionar o <em>filme</em> no <code>canvas</code>
   * @param {Filme} filme Objecto que representa o elemento <code>canvas</code> onde será desenhada o <em>filme</em>
   */
  constructor(x, y, filme) {
    super(x, y, filme);
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
 * Esta função desenha um <em>gráfico</em> ou percorre um <em>array</em> de <em>gráficos</em> (instâncias ou objectos de subclasses da classe <code>Grafico</code>) e desenha-os no <code>canvas</code> especificado. A função funciona de forma recursiva, pelo que o <em>array</em> pode conter, ele próprio, também <em>arrays</em> em qualquer das suas posições.
 * @param {Grafico} graficos Um <em>array</em> de <em>gráficos</em> ou mesmo apenas um único <em>gráfico</em>
 * @param {Tela} tela O <code>canvas</code> onde vão ser desenhados os <em>gráficos</em>
 */
function desenhaGraficos(graficos, tela) {
  for (var i = 0; i < graficos.length; i++) {
    if (Array.isArray(graficos[i])) {
      desenhaGraficos(graficos[i], tela);
    } else {
      graficos[i].desenha(tela);
    }
  }
}

//

/**
 * @class
 * @classdesc A classe <code>Tela</code> serve essencialmente como um envelope (<em>wrapper</em>) para elementos de <code>canvas</code>.
 * @property {HTMLElement} elemento O <em>elemento</em> HTML do tipo <code>canvas</code> a ser representado
 */
class Tela {
  /**
   * Construtor da classe <code>Tela</code>.
   * @param {HTMLElement} elemento O <em>elemento</em> HTML do tipo <code>canvas</code> a ser representado
   */
  constructor(elemento) {
    this.elemento = elemento;
  }

  /**
   * Contexto <strong>2D</strong> da <em>tela</em>, para acesso aos métodos nativamente disponibilizados pelo <code>canvas</code>
   * @type {number}
   */
  get contexto() {
    return this.elemento.getContext("2d");
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
   * Fonte (origem) do elemento multimédia (definição)
   * @type {string}
   */
  set fonte(ficheiro) {
    this.elemento.src = ficheiro;
  }

  /**
   * Fonte (origem) do elemento multimédia (obtenção)
   * @type {string}
   */
  get fonte() {
    return this.elemento.src;
  }

  /**
   * Duração da reprodução do elemento multimédia (obtenção)
   * @type {number}
   */
  get duracao() {
    return this.elemento.duration;
  }

  /**
   * Posição de reprodução do elemento multimédia (definição) &mdash; variando entre zero (<code>0</code>) e um (<code>1</code>)
   * @type {number}
   */
  set volume(volume) {
    this.elemento.volume = volume;
  }

  /**
    * Posição de reprodução do elemento multimédia (obtenção) &mdash; variando entre zero (<code>0</code>) e um (<code>1</code>)
    * @type {number}
    */
  get volume() {
    return this.elemento.volume;
  }

  /**
   * Posição de reprodução do elemento multimédia (definição)
   * @type {number}
   */
  set posicao(tempo) {
    this.elemento.currentTime = tempo;
  }

  /**
   * Posição de reprodução do elemento multimédia (obtenção)
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
