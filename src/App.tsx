import { caloricBasal } from "./components/caloricBasal";
import { imcCalc } from "./components/imcCalc";
export interface userFullDataInterface{
  peso:number;
  altura:number;
  idade:number;
  genero:string;
  objective:string;
  gastoCalorico:number;
}
export let userFullData:userFullDataInterface = {
  peso:0,
  altura:0,
  idade:0,
  genero:'',
  objective:'',
  gastoCalorico:0,
}

function App() {
  
  function handleSubmit(e:HTMLFormElement){
    const peso = document.querySelector("#peso") as HTMLInputElement;
    const altura = document.querySelector("#altura") as HTMLInputElement;
    const objective = document.querySelector("#objetivo") as HTMLSelectElement;
    const genFeminino = document.querySelector("#genFeminino") as HTMLInputElement;
    const genMasculino = document.querySelector("#genMasculino") as HTMLInputElement;
    const output = document.querySelector("#resultadoIMC") as HTMLDivElement;
    const idade = document.querySelector('#idade') as HTMLInputElement;
    e.preventDefault();
    userFullData.peso = parseFloat(peso.value);
    userFullData.altura = parseFloat(altura.value);
    userFullData.genero = genFeminino.checked ? genFeminino.value : genMasculino.value;
    userFullData.objective = objective.value;
    userFullData.idade = parseFloat(idade.value);
    caloricBasal();
    console.log(userFullData);
    
    output.innerHTML = `${imcCalc()}<br/>`;
    output.innerHTML+= `Seu objetivo é : ${userFullData.objective} <br/><br/>`
    output.innerHTML+= `Seu gasto calórico é de : ${userFullData.gastoCalorico.toFixed(2)}Kcal<br/>`

  }
  return (
    <div className="App">
      {/* @ts-ignore */}
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
          <input className="m-2" type="radio" id="genMasculino" name="gen" value={'masculino'}/>
        </div>
        <div className="m-2 flex flex-row">
          <label htmlFor="genMasculino">Feminino</label>
          <input className="m-2" type="radio" id="genFeminino" name="gen" value={'feminino'}/>
        </div>
        <button id="calcularImc" className="text-white bg-black m-2">Calcular</button>
      </form>
      <hr />
      <div id="resultadoIMC" className="m-2"></div>
    </div>
  )
}

export default App
