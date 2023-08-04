$(document).ready(function () {
  cardapio.eventos.init();
});

var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {
  init: () => {
    cardapio.metodos.obterItensCardapio();
  },
};

cardapio.metodos = {
  //obtem a lista de itens do cardapio
  obterItensCardapio: (categoria = "burgers", vermais = false) => {
    var filtro = MENU[categoria];
    console.log(filtro);

    if (!vermais) {
      $("#itensCardapio").html("");
    }

    $.each(filtro, (i, e) => {
      let temp = cardapio.templates.item
        .replace(/\${img}/g, e.img)
        .replace(/\${nome}/g, e.name)
        .replace(/\${preco}/g, e.price.toFixed(2).replace(".", ","))
        .replace(/\${id}/g, e.id);

      if (vermais && i >= 8 && i < 12) {
        $("#itensCardapio").append(temp);
      }

      if (!vermais && i < 8) {
        $("#itensCardapio").append(temp);
        $("#btnVerMais").removeClass("hidden");
      }
    });

    //remove o ativo
    $(".container-menu a").removeClass("active");

    //seta o menu para ativo
    $("#menu-" + categoria).addClass("active");
  },

  //botão ver mais
  verMais: () => {
    var ativo = $(".container-menu a.active").attr("id").split("menu-")[1];
    cardapio.metodos.obterItensCardapio(ativo, true);

    $("#btnVerMais").addClass("hidden");
  },

  //diminuir quantidade do item
  diminuirQuantidade: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());

    if (qntdAtual > 0) {
      $("#qntd-" + id).text(qntdAtual - 1);
    }
  },

  //aumentar quantidade do item
  aumentarQuantidade: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());

    $("#qntd-" + id).text(qntdAtual + 1);
  },

  //adicionar ao carrinho
  adicionarAoCarrinho: (id) => {
    let qntdAtual = parseInt($("#qntd-" + id).text());

    if (qntdAtual > 0) {
      var categoria = $(".container-menu a.active")
        .attr("id")
        .split("menu-")[1];

      let filtro = MENU[categoria];

      let item = $.grep(filtro, (e, i) => {
        return e.id == id;
      });

      if (item.length > 0) {
        let existe = $.grep(MEU_CARRINHO, (elem, index) => {
          return elem.id == id;
        });

        if (existe.length > 0) {
          let objIndex = MEU_CARRINHO.findIndex((obj) => obj.id == id);
          MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
        } else {
          item[0].qntd = qntdAtual;
          MEU_CARRINHO.push(item[0]);
        }

        cardapio.metodos.mensagem("Item adicionado ao carrinho.", "green");
        $("#qntd-" + id).text(0);

        cardapio.metodos.atualizarBadgeTotal();
      }
    }
  },

  //Atualiza o badge de totais dos botoes "Meu carrinho"
  atualizarBadgeTotal: () => {
    var total = 0;

    $.each(MEU_CARRINHO, (i, e) => {
      total += e.qntd;
    });

    if (total > 0) {
      $(".botao-carrinho").removeClass("hidden");
      $(".container-total-carrinho").removeClass("hidden");
    } else {
      $(".botao-carrinho").addClass("hidden");
      $(".container-total-carrinho").addClass("hidden");
    }

    $(".badge-total-carrinho").html(total);
  },

  abrirCarrinho: (abrir) => {
    if (abrir) {
      $("#modal-carrinho").removeClass("hidden");
    } else {
      $("#modal-carrinho").addClass("hidden");
    }
  },

  mensagem: (texto, cor = "red", tempo = 3500) => {
    let id = Math.floor(Date.now() * Math.random()).toString();

    let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

    $("#container-mensagens").append(msg);

    setTimeout(() => {
      $("#msg-" + id).removeClass("fadeInDown");
      $("#msg-" + id).addClass("fadeOutUp");
      setTimeout(() => {
        $("#msg-" + id).remove();
      }, 800);
    }, tempo);
  },
};

cardapio.templates = {
  item: `
    <div class="col-3 mb-5">
      <div class="card card-item" id="\${id}">
        <div class="img-produto">
            <img
            src="\${img}"
            alt=""
            />
        </div>
        <p class="title-produto text-center mt-4">
            <b>\${nome}</b>
        </p>
        <p class="price-produto text-center">
            <b>R$ \${preco}</b>
        </p>
        <dic class="add-carrinho">
            <span 
              class="btn-menos" 
              onclick="cardapio.metodos.diminuirQuantidade('\${id}')">
              <i class="fas fa-minus"></i>
            </span>
            <span 
              class="add-numero-itens" 
              id="qntd-\${id}">
              0
            </span>
            <span 
              class="btn-mais" 
              onclick="cardapio.metodos.aumentarQuantidade('\${id}')">
                <i class="fas fa-plus"></i>
            </span>
            <span 
              class="btn btn-add" 
              onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')">
                <i class="fa fa-shopping-bag"></i>
            </span>
        </dic>
     </div>
  </div>
    `,
};
