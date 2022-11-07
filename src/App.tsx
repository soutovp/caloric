import { caloricBasal } from "./components/caloricBasal";
import { imcCalc } from "./components/imcCalc";
import { macronutrientsCalc } from "./components/macronutrientsCalc";
export interface userFullDataInterface{
  peso:number;
  altura:number;
  idade:number;
  genero:string;
  objective:string;
  gastoCalorico:number;
  gProteina:number;
  gCarboidrato:number;
  gGordura:number;
  atividadeValue:number
}
export let userFullData:userFullDataInterface = {
  peso:0,
  altura:0,
  idade:0,
  genero:'',
  objective:'',
  gastoCalorico:0,
  gProteina:0,
  gCarboidrato:0,
  gGordura:0,
  atividadeValue:0,
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
    const atividade = document.querySelector('#atividade') as HTMLSelectElement;
    e.preventDefault();
    userFullData.peso = parseFloat(peso.value);
    userFullData.altura = parseFloat(altura.value);
    userFullData.genero = genFeminino.checked ? genFeminino.value : genMasculino.value;
    userFullData.objective = objective.value;
    userFullData.idade = parseFloat(idade.value);
    userFullData.atividadeValue = parseFloat(atividade.value);
    caloricBasal();
    macronutrientsCalc();

    
    output.innerHTML = `${imcCalc()}<br/>`;
    output.innerHTML+= `Seu objetivo é : ${userFullData.objective} <br/><br/>`
    output.innerHTML+= `Seu gasto calórico é de : ${(userFullData.gastoCalorico).toFixed(2)}Kcal<br/><br/>`
    output.innerHTML+= `Você deverá consumir para seu objetivo :<br/>Proteína : ${userFullData.gProteina}g<br/>Carboidrato: ${userFullData.gCarboidrato}g<br/>Gordura: ${userFullData.gGordura}g`

  }
  return (
    <div className="App">
      {/* @ts-ignore */}
      <form className="flex flex-col w-[80%] p-2 content-center m-auto" id="form" onSubmit={(e)=>handleSubmit(e)}>
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
        <p>Atividades</p>
        <p><b>Leve :</b> Atividades de casa, Trabalhar sentado, caminhar 1hr</p>
        <p><b>Moderada :</b> Incluí alguma atividade esportiva por até 1hr, Trabalhar em pé, fazer atividades de casa...</p>
        <p><b>Intensa :</b> Atividades de casa, Trabalhos mais ativos, caminhar mais de 1hr por dia, atividades esportivas...</p>
        <select id="atividade" className="border-solid border-2 border-black m-2">
          <option value={1.55}>Leve</option>
          <option value={1.84}>Moderada</option>
          <option value={2.2}>Intensa</option>
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
