function App() {
  function handleSubmit(e:HTMLFormElement){
    const peso = document.querySelector("#peso") as HTMLInputElement;
    const altura = document.querySelector("#altura") as HTMLInputElement;
    e.preventDefault();
    const p = parseFloat(peso.value);
    const a = parseFloat(altura.value);
    const imc = parseFloat((p/(a*a)).toFixed(2))
    let resultado = '';
    
    switch(true){
      case imc < 18.5:
        resultado = 'Abaixo do peso normal';
        break;
      case imc >= 18.5 && imc < 25:
        resultado = 'Peso normal';
        break;
      case imc >= 25.0 && imc < 30:
        resultado = 'Excesso de peso';
        break;
      case imc >= 30.0 && imc < 35:
        resultado = 'Obesidade grau 1';
        break;
      case imc >= 35.0 && imc < 40:
        resultado = 'Obesidade grau 2';
        break;
      case imc > 40.0:
        resultado = 'Obesidade grau 3';
        break;
      default:
        resultado = 'Não foi possível entender uma categoria!';
        break;
    }
    const output = document.querySelector("#resultadoIMC") as HTMLDivElement;
    output.innerHTML = resultado;
  }
  return (
    <div className="App">
      <form className="flex flex-col w-[25%] p-2" id="form" onSubmit={(e)=>handleSubmit(e)}>
        <label htmlFor="peso">Peso</label>
        <input type="number" id="peso" min={0} max={150} step="any" className="border-solid border-2 border-black m-2"/>
        <label htmlFor="altura">Altura</label>
        <input type="number" min={0} max={3} step="any" id="altura" className="border-solid border-2 border-black m-2"/>
        <button id="calcularImc" className="text-white bg-black m-2">Calcular</button>
      </form>
      <hr />
      <div id="resultadoIMC" className="m-2"></div>
    </div>
  )
}

export default App
