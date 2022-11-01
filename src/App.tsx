function App() {
  const fullData = {
    peso:Number(),
    altura:Number(),
    idade:Number(),
    genero:String(),
  }
  function handleSubmit(e:HTMLFormElement){
    const peso = document.querySelector("#peso") as HTMLInputElement;
    const altura = document.querySelector("#altura") as HTMLInputElement;
    const objective = document.querySelector("#objetivo") as HTMLSelectElement;
    fullData.peso = parseFloat(peso.value);
    e.preventDefault();
    const p = parseFloat(peso.value);
    const a = parseFloat(altura.value);
    const imc = parseFloat((p/(a*a)).toFixed(2))
    let resultado = '';
    let proteina:number,gordura:number,carboidrato:number;
    
    switch(true){
      case imc < 18.5:
        resultado = 'Abaixo do peso normal <br/> Recomendamos uma dieta de ganho de peso!';
        break;
      case imc >= 18.5 && imc < 25:
        resultado = 'Você está no peso normal.';
        break;
      case imc >= 25.0 && imc < 30:
        resultado = 'Excesso de peso <br/> Recomendamos uma dieta de perda de peso caso tenha excesso de gordura corporal.';
        break;
      case imc >= 30.0 && imc < 35:
        resultado = 'Obesidade grau 1 <br/> Recomendamos uma dieta de perda de peso.';
        break;
      case imc >= 35.0 && imc < 40:
        resultado = 'Obesidade grau 2 <br/> Recomendamos uma dieta de perda de peso.';
        break;
      case imc > 40.0:
        resultado = 'Obesidade grau 3 <br/> Recomendamos uma dieta de perda de peso.';
        break;
      default:
        resultado = 'Não foi possível entender uma categoria!';
        break;
    }
    const output = document.querySelector("#resultadoIMC") as HTMLDivElement;
    output.innerHTML = resultado+'<br/>';
    output.innerHTML+= `Seu objetivo é : ${objective.value} <br/><br/>`

    if(objective.value === "manter"){
      output.innerHTML+= `Proteina é : valor`
    }

  }
  return (
    <div className="App">
      <form className="flex flex-col w-[25%] p-2" id="form" onSubmit={(e)=>handleSubmit(e)}>
        <label htmlFor="peso">Peso</label>
        <input type="number" id="peso" min={0} max={150} step="any" className="border-solid border-2 border-black m-2"/>
        <label htmlFor="altura">Altura</label>
        <input type="number" min={0} max={3} step="any" id="altura" className="border-solid border-2 border-black m-2"/>
        <label htmlFor="objetivo">Objetivo</label>
        <select id="objetivo" className="border-solid border-2 border-black m-2">
          <option value="ganho">Ganho de Massa</option>
          <option value="perda">Perda de Peso</option>
          <option value="manter">Manter o Peso</option>
        </select>
        <label htmlFor="idade">Qual a sua Idade?</label>
        <input type="number" placeholder="Escreve sua idade" name="idade" id="idade" className="border-solid border-2 border-black m-2 w-[20%] text-center"/>
        <div className="m-2 flex flex-row">
          <label htmlFor="genMasculino">Masculino</label>
          <input className="m-2" type="radio" id="genMasculino" name="gen"/>
        </div>
        <div className="m-2 flex flex-row">
          <label htmlFor="genMasculino">Feminino</label>
          <input className="m-2" type="radio" id="genFeminino" name="gen"/>
        </div>
        <button id="calcularImc" className="text-white bg-black m-2">Calcular</button>
      </form>
      <hr />
      <div id="resultadoIMC" className="m-2"></div>
    </div>
  )
}

export default App
