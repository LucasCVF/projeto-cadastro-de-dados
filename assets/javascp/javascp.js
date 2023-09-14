class Cadastro {
    constructor (nometitular, cpf, nomemae, nomepai, estadonascimento, estadocivil, nascimento){
        this.nometitular = nometitular
        this.cpf = cpf
        this.nomemae = nomemae
        this.nomepai = nomepai
        this.estadonascimento = estadonascimento
        this.estadocivil = estadocivil
        this.nascimento = nascimento
    }

    insercaoDados () {
        for(let atributo in this) {
            if(this[atributo] == undefined || this[atributo] == '' || this[atributo] == null){
               return false
            }
        } return true 
    }
    
}

class BancoDados {
    constructor (){
        let id = localStorage.getItem('id')
        
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoid = localStorage.getItem('id')
        return parseInt(proximoid) + 1
    }

    armazenarDados(dados){
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(dados))
        localStorage.setItem('id', id)
    }

    recuperaTodosCadastros(){
        let cadastros = Array()
        let idtotal = localStorage.getItem('id')
        //Recupera todas os cadastros em localStorage
        for(let id = 1; id <= idtotal; id ++ ){
            let cadastro = JSON.parse(localStorage.getItem(id))
            if(cadastro === null){
                continue
            }
            cadastro['id'] = id
            cadastros.push(cadastro)
        }
       
        return cadastros
    }

    filtrar(cadastro){
        let cadastrosFiltrados = Array()
        cadastrosFiltrados = this.recuperaTodosCadastros()  
        
        //console.log(cadastro)

        //console.log(cadastrosFiltrados)

        //Nome Titular
        if(cadastro.nometitular != ''){
            cadastrosFiltrados = cadastrosFiltrados.filter(valor => valor.nometitular == cadastro.nometitular)
        }
        //CPF
        if(cadastro.cpf != ''){
            cadastrosFiltrados = cadastrosFiltrados.filter(valor => valor.cpf == cadastro.cpf)
        }
        //Estado de Nascimento
        if(cadastro.estadonascimento != ''){
            cadastrosFiltrados = cadastrosFiltrados.filter(valor => valor.estadonascimento == cadastro.estadonascimento)
        }
        //Data de nascimento
        if(cadastro.nascimento != ''){
            cadastrosFiltrados = cadastrosFiltrados.filter(valor => valor.nascimento == cadastro.nascimento)
        }
        return cadastrosFiltrados
    }
    
}

let bancodados = new BancoDados()

let btnCadastro = document.getElementById('botaocadastro')

if(btnCadastro != null){
    btnCadastro.addEventListener('click', function(btn){
        btn.preventDefault()
        cadastrarDados()
    })
}



function cadastrarDados(){

    let nometitular = document.getElementById('nometitular')
    let cpf = document.getElementById('cpf')
    let nomemae = document.getElementById('nomemae')
    let nomepai = document.getElementById('nomepai')
    let estadonascimento = document.getElementById('estadonascimento')
    let estadocivil = document.getElementById('estadocivil')
    let nascimento = document.getElementById('nascimento')
    
    let cadastro = new Cadastro(
        nometitular.value,
        cpf.value,
        nomemae.value,
        nomepai.value,
        estadonascimento.value,
        estadocivil.value,
        nascimento.value
    )
   
   if (cadastro.insercaoDados()){
        bancodados.armazenarDados(cadastro)
        document.getElementById('modal_titulo').innerHTML = 'Cadastro inserido'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'O seu cadastro foi feito!'
        document.getElementById('modal_cor_botao').className = 'btn btn-success'
        document.getElementById('modal_cor_botao').innerHTML = 'Voltar'
        $('#cadastro').modal('show')

        nometitular.value = ''
        cpf.value = ''
        nomemae.value = ''
        nomepai.value = ''
        estadonascimento.value = ''
        estadocivil.value = ''
        nascimento.value = ''
   } else {
        document.getElementById('modal_titulo').innerHTML = 'Erro no cadastro'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Existem campos obrigatórios que não fora preenchidos'
        document.getElementById('modal_cor_botao').className = 'btn btn-danger'
        document.getElementById('modal_cor_botao').innerHTML = 'Voltar e corrigir'

        $('#cadastro').modal('show') 
   }
}

function consultaCadastro(cadastros = Array(), filtro = false){
    if(cadastros.length == 0 && filtro == false){
        cadastros = bancodados.recuperaTodosCadastros()
    }
    //console.log(cadastros)
    let listaCadastro = document.getElementById('listaCadastro')
    listaCadastro.innerHTML = ''
    
    cadastros.forEach(function(v, i){

        let linha = listaCadastro.insertRow()

        linha.insertCell(0).innerHTML = i +1
        linha.insertCell(1).innerHTML = v.nometitular
        linha.insertCell(2).innerHTML = v.nomepai
        linha.insertCell(3).innerHTML = v.nomemae
        linha.insertCell(4).innerHTML = v.estadonascimento
        linha.insertCell(5).innerHTML = v.estadocivil
        linha.insertCell(6).innerHTML = v.cpf
        linha.insertCell(7).innerHTML = v.nascimento
        linha.insertCell(8).innerHTML = '<button class="btn btn-danger btn-excluir" data-id="'+ v.id +'">Excluir</button>'
    })
    excluirCadastro()
}

function filtrarCadastros(){
    let load_filter = document.querySelector('.load-filter')
    load_filter.classList.remove('hide')

    let nometitular = document.getElementById('nometitular').value
    let cpf = document.getElementById('cpf').value
    let estadonascimento = document.getElementById('estadonascimento').value
    let nascimento = document.getElementById('nascimento').value
    
    let cadastro = new Cadastro (nometitular, cpf, undefined, undefined, estadonascimento,undefined, nascimento)

    let cadastros = bancodados.filtrar(cadastro)

    
    setTimeout(function(){
        this.consultaCadastro(cadastros, true)
        load_filter.classList.add('hide')
    }, 1000)
}

function excluirCadastro(){
    let btns = document.querySelectorAll('.btn-excluir')
    //console.log(btns)

    btns.forEach(function(btn){
        //console.log(btn)
        btn.addEventListener('click', function(btn){
            localStorage.removeItem(btn.target.dataset.id)

            btn.target.closest('tr').remove()
        })
    })
}

btnValidar = document.getElementById('botaoValidar')

if (btnValidar){
    btnValidar.addEventListener('click', function(){
        validacaoCadastro()
    })
}

function validacaoCadastro(){
    
    let validaNome = document.getElementById('validaNome').value
    let validaCpf = document.getElementById('validaCpf').value
    let validaUf = document.getElementById('validaUf').value
    let validaNascimento = document.getElementById('validaNascimento').value

    let listaValidar = document.getElementById('listaValidar')

    bancodados.recuperaTodosCadastros().forEach(function(v,i){ 
        if (v.nometitular == validaNome && v.cpf == validaCpf && v.estadonascimento == validaUf && v.nascimento == validaNascimento){

            if(validaCpf == v.cpf){
                bancodados.recuperaTodosCadastros()

                let linha = listaValidar.insertRow()

                linha.insertCell(0).innerHTML = i +1
                linha.insertCell(1).innerHTML = v.nometitular
                linha.insertCell(2).innerHTML = v.nomepai
                linha.insertCell(3).innerHTML = v.nomemae
                linha.insertCell(4).innerHTML = v.estadonascimento
                linha.insertCell(5).innerHTML = v.estadocivil
                linha.insertCell(6).innerHTML = v.cpf
                linha.insertCell(7).innerHTML = v.nascimento
                console.log('GG')
            } 
        } else {
            
            if(validaCpf === ''){
                listaValidar.innerHTML = '' 
                console.log('FF') 
            } 
        }
    })
}


