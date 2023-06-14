import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderForm = () => {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [quantidadeGas, setQuantidadeGas] = useState(0);
  const [quantidadeAgua, setQuantidadeAgua] = useState(0);
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [total, setTotal] = useState(0);
  const [troco, setTroco] = useState('');
  const [cidade, setCidade] = useState('');
  const [referencia, setReferencia] = useState('');

  useEffect(() => {
    document.title = "Gás Jardim";
    const gasTotal = quantidadeGas * 100;
    const aguaTotal = quantidadeAgua * 50;

    let novoTotal = gasTotal + aguaTotal;

    if (metodoPagamento === 'Cartão') {
      novoTotal *= 1.05; // Incrementa 5% no total se o método de pagamento for cartão
    }

    setTotal(novoTotal);
  }, [quantidadeGas, quantidadeAgua, metodoPagamento]);

  const buscarEnderecoPorCep = async () => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data;
      const enderecoCidadeUF = `${localidade} - ${uf}`;
      const enderecoLogradouro = logradouro ? `${logradouro}, ${bairro}` : '';
      setCidade(enderecoCidadeUF);
      setEndereco(enderecoLogradouro);
    } catch (error) {
      console.log('Erro ao buscar o endereço:', error);
      alert('CEP não encontrado');
    }
  };

  const isTrocoValido = () => {
    if (metodoPagamento === 'Dinheiro') {
      const trocoFloat = parseFloat(troco);
      const totalFloat = parseFloat(total);
      if (trocoFloat < totalFloat) {
        alert('Valor para troco não pode ser menor que o total do pedido!');
        return false;
      }
    }
    return true;
  };

const novoTotalFinal = () => {
let novoTotal2 = total * 1;
  setTotal(novoTotal2);
};

  const enviarPedidoWhatsApp = () => {
    if (!isTrocoValido()) {
      return;
    }
    let mensagem = `*NOVO PEDIDO*\n\n*Nome:* ${nome}\n*Cidade:* ${cidade}\n*Endereço:* ${endereco}. *Número:* ${numero}\n*Complemento:* ${complemento}\n*Referência:* ${referencia}\n*Quantidade de Gás:* ${quantidadeGas}\n*Método de Pagamento:* ${metodoPagamento}\n*Total:* R$ ${total.toFixed(2)}`;
  
    if (metodoPagamento === 'Dinheiro' && troco) {
      mensagem += `\n*Valor para troco:* R$ ${troco}`;
    }
  
    const numeroTelefone = '+5516988650120'; // Substitua pelo número de telefone desejado
  
    const url = `https://api.whatsapp.com/send?phone=${numeroTelefone}&text=${encodeURIComponent(mensagem)}`;
  
    try {
      window.open(url);
    } catch (error) {
      window.location.href = url;
    }

    setNome('');
    setEndereco('');
    setQuantidadeGas(0);
    setQuantidadeAgua(0);
    setMetodoPagamento('');
    setTotal(0);
    setTroco('');
    setCep('');
    setNumero('');
    setComplemento('');
    setCidade('');
    setReferencia('');
  };
  
  return (
      <div style={styles.container}>
      <div>
        <img style={styles.imagem} src={require('./assets/logogasjardim.png')} alt="Logo" />
      </div>
      <div style={styles.formContainer}>
        <div style={styles.divTituloInicial}><text style={styles.tituloInicial}><strong>Faça seu pedido</strong></text></div>
        <input
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <div style={styles.searchContainer}>
          <input
            style={styles.cepInput}
            placeholder="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            type="number"
          />
          <button style={styles.searchButton} onClick={buscarEnderecoPorCep}>
            Buscar
          </button>
        </div>
        <input
          style={styles.input}
          placeholder="Cidade - UF"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />
        <div style={styles.endereconumero}>
        <input
          style={styles.inputendereco}
          placeholder="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
        />
        <input
          style={styles.inputnumero}
          placeholder="Número"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          type="number"
        />
        </div>
        <input
          style={styles.input}
          placeholder="Complemento"
          value={complemento}
          onChange={(e) => setComplemento(e.target.value)}
        />
          <input
          style={styles.input}
          placeholder="Ponto de referência"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
        />
        <div style={styles.containerCentral}>
        <div style={styles.quantityContainer}>
          <span style={styles.label}>Quantidade Gás</span>
          <div style={styles.quantityButtons}>
            <button
              style={styles.button}
              onClick={() => {setQuantidadeGas(quantidadeGas > 0 ? quantidadeGas - 1 : 0);novoTotalFinal()}}
            >
              -
            </button>
            <span style={styles.quantityText}>{quantidadeGas}</span>
            <button style={styles.button} onClick={() => {setQuantidadeGas(quantidadeGas + 1);novoTotalFinal()}}>
              +
            </button>
          </div>
        </div>
        
        <div style={styles.paymentMethodContainer}>
          <span style={styles.paymentMethodLabel}>Método de Pagamento</span>
          <div style={styles.paymentMethodButtons}>
            <button
              style={
                metodoPagamento === 'Dinheiro'
                  ? { ...styles.paymentMethodButton, ...styles.activePaymentMethodButton }
                  : styles.paymentMethodButton
              }
              onClick={() => setMetodoPagamento('Dinheiro')}
            >
              Dinheiro
            </button>
            <button
              style={
                metodoPagamento === 'Pix'
                  ? { ...styles.paymentMethodButton, ...styles.activePaymentMethodButton }
                  : styles.paymentMethodButton
              }
              onClick={() => setMetodoPagamento('Pix')}
            >
              Pix
            </button>
            <button
              style={
                metodoPagamento === 'Cartão'
                  ? { ...styles.paymentMethodButton, ...styles.activePaymentMethodButton }
                  : styles.paymentMethodButton
              }
              onClick={() => setMetodoPagamento('Cartão')}
            >
              Cartão (+5%)
            </button>
          </div>
        </div>
        {metodoPagamento === 'Dinheiro' && (
          <div style={styles.trocoContainer}>
            <span style={styles.trocoLabel}>Troco para</span>
            <input
              style={styles.trocoInput}
              type="number"
              min="0"
              step="10"
              placeholder="Troco"
              value={troco}
              onChange={(e) => setTroco(e.target.value)}
            />
          </div>
        )}
        </div>
        <div>
          <span style={styles.totalLabel}><h2><strong>Total: R$ {total.toFixed(2)}</strong></h2></span>
        </div>
        <button style={{ ...styles.buttonContainer, margin: '0 20%' }} onClick={enviarPedidoWhatsApp}>
          <strong>Enviar Pedido</strong>
        </button>
      </div>
    </div>
  );
};

const styles = {
  containerCentral: {
    display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
      },
  imagem: {
    width: 300,
    height: 'auto',
    paddingTop: '0%'
  },
  divTituloInicial: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    textAlign: 'center',
    marginBottom: '18px'
  },
  tituloInicial: {
    fontSize: 26,
    color: '#3f3f3f'
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: '5%',
    marginTop: '5px',
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.8)',
    width: 'auto',
  },
  input: {
    width: '100%',
    height: '40px',
    margin: '0 -7px',
    marginBottom: '8px',
    paddingLeft: '5px',
    paddingRight: '10px',
    borderColor: '#ccc',
    borderWidth: '1px',
    borderRadius: '5px',
    paddingHorizontal: '10px',
    fontSize: '15px',
  },
  inputnumero: {
    width: '25%',
    height: '40px',
    margin: '0 -7px',
    marginBottom: '8px',
    paddingLeft: '5px',
    paddingRight: '10px',
    borderColor: '#ccc',
    borderWidth: '1px',
    borderRadius: '5px',
    paddingHorizontal: '10px',
    fontSize: '15px',
  },
  inputendereco: {
    width: '75%',
    height: '40px',
    margin: '0 -7px',
    marginBottom: '8px',
    paddingLeft: '5px',
    paddingRight: '10px',
    borderColor: '#ccc',
    borderWidth: '1px',
    borderRadius: '5px',
    paddingHorizontal: '10px',
    fontSize: '15px',
    marginRight: 16
  },
  endereconumero: {
    display: 'flex',
    marginBottom: '8px',
  },
  cepInput: {
    width: '100%',
    height: '40px',
    margin: '0 -7px',
    marginBottom: '-2px',
    marginRight: '10px',
    paddingLeft: '10px',
    paddingRight: '10px',
    fontSize: '15px',
    borderColor: '#ccc',
    borderWidth: '1px',
    borderRadius: '5px',
  },
  quantityContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '20px',
    marginTop: '10px'
   },
  label: {
    marginRight: '10px',
    fontSize: '20px',
  },
  quantityButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '0%'
  },
  button: {
    width: '30px',
    height: '30px',
    backgroundColor: '#1E90FF',
    borderRadius: '15px',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 5px',
    border: 'none',
    color: 'white',
    fontSize: '18px',
    cursor: 'pointer',
  },
  quantityText: {
    fontSize: '18px',
    margin: '0 10px',
  },
  paymentMethodContainer: {
    marginBottom: '10px',
    textAlign: 'center',
  },
  paymentMethodLabel: {
    marginRight: '10px',
      textDecoration: 'underline',
      },
  paymentMethodButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 13,
  },
  paymentMethodButton: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: 'none',
    marginRight: '10px',
    fontSize: 16,
    cursor: 'pointer',
  },
  activePaymentMethodButton: {
    backgroundColor: '	#1E90FF',
    color: 'white',
    cursor: 'pointer',
  },
  trocoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10px',
    marginTop: '10px',
    width: '70%',
  },
  trocoLabel: {
    marginRight: '10px',
  },
  trocoInput: {
    width: '100%',
    height: '40px',
    marginBottom: '10px',
    paddingLeft: '10px',
    borderColor: '#ccc',
    borderWidth: '1px',
    borderRadius: '5px',
    paddingHorizontal: '10px',
    fontSize: '15px',
  },
  totalLabel: {
    marginBottom: '10px',
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '	#1E90FF',
    color: 'white',
    borderRadius: '5px',
    border: 'none',
    padding: '10px',
    width: '60%',
    fontSize: '18px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
   searchButton: {
    backgroundColor: '	#1E90FF',
    color: 'white',
    border: 'none',
    padding: '11px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '-5px',
    marginRight: '-9px',
    marginTop: '-3px'
  },
};

export default OrderForm;
